import FeedCard from "./FeedCard";

const feeds = [
  {
    emoji: "🎉",
    title: "Coding Club",
    description: "HackSprint registrations are open.",
  },
  {
    emoji: "📚",
    title: "Computer Networks",
    description: "New PYQs uploaded.",
  },
  {
    emoji: "🛒",
    title: "Marketplace",
    description: "Monitor listed for ₹4500.",
  },
  {
    emoji: "💼",
    title: "Placement",
    description: "Amazon OA experience added.",
  },
];

function CampusFeed() {
  return (
    <section className="mt-10">

      <h2 className="text-2xl font-bold mb-5">
        🔥 Campus Feed
      </h2>

      <div className="space-y-4">

        {feeds.map((feed, index) => (
          <FeedCard
            key={index}
            {...feed}
          />
        ))}

      </div>

    </section>
  );
}

export default CampusFeed;