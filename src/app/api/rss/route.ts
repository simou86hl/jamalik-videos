import { NextResponse } from 'next/server';
import { ARTICLES } from '@/data/seedData';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

export async function GET() {
  const siteUrl = SITE_URL;

  // Get the 10 latest articles
  const latestArticles = [...ARTICLES]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);

  const rssItems = latestArticles
    .map((article) => {
      const articleUrl = `${siteUrl}/#/article/${article.id}`;
      const pubDate = new Date(article.publishedAt).toUTCString();
      const categoryNames: Record<string, string> = {
        fashion: 'الموضة',
        cooking: 'الطبخ',
        skincare: 'البشرة',
        haircare: 'الشعر',
        fitness: 'اللياقة',
        beauty: 'التجميل',
        health: 'الصحة',
        natural: 'وصفات طبيعية',
      };

      return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${categoryNames[article.category] || article.category}</category>
      <guid isPermaLink="true">${articleUrl}</guid>
    </item>`;
    })
    .join('\n');

  const lastBuildDate = latestArticles.length > 0
    ? new Date(latestArticles[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" dir="rtl">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${siteUrl}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>ar</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    <generator>جمالكِ - Jamalik</generator>
    <managingEditor>hello@jamalik.app (جمالكِ)</managingEditor>
    <webMaster>hello@jamalik.app (جمالكِ)</webMaster>
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
