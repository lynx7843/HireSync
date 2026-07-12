import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, ChevronsUpDown, Calendar, ChevronDown } from "lucide-react";

export default function HireSyncApplicationDetail() {
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
          <a href="#" className="text-[15px] font-medium text-neutral-500 hover:text-black">
            Candidates
          </a>
          <a
            href="#"
            className="border-b-2 border-black pb-2 text-[15px] font-bold text-black"
          >
            Applications
          </a>
        </nav>
        <div className="w-[70px]" />
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-8">
        {/* Back link */}
        <Link
          to="/applications"
          className="mb-6 inline-flex items-center gap-2 text-neutral-500 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Applications
        </Link>

        {/* Header row */}
        <div className="mb-6 flex items-start justify-between border-b border-neutral-300 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Application: Senior Frontend Engineer
            </h1>
            <p className="mt-1 text-neutral-500">at Acme Corp</p>
          </div>
          <span className="bg-neutral-200 px-4 py-2 text-sm font-bold tracking-wide text-neutral-800">
            IN REVIEW
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Candidate card */}
            <div className="border-t-2 border-black bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-[70px] w-[70px] items-center justify-center bg-neutral-200">
                    <User size={32} className="text-neutral-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-neutral-500">
                      CANDIDATE
                    </p>
                    <p className="mt-1 text-xl font-bold">Alex Mercer</p>
                    <p className="text-neutral-500">alex.mercer@example.com</p>
                  </div>
                </div>
                <button className="border border-black px-6 py-3 text-sm font-semibold hover:bg-neutral-100">
                  View Profile
                </button>
              </div>
            </div>

            {/* Application Details */}
            <div className="border-t-2 border-black bg-white p-6">
              <h2 className="mb-4 border-b border-neutral-200 pb-3 text-xl font-bold">
                Application Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Job Title</label>
                  <input
                    type="text"
                    defaultValue="Senior Frontend Engineer"
                    className="w-full border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Company</label>
                  <input
                    type="text"
                    defaultValue="Acme Corp"
                    className="w-full border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Date Applied</label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="10/24/2023"
                      className="w-full border border-neutral-300 px-4 py-3 pr-10 outline-none focus:border-neutral-500"
                    />
                    <Calendar
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Source</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500">
                      <option>Direct Website</option>
                      <option>LinkedIn</option>
                      <option>Referral</option>
                      <option>Job Board</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="border-t-2 border-black bg-white p-6">
              <h2 className="mb-4 border-b border-neutral-200 pb-3 text-xl font-bold">
                Internal Notes
              </h2>
              <textarea
                rows={7}
                placeholder="Add confidential notes regarding this application..."
                className="w-full resize-y border border-neutral-300 px-4 py-3 text-neutral-500 outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Pipeline Status */}
            <div className="border-t-2 border-black bg-white p-6">
              <h2 className="mb-4 border-b border-neutral-200 pb-3 text-xl font-bold">
                Pipeline Status
              </h2>
              <label className="mb-2 block text-sm font-semibold">Current Stage</label>
              <div className="relative">
                <select className="w-full appearance-none border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500">
                  <option>In Review</option>
                  <option>Screening</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <ChevronsUpDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                />
              </div>
              <p className="mt-3 text-sm text-neutral-500">Last updated: 2 hours ago by JD</p>
            </div>

            {/* Actions */}
            <div className="border-t-2 border-black bg-white p-6">
              <button className="mb-3 w-full bg-[#7A1315] py-3 text-sm font-bold tracking-wide text-white hover:bg-[#5F0F11]">
                SAVE CHANGES
              </button>
              <button className="w-full border border-black py-3 text-sm font-bold tracking-wide hover:bg-neutral-100">
                ARCHIVE APPLICATION
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
