'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Mail, Settings, LogOut, TrendingUp, AlertCircle } from "lucide-react"

// Form data type
interface FormData {
    listTarget: string
    targetAppointments: number
    industry: string
    purpose: string
    tone: string
    experience: string
    service: string
    impact: string
}

// Form validation errors
interface FormErrors {
    listTarget?: string
    targetAppointments?: string
    industry?: string
    purpose?: string
    tone?: string
    experience?: string
    service?: string
    impact?: string
}

export default function MailManagementClient() {
    // State for form data
    const [formData, setFormData] = useState<FormData>({
        listTarget: '',
        targetAppointments: 12,
        industry: '',
        purpose: '',
        tone: '',
        experience: '',
        service: '',
        impact: ''
    })

    // State for form validation errors
    const [formErrors, setFormErrors] = useState<FormErrors>({})

    // State for preview
    const [preview, setPreview] = useState(`会社名は弊社の営業活動にとって重要な情報源となっております。弊社は先月より新機能を追加し、お客様の業務効率化を支援する新しい機能を導入しました。

この機能により、お客様の営業活動が大幅に効率化されることが期待されます。弊社では今後も継続的にサービスの向上を図り、お客様の業務をサポートしてまいります。

ご不明な点がございましたら、いつでもお気軽にお問い合わせください。`)

    // State for loading and error handling
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleInputChange = (field: keyof FormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const errors: FormErrors = {}
        
        if (!formData.listTarget) {
            errors.listTarget = 'リスト送信先を選択してください'
        }
        
        if (!formData.industry) {
            errors.industry = '想定業種を選択してください'
        }
        
        if (!formData.purpose) {
            errors.purpose = '目的を選択してください'
        }
        
        if (!formData.tone) {
            errors.tone = 'トーンを選択してください'
        }
        
        if (!formData.experience.trim()) {
            errors.experience = '原体験・エピソードを入力してください'
        }
        
        if (!formData.service.trim()) {
            errors.service = '提供サービスを入力してください'
        }
        
        if (!formData.impact.trim()) {
            errors.impact = 'インパクトを入力してください'
        }
        
        if (formData.targetAppointments <= 0) {
            errors.targetAppointments = '目標アポ数は1以上の数値を入力してください'
        }
        
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handlePreview = async () => {
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement preview generation with AI
            console.log('Generating preview with:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Update preview with form data (placeholder implementation)
            setPreview(`${formData.experience}

${formData.service}について、${formData.industry}の皆様に特化したソリューションを提供しております。

${formData.impact}

このような成果を、${formData.tone === 'formal' ? '丁寧に' : formData.tone === 'casual' ? 'カジュアルに' : 'フレンドリーに'}お伝えさせていただきます。`)
            
        } catch (err) {
            setError('プレビューの生成に失敗しました。もう一度お試しください。')
            console.error('Preview generation error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOutputTest = async () => {
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement output test
            console.log('Testing output with:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            alert('出力テストが完了しました')
            
        } catch (err) {
            setError('出力テストに失敗しました。もう一度お試しください。')
            console.error('Output test error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendPreparation = async () => {
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement send preparation
            console.log('Preparing to send with:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            alert('送信準備が完了しました')
            
        } catch (err) {
            setError('送信準備に失敗しました。もう一度お試しください。')
            console.error('Send preparation error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-64 bg-white shadow-sm border-r">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            SA
                        </div>
                        <span className="text-sm text-gray-700">エーワンロード株式会社</span>
                    </div>

                    <nav className="space-y-2">
                        <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">ダッシュボード</span>
                        </a>
                        <a href="/dashboard/lists/create" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">リスト作成/管理</span>
                        </a>
                        <div className="flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">文面送信</span>
                        </div>
                        <a href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
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

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Left Configuration Panel */}
                <div className="w-80 bg-white border-r p-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium mb-4">トーン</h2>
                            <Select onValueChange={(value) => handleInputChange('tone', value)}>
                                <SelectTrigger className={formErrors.tone ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="formal">フォーマル</SelectItem>
                                    <SelectItem value="casual">カジュアル</SelectItem>
                                    <SelectItem value="friendly">フレンドリー</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.tone && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.tone}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="listTarget" className="text-sm font-medium">リスト送信先</Label>
                            <Select onValueChange={(value) => handleInputChange('listTarget', value)}>
                                <SelectTrigger className={`mt-2 ${formErrors.listTarget ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manufacturing">製造業リスト</SelectItem>
                                    <SelectItem value="it">IT業界リスト</SelectItem>
                                    <SelectItem value="finance">金融業リスト</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.listTarget && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.listTarget}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="targetAppointments" className="text-sm font-medium">目標アポ数</Label>
                            <Input
                                id="targetAppointments"
                                type="number"
                                value={formData.targetAppointments}
                                onChange={(e) => handleInputChange('targetAppointments', parseInt(e.target.value) || 0)}
                                className={`mt-2 ${formErrors.targetAppointments ? 'border-red-500' : ''}`}
                                min={1}
                            />
                            {formErrors.targetAppointments && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.targetAppointments}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="industry" className="text-sm font-medium">想定業種</Label>
                            <Select onValueChange={(value) => handleInputChange('industry', value)}>
                                <SelectTrigger className={`mt-2 ${formErrors.industry ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manufacturing">製造業</SelectItem>
                                    <SelectItem value="it">IT業界</SelectItem>
                                    <SelectItem value="finance">金融業</SelectItem>
                                    <SelectItem value="healthcare">医療・ヘルスケア</SelectItem>
                                    <SelectItem value="retail">小売業</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.industry && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.industry}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="purpose" className="text-sm font-medium">目的設定</Label>
                            <Select onValueChange={(value) => handleInputChange('purpose', value)}>
                                <SelectTrigger className={`mt-2 ${formErrors.purpose ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lead">リード獲得</SelectItem>
                                    <SelectItem value="sales">営業促進</SelectItem>
                                    <SelectItem value="branding">ブランディング</SelectItem>
                                    <SelectItem value="demo">デモ依頼</SelectItem>
                                    <SelectItem value="inquiry">問い合わせ獲得</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.purpose && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.purpose}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Center Main Content */}
                <div className="flex-1 p-6">
                    <div className="mb-6">
                        <h1 className="text-xl font-medium">mail 文面送信</h1>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">原体験・エピソード</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="御社の具体的な課題や背景となるエピソードを記載してください。"
                                    value={formData.experience}
                                    onChange={(e) => handleInputChange('experience', e.target.value)}
                                    rows={4}
                                    className={`resize-none ${formErrors.experience ? 'border-red-500' : ''}`}
                                />
                                {formErrors.experience && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">提供サービス</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="「営業ルマン」を具体的に説明してください。"
                                    value={formData.service}
                                    onChange={(e) => handleInputChange('service', e.target.value)}
                                    rows={4}
                                    className={`resize-none ${formErrors.service ? 'border-red-500' : ''}`}
                                />
                                {formErrors.service && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>
                                )}
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        ヒント：貴社が実際に利用できる具体的な機能や利点を含めて説明すると効果的です。
                                        「営業ルマン」の具体的な機能や成果を説明することで、顧客の関心を引くことができます。
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">インパクト</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="開始12時間でコンバージョン獲得"
                                    value={formData.impact}
                                    onChange={(e) => handleInputChange('impact', e.target.value)}
                                    rows={4}
                                    className={`resize-none ${formErrors.impact ? 'border-red-500' : ''}`}
                                />
                                {formErrors.impact && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.impact}</p>
                                )}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        ヒント：数値や具体的な成果を含めて、御社のサービスの価値やインパクトを表現してください。
                                        「○○%向上」「○○時間削減」など、具体的な数値を含めると効果的です。
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Preview Panel */}
                <div className="w-96 bg-white border-l p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium mb-2">出力例</h2>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                            営業法人商品説明用
                        </Badge>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                {preview}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <Button 
                            onClick={handlePreview}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {isLoading ? 'プレビュー生成中...' : 'edit 修正'}
                        </Button>
                        <Button 
                            onClick={handleOutputTest}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {isLoading ? '処理中...' : 'edit 出力テスト'}
                        </Button>
                        <Button 
                            onClick={handleSendPreparation}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {isLoading ? '準備中...' : 'edit 送信準備'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}