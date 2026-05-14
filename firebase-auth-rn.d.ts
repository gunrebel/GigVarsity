declare module '@firebase/auth' {
  import { FirebaseApp } from '@firebase/app';

  export function getReactNativePersistence(storage: any): any;
  export function initializeAuth(app: FirebaseApp, deps?: any): any;
}
