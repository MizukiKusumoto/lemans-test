'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, ExternalLink } from 'lucide-react'
// import { createClient } from '@/utils/supabase/client'

interface PaymentSettingsProps {
  initialData?: {
    planName: string
    planPrice: string
    nextBillingDate: string
  }
}

export default function PaymentSettings({ initialData }: PaymentSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [planData, setPlanData] = useState({
    planName: initialData?.planName || 'Basic Plan',
    planPrice: initialData?.planPrice || '¥9,800',
    nextBillingDate: initialData?.nextBillingDate || '2025/07/01',
  })

  const handleManageBilling = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate billing portal link')
      }
      
      const { url } = await response.json()
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error accessing billing portal:', error)
      
      alert('請求管理画面へのアクセスに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">決済情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">現在のプラン</p>
              <p className="text-sm text-gray-600">{planData.planName}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            アクティブ
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">月額料金</p>
            <p className="text-lg font-semibold text-gray-900">{planData.planPrice}/月</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">次回請求日</p>
            <p className="text-lg font-semibold text-gray-900">{planData.nextBillingDate}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-4">
            請求書の確認、支払い方法の変更、プランの変更は外部の請求管理画面で行えます。
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleManageBilling}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                '読み込み中...'
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  請求管理画面を開く
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Powered by Stripe</span>
            <br />
            安全で信頼性の高い決済システムを使用しています
          </p>
        </div>
      </CardContent>
    </Card>
  )
}