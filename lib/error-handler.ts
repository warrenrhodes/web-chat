/**
 * Returns a user-friendly error message based on the provided authentication error code.
 *
 * @param {string} errorCode - The authentication error code.
 * @return {string} A descriptive error message corresponding to the error code.
 * If the error code is not recognized a generic error message is returned.
 */
export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: { [key: string]: string } = {
    "auth/invalid-email": "Please enter a valid email address",
    "auth/email-already-in-use": "An account with this email already exists",
    "auth/network-request-failed":
      "Network error. Please check your internet connection",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/popup-closed-by-user": "Google sign-in was cancelled",
    "auth/operation-not-allowed": "This sign-in method is not enabled",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using a different sign-in method",
    "auth/invalid-credential": "The email or password is invalid",
    "auth/user-disabled": "This account has been disabled",
    "auth/requires-recent-login":
      "Please sign in again to complete this action",
    "auth/provider-already-linked":
      "This account is already linked with another provider",
    "auth/invalid-verification-code": "Invalid verification code",
    "auth/invalid-verification-id": "Invalid verification ID",
    "auth/captcha-check-failed": "reCAPTCHA verification failed",
    "auth/failed-to-add-user": "Error adding user",
  };

  return (
    errorMessages[errorCode] || "An unexpected error occurred. Please try again"
  );
}
