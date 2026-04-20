import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Calendar, ClipboardList, LayoutDashboard, Stethoscope, LogOut } from "lucide-react";
import { authOptions } from "@/lib/auth";

const items = [
  { href: "/admin", label: "Хяналтын самбар", icon: LayoutDashboard },
  { href: "/admin", label: "Захиалгууд", icon: ClipboardList },
  { href: "/admin/doctors", label: "Эмч нар", icon: Stethoscope },
  { href: "/admin/doctors", label: "Хуваарь", icon: Calendar }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <aside className="hidden w-56 border-r bg-white lg:flex lg:flex-col">
        <div className="border-b p-4 text-lg font-semibold text-blue-700">DentaBook Admin</div>
        <nav className="flex-1 space-y-1 p-2">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 rounded-xl border-l-2 border-transparent px-3 py-2 text-sm text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3 text-xs text-gray-500">
          <p className="truncate">{session.user.email}</p>
          <Link href="/api/auth/signout" className="mt-2 inline-flex items-center gap-1 text-sm text-gray-700 hover:text-blue-700">
            <LogOut className="h-4 w-4" />
            Гарах
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t bg-white p-2 lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center rounded-lg px-2 py-1 text-[11px] text-gray-700">
              <item.icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
