import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

export default function ReplenishmentPanel() {
    const [lowStock, setLowStock] = useState([])
    const [restocks, setRestocks] = useState([])
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
            const [lowStockData, restockData] = await Promise.all([
                apiRequest('/inventory/low-stock'),
                apiRequest('/restocks'),
            ])

            setLowStock(lowStockData)
            setRestocks(restockData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]:
                name === 'requestedQuantity'
                    ? Number(value)
                    : value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

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
        <section className="replenishment-workspace">
            <article className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Inventory health</p>
                        <h3>Low-stock inventory</h3>
                    </div>

                    <span>{lowStock.length} items</span>
                </div>

                {loading ? (
                    <p className="panel-message">Loading low-stock inventory...</p>
                ) : lowStock.length === 0 ? (
                    <p className="panel-message">
                        No low-stock inventory found.
                    </p>
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
                                    <p>{item.locationCode}</p>
                                </div>

                                <span>Quantity: {item.quantity}</span>
                            </button>
                        ))}
                    </div>
                )}
            </article>

            <article className="panel">
                <p className="eyebrow">Replenishment</p>
                <h3>Create restock request</h3>

                <form className="restock-form" onSubmit={handleSubmit}>
                    <label>
                        SKU
                        <input
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Location code
                        <input
                            name="locationCode"
                            value={form.locationCode}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Requested quantity
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
                        {submitting ? 'Creating...' : 'Create Restock Request'}
                    </button>
                </form>
            </article>

            <article className="panel restock-panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Operations</p>
                        <h3>Restock requests</h3>
                    </div>

                    <span>{restocks.length} total</span>
                </div>

                {restocks.length === 0 ? (
                    <p className="panel-message">
                        No restock requests yet.
                    </p>
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

                                <span className="status-badge">
                                    {request.status}
                                </span>

                                <div className="restock-actions">
                                    {request.status === 'REQUESTED' && (
                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                changeStatus(request.id, 'approve')
                                            }
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {request.status === 'APPROVED' && (
                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                changeStatus(request.id, 'order')
                                            }
                                        >
                                            Mark Ordered
                                        </button>
                                    )}

                                    {request.status === 'ORDERED' && (
                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                changeStatus(request.id, 'receive')
                                            }
                                        >
                                            Mark Received
                                        </button>
                                    )}

                                    {request.status !== 'RECEIVED' &&
                                        request.status !== 'CANCELLED' && (
                                            <button
                                                className="secondary-button"
                                                onClick={() =>
                                                    changeStatus(request.id, 'cancel')
                                                }
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
        </section>
    )
}