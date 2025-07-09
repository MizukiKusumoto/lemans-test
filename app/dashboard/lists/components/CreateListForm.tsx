'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import LinkInput from './LinkInput'
import FileUpload from './FileUpload'
import { createCompanyList } from '../actions'

type InputMode = 'link' | 'file'

export default function CreateListForm() {
    const [inputMode, setInputMode] = useState<InputMode>('link')
    const [links, setLinks] = useState<string[]>([''])
    const [file, setFile] = useState<File | null>(null)
    const [listName, setListName] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (!listName.trim()) {
            newErrors.listName = 'リスト名を入力してください。'
        }
        
        if (inputMode === 'link') {
            const validLinks = links.filter(link => link.trim() !== '')
            if (validLinks.length === 0) {
                newErrors.links = '少なくとも1つのリンクを入力してください。'
            } else {
                // Validate each link
                for (const link of validLinks) {
                    try {
                        new URL(link)
                    } catch {
                        newErrors.links = '無効なURLが含まれています。'
                        break
                    }
                }
            }
        } else {
            if (!file) {
                newErrors.file = 'ファイルを選択してください。'
            }
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCreateList = async () => {
        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setErrors({})
        
        try {
            const formData = new FormData()
            formData.append('name', listName)
            formData.append('description', description)
            
            if (inputMode === 'link') {
                links.filter(link => link.trim() !== '').forEach(link => {
                    formData.append('links', link)
                })
            } else if (file) {
                formData.append('file', file)
            }
            
            const result = await createCompanyList(formData)
            
            if (result.success) {
                // Reset form
                setListName('')
                setDescription('')
                setLinks([''])
                setFile(null)
                setErrors({})
                alert('リストが正常に作成されました！')
            }
        } catch (error) {
            console.error('Error creating list:', error)
            setErrors({ submit: 'リスト作成中にエラーが発生しました。' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* List Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">リスト情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="listName">リスト名</Label>
                        <Input
                            id="listName"
                            type="text"
                            placeholder="例: 製造業リスト"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            required
                            className={errors.listName ? 'border-red-500' : ''}
                        />
                        {errors.listName && (
                            <p className="text-sm text-red-500">{errors.listName}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">説明（オプション）</Label>
                        <Textarea
                            id="description"
                            placeholder="リストの説明を入力してください"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Input Mode Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">入力方式選択</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button
                            variant={inputMode === 'link' ? 'default' : 'outline'}
                            onClick={() => setInputMode('link')}
                            className={inputMode === 'link' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                            リンクから作成
                        </Button>
                        <Button
                            variant={inputMode === 'file' ? 'default' : 'outline'}
                            onClick={() => setInputMode('file')}
                            className={inputMode === 'file' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                            ファイルから作成
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Input Content */}
            {inputMode === 'link' ? (
                <div>
                    <LinkInput links={links} setLinks={setLinks} />
                    {errors.links && (
                        <p className="text-sm text-red-500 mt-2">{errors.links}</p>
                    )}
                </div>
            ) : (
                <div>
                    <FileUpload file={file} setFile={setFile} />
                    {errors.file && (
                        <p className="text-sm text-red-500 mt-2">{errors.file}</p>
                    )}
                </div>
            )}

            {/* Create Button */}
            <Card>
                <CardContent className="pt-6">
                    {errors.submit && (
                        <p className="text-sm text-red-500 mb-4">{errors.submit}</p>
                    )}
                    <Button 
                        onClick={handleCreateList}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? '作成中...' : '✓ リスト作成'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}