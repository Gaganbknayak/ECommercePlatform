import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import './App.css'

type Product = {
  id: number
  name: string
  description: string
  price: number
  quantity: number
}

const api = axios.create({ baseURL: 'http://localhost:5003/api' })

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')

  const loadProducts = async () => {
    try {
      const response = await api.get<Product[]>('/Product')
      setProducts(response.data)
      setError('')
    } catch {
      setError('Could not connect to the API. Start the backend first.')
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const addProduct = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await api.post('/Product', {
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
      })
      setName('')
      setDescription('')
      setPrice('')
      setQuantity('')
      await loadProducts()
    } catch {
      setError('Could not save the product.')
    }
  }

  return (
    <main>
      <h1>ECommerce Platform</h1>
      <p className="subtitle">Manage products from your .NET API</p>

      <form onSubmit={addProduct} className="product-form">
        <h2>Add Product</h2>
        <input required placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <input required placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <input required min="0" step="0.01" type="number" placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
        <input required min="0" type="number" placeholder="Quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        <button type="submit">Add Product</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section>
        <h2>Products</h2>
        {products.length === 0 && !error ? <p>No products yet.</p> : (
          <div className="products">
            {products.map((product) => (
              <article className="product" key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>${product.price.toFixed(2)}</strong>
                <span>Stock: {product.quantity}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
