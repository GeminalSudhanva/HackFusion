import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", collegeName: "", email: "", phone: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp({
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      college: form.collegeName,
      password: form.password
    });
    setLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "You can now login!" });
      navigate("/login");
    }
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-bg">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold gradient-text">Join Hack Fusion 2.0</h1>
          <p className="text-sm text-muted-foreground mt-1">Create your account to register</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
            <Input id="fullName" required value={form.fullName} onChange={update("fullName")} className="bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="collegeName" className="text-foreground">College Name</Label>
            <Input id="collegeName" required value={form.collegeName} onChange={update("collegeName")} className="bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={update("email")} className="bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
            <Input id="phone" type="tel" required value={form.phone} onChange={update("phone")} className="bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input id="password" type="password" required value={form.password} onChange={update("password")} className="bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <Input id="confirmPassword" type="password" required value={form.confirmPassword} onChange={update("confirmPassword")} className="bg-secondary border-border" />
          </div>
          <Button type="submit" variant="neon" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
