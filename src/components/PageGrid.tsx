export function PageGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-grid-root">
      <div className="page-grid">
        <div className="page-grid-content">{children}</div>
      </div>
    </div>
  );
}

type BandTag = "div" | "header" | "footer" | "section" | "article" | "main";

export function GridBand({
  as: Comp = "div",
  children,
  className = "",
  id,
}: {
  as?: BandTag;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Comp id={id} className={className ? `grid-band ${className}` : "grid-band"}>
      {children}
    </Comp>
  );
}
