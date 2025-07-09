import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardSidebar from '@/components/DashboardSidebar'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
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
                    <h1 className="text-lg font-medium text-gray-800">2025年6月1日送信分</h1>
                    <div className="flex gap-2">
                        <span className="text-sm text-blue-600">返信時間</span>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm rounded-full">ラベル</Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="text-sm text-green-600 mb-2">送信成功: 7002件</div>
                            <div className="text-4xl font-bold text-green-600">75%</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="text-sm text-orange-500 mb-2">返信: 13件</div>
                            <div className="text-4xl font-bold text-orange-500">0.75%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Area */}
                <Card className="bg-white mb-8">
                    <CardContent className="p-6">
                        <div className="h-48 relative">
                            <svg className="w-full h-full" viewBox="0 0 800 200">
                                {/* Grid lines */}
                                <defs>
                                    <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />

                                {/* Blue line */}
                                <path
                                    d="M 50 150 Q 150 120 250 140 T 450 100 T 650 120 T 750 90"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                />

                                {/* Purple line */}
                                <path
                                    d="M 50 180 Q 150 160 250 170 T 450 130 T 650 110 T 750 80"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="2"
                                />

                                {/* Data point */}
                                <circle cx="550" cy="110" r="4" fill="#1f2937" />
                                <text x="540" y="100" className="text-xs fill-gray-600">
                                    267
                                </text>
                            </svg>

                            {/* Time labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
                                <span>10am</span>
                                <span>11am</span>
                                <span>12pm</span>
                                <span>01pm</span>
                                <span>02pm</span>
                                <span>03pm</span>
                                <span>04pm</span>
                                <span>05pm</span>
                                <span>06pm</span>
                                <span>07pm</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="bg-white">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium">案件化リスト：13件</h2>
                            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
                                詳細分析
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">優先度</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">宛名</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">業界</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">受信時間</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-blue-100 border-b">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center h-6">
                                                <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
                                                    A
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">オード技研株式会社</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">研究開発に興味あり</td>
                                        <td className="py-3 px-4 text-sm">2025/06/02</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                                    詳細
                                                </Button>
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                                                    返信
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="bg-blue-100 border-b">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center h-6">
                                                <Badge variant="secondary" className="bg-green-100 text-green-600 text-xs">
                                                    A
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">株式会社東洋工業</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">詳細を聞きたい</td>
                                        <td className="py-3 px-4 text-sm">2025/06/02</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                                    詳細
                                                </Button>
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                                                    返信
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="bg-blue-100 border-b">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center h-6">
                                                <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
                                                    C
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">エイチィー商事会社</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">資料が欲しい</td>
                                        <td className="py-3 px-4 text-sm">2025/06/02</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                                    詳細
                                                </Button>
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                                                    返信
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
                                全リスト
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}