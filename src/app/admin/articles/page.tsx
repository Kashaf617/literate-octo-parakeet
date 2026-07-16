import { prisma } from "@/lib/prisma";
import ArticleManager from "@/components/admin/ArticleManager";

export const revalidate = 0;

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink mb-2">Articles</h1>
        <p className="text-sub">Manage blog posts, news, and guides for the storefront.</p>
      </div>
      <ArticleManager initialArticles={articles as any} />
    </div>
  );
}
