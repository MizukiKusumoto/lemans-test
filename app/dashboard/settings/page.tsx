import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SettingsLayout from './components/SettingsLayout'
import CompanySettings from './components/CompanySettings'
import EmailSettings from './components/EmailSettings'
import PaymentSettings from './components/PaymentSettings'

export default async function SettingsPage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // TODO: Fetch user settings from database
  const companyData = {
    companyName: 'エーワンロード株式会社',
    contactName: '田中太郎',
    position: '営業部長',
    email: data.user.email || '',
    phone: '03-1234-5678',
    website: 'https://a-oneroad.com',
  }

  const emailData = {
    emailEnabled: true,
    senderName: '田中太郎',
    senderEmail: data.user.email || '',
    signature: '田中太郎\nエーワンロード株式会社\n営業部\nTEL: 03-1234-5678\nEmail: tanaka@a-oneroad.com',
    companyRegistration: '法人番号: 1234567890123 / 代表取締役: 田中太郎',
    companyAddress: '〒100-0001 東京都千代田区千代田1-1-1',
    companyPhone: '03-1234-5678',
    companyWebsite: 'https://a-oneroad.com',
  }

  const paymentData = {
    planName: 'Basic Plan',
    planPrice: '¥9,800',
    nextBillingDate: '2025/07/01',
  }

  return (
    <SettingsLayout>
      <CompanySettings initialData={companyData} />
      <EmailSettings initialData={emailData} />
      <PaymentSettings initialData={paymentData} />
    </SettingsLayout>
  )
}