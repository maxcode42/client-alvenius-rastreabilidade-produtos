import bcryptjs from "bcryptjs";

function getNumberOfRounds() {
  const MIN_ROUNDS = 1;
  const MAX_ROUNDS = Number(process.env.HASH_ROUNDS);
  const ENVIRONMENT = process.env.NODE_ENV;

  const result = ENVIRONMENT === "production" ? MAX_ROUNDS : MIN_ROUNDS;

  return result;
}

function addPepperPassword(password) {
  const pepper = process.env.HASH_PEPPER || "";

  const result = password.concat(pepper);

  return result;
}

async function hash(password) {
  const rounds = getNumberOfRounds();
  const passwordWithPepper = addPepperPassword(password);

  const result = await bcryptjs.hash(passwordWithPepper, rounds);

  return result;
}

async function compare(providedPassword, storedPassword) {
  const passwordWithPepper = addPepperPassword(providedPassword);

  const result = await bcryptjs.compare(passwordWithPepper, storedPassword);

  return result;
}

const password = {
  compare,
  hash,
};

export default password;
