import { saveAs } from 'file-saver'

// 读取嵌套字段，如 'dept.deptName'
function getValue(row, prop) {
  return prop.split('.').reduce((obj, key) => (obj == null ? undefined : obj[key]), row)
}

// 转义单个 CSV 单元格
function escapeCell(val) {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

/**
 * 前端生成并下载 CSV。
 * @param {Array<Object>} rows 数据行
 * @param {Array<{prop:string,label:string,formatter?:(val,row)=>any}>} columns 列定义
 * @param {string} filename 文件名（建议以 .csv 结尾）
 */
export function exportCsv(rows, columns, filename) {
  const header = columns.map((col) => escapeCell(col.label)).join(',')
  const lines = (rows || []).map((row) =>
    columns
      .map((col) => {
        const raw = getValue(row, col.prop)
        const val = col.formatter ? col.formatter(raw, row) : raw
        return escapeCell(val)
      })
      .join(',')
  )
  // ﻿ BOM 让 Excel 正确识别 UTF-8 中文
  const content = '﻿' + [header, ...lines].join('\r\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, filename)
}
