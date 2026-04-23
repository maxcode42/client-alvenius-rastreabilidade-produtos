// import { createModelMock } from "./create-model-mock";
// import { setupControllerSpy } from "./spy-controller";

// export function setupTest(config) {
//   const mocks = {};

//   if (config.models) {
//     Object.entries(config.models).forEach(([path, methods]) => {
//       const mock = createModelMock(methods);

//       jest.doMock(path, () => mock);

//       // adiciona no map geral
//       mocks[path] = mock;

//       // cria alias amigável (sessionMock, registerMock etc)
//       // const alias = path.split("/").pop() + "Mock";
//       const alias = path.split("/").pop();
//       mocks[alias] = mock;
//     });
//   }

//   const spies = {};

//   if (config.spy?.includes("controller.setSessionCookie")) {
//     const sessionModel = require("models/session");
//     spies.setSessionCookie = setupControllerSpy(sessionModel);
//   }

//   return {
//     mocks,
//     ...mocks, // 🔥 expõe direto também
//     spies,
//   };
// }

// import { createModelMock } from "./create-model-mock";

// export function setupTest(config) {
//   const mocks = {};

//   // ======================
//   // MODELS
//   // ======================
//   if (config.models) {
//     Object.entries(config.models).forEach(([path, methods]) => {
//       const mock = createModelMock(methods);

//       jest.doMock(path, () => mock);

//       mocks[path] = mock;

//       // const alias = path.split("/").pop() + "Mock";
//       const alias = path.split("/").pop();
//       mocks[alias] = mock;
//     });
//   }

//   // ======================
//   // DATABASE (🔥 FIX)
//   // ======================
//   if (config.database) {
//     const dbMock = {
//       query: jest.fn(),
//     };

//     jest.doMock("infra/database", () => dbMock);

//     mocks.database = dbMock; // 🔥 ESSA LINHA FALTAVA
//   }

//   return mocks;
// }

// import { createModelMock } from "./create-model-mock";
// import { setupControllerSpy } from "./spy-controller";

// function toAlias(path) {
//   return path.split("/").pop(); // "models/session" -> "session"
// }

// export function setupTest(config) {
//   const mocks = {};

//   // =========================
//   // MODELS
//   // =========================
//   if (config.models) {
//     Object.entries(config.models).forEach(([path, methods]) => {
//       const mock = createModelMock(methods);

//       jest.doMock(path, () => mock);

//       const alias = toAlias(path);

//       mocks[alias] = mock; // 🔥 session, authentication etc
//     });
//   }

//   // =========================
//   // DATABASE
//   // =========================
//   if (config.database) {
//     const dbMock = {
//       query: jest.fn(),
//     };

//     jest.doMock("infra/database", () => dbMock);

//     mocks.database = dbMock;
//   }

//   // =========================
//   // SPIES
//   // =========================
//   if (config.spy?.includes("controller.setSessionCookie")) {
//     const sessionModel = require("models/session");

//     const controller = require("infra/controller");

//     jest
//       .spyOn(controller, "setSessionCookie")
//       .mockImplementation((res, token) => {
//         res.setHeader("Set-Cookie", [
//           `${process.env.COOKIE_NAME}=${token}; Max-Age=${
//             sessionModel.EXPIRATION_IN_MILLISECONDS / 1000
//           }; Path=/; HttpOnly`,
//         ]);
//       });
//   }

//   return mocks;
// }

//QUASE FUNCIONOU MAS FICOU FALTANDO O DATA_EXPIRE 23/04/2026 as 15h (open-ia)
/*
import { createModelMock } from "./create-model-mock";
import { setupControllerSpy } from "./spy-controller";

function toAlias(path) {
  return path.split("/").pop();
}

export function setupTest(config) {
  const mocks = {};

  if (config.models) {
    Object.entries(config.models).forEach(([path, methods]) => {
      const mock = createModelMock(methods);

      jest.doMock(path, () => mock);

      // mantém compatibilidade antiga
      mocks[path] = mock;

      // alias limpo (session, authentication)
      const alias = toAlias(path);
      mocks[alias] = mock;
    });
  }

  if (config.database) {
    const dbMock = {
      query: jest.fn(),
    };

    jest.doMock("infra/database", () => dbMock);

    mocks.database = dbMock;
  }

  const spies = {};

  if (config.spy?.includes("controller.setSessionCookie")) {
    const sessionModel = require("models/session");
    spies.setSessionCookie = setupControllerSpy(sessionModel);
  }

  return {
    ...mocks,
    spies,
  };
}
*/
import { createModelMock } from "./create-model-mock";
import { setupControllerSpy } from "./spy-controller";

function toAlias(path) {
  return path.split("/").pop();
}

// export function setupTest(config) {
//   const mocks = {};

//   if (config.models) {
//     Object.entries(config.models).forEach(([path, methods]) => {
//       const mock = createModelMock(methods);

//       // jest.requireActual garante o modulo real, ignorando qualquer mock ativo
//       let realConstants = {};
//       try {
//         const realModule = jest.requireActual(path);

//         // modulos com export default tem suas exportacoes aninhadas em .default
//         const moduleSource = realModule.default ?? realModule;

//         realConstants = Object.fromEntries(
//           Object.entries(moduleSource).filter(
//             ([, value]) => typeof value !== "function",
//           ),
//         );
//       } catch (_) {
//         // modulo pode nao existir em alguns contextos de teste
//       }

//       const mergedMock = { ...realConstants, ...mock };

//       jest.doMock(path, () => mergedMock);

//       mocks[path] = mergedMock;

//       const alias = toAlias(path);
//       mocks[alias] = mergedMock;
//     });
//   }

//   if (config.database) {
//     const dbMock = {
//       query: jest.fn(),
//     };

//     jest.doMock("infra/database", () => dbMock);

//     mocks.database = dbMock;
//   }

//   const spies = {};

//   if (config.spy?.includes("controller.setSessionCookie")) {
//     const sessionModel = require("models/session");
//     spies.setSessionCookie = setupControllerSpy(sessionModel);
//   }

//   return {
//     ...mocks,
//     spies,
//   };
// }

export function setupTest(config) {
  const mocks = {};

  if (config.models) {
    Object.entries(config.models).forEach(([path, methods]) => {
      const mock = createModelMock(methods);

      let realConstants = {};
      try {
        const realModule = jest.requireActual(path);

        // se tiver .default E .default for um objeto, verifica onde esta a constante
        // named exports ficam no nivel raiz (realModule)
        // export default fica em realModule.default
        const fromRoot = Object.fromEntries(
          Object.entries(realModule).filter(
            ([key, value]) =>
              key !== "default" &&
              typeof value !== "function" &&
              !methods.includes(key),
          ),
        );

        const fromDefault =
          realModule.default && typeof realModule.default === "object"
            ? Object.fromEntries(
                Object.entries(realModule.default).filter(
                  ([key, value]) =>
                    typeof value !== "function" && !methods.includes(key),
                ),
              )
            : {};

        // named exports tem precedencia sobre default
        realConstants = { ...fromDefault, ...fromRoot };
      } catch (_) {
        // modulo pode nao existir em alguns contextos de teste
      }

      const mergedMock = { ...realConstants, ...mock };

      jest.doMock(path, () => mergedMock);

      mocks[path] = mergedMock;

      const alias = toAlias(path);
      mocks[alias] = mergedMock;
    });
  }

  if (config.database) {
    const dbMock = {
      query: jest.fn(),
    };

    jest.doMock("infra/database", () => dbMock);

    mocks.database = dbMock;
  }

  const spies = {};

  if (config.spy?.includes("controller.setSessionCookie")) {
    const sessionModel = require("models/session");
    spies.setSessionCookie = setupControllerSpy(sessionModel);
  }

  return {
    ...mocks,
    spies,
  };
}
