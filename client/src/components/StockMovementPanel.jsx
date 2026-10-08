import { useState } from 'react'
import { apiRequest } from '../lib/api'

export default function StockMovementPanel() {
    const [form, setForm] = useState({
        sku: 'INV-001',
        locationCode: 'MAIN',
        amount: 1,
        movementType: 'stock-in',
    })

    const [movements, setMovements] = useState([])
    const [currentQuantity, setCurrentQuantity] = useState(null)
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: name === 'amount' ? Number(value) : value,
        }))
    }

    async function loadHistory() {
        if (!form.sku.trim() || !form.locationCode.trim()) {
            setError('SKU and location code are required.')
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

        if (form.amount <= 0) {
            setError('Amount must be greater than zero.')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const result = await apiRequest(
                `/inventory/${form.movementType}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        sku: form.sku,
                        locationCode: form.locationCode,
                        amount: form.amount,
                    }),
                }
            )

            setCurrentQuantity(result.quantity)

            await loadHistory()
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="movement-workspace">
            <article className="panel">
                <p className="eyebrow">Stock operations</p>
                <h3>Record stock movement</h3>

                <form className="movement-form" onSubmit={handleSubmit}>
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
                        Movement type
                        <select
                            name="movementType"
                            value={form.movementType}
                            onChange={handleChange}
                        >
                            <option value="stock-in">Stock In</option>
                            <option value="stock-out">Stock Out</option>
                        </select>
                    </label>

                    <label>
                        Amount
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
                            {submitting ? 'Saving...' : 'Record Movement'}
                        </button>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={loadHistory}
                            disabled={loadingHistory}
                        >
                            {loadingHistory ? 'Loading...' : 'Load History'}
                        </button>
                    </div>

                    {currentQuantity !== null && (
                        <p className="movement-success">
                            Current quantity: <strong>{currentQuantity}</strong>
                        </p>
                    )}
                </form>
            </article>

            <article className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Audit ledger</p>
                        <h3>Movement history</h3>
                    </div>

                    <span>{movements.length} events</span>
                </div>

                {movements.length === 0 ? (
                    <div className="movement-empty">
                        <p>
                            Load a product/location history to see its stock ledger.
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
        </section>
    )
}