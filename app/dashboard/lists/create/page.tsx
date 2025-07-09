import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Mail, Settings, LogOut, TrendingUp, Plus, Star } from "lucide-react"
import CreateListForm from '../components/CreateListForm'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function CreateListPage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-medium text-gray-800">リスト作成/管理</h1>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        作成
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                        <CreateListForm />
                    </div>

                    {/* Right Column - Preview */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">今月作成上限</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl font-bold text-green-600">853</span>
                                    <span className="text-gray-500">/ 10000</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{width: '8.53%'}}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">リスト追加</CardTitle>
                                    <Button 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Star className="w-4 h-4 mr-1" />
                                        リスト追加
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">昭和工業株式会社</span>
                                            <Badge variant="secondary" className="text-xs">
                                                2025/06/02
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                詳細
                                            </Badge>
                                            <Badge className="bg-blue-600 text-white text-xs">
                                                送信
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">株式会社東洋工業</span>
                                            <Badge variant="secondary" className="text-xs">
                                                2025/06/02
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                詳細
                                            </Badge>
                                            <Badge className="bg-blue-600 text-white text-xs">
                                                送信
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">株式会社部品工業</span>
                                            <Badge variant="secondary" className="text-xs">
                                                2025/06/02
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                詳細
                                            </Badge>
                                            <Badge className="bg-blue-600 text-white text-xs">
                                                送信
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <Button 
                                        variant="outline" 
                                        className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                                    >
                                        全表示
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}