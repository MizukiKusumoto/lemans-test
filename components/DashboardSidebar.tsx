'use client'

import { usePathname } from 'next/navigation'
import { FileText, Mail, Settings, LogOut, TrendingUp } from "lucide-react"

export default function DashboardSidebar() {
    const pathname = usePathname()
    
    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(path)
    }

    return (
        <div className="w-64 bg-white shadow-sm border-r">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        SA
                    </div>
                    <span className="text-sm text-gray-700">エーワンロード株式会社</span>
                </div>

                <nav className="space-y-2">
                    <a 
                        href="/dashboard" 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                            isActive('/dashboard') 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">ダッシュボード</span>
                    </a>
                    <a 
                        href="/dashboard/lists/create" 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                            isActive('/dashboard/lists') 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">リスト作成/管理</span>
                    </a>
                    <a 
                        href="/dashboard/mail" 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                            isActive('/dashboard/mail') 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">文面送信</span>
                    </a>
                    <a 
                        href="/dashboard/settings" 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                            isActive('/dashboard/settings') 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">設定</span>
                    </a>
                </nav>
            </div>

            <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">ログアウト</span>
                </div>
            </div>
        </div>
    )
}