import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { companyFormSchema } from "@/lib/validations/company";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "No database connected yet. Set DATABASE_URL and redeploy before adding companies." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsed = companyFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const slug = slugify(data.name);

  const existing = await prisma.company.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: `A company with the slug "${slug}" already exists` }, { status: 409 });
  }

  const company = await prisma.company.create({
    data: {
      name: data.name,
      slug,
      segment: data.segment,
      country: data.country,
      foundedYear: data.foundedYear,
      description: data.description,
      website: data.website || undefined,
      isDomestic: data.isDomestic,
      isPopular: data.isPopular,
      officeAddress: data.officeAddress || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
    },
  });

  return NextResponse.json({ ok: true, slug: company.slug }, { status: 201 });
}
