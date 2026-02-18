export function Sidebar() {
  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/home" },
    { label: "User Details", icon: "👤", href: "/home/1" },
    { label: "Contact", icon: "📧", href: "/home/1/contact" },
  ];

  const authItems = [
    { label: "Login", icon: "🔑", href: "/login" },
    { label: "Sign Up", icon: "📝", href: "/signup" },
  ];

  return (
    <nav className="p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Pages
      </div>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8">
        Auth
      </div>
      <ul className="space-y-1">
        {authItems.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
