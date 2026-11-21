// Run: npm test  (node --test; Node strips the types from os.ts)
// These pin the switches of /os and /club: buy button vs. notify form, and which Kit form each list uses.
import assert from "node:assert/strict";
import { test } from "node:test";
import { CLUB_FORM, FAQ, JOBS, MODULES, OS_CHECKOUT_URL, OS_NOTIFY_FORM, PLANS, buyState, formReady } from "./os.ts";
import { STARTER_FORM } from "./free.ts";

test("with no checkout URL the buy button becomes the $29 notify form", () => {
  assert.deepEqual(buyState(""), { mode: "notify" });
  assert.deepEqual(buyState("   "), { mode: "notify" });
});

test("with a checkout URL the buy button links to it", () => {
  assert.deepEqual(buyState("https://example.kit.com/products/copilot-os"), {
    mode: "buy",
    href: "https://example.kit.com/products/copilot-os",
  });
});

test("only an https URL counts as a checkout", () => {
  assert.deepEqual(buyState("javascript:alert(1)"), { mode: "notify" });
  assert.deepEqual(buyState("http://example.com/x"), { mode: "notify" });
});

test("the page's own state follows the one constant", () => {
  assert.equal(buyState(OS_CHECKOUT_URL).mode, OS_CHECKOUT_URL ? "buy" : "notify");
});

test("a Kit form is ready only with both its uid and its script", () => {
  assert.equal(formReady({ uid: "", script: "" }), false);
  assert.equal(formReady({ uid: "abc", script: "" }), false);
  assert.equal(formReady({ uid: "abc", script: "https://x.kit.com/abc/index.js" }), true);
});

test("the two lists never share a Kit form, and neither is the Starter's", () => {
  for (const form of [OS_NOTIFY_FORM, CLUB_FORM]) {
    if (formReady(form)) assert.notEqual(form.uid, STARTER_FORM.uid);
  }
  if (formReady(OS_NOTIFY_FORM) && formReady(CLUB_FORM)) assert.notEqual(OS_NOTIFY_FORM.uid, CLUB_FORM.uid);
});

test("the copy keeps the sales page's counts and prices", () => {
  assert.equal(JOBS.length, 4);
  assert.equal(MODULES.length, 9);
  assert.equal(FAQ.length, 4);
  assert.deepEqual(PLANS.map((p) => [p.name, p.price]), [
    ["Starter", "Free"],
    ["Copilot OS", "$49"],
    ["Founding Operator", "$299"],
  ]);
});

test("each plan lists exactly the rows the pricing table ticks for it", () => {
  assert.deepEqual(PLANS.map((p) => p.includes.length), [1, 3, 4]);
});
