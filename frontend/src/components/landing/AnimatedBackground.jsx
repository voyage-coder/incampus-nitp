export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      <div
        className="absolute top-24 left-20 w-64 h-64 rounded-full opacity-40 blur-3xl"
        style={{
          background: "#FCE7EA",
        }}
      />

      <div
        className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{
          background: "#FFF2E8",
        }}
      />

    </div>
  );
}