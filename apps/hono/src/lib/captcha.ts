export class CaptchaGenerator {
  static create(text: string): string {
    const width = 120
    const height = 40
    const fontSize = 24
    
    // 简单的 SVG 模板
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`
    
    // 背景
    svg += `<rect width="100%" height="100%" fill="#f2f8fe"/>`
    
    // 随机干扰线
    for(let i=0; i<7; i++) {
       const x1 = Math.random() * width
       const y1 = Math.random() * height
       const x2 = Math.random() * width
       const y2 = Math.random() * height
       const color = '#' + Math.floor(Math.random()*16777215).toString(16)
       svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.5"/>`
    }
    
    // 随机干扰点
    for(let i=0; i<30; i++) {
      const cx = Math.random() * width
      const cy = Math.random() * height
      const r = Math.random() * 2
      const color = '#' + Math.floor(Math.random()*16777215).toString(16)
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.6"/>`
   }

    // 文字
    const xStart = 10
    for (let i = 0; i < text.length; i++) {
      const x = xStart + i * 25 + (Math.random() - 0.5) * 10
      const y = 28 + (Math.random() - 0.5) * 5
      const color = '#' + Math.floor(Math.random()*16777215).toString(16)
      // 简单的旋转效果可以通过 transform="rotate(...)" 实现，这里简化处理
      svg += `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${color}" font-weight="bold">${text[i]}</text>`
    }
    
    svg += `</svg>`
    return svg
  }

  static randomCode(length: number = 4): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}
