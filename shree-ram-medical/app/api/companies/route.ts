import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/data/companies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const popular = searchParams.get("popular");
  const companies = await getCompanies();
  const list = popular === "true" ? companies.filter((c) => c.isPopular) : companies;
  return NextResponse.json({ companies: list });
}
