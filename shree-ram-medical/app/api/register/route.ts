import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { users, getUserByEmail } from "@/lib/data/users";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, businessName, email, password, role, gstNumber, city } = parsed.data;

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  // In-memory only — resets when the server restarts. A real build calls
  // prisma.user.create() with a bcrypt-hashed password here instead.
  users.push({
    id: `user-${users.length + 1}`,
    name,
    businessName,
    email,
    password,
    role,
    gstNumber,
    city,
  });

  return NextResponse.json({ ok: true });
}
