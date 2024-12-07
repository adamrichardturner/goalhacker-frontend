import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import PrivacyPolicyClient from './privacy-policy-client'

function PrivacyPolicySkeleton() {
  return (
    <div className='max-w-4xl min-h-screen mx-auto px-4 py-8'>
      <Skeleton className='h-10 w-24 mb-8' />
      <Skeleton className='h-12 w-72 mb-8' />
      {[...Array(6)].map((_, i) => (
        <div key={i} className='mb-8'>
          <Skeleton className='h-8 w-48 mb-4' />
          <Skeleton className='h-24 w-full' />
        </div>
      ))}
    </div>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<PrivacyPolicySkeleton />}>
      <PrivacyPolicyClient />
    </Suspense>
  )
}
