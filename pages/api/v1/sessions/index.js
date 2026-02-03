import { createRouter } from "next-connect";

import { STATUS_CODE } from "types/status-code";

const router = createRouter();

router.post(postHandler);

export default router.handler();

async function postHandler(req, res) {
  const results = await {
    id: 1,
    user: "Josuel",
  };

  res.status(STATUS_CODE.CREATE).json(results);
}
