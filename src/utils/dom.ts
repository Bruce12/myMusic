export const isElement = (el:HTMLElement) => Boolean(el && el.nodeType === Node.ELEMENT_NODE)

// Add a class to an element
export const addClass = (el: HTMLElement, className: string) => {
  if (className && isElement(el) && el.classList) {
    el.classList.add(className)
  }
}

// Remove a class from an element
export const removeClass = (el: HTMLElement, className: string) => {
  if (className && isElement(el) && el.classList) {
    el.classList.remove(className)
  }
}
//
export const hasClass = (el: HTMLElement, className: string) => {
  if (className && isElement(el) && el.classList) {
    return el.classList.contains(className)
  }
  return false
}

// 设置属性值
export const setAttr = (el: HTMLElement, attr: string, value: string) => {
  if (attr && isElement(el)) {
    el.setAttribute(attr, value)
  }
}
// 删除属性
export const removeAttr = (el: HTMLElement, attr: string) => {
  if (attr && isElement(el)) {
    el.removeAttribute(attr)
  }
}
// 获取属性值
export const getAttr = (el: HTMLElement, attr: string) => {
  if (attr && isElement(el)) {
    return el.getAttribute(attr)
  }
}
export const find = (tag: string) => {
  return document.querySelectorAll(tag)
}
// 绑定事件
export const eventOn = (element: any, event:string, listener: EventListenerOrEventListenerObject) => {
  if (element.addEventListener) {
    element.addEventListener(event, listener, false)
  } else if ((element as any)['attachEvent']) {
    (element as any)['attachEvent']('on' + event, listener)
  } else {
    (element as any)['on' + event] = listener
  }
  return listener
}
// 移除事件
export const eventOff = (el: any, entName: string, handler?: any, option = false) => {
  if (el.removeEventListener) {
    el.removeEventListener(entName, handler, option)
  } else if ((el as any)['deattachEvent']) {
    (el as any)['deattachEvent']('on' + entName, handler)
  } else {
    (el as any)['on' + entName] = null
  }
}
// 获取元素下面所有子元素
export const findChildNodes = (el: HTMLElement) => {
  let nodes = el.childNodes
  let nodeArr = Array.from(nodes)
  let temp = []
  for (let i = 0; i < nodeArr.length; i++) {
    let nType = nodeArr[i].nodeType
    if (nType === 1) {
      temp.push(nodeArr[i])
    }
  }
  return temp
}
// 获取元素相对位置
export const getPosition = (el: HTMLElement, isRelative?: boolean) => {
  let x = 0
  let y = 0
  let node:any = el
  while (node != null && node.tagName !== 'BODY') {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
    if (isRelative) {
      const sty = node.currentStyle ? (node.currentStyle as any)['position'] : (getComputedStyle(node, null) as any)['position']
      if (sty === 'relative' || sty === 'absolute') {
        node = null
      }
    }
  }
  return { x, y }
}
// 获取鼠标坐标
export const getMousePostion = (el: HTMLElement) => {
  const e = window.event as MouseEvent
  return {
    x: document.documentElement.scrollLeft + e.clientX,
    y: document.documentElement.scrollTop + e.clientY
  }
}
// 获取某个元素父及元素 某个css属性值
export const existStyle = (el: HTMLElement, obj: { name: string, value: string }) => {
  let node:any = el
  let res = { resutl: false, el: null }
  while (node != null && node.tagName !== 'BODY') {
    let proName = getStyle(node, obj.name)
    if (proName === obj.value) {
      res.resutl = true
      res.el = node
      node = null
    }
    node = node && node.parentNode
  }
  return res
}
// 获取dom 元素样式
export const getStyle = (el: HTMLElement, attr?: any): any => {
  let getCss = getComputedStyle ? getComputedStyle(el, null) : (el as any).currentStyle
  return attr ? getCss[attr] : getCss
}
// 简单动画
export const animate = (el: HTMLDivElement, option: any, fn?: Function) => {
  // delay
  let delay = 0
  if (option.delay !== undefined) {
    delay = option.delay
    delete option.delay
  }
  clearTimeout((el as any).delayTimer)
  clearInterval((el as any).timer)
  ;(el as any).delayTimer = setTimeout(() => {
    (el as any).timer = setInterval(() => {
      // 属性当前值
      for (let key in option) {
        let attr = key
        let target = attr === 'opacity' ? option[key] * 100 : option[key]
        // 防止连续移入元素会生成多个计时器，所以进入之前先清除
        var icur = 0
        if (attr === 'opacity') {
        // 这里用Math.round()处理是防止出现数据在目标值附近抖动的情况，因为计算机对浮点数的计算存在误差
          icur = Math.round(parseFloat(getStyle(el, attr)) * 100)
        } else {
          icur = parseInt(getStyle(el, attr))
        }
        // 动画的速度
        var speed = (target - icur) / 10
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
        // 检测停止
        if (Number.isNaN(speed)) {
          clearInterval((el as any).timer)
        }
        if (icur === target) {
          delete option[key]
          if (JSON.stringify(option) === '{}') {
            clearInterval((el as any).timer)
            if (typeof fn === 'function') fn()
          }
        } else {
          if (attr === 'opacity') {
          // IE
            el.style.filter = 'alpha(opacity:' + (icur + speed) + ')'
            // 非IE
            el.style.opacity = String((icur + speed) / 100)
          } else {
            (el.style as any)[attr] = icur + speed + 'px'
          }
        }
      }
    }, 10)
  }, delay)
}
