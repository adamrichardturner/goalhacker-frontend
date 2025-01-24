const demoSrc =
  'https://goalhacker-video.s3.eu-west-2.amazonaws.com/goalhacker-screen.mp4'

const VideoPlayer = () => {
  return (
    <div className='flex justify-center items-center w-full'>
      <video
        src={demoSrc}
        height={500}
        width={500}
        autoPlay
        muted
        loop
        className='rounded-lg w-full max-w-[900px] h-[500px]'
      />
    </div>
  )
}

export default VideoPlayer
