# A1 Jobs Autofill extension

Companion Chrome extension for the local `apps/a1-jobs` workspace.

## Install locally

1. Open `chrome://extensions`.
2. Enable developer mode.
3. Choose **Load unpacked** and select `apps/a1-jobs-extension`.
4. Click the A1 Jobs toolbar icon to open the persistent side panel.
5. Reload the extension after manifest or side-panel changes.

## Flow

The side panel has three tabs:

- **Job page** starts blank. Click **Scan page** to read the active logged-in posting/application page from the browser DOM and send it into A1 Jobs as a new job. The side panel stays open while A1 Jobs imports in the background.
- **Form autofill** scans a company or ATS application form, sends the field scan into A1 Jobs, and fills a reviewed fill package back onto the page.
- **LinkedIn** can add the selected job one at a time. Select a job in the LinkedIn results group and click **Copy link and add job**. The extension opens the copied Share link in a new tab, reads that job page, and sends it to A1 Jobs. It can also scan visible LinkedIn profile cards and send those contacts into the selected job's Contacts tab.

For applications:

1. Open a company or ATS application form.
2. Use **Form autofill > Scan form**.
3. Review the mapping in A1 Jobs and copy the generated fill package back into the extension.
4. Click **Fill form**.
5. Review the page manually and submit yourself.

The extension only targets the local app at `http://127.0.0.1:5186/` or `http://localhost:5186/`. It does not click submit buttons. File upload controls are detected but skipped because browsers require manual file selection.

The popup does not prefill old scan output. Each scan is intentionally click-triggered for the current active tab.

## LinkedIn visible contacts

Open a LinkedIn company, people, or search page and choose **Scan LinkedIn**. The extension reads only profile cards already visible in your active tab and can send that scan into the A1 Jobs contact importer. It does not scroll pages, bypass login, or send messages.
