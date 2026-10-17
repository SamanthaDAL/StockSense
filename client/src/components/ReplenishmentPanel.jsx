import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

export default function ReplenishmentPanel() {
    const [lowStock, setLowStock] = useState([])
    const [restocks, setRestocks] = useState([])
    const [locations, setLocations] = useState([])

    const [form, setForm] = useState({
        sku: '',
        locationCode: '',
        requestedQuantity: 1,
    })

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function loadData() {
        setLoading(true)
        setError('')

        try {
            const [lowStockData, restockData, locationData] = await Promise.all([
                apiRequest('/inventory/low-stock'),
                apiRequest('/restocks'),
                apiRequest('/locations'),
            ])

            setLowStock(lowStockData)
            setRestocks(restockData)
            setLocations(locationData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let cancelled = false

        Promise.all([
            apiRequest('/inventory/low-stock'),
            apiRequest('/restocks'),
            apiRequest('/locations'),
        ])
            .then(([lowStockData, restockData, locationData]) => {
                if (cancelled) return

                setLowStock(lowStockData)
                setRestocks(restockData)
                setLocations(locationData)
                setError('')
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message)
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: name === 'requestedQuantity' ? Number(value) : value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!form.locationCode) {
            setError('Please choose a location.')
            return
        }

        if (form.requestedQuantity <= 0) {
            setError('Requested quantity must be greater than zero.')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            await apiRequest('/restocks', {
                method: 'POST',
                body: JSON.stringify(form),
            })

            setForm({
                sku: '',
                locationCode: '',
                requestedQuantity: 1,
            })

            await loadData()
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    async function changeStatus(id, action) {
        setError('')

        try {
            await apiRequest(`/restocks/${id}/${action}`, {
                method: 'POST',
            })

            await loadData()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <section className="workspace-stack">
            <div className="page-intro-card">
                <p className="eyebrow">Replenishment operations</p>
                <h3>Restock requests</h3>
                <p className="section-description">
                    Identify low-stock inventory, request replenishment, and move each
                    request through approval, ordering, receiving, or cancellation.
                </p>
            </div>

            <div className="replenishment-workspace">
                <article className="panel">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">Needs attention</p>
                            <h3>Low-stock inventory</h3>
                            <p className="panel-description">
                                Select an item to prefill the restock request form with its SKU
                                and location.
                            </p>
                        </div>

                        <span className="count-pill">{lowStock.length} items</span>
                    </div>

                    {loading ? (
                        <p className="panel-message">Loading low-stock inventory...</p>
                    ) : lowStock.length === 0 ? (
                        <div className="empty-state compact-empty-state">
                            <div className="empty-icon">✓</div>
                            <h4>No low-stock items</h4>
                            <p>
                                Inventory currently has no items at or below their reorder
                                threshold.
                            </p>
                        </div>
                    ) : (
                        <div className="reorder-list">
                            {lowStock.map((item) => (
                                <button
                                    className="reorder-row"
                                    key={`${item.sku}-${item.locationCode}`}
                                    type="button"
                                    onClick={() =>
                                        setForm((current) => ({
                                            ...current,
                                            sku: item.sku,
                                            locationCode: item.locationCode,
                                        }))
                                    }
                                >
                                    <div>
                                        <strong>{item.sku}</strong>
                                        <p>Location {item.locationCode}</p>
                                    </div>

                                    <span className="stock-warning">
                                        Quantity {item.quantity}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </article>

                <article className="panel">
                    <div className="panel-header panel-header-start">
                        <div>
                            <p className="eyebrow">Create request</p>
                            <h3>Request replenishment</h3>
                            <p className="panel-description">
                                Ask for additional stock for a specific product and inventory
                                location.
                            </p>
                        </div>
                    </div>

                    <form className="restock-form" onSubmit={handleSubmit}>
                        <label className="form-field">
                            <span className="field-label">SKU</span>
                            <span className="field-help">
                                Product that needs replenishment.
                            </span>

                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                placeholder="e.g. BCS-1001"
                                required
                            />
                        </label>

                        <label className="form-field">
                            <span className="field-label">Location</span>
                            <span className="field-help">
                                Choose the inventory site where stock is needed.
                            </span>

                            <select
                                name="locationCode"
                                value={form.locationCode}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a location</option>

                                {locations.map((location) => (
                                    <option key={location.id ?? location.code} value={location.code}>
                                        {location.name} ({location.code})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-field">
                            <span className="field-label">Requested quantity</span>
                            <span className="field-help">
                                Number of units you want replenished.
                            </span>

                            <input
                                type="number"
                                name="requestedQuantity"
                                min="1"
                                value={form.requestedQuantity}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        {error && <p className="form-error">{error}</p>}

                        <button
                            className="primary-button"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Create restock request'}
                        </button>
                    </form>
                </article>

                <article className="panel restock-panel">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">Workflow</p>
                            <h3>Request lifecycle</h3>
                            <p className="panel-description">
                                Progress requests through REQUESTED → APPROVED → ORDERED →
                                RECEIVED, or cancel when needed.
                            </p>
                        </div>

                        <span className="count-pill">{restocks.length} total</span>
                    </div>

                    {restocks.length === 0 ? (
                        <div className="empty-state compact-empty-state">
                            <div className="empty-icon">↻</div>
                            <h4>No restock requests yet</h4>
                            <p>
                                Create a request when inventory needs replenishment. Its status
                                will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="restock-list">
                            {restocks.map((request) => (
                                <div className="restock-row" key={request.id}>
                                    <div>
                                        <strong>{request.sku}</strong>
                                        <p>
                                            {request.locationCode} · Qty {request.requestedQuantity}
                                        </p>
                                    </div>

                                    <span
                                        className={`status-badge status-${request.status.toLowerCase()}`}
                                    >
                                        {request.status}
                                    </span>

                                    <div className="restock-actions">
                                        {request.status === 'REQUESTED' && (
                                            <button
                                                className="secondary-button"
                                                onClick={() => changeStatus(request.id, 'approve')}
                                            >
                                                Approve
                                            </button>
                                        )}

                                        {request.status === 'APPROVED' && (
                                            <button
                                                className="secondary-button"
                                                onClick={() => changeStatus(request.id, 'order')}
                                            >
                                                Mark ordered
                                            </button>
                                        )}

                                        {request.status === 'ORDERED' && (
                                            <button
                                                className="secondary-button"
                                                onClick={() => changeStatus(request.id, 'receive')}
                                            >
                                                Mark received
                                            </button>
                                        )}

                                        {request.status !== 'RECEIVED' &&
                                            request.status !== 'CANCELLED' && (
                                                <button
                                                    className="ghost-danger-button"
                                                    onClick={() => changeStatus(request.id, 'cancel')}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </section>
    )
}