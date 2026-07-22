import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { useApplications } from "../api/queries";
import { formatDate } from "../lib/format";
import StatusBadge from "../components/StatusBadge";

const STATUS_OPTIONS = ["applied", "screening", "interview", "offer", "hired", "rejected"];

export default function HireSyncApplications() {
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data: applications, isPending, isError, error } = useApplications({ search, status });

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center gap-12 border-b-2 border-[#7A1315] px-8 py-5">
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
                  onBlur={() => setSearch(searchInput)}
                  className="w-full border border-neutral-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-neutral-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-neutral-300 py-3 px-3 text-sm outline-none focus:border-neutral-500"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isError && (
          <div className="mb-8 border border-[#7A1315] bg-white p-6 text-[#7A1315]">
            Failed to load applications: {error.message}
          </div>
        )}

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
              {isPending && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                    Loading applications…
                  </td>
                </tr>
              )}
              {!isPending && applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                    No applications found.
                  </td>
                </tr>
              )}
              {!isPending &&
                applications.map((a, i) => (
                  <tr
                    key={a.id}
                    className={i !== applications.length - 1 ? "border-b border-neutral-200" : ""}
                  >
                    <td className="px-6 py-5 font-bold text-[#7A1315]">
                      <Link to={`/candidates/${a.candidate_id}`} className="hover:underline">
                        {a.candidate.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5">{a.job_title}</td>
                    <td className="px-6 py-5 text-neutral-700">{a.company}</td>
                    <td className="px-6 py-5 text-neutral-700">{formatDate(a.applied_at)}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link to={`/applications/${a.id}`} className="text-neutral-500 hover:text-black">
                        <MoreHorizontal size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Footer: results count */}
          {!isPending && (
            <div className="flex items-center justify-between border-t border-neutral-300 px-6 py-4">
              <p className="text-sm text-neutral-600">
                Showing <span className="font-bold text-black">{applications.length}</span> of{" "}
                <span className="font-bold text-black">{applications.length}</span> results
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
