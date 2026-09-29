import type { IconName } from "@/components/Icon";

export type CategoryId = "calculators" | "converters" | "pdf" | "image" | "text";

export interface Category {
  id: CategoryId;
  name: string;
  title: string;
  description: string;
  icon: IconName;
  /** Gradient stops used for this category's accents. */
  colors: [string, string];
}

export interface Faq {
  q: string;
  a: string;
}

export interface Tool {
  slug: string;
  name: string;
  category: CategoryId;
  icon: IconName;
  /** One-line summary for cards. */
  short: string;
  /** <title> — lead with the main keyword. */
  title: string;
  /** Meta description, ~150 chars. */
  description: string;
  /** Intro paragraph shown under the H1. */
  intro: string;
  steps: string[];
  faqs: Faq[];
}

export const categories: Category[] = [
  {
    id: "calculators",
    name: "Calculators",
    title: "Free Online Calculators",
    description: "Money, health and everyday math calculators with instant results.",
    icon: "Calculator",
    colors: ["#8b5cf6", "#d946ef"],
  },
  {
    id: "converters",
    name: "Converters",
    title: "Free Unit & Time Converters",
    description: "Convert units, temperatures and time zones in one click.",
    icon: "ArrowLeftRight",
    colors: ["#06b6d4", "#10b981"],
  },
  {
    id: "pdf",
    name: "PDF Tools",
    title: "Free PDF Tools",
    description: "Merge, split and create PDFs privately in your browser.",
    icon: "FileText",
    colors: ["#f43f5e", "#fb923c"],
  },
  {
    id: "image",
    name: "Image Tools",
    title: "Free Image Tools",
    description: "Compress, resize and convert images without uploading them.",
    icon: "Image",
    colors: ["#ec4899", "#f59e0b"],
  },
  {
    id: "text",
    name: "Text & Dev Tools",
    title: "Free Text & Developer Tools",
    description: "Count words, change case, generate passwords, QR codes and more.",
    icon: "Code",
    colors: ["#3b82f6", "#6366f1"],
  },
];

const PRIVATE =
  "Everything happens in your browser — your data is never uploaded to a server.";

export const tools: Tool[] = [
  // ───────────── Calculators ─────────────
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    icon: "Percent",
    short: "Find X% of Y, percent of a total, and percent change.",
    title: "Percentage Calculator – Percent Of, Percent Change & More",
    description:
      "Free percentage calculator. Work out what X% of a number is, what percent one number is of another, and the percentage increase or decrease.",
    intro:
      "Solve the three most common percentage problems in one place: a percentage of a number, what percent one value is of another, and the percent change between two values.",
    steps: [
      "Pick the calculation you need.",
      "Type in the two numbers.",
      "The answer updates instantly as you type.",
    ],
    faqs: [
      {
        q: "How do I calculate a percentage of a number?",
        a: "Multiply the number by the percentage and divide by 100. For example, 20% of 150 is 150 × 20 ÷ 100 = 30.",
      },
      {
        q: "How is percent change calculated?",
        a: "Subtract the old value from the new value, divide by the old value, then multiply by 100. Going from 80 to 100 is (100 − 80) ÷ 80 × 100 = 25% increase.",
      },
      {
        q: "What percent is one number of another?",
        a: "Divide the part by the whole and multiply by 100. 45 out of 60 is 45 ÷ 60 × 100 = 75%.",
      },
    ],
  },
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "calculators",
    icon: "House",
    short: "Estimate your monthly house payment with taxes and insurance.",
    title: "Mortgage Calculator – Monthly Payment with Taxes & Insurance",
    description:
      "Free mortgage calculator. Estimate your monthly payment including principal, interest, property tax and home insurance, plus a yearly amortization schedule.",
    intro:
      "Estimate what a home will really cost each month. Enter the price, down payment and rate to see principal and interest, taxes, insurance, and how your balance falls over time.",
    steps: [
      "Enter the home price and your down payment.",
      "Add the interest rate and loan term (usually 15 or 30 years).",
      "Optionally include annual property tax and home insurance.",
      "Review the monthly payment and amortization schedule.",
    ],
    faqs: [
      {
        q: "How is a mortgage payment calculated?",
        a: "The principal and interest payment uses the standard amortization formula M = P × r(1+r)^n ÷ ((1+r)^n − 1), where P is the loan amount, r the monthly rate and n the number of monthly payments.",
      },
      {
        q: "Does this include PMI?",
        a: "No. Private mortgage insurance usually applies when you put down less than 20% on a conventional loan. Ask your lender for a PMI quote and add it to the monthly total.",
      },
      {
        q: "Is a 15-year or 30-year mortgage better?",
        a: "A 15-year loan has higher monthly payments but far less total interest. A 30-year loan is cheaper month to month but costs more over its life.",
      },
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "calculators",
    icon: "Banknote",
    short: "Monthly payment and total interest for any fixed-rate loan.",
    title: "Loan Calculator – Monthly Payment & Total Interest",
    description:
      "Free loan calculator for auto loans, personal loans and student loans. See your monthly payment, total interest and total cost instantly.",
    intro:
      "Works for auto loans, personal loans, student loans and any other fixed-rate installment loan. See the monthly payment and exactly how much interest you'll pay.",
    steps: [
      "Enter the amount you want to borrow.",
      "Enter the annual interest rate (APR).",
      "Choose the loan term in years or months.",
    ],
    faqs: [
      {
        q: "What is APR?",
        a: "APR (annual percentage rate) is the yearly cost of borrowing, expressed as a percentage. This calculator treats the rate you enter as a fixed annual rate compounded monthly.",
      },
      {
        q: "How can I lower my total interest?",
        a: "Choose a shorter term, make a larger down payment, improve your credit score to get a lower rate, or make extra payments toward principal.",
      },
    ],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "calculators",
    icon: "TrendingUp",
    short: "See how savings and investments grow over time.",
    title: "Compound Interest Calculator – With Monthly Contributions",
    description:
      "Free compound interest calculator. See how your savings grow with monthly contributions, any interest rate and daily, monthly or yearly compounding.",
    intro:
      "Project how an investment or savings account grows. Add a starting balance, regular monthly contributions and an expected return to see the power of compounding year by year.",
    steps: [
      "Enter your starting amount and monthly contribution.",
      "Set the expected annual interest rate and number of years.",
      "Choose how often interest compounds.",
      "Review the final balance and the year-by-year breakdown.",
    ],
    faqs: [
      {
        q: "What is compound interest?",
        a: "Compound interest is interest earned on both your original money and the interest it has already earned. Over long periods this snowball effect can be larger than your contributions.",
      },
      {
        q: "What is the compound interest formula?",
        a: "For a single deposit, A = P(1 + r/n)^(nt), where P is the principal, r the annual rate, n compounding periods per year and t the number of years.",
      },
      {
        q: "What return should I assume?",
        a: "High-yield savings accounts often pay a few percent a year; the long-run average for broad US stock indexes has historically been higher but with big year-to-year swings. Past returns don't guarantee future results.",
      },
    ],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "calculators",
    icon: "Scale",
    short: "Body mass index in pounds/feet or kilograms/centimeters.",
    title: "BMI Calculator – Body Mass Index for Adults (lb & kg)",
    description:
      "Free BMI calculator for adults. Enter your height and weight in US or metric units to find your body mass index and weight category.",
    intro:
      "Body mass index (BMI) is a quick screening measure that compares your weight to your height. Enter your measurements in pounds and feet or in kilograms and centimeters.",
    steps: [
      "Choose US or metric units.",
      "Enter your height and weight.",
      "See your BMI and which category it falls into.",
    ],
    faqs: [
      {
        q: "What is a healthy BMI?",
        a: "For adults, a BMI of 18.5 to 24.9 is considered a healthy weight range, 25 to 29.9 overweight, and 30 or higher obese, according to CDC categories.",
      },
      {
        q: "Is BMI accurate?",
        a: "BMI doesn't distinguish between muscle and fat, so it can misclassify athletes, older adults and some ethnic groups. It's a screening tool, not a diagnosis — talk to a doctor about your health.",
      },
    ],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    icon: "Cake",
    short: "Exact age in years, months and days, plus next birthday.",
    title: "Age Calculator – How Old Am I in Years, Months & Days",
    description:
      "Free age calculator. Find your exact age in years, months and days, total days lived, and how many days until your next birthday.",
    intro:
      "Find an exact age from a date of birth — in years, months and days — as of today or any other date. Also shows total days lived and a countdown to the next birthday.",
    steps: [
      "Enter the date of birth.",
      "Optionally change the 'age on' date (defaults to today).",
      "Read the exact age and birthday countdown.",
    ],
    faqs: [
      {
        q: "How is age calculated?",
        a: "We count full years since the birth date, then full months after the last birthday, then the remaining days.",
      },
      {
        q: "What if I was born on February 29?",
        a: "In non-leap years, the birthday countdown uses March 1.",
      },
    ],
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "calculators",
    icon: "Receipt",
    short: "Work out the tip and split the bill between friends.",
    title: "Tip Calculator – Calculate Tip & Split the Bill",
    description:
      "Free tip calculator. Work out a 15%, 18%, 20% or custom tip and split the total bill evenly between any number of people.",
    intro:
      "Figure out the tip in seconds and split the check evenly. Choose a common tip percentage or type your own.",
    steps: [
      "Enter the bill amount.",
      "Pick a tip percentage.",
      "Set the number of people to split between.",
    ],
    faqs: [
      {
        q: "How much should I tip in the US?",
        a: "For sit-down restaurant service, 15–20% of the pre-tax bill is customary, with 20% or more common for great service.",
      },
      {
        q: "Should I tip on the total before or after tax?",
        a: "Etiquette guides generally say to tip on the pre-tax amount, but many people tip on the total for simplicity.",
      },
    ],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "calculators",
    icon: "Tag",
    short: "Sale price after a percent off, with optional sales tax.",
    title: "Discount Calculator – Sale Price After % Off",
    description:
      "Free discount calculator. Find the sale price after a percentage off, how much you save, and the final price including sales tax.",
    intro:
      "See exactly what you'll pay during a sale. Enter the original price and the percent off, and optionally add your local sales tax.",
    steps: [
      "Enter the original price.",
      "Enter the discount percentage.",
      "Optionally add a sales tax rate.",
    ],
    faqs: [
      {
        q: "How do I calculate a discount?",
        a: "Multiply the original price by the discount percentage and divide by 100 to get the savings, then subtract that from the original price.",
      },
      {
        q: "Are two discounts the same as adding them?",
        a: "No. 20% off followed by another 10% off is 28% off in total, not 30%, because the second discount applies to the already reduced price.",
      },
    ],
  },

  // ───────────── Converters ─────────────
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "converters",
    icon: "Ruler",
    short: "Length, weight, volume, area, speed and data units.",
    title: "Unit Converter – Length, Weight, Volume, Area, Speed & Data",
    description:
      "Free unit converter. Convert between metric and US customary units for length, weight, volume, area, speed and digital storage.",
    intro:
      "Convert between US customary and metric units instantly — inches to centimeters, pounds to kilograms, gallons to liters, mph to km/h, and more.",
    steps: [
      "Choose what you're measuring (length, weight, etc.).",
      "Enter a value and pick the 'from' and 'to' units.",
      "See the result plus a table of every other unit.",
    ],
    faqs: [
      {
        q: "How many centimeters are in an inch?",
        a: "Exactly 2.54 centimeters.",
      },
      {
        q: "How many pounds are in a kilogram?",
        a: "About 2.20462 pounds.",
      },
      {
        q: "Is a US gallon the same as a UK gallon?",
        a: "No. A US gallon is 3.785 liters; an imperial (UK) gallon is 4.546 liters. This tool uses US gallons.",
      },
    ],
  },
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    category: "converters",
    icon: "Thermometer",
    short: "Fahrenheit, Celsius and Kelvin — both ways.",
    title: "Temperature Converter – Fahrenheit to Celsius & Kelvin",
    description:
      "Free temperature converter. Convert Fahrenheit to Celsius, Celsius to Fahrenheit and Kelvin instantly, with the formulas explained.",
    intro:
      "Type a temperature into any box and the others update instantly. Handy for recipes, weather and science homework.",
    steps: ["Type a value into Fahrenheit, Celsius or Kelvin.", "The other two fields update automatically."],
    faqs: [
      {
        q: "How do I convert Fahrenheit to Celsius?",
        a: "Subtract 32, then multiply by 5/9. For example, 98.6°F − 32 = 66.6, × 5/9 = 37°C.",
      },
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "Multiply by 9/5, then add 32. For example, 20°C × 9/5 = 36, + 32 = 68°F.",
      },
    ],
  },
  {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    category: "converters",
    icon: "Globe",
    short: "Convert a time between cities and time zones.",
    title: "Time Zone Converter – EST, CST, MST, PST & World Time",
    description:
      "Free time zone converter. Convert a date and time between Eastern, Central, Mountain, Pacific and any world time zone, with daylight saving handled automatically.",
    intro:
      "Schedule calls and meetings across time zones without mental math. Daylight saving time is handled automatically for every zone.",
    steps: [
      "Pick a date and time and the zone it's in.",
      "Add the time zones you want to compare.",
      "Read the converted local times.",
    ],
    faqs: [
      {
        q: "What's the difference between EST and EDT?",
        a: "EST (UTC−5) is Eastern Standard Time used in winter; EDT (UTC−4) is Eastern Daylight Time used in summer. This tool uses the 'America/New_York' zone, which switches automatically.",
      },
      {
        q: "Does Arizona observe daylight saving time?",
        a: "Most of Arizona does not, so it stays on Mountain Standard Time all year. Use the 'America/Phoenix' zone for Arizona.",
      },
    ],
  },

  // ───────────── PDF ─────────────
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    icon: "FileStack",
    short: "Combine multiple PDF files into one document.",
    title: "Merge PDF – Combine PDF Files Online Free",
    description:
      "Merge PDF files online for free. Combine multiple PDFs into one document in the order you choose. Private: files never leave your device.",
    intro: `Combine several PDF files into a single document and put them in any order. ${PRIVATE}`,
    steps: [
      "Select or drop two or more PDF files.",
      "Use the arrows to reorder them.",
      "Click Merge and download your combined PDF.",
    ],
    faqs: [
      {
        q: "Are my PDFs uploaded anywhere?",
        a: "No. Merging happens entirely in your browser using JavaScript, so your files stay on your device.",
      },
      {
        q: "Can I merge password-protected PDFs?",
        a: "Encrypted PDFs must be unlocked first. Open them with the password in a PDF reader and save an unprotected copy.",
      },
    ],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    icon: "Scissors",
    short: "Extract pages or page ranges into a new PDF.",
    title: "Split PDF – Extract Pages from a PDF Online Free",
    description:
      "Split a PDF online for free. Extract single pages or page ranges like 1-3, 7 into a new PDF. Private: files never leave your device.",
    intro: `Pull out just the pages you need from a PDF. Enter page numbers or ranges, and get a new PDF with only those pages. ${PRIVATE}`,
    steps: [
      "Select or drop a PDF file.",
      "Enter the pages to keep, e.g. 1-3, 5, 8-10.",
      "Click Extract and download the new PDF.",
    ],
    faqs: [
      {
        q: "How do I write page ranges?",
        a: "Separate pages with commas and use a hyphen for ranges. For example '1-3, 6, 9-12' keeps pages 1, 2, 3, 6, 9, 10, 11 and 12.",
      },
      {
        q: "Does splitting reduce quality?",
        a: "No. Pages are copied as-is, so text, images and links keep their original quality.",
      },
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "pdf",
    icon: "FileImage",
    short: "Turn JPG, PNG or WebP images into a PDF.",
    title: "JPG to PDF – Convert Images to PDF Online Free",
    description:
      "Convert JPG, PNG and WebP images to PDF for free. Combine multiple photos into one PDF with Letter, A4 or fit-to-image pages.",
    intro: `Turn photos, scans and screenshots into a single PDF. Choose US Letter, A4, or pages that match each image. ${PRIVATE}`,
    steps: [
      "Select or drop one or more images.",
      "Reorder them and choose a page size.",
      "Click Create PDF and download.",
    ],
    faqs: [
      {
        q: "Which image formats are supported?",
        a: "JPG, PNG, WebP, GIF (first frame) and any other format your browser can display.",
      },
      {
        q: "Is there a limit on the number of images?",
        a: "There's no fixed limit — it depends on your device's memory. Dozens of photos work fine on most computers.",
      },
    ],
  },

  // ───────────── Image ─────────────
  {
    slug: "image-compressor",
    name: "Image Compressor",
    category: "image",
    icon: "ImageDown",
    short: "Shrink JPG, PNG and WebP file sizes.",
    title: "Image Compressor – Reduce Image File Size Online Free",
    description:
      "Compress JPG, PNG and WebP images online for free. Reduce file size with an adjustable quality slider and preview the result. No upload needed.",
    intro: `Make images smaller for email, websites and upload forms. Adjust the quality slider and compare file sizes before downloading. ${PRIVATE}`,
    steps: [
      "Select or drop an image.",
      "Pick an output format and adjust quality.",
      "Compare the sizes and download the compressed image.",
    ],
    faqs: [
      {
        q: "What quality setting should I use?",
        a: "70–80% is a good balance for photos — usually a big size reduction with little visible difference.",
      },
      {
        q: "Why is my PNG bigger after compressing?",
        a: "PNG is lossless, so the quality slider doesn't apply. Convert to JPG or WebP for much smaller files, especially for photos.",
      },
    ],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    category: "image",
    icon: "Scaling",
    short: "Resize images to exact pixel dimensions.",
    title: "Image Resizer – Resize Images to Any Size Online Free",
    description:
      "Resize images online for free. Change width and height in pixels or by percentage while keeping the aspect ratio. Works with JPG, PNG and WebP.",
    intro: `Resize photos to exact pixel dimensions or by percentage — perfect for profile pictures, listings and social posts. ${PRIVATE}`,
    steps: [
      "Select or drop an image.",
      "Enter a new width or height, or choose a percentage.",
      "Download the resized image.",
    ],
    faqs: [
      {
        q: "Will resizing distort my image?",
        a: "Not if 'Keep aspect ratio' is on — the other dimension is calculated automatically.",
      },
      {
        q: "Can I make an image larger?",
        a: "Yes, but enlarging can't add detail, so big increases will look soft or blurry.",
      },
    ],
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    category: "image",
    icon: "RefreshCw",
    short: "Convert between PNG, JPG and WebP.",
    title: "Image Converter – PNG to JPG, JPG to PNG, WebP to JPG",
    description:
      "Free image converter. Convert PNG to JPG, JPG to PNG, WebP to JPG or PNG, and more — instantly in your browser with no upload.",
    intro: `Convert images between PNG, JPG and WebP. Great for turning WebP downloads into JPGs that work everywhere. ${PRIVATE}`,
    steps: [
      "Select or drop an image.",
      "Choose the format to convert to.",
      "Download the converted file.",
    ],
    faqs: [
      {
        q: "What happens to transparency when converting to JPG?",
        a: "JPG doesn't support transparency, so transparent areas are filled with white.",
      },
      {
        q: "Which format should I use?",
        a: "JPG for photos with wide compatibility, PNG for graphics, screenshots and transparency, WebP for the smallest files on modern websites.",
      },
    ],
  },

  // ───────────── Text & Dev ─────────────
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "text",
    icon: "Type",
    short: "Count words, characters, sentences and reading time.",
    title: "Word Counter – Count Words & Characters Online",
    description:
      "Free word counter. Count words, characters (with and without spaces), sentences and paragraphs, and estimate reading and speaking time.",
    intro:
      "Paste or type your text to instantly count words, characters, sentences and paragraphs. Great for essays, social posts, and meeting character limits.",
    steps: ["Paste or type your text into the box.", "Counts update live as you type."],
    faqs: [
      {
        q: "How is reading time calculated?",
        a: "We assume an average reading speed of 238 words per minute and a speaking speed of 150 words per minute.",
      },
      {
        q: "Is my text saved?",
        a: "No. Your text is processed only in your browser and is never sent anywhere.",
      },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    icon: "CaseSensitive",
    short: "UPPERCASE, lowercase, Title Case, camelCase and more.",
    title: "Case Converter – Uppercase, Lowercase, Title Case & More",
    description:
      "Free case converter. Change text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case with one click.",
    intro:
      "Accidentally left caps lock on? Paste your text and convert it to any letter case with one click, then copy the result.",
    steps: ["Paste your text.", "Click the case you want.", "Copy the converted text."],
    faqs: [
      {
        q: "What is Title Case?",
        a: "Title Case capitalizes the first letter of each major word. Short words like 'a', 'of' and 'the' stay lowercase unless they start the title.",
      },
      {
        q: "What are camelCase and snake_case?",
        a: "They're naming styles used in programming: camelCase joins words and capitalizes each after the first (myVariableName); snake_case joins them with underscores (my_variable_name).",
      },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "text",
    icon: "KeyRound",
    short: "Strong, random passwords generated securely.",
    title: "Password Generator – Create Strong Random Passwords",
    description:
      "Free strong password generator. Create secure random passwords with custom length, uppercase, numbers and symbols using your browser's cryptographic randomness.",
    intro:
      "Generate strong, random passwords using your browser's cryptographically secure random number generator. Passwords are created on your device and never transmitted.",
    steps: [
      "Choose a length (16+ recommended).",
      "Select which character types to include.",
      "Copy the password — or generate another.",
    ],
    faqs: [
      {
        q: "How long should a password be?",
        a: "At least 12–16 characters. Longer is better — length adds more strength than complexity.",
      },
      {
        q: "Is it safe to generate passwords online?",
        a: "With this tool, yes: passwords are generated locally with crypto.getRandomValues and never leave your browser. Store them in a password manager.",
      },
    ],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "text",
    icon: "QrCode",
    short: "Make QR codes for links, text and Wi-Fi. Download PNG or SVG.",
    title: "QR Code Generator – Free, No Sign-Up, Never Expires",
    description:
      "Free QR code generator. Create QR codes for URLs, text and Wi-Fi networks with custom colors and download as PNG or SVG. Static codes never expire.",
    intro:
      "Create a QR code for a website, message or Wi-Fi network in seconds. Codes are static, so they work forever with no account or tracking.",
    steps: [
      "Choose URL/text or Wi-Fi.",
      "Enter your content and customize size and colors.",
      "Download the QR code as PNG or SVG.",
    ],
    faqs: [
      {
        q: "Do these QR codes expire?",
        a: "No. They're static QR codes — the content is encoded directly in the image, so they work forever and don't depend on our site.",
      },
      {
        q: "PNG or SVG?",
        a: "PNG is best for screens and documents. SVG is a vector format that scales to any size without blurring — ideal for print.",
      },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "text",
    icon: "Braces",
    short: "Format, validate and minify JSON.",
    title: "JSON Formatter & Validator – Beautify or Minify JSON",
    description:
      "Free JSON formatter and validator. Pretty-print JSON with 2 or 4-space indentation, minify it, and find syntax errors instantly.",
    intro:
      "Paste JSON to pretty-print it, minify it, or find exactly where a syntax error is. Processing is local, so it's safe for API responses and config files.",
    steps: ["Paste your JSON.", "Click Format or Minify.", "Copy the result."],
    faqs: [
      {
        q: "Why is my JSON invalid?",
        a: "Common causes are trailing commas, single quotes instead of double quotes, unquoted keys and comments — none of which are allowed in standard JSON.",
      },
    ],
  },
];

export const toolsBySlug = Object.fromEntries(tools.map((t) => [t.slug, t])) as Record<string, Tool>;

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id)!;
}

export function toolsIn(id: CategoryId): Tool[] {
  return tools.filter((t) => t.category === id);
}

export function relatedTools(tool: Tool, count = 4): Tool[] {
  const same = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug);
  const others = tools.filter((t) => t.category !== tool.category);
  return [...same, ...others].slice(0, count);
}

/** CSS custom properties that theme an element with a category's colors. */
export function categoryVars(id: CategoryId): React.CSSProperties {
  const [c1, c2] = getCategory(id).colors;
  return { "--c1": c1, "--c2": c2 } as React.CSSProperties;
}
