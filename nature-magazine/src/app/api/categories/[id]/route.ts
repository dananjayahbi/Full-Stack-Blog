import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/categories/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Add article count
    const categoryWithCount = {
      ...category,
      articleCount: category.articleIds.length
    };

    return NextResponse.json(categoryWithCount);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated as admin
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be an admin to update categories' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { name, slug, description, image } = await request.json();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name or slug already taken by another category
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ],
        NOT: { id }
      }
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'Another category with this name or slug already exists' },
        { status: 409 }
      );
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated as admin
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be an admin to delete categories' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}