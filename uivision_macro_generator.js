// UI.Vision Macro Generator Script
// Usage: run this script from the browser console on the form page you want to automate.
// The script prints a macro JSON string compatible with UI.Vision RPA and tries to copy it to the clipboard.
(function () {
  /**
   * Check if an element is visible, attached to DOM, and interactive.
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function isVisibleAndActive(element) {
    if (!element || !element.isConnected) return false;
    if (element.hidden || element.disabled || element.readOnly) return false;
    if (element.offsetParent === null) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    return true;
  }

  /**
   * Return today's date string in yyyy/MM/dd format.
   * @returns {string}
   */
  function todayString() {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  /**
   * Return a string of repeated 9 characters.
   * @param {number} length
   * @returns {string}
   */
  function repeat9(length) {
    return '9'.repeat(Math.max(0, length));
  }

  /**
   * Generate a random Japanese style telephone number.
   * @returns {string}
   */
  function randomPhone() {
    const mid = String(Math.floor(Math.random() * 9000) + 1000);
    const last = String(Math.floor(Math.random() * 9000) + 1000);
    return `090-${mid}-${last}`;
  }

  /**
   * Generate a random looking email address.
   * @returns {string}
   */
  function randomEmail() {
    const randomPart = String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
    return `${randomPart}@example.com`;
  }

  /**
   * Generate a postal code in 999-9999 format.
   * @returns {string}
   */
  function randomPostalCode() {
    const front = String(Math.floor(Math.random() * 900) + 100);
    const back = String(Math.floor(Math.random() * 9000) + 1000);
    return `${front}-${back}`;
  }

  /**
   * Escape CSS identifier portions.
   * @param {string} value
   * @returns {string}
   */
  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }
    return value
      .replace(/[\u0000-\u001f\u007f-\u009f]/g, (ch) => `\\${ch.charCodeAt(0).toString(16).padStart(2, '0')} `)
      .replace(/(^-?\d)|^--|[^\w-]/g, (ch) => `\\${ch}`);
  }

  /**
   * Escape double quotes for attribute selectors.
   * @param {string} value
   * @returns {string}
   */
  function escapeAttributeValue(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  /**
   * Build a locator string (CSS or XPath) for the given element.
   * @param {HTMLElement} element
   * @returns {string}
   */
  function buildLocator(element) {
    if (element.id) {
      return `css=#${cssEscape(element.id)}`;
    }
    if (element.name) {
      return `css=[name="${escapeAttributeValue(element.name)}"]`;
    }

    const segments = [];
    let current = element;
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.documentElement) {
      const tag = current.tagName.toLowerCase();
      let index = 1;
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index += 1;
        }
        sibling = sibling.previousElementSibling;
      }
      const segment = index > 1 ? `${tag}:nth-of-type(${index})` : tag;
      segments.unshift(segment);
      current = current.parentElement;
    }
    return `css=${segments.join(' > ')}`;
  }

  /**
   * Determine the default value to use for an element.
   * @param {HTMLElement} element
   * @returns {string}
   */
  function computeValue(element) {
    const tag = element.tagName.toLowerCase();
    const type = (element.getAttribute('type') || '').toLowerCase();
    const name = (element.getAttribute('name') || '').toLowerCase();
    const id = (element.getAttribute('id') || '').toLowerCase();
    const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
    const placeholder = (element.getAttribute('placeholder') || '').toLowerCase();
    const identifier = `${name} ${id} ${ariaLabel} ${placeholder}`;

    if (/date|birth/.test(identifier)) {
      return todayString();
    }
    if (/tel|fax/.test(identifier)) {
      return randomPhone();
    }
    if (/mail/.test(identifier)) {
      return randomEmail();
    }
    if (/zip|yubin/.test(identifier)) {
      return randomPostalCode();
    }

    if (tag === 'input' || tag === 'textarea') {
      const maxLengthAttr = element.getAttribute('maxlength');
      if (maxLengthAttr) {
        const max = parseInt(maxLengthAttr, 10);
        if (!Number.isNaN(max) && max > 0) {
          return max === 10 ? todayString() : repeat9(max);
        }
      }
      return repeat9(100);
    }

    return '';
  }

  const commands = [];
  commands.push({ Command: 'open', Target: window.location.href, Value: '' });

  const radioGroupsHandled = new Set();
  const elements = Array.from(document.querySelectorAll('input, textarea, select'));

  elements.forEach((element) => {
    if (!isVisibleAndActive(element)) return;

    const tag = element.tagName.toLowerCase();
    const type = (element.getAttribute('type') || '').toLowerCase();
    const locator = buildLocator(element);

    if (tag === 'textarea' || type === 'text' || type === '' || type === 'search' || type === 'url' || type === 'email' || type === 'tel') {
      const value = computeValue(element);
      commands.push({ Command: 'type', Target: locator, Value: value });
      return;
    }

    if (tag === 'select') {
      const options = Array.from(element.options);
      const selectable = options.find((option) => option.value !== '');
      if (selectable) {
        const optionValue = selectable.value;
        const value = `value=${optionValue}`;
        commands.push({ Command: 'select', Target: locator, Value: value });
      }
      return;
    }

    if (type === 'radio') {
      const groupName = element.getAttribute('name') || element.id;
      if (groupName && radioGroupsHandled.has(groupName)) return;
      commands.push({ Command: 'click', Target: locator, Value: '' });
      if (groupName) radioGroupsHandled.add(groupName);
      return;
    }

    if (type === 'checkbox') {
      commands.push({ Command: 'check', Target: locator, Value: '' });
    }
  });

  const macro = {
    Name: `Autofill ${document.title || 'Macro'}`,
    CreationDate: new Date().toISOString(),
    Commands: commands,
  };

  const macroJson = JSON.stringify(macro, null, 2);
  console.log('Generated UI.Vision macro JSON. Paste it into a new macro in the UI.Vision extension.');
  console.log(macroJson);

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(macroJson).then(() => {
      console.log('Macro JSON copied to clipboard.');
    }).catch(() => {
      console.warn('Could not copy macro JSON to clipboard; copy it manually from the console output.');
    });
  }

  return macro;
})();
