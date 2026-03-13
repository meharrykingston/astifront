import { redirect } from 'next/navigation';

// This page automatically redirects to the dashboard
export default function SeoRootPage() {
  redirect('/seo/dashboard');
}