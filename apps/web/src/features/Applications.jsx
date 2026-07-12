import React from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, MoreHorizontal, Plus } from "lucide-react";

const applications = [
  {
    candidate: "Sarah Jenkins",
    job: "Senior Frontend Engineer",
    company: "TechNova Inc.",
    date: "Oct 12, 2023",
    status: "Interview",
  },
  {
    candidate: "Michael Chen",
    job: "Product Manager",
    company: "Global Synergies",
    date: "Oct 10, 2023",
    status: "Screening",
  },
  {
    candidate: "Elena Rodriguez",
    job: "UX Designer",
    company: "Creative Bloc",
    date: "Oct 08, 2023",
    status: "Rejected",
  },
  {
    candidate: "David Kim",
    job: "Data Scientist",
    company: "Quantile Analytics",
    date: "Oct 05, 2023",
    status: "Applied",
  },
  {
    candidate: "Aisha Patel",
    job: "DevOps Engineer",
    company: "CloudScale",
    date: "Oct 01, 2023",
    status: "Offered",
  },
];

function StatusBadge({ status }) {
  const base = "inline-block px-3 py-1 text-xs font-semibold tracking-wide";
  const styles = {
    Interview: "bg-white text-neutral-800 border border-neutral-400",
    Screening: "bg-neutral-200 text-neutral-800",
    Rejected: "bg-[#7A1315] text-white",
    Applied: "bg-black text-white",
    Offered: "bg-white text-neutral-800 border border-neutral-400",
  };
  return <span className={`${base} ${styles[status] || ""}`}>{status.toUpperCase()}</span>;
}

export default function HireSyncApplications() {
  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center justify-between border-b-2 border-[#7A1315] px-8 py-5">
        <div className="text-[26px] font-extrabold tracking-wide text-[#7A1315]">
          HIRESYNC
        </div>
        <nav className="flex items-center gap-10">
          <Link to="/dashboard" className="text-[15px] font-medium text-neutral-500 hover:text-black">
            Dashboard
          </Link>
          <Link to="/candidates" className="text-[15px] font-medium text-neutral-500 hover:text-black">
            Candidates
          </Link>
          <Link to="/applications" className="text-[15px] font-bold text-black underline underline-offset-8">
            Applications
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-10">
        {/* Header row */}
        <div className="mb-8 flex items-start justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight">Applications</h1>
          <button className="flex items-center gap-2 bg-[#7A1315] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5F0F11]">
            <Plus size={16} strokeWidth={3} />
            New Application
          </button>
        </div>

        {/* Filter bar */}
        <div className="mb-8 border border-neutral-300 bg-white p-6">
          <div className="flex items-end gap-6">
            <div className="flex-[1.6]">
              <label className="mb-2 block text-sm font-semibold">Search</label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Search by job, company, or candidate..."
                  className="w-full border border-neutral-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-neutral-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold">Status</label>
              <select className="w-full border border-neutral-300 py-3 px-3 text-sm outline-none focus:border-neutral-500">
                <option>All Statuses</option>
                <option>Applied</option>
                <option>Screening</option>
                <option>Interview</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold">Applied Date</label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="date"
                  className="w-full border border-neutral-300 py-3 pl-9 pr-3 text-sm text-neutral-500 outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Applications table */}
        <div className="border-t-2 border-black bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-300 text-xs tracking-widest text-neutral-500">
                <th className="px-6 py-4 font-semibold">CANDIDATE</th>
                <th className="px-6 py-4 font-semibold">JOB TITLE</th>
                <th className="px-6 py-4 font-semibold">COMPANY</th>
                <th className="px-6 py-4 font-semibold">DATE APPLIED</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 text-right font-semibold">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a, i) => (
                <tr
                  key={a.candidate}
                  className={i !== applications.length - 1 ? "border-b border-neutral-200" : ""}
                >
                  <td className="px-6 py-5 font-bold text-[#7A1315]">{a.candidate}</td>
                  <td className="px-6 py-5">{a.job}</td>
                  <td className="px-6 py-5 text-neutral-700">{a.company}</td>
                  <td className="px-6 py-5 text-neutral-700">{a.date}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-neutral-500 hover:text-black">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer: results + pagination */}
          <div className="flex items-center justify-between border-t border-neutral-300 px-6 py-4">
            <p className="text-sm text-neutral-600">
              Showing <span className="font-bold text-black">1</span> to{" "}
              <span className="font-bold text-black">5</span> of{" "}
              <span className="font-bold text-black">97</span> results
            </p>
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-500 hover:bg-neutral-50">
                ‹
              </button>
              <button className="flex h-9 w-9 items-center justify-center bg-black text-sm font-semibold text-white">
                1
              </button>
              <button className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-sm hover:bg-neutral-50">
                2
              </button>
              <button className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-sm hover:bg-neutral-50">
                3
              </button>
              <span className="px-1 text-neutral-400">…</span>
              <button className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-sm hover:bg-neutral-50">
                10
              </button>
              <button className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-500 hover:bg-neutral-50">
                ›
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
