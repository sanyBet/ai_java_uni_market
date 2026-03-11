<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
:root {
  --primary: #EF4444;
  --primary-light: #FEF2F2;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --bg-page: #f9fafb;
  --bg-card: #ffffff;
  --border: #e5e7eb;
}

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: var(--text-primary);
  background-color: var(--bg-page);
}

view, text {
  box-sizing: border-box;
}

image {
  display: block;
}
</style>
