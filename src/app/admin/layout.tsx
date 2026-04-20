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
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-[#F8FAFC] md:flex">
      <aside className="hidden h-full w-56 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-100 px-4 py-5 text-base font-semibold text-slate-900">DentaBook Админ</div>
        <nav className="flex-1 space-y-1 p-2">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group mx-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900"
            >
              <item.icon className="h-4 w-4 text-slate-400 transition-colors duration-150 group-hover:text-slate-600" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-100 p-4">
          <p className="mb-2 truncate text-xs text-slate-500">{session.user.email}</p>
          <Link href="/api/auth/signout" className="btn-ghost inline-flex w-full items-center justify-center gap-1">
            <LogOut className="h-4 w-4" />
            Гарах
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-2 md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center rounded-lg px-2 py-1 text-[11px] font-medium text-slate-600">
              <item.icon className="mb-1 h-4 w-4 text-slate-500" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
