import './App.css'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Inventory overview</p>
            <h2>Dashboard</h2>
            <p className="subtitle">
              Monitor inventory health and replenishment activity.
            </p>
          </div>

          <button className="primary-button">Add Product</button>
        </header>

        <section className="stats-grid">
          <StatCard
            label="Products"
            value="—"
            helper="Catalog items"
          />

          <StatCard
            label="Low Stock"
            value="—"
            helper="Needs attention"
          />

          <StatCard
            label="Open Restocks"
            value="—"
            helper="Active requests"
          />

          <StatCard
            label="Locations"
            value="—"
            helper="Inventory sites"
          />
        </section>

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Inventory health</p>
                <h3>Low-stock watchlist</h3>
              </div>

              <button className="secondary-button">View inventory</button>
            </div>

            <div className="empty-state">
              <span className="empty-icon">↓</span>
              <h4>No inventory loaded yet</h4>
              <p>
                Low-stock products will appear here once the dashboard is
                connected to the StockSense API.
              </p>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Replenishment</p>
                <h3>Restock activity</h3>
              </div>
            </div>

            <div className="status-row">
              <span>Requested</span>
              <strong>—</strong>
            </div>

            <div className="status-row">
              <span>Approved</span>
              <strong>—</strong>
            </div>

            <div className="status-row">
              <span>Ordered</span>
              <strong>—</strong>
            </div>

            <div className="status-row">
              <span>Received</span>
              <strong>—</strong>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App