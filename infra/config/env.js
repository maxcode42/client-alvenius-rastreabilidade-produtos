function isTestEnvironment() {
  return !!process.env.JEST_WORKER_ID;
}

function getProtheusBaseURL() {
  if (isTestEnvironment()) {
    return process.env.API_TEST_PROTHEUS_BASE_URL;
  }

  return process.env.API_PROTHEUS_BASE_URL;
}

module.exports = {
  getProtheusBaseURL,
};
