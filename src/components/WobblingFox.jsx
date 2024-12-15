import { motion } from 'framer-motion'

const WobblingFox = () => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 text-6xl"
      animate={{
        rotate: [-5, 5, -5],
        y: [0, -5, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      🦊
    </motion.div>
  )
}

export default WobblingFox 