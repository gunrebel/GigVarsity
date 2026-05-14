const { initializeApp } = require('firebase/app');
const { initializeAuth } = require('firebase/auth');
console.log('App init:', typeof initializeApp);
console.log('Auth init:', typeof initializeAuth);
