<template>
  <div>
    <div class="page-title">数据概览</div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" style="margin-bottom: 24px;">
      <el-col :span="6" v-for="card in statCards" :key="card.label">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: card.color + '1a', color: card.color }">
            <el-icon :size="24"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <el-row :gutter="16" style="margin-bottom: 24px;">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="card-header-title">近7天订单量</span></template>
          <div ref="orderChartRef" class="chart-box" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="card-header-title">近7天销售额（元）</span></template>
          <div ref="salesChartRef" class="chart-box" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 近期订单 -->
    <el-card shadow="never">
      <template #header>
        <span class="card-header-title">近期订单</span>
      </template>
      <el-table :data="recentOrders" stripe>
        <el-table-column prop="orderNo"      label="订单编号" min-width="190" />
        <el-table-column prop="contactName"  label="联系人"   width="100" />
        <el-table-column prop="payAmount"    label="实付金额" width="110">
          <template #default="{ row }">
            <span style="color: #e6a23c; font-weight: 600;">¥{{ row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="orderStatusMap[row.status]?.type" size="small">
              {{ orderStatusMap[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getDashboardStats } from '@/api/dashboard'

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

const orderChartRef = ref(null)
const salesChartRef = ref(null)
let orderChart = null
let salesChart = null

const makeOption = (color, xData, yData, formatter) => ({
  tooltip: {
    trigger: 'axis',
    formatter: formatter ?? (p => `${p[0].name}<br/>${p[0].marker}${p[0].value}`),
  },
  grid: { top: 16, right: 16, bottom: 24, left: 48 },
  xAxis: { type: 'category', data: xData, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399', fontSize: 12 } },
  yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f2f6fc' } }, axisLabel: { color: '#909399', fontSize: 12 } },
  series: [{
    type: 'line',
    data: yData,
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { color, width: 2 },
    itemStyle: { color },
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: color + '33' }, { offset: 1, color: color + '00' }] } },
  }],
})

const statCards = ref([
  { label: '注册用户',   value: '-', icon: 'User',        color: '#1a6fba' },
  { label: '商品总数',   value: '-', icon: 'Goods',       color: '#67c23a' },
  { label: '订单总数',   value: '-', icon: 'List',        color: '#e6a23c' },
  { label: '今日销售额', value: '-', icon: 'TrendCharts', color: '#f56c6c' },
])

const orderStatusMap = {
  0: { label: '待支付',    type: 'info' },
  1: { label: '待发货',    type: 'warning' },
  2: { label: '待收货',    type: 'primary' },
  3: { label: '已完成',    type: 'success' },
  4: { label: '退款/售后', type: 'danger' },
}

const recentOrders = ref([])

onMounted(async () => {
  orderChart = echarts.init(orderChartRef.value)
  salesChart = echarts.init(salesChartRef.value)

  try {
    const res = await getDashboardStats()
    const stats = res?.data
    if (stats) {
      statCards.value[0].value = stats.userCount?.toLocaleString() ?? '-'
      statCards.value[1].value = stats.productCount?.toLocaleString() ?? '-'
      statCards.value[2].value = stats.orderCount?.toLocaleString() ?? '-'
      statCards.value[3].value = stats.todaySales ? `¥${Number(stats.todaySales).toLocaleString()}` : '-'
      recentOrders.value = stats.recentOrders ?? []

      const orderDates  = (stats.orderTrend ?? []).map(t => t.date)
      const orderCounts = (stats.orderTrend ?? []).map(t => t.count)
      const salesDates   = (stats.salesTrend ?? []).map(t => t.date)
      const salesAmounts = (stats.salesTrend ?? []).map(t => Number(t.amount))

      orderChart.setOption(makeOption('#1a6fba', orderDates, orderCounts))
      salesChart.setOption(makeOption('#67c23a', salesDates, salesAmounts,
        p => `${p[0].name}<br/>${p[0].marker}¥${p[0].value.toLocaleString()}`))
    }
  } catch {
    // keep placeholder values on error
  }

  const resize = () => { orderChart?.resize(); salesChart?.resize() }
  window.addEventListener('resize', resize)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    orderChart?.dispose()
    salesChart?.dispose()
  })
})
</script>

<style scoped>
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a2744;
  margin-bottom: 20px;
}

.stat-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1a2744;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.card-header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2744;
}

.chart-box {
  height: 220px;
}
</style>
