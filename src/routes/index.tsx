import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
 
  return (
    <div className="flex p-4 gap-10">
      <span>metrics</span>
      <Link to="/home">Go to files</Link>
    </div>
  );
}
