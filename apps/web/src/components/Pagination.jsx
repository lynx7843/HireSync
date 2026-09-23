import React from "react";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-neutral-300 px-6 py-4">
      <p className="text-sm text-neutral-600">
        Showing <span className="font-bold text-black">{start}-{end}</span> of{" "}
        <span className="font-bold text-black">{total}</span> results
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-neutral-600">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
