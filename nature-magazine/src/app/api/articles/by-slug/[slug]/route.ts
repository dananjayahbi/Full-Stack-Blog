import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    slug: string;
  };
}

// GET /api/articles/by-slug/[slug] - Fetch a specific article by slug
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    
    // Handle preview specially
    if (slug.startsWith('preview-')) {
      // In a real app, you might fetch from a temporary preview collection
      // For now, just return a success response
      return NextResponse.json({
        message: 'Preview article endpoint hit successfully', 
        slug
      });
    }

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        categories: true
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Format dates and add additional fields
    const formattedArticle = {
      ...article,
      date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : new Date(article.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readingTime: `${Math.max(1, Math.ceil(article.content.length / 1000))} min read`,
      category: article.categories.length > 0 ? article.categories[0].name : 'Uncategorized',
      relatedArticles: [] // We'll populate this in the future
    };

    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}