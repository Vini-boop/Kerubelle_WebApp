import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#FFF5F9] border-t border-[#F8C8DC]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">About Keru Belle</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your destination for elegant, feminine handbags. We believe every woman deserves
              to carry confidence and style.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-[#F8C8DC]/20 rounded-full flex items-center justify-center hover:bg-[#F8C8DC] hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-[#F8C8DC]/20 rounded-full flex items-center justify-center hover:bg-[#F8C8DC] hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-[#F8C8DC]/20 rounded-full flex items-center justify-center hover:bg-[#F8C8DC] hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-[#F8C8DC] transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/new" className="text-gray-600 hover:text-[#F8C8DC] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/limited" className="text-gray-600 hover:text-[#F8C8DC] transition-colors">
                  Limited Edition
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-[#F8C8DC] transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Shipping & Delivery</li>
              <li>Returns & Exchanges</li>
              <li>Gift Wrapping</li>
              <li>Personalization</li>
              <li>Loyalty Program</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#F8C8DC]" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#F8C8DC]" />
                <span>kerubelle@customer.ke</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#F8C8DC] mt-1" />
                <span>Eldoret, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F8C8DC]/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-600">
            © 2026 Keru Belle. Made with by SimbariuTech Hub </p>
          <div className="flex space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-[#F8C8DC] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#F8C8DC] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}