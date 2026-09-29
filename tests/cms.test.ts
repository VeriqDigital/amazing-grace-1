import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, parse } from "groq-js";
import { EVENTS_QUERY, EVENT_QUERY, GALLERY_QUERY, SETTINGS_QUERY } from "../lib/cms/queries";

test("editorial queries enforce visibility, sorting, singleton identity, and parameterized slugs", async () => {
  const dataset = [
    { _id: "a", _type: "event", published: true, title: "First", slug: { current: "first" }, date: "2026-10-01" },
    { _id: "b", _type: "event", published: false, title: "Hidden", slug: { current: "hidden" } },
    { _id: "c", _type: "galleryItem", active: true, displayOrder: 2, image: { asset: { _ref: "image-a" }, alt: "Vintage furniture" } },
    { _id: "d", _type: "galleryItem", active: false, displayOrder: 1, image: { asset: { _ref: "image-b" }, alt: "Hidden image" } },
    { _id: "e", _type: "galleryItem", active: true, displayOrder: 0, image: { asset: { _ref: "image-c" } } },
    { _id: "storeSettings", _type: "storeSettings", visitNote: "Holiday hours" },
    { _id: "unrelated", _type: "storeSettings", visitNote: "Do not show" },
  ];
  const run = async (query: string, params = {}) => (await evaluate(parse(query), { dataset, params })).get();
  assert.deepEqual((await run(EVENTS_QUERY)).map((row: { _id: string }) => row._id), ["a"]);
  assert.equal((await run(EVENT_QUERY, { slug: "first" })).title, "First");
  assert.equal(await run(EVENT_QUERY, { slug: "hidden" }), null);
  assert.equal(await run(EVENT_QUERY, { slug: '\"] || true || ["' }), null);
  assert.deepEqual((await run(GALLERY_QUERY)).map((row: { _id: string }) => row._id), ["c"]);
  assert.equal((await run(SETTINGS_QUERY)).visitNote, "Holiday hours");
});
