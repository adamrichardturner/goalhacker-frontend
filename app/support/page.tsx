'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from '@formspree/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { useEffect } from 'react'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID

if (!FORMSPREE_ID) {
  throw new Error('NEXT_PUBLIC_FORMSPREE_ID is not defined')
}

export default function SupportPage() {
  const router = useRouter()
  const [state, handleSubmit] = useForm(FORMSPREE_ID)

  useEffect(() => {
    if (state.succeeded) {
      toast.success('Thank you for your message. We will get back to you soon.')
      router.push('/goals')
    }
    if (state.errors) {
      toast.error('Failed to send message. Please try again.')
    }
  }, [state.succeeded, state.errors, router])

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
                className='text-electricPurple hover:underline'
              >
                support@goalhacker.app
              </Link>{' '}
              or use the form below.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-4'>Support Form</h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  required
                  placeholder='Your name'
                  className='bg-paper'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  required
                  placeholder='your@email.com'
                  className='bg-paper'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='subject'>Subject</Label>
                <Input
                  id='subject'
                  name='subject'
                  type='text'
                  required
                  placeholder='What is your inquiry about?'
                  className='bg-paper'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  name='message'
                  required
                  placeholder='Please describe your issue or question in detail'
                  className='min-h-[150px] bg-paper'
                />
              </div>

              <Button
                type='submit'
                disabled={state.submitting}
                className='w-full sm:w-auto'
              >
                {state.submitting ? 'Sending...' : 'Send Message'}
                <Mail className='ml-2 h-4 w-4' />
              </Button>
            </form>
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
