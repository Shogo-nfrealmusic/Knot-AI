import StatementTyper from "@/app/components/StatementTyper";
import { GridSection } from "@/app/components/ui/grid-section";

export default function Statement() {
  return (
    <GridSection innerClassName="px-4 py-10 sm:px-10 sm:py-20">
      <div className="w-full min-w-0">
        <StatementTyper />
      </div>
    </GridSection>
  );
}
