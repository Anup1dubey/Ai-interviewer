import { Phone, Video } from "lucide-react";
import Link from "next/link";
import React from "react";

function CreateOptions() {
  return (
    <div className="grid grid-cols-2 gap-5 mt-8">
      <Link
        href="/dashboard/create-interview"
        className="border border-gray-200 rounded-lg p-5 hover:shadow-md cursor-pointer"
      >
        <Video className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
        <h2 className="font-bold mt-4">Create New Interview</h2>
        <p className="text-gray-500">
          Create AI Interview and schedule with candidates
        </p>
      </Link>

      <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md cursor-pointer">
        <Phone className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
        <h2 className="font-bold mt-4">Create Phone Screening</h2>
        <p className="text-gray-500">
          Schedule phone screening with candidates
        </p>
      </div>
    </div>
  );
}

export default CreateOptions;
