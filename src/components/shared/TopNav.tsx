"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  title?: string;
  actionLabel?: string;
};

export function TopNav({ title = "Astikan", actionLabel = "Emergency" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-6.7-4.4-9.2-8C.7 10.3 1.4 6.6 4.4 5a5.4 5.4 0 0 1 5.9.7L12 7.1l1.7-1.4A5.4 5.4 0 0 1 19.6 5c3 1.6 3.7 5.3 1.6 8-2.5 3.6-9.2 8-9.2 8Z" />
            </svg>
          </div>
          <div className="brand-copy">
            <h1>{title}</h1>
          </div>
        </div>

        <div className="top-nav__actions">
          <button className="emergency-btn" type="button">
            {actionLabel}
          </button>
          <button
            className="top-nav__toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {open && (
        <div className="top-nav__menu">
          <Link href="/" className="top-nav__link" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/analysis" className="top-nav__link" onClick={() => setOpen(false)}>
            Analysis
          </Link>
          <button className="emergency-btn emergency-btn--menu" type="button">
            {actionLabel}
          </button>
        </div>
      )}
    </header>
  );
}
