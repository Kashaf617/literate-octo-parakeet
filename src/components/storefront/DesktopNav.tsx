'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopNav() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/search' },
    { name: 'Journal', href: '/blog' },
    { name: 'My Favorites', href: '/wishlist' },
    { name: 'Contacts', href: '/contact' }
  ];

  return (
    <div className="flex items-center gap-10">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[13px] font-bold uppercase tracking-widest relative py-4 transition-colors duration-200 hover:text-black ${
              isActive
                ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C9A227]"
                : "text-gray-500"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
