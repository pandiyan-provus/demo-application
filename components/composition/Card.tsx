type CardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export function Card({ children, title, className = "" }: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 p-4 rounded-lg shadow-sm ${className}`}>
      {title && <h1 className="text-lg font-semibold text-gray-800 mb-2">{title}</h1>}
      {children}
    </div>
  );
}
