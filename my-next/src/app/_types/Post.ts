import { Category } from './Category'

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  postCategories: { category: Category }[]
  thumbnailImageKey: string
}
