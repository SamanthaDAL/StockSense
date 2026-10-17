import { useState } from 'react'
import { apiRequest } from '../lib/api'

export default function ProductForm({
    onProductCreated,
    selectedProduct,
    onProductUpdated,
    onCancelEdit,
}) {
    const [form, setForm] = useState(() =>
        selectedProduct
            ? {
                sku: selectedProduct.sku,
                name: selectedProduct.name,
                category: selectedProduct.category,
                reorderLevel: selectedProduct.reorderLevel,
            }
            : {
                sku: '',
                name: '',
                category: '',
                reorderLevel: 0,
            }
    )

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: name === 'reorderLevel' ? Number(value) : value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            if (selectedProduct) {
                const updatedProduct = await apiRequest(
                    `/products/${selectedProduct.sku}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify({
                            name: form.name,
                            category: form.category,
                            reorderLevel: form.reorderLevel,
                        }),
                    }
                )

                onProductUpdated(updatedProduct)
            } else {
                const createdProduct = await apiRequest('/products', {
                    method: 'POST',
                    body: JSON.stringify(form),
                })

                onProductCreated(createdProduct)
            }

            setForm({
                sku: '',
                name: '',
                category: '',
                reorderLevel: 0,
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="product-form product-form-modal" onSubmit={handleSubmit}>
            <div className="form-intro">
                <p className="eyebrow">{selectedProduct ? 'Product details' : 'Catalog setup'}</p>
                <h3>{selectedProduct ? 'Edit product' : 'Add a new product'}</h3>
                <p className="section-description">
                    {selectedProduct
                        ? 'Update the product information below. The SKU stays fixed so inventory history remains linked correctly.'
                        : 'Create a catalog item first. Stock levels are recorded separately through Stock Movements.'}
                </p>
            </div>

            <div className="form-field-grid">
                <label className="form-field">
                    <span className="field-label">SKU</span>
                    <span className="field-help">A unique code used to identify this product.</span>
                    <input
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        disabled={Boolean(selectedProduct)}
                        placeholder="e.g. INV-001"
                        required
                    />
                </label>

                <label className="form-field">
                    <span className="field-label">Product name</span>
                    <span className="field-help">Use a clear name that people can recognise quickly.</span>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Wireless Barcode Scanner"
                        required
                    />
                </label>

                <label className="form-field">
                    <span className="field-label">Category</span>
                    <span className="field-help">Group similar products for easier scanning and reporting.</span>
                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="e.g. Hardware"
                        required
                    />
                </label>

                <label className="form-field">
                    <span className="field-label">Reorder level</span>
                    <span className="field-help">StockSense flags inventory as low when quantity reaches this threshold.</span>
                    <input
                        type="number"
                        name="reorderLevel"
                        min="0"
                        value={form.reorderLevel}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions form-actions-right">
                <button className="secondary-button" type="button" onClick={onCancelEdit}>
                    Cancel
                </button>

                <button className="primary-button" type="submit" disabled={submitting}>
                    {submitting
                        ? 'Saving...'
                        : selectedProduct
                            ? 'Save changes'
                            : 'Create product'}
                </button>
            </div>
        </form>
    )
}
