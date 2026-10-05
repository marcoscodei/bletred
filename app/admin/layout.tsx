import AdminSidebar from './AdminSidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('bletred_session');

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <AdminSidebar />
      <main className="flex-1 pl-64 p-8 bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}