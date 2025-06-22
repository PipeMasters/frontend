import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/overview/$fileId')({
  component: OverviewComponent,
})

function OverviewComponent() {
  const { fileId } = Route.useParams()
  return <div>Post ID: {fileId}</div>
}