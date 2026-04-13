import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yearParam = req.nextUrl.searchParams.get("year");
  const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

  const rows = await prisma.incomeRow.findMany({
    where: { userId: session.user.id, year },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { year, incomeType, incomeCategory, description } = body;

  if (!year || !incomeType || !incomeCategory) {
    return NextResponse.json(
      { error: "year, incomeType and incomeCategory are required" },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.incomeRow.aggregate({
    where: { userId: session.user.id, year, incomeType },
    _max: { order: true },
  });

  const row = await prisma.incomeRow.create({
    data: {
      userId: session.user.id,
      year,
      incomeType,
      incomeCategory,
      description: description ?? "",
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(row, { status: 201 });
}
