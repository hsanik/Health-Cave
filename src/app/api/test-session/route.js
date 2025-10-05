import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)

        return NextResponse.json({
            hasSession: !!session,
            session: session,
            userId: session?.user?.id || null
        }, { status: 200 })
    } catch (error) {
        console.error('Error in test session:', error)
        return NextResponse.json({
            error: error.message,
            hasSession: false
        }, { status: 500 })
    }
}