"use client";

import { useState } from "react";

type MonthKey = "jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";

const MONTHS: MonthKey[] = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_LABELS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

interface ExpenseRow {
  id: string;
  description: string;
  expenseType: "FIXED" | "VARIABLE";
  year: number;
  order: number;
  jan: number; feb: number; mar: number; apr: number;
  may: number; jun: number; jul: number; aug: number;
  sep: number; oct: number; nov: number; dec: number;
}

function rowTotal(row: ExpenseRow): number {
  return MONTHS.reduce((acc, m) => acc + (row[m] ?? 0), 0);
}

function rowMedia(row: ExpenseRow): number {
  return rowTotal(row) / 12;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// Editable cell for numeric month values
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
  rows: ExpenseRow[];
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
        <table className="w-full text-sm border-collapse" style={{ minWidth: "1100px" }}>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs w-48 min-w-[12rem]">
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
                <td colSpan={17} className="px-4 py-4 text-xs text-gray-400 text-center">
                  Sin filas. Añade una para empezar.
                </td>
              </tr>
            )}

            {/* Section totals row */}
            <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold">
              <td className="px-3 py-2 text-xs text-gray-600">{totalLabel}</td>
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

export default function GastosTable({
  initialRows,
  year,
}: {
  initialRows: ExpenseRow[];
  year: number;
}) {
  const [rows, setRows] = useState<ExpenseRow[]>(initialRows);

  const fixedRows = rows
    .filter((r) => r.expenseType === "FIXED")
    .sort((a, b) => a.order - b.order);

  const variableRows = rows
    .filter((r) => r.expenseType === "VARIABLE")
    .sort((a, b) => a.order - b.order);

  async function addRow(expenseType: "FIXED" | "VARIABLE") {
    const res = await fetch("/api/gastos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, expenseType }),
    });
    if (res.ok) {
      const newRow: ExpenseRow = await res.json();
      setRows((prev) => [...prev, newRow]);
    }
  }

  async function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/gastos/${id}`, { method: "DELETE" });
  }

  // Update local state only (for description onChange, to avoid API call on every keystroke)
  function updateLocal(id: string, field: string, value: string | number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  // Update state + persist to API (called on blur)
  async function saveField(id: string, field: string, value: string | number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    await fetch(`/api/gastos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  // Grand total calculations
  const fixedColTotals = MONTHS.map((m) => fixedRows.reduce((acc, r) => acc + (r[m] ?? 0), 0));
  const variableColTotals = MONTHS.map((m) => variableRows.reduce((acc, r) => acc + (r[m] ?? 0), 0));
  const combinedColTotals = MONTHS.map((_, i) => fixedColTotals[i] + variableColTotals[i]);
  const grandTotal = combinedColTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <Section
        title="Gastos Fijos"
        headerColor="bg-blue-600"
        totalLabel="Total gastos fijos"
        rows={fixedRows}
        onAdd={() => addRow("FIXED")}
        onDelete={deleteRow}
        onLocalUpdate={updateLocal}
        onSave={saveField}
      />

      <Section
        title="Gastos Variables"
        headerColor="bg-orange-500"
        totalLabel="Total gastos variables"
        rows={variableRows}
        onAdd={() => addRow("VARIABLE")}
        onDelete={deleteRow}
        onLocalUpdate={updateLocal}
        onSave={saveField}
      />

      {/* Grand total row */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "1100px" }}>
            <tbody>
              <tr className="bg-gray-800 text-white font-bold">
                <td className="px-3 py-3 text-xs w-48 min-w-[12rem]">TOTAL GENERAL</td>
                {combinedColTotals.map((t, i) => (
                  <td key={i} className="px-2 py-3 text-right text-xs w-[68px] tabular-nums">
                    {fmt(t)}
                  </td>
                ))}
                <td className="px-2 py-3 text-right text-xs w-20 tabular-nums text-gray-300">
                  {fmt(grandTotal / 12)}
                </td>
                <td className="px-2 py-3 text-right text-xs w-24 tabular-nums">
                  {fmt(grandTotal)}
                </td>
                <td className="w-8"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
