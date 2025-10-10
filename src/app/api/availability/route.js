import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { specialty, date } = await request.json()

    if (!specialty || !date) {
      return NextResponse.json({ message: 'specialty and date are required' }, { status: 400 })
    }

    // If there is a backend, proxy to it; otherwise return no slots
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/availability/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ specialty, date })
        })

        if (resp.ok) {
          const data = await resp.json()
          return NextResponse.json({ slots: Array.isArray(data.slots) ? data.slots : [] })
        }
      } catch (e) {
        console.error('availability proxy error', e)
      }
    }

    // No backend configured or failed: return empty list
    return NextResponse.json({ slots: [] })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}


