"use client";

export function styleColorStatus(sigle) {
  // if (!sigle || sigle === undefined) {
  //   console.log(">>SIGLE COLOR STYLES");
  //   console.log(sigle);
  //   sigle = "default";
  // }

  const colorStatus = {
    RE: "bg-amber-400 text-amber-100",
    EX: "bg-teal-400 text-teal-100",
    PU: "bg-orange-400 text-orange-100",
    FI: "bg-green-500 text-green-100",
    RV: "bg-lime-400 text-lime-100",
    SU: "bg-red-400 text-red-100",
    RO: "bg-sky-500 text-sky-100",
    default: "bg-stone-200 text-stone-950",
    // RE: () => "bg-yellow-400 text-amber-100",
    // EX: () => "bg-red-400 text-teal-100",
    // PU: () => "bg-orange-400 text-orange-100",
    // FI: () => "bg-green-500 text-green-100",
    // RV: () => "bg-violet-400 text-lime-100",
    // SU: () => "bg-red-400 text-red-100",
    // RO: () => "bg-blue-500 text-sky-100",
    // default: () => "bg-stone-200 text-stone-950",
  };
  //const execute = colorStatus[sigle ?? "default"];

  // console.log(colorStatus[sigle || "default"]);
  // console.log(execute());

  return colorStatus[sigle ?? "default"]; //execute();
  //("bg-stone-200 text-stone-950");
}
