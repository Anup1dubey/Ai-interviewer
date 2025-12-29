"use client";

import WelcomeContainer from "./components/WelcomeContainer";
import CreateOptions from "./components/CreateOptions";
import LatestInterviewsList from "./components/LatestInterviewsList";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeContainer />

      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      <CreateOptions />

      <h2 className="text-lg font-semibold">
        Previously Created Interviews
      </h2>

      <LatestInterviewsList />
    </div>
  );
}
