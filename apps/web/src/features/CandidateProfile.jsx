import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Link2, ChevronRight, User } from "lucide-react";
import { useCandidate, useUpdateCandidate, useDeleteCandidate } from "../api/queries";
import { formatDate } from "../lib/format";
import StatusBadge from "../components/StatusBadge";

export default function HireSyncCandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: candidate, isPending, isError, error, refetch, isFetching } = useCandidate(id);
  const updateCandidate = useUpdateCandidate(id);
  const deleteCandidate = useDeleteCandidate(id);

  const latest = candidate?.applications[0];

  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState(null);

  const startEditing = () => {
    setEdit({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || "",
      location: candidate.location || "",
      linkedin_url: candidate.linkedin_url || "",
      portfolio_url: candidate.portfolio_url || "",
      notes: candidate.notes || "",
    });
    setIsEditing(true);
  };

  const setField = (field) => (e) => {
    updateCandidate.reset();
    setEdit((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    if (!edit) return;
    updateCandidate.mutate(
      {
        name: edit.name,
        email: edit.email,
        phone: edit.phone.trim() ? edit.phone.trim() : null,
        location: edit.location.trim() ? edit.location.trim() : null,
        linkedin_url: edit.linkedin_url.trim() ? edit.linkedin_url.trim() : null,
        portfolio_url: edit.portfolio_url.trim() ? edit.portfolio_url.trim() : null,
        notes: edit.notes.trim() ? edit.notes.trim() : null,
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this candidate? This action cannot be undone.")) return;
    deleteCandidate.mutate(undefined, {
      onSuccess: () => navigate("/candidates"),
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center justify-end border-b border-neutral-200 bg-white px-8 py-5">
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
          <div className="border border-[#7A1315] bg-white p-10 text-center">
            <h1 className="text-2xl font-extrabold text-[#7A1315]">Couldn't load this candidate</h1>
            <p className="mt-2 text-neutral-500">{error.message}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-[#7A1315] px-6 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {isFetching ? "Retrying…" : "Try again"}
              </button>
              <Link to="/candidates" className="px-6 py-2 text-sm font-semibold text-[#7A1315] hover:underline">
                Back to candidates
              </Link>
            </div>
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
                  {!isEditing ? (
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
                        {candidate.phone && <span>{candidate.phone}</span>}
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
                        {candidate.portfolio_url && (
                          <span className="flex items-center gap-2 text-[#7A1315]">
                            <Link2 size={16} />
                            <a href={candidate.portfolio_url} className="hover:underline" target="_blank" rel="noreferrer">
                              {candidate.portfolio_url.replace(/^https?:\/\//, "")}
                            </a>
                          </span>
                        )}
                      </div>
                      {candidate.notes && (
                        <p className="mt-4 max-w-xl whitespace-pre-wrap text-neutral-600">
                          {candidate.notes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="grid w-[560px] grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="mb-1 block text-sm font-semibold">Name</label>
                        <input
                          type="text"
                          value={edit.name}
                          onChange={setField("name")}
                          className="w-full border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold">Email</label>
                        <input
                          type="email"
                          value={edit.email}
                          onChange={setField("email")}
                          className="w-full border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold">Phone</label>
                        <input
                          type="text"
                          value={edit.phone}
                          onChange={setField("phone")}
                          className="w-full border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold">Location</label>
                        <input
                          type="text"
                          value={edit.location}
                          onChange={setField("location")}
                          className="w-full border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold">LinkedIn URL</label>
                        <input
                          type="text"
                          value={edit.linkedin_url}
                          onChange={setField("linkedin_url")}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold">Portfolio URL</label>
                        <input
                          type="text"
                          value={edit.portfolio_url}
                          onChange={setField("portfolio_url")}
                          placeholder="https://..."
                          className="w-full border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-sm font-semibold">Notes</label>
                        <textarea
                          rows={3}
                          value={edit.notes}
                          onChange={setField("notes")}
                          className="w-full resize-y border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                        />
                      </div>
                      {updateCandidate.isError && (
                        <p className="col-span-2 text-sm text-[#7A1315]">
                          Save failed: {updateCandidate.error.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {!isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={startEditing}
                        className="bg-[#7A1315] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5F0F11]"
                      >
                        Edit Candidate
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteCandidate.isPending}
                        className="border border-black bg-white px-6 py-3 text-sm font-semibold hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleteCandidate.isPending ? "Deleting…" : "Delete Candidate"}
                      </button>
                      {deleteCandidate.isError && (
                        <p className="text-sm text-[#7A1315]">{deleteCandidate.error.message}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={updateCandidate.isPending}
                        className="bg-[#7A1315] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5F0F11] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updateCandidate.isPending ? "Saving…" : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="border border-black bg-white px-6 py-3 text-sm font-semibold hover:bg-neutral-100"
                      >
                        Cancel
                      </button>
                    </>
                  )}
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
