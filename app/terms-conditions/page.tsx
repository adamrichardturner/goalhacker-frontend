import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function TermsConditionsPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex items-center gap-2'>
        <ArrowLeftIcon className='w-4 h-4' />
        <Link href='/'>Back to home</Link>
      </div>
      <h1 className='text-2xl font-bold'>Terms & Conditions</h1>
    </div>
  )
}
