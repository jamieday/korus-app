import {
  appleAuth,
  AppleRequestScope,
  AppleRequestOperation
} from '@invertase/react-native-apple-authentication';

import { auth } from '@/firebase.config';

export const signInWithApple = async () => {
  // // Start the sign-in request
  // const appleAuthRequestResponse = await appleAuth.performRequest({
  //   requestedOperation: AppleRequestOperation.LOGIN,
  //   requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME]
  // });
  // // Ensure Apple returned a user identityToken
  // if (!appleAuthRequestResponse.identityToken) {
  //   throw 'auth/failed';
  // }
  // // Create a Firebase credential from the response
  // const { identityToken, nonce } = appleAuthRequestResponse;
  // const appleCredential = auth.credential(
  //   identityToken,
  //   nonce
  // );
  // // Sign the user in with the credential
  // return auth.signInWithCredential(appleCredential);
};
