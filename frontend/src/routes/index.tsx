import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Boxes, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import loginIllustration from "@/assets/login-illustration.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — SmartERP" },
      { name: "description", content: "Sign in to your SmartERP enterprise workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("charitha@gmail.com");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signup";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://smarterp-production-b6c9.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login successful", {
          description: "Select your company to continue.",
        });

        navigate({ to: "/companies" });
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://smarterp-production-b6c9.up.railway.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully", {
          description: "You can sign in with your new account now.",
        });
        setMode("signin");
        setName("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Sign up failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-10 inline-flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-foreground">SmartERP</p>
              <p className="text-xs text-muted-foreground">Enterprise Suite</p>
            </div>
          </Link>

          <div className="mb-8 space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp
                ? "Create a workspace account to start using SmartERP."
                : "Enter your company email to open your workspace dashboard."}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Company email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset link sent to your email.")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center gap-2">
                <Checkbox id="remember" defaultChecked />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                  Keep me signed in
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? (isSignUp ? "Creating account…" : "Signing in…") : isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don&apos;t have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isSignUp ? "signin" : "signup")}
              className="font-medium text-primary hover:underline"
            >
              {isSignUp ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>
      </div>

      {/* Right: illustration panel */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-accent to-background lg:flex">
        <div className="absolute -left-16 -top-16 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 max-w-lg px-12 text-center">
          <img
            src={loginIllustration}
            alt="SmartERP analytics dashboard illustration"
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-md rounded-2xl shadow-card"
          />
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Run your business, end to end.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accounting, inventory, GST and reporting — unified in one fast, keyboard-first
            workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
