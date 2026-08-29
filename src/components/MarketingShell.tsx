import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { PageGrid } from "./PageGrid";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <PageGrid>
      <SiteHeader />
      <div className="grid-band min-h-0">
        <div className="col-span-12 grid grid-cols-12">
          {children}
        </div>
      </div>
      <SiteFooter />
    </PageGrid>
  );
}
