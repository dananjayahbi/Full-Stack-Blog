import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get session token from the request
    const token = await getToken({ req: request });
    
    // Check if user is authenticated and has admin role
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized: You must be an admin to perform this action' 
      }, { status: 401 });
    }
    
    // Test the database connection using a method compatible with MongoDB
    // We'll just try to find a user document - this is safe even if no users exist yet
    await prisma.user.findFirst({
      select: { id: true },
      take: 1
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection is working properly'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to the database. Please check your database configuration.'
      },
      { status: 500 }
    );
  }
}