type LayoutProps = {
  Header: React.ComponentType;
  Sidebar?: React.ComponentType;
  children: React.ReactNode;
};

export function Layout({ Header, Sidebar, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Header />
      </header>

      <div className="flex">
        {Sidebar && (
          <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
            <Sidebar />
          </aside>
        )}

        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
