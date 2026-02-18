export default function IdLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="bg-gray-800 text-center py-6 mt-auto">
        <p className="text-sm text-gray-400">© 2026 Intern Training App. Built with Next.js & TypeScript.</p>
      </footer>
    </>
  );
}