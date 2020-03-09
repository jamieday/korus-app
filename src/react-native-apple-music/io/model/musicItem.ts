export interface Preview {
  artwork: Artwork | undefined;
  url: string;
}

export interface Artwork {
  width: number;
  height: number;
  url: string;
  bgColor: string | undefined;
  textColor1: string | undefined;
  textColor2: string | undefined;
  textColor3: string | undefined;
  textColor4: string | undefined;
}

export interface PlayParams {
  id: string;
  kind: string;
}

export interface MusicItemAttributes {
  previews: Preview[];
  artwork: Artwork;
  artistName: string;
  url: string;
  discNumber: number;
  genreNames: string[];
  durationInMillis: number;
  releaseDate: string;
  name: string;
  isrc: string;
  albumName: string;
  playParams: PlayParams;
  trackNumber: number;
}

export interface MusicItemRelationships {
  albums: Albums;
  artists: Artists;
}

export interface AlbumData {
  id: string;
  type: string;
  href: string;
}

export interface Albums {
  data: AlbumData[];
  href: string;
}

export interface ArtistData {
  id: string;
  type: string;
  href: string;
}

export interface Artists {
  data: ArtistData[];
  href: string;
}
