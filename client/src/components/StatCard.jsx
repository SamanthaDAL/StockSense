export default function StatCard({ label, value, helper, icon, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`} aria-hidden="true">
        {icon}
      </div>

      <div className="stat-copy">
        <p className="stat-label">{label}</p>
        <strong className="stat-value">{value}</strong>
        <span className="stat-helper">{helper}</span>
      </div>
    </article>
  )
}
