import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";

export function InviteActivationPage() {
  return (
    <div>
      <div className="text-lg font-semibold">Invite activation</div>
      <div className="mt-1 text-sm text-slate-600">
        Demo placeholder: in production this validates invite tokens, sets password, and completes profile.
      </div>

      <Card className="mt-6 p-5">
        <div className="text-sm font-semibold text-slate-900">Mock invite token</div>
        <div className="mt-1 text-xs text-slate-600">inv_demo_2026_04_09</div>
        <div className="mt-4 flex gap-2">
          <Button type="button" className="w-full">
            Activate
          </Button>
          <Link className="w-full" to="/login">
            <Button type="button" variant="secondary" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

