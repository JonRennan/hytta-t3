interface AuthenticationError extends Error {
  name: "AuthenticationError";
}

export function AuthenticationError(msg: string) {
  const error = new Error(msg) as AuthenticationError;
  error.name = "AuthenticationError";
  return error;
}

export function isAuthenticationError(
  error: Error,
): error is AuthenticationError {
  return error.message === "AuthenticationError"; // Have to compare message as error.name is not persistent from server to client
}

interface PermissionError extends Error {
  name: "PermissionError";
}

export function PermissionError(msg: string) {
  const error = new Error(msg) as PermissionError;
  error.name = "PermissionError";
  return error;
}

export function isPermissionError(error: Error): error is AuthenticationError {
  return error.message === "PermissionError"; // Have to compare message as error.name is not persistent from server to client
}
