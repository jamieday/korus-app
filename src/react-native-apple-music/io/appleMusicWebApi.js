// import { mapP, Response, toResponse } from 'chorus-utils';
// import { pipe, prop } from 'ramda';

// import { callJsonApi } from '../packages/webApi';

// import { ApiError } from './model/apiError';
// import {
//   MusicItemAttributes,
//   MusicItemRelationships
// } from './model/musicItem';
// import { ResponseRoot } from './model/webResponse';

// export default class AppleMusicWebapi {
//   constructor(private readonly developerToken: string) {}

//   /**
//    * callApi :: a => developerToken -> userToken ->
//    *                 (Template -> Promise<a>)
//    */
//   private readonly callApi = <TAttributes, TRelationships>(
//     userToken?: string
//   ) =>
//     pipe(
//       callJsonApi<ResponseRoot<TAttributes, TRelationships>>({
//         host: 'api.music.apple.com',
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${this.developerToken}`,
//           ...(userToken && { 'Music-User-Token': userToken })
//         }
//       }),
//       mapP(prop('data'))
//     );

//   public readonly fetchSong = (
//     id: string
//   ): Promise<Response<MusicItemAttributes, ApiError>> =>
//     this.callApi<
//       MusicItemAttributes,
//       MusicItemRelationships
//     >()`/v1/catalog/us/songs/${id}`.then(data =>
//       toResponse(
//         ApiError.InvalidResponse,
//         data[0].attributes,
//         data.length === 1
//       )
//     );
// }
