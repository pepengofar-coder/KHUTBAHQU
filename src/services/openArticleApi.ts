/**
 * Open Article API Service for Islamediaku
 * Prepared for querying Wikimedia/Wikipedia API or retrieving open-access journals.
 */

import { DummyArticle, DUMMY_ARTICLES } from '../data/articleCategories';

/**
 * Searches and lists articles from the open/dummy storage
 */
export async function getOpenArticles(
  query?: string,
  categoryId?: string
): Promise<DummyArticle[]> {
  console.log(`[openArticleApi] getOpenArticles called with query: "${query || ''}", category: "${categoryId || ''}"`);
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let results = [...DUMMY_ARTICLES];
  
  if (categoryId) {
    results = results.filter(article => article.category === categoryId);
  }
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(article => 
      article.title.toLowerCase().includes(q) || 
      article.summary.toLowerCase().includes(q) || 
      article.content.toLowerCase().includes(q)
    );
  }
  
  return results;
}

/**
 * Gets a single article detail by its slug
 */
export async function getArticleBySlug(slug: string): Promise<DummyArticle | null> {
  console.log(`[openArticleApi] getArticleBySlug called for slug: ${slug}`);
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const article = DUMMY_ARTICLES.find(a => a.slug === slug);
  return article || null;
}
