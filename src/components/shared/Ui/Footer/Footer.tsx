import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Container from "../Container";
import MyLogo from "../MyLogo";

const quickLinks = [
  { label: "About us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Returns & Refunds", href: "/returns-and-refunds" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const categories = [
  {
    label: "Nuts",
    href: "/shop?category=nuts",
  },
  {
    label: "Honey",
    href: "/shop?category=honey",
  },
  {
    label: "Seeds",
    href: "/shop?category=seeds",
  },
  {
    label: "Dates",
    href: "/shop?category=dates",
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/pushtihub" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 pt-12 md:pt-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href={`/`}>
              <MyLogo width={160} height={100} />
            </Link>

            <p className="text-muted-foreground leading-relaxed text-sm 2xl:text-base">
              প্রতিদিনের সুস্থ জীবনের জন্য পুষ্টিকর, বিশ্বাসযোগ্য ও মানসম্মত
              খাদ্য পৌঁছে দেওয়াই আমাদের দায়িত্ব।
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 2xl:w-10 h-8 2xl:h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-all duration-300 hover:scale-110"
                >
                  <Icon className="h-4 2xl:h-5 w-4 2xl:w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg 2xl:text-xl mb-4 text-foreground">
              Top Categories
            </h3>
            <ul className="space-y-2">
              {categories.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center group 2xl:text-lg"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-500">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg 2xl:text-xl mb-4 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center group 2xl:text-lg"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-500">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg 2xl:text-xl mb-4 text-foreground">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm 2xl:text-base leading-relaxed">
                  123 Repair Street, Azimpur, New Market
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <a
                  href="tel:+8801332641071"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm 2xl:text-base"
                >
                  +880 1332-641071
                </a>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <a
                  href="mailto:contact.pushtihub@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm 2xl:text-base"
                >
                  contact.pushtihub@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-5">
        <p className="text-center text-muted-foreground text-sm 2xl:text-base">
          © {new Date().getFullYear()} Pushtihub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
