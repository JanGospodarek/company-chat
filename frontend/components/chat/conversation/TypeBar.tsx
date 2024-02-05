"use client";

import { PaperPlaneTilt, PushPin } from "@phosphor-icons/react";

const TypeBar = () => {
  return (
    <div className="w-full rounded-[40px] bg-slate-200 p-3 flex justify-between">
      <input
        type="text"
        placeholder="Type Message"
        className="bg-slate-200 w-full text-sm"
      />
      <div className="flex gap-2 items-center mx-2">
        <PushPin size={20} className="fill-primary" />
        <PaperPlaneTilt size={20} className="fill-primary" />
      </div>
    </div>
  );
};
export default TypeBar;
