'use client'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/Footer'

function TermsAndConditionsSkeleton() {
  return (
    <div className="max-w-4xl min-h-screen mx-auto px-4 py-8">
      <Skeleton className="h-10 w-24 mb-8" />
      <Skeleton className="h-12 w-72 mb-8" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  )
}

function TermsAndConditionsContent() {
  return (
    <div className="max-w-4xl min-h-screen mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-8" onClick={() => window.history.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Goal Hacker. These terms and conditions outline the rules and regulations for
          the use of Goal Hacker, owned and operated by Adam Richard Turner (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Data Controller</h2>
        <p className="mb-4">
          The Data Controller for Goal Hacker is Adam Richard Turner. [Address to be added upon
          request]
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data We Collect</h2>
        <p className="mb-4">We collect and process the following information:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Account information (email address, name, password hash)</li>
          <li>Profile information (avatar URL, date format preferences)</li>
          <li>Goals and related data (titles, descriptions, progress tracking)</li>
          <li>Categories you create and associate with goals</li>
          <li>Progress notes and updates you make</li>
          <li>Images you upload related to your goals</li>
          <li>Usage data and timestamps of your activities</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Data</h2>
        <p className="mb-4">We use your data for the following purposes:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To allow you to participate in interactive features</li>
          <li>To provide customer support</li>
          <li>To gather analytics to improve our service</li>
          <li>To monitor the usage of our service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Data Protection Rights</h2>
        <p className="mb-4">
          Under GDPR and UK Data Protection Law, you have the following rights:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>The right to access your personal data</li>
          <li>The right to rectification of your personal data</li>
          <li>The right to erasure of your personal data</li>
          <li>The right to restrict processing of your personal data</li>
          <li>The right to data portability</li>
          <li>The right to object to processing of your personal data</li>
          <li>Rights in relation to automated decision making and profiling</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
        <p className="mb-4">
          We will retain your personal data only for as long as is necessary for the purposes set
          out in these terms and conditions. We will retain and use your personal data to the extent
          necessary to comply with our legal obligations, resolve disputes, and enforce our legal
          agreements and policies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to maintain the security of
          your personal information, including protecting against unauthorized or unlawful
          processing and against accidental loss, destruction or damage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
        <p className="mb-4">
          We may employ third-party companies and individuals to facilitate our service, provide
          service-related services, or assist us in analyzing how our service is used. These third
          parties have access to your personal data only to perform these tasks on our behalf and
          are obligated not to disclose or use it for any other purpose.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. If we make material changes to
          these terms, we will notify you through our service or by email prior to the changes
          becoming effective.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms and Conditions, your data, or your rights,
          please contact us at: [Contact details to be added]
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
        <p className="mb-4">
          These terms and conditions are governed by and construed in accordance with the laws of
          the United Kingdom. You irrevocably submit to the exclusive jurisdiction of the courts in
          that location.
        </p>
      </section>

      <Footer />
    </div>
  )
}

export default function TermsAndConditions() {
  return (
    <Suspense fallback={<TermsAndConditionsSkeleton />}>
      <TermsAndConditionsContent />
    </Suspense>
  )
}
