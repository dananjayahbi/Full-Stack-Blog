import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/categories - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Add article count to each category
    const categoriesWithCounts = categories.map(category => ({
      ...category,
      articleCount: category.articleIds.length
    }));

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admin can create categories
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be an admin to create categories' },
        { status: 401 }
      );
    }

    const { name, slug, description, image } = await request.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name or slug already exists' },
        { status: 409 }
      );
    }

    // Create the category
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image: image || '/images/placeholder.jpg',
        articleIds: []
      }
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}