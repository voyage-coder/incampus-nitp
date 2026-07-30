import { Bell } from "lucide-react";
import SearchBar from "../ui/SearchBar";
import Avatar from "../ui/Avatar";

function Navbar() {
  return (
    <header className="bg-white h-20 px-8 flex items-center justify-between border-b">

      <SearchBar />

      <div className="flex items-center gap-6">

        <button className="relative">
          <Bell size={24} />

          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <Avatar name="Navya" />

      </div>

    </header>
  );
}

export default Navbar;