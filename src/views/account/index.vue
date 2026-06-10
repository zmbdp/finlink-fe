<script setup>
import { ref, onMounted, computed } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { listAccount, addAccount, editAccount, deleteAccount, exportAccount } from "@/api/account"

const queryForm = ref({
  accountNo: "",
  company: "",
  bank: "",
  dataSource: ""
})

const dataSourceOptions = ["直联", "手动上传", "其他"]
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const dialogTitle = ref("")
const editId = ref(null)
const formRef = ref()
const form = ref({
  accountNo: "",
  company: "",
  bank: "",
  dataSource: "",
  currency: ""
})

const rules = computed(() => ({
  accountNo: [{ required: true, message: "账号不能为空", trigger: "blur" }],
  company: [{ required: true, message: "所属企业不能为空", trigger: "blur" }],
  bank: [{ required: true, message: "银行不能为空", trigger: "blur" }],
  dataSource: [{ required: true, message: "数据获取方式不能为空", trigger: "change" }],
  currency: [{ required: true, message: "币种不能为空", trigger: "blur" }]
}))

const columns = [
  { type: "index", label: "序号", width: 80 },
  { prop: "accountNo", label: "账号", minWidth: 150 },
  { prop: "company", label: "所属企业", minWidth: 150 },
  { prop: "bank", label: "银行", minWidth: 120 },
  { prop: "dataSource", label: "数据获取方式", minWidth: 140 },
  { prop: "currency", label: "币种", minWidth: 100 },
  { 
    label: "操作", 
    width: 150, 
    fixed: "right",
    align: "center"
  }
]

const getTableData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryForm.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    const res = await listAccount(params)
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
    accountNo: "",
    company: "",
    bank: "",
    dataSource: ""
  }
  handleQuery()
}

const handleAdd = () => {
  dialogTitle.value = "新增账号"
  editId.value = null
  form.value = {
    accountNo: "",
    company: "",
    bank: "",
    dataSource: "",
    currency: ""
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = "编辑账号"
  editId.value = row.id
  form.value = {
    accountNo: row.accountNo,
    company: row.company,
    bank: row.bank,
    dataSource: row.dataSource,
    currency: row.currency
  }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm("确定要删除该账号吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    await deleteAccount(row.id)
    ElMessage.success("删除成功")
    getTableData()
  } catch (error) {
    if (error !== "cancel" && error !== undefined) {
      console.error(error)
    }
  }
}

const handleExport = async () => {
  try {
    const res = await exportAccount(queryForm.value)
    const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const now = new Date()
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0")
    link.download = "账号列表_" + dateStr + ".xlsx"
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success("导出成功")
  } catch (error) {
    console.error(error)
    ElMessage.error("导出失败")
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  try {
    if (editId.value) {
      await editAccount(editId.value, form.value)
      ElMessage.success("编辑成功")
    } else {
      await addAccount(form.value)
      ElMessage.success("新增成功")
    }
    dialogVisible.value = false
    getTableData()
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
  getTableData()
})
</script>

<template>
  <div class="flow-container">
    <div class="query-bar">
      <div class="query-row">
        <el-form-item label="账号">
          <el-input v-model="queryForm.accountNo" placeholder="请输入" class="query-input" />
        </el-form-item>
        <el-form-item label="所属企业">
          <el-input v-model="queryForm.company" placeholder="请输入" class="query-input" />
        </el-form-item>
        <el-form-item label="银行">
          <el-input v-model="queryForm.bank" placeholder="请输入" class="query-input" />
        </el-form-item>
        <el-form-item label="数据获取方式">
          <el-select v-model="queryForm.dataSource" placeholder="请选择" class="query-select" clearable>
            <el-option v-for="item in dataSourceOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </div>
      <div class="query-row">
        <el-button type="primary" class="btn-blue" @click="handleQuery">查询</el-button>
        <el-button class="btn-gray" @click="handleReset">重置</el-button>
        <el-button type="success" class="btn-green" @click="handleExport">导出</el-button>
        <el-button type="primary" class="btn-blue" @click="handleAdd">新增</el-button>
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
          :key="col.label"
          :type="col.type"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          :fixed="col.fixed"
          align="center"
        >
          <template v-if="col.label === '操作'" #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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
        layout="sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        background
      />
    </div>
    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="账号" prop="accountNo">
          <el-input v-model="form.accountNo" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所属企业" prop="company">
          <el-input v-model="form.company" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="银行" prop="bank">
          <el-input v-model="form.bank" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数据获取方式" prop="dataSource">
          <el-select v-model="form.dataSource" placeholder="请选择" class="w-full">
            <el-option v-for="item in dataSourceOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
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

.query-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.query-row:last-child {
  margin-bottom: 0;
}

.query-input {
  width: 180px;
}

.query-select {
  width: 180px;
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

.w-full {
  width: 100%;
}
</style>