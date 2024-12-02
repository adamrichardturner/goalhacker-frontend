import Image from 'next/image'

interface LoadingProps {
  className?: string
}

export const Loading = ({ className = '' }: LoadingProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Image
        src='/electricPurpleLoading.svg'
        alt='Loading...'
        width={50}
        height={50}
        priority
      />
    </div>
  )
}

export default Loading
