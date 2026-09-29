import {
  ArrowLeftRight,
  Banknote,
  Braces,
  Cake,
  Calculator,
  CaseSensitive,
  Code,
  FileStack,
  FileImage,
  FileText,
  Globe,
  House,
  Image,
  ImageDown,
  KeyRound,
  Percent,
  QrCode,
  Receipt,
  RefreshCw,
  Ruler,
  Scale,
  Scaling,
  Scissors,
  Tag,
  Thermometer,
  TrendingUp,
  Type,
  type LucideProps,
} from "lucide-react";

// An explicit map (rather than `import *`) keeps unused icons out of the bundle.
const icons = {
  ArrowLeftRight,
  Banknote,
  Braces,
  Cake,
  Calculator,
  CaseSensitive,
  Code,
  FileStack,
  FileImage,
  FileText,
  Globe,
  House,
  Image,
  ImageDown,
  KeyRound,
  Percent,
  QrCode,
  Receipt,
  RefreshCw,
  Ruler,
  Scale,
  Scaling,
  Scissors,
  Tag,
  Thermometer,
  TrendingUp,
  Type,
};

export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = icons[name];
  return <C aria-hidden strokeWidth={2} {...props} />;
}
