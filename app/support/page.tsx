'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'

export default function SupportPage() {
  const router = useRouter()

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='max-w-2xl mx-auto px-4 py-8 flex-1 w-full'>
        <Button variant='ghost' className='mb-8' onClick={() => router.back()}>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>

        <h1 className='text-3xl font-bold mb-8'>Support</h1>

        <div className='space-y-8'>
          <section>
            <h2 className='text-2xl font-semibold mb-4'>Contact Us</h2>
            <p className='mb-4 text-muted-foreground'>
              Need help with Goal Hacker? You can reach us directly at{' '}
              <Link
                href='mailto:support@goalhacker.app'
                className='text-primaryActive hover:underline'
              >
                support@goalhacker.app
              </Link>{' '}
              or use the form below.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-4'>Support Form</h2>
            <ContactForm />
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-4'>Response Time</h2>
            <p className='text-muted-foreground'>
              We aim to respond to all support inquiries within 24-48 hours
              during business days. For urgent matters, please email us
              directly.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
