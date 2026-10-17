import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

export default function StockMovementPanel() {
    const [locations, setLocations] = useState([])
    const [form, setForm] = useState({
        sku: '',
        locationCode: '',
        amount: 1,
        movementType: 'stock-in',
    })

    const [movements, setMovements] = useState([])
    const [currentQuantity, setCurrentQuantity] = useState(null)
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        apiRequest('/locations')
            .then((data) => {
                if (!cancelled) {
                    setLocations(data)
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message)
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
            [name]: name === 'amount' ? Number(value) : value,
        }))
    }

    async function loadHistory() {
        if (!form.sku.trim() || !form.locationCode) {
            setError('SKU and location are required.')
            return
        }

        setLoadingHistory(true)
        setError('')

        try {
            const history = await apiRequest(
                `/inventory/movements?sku=${encodeURIComponent(form.sku)}&locationCode=${encodeURIComponent(form.locationCode)}`
            )

            setMovements(history)
        } catch (err) {
            setMovements([])
            setError(err.message)
        } finally {
            setLoadingHistory(false)
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!form.locationCode) {
            setError('Please choose a location.')
            return
        }

        if (form.amount <= 0) {
            setError('Amount must be greater than zero.')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const result = await apiRequest(`/inventory/${form.movementType}`, {
                method: 'POST',
                body: JSON.stringify({
                    sku: form.sku,
                    locationCode: form.locationCode,
                    amount: form.amount,
                }),
            })

            setCurrentQuantity(result.quantity)
            await loadHistory()
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="workspace-stack">
            <div className="page-intro-card">
                <p className="eyebrow">Inventory operations</p>
                <h3>Stock movements</h3>
                <p className="section-description">
                    Record stock arriving or leaving a location, then review the audit
                    trail for the exact product and site.
                </p>
            </div>

            <div className="movement-workspace">
                <article className="panel">
                    <div className="panel-header panel-header-start">
                        <div>
                            <p className="eyebrow">Record a movement</p>
                            <h3>Update inventory quantity</h3>
                            <p className="panel-description">
                                Choose Stock In when inventory arrives and Stock Out when
                                inventory leaves the location.
                            </p>
                        </div>
                    </div>

                    <form className="movement-form" onSubmit={handleSubmit}>
                        <label className="form-field">
                            <span className="field-label">SKU</span>
                            <span className="field-help">
                                Enter the product identifier you want to update.
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
                                Choose where this stock movement happened.
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
                            <span className="field-label">Movement type</span>
                            <span className="field-help">
                                Stock In increases quantity; Stock Out decreases it.
                            </span>

                            <select
                                name="movementType"
                                value={form.movementType}
                                onChange={handleChange}
                            >
                                <option value="stock-in">Stock In</option>
                                <option value="stock-out">Stock Out</option>
                            </select>
                        </label>

                        <label className="form-field">
                            <span className="field-label">Amount</span>
                            <span className="field-help">
                                Enter the number of units moving in or out.
                            </span>

                            <input
                                type="number"
                                name="amount"
                                min="1"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        {error && <p className="form-error">{error}</p>}

                        <div className="form-actions">
                            <button
                                className="primary-button"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Record movement'}
                            </button>

                            <button
                                className="secondary-button"
                                type="button"
                                onClick={loadHistory}
                                disabled={loadingHistory}
                            >
                                {loadingHistory ? 'Loading...' : 'Load history'}
                            </button>
                        </div>

                        {currentQuantity !== null && (
                            <p className="movement-success">
                                Updated successfully. Current quantity:{' '}
                                <strong>{currentQuantity}</strong>
                            </p>
                        )}
                    </form>
                </article>

                <article className="panel">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">Audit ledger</p>
                            <h3>Movement history</h3>
                            <p className="panel-description">
                                Review every recorded stock change for the selected SKU and
                                location.
                            </p>
                        </div>

                        <span className="count-pill">{movements.length} events</span>
                    </div>

                    {movements.length === 0 ? (
                        <div className="empty-state compact-empty-state">
                            <div className="empty-icon">⇄</div>
                            <h4>No movement history loaded</h4>
                            <p>
                                Choose a SKU and location, then select Load history to view its
                                audit trail.
                            </p>
                        </div>
                    ) : (
                        <div className="movement-list">
                            {movements.map((movement, index) => (
                                <div
                                    className="movement-row"
                                    key={`${movement.createdAt}-${index}`}
                                >
                                    <div>
                                        <strong>{movement.type}</strong>
                                        <p>
                                            {movement.sku} · {movement.locationCode}
                                        </p>
                                    </div>

                                    <strong
                                        className={
                                            movement.quantityDelta > 0
                                                ? 'movement-positive'
                                                : 'movement-negative'
                                        }
                                    >
                                        {movement.quantityDelta > 0 ? '+' : ''}
                                        {movement.quantityDelta}
                                    </strong>

                                    <span>
                                        {new Date(movement.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </section>
    )
}