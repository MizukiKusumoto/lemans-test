import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import MailManagementClient from './mail-management-client'

export default async function MailManagementPage() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  return <MailManagementClient />
}
