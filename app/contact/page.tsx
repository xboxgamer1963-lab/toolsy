import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact the ${site.name} team with questions, feedback or tool requests.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="container narrow content">
      <h1>Contact us</h1>
      <p>
        Questions, feedback, bug reports or ideas for a new tool are always welcome. Email us at{" "}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and we'll get back to you as soon as we
        can.
      </p>
    </div>
  );
}
