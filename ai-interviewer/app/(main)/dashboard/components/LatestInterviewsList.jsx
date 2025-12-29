"use client"

import React, { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([])

  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl mb-3">
        Previously Created Interviews
      </h2>

      {interviewList.length === 0 && (
    <div className="bg-white rounded-xl p-10 shadow-sm flex flex-col items-center gap-3">
    <Camera className="h-8 w-8 text-primary" />
    <p className="text-sm text-muted-foreground">
      You don’t have any interviews created!
    </p>
    <Button className="mt-2">
      + Create New Interview
    </Button>
    </div>
)}

    </div>
  )
}

export default LatestInterviewsList
