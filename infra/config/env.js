function isTestEnvironment() {
  return !process.env.JEST_WORKER_ID || process.env.NODE_ENV === "test";
}

function getProtheusBaseURL() {
  const isTest = isTestEnvironment();

  if (isTest) {
    return process.env.API_TEST_PROTHEUS_BASE_URL;
  }

  return process.env.API_PROTHEUS_BASE_URL;
}

module.exports = {
  getProtheusBaseURL,
  isTestEnvironment,
};
