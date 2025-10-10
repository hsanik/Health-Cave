import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role } = await request.json();
    
    if (!role || !['user', 'patient', 'doctor'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('healthCave');
    const usersCollection = db.collection('users');

    // First, get the current user to check their existing role
    const currentUser = await usersCollection.findOne({ _id: new ObjectId(session.user.id) });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow role change from "user" to "patient" when booking appointment
    if (role === 'patient' && currentUser.role && currentUser.role !== 'user') {
      return NextResponse.json(
        { 
          message: 'Role change not allowed - user already has a different role',
          currentRole: currentUser.role,
          requestedRole: role
        },
        { status: 200 }
      );
    }

    // Update user role only if current role is "user" or undefined/null
    const result = await usersCollection.updateOne(
      { 
        _id: new ObjectId(session.user.id),
        $or: [
          { role: { $exists: false } },
          { role: null },
          { role: 'user' }
        ]
      },
      { 
        $set: { 
          role: role,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          message: 'Role not updated - user already has a different role',
          currentRole: currentUser.role
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Role updated successfully',
        role: role,
        previousRole: currentUser.role || 'user'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}