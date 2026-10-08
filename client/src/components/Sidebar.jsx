export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>

        <div>
          <h1>StockSense</h1>
          <p>Inventory Platform</p>
        </div>
      </div>

      <nav className="nav">
        <button className="nav-item active">Dashboard</button>
        <button className="nav-item">Products</button>
        <button className="nav-item">Stock Movements</button>
        <button className="nav-item">Restock Requests</button>
      </nav>

      <div className="sidebar-footer">
        <p>StockSense V1</p>
      </div>
    </aside>
  )
}