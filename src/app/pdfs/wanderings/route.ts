import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  redirect('https://www.unrulyabstractions.com/pdf/wanderings.pdf')
}