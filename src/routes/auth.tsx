import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Phone, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FLTY" },
      { name: "description", content: "Sign in to FLTY with your mobile number." },
      { property: "og:title", content: "Sign in — FLTY" },
      { property: "og:description", content: "Mobile OTP login." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/orders" });
  }, [session, navigate]);

  const fullPhone = `+91${phone.replace(/\D/g, "")}`;

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("provider") ? "SMS provider not configured yet. Add Twilio credentials in backend settings." : error.message);
      return;
    }
    toast.success(`OTP sent to ${fullPhone}`);
    setStep("otp");
  }

  async function verifyOtp() {
    if (otp.length !== 6) return;
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    setLoading(false);
    if (error) {
      toast.error("Invalid OTP. Try again.");
      return;
    }
    toast.success("Welcome to FLTY!");
    navigate({ to: "/orders" });
  }

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
        <Card className="p-8">
          {step === "phone" ? (
            <>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-yellow">
                <Phone className="h-6 w-6 text-foreground" />
              </div>
              <h1 className="mt-4 text-3xl font-extrabold">Sign in</h1>
              <p className="mt-1 text-muted-foreground">We'll send a 6-digit OTP to your mobile.</p>
              <form className="mt-6 space-y-4" onSubmit={sendOtp}>
                <div>
                  <Label htmlFor="phone">Mobile number</Label>
                  <div className="mt-1.5 flex overflow-hidden rounded-md border border-input">
                    <span className="grid place-items-center bg-accent px-3 text-sm font-medium">+91</span>
                    <Input
                      id="phone"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="98765 43210"
                      className="border-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" onClick={() => setStep("phone")}>
                <ArrowLeft className="h-4 w-4" /> Change number
              </button>
              <div className="mt-4 grid h-12 w-12 place-items-center rounded-xl bg-primary">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="mt-4 text-3xl font-extrabold">Enter OTP</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sent to <span className="font-semibold text-foreground">{fullPhone}</span>
              </p>
              <div className="mt-6 flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(v) => { setOtp(v); if (v.length === 6) setTimeout(() => verifyOtp(), 100); }}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button size="lg" className="mt-6 w-full" disabled={loading || otp.length !== 6} onClick={verifyOtp}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
              </Button>
              <button className="mt-4 w-full text-sm text-muted-foreground hover:text-primary" onClick={sendOtp as any}>
                Resend OTP
              </button>
            </>
          )}
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our <Link to="/" className="underline">Terms</Link>.
        </p>
      </div>
    </SiteShell>
  );
}
