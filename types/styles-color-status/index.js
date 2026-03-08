"use client";

export function styleColorStatus(acronym) {
  const colorStatus = {
    RE: "bg-amber-400 text-amber-100",
    EX: "bg-teal-400 text-teal-100",
    PU: "bg-orange-400 text-orange-100",
    FI: "bg-green-500 text-green-100",
    RV: "bg-lime-400 text-lime-100",
    SU: "bg-red-400 text-red-100",
    RO: "bg-sky-500 text-sky-100",
    default: "bg-stone-200 text-stone-950",
  };

  return colorStatus?.[acronym] || colorStatus.default;
}
