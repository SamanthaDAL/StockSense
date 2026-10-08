export default function StatCard({ label, value, helper }) {
  return (
    <article className="stat-card">
      <p className="stat-label">{label}</p>
      <strong className="stat-value">{value}</strong>
      <span className="stat-helper">{helper}</span>
    </article>
  )
}