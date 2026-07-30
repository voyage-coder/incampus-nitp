export default function SectionTitle({
  badge,
  title,
  subtitle,
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      {badge && (
        <span className="inline-block rounded-full bg-[#FFE6D5] px-4 py-2 text-sm font-semibold text-[#FF6B6B]">
          {badge}
        </span>
      )}

      <h2 className="mt-5 text-5xl font-extrabold text-gray-900">
        {title}
      </h2>

      <p className="mt-4 text-lg text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}