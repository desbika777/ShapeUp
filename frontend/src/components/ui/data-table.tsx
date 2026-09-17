// Tabela generica usada nos CRUDs de planos, alunos e treinos.
type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
};

export function DataTable<T extends { id: string }>({ columns, rows }: DataTableProps<T>) {
  const renderCell = (row: T, column: Column<T>) => (
    // render permite customizar celulas como status, dinheiro e acoes.
    column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="divide-y divide-slate-100 md:hidden">
        {rows.map((row) => (
          <article key={row.id} className="space-y-4 p-4">
            {columns.map((column) => (
              <div key={String(column.key)} className="grid gap-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{column.label}</dt>
                <dd className="min-w-0 break-words text-sm font-medium text-slateblue">{renderCell(row, column)}</dd>
              </div>
            ))}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-5 py-4 font-semibold">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="text-slateblue transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-5 py-4 align-top">
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
