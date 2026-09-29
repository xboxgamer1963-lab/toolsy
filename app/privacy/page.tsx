import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your data, cookies and advertising.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <div className="container narrow content">
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: September 29, 2026</p>

      <h2>Files and text you use with our tools</h2>
      <p>
        All tools on {site.name} run in your web browser. Files you select (such as PDFs and images) and text
        you type are processed locally on your device and are <strong>not uploaded</strong> to or stored on our
        servers.
      </p>

      <h2>Advertising</h2>
      <p>
        We use Google AdSense to show ads. Third-party vendors, including Google, use cookies to serve ads based
        on your prior visits to this website or other websites. Google's use of advertising cookies enables it
        and its partners to serve ads to you based on your visit to this site and/or other sites on the
        Internet.
      </p>
      <p>
        You may opt out of personalized advertising by visiting{" "}
        <a href="https://www.google.com/settings/ads" rel="noopener" target="_blank">
          Google Ads Settings
        </a>
        . You can also opt out of some third-party vendors' use of cookies for personalized advertising by
        visiting{" "}
        <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">
          www.aboutads.info
        </a>
        . Learn more about{" "}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">
          how Google uses information from sites that use its services
        </a>
        .
      </p>

      <h2>Log data and analytics</h2>
      <p>
        Like most websites, our hosting provider may collect standard log information such as IP address,
        browser type, pages visited and timestamps, used to operate and secure the site.
      </p>

      <h2>Your privacy rights</h2>
      <p>
        Depending on where you live (for example California under the CCPA/CPRA, or the EU/UK under the GDPR),
        you may have rights to access, delete or opt out of the sale or sharing of personal information. Because
        we don't collect personal information directly, most requests relate to advertising cookies, which you
        can control through the links above and your browser settings.
      </p>

      <h2>Children</h2>
      <p>This site is not directed to children under 13, and we do not knowingly collect their information.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </div>
  );
}
