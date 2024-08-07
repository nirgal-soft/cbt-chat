import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Auth from '../components/Auth'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/chat')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="w-full max-w-md p-8">
        <Auth />
      </div>
    </div>
  )
}
