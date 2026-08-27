export const AUTH_COOKIE = "auth_session";

export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";
export const VERIFY_OTP_ROUTE = "/verify-otp";
export const RESET_PASSWORD_ROUTE = "/reset-password";

export const AFTER_LOGIN_ROUTE = "/";

export const AUTH_ROUTES = [
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  VERIFY_OTP_ROUTE,
  RESET_PASSWORD_ROUTE,
];

export function signIn(remember = true) {
  const lifetime = remember ? `; max-age=${AUTH_COOKIE_MAX_AGE}` : "";
  document.cookie = `${AUTH_COOKIE}=1; path=/${lifetime}; samesite=lax`;
}

export function signOut() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
