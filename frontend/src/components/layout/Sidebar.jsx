import {
  LayoutGrid,
  FileText,
  CalendarDays,
  Users,
  ShoppingBag,
  BriefcaseBusiness,
  BookOpen,
  User,
  Search,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    path: "/app/dashboard",
  },
  {
    title: "Resume",
    icon: FileText,
    path: "/app/resume",
  },
  {
    title: "Events",
    icon: CalendarDays,
    path: "/app/events",
  },
  {
    title: "Clubs",
    icon: Users,
    path: "/app/clubs",
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    path: "/app/marketplace",
  },
  {
    title: "Placements",
    icon: BriefcaseBusiness,
    path: "/app/placements",
  },
  {
    title: "PYQs",
    icon: BookOpen,
    path: "/app/pyqs",
  },
  {
    title: "Profile",
    icon: User,
    path: "/app/profile",
  },
];


function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r flex flex-col">

      <div className="px-8 py-8">

        <h1 className="text-3xl font-bold text-[#345BA0]">
          InCampus
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Campus. Connected.
        </p>

      </div>

      <div className="px-5">

        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3">

          <Search size={18} />

          <input
            placeholder="Quick Search..."
            className="bg-transparent outline-none w-full"
          />

        </div>

      </div>

      <nav className="mt-8 flex-1 px-4">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4
                px-4
                py-4
                rounded-2xl
                mb-2
                transition-all
                duration-300

                ${
                  isActive
                    ? "bg-[#345BA0] text-white shadow-lg"
                    : "text-gray-600 hover:bg-slate-100"
                }
                `
              }
            >

              <Icon size={22} />

              <span className="font-medium">

                {item.title}

              </span>

            </NavLink>

          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;