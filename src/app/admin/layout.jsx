import Link from 'next/link';
import { adminMenu } from './adminMenu';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Menu */}
      <aside className="w-64 bg-white shadow-md border-r">
        <div className="p-5 font-bold text-xl border-b text-gray-800">Admin Panel</div>
        <nav className="p-4 space-y-2">
          {adminMenu.map((menu, index) => (
            <Link 
              key={index} 
              href={menu.path}
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white rounded transition-colors"
            >
              {menu.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}