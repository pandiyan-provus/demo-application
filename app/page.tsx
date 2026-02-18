export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-white">TrainingHub</div>
        <div className="flex items-center gap-6">
          <a href="/home" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
          <a href="/login" className="text-gray-300 hover:text-white transition-colors">Login</a>
          <a
            href="/signup"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
            Full-Stack TypeScript Training
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Learn Modern
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> React </span>
            Development
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Master component composition, typed API routes, and Zod validation.
            Build production-ready applications with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/home"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
            >
              Explore Dashboard
            </a>
            <a
              href="/signup"
              className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold text-lg border border-white/10"
            >
              Create Account
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              icon: "🧩",
              title: "Component Composition",
              description: "Build scalable UI with reusable components using children and props",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: "🔌",
              title: "Typed API Routes",
              description: "Create type-safe backend endpoints with Next.js App Router",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: "📦",
              title: "Request/Response Models",
              description: "Define clear API contracts with TypeScript interfaces",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: "🛡️",
              title: "Zod Validation",
              description: "Runtime validation with auto-generated TypeScript types",
              color: "from-orange-500 to-red-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Dive into the interactive dashboard and explore real-world examples of modern TypeScript patterns.
          </p>
          <a
            href="/home"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Go to Dashboard →
          </a>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-400">© 2026 TrainingHub. Built with Next.js & TypeScript.</div>
          <div className="flex items-center gap-6">
            <a href="/home" className="text-gray-400 hover:text-white transition-colors">Dashboard</a>
            <a href="/login" className="text-gray-400 hover:text-white transition-colors">Login</a>
            <a href="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
