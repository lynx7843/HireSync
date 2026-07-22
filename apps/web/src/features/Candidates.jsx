import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, MoreVertical, Plus, User } from "lucide-react";
import { useCandidates } from "../api/queries";
import { initialsFromName } from "../lib/format";
import StatusBadge from "../components/StatusBadge";

const STATUS_OPTIONS = ["applied", "screening", "interview", "offer", "hired", "rejected"];

export default function HireSyncCandidates() {
  const [searchInput, setSearchInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", location: "" });

  const { data: candidates, isPending, isError, error } = useCandidates(filters);

  const applyFilters = () => {
    setFilters({ search: searchInput, status: statusInput, location: locationInput });
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-8 py-5">
        <div className="text-[26px] font-extrabold tracking-wide text-[#7A1315]">
          HIRESYNC
        </div>
        <nav className="flex items-center gap-10">
          <Link to="/dashboard" className="text-[15px] font-medium text-neutral-500 hover:text-black">
            Dashboard
          </Link>
          <Link
            to="/candidates"
            className="border-b-2 border-[#7A1315] pb-2 text-[15px] font-semibold text-[#7A1315]"
          >
            Candidates
          </Link>
          <Link to="/applications" className="text-[15px] font-medium text-neutral-500 hover:text-black">
            Applications
          </Link>
        </nav>
        <div className="w-[110px]" />
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-10">
        {/* Header row */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight">Candidates Directory</h1>
            <p className="mt-2 text-neutral-500">Manage and filter executive candidates.</p>
          </div>
          <Link
            to="/candidates/new"
            className="flex items-center gap-2 bg-[#7A1315] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5F0F11]"
          >
            <Plus size={16} strokeWidth={3} />
            Add Candidate
          </Link>
        </div>

        {/* Filter bar */}
        <div className="mb-8 border border-neutral-300 bg-white p-6">
          <div className="flex items-end gap-6">
            <div className="flex-[1.4]">
              <label className="mb-2 block text-sm font-semibold">Search Name</label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                  className="w-full border border-neutral-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-neutral-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold">Status</label>
              <div className="relative">
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full appearance-none border border-neutral-300 py-3 px-3 text-sm outline-none focus:border-neutral-500"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold">Location</label>
              <input
                type="text"
                placeholder="City or Region"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="w-full border border-neutral-300 py-3 px-3 text-sm outline-none focus:border-neutral-500"
              />
            </div>
            <button
              onClick={applyFilters}
              className="border border-black bg-white px-8 py-3 text-sm font-semibold hover:bg-neutral-100"
            >
              Filter
            </button>
          </div>
        </div>

        {isError && (
          <div className="mb-8 border border-[#7A1315] bg-white p-6 text-[#7A1315]">
            Failed to load candidates: {error.message}
          </div>
        )}

        {/* Candidates table */}
        <div className="border border-neutral-300 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-100 text-xs tracking-widest text-neutral-500">
                <th className="px-6 py-4 font-semibold">CANDIDATE</th>
                <th className="px-6 py-4 font-semibold">ROLE APPLIED</th>
                <th className="px-6 py-4 font-semibold">LOCATION</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 text-right font-semibold">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isPending && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    Loading candidates…
                  </td>
                </tr>
              )}
              {!isPending && candidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    No candidates found.
                  </td>
                </tr>
              )}
              {!isPending &&
                candidates.map((c, i) => {
                  const latest = c.applications[0];
                  return (
                    <tr
                      key={c.id}
                      className={i !== candidates.length - 1 ? "border-b border-neutral-200" : ""}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center bg-neutral-200 text-sm font-bold text-neutral-700">
                            {c.name ? initialsFromName(c.name) : <User size={18} className="text-neutral-400" />}
                          </div>
                          <div>
                            <Link to={`/candidates/${c.id}`} className="font-bold hover:underline">
                              {c.name}
                            </Link>
                            <p className="text-sm text-neutral-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-medium">{latest?.job_title || "—"}</td>
                      <td className="px-6 py-5 text-neutral-600">{c.location || "—"}</td>
                      <td className="px-6 py-5">
                        {latest ? <StatusBadge status={latest.status} /> : <span className="text-neutral-400">—</span>}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link to={`/candidates/${c.id}`} className="text-neutral-500 hover:text-black">
                          <MoreVertical size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
