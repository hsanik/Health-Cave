import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { doctorId, date } = await request.json();
    if (!doctorId || !date) {
      return NextResponse.json(
        { message: "doctorId and date are required", slots: [] },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_SERVER_URI) {
      try {
        const resp = await fetch(
          `${
            process.env.NEXT_PUBLIC_SERVER_URI
          }/doctors/${doctorId}/availability?date=${encodeURIComponent(date)}`
        );
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data.slots) && data.slots.length > 0) {
            return NextResponse.json({ slots: data.slots });
          }
          // Backend returned no available slots
          return NextResponse.json({ slots: [] });
        }
      } catch (e) {
        console.error("check-availability backend error", e);
      }
    }

    // No backend configured: no slots
    return NextResponse.json({ slots: [] });
  } catch (e) {
    console.error("check-availability error", e);
    return NextResponse.json({ slots: [] }, { status: 200 });
  }
}
