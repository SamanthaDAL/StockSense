import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import { apiRequest } from './lib/api'
import ProductForm from './components/ProductForm'
import StockMovementPanel from './components/StockMovementPanel'
import ReplenishmentPanel from './components/ReplenishmentPanel'
import LocationPanel from './components/LocationPanel'

const viewContent = {
  dashboard: {
    eyebrow: 'Inventory overview',
    title: 'Dashboard',
    description: 'See inventory health, low-stock attention areas, and replenishment activity at a glance.',
  },
  products: {
    eyebrow: 'Catalog management',
    title: 'Products',
    description: 'Manage the products your organisation keeps in inventory and maintain their reorder thresholds.',
  },
  movements: {
    eyebrow: 'Inventory operations',
    title: 'Stock Movements',
    description: 'Record stock coming in or going out and review the audit trail for each product and location.',
  },
  restocks: {
    eyebrow: 'Replenishment operations',
    title: 'Restock Requests',
    description: 'Track replenishment from the initial request through approval, ordering, receiving, or cancellation.',
  },
  locations: {
    eyebrow: 'Inventory structure',
    title: 'Locations',
    description: 'Manage the warehouses and inventory sites where stock is stored.',
  },
}

function App() {
  const [products, setProducts] = useState([])
  const [inventoryRecords, setInventoryRecords] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [restocks, setRestocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeView, setActiveView] = useState('dashboard')
  const [productModalOpen, setProductModalOpen] = useState(false)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      setError('')

      try {
        const [
          productData,
          inventoryData,
          lowStockData,
          restockData,
        ] = await Promise.all([
          apiRequest('/products'),
          apiRequest('/inventory/records'),
          apiRequest('/inventory/low-stock'),
          apiRequest('/restocks'),
        ])

        setProducts(productData)
        setInventoryRecords(inventoryData)
        setLowStock(lowStockData)
        setRestocks(restockData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const openRestocks = useMemo(
    () => restocks.filter((request) => !['RECEIVED', 'CANCELLED'].includes(request.status)).length,
    [restocks]
  )

  const recentProducts = useMemo(() => products.slice(-4).reverse(), [products])

  const locationCount = useMemo(
    () => new Set(inventoryRecords.map((record) => record.locationCode)).size,
    [inventoryRecords]
  )

  function openCreateProduct() {
    setSelectedProduct(null)
    setProductModalOpen(true)
  }

  function openEditProduct(product) {
    setSelectedProduct(product)
    setProductModalOpen(true)
  }

  function closeProductModal() {
    setSelectedProduct(null)
    setProductModalOpen(false)
  }

  function handleProductCreated(product) {
    setProducts((current) => [...current, product])
    closeProductModal()
  }

  function handleProductUpdated(updatedProduct) {
    setProducts((current) =>
      current.map((product) =>
        product.sku === updatedProduct.sku ? updatedProduct : product
      )
    )

    closeProductModal()
  }

  function handleNavigate(view) {
    setActiveView(view)
    setSelectedProduct(null)
    setProductModalOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderProductList({ compact = false } = {}) {
    if (loading) {
      return (
        <div className={`empty-state ${compact ? 'compact-empty-state' : ''}`}>
          <div className="empty-icon">…</div>
          <h4>Loading products</h4>
          <p>StockSense is retrieving the latest catalog information.</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className={`empty-state ${compact ? 'compact-empty-state' : ''}`}>
          <div className="empty-icon empty-icon-error">!</div>
          <h4>Could not load products</h4>
          <p>{error}</p>
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className={`empty-state ${compact ? 'compact-empty-state' : ''}`}>
          <div className="empty-icon">＋</div>
          <h4>Your inventory catalog is empty</h4>
          <p>Add your first product to begin tracking stock levels, movements, and replenishment.</p>
          <button className="primary-button" type="button" onClick={openCreateProduct}>
            Add first product
          </button>
        </div>
      )
    }

    const list = compact ? recentProducts : products

    return (
      <div className="product-list">
        {list.map((product) => (
          <button
            className="product-row product-row-button"
            key={product.id ?? product.sku}
            onClick={() => openEditProduct(product)}
            type="button"
          >
            <div>
              <strong>{product.name}</strong>
              <p>{product.sku}</p>
            </div>

            <div>
              <span className="category-chip">{product.category}</span>
            </div>

            <div className="product-row-end">
              <span>Reorder at {product.reorderLevel}</span>
              <span className="row-chevron" aria-hidden="true">›</span>
            </div>
          </button>
        ))}
      </div>
    )
  }

  const page = viewContent[activeView]

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />

      <main className="main-content">
        <header className="topbar">
          <div className="page-heading">
            <p className="eyebrow">{page.eyebrow}</p>
            <h2>{page.title}</h2>
            <p className="subtitle">{page.description}</p>
          </div>

          {(activeView === 'dashboard' || activeView === 'products') && (
            <button className="primary-button topbar-action" type="button" onClick={openCreateProduct}>
              <span aria-hidden="true">＋</span>
              Add product
            </button>
          )}
        </header>

        {activeView === 'dashboard' && (
          <>
            <section className="stats-grid" aria-label="Inventory summary">
              <StatCard
                label="Products"
                value={loading ? '…' : products.length}
                helper="Catalog items available to manage"
                icon="▣"
                tone="blue"
              />
              <StatCard
                label="Low stock"
                value={loading ? '…' : lowStock.length}
                helper="Items at or below reorder threshold"
                icon="!"
                tone="amber"
              />
              <StatCard
                label="Open restocks"
                value={loading ? '…' : openRestocks}
                helper="Requests still moving through workflow"
                icon="↻"
                tone="violet"
              />
              <StatCard
                label="Locations"
                value={loading ? '…' : locationCount}
                helper="Inventory sites currently in use"
                icon="⌖"
                tone="green"
              />
            </section>

            <section className="dashboard-grid dashboard-overview-grid">
              <article className="panel recent-products-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Product catalog</p>
                    <h3>Recent products</h3>
                    <p className="panel-description">
                      Quickly review the newest catalog items. Select a product to edit its details.
                    </p>
                  </div>

                  <button className="text-button" type="button" onClick={() => handleNavigate('products')}>
                    View all products
                  </button>
                </div>

                {renderProductList({ compact: true })}
              </article>

              <article className="panel attention-panel">
                <div className="panel-header panel-header-start">
                  <div>
                    <p className="eyebrow">Attention center</p>
                    <h3>Inventory health</h3>
                    <p className="panel-description">
                      Use these shortcuts to handle the areas that need operational attention.
                    </p>
                  </div>
                </div>

                <button className="attention-item" type="button" onClick={() => handleNavigate('restocks')}>
                  <span className="attention-icon attention-icon-amber">!</span>
                  <span>
                    <strong>{lowStock.length} low-stock item{lowStock.length === 1 ? '' : 's'}</strong>
                    <small>Review products that may need replenishment.</small>
                  </span>
                  <span className="row-chevron">›</span>
                </button>

                <button className="attention-item" type="button" onClick={() => handleNavigate('restocks')}>
                  <span className="attention-icon attention-icon-violet">↻</span>
                  <span>
                    <strong>{openRestocks} open restock request{openRestocks === 1 ? '' : 's'}</strong>
                    <small>Continue approval, ordering, or receiving work.</small>
                  </span>
                  <span className="row-chevron">›</span>
                </button>

                <button className="attention-item" type="button" onClick={() => handleNavigate('movements')}>
                  <span className="attention-icon attention-icon-blue">⇄</span>
                  <span>
                    <strong>Record inventory changes</strong>
                    <small>Capture stock arriving or leaving a location.</small>
                  </span>
                  <span className="row-chevron">›</span>
                </button>
              </article>
            </section>

            <section className="getting-started-card">
              <div>
                <p className="eyebrow">How StockSense works</p>
                <h3>A simple inventory workflow</h3>
                <p className="section-description">
                  Follow these steps when you are new to the platform. Each workspace focuses on one part of the inventory lifecycle.
                </p>
              </div>

              <div className="guide-steps">
                <button type="button" className="guide-step" onClick={() => handleNavigate('products')}>
                  <span>1</span>
                  <div>
                    <strong>Create products</strong>
                    <p>Set up the catalog and define reorder thresholds.</p>
                  </div>
                </button>
                <button type="button" className="guide-step" onClick={() => handleNavigate('movements')}>
                  <span>2</span>
                  <div>
                    <strong>Record stock movements</strong>
                    <p>Add or remove quantity at a specific inventory location.</p>
                  </div>
                </button>
                <button type="button" className="guide-step" onClick={() => handleNavigate('restocks')}>
                  <span>3</span>
                  <div>
                    <strong>Replenish low stock</strong>
                    <p>Create and progress restock requests through their lifecycle.</p>
                  </div>
                </button>
              </div>
            </section>
          </>
        )}

        {activeView === 'products' && (
          <section className="workspace-stack">
            <div className="page-intro-card">
              <div>
                <p className="eyebrow">Catalog management</p>
                <h3>Products and inventory</h3>
                <p className="section-description">
                  Review product details, reorder thresholds, locations, and current
                  stock levels in one place.
                </p>
              </div>
            </div>

            <article className="panel products-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Inventory catalog</p>
                  <h3>All products</h3>
                  <p className="panel-description">
                    Each product shows where it is stocked and whether its quantity
                    is above or below the reorder threshold.
                  </p>
                </div>

                <span className="count-pill">
                  {products.length} product{products.length === 1 ? '' : 's'}
                </span>
              </div>

              {loading ? (
                <div className="empty-state compact-empty-state">
                  <div className="empty-icon">…</div>
                  <h4>Loading inventory</h4>
                  <p>StockSense is retrieving your product and location data.</p>
                </div>
              ) : error ? (
                <div className="empty-state compact-empty-state">
                  <div className="empty-icon empty-icon-error">!</div>
                  <h4>Could not load products</h4>
                  <p>{error}</p>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state compact-empty-state">
                  <div className="empty-icon">＋</div>
                  <h4>No products yet</h4>
                  <p>
                    Add your first product to start tracking inventory across locations.
                  </p>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={openCreateProduct}
                  >
                    Add first product
                  </button>
                </div>
              ) : (
                <div className="product-inventory-list">
                  {products.map((product) => {
                    const records = inventoryRecords.filter(
                      (record) => record.sku === product.sku
                    )

                    const totalQuantity = records.reduce(
                      (total, record) => total + record.quantity,
                      0
                    )

                    const lowStockRecords = records.filter(
                      (record) => record.quantity <= product.reorderLevel
                    )

                    return (
                      <div
                        className="product-inventory-card"
                        key={product.id ?? product.sku}
                      >
                        <div className="product-inventory-header">
                          <div>
                            <h4>{product.name}</h4>

                            <div className="product-meta-row">
                              <span>{product.sku}</span>
                              <span className="category-chip">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          <button
                            className="secondary-button"
                            type="button"
                            onClick={() => openEditProduct(product)}
                          >
                            Edit product
                          </button>
                        </div>

                        <div className="product-summary-grid">
                          <div className="product-summary-item">
                            <span className="product-summary-label">
                              Total quantity
                            </span>
                            <strong>{totalQuantity}</strong>
                          </div>

                          <div className="product-summary-item">
                            <span className="product-summary-label">
                              Reorder level
                            </span>
                            <strong>{product.reorderLevel}</strong>
                          </div>

                          <div className="product-summary-item">
                            <span className="product-summary-label">
                              Locations
                            </span>
                            <strong>{records.length}</strong>
                          </div>

                          <div className="product-summary-item">
                            <span className="product-summary-label">
                              Status
                            </span>

                            <strong>
                              {records.length === 0
                                ? 'Not stocked'
                                : lowStockRecords.length > 0
                                  ? `${lowStockRecords.length} need attention`
                                  : 'Healthy'}
                            </strong>
                          </div>
                        </div>

                        {records.length === 0 ? (
                          <div className="product-location-empty">
                            <p>
                              This product has not been assigned to an inventory
                              location yet.
                            </p>
                          </div>
                        ) : (
                          <div className="product-location-list">
                            {records.map((record) => {
                              const isLowStock =
                                record.quantity <= product.reorderLevel

                              return (
                                <div
                                  className="product-location-row"
                                  key={`${record.sku}-${record.locationCode}`}
                                >
                                  <div>
                                    <span className="product-summary-label">
                                      Location
                                    </span>
                                    <strong>{record.locationCode}</strong>
                                  </div>

                                  <div>
                                    <span className="product-summary-label">
                                      Quantity
                                    </span>
                                    <strong>{record.quantity}</strong>
                                  </div>

                                  <div>
                                    <span className="product-summary-label">
                                      Stock status
                                    </span>

                                    <strong
                                      className={
                                        isLowStock
                                          ? 'stock-status-low'
                                          : 'stock-status-healthy'
                                      }
                                    >
                                      {isLowStock
                                        ? `Low · reorder at ${product.reorderLevel}`
                                        : `Healthy · reorder at ${product.reorderLevel}`}
                                    </strong>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </article>
          </section>
        )}

        {activeView === 'locations' && <LocationPanel />}
        {activeView === 'movements' && <StockMovementPanel />}
        {activeView === 'restocks' && <ReplenishmentPanel />}
      </main>

      {productModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeProductModal}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct ? 'Edit product' : 'Add product'}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={closeProductModal} aria-label="Close">
              ×
            </button>

            <ProductForm
              onProductCreated={handleProductCreated}
              selectedProduct={selectedProduct}
              onProductUpdated={handleProductUpdated}
              onCancelEdit={closeProductModal}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
