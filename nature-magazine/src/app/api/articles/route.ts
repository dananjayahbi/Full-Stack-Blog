import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Default admin ID from auth config
const DEFAULT_ADMIN_ID = "default-admin-id";

// GET /api/articles - Fetch all articles
export async function GET(request: NextRequest) {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admin can create articles
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be an admin to create articles' },
        { status: 401 }
      );
    }

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

    // Validate required fields
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Title, slug, excerpt, and content are required' },
        { status: 400 }
      );
    }

    // Check if article with same slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 409 }
      );
    }

    // Handle default admin user or get author ID from token
    let authorId;
    
    // For default admin, we need to find or create a valid user record
    if (token.id === DEFAULT_ADMIN_ID) {
      // Try to find an existing admin user
      const adminUser = await prisma.user.findFirst({
        where: {
          role: 'admin'
        }
      });
      
      if (adminUser) {
        // Use existing admin user
        authorId = adminUser.id;
      } else {
        // Create a new admin user with a valid MongoDB ObjectID
        const newAdminUser = await prisma.user.create({
          data: {
            email: "admin@example.com",
            name: "Admin User",
            password: "hashed_password_placeholder", // In production, use bcrypt to hash
            role: "admin",
          }
        });
        authorId = newAdminUser.id;
      }
    } else {
      // Normal case - use token user ID 
      authorId = token.id as string;
      
      // If author email is provided, try to find matching user
      if (author && author !== token.email) {
        const authorUser = await prisma.user.findUnique({
          where: { email: author }
        });
        
        if (authorUser) {
          authorId = authorUser.id;
        }
      }
    }

    // Create the article
    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage: featuredImage || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
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

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}