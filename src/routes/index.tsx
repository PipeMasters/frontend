import { createFileRoute, Link } from "@tanstack/react-router";
import MetricsDashboard from "../widgets/metricsDashboard";


export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <MetricsDashboard />
      <Link to="/home">Go to files</Link>
    </div>
  );
}