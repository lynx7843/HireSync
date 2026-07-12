import React from "react";
import { Search, ChevronDown, MoreVertical, Plus } from "lucide-react";

const candidates = [
  {
    initials: "EJ",
    name: "Elena Jenkins",
    email: "elena.j@example.com",
    role: "VP Engineering",
    location: "San Francisco, CA",
    status: "Interviewing",
  },
  {
    initials: "MR",
    name: "Marcus Reid",
    email: "mreid.exec@domain.co",
    role: "Director of Product",
    location: "New York, NY",
    status: "Offer Extended",
  },
  {
    initials: "SL",
    name: "Sarah Lin",
    email: "slin.design@creative.net",
    role: "Chief Design Officer",
    location: "London, UK",
    status: "Applied",
  },
  {
    initials: "DT",
    name: "David Torres",
    email: "dtorres@finance.com",
    role: "CFO",
    location: "Chicago, IL",
    status: "Screening",
  },
  {
    initials: "AK",
    name: "Aisha Khan",
    email: "akhan.ops@logistics.org",
    role: "VP Operations",
    location: "Austin, TX",
    status: "Interviewing",
  },
];

function StatusBadge({ status }) {
  const base = "inline-block px-3 py-1 text-sm font-medium";
  const styles = {
    Interviewing: "bg-neutral-200 text-neutral-800",
    "Offer Extended": "bg-[#7A1315] text-white",
    Applied: "bg-neutral-200 text-neutral-800",
    Screening: "bg-neutral-200 text-neutral-800",
  };
  return <span className={`${base} ${styles[status] || ""}`}>{status}</span>;
}

export default function HireSyncCandidates() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-8 py-5">
        <div className="text-[26px] font-extrabold tracking-wide text-[#7A1315]">
          HIRESYNC
        </div>
        <nav className="flex items-center gap-10">
          <a href="#" className="text-[15px] font-medium text-neutral-500 hover:text-black">
            Dashboard
          </a>
          <a
            href="#"
            className="border-b-2 border-[#7A1315] pb-2 text-[15px] font-semibold text-[#7A1315]"
          >
            Candidates
          </a>
          <a href="#" className="text-[15px] font-medium text-neutral-500 hover:text-black">
            Applications
          </a>
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
          <button className="flex items-center gap-2 bg-[#7A1315] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5F0F11]">
            <Plus size={16} strokeWidth={3} />
            Add Candidate
          </button>
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
                  className="w-full border border-neutral-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-neutral-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold">Status</label>
              <div className="relative">
                <select className="w-full appearance-none border border-neutral-300 py-3 px-3 text-sm outline-none focus:border-neutral-500">
                  <option>All Statuses</option>
                  <option>Applied</option>
                  <option>Screening</option>
                  <option>Interviewing</option>
                  <option>Offer Extended</option>
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
                className="w-full border border-neutral-300 py-3 px-3 text-sm outline-none focus:border-neutral-500"
              />
            </div>
            <button className="border border-black bg-white px-8 py-3 text-sm font-semibold hover:bg-neutral-100">
              Filter
            </button>
          </div>
        </div>

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
              {candidates.map((c, i) => (
                <tr
                  key={c.email}
                  className={i !== candidates.length - 1 ? "border-b border-neutral-200" : ""}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center bg-neutral-200 text-sm font-bold text-neutral-700">
                        {c.initials}
                      </div>
                      <div>
                        <p className="font-bold">{c.name}</p>
                        <p className="text-sm text-neutral-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium">{c.role}</td>
                  <td className="px-6 py-5 text-neutral-600">{c.location}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-neutral-500 hover:text-black">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
