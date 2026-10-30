export function getApiErrorMessage(error, fallback) {
  const response = error?.response;

  if (!response) {
    return "Could not connect to the server. Check that the backend is running and try again.";
  }

  if (response.status >= 500) {
    return fallback;
  }

  const validationMessage = Object.values(response.data?.errors || {})
    .flat()
    .find((message) => typeof message === "string" && message.length > 0);

  return validationMessage || response.data?.message || fallback;
}
