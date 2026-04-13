"use client";

import { useState } from "react";

type MonthKey = "jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";

const MONTHS: MonthKey[] = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_LABELS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

type IncomeCategory = "SALARY" | "INTEREST" | "DIVIDEND" | "RENTAL" | "OTHER";

const CATEGORY_LABELS: Record<IncomeCategory, string> = {
  SALARY: "Salario",
  INTEREST: "Intereses",
  DIVIDEND: "Dividendos",
  RENTAL: "Alquiler",
  OTHER: "Otros",
};

interface IncomeRow {
  id: string;
  description: string;
  incomeType: "NET" | "GROSS";
  incomeCategory: IncomeCategory;
  year: number;
  order: number;
  jan: number; feb: number; mar: number; apr: number;
  may: number; jun: number; jul: number; aug: number;
  sep: number; oct: number; nov: number; dec: number;
}

function rowTotal(row: IncomeRow): number {
  return MONTHS.reduce((acc, m) => acc + (row[m] ?? 0), 0);
}

function rowMedia(row: IncomeRow): number {
  return rowTotal(row) / 12;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function NumberCell({
  value,
  onSave,
}: {
  value: number;
  onSave: (v: number) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  return (
    <input
      type="text"
      inputMode="decimal"
      className="w-full text-right bg-transparent focus:bg-blue-50 focus:outline-none rounded px-1 py-0.5 text-xs tabular-nums text-gray-900"
      value={focused ? draft : fmt(value)}
      onFocus={() => {
        setFocused(true);
        setDraft(value === 0 ? "" : String(value));
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        setFocused(false);
        const parsed = parseFloat(draft.replace(",", "."));
        onSave(isNaN(parsed) ? 0 : parsed);
      }}
    />
  );
}

interface SectionProps {
  title: string;
  headerColor: string;
  totalLabel: string;
  rows: IncomeRow[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onLocalUpdate: (id: string, field: string, value: string | number) => void;
  onSave: (id: string, field: string, value: string | number) => void;
}

function Section({
  title,
  headerColor,
  totalLabel,
  rows,
  onAdd,
  onDelete,
  onLocalUpdate,
  onSave,
}: SectionProps) {
  const colTotals = MONTHS.map((m) => rows.reduce((acc, r) => acc + (r[m] ?? 0), 0));
  const sectionTotal = colTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className={`${headerColor} px-4 py-2.5`}>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" style={{ minWidth: "1200px" }}>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs w-32 min-w-[8rem]">
                Categoría
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs w-44 min-w-[11rem]">
                Descripción
              </th>
              {MONTH_LABELS.map((label) => (
                <th key={label} className="text-right px-2 py-2 font-medium text-gray-500 text-xs w-[68px]">
                  {label}
                </th>
              ))}
              <th className="text-right px-2 py-2 font-medium text-gray-500 text-xs w-20">MEDIA</th>
              <th className="text-right px-2 py-2 font-medium text-gray-500 text-xs w-24">TOTAL</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 group">
                <td className="px-2 py-1">
                  <select
                    className="w-full bg-transparent focus:bg-blue-50 focus:outline-none rounded px-1 py-0.5 text-xs text-gray-700 cursor-pointer"
                    value={row.incomeCategory}
                    onChange={(e) => onSave(row.id, "incomeCategory", e.target.value)}
                  >
                    {(Object.entries(CATEGORY_LABELS) as [IncomeCategory, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent focus:bg-blue-50 focus:outline-none rounded px-1 py-0.5 text-xs text-gray-900 placeholder-gray-400"
                    value={row.description}
                    placeholder="Descripción..."
                    onChange={(e) => onLocalUpdate(row.id, "description", e.target.value)}
                    onBlur={(e) => onSave(row.id, "description", e.target.value)}
                  />
                </td>
                {MONTHS.map((m) => (
                  <td key={m} className="px-1 py-1">
                    <NumberCell
                      value={row[m] ?? 0}
                      onSave={(v) => onSave(row.id, m, v)}
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-right text-xs text-gray-400 tabular-nums">
                  {fmt(rowMedia(row))}
                </td>
                <td className="px-2 py-1 text-right text-xs font-medium text-gray-700 tabular-nums">
                  {fmt(rowTotal(row))}
                </td>
                <td className="px-1 py-1 text-center">
                  <button
                    onClick={() => onDelete(row.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                    title="Eliminar fila"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={18} className="px-4 py-4 text-xs text-gray-400 text-center">
                  Sin filas. Añade una para empezar.
                </td>
              </tr>
            )}

            {/* Section totals row */}
            <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold">
              <td colSpan={2} className="px-3 py-2 text-xs text-gray-600">{totalLabel}</td>
              {colTotals.map((t, i) => (
                <td key={i} className="px-2 py-2 text-right text-xs text-gray-700 tabular-nums">
                  {fmt(t)}
                </td>
              ))}
              <td className="px-2 py-2 text-right text-xs text-gray-500 tabular-nums">
                {fmt(sectionTotal / 12)}
              </td>
              <td className="px-2 py-2 text-right text-xs font-bold text-gray-800 tabular-nums">
                {fmt(sectionTotal)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={onAdd}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
        >
          <span className="text-base leading-none font-light">+</span> Añadir fila
        </button>
      </div>
    </div>
  );
}

// IRPF settings panel
function IrpfPanel({
  irpfRate,
  grossTotal,
  onRateChange,
}: {
  irpfRate: number;
  grossTotal: number;
  onRateChange: (rate: number) => void;
}) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const irpfAmount = grossTotal * (irpfRate / 100);
  const grossAfterIrpf = grossTotal - irpfAmount;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-amber-600 px-4 py-2.5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">IRPF sobre ingresos brutos</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-100">Tipo IRPF:</span>
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              className="w-16 text-right bg-amber-500 text-white placeholder-amber-200 focus:bg-amber-400 focus:outline-none rounded px-2 py-1 text-xs tabular-nums font-semibold"
              value={focused ? draft : fmt(irpfRate)}
              onFocus={() => {
                setFocused(true);
                setDraft(irpfRate === 0 ? "" : String(irpfRate));
              }}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                setFocused(false);
                const parsed = parseFloat(draft.replace(",", "."));
                onRateChange(isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed)));
              }}
            />
            <span className="text-xs text-amber-100 font-semibold">%</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: "1200px" }}>
          <tbody>
            <tr className="border-b border-gray-100">
              <td colSpan={14} className="px-3 py-2.5 text-xs text-gray-500">Total ingresos brutos</td>
              <td className="px-2 py-2.5 text-right text-xs text-gray-500 tabular-nums w-20">
                {fmt(grossTotal / 12)}
              </td>
              <td className="px-2 py-2.5 text-right text-xs text-gray-700 tabular-nums w-24">
                {fmt(grossTotal)}
              </td>
              <td className="w-8"></td>
            </tr>
            <tr className="border-b border-gray-100">
              <td colSpan={14} className="px-3 py-2.5 text-xs text-red-500">
                − IRPF ({fmt(irpfRate)} %)
              </td>
              <td className="px-2 py-2.5 text-right text-xs text-red-400 tabular-nums">
                {fmt(irpfAmount / 12)}
              </td>
              <td className="px-2 py-2.5 text-right text-xs font-medium text-red-500 tabular-nums">
                {fmt(irpfAmount)}
              </td>
              <td></td>
            </tr>
            <tr className="bg-amber-50">
              <td colSpan={14} className="px-3 py-2.5 text-xs font-semibold text-amber-800">
                Ingresos brutos netos (tras IRPF)
              </td>
              <td className="px-2 py-2.5 text-right text-xs text-amber-700 tabular-nums font-semibold">
                {fmt(grossAfterIrpf / 12)}
              </td>
              <td className="px-2 py-2.5 text-right text-xs font-bold text-amber-800 tabular-nums">
                {fmt(grossAfterIrpf)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function IngresosTable({
  initialRows,
  initialIrpfRate,
  year,
}: {
  initialRows: IncomeRow[];
  initialIrpfRate: number;
  year: number;
}) {
  const [rows, setRows] = useState<IncomeRow[]>(initialRows);
  const [irpfRate, setIrpfRate] = useState(initialIrpfRate);

  const netRows = rows
    .filter((r) => r.incomeType === "NET")
    .sort((a, b) => a.order - b.order);

  const grossRows = rows
    .filter((r) => r.incomeType === "GROSS")
    .sort((a, b) => a.order - b.order);

  async function addRow(incomeType: "NET" | "GROSS") {
    const res = await fetch("/api/ingresos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, incomeType, incomeCategory: "SALARY" }),
    });
    if (res.ok) {
      const newRow: IncomeRow = await res.json();
      setRows((prev) => [...prev, newRow]);
    }
  }

  async function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/ingresos/${id}`, { method: "DELETE" });
  }

  function updateLocal(id: string, field: string, value: string | number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function saveField(id: string, field: string, value: string | number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    await fetch(`/api/ingresos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  async function saveIrpfRate(rate: number) {
    setIrpfRate(rate);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ irpfRate: rate }),
    });
  }

  // Totals
  const netColTotals = MONTHS.map((m) => netRows.reduce((acc, r) => acc + (r[m] ?? 0), 0));
  const grossColTotals = MONTHS.map((m) => grossRows.reduce((acc, r) => acc + (r[m] ?? 0), 0));

  const netTotal = netColTotals.reduce((a, b) => a + b, 0);
  const grossTotal = grossColTotals.reduce((a, b) => a + b, 0);
  const irpfAmount = grossTotal * (irpfRate / 100);
  const grossAfterIrpf = grossTotal - irpfAmount;
  const grandTotal = netTotal + grossAfterIrpf;

  const grandColTotals = MONTHS.map((_, i) => {
    const netCol = netColTotals[i];
    const grossCol = grossColTotals[i];
    return netCol + grossCol * (1 - irpfRate / 100);
  });

  return (
    <div className="space-y-6">
      <Section
        title="Ingresos Netos"
        headerColor="bg-emerald-600"
        totalLabel="Total ingresos netos"
        rows={netRows}
        onAdd={() => addRow("NET")}
        onDelete={deleteRow}
        onLocalUpdate={updateLocal}
        onSave={saveField}
      />

      <Section
        title="Ingresos Brutos"
        headerColor="bg-teal-600"
        totalLabel="Total ingresos brutos"
        rows={grossRows}
        onAdd={() => addRow("GROSS")}
        onDelete={deleteRow}
        onLocalUpdate={updateLocal}
        onSave={saveField}
      />

      <IrpfPanel
        irpfRate={irpfRate}
        grossTotal={grossTotal}
        onRateChange={saveIrpfRate}
      />

      {/* Grand total */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "1200px" }}>
            <tbody>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td colSpan={2} className="px-3 py-2.5 text-xs text-gray-600">Total ingresos netos</td>
                {netColTotals.map((t, i) => (
                  <td key={i} className="px-2 py-2.5 text-right text-xs text-gray-500 tabular-nums w-[68px]">
                    {fmt(t)}
                  </td>
                ))}
                <td className="px-2 py-2.5 text-right text-xs text-gray-500 tabular-nums w-20">
                  {fmt(netTotal / 12)}
                </td>
                <td className="px-2 py-2.5 text-right text-xs text-gray-700 tabular-nums w-24">
                  {fmt(netTotal)}
                </td>
                <td className="w-8"></td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td colSpan={2} className="px-3 py-2.5 text-xs text-gray-600">Ingresos brutos netos (tras IRPF)</td>
                {MONTHS.map((_, i) => (
                  <td key={i} className="px-2 py-2.5 text-right text-xs text-gray-500 tabular-nums">
                    {fmt(grossColTotals[i] * (1 - irpfRate / 100))}
                  </td>
                ))}
                <td className="px-2 py-2.5 text-right text-xs text-gray-500 tabular-nums">
                  {fmt(grossAfterIrpf / 12)}
                </td>
                <td className="px-2 py-2.5 text-right text-xs text-gray-700 tabular-nums">
                  {fmt(grossAfterIrpf)}
                </td>
                <td></td>
              </tr>
              <tr className="bg-gray-800 text-white font-bold">
                <td colSpan={2} className="px-3 py-3 text-xs">TOTAL INGRESOS</td>
                {grandColTotals.map((t, i) => (
                  <td key={i} className="px-2 py-3 text-right text-xs tabular-nums">
                    {fmt(t)}
                  </td>
                ))}
                <td className="px-2 py-3 text-right text-xs tabular-nums text-gray-300">
                  {fmt(grandTotal / 12)}
                </td>
                <td className="px-2 py-3 text-right text-xs tabular-nums">
                  {fmt(grandTotal)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
