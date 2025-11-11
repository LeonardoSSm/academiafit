export default function Table({ columns = [], data = [] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
      <table className="min-w-full divide-y divide-slate-100 text-sm text-slate-700">
        <thead className="bg-gradient-to-r from-brand-50 to-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-4 text-left">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length ? (
            data.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50/80">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-middle">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-500">
                Sem dados no momento.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
