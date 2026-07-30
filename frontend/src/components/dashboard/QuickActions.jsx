import {
  FileText,
  CalendarDays,
  Users,
  ShoppingBag,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react";

import ActionCard from "./ActionCard";

const actions = [
  {
    title: "Resume",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    title: "Events",
    icon: CalendarDays,
    color: "bg-orange-500",
  },
  {
    title: "Clubs",
    icon: Users,
    color: "bg-pink-500",
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    color: "bg-green-500",
  },
  {
    title: "PYQs",
    icon: BookOpen,
    color: "bg-purple-500",
  },
  {
    title: "Placements",
    icon: BriefcaseBusiness,
    color: "bg-cyan-500",
  },
];

function QuickActions() {
  return (
    <section className="mt-10">

      <h2 className="text-2xl font-bold mb-5">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {actions.map((action) => (
          <ActionCard
            key={action.title}
            {...action}
          />
        ))}

      </div>

    </section>
  );
}

export default QuickActions;