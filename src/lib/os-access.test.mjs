// node --experimental-strip-types --test src/lib/os-access.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.OS_ACCESS_SECRET = "test-secret-not-real";
const { signAccess, verifyAccess, isFreeGuidePath } = await import("./os-access.ts");

test("a signed cookie verifies, a tampered one does not", async () => {
  const v = await signAccess("cs_test_abc123");
  assert.ok(v);
  assert.equal(await verifyAccess(v), true);
  assert.equal(await verifyAccess(v.replace("abc123", "abc124")), false);
  assert.equal(await verifyAccess(v.slice(0, -1) + (v.endsWith("0") ? "1" : "0")), false);
  assert.equal(await verifyAccess("cs_test_abc123.deadbeef"), false);
  assert.equal(await verifyAccess(undefined), false);
  assert.equal(await verifyAccess("nodot"), false);
});

test("only the contents page and Start here are free", () => {
  assert.equal(isFreeGuidePath("/os/guide"), true);
  assert.equal(isFreeGuidePath("/os/guide/"), true);
  assert.equal(isFreeGuidePath("/os/guide/start-here"), true);
  assert.equal(isFreeGuidePath("/os/guide/0-start-here"), true);
  assert.equal(isFreeGuidePath("/os/guide/1-where-you-are"), false);
  assert.equal(isFreeGuidePath("/os/guide/start-here-extra"), false);
});
