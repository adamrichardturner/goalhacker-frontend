export interface CategorizedImage {
  key: string
  url: string
  category: string
}

export interface ImagesResponse {
  images: CategorizedImage[]
  categories: string[]
  total: number
}
