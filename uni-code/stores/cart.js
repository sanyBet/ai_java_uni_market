import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartList = ref([])

  const cartCount = computed(() => {
    return cartList.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const selectedItems = computed(() => {
    return cartList.value.filter(item => item.selected)
  })

  const totalPrice = computed(() => {
    return selectedItems.value
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  })

  const allSelected = computed(() => {
    return cartList.value.length > 0 && cartList.value.every(item => item.selected)
  })

  function addToCart(product, spec, quantity = 1) {
    const existing = cartList.value.find(
      item => item.productId === product.id && item.spec === spec
    )
    if (existing) {
      existing.quantity += quantity
    } else {
      cartList.value.push({
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        cover: product.cover,
        price: product.price,
        spec,
        quantity,
        selected: true
      })
    }
  }

  function removeFromCart(id) {
    const index = cartList.value.findIndex(item => item.id === id)
    if (index > -1) {
      cartList.value.splice(index, 1)
    }
  }

  function updateQuantity(id, delta) {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta)
    }
  }

  function toggleSelect(id) {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
    }
  }

  function toggleSelectAll() {
    const newState = !allSelected.value
    cartList.value.forEach(item => {
      item.selected = newState
    })
  }

  function clearSelected() {
    cartList.value = cartList.value.filter(item => !item.selected)
  }

  function clearCart() {
    cartList.value = []
  }

  return {
    cartList, cartCount, selectedItems, totalPrice, allSelected,
    addToCart, removeFromCart, updateQuantity, toggleSelect, toggleSelectAll,
    clearSelected, clearCart
  }
})
