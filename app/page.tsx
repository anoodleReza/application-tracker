import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UserNav from "@/components/UserNavigation";

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-4xl mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold mb-2">
                        Job Application Tracker
                    </CardTitle>
                    <CardDescription className="text-xl">
                        Keep track of your job applications, interviews, and offers in one place
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-8">
                            <FeatureCard
                                title="Track Applications"
                                description="Organize all your job applications in one central dashboard"
                            />
                            <FeatureCard
                                title="Manage Interviews"
                                description="Keep track of upcoming interviews and preparation notes"
                            />
                            <FeatureCard
                                title="Monitor Progress"
                                description="View insights and statistics about your job search"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Link href="/auth/login">
                                <Button variant="default" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button variant="outline" size="lg">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="border rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}