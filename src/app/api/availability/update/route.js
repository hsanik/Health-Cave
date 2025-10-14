import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a doctor
    const userRole = session.user.role || 'user';
    
    if (userRole !== 'doctor') {
      // Fallback: Check doctors collection
      try {
        const doctorsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
        );
        
        if (!doctorsResponse.ok) {
          return NextResponse.json(
            { message: "Access denied. Only doctors can manage availability." },
            { status: 403 }
          );
        }

        const doctors = await doctorsResponse.json();
        const doctorRecord = doctors.find(doc => doc.email === session.user.email);
        
        if (!doctorRecord) {
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
    }

    const { availability } = await request.json();

    if (!availability || !Array.isArray(availability)) {
      return NextResponse.json(
        { message: "Invalid availability data" },
        { status: 400 }
      );
    }

    // Get doctor record to find doctor ID
    const doctorsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
    );
    
    if (!doctorsResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch doctor information" },
        { status: 500 }
      );
    }

    const doctors = await doctorsResponse.json();
    const doctorRecord = doctors.find(doc => doc.email === session.user.email);
    
    if (!doctorRecord) {
      return NextResponse.json(
        { message: "Doctor record not found" },
        { status: 404 }
      );
    }

    // Call backend server to update availability
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${doctorRecord._id}/availability`,
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
