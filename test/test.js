#!/usr/bin/env node

const jsonUnitTest = require("../index.js");
const assert = require("assert");
const util = require("util");

// Test of util.isDeepStrictEqual
assert.ok(util.isDeepStrictEqual(undefined, undefined));
assert.ok(util.isDeepStrictEqual(null, null));
assert.ok(util.isDeepStrictEqual(true, true));
assert.ok(util.isDeepStrictEqual(false, false));
assert.ok(util.isDeepStrictEqual("", ""));
assert.ok(util.isDeepStrictEqual("abc", "abc"));
assert.ok(util.isDeepStrictEqual(new String("abc"), new String("abc")));
assert.ok(util.isDeepStrictEqual(1, 1));
assert.ok(util.isDeepStrictEqual(3.14, 3.14));
assert.ok(util.isDeepStrictEqual([], []));
assert.ok(
  util.isDeepStrictEqual(
    ["a", [1, [], null, undefined]],
    ["a", [1, [], null, undefined]]
  )
);
assert.ok(
  !util.isDeepStrictEqual(
    ["a", [1, [], null, undefined]],
    ["a", [1, [2], null, undefined]]
  )
);
function f(x) {
  return x;
}
let g = f;
function h(x) {
  return x;
}
assert.ok(util.isDeepStrictEqual(f, g));
assert.ok(!util.isDeepStrictEqual(f, h));
assert.ok(!util.isDeepStrictEqual({}, []));
assert.ok(!util.isDeepStrictEqual({ 0: "a", 1: "b" }, ["a", "b"]));

// Test of structuredClone
assert.ok(util.isDeepStrictEqual(structuredClone(undefined), undefined));
assert.ok(util.isDeepStrictEqual(structuredClone(true), true));
assert.ok(util.isDeepStrictEqual(structuredClone(false), false));
assert.ok(util.isDeepStrictEqual(structuredClone(""), ""));
assert.ok(util.isDeepStrictEqual(structuredClone("abc"), "abc"));
assert.ok(
  util.isDeepStrictEqual(structuredClone(new String("abc")), new String("abc"))
);
assert.ok(util.isDeepStrictEqual(structuredClone(1), 1));
assert.ok(util.isDeepStrictEqual(structuredClone(3.14), 3.14));
assert.ok(util.isDeepStrictEqual(structuredClone([]), []));
assert.ok(
  util.isDeepStrictEqual(structuredClone(["a", [1, [], null, undefined]]), [
    "a",
    [1, [], null, undefined],
  ])
);

// Test of jsonUnitTest.haveCommonReferences
assert.ok(!jsonUnitTest.haveCommonReferences([], []));
assert.ok(
  !jsonUnitTest.haveCommonReferences(structuredClone(undefined), undefined)
);
assert.ok(!jsonUnitTest.haveCommonReferences(structuredClone(true), true));
assert.ok(!jsonUnitTest.haveCommonReferences(structuredClone(false), false));
assert.ok(!jsonUnitTest.haveCommonReferences(structuredClone(""), ""));
assert.ok(!jsonUnitTest.haveCommonReferences(structuredClone("abc"), "abc"));
assert.ok(
  !jsonUnitTest.haveCommonReferences(
    structuredClone(new String("abc")),
    new String("abc")
  )
);
assert.ok(!jsonUnitTest.haveCommonReferences(structuredClone(1), 1));
assert.ok(!jsonUnitTest.haveCommonReferences(structuredClone(3.14), 3.14));
assert.ok(!jsonUnitTest.haveCommonReferences(structuredClone([]), []));
assert.ok(
  !jsonUnitTest.haveCommonReferences(
    structuredClone(["a", [1, [], null, undefined]]),
    ["a", [1, [], null, undefined]]
  )
);
const a = {};
const b = { a: a, b: {} };
const c = { a: {}, b: {} };
const d = { a: a };
assert.ok(!jsonUnitTest.haveCommonReferences(b, c));
assert.ok(jsonUnitTest.haveCommonReferences(b, d));

// Test of jsonUnitTest.isJsonLike
assert.ok(jsonUnitTest.isJsonLike("hello"));
assert.ok(jsonUnitTest.isJsonLike(true));
assert.ok(jsonUnitTest.isJsonLike(10));
assert.ok(jsonUnitTest.isJsonLike({}));
assert.ok(
  jsonUnitTest.isJsonLike({
    message: "coucou",
  })
);
assert.ok(jsonUnitTest.isJsonLike(null));
assert.ok(!jsonUnitTest.isJsonLike(undefined));
assert.ok(!jsonUnitTest.isJsonLike(new Date()));
assert.ok(!jsonUnitTest.isJsonLike(f));

assert.ok(jsonUnitTest.isJsonLike("coucou"));
assert.ok(!jsonUnitTest.isJsonLike(() => {}));

assert.ok(
  !jsonUnitTest.isJsonLike({ a: undefined, b: () => {}, c: Symbol("sym") })
);

assert.ok(jsonUnitTest.isJsonLike({ a: 1 }));
assert.ok(jsonUnitTest.isJsonLike([1, 2, "hi"]));
assert.ok(!jsonUnitTest.isJsonLike({ fn: () => {} }));
assert.ok(!jsonUnitTest.isJsonLike({ val: undefined }));
assert.ok(!jsonUnitTest.isJsonLike(Infinity));

// Test of jsonUnitTest.getOneValueOfObject
assert.ok(jsonUnitTest.getOneValueOfObject(null) == null);
assert.ok(jsonUnitTest.getOneValueOfObject(undefined) == null);
assert.ok(jsonUnitTest.getOneValueOfObject({}) == null);
assert.ok(jsonUnitTest.getOneValueOfObject({ a: "aa", b: "bb" }) == "aa");

// Test of jsonUnitTest.test
let add = (arg) => {
  return arg.x + arg.y;
};
jsonUnitTest.test({
  inputToBeTested: { x: "a", y: "b" },
  outputExpected: "ab",
  functionTested: add,
  isDetailedOutputMessage: false,
});

// Test of unitTest
// There is none
