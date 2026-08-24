export function Rule({ className = '' }) {
  return <div className={`border-t border-rule w-full ${className}`} />;
}

export function Label({ children, className = '' }) {
  return (
    <p className={`text-[11px] font-semibold tracking-[1.2px] text-label uppercase ${className}`}>{children}</p>
  );
}
