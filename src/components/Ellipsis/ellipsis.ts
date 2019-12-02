import { getStyle } from '@/utils/dom'
class Ellipsis {
  constructor(text: string, lineClamp: number, toggleVal?: Array<string>) {
    this.rawText = text
    this.lineClamp = lineClamp
    if (toggleVal) this.toggleVal = toggleVal
  }
  private rawText!: string
  private target!: HTMLElement
  private lineClamp !: number
  private tempElement!: HTMLElement
  private cliffText !: string
  private isCliff !: boolean
  private minHeight !: number
  private maxHeight !: number
  private toggleVal !: Array<string>
  private timer !: any
  public cliff(target: HTMLElement): { ellipsis: string, maxHeight: number, minHeight: number, isCliff: boolean } {
    // 获取目标元素样式
    clearTimeout(this.timer)
    this.target = target
    let tragetStyle = getStyle(this.target)
    let lineHeight = parseInt(tragetStyle.lineHeight as string)
    // 获取显示的行数
    let at = this.lineClamp * lineHeight
    // 克隆目标元素
    this.setTempDiv()
    // 获取目标元素最大高度
    this.getHeight()
    // 初始化
    if (this.maxHeight > at) {
      this.handleCilff(at)
      this.isCliff = true
    } else {
      this.minHeight = parseInt(tragetStyle.height || '')
      this.isCliff = false
    }
    this.timer = setTimeout(() => {
      if (this.tempElement) document.body.removeChild(this.tempElement)
      ;(this.tempElement as any) = null
    }, 4000)
    return { ellipsis: this.cliffText, maxHeight: this.maxHeight, minHeight: this.minHeight, isCliff: this.isCliff }
  }
  private handleCilff(at: number) {
    let i = 0
    let el = this.tempElement
    let h = 0
    let str = ''
    let extra = (this.toggleVal && this.toggleVal[0]) || ''
    while (h <= at) {
      h = parseInt(getStyle(el).height || '')
      i++
      str = this.rawText.substring(0, i)
      el.innerText = str + extra
      if (i >= this.rawText.length) {
        h = 1
        at = 0
      }
    }
    this.cliffText = str.substring(0, str.length - 1 - extra.length)
    el.innerText = str.substring(0, str.length - 2)
    this.minHeight = parseInt(getStyle(el).height || '')
  }
  private getHeight() {
    let style = getStyle(this.target)
    let width = style.width
    let el = this.tempElement
    el.style.width = width
    el.style.fontSize = style.fontSize
    el.style.lineHeight = style.lineHeight
    el.innerText = this.rawText + ((this.toggleVal && this.toggleVal[1]) || '')
    let height = parseInt(getStyle(el).height || '')
    this.maxHeight = height
    // 设置会初始
    this.setTempDiv()
  }
  // 克隆目标元素
  private setTempDiv() {
    let style = getStyle(this.target)
    if (!this.tempElement) {
      this.tempElement = this.target.cloneNode() as HTMLDivElement
      document.body.appendChild(this.tempElement)
    }
    // 添加到body 用于计算 宽高
    this.tempElement.style.width = style.width
    this.tempElement.style.lineHeight = style.lineHeight
    this.tempElement.style.height = 'auto'
    this.tempElement.style.fontSize = style.fontSize
    this.tempElement.innerHTML = ''
    this.tempElement.style.opacity = '0'
    this.tempElement.style.position = 'relative'
    this.tempElement.style.zIndex = '-99'
  }
}
export default Ellipsis
