'use client'

import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicy() {
  const router = useRouter()

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <Button variant='ghost' className='mb-8' onClick={() => router.back()}>
        <ArrowLeft className='w-4 h-4 mr-2' />
        Back
      </Button>

      <h1 className='text-3xl font-bold mb-8'>Privacy Policy</h1>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>1. Introduction</h2>
        <p className='mb-4'>
          At Goal Hacker, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our service. Please read this privacy policy carefully.
          If you do not agree with the terms of this privacy policy, please do
          not access the application.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>2. Data Controller</h2>
        <p className='mb-4'>
          The Data Controller for Goal Hacker is Adam Richard Turner. For any
          privacy-related inquiries, you can contact us at: [Contact details to
          be added]
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          3. Information We Collect
        </h2>
        <div className='space-y-4'>
          <h3 className='text-xl font-medium'>3.1 Personal Data</h3>
          <p>We collect the following personal information:</p>
          <ul className='list-disc pl-6 mb-4 space-y-2'>
            <li>
              Email address and name (for account creation and communication)
            </li>
            <li>Password (stored securely as a hash)</li>
            <li>Profile information (including avatar image if provided)</li>
            <li>Date format preferences</li>
          </ul>

          <h3 className='text-xl font-medium'>3.2 Usage Data</h3>
          <p>We collect the following usage data:</p>
          <ul className='list-disc pl-6 mb-4 space-y-2'>
            <li>Goals and their details</li>
            <li>Categories you create</li>
            <li>Progress notes and updates</li>
            <li>Images you upload related to goals</li>
            <li>Activity timestamps</li>
          </ul>

          <h3 className='text-xl font-medium'>3.3 Analytics Data</h3>
          <p className='mb-4'>
            We use Google Analytics to help us understand how our service is
            used. Google Analytics may collect:
          </p>
          <ul className='list-disc pl-6 mb-4 space-y-2'>
            <li>Usage patterns and behavior</li>
            <li>Device and browser information</li>
            <li>IP address (anonymized)</li>
            <li>Pages visited and features used</li>
          </ul>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>4. How We Use Your Data</h2>
        <p className='mb-4'>We use your data for the following purposes:</p>
        <ul className='list-disc pl-6 mb-4 space-y-2'>
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To provide customer support</li>
          <li>To gather analysis and insights to improve our service</li>
          <li>To detect, prevent and address technical issues</li>
          <li>To fulfill any other purpose for which you provide it</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          5. Data Sharing and Third Parties
        </h2>
        <p className='mb-4'>
          We share your data with the following third parties:
        </p>
        <ul className='list-disc pl-6 mb-4 space-y-2'>
          <li>Google Analytics for website usage analysis</li>
          <li>Cloud service providers for hosting and storage</li>
          <li>Email service providers for communications</li>
        </ul>
        <p className='mb-4'>
          We do not sell your personal data to third parties. Any third-party
          service providers we use are bound by contractual obligations to keep
          personal information confidential and use it only for the purposes for
          which we disclose it to them.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          6. Your Data Protection Rights
        </h2>
        <p className='mb-4'>
          Under GDPR and UK Data Protection Law, you have the following rights:
        </p>
        <ul className='list-disc pl-6 mb-4 space-y-2'>
          <li>Right to access your personal data</li>
          <li>Right to rectification of your personal data</li>
          <li>Right to erasure of your personal data</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
        </ul>
        <p className='mb-4'>
          You can exercise most of these rights directly through your account
          settings. You can delete your account and all associated data at any
          time through the Settings page. For any other requests regarding your
          rights, please contact us directly.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>7. Cookies and Tracking</h2>
        <p className='mb-4'>
          We use cookies and similar tracking technologies to track activity on
          our service and hold certain information. Cookies are files with small
          amount of data which may include an anonymous unique identifier.
        </p>
        <p className='mb-4'>We use the following types of cookies:</p>
        <ul className='list-disc pl-6 mb-4 space-y-2'>
          <li>Essential cookies: Required for the operation of our service</li>
          <li>Analytics cookies: Help us understand how you use our service</li>
          <li>Preference cookies: Remember your settings and preferences</li>
        </ul>
        <p className='mb-4'>
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our service.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>8. Data Security</h2>
        <p className='mb-4'>
          We implement appropriate technical and organizational measures to
          maintain the security of your personal information, including:
        </p>
        <ul className='list-disc pl-6 mb-4 space-y-2'>
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments</li>
          <li>Access controls and authentication</li>
          <li>Secure data backups</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>9. Data Retention</h2>
        <p className='mb-4'>
          We will retain your personal data only for as long as necessary to
          fulfill the purposes we collected it for. When you delete your
          account, all your personal data will be permanently deleted from our
          systems within 30 days, except where we are required to maintain
          certain records for legal or regulatory compliance.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          10. International Data Transfers
        </h2>
        <p className='mb-4'>
          Your information may be transferred to — and maintained on — computers
          located outside of your state, province, country or other governmental
          jurisdiction where the data protection laws may differ from those in
          your jurisdiction. We ensure appropriate safeguards are in place for
          such transfers in accordance with applicable law.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          11. Changes to This Privacy Policy
        </h2>
        <p className='mb-4'>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the &ldquo;last updated&rdquo; date. You are advised to
          review this Privacy Policy periodically for any changes.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>12. Contact Us</h2>
        <p className='mb-4'>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at: [Contact details to be added]
        </p>
      </section>

      <Footer />
    </div>
  )
}
