import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import IngresosTable from "./IngresosTable";
import YearSelector from "@/app/components/YearSelector";

export default async function IngresosPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { year: yearParam } = await searchParams;
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

  const userId = (session.user as { id: string }).id;

  const [rows, settings] = await Promise.all([
    prisma.incomeRow.findMany({
      where: { userId, year },
      orderBy: { order: "asc" },
    }),
    prisma.settings.findUnique({ where: { userId } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
          <h1 className="text-base font-semibold text-gray-800">Finanzas personales</h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <YearSelector year={year} />
            <nav className="flex items-center gap-1">
              <a
                href={`/gastos?year=${year}`}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Gastos
              </a>
              <a
                href={`/ingresos?year=${year}`}
                className="px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg"
              >
                Ingresos
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6">
        <IngresosTable
          initialRows={rows as Parameters<typeof IngresosTable>[0]["initialRows"]}
          initialIrpfRate={settings?.irpfRate ?? 0}
          year={year}
        />
      </main>
    </div>
  );
}
