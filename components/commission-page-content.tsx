'use client';

/* oxlint-disable next/no-html-link-for-pages */

import { CommissionForm } from '@/components/commission-form';
import { RevealOnView } from '@/components/reveal-on-view';
import { SiteHeader } from '@/components/site-header';
import { sitePath } from '@/components/site-path';

const steps = [
  {
    number: '01',
    title: 'Choose the approach',
    body: "Bring your own direction, or choose Maker's Choice and let me set the aesthetic.",
  },
  {
    number: '02',
    title: 'Define the function',
    body: 'Share what the piece needs to carry, any required dimensions, and the boundaries that matter.',
  },
  {
    number: '03',
    title: 'Approve the build',
    body: 'I’ll reply with questions, timing, and a clear quote before your one-off piece goes onto the bench.',
  },
];

export function CommissionPageContent({
  initialType = 'guided',
}: {
  initialType?: 'guided' | 'makers-choice';
}) {
  return (
    <div className="commission-shell">
      <SiteHeader solid />
      <main className="commission-page">
        <RevealOnView className="commission-intro">
          <a href={sitePath('/')} className="back-link">
            <span aria-hidden="true">←</span>
            Back to the work
          </a>
          <p className="commission-kicker">Commission</p>
          <h1>Start with the piece.</h1>
          <p className="commission-lede">
            Choose every detail with me—or tell me what it needs to do, and
            leave the look to me.
          </p>
          <p className="commission-terms">
            <strong>Commissions start at $100.</strong> A 50% non-refundable
            deposit is required to reserve your build.
          </p>

          <ol className="commission-steps">
            {steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </RevealOnView>

        <RevealOnView className="commission-form-reveal" delay={120}>
          <CommissionForm initialType={initialType} />
        </RevealOnView>
      </main>
      <footer className="commission-footer">
        © 2026 Rogue Artisan Leathercraft · Vancouver
      </footer>
    </div>
  );
}
