export default function ProjectCard({ project }) {
  return (
    <div className="border p-4 rounded">
      <h3>{project?.title}</h3>
    </div>
  );
}
