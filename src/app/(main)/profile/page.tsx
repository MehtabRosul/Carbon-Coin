import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your account settings and personal information."
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                                <AvatarFallback>UN</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Picture</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="User Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="user@example.com" disabled />
                    </div>
                    <Button>Update Profile</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Set a new password for your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Change Password</Button>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
             <Card className="bg-accent/20 border-accent">
                <CardHeader>
                    <CardTitle className="text-accent-foreground/80">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CardDescription className="text-accent-foreground/70">
                        Deleting your account is a permanent action and cannot be undone.
                    </CardDescription>
                    <Button variant="destructive" className="w-full">Delete My Account</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  )
}
