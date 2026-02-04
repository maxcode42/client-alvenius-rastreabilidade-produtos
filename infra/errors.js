import { STATUS_CODE } from "types/status-code";

export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um error interno inesperado ocorreu.", {
      cause,
    });

    this.action = "Entre em contato com suporte.";
    this.statusCode = statusCode || STATUS_CODE.SERVER_ERROR;
  }

  toJSON() {
    return {
      name: "InternalServerError",
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Método não permitido para este endpoint.");

    this.action =
      "Verifique se o método `HTTP` enviado é válido para esse endpoint";
    this.statusCode = STATUS_CODE.NOT_ALLOWED;
  }

  toJSON() {
    return {
      name: "MethodNotAllowedError",
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Usuário não autenticado.", {
      cause,
    });

    this.action = action || "Realize novamente o login para continuar.";
    this.statusCode = STATUS_CODE.UNAUTHORIZED;
  }

  toJSON() {
    return {
      name: "UnauthorizedError",
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Error de validação ocorreu.", {
      cause,
    });

    this.action = action || "Verifique os dados enviados e tente novamente.";
    this.statusCode = STATUS_CODE.BAD_REQUEST;
  }

  toJSON() {
    return {
      name: "ValidationError",
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Error ocorreu ao buscar esse recurso no sistema.", {
      cause,
    });

    this.action =
      action ||
      "Verifique se os dados enviados estão corretos e tente novamente.";
    this.statusCode = STATUS_CODE.NOT_FOUND;
  }

  toJSON() {
    return {
      name: "NotFoundError",
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço indisponível no momento.", {
      cause,
    });

    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = STATUS_CODE.SERVICE_UNAVAILABLE;
  }

  toJSON() {
    return {
      name: "ServiceError",
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
