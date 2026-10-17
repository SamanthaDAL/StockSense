import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

export default function LocationPanel() {
    const [locations, setLocations] = useState([])
    const [form, setForm] = useState({
        code: '',
        name: '',
    })

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function loadLocations() {
        try {
            const data = await apiRequest('/locations')
            setLocations(data)
            setError('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let cancelled = false

        apiRequest('/locations')
            .then((data) => {
                if (!cancelled) {
                    setLocations(data)
                    setError('')
                }
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
            [name]: name === 'code' ? value.toUpperCase() : value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setSubmitting(true)
        setError('')

        try {
            await apiRequest('/locations', {
                method: 'POST',
                body: JSON.stringify(form),
            })

            setForm({
                code: '',
                name: '',
            })

            await loadLocations()
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="workspace-stack">
            <div className="page-intro-card">
                <p className="eyebrow">Inventory structure</p>
                <h3>Locations</h3>
                <p className="section-description">
                    Manage the warehouses and inventory sites where StockSense tracks
                    product quantities.
                </p>
            </div>

            <div className="location-workspace">
                <article className="panel">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">Inventory sites</p>
                            <h3>Active locations</h3>
                            <p className="panel-description">
                                Location codes identify where each inventory record belongs.
                            </p>
                        </div>

                        <span className="count-pill">
                            {locations.length} location{locations.length === 1 ? '' : 's'}
                        </span>
                    </div>

                    {loading ? (
                        <p className="panel-message">Loading locations...</p>
                    ) : locations.length === 0 ? (
                        <div className="empty-state compact-empty-state">
                            <div className="empty-icon">⌖</div>
                            <h4>No locations yet</h4>
                            <p>Add your first inventory location to begin tracking stock.</p>
                        </div>
                    ) : (
                        <div className="location-list">
                            {locations.map((location) => (
                                <div className="location-row" key={location.id ?? location.code}>
                                    <div className="location-code-badge">
                                        {location.code}
                                    </div>

                                    <div>
                                        <strong>{location.name}</strong>
                                        <p>Inventory location</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className="panel">
                    <div className="panel-header panel-header-start">
                        <div>
                            <p className="eyebrow">Add inventory site</p>
                            <h3>Create location</h3>
                            <p className="panel-description">
                                Use a short code that staff can recognise easily.
                            </p>
                        </div>
                    </div>

                    <form className="location-form" onSubmit={handleSubmit}>
                        <label className="form-field">
                            <span className="field-label">Location code</span>
                            <span className="field-help">
                                Short unique identifier, for example MAIN or KL-WH.
                            </span>

                            <input
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="e.g. KL-WH"
                                required
                            />
                        </label>

                        <label className="form-field">
                            <span className="field-label">Location name</span>
                            <span className="field-help">
                                Friendly name shown to users.
                            </span>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Kuala Lumpur Warehouse"
                                required
                            />
                        </label>

                        {error && <p className="form-error">{error}</p>}

                        <button
                            className="primary-button"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Add location'}
                        </button>
                    </form>
                </article>
            </div>
        </section>
    )
}