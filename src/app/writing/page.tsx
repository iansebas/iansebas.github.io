'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Writing() {
  const router = useRouter();
  const substackUrl = 'https://iansebas.substack.com/';
  
  // Redirect to Substack immediately
  useEffect(() => {
    window.location.href = substackUrl;
  }, []);
  
  // This page won't be visible as it redirects immediately
  return null;
}