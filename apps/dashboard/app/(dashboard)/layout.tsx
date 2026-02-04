'use client';

import { RequireAuth, useAuth } from '../../lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex h-screen">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">General Manager</h1>
        <p className="text-sm text-gray-500">AI Operations Assistant</p>
      </div>

      <div className="flex-1 p-4 space-y-1">
        <NavLink href="/" icon="📊">Overview</NavLink>
        <NavLink href="/tasks" icon="📋">Tasks</NavLink>
        <NavLink href="/approvals" icon="✅">Approvals</NavLink>
        <NavLink href="/suggestions" icon="💡">Suggestions</NavLink>
        <NavLink href="/history" icon="📜">History</NavLink>
        <NavLink href="/settings" icon="⚙️">Settings</NavLink>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-3">
          <div className="truncate" title={user?.email}>{user?.email}</div>
          <div className="truncate" title={user?.organizationName}>
            {user?.organizationName || 'Organization'}
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  icon,
  children
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </a>
  );
}
