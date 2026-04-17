function isTestEnvironment() {
  return !!process.env.JEST_WORKER_ID || process.env.NODE_ENV === "test";
}

function getProtheusBaseURL() {
  const isTest = isTestEnvironment();
  console.log(">> IN TEST");
  console.log(isTest);
  if (isTest) {
    return process.env.API_TEST_PROTHEUS_BASE_URL;
  }

  return process.env.API_PROTHEUS_BASE_URL;
}

// function isTestEnvironment() {
//   return (
//     process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined
//   );
// }

// function isTestEnvironment() {
//   return process.env.NODE_ENV === "test";
// }

// function getProtheusBaseURL() {
//   if (isTestEnvironment()) {
//     return process.env.API_TEST_PROTHEUS_BASE_URL;
//   }

//   return process.env.API_PROTHEUS_BASE_URL;
// }
// function getProtheusBaseURL() {
//   return process.env.API_TEST_PROTHEUS_BASE_URL;
// }

module.exports = {
  getProtheusBaseURL,
  isTestEnvironment,
};
