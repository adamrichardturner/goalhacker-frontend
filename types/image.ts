export interface Image {
  id: string
  url: string
  category?: string
  name?: string
}

export interface ImageCategory {
  name: string
  images: Image[]
}

export type UploadImageResponse = {
  url: string
  id: string
}
