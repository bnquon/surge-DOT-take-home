export interface UnsplashImageData {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
  downloadLocation: string;
}

export interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: {
    raw: string;
  };
  links: {
    html: string;
    download_location: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

export interface ImageSearchResponse {
  image: UnsplashImageData;
}

export interface ImageSearchErrorResponse {
  error: string;
}
