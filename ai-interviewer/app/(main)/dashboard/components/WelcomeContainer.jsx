"use client";

import { useUser } from "@/app/provider";

export default function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold">
          Welcome Back, {user?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-Driven Interviews, Hassle-Free Hiring
        </p>
      </div>

      <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
        {user?.name?.[0]}
      </div>
    </div>
  );
}
