type Share = {
  id: string,
  sharer: string,
  sharerId: string,
  sharedAt: Date,
  songId: string,
  name: string,
  artist: string,
  artworkUrl: string,
  caption: string | undefined,
  totalLikes: number,
  isLiked: boolean,
  appleMusic: { playbackStoreId: string } | undefined,
  spotify: { id: string, playUri: string } | undefined,
};

export default Share;
