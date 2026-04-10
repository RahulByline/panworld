import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { usePortalMock } from "./mockHooks";

export function SampleRequestFollowUpPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { samples } = usePortalMock();
  const item = useMemo(() => samples.find((s) => s.id === id), [samples, id]);
  const [subject, setSubject] = useState("Follow-up on sample request");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"Email" | "WhatsApp" | "Phone">("Email");

  if (!item) {
    return (
      <Card className="p-5">
        <div className="text-sm font-semibold text-slate-900">Sample request not found</div>
        <div className="mt-2">
          <Link to="/app/samples">
            <Button type="button" variant="secondary" size="sm">
              Back to requests
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="truncate text-2xl font-semibold text-slate-900">Follow up</div>
          <div className="mt-1 text-sm text-slate-600">
            {item.productName} • <span className="font-semibold text-slate-800">{item.requestNo}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/app/samples/${item.id}`}>
            <Button type="button" variant="secondary">
              Back to details
            </Button>
          </Link>
          <Link to="/app/samples">
            <Button type="button" variant="secondary">
              Back to list
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-600">Subject</label>
            <div className="mt-1">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Channel</label>
            <div className="mt-1">
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
              >
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-600">Message</label>
          <div className="mt-1">
            <textarea
              className="min-h-[140px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your follow-up note…"
            />
          </div>
          <div className="mt-2 text-xs text-slate-500">Demo only: this won’t send yet — it just simulates the flow.</div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => nav(`/app/samples/${item.id}`)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!message.trim()}
            onClick={() => {
              // Demo behavior: return to details after "sending"
              nav(`/app/samples/${item.id}`);
            }}
          >
            Send follow up
          </Button>
        </div>
      </Card>
    </div>
  );
}

