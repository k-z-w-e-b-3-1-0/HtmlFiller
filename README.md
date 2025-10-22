# HtmlFiller

HtmlFiller collects small utilities that speed up demoing or testing HTML forms by automatically filling reasonable sample values. The snippets cover three different automation surfaces so that you can choose the tool that best fits your workflow.

## What's included

- **Browser console snippet** – A self-contained function that can be pasted into any Chromium-based browser console (Edge Recorder compatible) to auto-populate common input controls.
- **Playwright sample** – A Node.js script that spins up Chromium, loads a demo form, and applies the same filling heuristics for end-to-end tests.
- **UI.Vision macro generator** – A browser-console helper that inspects the current page and produces a ready-to-import UI.Vision RPA macro JSON using the same field detection rules.

## Usage

### Browser console snippet
1. Open the target form in your browser.
2. Copy the "Edge Recorder / Browser Console Script" block from [`form_fill_scripts.js`](form_fill_scripts.js).
3. Paste it into the browser console and press <kbd>Enter</kbd>.
4. The script scans visible inputs, selects the most suitable value (date, phone, email, postal code, or placeholder text), and fires the usual `input` and `change` events so reactive frameworks pick up the update.

### Playwright sample
1. Ensure Node.js and npm are installed.
2. Create a project and install Playwright:
   ```bash
   npm init -y
   npm install playwright
   ```
3. Copy the "Playwright (Node.js) Script" block from [`form_fill_scripts.js`](form_fill_scripts.js) into a file such as `playwright_script.js`.
4. Execute the script to launch Chromium and watch the sample form fill in automatically:
   ```bash
   node playwright_script.js
   ```

### UI.Vision macro generator
1. Install the [UI.Vision RPA extension](https://ui.vision/) and open the form you want to automate.
2. Copy the contents of [`uivision_macro_generator.js`](uivision_macro_generator.js) and run it from the browser console on that page.
3. The script logs the generated macro JSON (and attempts to copy it to the clipboard). Save this JSON into a new UI.Vision macro.
4. Run the macro in UI.Vision; it replays the same filling logic (`type`, `select`, `check`, or `click`) using XPath/CSS selectors chosen for each element.

The three variants share the same heuristics:
- Date-related fields receive today's date in `yyyy/MM/dd` format.
- Telephone fields get Japanese-style numbers (`090-XXXX-XXXX`).
- Email fields use `xxxxxxxx@example.com` dummy addresses.
- Postal-code fields receive `999-9999`-style numbers.
- Other text inputs fall back to repeating `9` up to the declared `maxlength` (or 100 characters).
- Radio groups select the first available option; checkboxes are checked; selects choose the first option with a value.

## Japanese documentation
詳しい日本語の手順は [`README.ja.md`](README.ja.md) を参照してください。

## License
MIT
