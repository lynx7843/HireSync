import React from "react";

const stats = [
  { label: "TOTAL CANDIDATES", value: "1,248" },
  { label: "TOTAL APPLICATIONS", value: "856" },
  { label: "HIRED THIS MONTH", value: "24", delta: "↑ 15%", accent: true },
  { label: "REJECTION RATE", value: "12%" },
];

const pipeline = [
  { label: "Applied", count: 342, height: 20 },
  { label: "Screening", count: 215, height: 14 },
  { label: "Interview", count: 128, height: 9 },
  { label: "Offered", count: 45, height: 4 },
  { label: "Hired", count: 24, height: 2.5, active: true },
];

const applications = [
  { name: "Eleanor Vance", role: "Senior Backend Engineer", status: "Applied", date: "Oct 24, 2023" },
  { name: "Marcus Sterling", role: "Product Manager", status: "Screening", date: "Oct 24, 2023" },
  { name: "Sophia Chen", role: "UX Designer", status: "Interview", date: "Oct 23, 2023" },
  { name: "David Alaba", role: "Data Scientist", status: "Critical", date: "Oct 22, 2023" },
  { name: "Elena Rostova", role: "Frontend Developer", status: "Offered", date: "Oct 21, 2023" },
];

function StatusBadge({ status }) {
  const base = "inline-block px-3 py-1 text-sm font-medium border";
  const styles = {
    Applied: "bg-white text-neutral-700 border-neutral-300",
    Screening: "bg-neutral-200 text-neutral-800 border-neutral-300",
    Interview: "bg-white text-neutral-700 border-neutral-400",
    Critical: "bg-[#7A1315] text-white border-[#7A1315]",
    Offered: "bg-black text-white border-black",
  };
  return <span className={`${base} ${styles[status] || ""}`}>{status}</span>;
}

export default function HireSyncDashboard() {
  const maxHeight = Math.max(...pipeline.map((p) => p.height));

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center justify-between bg-[#252525] px-8 py-5">
        <div className="text-[26px] font-extrabold tracking-wide text-white">
          HIRESYNC
        </div>
        <nav className="flex items-center gap-10">
          <a
            href="#"
            className="border-b-2 border-[#7A1315] pb-2 text-[15px] font-medium text-[#D0574F]"
          >
            Dashboard
          </a>
          <a href="#" className="text-[15px] font-medium text-neutral-300 hover:text-white">
            Candidates
          </a>
          <a href="#" className="text-[15px] font-medium text-neutral-300 hover:text-white">
            Applications
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-10">
        {/* Header row */}
        <div className="mb-8 flex items-start justify-between border-b border-neutral-300 pb-6">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight">Dashboard Overview</h1>
            <p className="mt-2 text-neutral-500">High-level metrics and pipeline status.</p>
          </div>
          <button className="bg-[#7A1315] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5F0F11]">
            Generate Report
          </button>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`relative border border-neutral-300 bg-white p-6 ${
                s.accent ? "border-r-4 border-r-[#7A1315]" : ""
              }`}
            >
              <div className="mb-3 h-[3px] w-8 bg-black" />
              <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500">
                {s.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">{s.value}</span>
                {s.delta && (
                  <span className="text-sm font-semibold text-[#7A1315]">{s.delta}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Status */}
        <div className="mb-8 border border-neutral-300 bg-white p-6">
          <div className="mb-6 h-[3px] w-8 bg-black" />
          <h2 className="mb-8 text-2xl font-bold">Pipeline Status</h2>

          <div className="flex h-64 items-end gap-6 border-b border-neutral-200 px-2">
            {pipeline.map((p) => (
              <div key={p.label} className="flex flex-1 flex-col items-center justify-end h-full">
                <div
                  className={`w-full ${p.active ? "bg-black" : "bg-neutral-200"}`}
                  style={{ height: `${(p.height / maxHeight) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-6 px-2 pt-3">
            {pipeline.map((p) => (
              <div key={p.label} className="flex-1 text-center">
                <p className={`text-sm ${p.active ? "font-bold text-black" : "text-neutral-500"}`}>
                  {p.label} ({p.count})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="border border-neutral-300 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-300 px-6 py-5">
            <h2 className="text-2xl font-bold">Recent Applications</h2>
            <a href="#" className="text-sm font-semibold text-[#7A1315] hover:underline">
              View All →
            </a>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-300 text-sm text-neutral-500">
                <th className="px-6 py-3 font-medium">Candidate Name</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a, i) => (
                <tr
                  key={a.name}
                  className={i !== applications.length - 1 ? "border-b border-neutral-200" : ""}
                >
                  <td className="px-6 py-4 font-bold">{a.name}</td>
                  <td className="px-6 py-4 text-neutral-700">{a.role}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-4 text-right text-neutral-500">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
