import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, IdCard, Link2, MapPin } from "lucide-react";
import { useCreateCandidate } from "../api/queries";

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="mb-2 flex items-center gap-2 border-b border-neutral-200 pb-2">
      <Icon size={18} />
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}

export default function HireSyncAddCandidate() {
  const navigate = useNavigate();
  const createCandidate = useCreateCandidate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    notes: "",
  });

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    const name = `${form.firstName} ${form.lastName}`.trim();
    const payload = {
      name,
      email: form.email.trim(),
    };
    if (form.phone.trim()) payload.phone = form.phone.trim();
    if (form.location.trim()) payload.location = form.location.trim();
    if (form.linkedin.trim()) payload.linkedin_url = `https://${form.linkedin.trim()}`;
    if (form.notes.trim()) payload.notes = form.notes.trim();

    createCandidate.mutate(payload, {
      onSuccess: () => navigate("/candidates"),
    });
  };

  const canSave =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    !createCandidate.isPending;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Top Nav */}
      <header className="flex items-center gap-10 border-b border-neutral-200 px-6 py-4">
        <div className="text-base font-bold tracking-wide">HIRESYNC</div>
        <nav className="flex items-center gap-8">
          <Link to="/dashboard" className="text-base text-black hover:opacity-70">
            Dashboard
          </Link>
          <Link to="/candidates" className="text-base font-semibold text-black hover:opacity-70">
            Candidates
          </Link>
          <Link to="/applications" className="text-base text-black hover:opacity-70">
            Applications
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-8">
        {/* Header row */}
        <div className="mb-0 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-medium">Add New Candidate</h1>
            <p className="mt-1 text-neutral-500">Enter the details for the prospective hire.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/candidates")}
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
              {createCandidate.isPending ? "Saving…" : "Save Candidate"}
            </button>
          </div>
        </div>

        {createCandidate.isError && (
          <div className="mt-4 border border-[#7A1315] bg-white p-4 text-sm text-[#7A1315]">
            Failed to save candidate: {createCandidate.error.message}
          </div>
        )}

        {/* Form card */}
        <div className="mt-6 border border-neutral-200 bg-neutral-50/40 p-6">
          {/* Personal Details */}
          <SectionHeader icon={User} title="Personal Details" />
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm">First Name *</label>
              <input
                type="text"
                placeholder="Jane"
                value={form.firstName}
                onChange={setField("firstName")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">Last Name *</label>
              <input
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={setField("lastName")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {/* Contact Information */}
          <SectionHeader icon={IdCard} title="Contact Information" />
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm">Email Address *</label>
              <input
                type="email"
                placeholder="jane.doe@example.com"
                value={form.email}
                onChange={setField("email")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={setField("phone")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm">Location</label>
            <div className="relative">
              <MapPin
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="text"
                placeholder="City, State, Country"
                value={form.location}
                onChange={setField("location")}
                className="w-full border border-neutral-300 py-3 pl-11 pr-4 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {/* Professional Profile */}
          <SectionHeader icon={Link2} title="Professional Profile" />
          <div className="mb-6">
            <label className="mb-2 block text-sm">LinkedIn URL</label>
            <div className="flex">
              <span className="flex items-center border border-r-0 border-neutral-300 px-4 text-neutral-500">
                https://
              </span>
              <input
                type="text"
                placeholder="linkedin.com/in/janedoe"
                value={form.linkedin}
                onChange={setField("linkedin")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm">Portfolio / Website</label>
            <div className="flex">
              <span className="flex items-center border border-r-0 border-neutral-300 px-4 text-neutral-500">
                https://
              </span>
              <input
                type="text"
                placeholder="janedoe.design"
                value={form.portfolio}
                onChange={setField("portfolio")}
                className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 outline-none focus:border-neutral-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm">Initial Notes</label>
            <textarea
              rows={5}
              placeholder="Brief context or notes about this candidate..."
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
