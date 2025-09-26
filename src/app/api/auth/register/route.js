import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;

    // specific database name
    const db = client.db("healthCave");
    const usersCollection = db.collection("users");
    const otpCollection = db.collection("otps");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Check if email is verified
    const otpRecord = await otpCollection.findOne({ email, verified: true });
    if (!otpRecord) {
      return new Response(JSON.stringify({ error: "Email not verified. Please verify your email first." }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      name: firstName + " " + lastName,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    // Clean up OTP record after successful registration
    await otpCollection.deleteOne({ email });

    // Send welcome email
    try {
      await sendWelcomeEmail(email, newUser.name);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail registration if email fails
    }

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
