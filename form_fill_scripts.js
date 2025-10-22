// Edge Recorder / Browser Console Script
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
    if (style.display === 'none' || style.visibility === 'hidden') return false;
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

  const today = todayString();
  const radioGroupsHandled = new Set();
  const elements = Array.from(document.querySelectorAll('input, textarea, select'));

  elements.forEach((element) => {
    if (!isVisibleAndActive(element)) return;

    const tag = element.tagName.toLowerCase();
    const type = (element.getAttribute('type') || '').toLowerCase();
    const name = (element.getAttribute('name') || '').toLowerCase();
    const id = (element.getAttribute('id') || '').toLowerCase();
    const identifier = `${name} ${id}`;

    if (tag === 'textarea' || type === 'text' || type === '' || type === 'search' || type === 'url' || type === 'email' || type === 'tel') {
      let value = '';
      if (/date|birth/.test(identifier)) {
        value = today;
      } else if (/tel|fax/.test(identifier)) {
        value = randomPhone();
      } else if (/mail/.test(identifier)) {
        value = randomEmail();
      } else if (/zip|yubin/.test(identifier)) {
        value = randomPostalCode();
      } else {
        const maxLengthAttr = element.getAttribute('maxlength');
        if (maxLengthAttr) {
          const max = parseInt(maxLengthAttr, 10);
          if (!Number.isNaN(max)) {
            value = max === 10 ? today : repeat9(max);
          }
        }
        if (!value) {
          value = repeat9(100);
        }
      }
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    if (tag === 'select') {
      const options = Array.from(element.options);
      const selectable = options.find((option) => option.value !== '');
      if (selectable) {
        element.value = selectable.value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    if (type === 'radio') {
      const groupName = element.getAttribute('name') || element.id;
      if (groupName && radioGroupsHandled.has(groupName)) return;
      if (!element.checked) {
        element.checked = true;
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (groupName) radioGroupsHandled.add(groupName);
      return;
    }

    if (type === 'checkbox') {
      if (!element.checked) {
        element.checked = true;
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });
})();

// Playwright (Node.js) Script
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(`
    <html>
      <body>
        <form>
          <input type="text" id="fullName" name="fullName" />
          <input type="text" id="birthDate" name="birthDate" />
          <input type="text" id="contactTel" name="contactTel" />
          <input type="text" id="contactMail" name="contactMail" />
          <input type="text" id="zipCode" name="zipCode" maxlength="7" />
          <textarea id="remarks" name="remarks"></textarea>
          <select id="country" name="country">
            <option value="">Select</option>
            <option value="JP">Japan</option>
            <option value="US">United States</option>
          </select>
          <div>
            <label><input type="radio" name="gender" value="male" /> Male</label>
            <label><input type="radio" name="gender" value="female" /> Female</label>
          </div>
          <label><input type="checkbox" name="terms" /> Accept Terms</label>
        </form>
      </body>
    </html>
  `);

  await page.evaluate(() => {
    function isVisibleAndActive(element) {
      if (!element || !element.isConnected) return false;
      if (element.hidden || element.disabled || element.readOnly) return false;
      if (element.offsetParent === null) return false;
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      return true;
    }

    function todayString() {
      const now = new Date();
      const year = String(now.getFullYear());
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }

    function repeat9(length) {
      return '9'.repeat(Math.max(0, length));
    }

    function randomPhone() {
      const mid = String(Math.floor(Math.random() * 9000) + 1000);
      const last = String(Math.floor(Math.random() * 9000) + 1000);
      return `090-${mid}-${last}`;
    }

    function randomEmail() {
      const randomPart = String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
      return `${randomPart}@example.com`;
    }

    function randomPostalCode() {
      const front = String(Math.floor(Math.random() * 900) + 100);
      const back = String(Math.floor(Math.random() * 9000) + 1000);
      return `${front}-${back}`;
    }

    const today = todayString();
    const radioGroupsHandled = new Set();
    const elements = Array.from(document.querySelectorAll('input, textarea, select'));

    elements.forEach((element) => {
      if (!isVisibleAndActive(element)) return;

      const tag = element.tagName.toLowerCase();
      const type = (element.getAttribute('type') || '').toLowerCase();
      const name = (element.getAttribute('name') || '').toLowerCase();
      const id = (element.getAttribute('id') || '').toLowerCase();
      const identifier = `${name} ${id}`;

      if (tag === 'textarea' || type === 'text' || type === '' || type === 'search' || type === 'url' || type === 'email' || type === 'tel') {
        let value = '';
        if (/date|birth/.test(identifier)) {
          value = today;
        } else if (/tel|fax/.test(identifier)) {
          value = randomPhone();
        } else if (/mail/.test(identifier)) {
          value = randomEmail();
        } else if (/zip|yubin/.test(identifier)) {
          value = randomPostalCode();
        } else {
          const maxLengthAttr = element.getAttribute('maxlength');
          if (maxLengthAttr) {
            const max = parseInt(maxLengthAttr, 10);
            if (!Number.isNaN(max)) {
              value = max === 10 ? today : repeat9(max);
            }
          }
          if (!value) {
            value = repeat9(100);
          }
        }
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }

      if (tag === 'select') {
        const options = Array.from(element.options);
        const selectable = options.find((option) => option.value !== '');
        if (selectable) {
          element.value = selectable.value;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return;
      }

      if (type === 'radio') {
        const groupName = element.getAttribute('name') || element.id;
        if (groupName && radioGroupsHandled.has(groupName)) return;
        if (!element.checked) {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (groupName) radioGroupsHandled.add(groupName);
        return;
      }

      if (type === 'checkbox') {
        if (!element.checked) {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  });

  await browser.close();
})();
