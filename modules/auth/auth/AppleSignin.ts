import {
  signInWithCredential,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/firebase.config.js';

const provider = new OAuthProvider('apple.com');

provider.addScope('email');
provider.addScope('name');

export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    // Apple credential
    const credential = OAuthProvider.credentialFromResult(result);

    if (!credential) {
      throw 'auth/failed';
    }

    return signInWithCredential(auth, credential);
  } catch (error: any) {
    // Ensure Apple returned a user identityToken
    console.error(error.message);
    throw 'auth/failed';
  }
};
