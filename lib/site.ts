export const site = {
  name: "Toolsy",
  tagline: "Free online tools that just work",
  description:
    "Free, fast online calculators, converters, PDF, image and text tools. No sign-up, no uploads — everything runs in your browser.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
};

export const adsense = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  slots: {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "",
    bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || "",
  },
};
