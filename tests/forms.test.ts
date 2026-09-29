import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAntique, parseContact } from "../lib/forms/parse";
import { preparePhotos } from "../lib/forms/photos";
import { validatePhotoFiles } from "../lib/forms/photo-limits";
import sharp from "sharp";

function form(values: Record<string, string>) { const data = new FormData(); Object.entries(values).forEach(([key, value]) => data.set(key, value)); return data; }
const base = { name: "Test Visitor", email: "visitor@example.com", itemDescription: "A wooden chair with a carved back and visible maker markings." };

test("item submissions require only useful essentials; unknown price stays null", () => {
  const parsed = parseAntique(form(base));
  assert.deepEqual(parsed.errors, {});
  assert.equal(parsed.askingPriceCents, null);
  assert.equal(parsed.preferredContact?.value, "email");
});
test("invalid enums, header injection, missing phone, and invalid prices are rejected", () => {
  assert.ok(parseAntique(form({ ...base, preferredContact: "text" })).errors.phone);
  assert.ok(parseAntique(form({ ...base, preferredContact: "fax", category: "forged" })).errors.preferredContact);
  assert.ok(parseAntique(form({ ...base, category: "forged" })).errors.category);
  for (const askingPrice of ["-1", "Infinity", "1e6", "999999999", "12.345", "1,000"]) assert.ok(parseAntique(form({ ...base, askingPrice })).errors.askingPrice);
  assert.equal(parseAntique(form({ ...base, askingPrice: "10.25" })).askingPriceCents, 1025);
  assert.equal(parseAntique(form({ ...base, askingPrice: "0" })).askingPriceCents, 0);
  const contact = parseContact(form({ name: "Name\r\nBcc: injected", email: "test@example.com\n", subject: "item", message: "A sufficiently long question.", phone: "-------" }));
  assert.ok(contact.errors.name);
  assert.ok(contact.errors.phone);
  assert.ok(parseContact(form({ name: "Name", email: "test\u0000@example.com", subject: "item", message: "A long enough message" })).errors.email);
  assert.ok(parseContact(form({ ...base, subject: "forged", message: "short" })).errors.subject);
});
test("photo count, MIME, and total byte limits cannot be bypassed", () => {
  const small = new File([new Uint8Array(20)], "test.jpg", { type: "image/jpeg" });
  assert.ok(validatePhotoFiles(Array.from({ length: 6 }, () => small)));
  assert.ok(validatePhotoFiles([new File(["<svg/>"], "photo.svg", { type: "image/svg+xml" })]));
  assert.ok(validatePhotoFiles([new File([new Uint8Array(2 * 1024 * 1024)], "1.jpg", { type: "image/jpeg" }), new File([new Uint8Array(2 * 1024 * 1024)], "2.jpg", { type: "image/jpeg" })]));
});
test("uploads decode genuine images, strip metadata, and ignore user filenames", async () => {
  const input = await sharp({ create: { width: 2000, height: 1000, channels: 3, background: "#702f3d" } }).jpeg().withMetadata().toBuffer();
  assert.ok((await sharp(input).metadata()).exif);
  const [output] = await preparePhotos([new File([new Uint8Array(input)], "../../private.jpg", { type: "image/jpeg" })]);
  const info = await sharp(output).metadata();
  assert.equal(info.format, "webp"); assert.equal(info.width, 1600); assert.equal(info.height, 800); assert.equal(info.exif, undefined);
  await assert.rejects(() => preparePhotos([new File(["<svg><script>alert(1)</script></svg>"], "fake.jpg", { type: "image/jpeg" })]));
  await assert.rejects(() => preparePhotos([new File([new Uint8Array(input)], "wrong.png", { type: "image/png" })]));
  assert.deepEqual(await preparePhotos([]), []);
});
