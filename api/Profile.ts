type Profile = {
  userId: string,
  username: string,
  totalFollowing: number,
  isFollowing?: boolean,
  profilePicUrl?: string,
  coverPhotoUrl?: string,
  isSetup?: boolean,
};

export default Profile;
