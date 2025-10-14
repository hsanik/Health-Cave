import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a doctor by using the check endpoint
    let doctorId = session.user.id; // Default to session user ID
    try {
      const doctorResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URI
        }/doctors/check-by-email/${encodeURIComponent(session.user.email)}`
      );
      if (doctorResponse.ok) {
        const data = await doctorResponse.json();
        if (!data.isDoctor) {
          return NextResponse.json(
            { message: "Access denied. Only doctors can manage availability." },
            { status: 403 }
          );
        }
        // Use the doctor's _id for the availability update
        doctorId = data.doctor._id;
      } else {
        return NextResponse.json(
          { message: "Access denied. Only doctors can manage availability." },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Error verifying doctor status:", error);
      return NextResponse.json(
        { message: "Access denied. Only doctors can manage availability." },
        { status: 403 }
      );
    }

    const { availability } = await request.json();

    if (!availability || !Array.isArray(availability)) {
      return NextResponse.json(
        { message: "Invalid availability data" },
        { status: 400 }
      );
    }

    // Call backend server to update availability
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${doctorId}/availability`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availability }),
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(
        { message: error.error || "Failed to update availability" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(
      { message: "Availability updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
