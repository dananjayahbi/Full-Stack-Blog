import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Default admin ID from auth config
const DEFAULT_ADMIN_ID = "default-admin-id";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/articles/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Await params before accessing properties
    const id = (await params).id;
    
    const article = await prisma.article.findUnique({
      where: { id },
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

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id] - Update an article
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check authentication - only admin can update articles
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be an admin to update articles' },
        { status: 401 }
      );
    }

    // Await params before accessing properties
    const id = (await params).id;
    
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      published,
      categories,
      tags,
      author
    } = await request.json();

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if slug is taken by another article
    if (slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Another article with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Handle default admin user or get author ID
    let authorId = existingArticle.authorId;
    
    // If author is provided, handle different possible formats
    if (author) {
      // Check if author is an object or a string
      const authorEmail = typeof author === 'object' && author !== null
        ? author.email  // Extract email if it's an object
        : author;       // Use directly if it's already a string
      
      if (authorEmail && typeof authorEmail === 'string') {
        const authorUser = await prisma.user.findUnique({
          where: { email: authorEmail }
        });
        
        if (authorUser) {
          authorId = authorUser.id;
        }
      }
    }

    // Handle publish state changes
    let publishedAt = existingArticle.publishedAt;
    if (published && !existingArticle.published) {
      publishedAt = new Date();
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        published,
        publishedAt,
        authorId,
        categoryIds: categories || [],
        tags: tags || []
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: true
      }
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete an article
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check authentication - only admin can delete articles
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be an admin to delete articles' },
        { status: 401 }
      );
    }

    // Special case for default admin ID - no additional check needed
    // since we're only checking if they're an admin

    // Await params before accessing properties
    const id = (await params).id;
    
    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Delete the article
    await prisma.article.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}