'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export function ContactForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/email/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      router.push('/goals')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4 text-base'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Input
              id='name'
              name='name'
              type='text'
              placeholder='Your Name'
              required
              minLength={2}
              value={formData.name}
              onChange={handleChange}
              className='h-12 bg-input text-primary'
              disabled={isSubmitting}
            />
          </div>
          <div className='space-y-2'>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='Your Email'
              required
              value={formData.email}
              onChange={handleChange}
              className='h-12 bg-input text-primary'
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Textarea
            id='message'
            name='message'
            placeholder='Your Message'
            required
            minLength={10}
            value={formData.message}
            onChange={handleChange}
            className='min-h-[150px] bg-input text-sm py-4 resize-none'
            disabled={isSubmitting}
          />
        </div>
      </div>
      <Button type='submit' disabled={isSubmitting} className='w-full h-12'>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
