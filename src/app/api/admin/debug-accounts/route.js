import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'

export async function GET(request) {
    try {
        // Check if user is admin
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adminEmails = [
            'admin@healthcave.com',
            'admin@example.com',
            'admin@gmail.com'
        ]

        if (!adminEmails.includes(session.user.email)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const client = await clientPromise
        const db = client.db("healthCave")
        const usersCollection = db.collection("users")
        const accountsCollection = db.collection("accounts")

        // Get all users and their linked accounts
        const users = await usersCollection.find({}).toArray()
        const accounts = await accountsCollection.find({}).toArray()

        // Group accounts by userId
        const accountsByUser = {}
        accounts.forEach(account => {
            const userId = account.userId.toString()
            if (!accountsByUser[userId]) {
                accountsByUser[userId] = []
            }
            accountsByUser[userId].push({
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type
            })
        })

        // Combine user data with account data
        const userAccountData = users.map(user => ({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            accounts: accountsByUser[user._id.toString()] || []
        }))

        return NextResponse.json({
            users: userAccountData,
            totalUsers: users.length,
            totalAccounts: accounts.length
        })

    } catch (error) {
        console.error('Error debugging accounts:', error)
        return NextResponse.json(
            { error: 'Failed to debug accounts' },
            { status: 500 }
        )
    }
}