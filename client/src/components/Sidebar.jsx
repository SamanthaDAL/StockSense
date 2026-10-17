const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⌂', description: 'Overview and alerts' },
  { id: 'products', label: 'Products', icon: '▣', description: 'Catalog and inventory levels' },
  { id: 'locations', label: 'Locations', icon: '⌖', description: 'Manage inventory sites' },
  { id: 'movements', label: 'Stock Movements', icon: '⇄', description: 'Record and audit stock changes' },
  { id: 'restocks', label: 'Restock Requests', icon: '↻', description: 'Manage replenishment workflow' },
]

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>

        <div>
          <h1>StockSense</h1>
          <p>Inventory Platform</p>
        </div>
      </div>

      <div className="sidebar-section-label">Workspace</div>

      <nav className="nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>

            <span className="nav-copy">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-guide">
        <p className="sidebar-guide-label">Quick guide</p>
        <strong>New to StockSense?</strong>
        <p>
          Start with Locations and Products, then record stock movements and
          create restock requests when inventory runs low.
        </p>
      </div>

      <div className="sidebar-footer">
        <p>StockSense V1</p>
        <span>Portfolio release</span>
      </div>
    </aside>
  )
}