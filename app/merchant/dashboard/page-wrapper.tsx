import { redirect } from 'next/navigation';
import { requireOnboardingCompletion } from '@/lib/requireOnboarding';
import { headers } from 'next/headers';
import DashboardPageClient from './page-client';

export default async function DashboardPage() {
  const headersList = await headers();
  
  // Create request object for onboarding check
  const url = process.env.APP_BASE_URL || 'http://localhost';
  const request = new Request(url, {
    headers: headersList,
  });

  const result = await requireOnboardingCompletion(request as any);
  
  if (result.response) {
    return result.response;
  }

  return <DashboardPageClient />;
}

