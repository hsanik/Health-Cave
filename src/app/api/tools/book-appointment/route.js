import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { booked: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { doctorId, date, time } = await request.json();
    if (!doctorId || !date || !time) {
      return NextResponse.json(
        { booked: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_SERVER_URI) {
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session.user.id,
              doctorId,
              date,
              time,
            }),
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          return NextResponse.json({
            booked: true,
            appointment: data.appointment,
          });
        }
      } catch (e) {
        console.error("book-appointment backend error", e);
      }
    }

    // No backend or failed: do not book
    return NextResponse.json(
      {
        booked: false,
        message: "Booking unavailable. Please try again later.",
      },
      { status: 503 }
    );
  } catch (e) {
    return NextResponse.json(
      { booked: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
