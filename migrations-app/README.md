# Directus Migration Script

This is a Node.js script to migrate **Directus** schemas from a source instance to a target instance.
It takes a snapshot of the source schema, calculates the diff with the target, and applies the changes.

---

## Folder Structure

```
migrations-app/
│
├─ node_modules/ # Node.js dependencies
├─ index.js # Main migration script
├─ package.json # Project configuration and dependencies
└─ package-lock.json # Exact versions of dependencies
```

---

## Dependencies

This project uses:

```json
"dependencies": {
  "cross-fetch": "^4.1.0"
}
```

**Why cross-fetch?**

The script needs to make HTTP requests to the Directus API.

`cross-fetch` is a lightweight, universal fetch API that works in Node.js (since `fetch` is not built-in in Node versions <18) and in browsers.

This ensures consistent API calls regardless of environment.

---

## Setup

Make sure you have Node.js installed (v14+ recommended).

- Open your bash terminal in the the `migration-app` folder.

- Install dependencies: `npm install`

- Open `index.js` and update the configuration section with your Directus URLs and access tokens:

  ```javascript
  const BASE_DIRECTUS_URL = "http://localhost:8055";
  const BASE_ACCESS_TOKEN = "YOUR_SOURCE_TOKEN";

  const TARGET_DIRECTUS_URL = "https://your-target-instance.app";
  const TARGET_ACCESS_TOKEN = "YOUR_TARGET_TOKEN";
  ```

---

## Usage

Run the migration script with:

```bash
node index.js
```

You will see logs for:

- Fetching the schema snapshot from the source instance.
- Posting the snapshot to the target instance for diff calculation.
- Applying the schema diff to the target instance (if any changes exist).

---

## Notes

- This script does **not migrate data**—only schema changes (tables, fields, relations, etc.).
- It no longer syncs system tables (roles, permissions, flows, etc.)—this is optional and can be added if needed.
- Make sure to backup your target Directus instance before applying diffs.
