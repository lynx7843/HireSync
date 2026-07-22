import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../api/queries";
import { formatDate, statusLabel } from "../lib/format";
import StatusBadge from "../components/StatusBadge";

const PIPELINE_STAGES = ["applied", "screening", "interview", "offer", "hired"];

export default function HireSyncDashboard() {
  const { data, isPending, isError, error } = useDashboard();

  const stats = data
    ? [
        { label: "TOTAL CANDIDATES", value: data.totalCandidates },
        { label: "TOTAL APPLICATIONS", value: data.totalApplications },
        { label: "HIRED THIS MONTH", value: data.hiredThisMonth, accent: true },
        { label: "REJECTION RATE", value: `${data.rejectionRate}%` },
      ]
    : [];

  const pipeline = PIPELINE_STAGES.map((stage) => {
    const entry = data?.statusDistribution.find((s) => s.status === stage);
    return { stage, label: statusLabel(stage), count: entry?._count.status || 0 };
  });
  const maxCount = Math.max(1, ...pipeline.map((p) => p.count));

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center justify-between bg-[#252525] px-8 py-5">
        <div className="text-[26px] font-extrabold tracking-wide text-white">
          HIRESYNC
        </div>
        <nav className="flex items-center gap-10">
          <Link
            to="/dashboard"
            className="border-b-2 border-[#7A1315] pb-2 text-[15px] font-medium text-[#D0574F]"
          >
            Dashboard
          </Link>
          <Link to="/candidates" className="text-[15px] font-medium text-neutral-300 hover:text-white">
            Candidates
          </Link>
          <Link to="/applications" className="text-[15px] font-medium text-neutral-300 hover:text-white">
            Applications
          </Link>
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

        {isError && (
          <div className="mb-8 border border-[#7A1315] bg-white p-6 text-[#7A1315]">
            Failed to load dashboard data: {error.message}
          </div>
        )}

        {isPending ? (
          <div className="mb-8 border border-neutral-300 bg-white p-6 text-neutral-500">
            Loading dashboard…
          </div>
        ) : (
          <>
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
                  <div key={p.stage} className="flex flex-1 flex-col items-center justify-end h-full">
                    <div
                      className={`w-full ${p.stage === "hired" ? "bg-black" : "bg-neutral-200"}`}
                      style={{ height: `${(p.count / maxCount) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-6 px-2 pt-3">
                {pipeline.map((p) => (
                  <div key={p.stage} className="flex-1 text-center">
                    <p
                      className={`text-sm ${
                        p.stage === "hired" ? "font-bold text-black" : "text-neutral-500"
                      }`}
                    >
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
                <Link to="/applications" className="text-sm font-semibold text-[#7A1315] hover:underline">
                  View All →
                </Link>
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
                  {data.latestApplications.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-neutral-500">
                        No applications yet.
                      </td>
                    </tr>
                  )}
                  {data.latestApplications.map((a, i) => (
                    <tr
                      key={a.id}
                      className={
                        i !== data.latestApplications.length - 1 ? "border-b border-neutral-200" : ""
                      }
                    >
                      <td className="px-6 py-4 font-bold">{a.candidate.name}</td>
                      <td className="px-6 py-4 text-neutral-700">{a.job_title}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-500">
                        {formatDate(a.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
