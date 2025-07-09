'use client'

import { ReactNode } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">設定</h1>
          <p className="text-gray-600">会社情報とメール配信設定を管理します</p>
        </div>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}