function FeedCard({ emoji, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex gap-4">

        <div className="text-3xl">
          {emoji}
        </div>

        <div>

          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-gray-500 mt-1">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

export default FeedCard;