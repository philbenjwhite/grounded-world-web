import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { interest, firstName, lastName, email, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Wire up to an email service (Resend, SendGrid, etc.)
    // For now, log the submission and return success.
    console.log("[Contact Form Submission]", {
      interest,
      firstName,
      lastName,
      email,
      company: body.company,
      jobTitle: body.jobTitle,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
