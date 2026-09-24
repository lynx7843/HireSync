import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, User, Calendar } from "lucide-react";
import { useCandidates, useCreateApplication } from "../api/queries";

const STATUS_OPTIONS = ["applied", "screening", "interview", "offer", "hired", "rejected"];

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="mb-2 flex items-center gap-2 border-b border-neutral-200 pb-2">
      <Icon size={18} />
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}

export default function HireSyncAddApplication() {
  const navigate = useNavigate();
  const { data: candidates, isPending: candidatesPending } = useCandidates();
  const createApplication = useCreateApplication();

  const [form, setForm] = useState({
    candidate_id: "",
    job_title: "",
    company: "",
    applied_at: new Date().toISOString().slice(0, 10),
    status: "applied",
    source: "",
    notes: "",
  });

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    const payload = {
      candidate_id: form.candidate_id,
      job_title: form.job_title.trim(),
      company: form.company.trim(),
      applied_at: form.applied_at,
      status: form.status,
    };
    if (form.source.trim()) payload.source = form.source.trim();
    if (form.notes.trim()) payload.notes = form.notes.trim();

    createApplication.mutate(payload, {
      onSuccess: (created) => navigate(`/applications/${created.id}`),
    });
  };

  const canSave =
    form.candidate_id &&
    form.job_title.trim() &&
    form.company.trim() &&
    form.applied_at &&
    !createApplication.isPending;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
      <main className="mx-auto max-w-3xl px-8 py-8">
        {/* Header row */}
        <div className="mb-0 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Log New Application</h1>
            <p className="mt-1 text-neutral-500">Record a candidate's application for a role.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/applications")}
              className="border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="px-2 py-2 text-sm font-medium hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {createApplication.isPending ? "Saving…" : "Save Application"}
            </button>
          </div>
        </div>

        {createApplication.isError && (
          <div className="mt-4 border border-[#7A1315] bg-white p-4 text-sm text-[#7A1315]">
            Failed to save application: {createApplication.error.message}
          </div>
        )}

        {/* Form card */}
        <div className="mt-6 border border-neutral-200 bg-neutral-50/40 p-6">
          {/* Candidate */}
          <SectionHeader icon={User} title="Candidate" />
          <div className="mb-6">
            <label className="mb-2 block text-sm">Candidate *</label>
            <select
              value={form.candidate_id}
              onChange={setField("candidate_id")}
              disabled={candidatesPending}
              className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
            >
              <option value="">
                {candidatesPending ? "Loading candidates…" : "Select a candidate"}
              </option>
              {candidates?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Role Details */}
          <SectionHeader icon={Briefcase} title="Role Details" />
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm">Job Title *</label>
              <input
                type="text"
                placeholder="Senior Product Designer"
                value={form.job_title}
                onChange={setField("job_title")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">Company *</label>
              <input
                type="text"
                placeholder="Acme Corp"
                value={form.company}
                onChange={setField("company")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm">Date Applied *</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.applied_at}
                  onChange={setField("applied_at")}
                  className="w-full border border-neutral-300 px-4 py-3 pr-10 text-neutral-700 outline-none focus:border-neutral-500"
                />
                <Calendar
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm">Status</label>
              <select
                value={form.status}
                onChange={setField("status")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm">Source</label>
            <input
              type="text"
              placeholder="Referral, LinkedIn, Job Board..."
              value={form.source}
              onChange={setField("source")}
              className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Internal Notes</label>
            <textarea
              rows={5}
              placeholder="Add confidential notes regarding this application..."
              value={form.notes}
              onChange={setField("notes")}
              className="w-full resize-y border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
