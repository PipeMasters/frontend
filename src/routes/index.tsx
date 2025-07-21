import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
 
  return (
    <div className="flex p-4 gap-10">
      <span>metrics</span>
    </div>
  );
}
