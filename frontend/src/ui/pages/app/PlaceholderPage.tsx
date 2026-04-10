import { Card } from "../../components/Card";
import { Button } from "../../components/Button";

export function PlaceholderPage({
  title,
  description,
  primaryActionLabel = "Create",
}: {
  title: string;
  description: string;
  primaryActionLabel?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{description}</div>
      </div>
      <Card className="p-5">
        <div className="text-sm font-semibold text-slate-900">Demo-ready module</div>
        <div className="mt-1 text-sm text-slate-700">
          This page is wired to the sidebar and ready for live data integration. Next step is to connect APIs and finalize actions.
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button">{primaryActionLabel}</Button>
          <Button type="button" variant="secondary">
            Export
          </Button>
        </div>
      </Card>
    </div>
  );
}

