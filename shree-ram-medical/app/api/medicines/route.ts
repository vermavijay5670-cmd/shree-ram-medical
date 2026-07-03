import { NextResponse } from "next/server";
import { medicines } from "@/lib/data/medicines";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const company = searchParams.get("company");

  let list = medicines;
  if (category) list = list.filter((m) => m.categorySlug === category);
  if (company) list = list.filter((m) => m.companySlug === company);

  return NextResponse.json({ medicines: list });
}
