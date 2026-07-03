import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { orders, getOrdersForUser } from "@/lib/data/orders";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = session.user.role === "ADMIN" ? orders : getOrdersForUser(session.user.id);
  return NextResponse.json({ orders: list });
}
