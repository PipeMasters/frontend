import { createFileRoute, Link } from "@tanstack/react-router";
import MetricsDashboard from "../widgets/metricsDashboard";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <Link
        to="/home"
        className=" text-gray-400 text-xs hover:text-gray-600 transition duration-200"
      >
        <span className="mr-1">←</span>
        Главная страница
      </Link>
      <MetricsDashboard />
    </div>
  );
}
