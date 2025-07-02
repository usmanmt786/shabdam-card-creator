import { Mail, Phone, MapPin } from "lucide-react";
import { SlSocialFacebook, SlSocialInstagram } from "react-icons/sl";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-secondary" />
                <span className="text-white/90">+91 82817 89271</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-secondary" />
                <span className="text-white/90">hssssfkerala@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-secondary" />
                <span className="text-white/90">
                  Students Centre, Calicut-67060
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="#about"
                className="block text-white/90 hover:text-secondary transition-colors"
              >
                About Us
              </a>
              <a
                href="#about"
                className="block text-white/90 hover:text-secondary transition-colors"
              >
                Membership Benefits
              </a>
              {/* <a
                href="#"
                className="block text-white/90 hover:text-secondary transition-colors"
              >
                Events & Activities
              </a>
              <a
                href="#"
                className="block text-white/90 hover:text-secondary transition-colors"
              >
                Contact Support
              </a> */}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1CkMw6Dxvw/"
                className="bg-white/20 p-3 rounded-full hover:bg-secondary transition-colors"
              >
                <SlSocialFacebook className="h-5 w-5" />
              </a>

              <a
                href="https://www.instagram.com/ssfkerala?igsh=cGo1dzRhYWMwbGcy"
                className="bg-white/20 p-3 rounded-full hover:bg-secondary transition-colors"
              >
                <SlSocialInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/70">
            © 2025 SSF HSS Membership Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
