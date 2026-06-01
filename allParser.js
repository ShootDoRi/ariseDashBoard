import { runSyncFromCli } from "./scripts/sync.js";

console.warn("allParser.js is deprecated. Use `npm run sync -- --config <config>` instead.");
await runSyncFromCli(process.argv.slice(2));
