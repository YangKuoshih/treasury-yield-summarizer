import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TYILogo } from "@/components/tyi-logo";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Redirect to real dashboard with live data
    setTimeout(() => {
      window.location.href = "/dashboard/interest_rates";
    }, 1000);
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="glass border-white/20">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="flex justify-center">
              <TYILogo className="w-20 h-20" />
            </div>
            <div className="space-y-1">
              <h1 className="text-base font-medium text-muted-foreground tracking-wide">Economic Data Dashboard</h1>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-sm">
                Sign in to access your economic data dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-black/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-black/20"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <div className="text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">or </span>
                <Link href="/demo" className="text-muted-foreground hover:text-foreground underline underline-offset-4">
                  View Demo
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs font-medium text-muted-foreground mb-1">Demo credentials:</p>
              <p className="text-xs text-muted-foreground">Email: <span className="font-medium">demo@example.com</span></p>
              <p className="text-xs text-muted-foreground">Password: <span className="font-medium">demo123</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}