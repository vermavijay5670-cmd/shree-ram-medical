import { NextResponse } from "next/server";
import { inventory, getInventoryAlerts } from "@/lib/data/inventory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const alertsOnly = searchParams.get("alerts");
  return NextResponse.json({ inventory: alertsOnly === "true" ? getInventoryAlerts() : inventory });
}
