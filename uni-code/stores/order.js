import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null)

  function setCurrentOrder(data) {
    currentOrder.value = {
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      discountAmount: data.discountAmount || 0,
      payAmount: data.payAmount || 0,
      address: data.address || null,
      payMethod: data.payMethod || 'wechat'
    }
  }

  function setAddress(address) {
    if (currentOrder.value) {
      currentOrder.value.address = address
    }
  }

  function setPayMethod(method) {
    if (currentOrder.value) {
      currentOrder.value.payMethod = method
    }
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return { currentOrder, setCurrentOrder, setAddress, setPayMethod, clearCurrentOrder }
})
