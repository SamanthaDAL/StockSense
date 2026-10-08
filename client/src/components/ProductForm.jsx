import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

export default function ProductForm({
    onProductCreated,
    selectedProduct,
    onProductUpdated,
    onCancelEdit,
}) {
    const [form, setForm] = useState({
        sku: '',
        name: '',
        category: '',
        reorderLevel: 0,
    })

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (selectedProduct) {
            setForm({
                sku: selectedProduct.sku,
                name: selectedProduct.name,
                category: selectedProduct.category,
                reorderLevel: selectedProduct.reorderLevel,
            })
        } else {
            setForm({
                sku: '',
                name: '',
                category: '',
                reorderLevel: 0,
            })
        }
    }, [selectedProduct])

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
        <form className="product-form" onSubmit={handleSubmit}>
            <h3>{selectedProduct ? 'Edit product' : 'Add product'}</h3>

            <label>
                SKU
                <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    disabled={Boolean(selectedProduct)}
                    required
                />
            </label>

            <label>
                Name
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Category
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Reorder level
                <input
                    type="number"
                    name="reorderLevel"
                    min="0"
                    value={form.reorderLevel}
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
                    {submitting
                        ? 'Saving...'
                        : selectedProduct
                            ? 'Update Product'
                            : 'Create Product'}
                </button>

                {selectedProduct && (
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}