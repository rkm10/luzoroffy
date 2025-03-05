import Link from "next/link";
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Luzoroffy
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your ultimate destination for anime and manga recommendations, 
              reviews, and community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Quick Links
            </h4>
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/anime" 
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Anime
              </Link>
              <Link 
                href="/manga" 
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Manga
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com" 
                target="_blank" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                <Github className="w-6 h-6" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                <Twitter className="w-6 h-6" />
              </Link>
              <Link 
                href="https://instagram.com" 
                target="_blank" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                <Instagram className="w-6 h-6" />
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link 
                href="mailto:contact@animehub.com" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                <Mail className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Luzoroffy. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;