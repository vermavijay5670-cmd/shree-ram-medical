import { NextResponse } from "next/server";
import { companies } from "@/lib/data/companies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const popular = searchParams.get("popular");
  const list = popular === "true" ? companies.filter((c) => c.isPopular) : companies;
  return NextResponse.json({ companies: list });
}
