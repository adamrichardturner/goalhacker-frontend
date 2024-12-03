/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import MountainImage from '../../assets/images/mountains.jpg'
import { Button } from '../ui/button'

export default function NewGoalHeader() {
  return (
    <div className='relative h-[300px] w-full rounded-lg overflow-hidden'>
      {/* Background Image */}
      <img
        src={MountainImage.src}
        alt='Mountain landscape'
        className='object-cover'
      />

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30' />

      {/* Text Content */}
      <div className='absolute inset-0 flex flex-col space-y-6 items-center justify-center'>
        <h1 className='text-3xl sm:text-5xl font-bold text-white text-center px-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]'>
          Start your journey by creating a goal
        </h1>
        <Link href='/goals/new'>
          <Button className='bg-electricPurple h-12 hover:bg-electricPurple/95 hover:drop-shadow-lg text-white'>
            Create your first goal
          </Button>
        </Link>
      </div>
    </div>
  )
}
