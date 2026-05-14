export function getFirebaseErrorMessage(error: any): string {
  const code = error?.code || '';
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password. Please try again',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Check your connection',
    'permission-denied': 'You do not have permission to do this',
    'not-found': 'The requested data was not found',
    'unavailable': 'Service is currently unavailable. Try again later',
  };
  return messages[code] || error?.message || 'Something went wrong. Please try again';
}
