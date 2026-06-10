export const formatDateTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const handleDateRangeChange = (val, formRef, startField = 'startTime', endField = 'endTime') => {
  if (val && val.length === 2) {
    formRef.value[startField] = formatDateTime(val[0])
    formRef.value[endField] = formatDateTime(val[1])
  } else {
    formRef.value[startField] = ''
    formRef.value[endField] = ''
  }
}