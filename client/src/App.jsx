import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import { apiRequest } from './lib/api'
import ProductForm from './components/ProductForm'
import StockMovementPanel from './components/StockMovementPanel'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiRequest('/products')
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  function handleProductCreated(product) {
    setProducts((current) => [...current, product])
  }

  function handleProductUpdated(updatedProduct) {
    setProducts((current) =>
      current.map((product) =>
        product.sku === updatedProduct.sku
          ? updatedProduct
          : product
      )
    )

    setSelectedProduct(null)
  }

  function handleCancelEdit() {
    setSelectedProduct(null)
  }

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
            value={loading ? '...' : products.length}
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

        <ProductForm
          onProductCreated={handleProductCreated}
          selectedProduct={selectedProduct}
          onProductUpdated={handleProductUpdated}
          onCancelEdit={handleCancelEdit}
        />

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Product catalog</p>
                <h3>Products</h3>
              </div>

              <span>{products.length} total</span>
            </div>

            {loading && (
              <div className="empty-state">
                <h4>Loading products...</h4>
              </div>
            )}

            {!loading && error && (
              <div className="empty-state">
                <h4>Could not load products</h4>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <h4>No products found</h4>
                <p>Create your first product to populate the catalog.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="product-list">
                {products.map((product) => (
                  <button
                    className="product-row product-row-button"
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.sku}</p>
                    </div>

                    <div>
                      <span>{product.category}</span>
                    </div>

                    <div>
                      <span>Reorder: {product.reorderLevel}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedProduct && (
              <div className="product-detail">
                <p className="eyebrow">Selected product</p>
                <h3>{selectedProduct.name}</h3>

                <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Reorder level:</strong> {selectedProduct.reorderLevel}</p>
              </div>
            )}
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
        <StockMovementPanel />
      </main>
    </div>
  )
}

export default App