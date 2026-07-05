import { NextResponse } from "next/server";
import { getAllInventory, getInventoryAlerts } from "@/lib/data/inventory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const alertsOnly = searchParams.get("alerts");
  const list = alertsOnly === "true" ? await getInventoryAlerts() : await getAllInventory();
  return NextResponse.json({ inventory: list });
}
