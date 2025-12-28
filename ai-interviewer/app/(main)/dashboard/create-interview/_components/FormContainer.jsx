"use client";

import React, { useState } from "react";
import { InterviewType } from "@/app/services/Constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FormContainer() {
  const [selectedType, setSelectedType] = useState(null);
  const [duration, setDuration] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  return (
    <div className="mt-7">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter details job description"
          className="h-[200px] mt-2"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select onValueChange={(value) => setDuration(value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Min</SelectItem>
            <SelectItem value="15">15 Min</SelectItem>
            <SelectItem value="30">30 Min</SelectItem>
            <SelectItem value="45">45 Min</SelectItem>
            <SelectItem value="60">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>

        <div className="flex flex-wrap gap-2 mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              onClick={() => setSelectedType(type.id)}
              className={`
                flex items-center gap-2
                p-1 px-4
                bg-white border border-gray-300
                rounded-2xl cursor-pointer
                hover:bg-secondary transition-all
                ${
                  selectedType === type.id
                    ? "bg-blue-50 border-primary text-primary"
                    : ""
                }
              `}
            >
              <type.icon className="h-4 w-4" />
              <span className="text-sm">{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <Button
          disabled={!jobTitle || !jobDesc || !duration || !selectedType}
          className="gap-2"
        >
          Generate Question <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
