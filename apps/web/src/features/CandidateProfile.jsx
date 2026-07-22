import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Link2, ChevronRight, User } from "lucide-react";
import { useCandidate } from "../api/queries";
import { formatDate } from "../lib/format";
import StatusBadge from "../components/StatusBadge";

export default function HireSyncCandidateProfile() {
  const { id } = useParams();
  const { data: candidate, isPending, isError, error } = useCandidate(id);

  const latest = candidate?.applications[0];

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-8 py-5">
        <div className="text-[26px] font-extrabold tracking-wide text-[#7A1315]">
          HIRESYNC
        </div>
        <Link to="/candidates" className="text-sm font-semibold text-[#7A1315] hover:underline">
          Close Profile
        </Link>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-8">
        {/* Back link */}
        <Link
          to="/candidates"
          className="mb-6 inline-flex items-center gap-2 text-neutral-500 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Candidates
        </Link>

        {isError && (
          <div className="mb-8 border border-[#7A1315] bg-white p-6 text-[#7A1315]">
            Failed to load candidate: {error.message}
          </div>
        )}

        {isPending && (
          <div className="border border-neutral-300 bg-white p-6 text-neutral-500">
            Loading candidate…
          </div>
        )}

        {candidate && (
          <>
            {/* Profile card */}
            <div className="border-t-2 border-black bg-white">
              <div className="flex items-start justify-between p-6 pb-6">
                <div className="flex gap-6">
                  <div className="flex h-[140px] w-[140px] items-center justify-center bg-neutral-200">
                    <User size={64} className="text-neutral-400" strokeWidth={1.5} />
                  </div>
                  <div className="pt-1">
                    <h1 className="text-3xl font-extrabold">{candidate.name}</h1>
                    <p className="mt-1 text-lg text-neutral-500">
                      {latest ? latest.job_title : "No applications yet"}
                    </p>
                    <div className="mt-4 flex items-center gap-6 text-neutral-700">
                      <span className="flex items-center gap-2">
                        <Mail size={16} className="text-neutral-400" />
                        {candidate.email}
                      </span>
                      {candidate.location && (
                        <span className="flex items-center gap-2">
                          <MapPin size={16} className="text-neutral-400" />
                          {candidate.location}
                        </span>
                      )}
                      {candidate.linkedin_url && (
                        <span className="flex items-center gap-2 text-[#7A1315]">
                          <Link2 size={16} />
                          <a href={candidate.linkedin_url} className="hover:underline" target="_blank" rel="noreferrer">
                            {candidate.linkedin_url.replace(/^https?:\/\//, "")}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="bg-[#7A1315] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5F0F11]">
                    Schedule Interview
                  </button>
                  <button className="border border-black bg-white px-6 py-3 text-sm font-semibold hover:bg-neutral-100">
                    Download Resume
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 border-t border-neutral-200 px-6 py-6">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-neutral-500">
                    APPLICATIONS
                  </p>
                  <p className="mt-2 text-2xl font-bold">{candidate.applications.length}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest text-neutral-500">
                    MEMBER SINCE
                  </p>
                  <p className="mt-2 text-2xl font-bold">{formatDate(candidate.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest text-neutral-500">
                    CURRENT STATUS
                  </p>
                  {latest ? (
                    <StatusBadge status={latest.status} className="mt-2" />
                  ) : (
                    <span className="mt-2 inline-block bg-neutral-200 px-3 py-1 text-sm font-medium text-neutral-800">
                      No Applications
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Application History */}
            <div className="mt-10">
              <h2 className="mb-2 inline-block border-b-2 border-black pb-3 text-2xl font-bold">
                Application History
              </h2>

              <div className="mt-4 border border-neutral-300 bg-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-300">
                      <th className="px-6 py-4 font-bold">Role</th>
                      <th className="px-6 py-4 font-bold">Company</th>
                      <th className="px-6 py-4 font-bold">Date Applied</th>
                      <th className="px-6 py-4 font-bold">Stage</th>
                      <th className="px-6 py-4 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidate.applications.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-6 text-center text-neutral-500">
                          No applications on file.
                        </td>
                      </tr>
                    )}
                    {candidate.applications.map((a, i) => (
                      <tr
                        key={a.id}
                        className={
                          i !== candidate.applications.length - 1
                            ? "border-b border-neutral-200"
                            : ""
                        }
                      >
                        <td className="px-6 py-5 font-medium">{a.job_title}</td>
                        <td className="px-6 py-5 text-neutral-600">{a.company}</td>
                        <td className="px-6 py-5 text-neutral-600">{formatDate(a.applied_at)}</td>
                        <td className="px-6 py-5">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link to={`/applications/${a.id}`} className="text-neutral-400 hover:text-black">
                            <ChevronRight size={18} className="inline" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
