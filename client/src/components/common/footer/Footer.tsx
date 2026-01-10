import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import NewsletterSubscription from "./NewsletterSubscription";

export default function Footer() {
  const footerLinks = {
    solution: [
      { label: "Marketing", path: "/solution/marketing" },
      { label: "Analytics", path: "/solution/analytics" },
      { label: "Commerce", path: "/solution/commerce" },
      { label: "Insights", path: "/solution/insights" },
    ],
    support: [
      { label: "Marketing", path: "/support/marketing" },
      { label: "Analytics", path: "/support/analytics" },
      { label: "Commerce", path: "/support/commerce" },
      { label: "Insights", path: "/support/insights" },
    ],
    company: [
      { label: "Marketing", path: "/company/marketing" },
      { label: "Commerce", path: "/company/commerce" },
      { label: "Insights", path: "/company/insights" },
    ],
  };

  const contactInfo = [
    { icon: Phone, text: "+91 98765 43210" },
    { icon: MapPin, text: "info@example.com" },
    { icon: Mail, text: "Lorem ipsum dolor sit amet" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="mx-auto max-w-7xl">
      <div className="py-6 px-4">
        <NewsletterSubscription />

        <div className="bg-white px-6 py-12 rounded shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 md:gap-y-15 mb-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Solution</h3>
                <ul className="space-y-2 text-sm">
                  {footerLinks.solution.map((link) => (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  {footerLinks.support.map((link) => (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  {footerLinks.company.map((link) => (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Solution</h3>
                <ul className="space-y-2 text-sm">
                  {footerLinks.solution.map((link) => (
                    <li key={`dup-${link.path}`}>
                      <a
                        href={link.path}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/support/marketing"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Marketing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/support/analytics"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Analytics
                    </a>
                  </li>
                  <li>
                    <a
                      href="/support/insights"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Insights
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/company/marketing"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Marketing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/company/analytics"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Analytics
                    </a>
                  </li>
                  <li>
                    <a
                      href="/company/commerce"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Commerce
                    </a>
                  </li>
                  <li>
                    <a
                      href="/company/insights"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Insights
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">
                  Contact Us
                </h3>
                <ul className="space-y-3 mb-6 text-sm">
                  {contactInfo.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-slate-600"
                    >
                      <item.icon className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-5 md:p-10">
                <h4 className="font-semibold text-slate-900 mb-3">
                  Follow Us on
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="text-zinc-600 bg-white hover:bg-zinc-100 p-2 rounded shadow-md transition-colors"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 text-center text-xs text-slate-600">
            <p>
              Copyright © {new Date().getFullYear()} Book. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
