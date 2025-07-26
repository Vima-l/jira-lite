// app/admin/layout.tsx
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-2/8 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <Link href="/admin/viewtesters" className="block hover:underline">View Testers</Link>
        <Link href="/admin/createproject" className="block hover:underline">Create Project</Link>
        <Link href="/admin/viewproject" className="block hover:underline">View Projects</Link>
      </div>

      {/* Main Content Area */}
      <div className="w-7/8 p-6 bg-gray-100">
        {children}
      </div>
    </div>
  );
}
