import retry from "async-retry";
import { STATUS_CODE } from "types/status-code";

async function waitForAllServices() {
  await waitForWebServer();

  function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 100,
      maxTimeout: 1_000,
    });

    async function fetchStatusPage() {
      const response = await fetch(`${process.env.API_BASE_URL}/api/v1/status`);

      if (response.status !== STATUS_CODE.SUCCESS) {
        throw Error();
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
