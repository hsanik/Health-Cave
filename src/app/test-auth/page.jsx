'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestAuth() {
    const { data: session, status } = useSession()
    const [fixResult, setFixResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const fixUserRoles = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/fix-user-roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const result = await response.json()
            setFixResult(result)
        } catch (error) {
            setFixResult({ error: error.message })
        } finally {
            setLoading(false)
        }
    }

    const debugAccounts = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/debug-accounts')
            const result = await response.json()
            setFixResult(result)
        } catch (error) {
            setFixResult({ error: error.message })
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Session Status</h2>
                    <p><strong>Status:</strong> {status}</p>
                    {session ? (
                        <div className="mt-4 space-y-2">
                            <p><strong>Name:</strong> {session.user?.name}</p>
                            <p><strong>Email:</strong> {session.user?.email}</p>
                            <p><strong>Role:</strong> {session.user?.role || 'Not set'}</p>
                            <p><strong>ID:</strong> {session.user?.id}</p>
                        </div>
                    ) : (
                        <p className="mt-4 text-red-600">Not authenticated</p>
                    )}
                </div>

                {session?.user?.role === 'admin' && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>
                        <div className="space-y-4">
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    onClick={fixUserRoles}
                                    disabled={loading}
                                >
                                    {loading ? 'Fixing...' : 'Fix User Roles'}
                                </Button>
                                
                                <Button
                                    onClick={debugAccounts}
                                    disabled={loading}
                                    variant="outline"
                                >
                                    Debug Accounts
                                </Button>
                                
                                <Button
                                    onClick={async () => {
                                        if (!confirm('This will delete all OAuth account links. Continue?')) return
                                        setLoading(true)
                                        try {
                                            const response = await fetch('/api/admin/cleanup-database', {
                                                method: 'POST'
                                            })
                                            const result = await response.json()
                                            setFixResult(result)
                                        } catch (error) {
                                            setFixResult({ error: error.message })
                                        } finally {
                                            setLoading(false)
                                        }
                                    }}
                                    disabled={loading}
                                    variant="destructive"
                                >
                                    Cleanup DB
                                </Button>
                            </div>
                            
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter email to clear OAuth accounts"
                                    className="border rounded px-3 py-2 flex-1"
                                    id="clearEmail"
                                />
                                <Button 
                                    onClick={async () => {
                                        const email = document.getElementById('clearEmail').value
                                        if (!email) return
                                        
                                        setLoading(true)
                                        try {
                                            const response = await fetch('/api/admin/clear-oauth-accounts', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ email })
                                            })
                                            const result = await response.json()
                                            setFixResult(result)
                                        } catch (error) {
                                            setFixResult({ error: error.message })
                                        } finally {
                                            setLoading(false)
                                        }
                                    }}
                                    disabled={loading}
                                    variant="outline"
                                >
                                    Clear OAuth
                                </Button>
                            </div>
                        </div>

                        {fixResult && (
                            <div className="mt-4 p-4 bg-gray-100 rounded">
                                <pre>{JSON.stringify(fixResult, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Actions</h2>
                    <div className="space-x-4">
                        <Button
                            onClick={() => window.location.href = '/login'}
                            variant="outline"
                        >
                            Go to Login
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/dashboard'}
                            variant="outline"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}