import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Headphones, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FLTY Services - We're here to help" },
      {
        name: "description",
        content:
          "Talk to our farmer support team via phone, WhatsApp or email. Multilingual assistance available.",
      },
      { property: "og:title", content: "Contact FLTY Services" },
      { property: "og:description", content: "Farmer support in your local language." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState("");

  return (
    <SiteShell>
      {/* Background Hero wrapper */}
      <div className="bg-[#FCFCFB] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* LEFT COLUMN: GET IN TOUCH */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#09B652] font-bold text-sm uppercase tracking-wider">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.1 5.1 19.3c-.1.3-.4.5-.7.5h-1c-.5 0-.9-.5-.8-1C3.5 13.9 6.2 5.2 16.6 3.1c.5-.1 1 .3.9.8V7c0 .6-.2.9-.5 1zm1.2.7c1-.7 2-1.7 2-1.7s-.9.7-2.3 1.3v.4z" />
                  </svg>
                  <span>Get In Touch</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-[#0f2018] tracking-tight">
                  Contact <span className="text-[#09B652]">Us</span>
                </h1>
                <p className="text-sm sm:text-base text-[#6b7a72] leading-relaxed max-w-md">
                  Have questions or need assistance? We're here to help! Reach out to us and our
                  team will get back to you as soon as possible.
                </p>
              </div>

              {/* Info Cards stack */}
              <div className="space-y-4">
                {/* Card 1: Address */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#056830] text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#0f2018]">Our Address</h3>
                    <p className="text-xs sm:text-sm text-[#6b7a72] leading-relaxed">
                      Guntur, Andhra Pradesh — 522001
                    </p>
                  </div>
                </div>

                {/* Card 2: Phone */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#056830] text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#0f2018]">Call Us</h3>
                    <p className="text-xs sm:text-sm text-[#6b7a72] font-semibold">
                      +91 94408 58865
                    </p>
                    <p className="text-[11px] text-[#6b7a72]/85">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Card 3: Email */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#056830] text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#0f2018]">Email Us</h3>
                    <p className="text-xs sm:text-sm text-[#6b7a72] font-semibold break-all">
                      support@fltyservices.in
                    </p>
                  </div>
                </div>

                {/* Card 4: Support */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#056830] text-white">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#0f2018]">Customer Support</h3>
                    <p className="text-xs sm:text-sm text-[#6b7a72] leading-relaxed">
                      We're here to help you with your queries
                    </p>
                    <p className="text-[11px] text-[#6b7a72]/85">24/7 Support Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SEND MESSAGE FORM */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-10 bg-white border border-gray-100 shadow-xl rounded-3xl">
                <h2 className="text-2xl font-bold text-[#0f2018] tracking-tight">
                  Send Us a Message
                </h2>

                {sent ? (
                  <div className="mt-8 rounded-2xl bg-[#edfaf3] p-8 text-center border border-[#09B652]/20">
                    <div className="text-xl font-extrabold text-[#056830]">
                      Thank you! Message Sent.
                    </div>
                    <p className="mt-2 text-sm text-[#6b7a72]">
                      Our farmer support squad will reach out to you shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    className="mt-8 space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                      toast.success("Message sent successfully!");
                    }}
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold text-[#0f2018]">
                          Your Name *
                        </Label>
                        <Input
                          id="name"
                          required
                          placeholder="Enter your full name"
                          className="h-11 rounded-lg border-gray-300 focus:border-[#09B652] focus:ring-1 focus:ring-[#09B652] text-sm bg-gray-50/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold text-[#0f2018]">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          required
                          type="tel"
                          placeholder="Enter your phone number"
                          className="h-11 rounded-lg border-gray-300 focus:border-[#09B652] focus:ring-1 focus:ring-[#09B652] text-sm bg-gray-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-[#0f2018]">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          required
                          type="email"
                          placeholder="Enter your email address"
                          className="h-11 rounded-lg border-gray-300 focus:border-[#09B652] focus:ring-1 focus:ring-[#09B652] text-sm bg-gray-50/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-xs font-bold text-[#0f2018]">
                          Subject *
                        </Label>
                        <select
                          id="subject"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="flex h-11 w-full rounded-lg border border-gray-300 bg-gray-50/50 px-3 py-2 text-sm focus:border-[#09B652] focus:outline-none focus:ring-1 focus:ring-[#09B652] text-gray-500"
                        >
                          <option value="" disabled>
                            Select a subject
                          </option>
                          <option value="rentals">Machinery &amp; Service Rental</option>
                          <option value="inputs">Agri-Inputs Purchase</option>
                          <option value="labor">Labor Squad Booking</option>
                          <option value="other">General Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="msg" className="text-xs font-bold text-[#0f2018]">
                        Message *
                      </Label>
                      <Textarea
                        id="msg"
                        rows={5}
                        required
                        placeholder="Type your message here..."
                        className="rounded-lg border-gray-300 focus:border-[#09B652] focus:ring-1 focus:ring-[#09B652] text-sm bg-gray-50/50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-lg bg-[#056830] hover:bg-[#077a37] text-white font-extrabold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#6b7a72] mt-4">
                      <ShieldCheck className="h-4 w-4 text-[#09B652]" />
                      <span>Your information is safe with us. We never share your details.</span>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
