import { Search } from "lucide-react";

function SearchHero(){

    return(

        <div className="bg-gradient-to-r from-[#345BA0] to-[#4A76C9]
        rounded-3xl p-10 text-white">

            <h2 className="text-3xl font-bold">

                Search Across Campus

            </h2>

            <p className="mt-2 opacity-90">

                Events • Clubs • Marketplace • PYQs • Placements

            </p>

            <div className="mt-8 relative">

                <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2"
                />

                <input

                    placeholder="Search anything..."

                    className="w-full py-4 pl-14 pr-6 rounded-2xl text-black outline-none"

                />

            </div>

        </div>

    )

}

export default SearchHero;