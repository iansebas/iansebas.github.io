import { redirect } from 'next/navigation'

interface PDFRedirectPageProps {
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  // Generate some common PDF names that should redirect to resume
  return [
    { slug: ['resume.pdf'] },
    { slug: ['cv.pdf'] },
    { slug: ['portfolio.pdf'] },
    { slug: ['anything-else.pdf'] }
  ]
}

export default function PDFRedirectPage({ params }: PDFRedirectPageProps) {
  // Server-side redirect to resume
  redirect('/resume')
}