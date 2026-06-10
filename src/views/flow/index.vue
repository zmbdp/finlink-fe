<script setup>
import { ref, onMounted, computed } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { listFlow, listCurrencyOptions, listTradeTypeOptions, exportFlow } from "@/api/flow"
import { formatDateTime, handleDateRangeChange } from "@/utils/date"

const queryForm = ref({
  ourCompany: "",
  ourAccount: "",
  currency: "",
  tradeType: "",
  startTime: "",
  endTime: ""
})

const dateRange = ref([])

const currencyOptions = ref([])
const tradeTypeOptions = ref([])
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const columns = [
  { type: "index", label: "序号", width: 55 },
  { prop: "ourCompany", label: "本方企业", minWidth: 120 },
  { prop: "ourAccount", label: "本方账号", minWidth: 120 },
  { prop: "ourBank", label: "本方银行", minWidth: 120 },
  { prop: "counterpartAccount", label: "对方账号", minWidth: 120 },
  { prop: "counterpartBank", label: "对方银行", minWidth: 120 },
  { prop: "currency", label: "币种", minWidth: 80 },
  { prop: "income", label: "收入", minWidth: 120 },
  { prop: "expense", label: "支出", minWidth: 120 },
  { prop: "balance", label: "余额", minWidth: 120 },
  { prop: "summary", label: "摘要", minWidth: 150 },
  { prop: "tradeType", label: "交易类型", minWidth: 100 },
  { prop: "createTime", label: "交易时间", minWidth: 180 }
]

const handleDateChange = (val) => {
  handleDateRangeChange(val, queryForm)
}

const getOptions = async () => {
  try {
    const [currencyRes, tradeTypeRes] = await Promise.all([
      listCurrencyOptions(),
      listTradeTypeOptions()
    ])
    currencyOptions.value = currencyRes.data || []
    tradeTypeOptions.value = tradeTypeRes.data || []
  } catch (error) {
    console.error(error)
  }
}

const getTableData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryForm.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    const res = await listFlow(params)
    tableData.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  currentPage.value = 1
  getTableData()
}

const handleReset = () => {
  queryForm.value = {
    ourCompany: "",
    ourAccount: "",
    currency: "",
    tradeType: "",
    startTime: "",
    endTime: ""
  }
  dateRange.value = []
  handleQuery()
}

const handleExport = async () => {
  try {
    const res = await exportFlow(queryForm.value)
    const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const now = new Date()
    const dateStr = now.getFullYear().toString() + 
      (now.getMonth() + 1).toString().padStart(2, "0") + 
      now.getDate().toString().padStart(2, "0")
    link.download = "流水列表_" + dateStr + ".xlsx"
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success("导出成功")
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  getTableData()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  getTableData()
}

onMounted(() => {
  getOptions()
  getTableData()
})
</script>

<template>
  <div class="flow-container">
    <div class="query-bar">
      <div class="query-fields">
        <el-form-item label="本方企业">
          <el-input v-model="queryForm.ourCompany" placeholder="请输入" class="query-input" />
        </el-form-item>
        <el-form-item label="本方账号">
          <el-input v-model="queryForm.ourAccount" placeholder="请输入" class="query-input" />
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="queryForm.currency" placeholder="请选择" class="query-select">
            <el-option v-for="item in currencyOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="queryForm.tradeType" placeholder="请选择" class="query-select">
            <el-option v-for="item in tradeTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            class="query-picker"
            @change="handleDateChange"
          />
        </el-form-item>
      </div>
      <div class="query-actions">
        <el-button type="primary" class="btn-blue" @click="handleQuery">查询</el-button>
        <el-button class="btn-gray" @click="handleReset">重置</el-button>
        <el-button type="success" class="btn-green" @click="handleExport">导出</el-button>
      </div>
    </div>
    
    <div class="table-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
        stripe
      >
        <el-table-column
          v-for="col in columns"
          :key="col.prop || col.type"
          :type="col.type"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          align="center"
        >
          <template v-if="col.prop === 'createTime'" #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
          <template v-else-if="['income', 'expense', 'balance'].includes(col.prop)" #default="{ row }">
            {{ row[col.prop] !== null && row[col.prop] !== undefined ? row[col.prop].toFixed(2) : "" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="prev, pager, next, sizes, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.flow-container {
  padding: 0 40px 40px;
}

.query-bar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.query-fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.query-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.query-input {
  width: 180px;
}

.query-select {
  width: 180px;
}

.query-picker {
  width: 360px;
}

.btn-blue {
  background: #2979ff;
  border-color: #2979ff;
  color: white;
  font-weight: bold;
}

.btn-gray {
  background: #9e9e9e;
  border-color: #9e9e9e;
  color: white;
  font-weight: bold;
}

.btn-green {
  background: #4caf50;
  border-color: #4caf50;
  color: white;
  font-weight: bold;
}

.table-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>