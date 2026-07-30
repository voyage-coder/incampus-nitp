function TrendingSection() {
  const trending = [
    "🔥 HackSprint 2026",
    "📚 CN Mid Sem PYQs",
    "💼 Google Internship Experience",
    "🎉 Freshers Welcome",
    "🛒 Scientific Calculator",
  ];

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-5">
        📈 Trending on Campus
      </h2>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {trending.map((item) => (
            <span
              key={item}
              className="bg-slate-100 px-4 py-2 rounded-full hover:bg-[#345BA0] hover:text-white transition cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingSection;