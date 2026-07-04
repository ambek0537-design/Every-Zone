export interface UploadedMedia {
  id: string;
  url: string;
  type: "photo" | "video";
  uploadedAt: Date;
}

export function validateMediaUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/") || url.startsWith("data:video/");
}
