'use client';

import { useState } from 'react';

const contactEmail = 'rogueartisan@outlook.com';
type FormStatus = 'idle' | 'sending' | 'sent' | 'error';
type CommissionType = 'guided' | 'makers-choice';

export function CommissionForm({
  initialType = 'guided',
}: {
  initialType?: CommissionType;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [piece, setPiece] = useState('');
  const [details, setDetails] = useState('');
  const [commissionType, setCommissionType] =
    useState<CommissionType>(initialType);
  const [status, setStatus] = useState<FormStatus>('idle');

  const makersChoice = commissionType === 'makers-choice';

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    const formData = new FormData(event.currentTarget);
    const requestLabel = makersChoice
      ? "Maker's Choice request"
      : 'Commission idea';
    formData.set('_subject', `${requestLabel} from ${name || 'a new client'}`);
    formData.set('_captcha', 'false');
    formData.set('_template', 'table');

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${contactEmail}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        },
      );
      if (!response.ok) throw new Error('Unable to send commission request');
      const analytics = (
        window as typeof window & {
          gtag?: (...args: unknown[]) => void;
        }
      ).gtag;
      analytics?.('event', 'generate_lead', {
        commission_type: makersChoice ? 'makers_choice' : 'collaborative',
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  const subject = `${makersChoice ? "Maker's Choice request" : 'Commission idea'} from ${name || 'a new client'}`;
  const body = [
    `Name: ${name}`,
    `Reply email: ${email}`,
    `Commission type: ${makersChoice ? "Maker's Choice" : 'Collaborative commission'}`,
    `Piece: ${piece}`,
    '',
    details,
  ].join('\n');
  const emailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  function resetError() {
    if (status === 'error') setStatus('idle');
  }

  return (
    <form className="commission-form" onSubmit={handleSubmit}>
      <input
        className="form-honeypot"
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div>
        <p>{makersChoice ? "Maker's Choice" : 'Your idea'}</p>
        <h2>
          {makersChoice
            ? 'Choose the piece. Give me the reins.'
            : 'Tell me what you have in mind.'}
        </h2>
      </div>

      <div className="form-grid">
        <fieldset className="commission-type">
          <legend className="form-legend">How do you want to build it?</legend>
          <div className="commission-type-options">
            <label
              className={makersChoice ? '' : 'selected'}
              aria-label="Collaborative commission"
            >
              <input
                type="radio"
                name="commission_type"
                value="Collaborative commission"
                checked={!makersChoice}
                onChange={() => {
                  setCommissionType('guided');
                  resetError();
                }}
              />
              <span>
                <strong>Your Commission</strong>
                <small>You choose the direction and details with me.</small>
              </span>
            </label>
            <label
              className={makersChoice ? 'selected' : ''}
              aria-label="Maker's Choice"
            >
              <input
                type="radio"
                name="commission_type"
                value="Maker's Choice"
                checked={makersChoice}
                onChange={() => {
                  setCommissionType('makers-choice');
                  resetError();
                }}
              />
              <span>
                <strong>Maker&apos;s Choice</strong>
                <small>
                  I choose the leather, colour, thread, and finish.
                </small>
              </span>
            </label>
          </div>
        </fieldset>

        {makersChoice && (
          <div className="makers-choice-note">
            <strong>How Maker&apos;s Choice works</strong>
            <p>
              Tell me what the piece needs to do and anything you absolutely
              want to avoid. I’ll set the aesthetic and reply with a clear
              quote and timing before the build begins.
            </p>
          </div>
        )}

        <div className="form-row">
          <label htmlFor="name">
            Name
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                resetError();
              }}
            />
          </label>

          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                resetError();
              }}
            />
          </label>
        </div>

        <label htmlFor="piece">
          What would you like made?
          <input
            id="piece"
            name="piece"
            placeholder="Wallet, card holder, belt, bag…"
            required
            value={piece}
            onChange={(event) => {
              setPiece(event.target.value);
              resetError();
            }}
          />
        </label>

        <label htmlFor="details">
          {makersChoice ? 'Function and boundaries' : 'The details'}
          <textarea
            id="details"
            name="message"
            rows={7}
            placeholder={
              makersChoice
                ? 'What it needs to carry, required dimensions, your budget, and any colours or materials to avoid. I’ll choose the rest.'
                : 'How you will use it, preferred colours, dimensions, stitching, or anything else that matters.'
            }
            required
            value={details}
            onChange={(event) => {
              setDetails(event.target.value);
              resetError();
            }}
          />
        </label>

        <button type="submit" className="btn" disabled={status === 'sending'}>
          {status === 'sending'
            ? 'Sending…'
            : makersChoice
              ? "Send Maker's Choice Request"
              : 'Send Commission Idea'}{' '}
          {status !== 'sending' && <span aria-hidden="true">↗</span>}
        </button>

        <div className="form-feedback" aria-live="polite" aria-atomic="true">
          {status === 'sent' && (
            <output className="form-status">
              Thanks — your idea is on its way. I’ll reply by email.
            </output>
          )}
          {status === 'error' && (
            <p className="form-error" role="alert">
              The form could not send. Your details are still here; use the
              email option below instead.
            </p>
          )}
        </div>

        <p className="form-note">
          Want to attach reference photos?{' '}
          <a href={emailHref}>Continue in your email app</a> instead.
        </p>
      </div>
    </form>
  );
}
