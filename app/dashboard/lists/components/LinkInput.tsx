'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

interface LinkInputProps {
    links: string[]
    setLinks: (links: string[]) => void
}

export default function LinkInput({ links, setLinks }: LinkInputProps) {
    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links]
        newLinks[index] = value
        setLinks(newLinks)
    }

    const addLink = () => {
        setLinks([...links, ''])
    }

    const removeLink = (index: number) => {
        if (links.length > 1) {
            const newLinks = links.filter((_, i) => i !== index)
            setLinks(newLinks)
        }
    }

    const isValidUrl = (url: string) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">リンク入力</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {links.map((link, index) => (
                    <div key={index} className="space-y-2">
                        <Label htmlFor={`link-${index}`}>
                            {index === 0 ? 'HP' : index === 1 ? 'JP' : 'HP'}
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id={`link-${index}`}
                                type="url"
                                placeholder="リンクをコピー"
                                value={link}
                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                className={link && !isValidUrl(link) ? 'border-red-500' : ''}
                            />
                            {links.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeLink(index)}
                                    className="px-2"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        {link && !isValidUrl(link) && (
                            <p className="text-sm text-red-500">有効なURLを入力してください</p>
                        )}
                    </div>
                ))}
                
                <Button
                    type="button"
                    variant="outline"
                    onClick={addLink}
                    className="w-full mt-4"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    リンクを追加
                </Button>
            </CardContent>
        </Card>
    )
}