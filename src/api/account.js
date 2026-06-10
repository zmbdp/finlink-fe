import request from '@/utils/request'

export const listAccount = (params) => {
  return request({
    url: '/account/list',
    method: 'get',
    params
  })
}

export const getAccountById = (id) => {
  return request({
    url: `/account/${id}`,
    method: 'get'
  })
}

export const addAccount = (data) => {
  return request({
    url: '/account',
    method: 'post',
    data
  })
}

export const editAccount = (id, data) => {
  return request({
    url: `/account/${id}`,
    method: 'post',
    data
  })
}

export const deleteAccount = (id) => {
  return request({
    url: `/account/delete/${id}`,
    method: 'post'
  })
}

export const exportAccount = (params) => {
  return request({
    url: '/account/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
