function ActionCard({ icon, title, color }) {

    const Icon = icon;

    return (

        <button
            className="
            bg-white
            rounded-3xl
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
            p-6
            w-full
            text-left
            ">

            <div
                className={`w-14 h-14 rounded-2xl ${color}
                flex items-center justify-center text-white`}
            >

                <Icon size={28}/>

            </div>

            <h3 className="mt-5 text-xl font-semibold">

                {title}

            </h3>

        </button>

    )

}

export default ActionCard;