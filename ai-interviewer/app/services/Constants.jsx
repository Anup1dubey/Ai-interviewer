import {
  LayoutDashboard,
  Calendar,
  List,
  WalletCards,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
];

import {
  Code2,
  User,
  Briefcase,
  Puzzle,
  Users,
} from "lucide-react";

export const InterviewType = [
  {
    id: "technical",
    title: "Technical",
    icon: Code2,
  },
  {
    id: "behavioral",
    title: "Behavioral",
    icon: User,
  },
  {
    id: "experience",
    title: "Experience",
    icon: Briefcase,
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Users,
  },
];
