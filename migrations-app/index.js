const fetch = require("cross-fetch");

// === CONFIGURATION ===
const BASE_DIRECTUS_URL = "http://localhost:8055";
const BASE_ACCESS_TOKEN = "xUHr1n8eknVNTOuT_GnjCKGr56IhwpbW";

const TARGET_DIRECTUS_URL = "https://alhuda-center-directus-production.up.railway.app";
const TARGET_ACCESS_TOKEN = "Vw22MSXyKmJdKAICBTG6LUGZO4n73laf";

// === MAIN ===
async function main() {
  console.log("=================================================");
  console.log("🚀 Starting Directus Migration Process");
  console.log("=================================================");

  try {
    // STEP 1 — Snapshot
    console.log("\n-------------- STEP 1: SCHEMA SNAPSHOT --------------");
    const snapshot = await getSnapshot();

    // STEP 2 — Diff
    console.log("\n-------------- STEP 2: SCHEMA DIFF --------------");
    const diff = await getDiff(snapshot);

    // STEP 3 — Apply Diff (or skip if diff is empty)
    console.log("\n-------------- STEP 3: APPLY SCHEMA DIFF --------------");
    if (diff && Object.keys(diff).length > 0) {
      await applyDiff(diff);
      console.log("✅ Schema diff applied successfully.");
    } else {
      console.log("⚠️ No diff detected or diff empty — skipping apply.");
    }

    console.log("\n=================================================");
    console.log("✅ Migration process completed successfully!");
    console.log("=================================================\n");
  } catch (error) {
    console.error("\n❌ ERROR during migration:", error.message);
    console.error(error);
  }
}

main();

// === FUNCTIONS ===

async function getSnapshot() {
  const URL = `${BASE_DIRECTUS_URL}/schema/snapshot?access_token=${BASE_ACCESS_TOKEN}`;
  console.log(`📡 Fetching snapshot from: ${URL}`);
  const start = Date.now();

  const res = await fetch(URL);
  const json = await res.json();

  console.log(`✅ Snapshot retrieved in ${Date.now() - start} ms`);
  console.log("-------------------------------------------------");
  return json.data;
}

async function getDiff(snapshot) {
  const URL = `${TARGET_DIRECTUS_URL}/schema/diff?access_token=${TARGET_ACCESS_TOKEN}&force=true`;
  console.log(`📤 Posting snapshot for diff to: ${URL}`);
  const start = Date.now();

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(snapshot),
  });

  const text = await response.text();
  console.log("-------------------------------------------------");
  console.log("📜 Raw diff response:");
  console.log(text);
  console.log("-------------------------------------------------");

  try {
    const json = JSON.parse(text);
    console.log(`✅ Diff parsed successfully in ${Date.now() - start} ms`);
    console.log("-------------------------------------------------");
    return json.data;
  } catch (e) {
    console.error("❌ Failed to parse diff JSON:", e.message);
    console.log("Response text was:", text);
    console.log("-------------------------------------------------");
    return null;
  }
}

async function applyDiff(diff) {
  const URL = `${TARGET_DIRECTUS_URL}/schema/apply?access_token=${TARGET_ACCESS_TOKEN}&force=true`;
  console.log(`📡 Applying diff to target: ${URL}`);
  const start = Date.now();

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(diff),
  });

  const text = await res.text();
  console.log("-------------------------------------------------");
  console.log("📜 Schema apply response:");
  console.log(text);
  console.log(`✅ Schema apply completed in ${Date.now() - start} ms`);
  console.log("-------------------------------------------------");
}
