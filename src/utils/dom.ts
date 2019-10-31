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
export const eventOn = (element: HTMLElement, event:string, listener: EventListenerOrEventListenerObject) => {
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
export const eventOff = (el: HTMLElement, entName: string, handler?: any, option = false) => {
  if (el.removeEventListener) {
    el.removeEventListener(entName, handler, option)
  } else if ((el as any)['deattachEvent']) {
    (el as any)['deattachEvent']('on' + entName, handler)
  } else {
    (el as any)['on' + entName] = null
  }
  return null
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
      if (sty === 'relative') {
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
