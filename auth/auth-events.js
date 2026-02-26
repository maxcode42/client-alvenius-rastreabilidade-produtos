export const AUTH_EVENTS = {
  UNAUTHORIZED: "unauthorized",
};

export function dispatchUnauthorized() {
  window.dispatchEvent(new Event(AUTH_EVENTS.UNAUTHORIZED));
}
