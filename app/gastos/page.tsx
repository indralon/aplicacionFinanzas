import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import GastosTable from "./GastosTable";

export default async function GastosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = (session.user as { id: string }).id;
  const year = new Date().getFullYear();

  const rows = await prisma.expenseRow.findMany({
    where: { userId, year },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Gastos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Año {year}</p>
        </div>
      </header>
      <main className="p-6">
        <GastosTable initialRows={rows as Parameters<typeof GastosTable>[0]["initialRows"]} year={year} />
      </main>
    </div>
  );
}
