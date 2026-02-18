export function Header() {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">Intern Training Dashboard</h1>
      <nav className="flex items-center gap-6">
        <a href="/home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
          Home
        </a>
        <a href="/home/1" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
          User Details
        </a>
        <a href="/home/1/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
          Contact
        </a>
        <div className="h-5 w-px bg-gray-300" />
        <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
          Login
        </a>
        <a href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          Sign Up
        </a>
      </nav>
    </div>
  );
}
