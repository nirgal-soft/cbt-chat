import { useEffect, useState, FC, ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const withAdminAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AdminRoute: FC<P> = (props) => {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
      const checkAdminRole = async () => {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (error || userData?.role !== 'admin') {
            router.push('/')
          } else {
            setLoading(false)
          }
        } else {
          router.push('/')
        }
      }

      checkAdminRole()
    }, [router, supabase])

    if (loading) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }

  return AdminRoute
}

export default withAdminAuth
