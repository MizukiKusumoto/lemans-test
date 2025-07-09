'use client'

import { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, X } from "lucide-react"

interface FileUploadProps {
    file: File | null
    setFile: (file: File | null) => void
}

export default function FileUpload({ file, setFile }: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const handleFileSelect = (selectedFile: File) => {
        // Check if file is CSV
        if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
            alert('CSVファイルのみアップロード可能です。')
            return
        }

        // Check file size (limit to 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            alert('ファイルサイズは10MB以下にしてください。')
            return
        }

        setFile(selectedFile)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            handleFileSelect(droppedFile)
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            handleFileSelect(selectedFile)
        }
    }

    const removeFile = () => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">ファイルアップロード</CardTitle>
            </CardHeader>
            <CardContent>
                {!file ? (
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragOver 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            ファイルをアップロード
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            ファイルをドラッグ&ドロップするか、クリックして選択してください
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                            対応形式: CSV (最大10MB)
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            ファイルを選択
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeFile}
                                className="px-2"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}