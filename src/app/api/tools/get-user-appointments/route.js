import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (process.env.NEXT_PUBLIC_SERVER_URI) {
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/users/${session.user.id}/appointments`
        );
        if (resp.ok) {
          const data = await resp.json();
          return NextResponse.json({ appointments: data.appointments || [] });
        }
      } catch (e) {
        console.error("get-user-appointments backend error", e);
      }
    }

    // Mock
    return NextResponse.json({ appointments: [] });
  } catch (e) {
    console.error("get-user-appointments error", e);
    return NextResponse.json({ appointments: [] }, { status: 200 });
  }
}
