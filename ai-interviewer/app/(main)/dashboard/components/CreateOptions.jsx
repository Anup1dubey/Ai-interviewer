"use client";

import { Video, Phone } from "lucide-react";

export default function CreateOptions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex gap-4">
        <div className="h-10 w-10 rounded-full bg-blue-100 text-primary flex items-center justify-center">
          <Video size={20} />
        </div>
        <div>
          <h3 className="font-semibold">
            Create New Interview
          </h3>
          <p className="text-sm text-muted-foreground">
            Create AI interviews and schedule them with candidates
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex gap-4">
        <div className="h-10 w-10 rounded-full bg-blue-100 text-primary flex items-center justify-center">
          <Phone size={20} />
        </div>
        <div>
          <h3 className="font-semibold">
            Create Phone Screening Call
          </h3>
          <p className="text-sm text-muted-foreground">
            Schedule phone screening call with candidates
          </p>
        </div>
      </div>

    </div>
  );
}
