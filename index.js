const assert = require("assert");
const util = require("util");

const haveCommonReferences = (x, y) => {
  const getAllRefs = (obj, seen = new Set()) => {
    if (typeof obj !== "object" || obj === null || seen.has(obj)) return [];
    seen.add(obj);
    let refs = [obj];
    for (const key of Object.keys(obj)) {
      refs = refs.concat(getAllRefs(obj[key], seen));
    }
    return refs;
  };

  const refsX = new Set(getAllRefs(x));
  for (const ref of getAllRefs(y)) {
    if (refsX.has(ref)) return true;
  }
  return false;
};

const isJsonLike = (thingToTest) => {
  try {
    const thingToTestStringified = JSON.stringify(thingToTest);
    const thingToTestUnstringified = JSON.parse(thingToTestStringified);
    return util.isDeepStrictEqual(thingToTest, thingToTestUnstringified);
  } catch (error) {
    return false;
  }
};

const getOneValueOfObject = (obj) =>
  (obj && typeof obj === "object" && Object.values(obj)[0]) || null;

// arg.inputToBeTested
// arg.outputExpected
// arg.functionTested
// arg.isDetailedOutputMessage
// arg.errorMessage
// arg.testOutputEquality
const test = async (arg) => {
  const inputToBeTested = arg.inputToBeTested;
  const outputExpected = arg.outputExpected;
  const functionTested = arg.functionTested;
  const isDetailedOutputMessage = arg.isDetailedOutputMessage;
  let errorMessage = arg.errorMessage == null ? "" : arg.errorMessage;
  let testOutputEquality = arg.testOutputEquality == false ? false : true;

  const fnName = functionTested.name || "[anonymous function]";
  errorMessage += `function name: ${fnName}\n`;
  errorMessage += `input: ${JSON.stringify(inputToBeTested, null, 2)}\n`;
  let inputSaved = structuredClone(inputToBeTested);
  const outputData = await functionTested(inputToBeTested);

  if (isDetailedOutputMessage !== false) {
    errorMessage +=
      `output computed: ${JSON.stringify(outputData, null, 2)}\n` +
      `output expected: ${JSON.stringify(outputExpected, null, 2)}\n`;
  }
  if (testOutputEquality) {
    assert.ok(
      util.isDeepStrictEqual(outputData, outputExpected),
      `\nERROR: OUTPUT IS BADLY CALCULATED:\n` + errorMessage
    );
  }
  assert.ok(
    util.isDeepStrictEqual(inputSaved, inputToBeTested),
    `\nERROR: INPUT HAS BEEN CHANGED:\n` + errorMessage
  );
  assert.ok(
    !haveCommonReferences(outputData, inputToBeTested),
    `\nERROR: INPUT AND OUTPUT HAVE COMMON REFERENCES:\n` + errorMessage
  );
  assert.ok(
    isJsonLike(inputToBeTested),
    `\nERROR: INPUT IS NOT A JSON:\n` + errorMessage
  );
  assert.ok(
    isJsonLike(outputData),
    `\nERROR: OUTPUT IS NOT A JSON:\n` + errorMessage
  );
};

// arg.dataToBeTested
// arg.functionsToBeTested
// arg.isDetailedOutputMessage
// arg.testOutputEquality
const unitTest = async (arg) => {
  const dataToBeTested = arg.dataToBeTested;
  const functionsToBeTested = arg.functionsToBeTested;
  const isDetailedOutputMessage = arg.isDetailedOutputMessage;
  const testOutputEquality = arg.testOutputEquality;
  for (let unitTest of dataToBeTested) {
    for (let testToBeTreated of unitTest.tests) {
      let errorMessage =
        `name_of_unit_test: ${unitTest.name_of_unit_test}\n` +
        `name_of_test: ${testToBeTreated.name_of_test}\n`;
      test({
        inputToBeTested: testToBeTreated.input,
        outputExpected: testToBeTreated.output_expected,
        functionTested: functionsToBeTested[testToBeTreated.function_name],
        isDetailedOutputMessage: isDetailedOutputMessage,
        errorMessage: errorMessage,
        testOutputEquality: testOutputEquality,
      });
    }
  }
};

module.exports = {
  haveCommonReferences,
  isJsonLike,
  getOneValueOfObject,
  test,
  unitTest,
};
