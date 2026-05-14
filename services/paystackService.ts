export async function initializePaystack() {
  // placeholder for Paystack initialization if needed
  return true;
}

export async function createPaystackTransaction(amount: number, email: string) {
  return {
    authorization_url: 'https://paystack.com/pay/example',
    access_code: 'ACCESSCODE123',
    reference: `GV-${Date.now()}`,
  };
}
