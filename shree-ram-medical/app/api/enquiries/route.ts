import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations/auth";
import { contactRequests } from "@/lib/data/enquiries";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  // In-memory only for this scaffold — a real build inserts via
  // prisma.enquiry.create() and notifies the order desk.
  contactRequests.unshift({
    id: `cr-${contactRequests.length + 1}`,
    ...parsed.data,
    status: "PENDING",
    createdAt: new Date().toISOString().slice(0, 10),
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ requests: contactRequests });
}
