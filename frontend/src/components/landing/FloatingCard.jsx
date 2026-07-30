import { motion } from "framer-motion";

export default function FloatingCard({
  title,
  top,
  left,
  right,
}) {
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 4,
      }}
      style={{
        top,
        left,
        right,
      }}
      className="absolute rounded-3xl bg-white shadow-2xl px-6 py-5 font-semibold text-gray-700"
    >
      {title}
    </motion.div>
  );
}