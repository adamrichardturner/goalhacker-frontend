import { motion } from 'framer-motion'

interface StageProgressProps {
  number: string | number
  className?: string
}

export const StageProgress = ({ number, className }: StageProgressProps) => {
  return (
    <motion.div
      className={`w-12 h-12 bg-primaryActive/10 rounded-full flex items-center justify-center mx-auto mb-4 ${className}`}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <span className='text-xl font-semibold text-primaryActive'>
        {number}
      </span>
    </motion.div>
  )
}

export default StageProgress
