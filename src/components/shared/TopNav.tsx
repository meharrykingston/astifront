"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Props = {
  title?: string;
  actionLabel?: string;
};

export function TopNav({ title = "Astikan", actionLabel = "Emergency" }: Props) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open]);

  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            <Image
              className="brand-icon__image"
              src="/astikanlogo.svg"
              alt=""
              width={42}
              height={42}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div className="brand-copy">
            <h1>{title}</h1>
          </div>
        </div>

        <div className="top-nav__actions">
          {!isMobile && (
            <button className="emergency-btn" type="button">
              {actionLabel}
            </button>
          )}
          {isMobile && (
            <button
              className="top-nav__toggle"
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {isMobile && open && (
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
