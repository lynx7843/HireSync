import React from "react";
import { statusLabel } from "../lib/format";

const STYLES = {
  applied: "bg-neutral-200 text-neutral-800",
  screening: "bg-neutral-300 text-neutral-800",
  interview: "bg-white text-neutral-800 border border-neutral-400",
  offer: "bg-black text-white",
  hired: "bg-[#7A1315] text-white",
  rejected: "bg-neutral-800 text-white",
};

export default function StatusBadge({ status, className = "" }) {
  const style = STYLES[status] || "bg-neutral-200 text-neutral-800";
  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium ${style} ${className}`}>
      {statusLabel(status)}
    </span>
  );
}
