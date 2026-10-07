/** Locally authored articles share the Blog reader; the guide has its own layout.
 * Add only approved, finished copy here. Substack entries stay in data.ts.
 */
export type NativeArticle = {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  paragraphs: string[]
}
export const nativeArticles: NativeArticle[] = []
