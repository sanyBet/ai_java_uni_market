/**
 * 格式化价格，保留两位小数
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  return Number(price).toFixed(2)
}

/**
 * 格式化销量
 * @param {number} sales
 * @returns {string}
 */
export function formatSales(sales) {
  if (sales >= 10000) {
    return (sales / 10000).toFixed(1) + 'w'
  }
  return String(sales)
}
