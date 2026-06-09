import request from "@/utils/request"

export const listFlow = (params) => {
  return request({
    url: "/flow/list",
    method: "get",
    params
  })
}

export const listCurrencyOptions = () => {
  return request({
    url: "/flow/currencyOptions",
    method: "get"
  })
}

export const listTradeTypeOptions = () => {
  return request({
    url: "/flow/tradeTypeOptions",
    method: "get"
  })
}

export const exportFlow = (params) => {
  return request({
    url: "/flow/export",
    method: "get",
    params,
    responseType: "blob"
  })
}
