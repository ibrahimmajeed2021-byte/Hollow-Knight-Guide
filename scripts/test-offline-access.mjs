import assert from "node:assert/strict";
import { shouldBlockGuide } from "../src/network/access-policy.mjs";

const cases = [
  { status: "online", premium: false, ready: true, expected: false },
  { status: "unreachable", premium: false, ready: true, expected: true },
  { status: "checking", premium: false, ready: true, expected: true },
  { status: "unreachable", premium: true, ready: true, expected: false },
  { status: "checking", premium: true, ready: true, expected: false },
  { status: "unreachable", premium: false, ready: false, expected: false },
];

for (const test of cases) {
  assert.equal(shouldBlockGuide({
    onlineStatus: test.status,
    premium: test.premium,
    entitlementCacheReady: test.ready,
  }), test.expected, JSON.stringify(test));
}

console.log("Offline access policy passed " + cases.length + " scenarios.");
