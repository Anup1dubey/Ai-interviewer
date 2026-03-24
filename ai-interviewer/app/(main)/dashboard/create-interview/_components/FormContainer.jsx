"use client";

import React, { useState, useEffect } from "react";
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
import { Item } from "@radix-ui/react-select";

function FormContainer({ onHandleInputChange }) {
  const [interviewType, setInterviewType] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (interviewType) {
      onHandleInputChange("type", interviewType);
    }
  }, [interviewType]);

  const AddInterviewType=(type)=>{
    const data = interviewType.includes(type); 
    if(!data){
      setInterviewType(prev=>[...prev,type])  

    }else{
      const result = interviewType.filter(Item=>Item!==type);  
      setInterviewType(result);
    }
  }

  return (
    <div className="mt-7">

      {/* Job Position */}
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          value={jobTitle}
          onChange={(event) => {
            setJobTitle(event.target.value);
            onHandleInputChange("jobPosition", event.target.value);
          }}
        />
      </div>

      {/* Job Description */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter job description"
          className="h-[200px] mt-2"
          value={jobDesc}
          onChange={(event) => {
            setJobDesc(event.target.value);
            onHandleInputChange("jobDescription", event.target.value);
          }}
        />
      </div>

      {/* Interview Duration */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select
          onValueChange={(value) => {
            setDuration(value);
            onHandleInputChange("duration", value);
          }}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50 shadow-lg border">
            <SelectItem value="5">5 Min</SelectItem>
            <SelectItem value="15">15 Min</SelectItem>
            <SelectItem value="30">30 Min</SelectItem>
            <SelectItem value="45">45 Min</SelectItem>
            <SelectItem value="60">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interview Type */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>

        <div className="flex flex-wrap gap-2 mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-1 px-4 rounded-2xl cursor-pointer transition-all
  ${interviewType.includes(type.title)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-100"
                }`}

              onClick={() =>
                  AddInterviewType(type.title)
              }

            >
              <type.icon className="h-4 w-4" />
              <span className="text-sm">{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <Button
          disabled={!jobTitle || !jobDesc || !duration || interviewType.length === 0}
          className="gap-2"
        >
          Generate Question <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
