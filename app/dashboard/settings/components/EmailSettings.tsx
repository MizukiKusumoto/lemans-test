'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EmailSettingsProps {
  initialData?: {
    emailEnabled: boolean
    senderName: string
    senderEmail: string
    signature: string
    companyRegistration: string
    companyAddress: string
    companyPhone: string
    companyWebsite: string
  }
}

export default function EmailSettings({ initialData }: EmailSettingsProps) {
  const [formData, setFormData] = useState({
    emailEnabled: initialData?.emailEnabled || false,
    senderName: initialData?.senderName || '',
    senderEmail: initialData?.senderEmail || '',
    signature: initialData?.signature || '',
    companyRegistration: initialData?.companyRegistration || '',
    companyAddress: initialData?.companyAddress || '',
    companyPhone: initialData?.companyPhone || '',
    companyWebsite: initialData?.companyWebsite || '',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Temporary: Show message instead of actual save
      console.log('Saving email settings:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      alert('メール設定を保存しました（※現在はデモ機能です）')
    } catch (error) {
      console.error('Error saving email settings:', error)
      alert('メール設定の保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">メール配信設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="emailEnabled"
            checked={formData.emailEnabled}
            onCheckedChange={(checked) => handleChange('emailEnabled', checked)}
          />
          <Label htmlFor="emailEnabled" className="text-sm font-medium">
            メール配信を有効にする
          </Label>
        </div>

        {formData.emailEnabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">送信者名</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => handleChange('senderName', e.target.value)}
                  placeholder="田中太郎"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderEmail">送信者メールアドレス</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) => handleChange('senderEmail', e.target.value)}
                  placeholder="tanaka@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature">署名</Label>
              <Textarea
                id="signature"
                value={formData.signature}
                onChange={(e) => handleChange('signature', e.target.value)}
                placeholder="田中太郎&#10;エーワンロード株式会社&#10;営業部&#10;TEL: 03-1234-5678&#10;Email: tanaka@example.com"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium">法人登録情報</h3>
              
              <div className="space-y-2">
                <Label htmlFor="companyRegistration">会社登録番号・代表者名</Label>
                <Input
                  id="companyRegistration"
                  value={formData.companyRegistration}
                  onChange={(e) => handleChange('companyRegistration', e.target.value)}
                  placeholder="法人番号: 1234567890123 / 代表取締役: 田中太郎"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">会社住所</Label>
                <Input
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => handleChange('companyAddress', e.target.value)}
                  placeholder="〒100-0001 東京都千代田区千代田1-1-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">電話番号</Label>
                  <Input
                    id="companyPhone"
                    value={formData.companyPhone}
                    onChange={(e) => handleChange('companyPhone', e.target.value)}
                    placeholder="03-1234-5678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">ウェブサイト</Label>
                  <Input
                    id="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={(e) => handleChange('companyWebsite', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}