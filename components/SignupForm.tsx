"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from 'react-dom'
import { signup } from '@/app/auth/actions'

export default function SignupForm() {
    const initialState = {
        message: '',
        success: false,
        requiresEmailConfirmation: false
    }

    const [formState, formAction] = useFormState(signup, initialState)
    const { pending } = useFormStatus()

    return (
        <form action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    required
                />
            </div>
            <div className="grid gap-2 mt-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    required
                />
            </div>
            <div className="grid gap-2 mt-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                />
            </div>
            <Button className="w-full mt-4" type="submit" aria-disabled={pending}>  {pending ? 'Submitting...' : 'Sign up'}</Button>
            {formState?.message && (
                <p className={`text-sm text-center py-2 ${formState.success ? 'text-green-600' : 'text-red-500'}`}>
                    {formState.message}
                </p>
            )}
            {formState?.success && formState?.requiresEmailConfirmation && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                        Please check your email and click the verification link to complete your registration.
                    </p>
                </div>
            )}
            {formState?.success && !formState?.requiresEmailConfirmation && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                        Your account has been created and verified! You can now login.
                    </p>
                </div>
            )}
        </form>
    )
}