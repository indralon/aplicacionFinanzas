import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.settings.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ irpfRate: settings?.irpfRate ?? 0 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { irpfRate } = body;

  if (typeof irpfRate !== "number" || irpfRate < 0 || irpfRate > 100) {
    return NextResponse.json({ error: "irpfRate must be a number between 0 and 100" }, { status: 400 });
  }

  const settings = await prisma.settings.upsert({
    where: { userId: session.user.id },
    update: { irpfRate },
    create: { userId: session.user.id, irpfRate },
  });

  return NextResponse.json({ irpfRate: settings.irpfRate });
}
