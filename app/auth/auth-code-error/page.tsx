import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex items-center justify-center bg-muted min-h-screen">
            <Card className="w-[400px] mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
                    <CardDescription>
                        There was an error confirming your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This could be due to an expired or invalid confirmation link. 
                        Please try signing up again or contact support if the problem persists.
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button asChild variant="outline">
                            <Link href="/signup">Sign Up Again</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}