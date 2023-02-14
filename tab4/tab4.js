import OPTIONS from './options'
import SHARED from '../shared/shared'
import { isElement, getElement, getAllElements } from '../shared/utils'

// 第四版
class Tab4 extends HTMLElement {
  // 定義組件的初始狀態
  constructor(el, option) {
    super()
  }
  // 在組件被插入到文件中時會被呼叫
  connectedCallback() {
    this.t = {}
    // 按鈕
    this.t.tabs = []
    // 名字 配對用
    this.t.name = this.getAttribute('t4-name')
    // 內容
    this.t.tabPanels = []
    // 存放當前位置
    this.t.activeTab = 0

    // 防呆
    if (!this.classList.contains('t4-initialize')) {
      this.#create()
    }
  }
  // 當組件的屬性被更改時會被呼叫
  // attributeChangedCallback(){}
  // static get observedAttributes() {}

  #create() {
    // 抓值
    this.t.tabPanels = Array.from(this.querySelectorAll('[t4-role="tabPanel"]'))
    const { SETTINGS } = OPTIONS
    // 基本設定 + 判斷
    this.t.stepOutput = SETTINGS.stepOutput
    this.t.type = this.getAttribute('t4-type') ?? SETTINGS.type
    this.t.display = this.getAttribute('t4-display') ?? SETTINGS.display
    this.t.defaultPage = parseInt(this.getAttribute('t4-defaultPage') ?? SETTINGS.defaultPage, 10)
    // 錨點設定
    this.t.anchor = this.getAttribute('t4-anchor')
    this.t.gap = this.getAttribute('t4-gap') ?? SETTINGS.anchorGap
    // 動畫設定
    this.t.transition = {}
    this.t.transition.duration = this.getAttribute('t4-duration') ?? SETTINGS.transition.duration
    this.t.transition.function = this.getAttribute('t4-function') ?? SETTINGS.transition.function
    this.t.transition.delay = this.getAttribute('t4-delay') ?? SETTINGS.transition.delay
    // 結構外
    this.t.tabs = Array.from(document.querySelectorAll(`[t4-control="${this.t.name}"] [t4-role="tab"]`))
    this.t.next = document.querySelector(`[t4-role="next"][t4-control="${this.t.name}"]`)
    this.t.prev = document.querySelector(`[t4-role="prev"][t4-control="${this.t.name}"]`)
    this.t.step = document.querySelector(`${this.t.stepOutput}[t4-control="${this.t.name}"]`)
    this.#init()
  }
  // 初始化設定
  #init() {
    // 設定預設頁面
    if (this.t.defaultPage > this.t.tabPanels.length) {
      this.t.defaultPage = 0
      console.log('預設數字太大囉~~')
    } else {
      this.setActiveTab(this.t.defaultPage)
    }
    // 寫入步驟數
    this.#isTrue('step', this.t.activeTab)
    // 設定防呆
    if (this.t.type != 'process') {
      if (this.t.tabPanels.length != this.t.tabs.length) {
        console.log('按鈕數量與內容不一樣喔!!!!')
      } else {
        this.classList.add('t4-initialize')
        this.#event()
      }
    } else {
      this.classList.add('t4-initialize')
      this.#event()
    }
    console.log(this)
  }
  // 步驟狀態
  #step(page) {
    let current = page + 1
    this.t.step.textContent = `${current}`
    this.t.step.setAttribute('now-page', current)
  }
  // 按鈕狀態
  #btnState() {
    if (this.t.tabPanels.length == 1) {
      this.t.next.setAttribute('disabled', '')
      this.t.prev.setAttribute('disabled', '')
    } else {
      if (this.t.activeTab == this.t.tabPanels.length - 1) {
        this.t.next.setAttribute('disabled', '')
        this.t.prev.removeAttribute('disabled')
      } else if (this.t.activeTab == 0) {
        this.t.prev.setAttribute('disabled', '')
        this.t.next.removeAttribute('disabled')
      } else {
        this.t.next.removeAttribute('disabled')
        this.t.prev.removeAttribute('disabled')
      }
    }
  }
  // 動畫設定
  // 消失動畫
  #animationHide(index) {
    // 動畫 消失 動畫 出現 搭配 settimeout 使用
    this.t.tabPanels[index].classList.add('hide')
    switch (this.t.display) {
      case 'fade':
        this.t.tabPanels[index].style['display'] = 'none'
        this.t.tabPanels[index].style['opacity'] = '0'
        break
      case 'slide':
        this.t.tabPanels[index].style['display'] = 'none'
        this.t.tabPanels[index].style['opacity'] = '0'
        this.t.tabPanels[index].style['max-height'] = 'unset'
        break
      case 'slide-swiper':
        this.t.tabPanels[index].style['display'] = 'none'
        break
      default:
        this.t.tabPanels[index].style['display'] = 'none'
        break
    }
    // this.t.tabPanels[el].hidden = true
  }
  // 出現動畫
  #animationShow(index) {
    this.t.tabPanels[index].classList.remove('hide')
    this.t.tabPanels[index].style['transition-duration'] = this.t.transition.duration
    this.t.tabPanels[index].style['transition-timing-function'] = this.t.transition.function
    this.t.tabPanels[index].style['transition-delay'] = this.t.transition.delay
    switch (this.t.display) {
      case 'fade':
        this.t.tabPanels[index].style['display'] = 'block'
        this.t.tabPanels[index].style['opacity'] = '0'
        let timer = setTimeout(() => {
          clearInterval(timer)
          this.t.tabPanels[index].style['opacity'] = '1'
        }, 100)
        break
      case 'slide':
        this.t.tabPanels[index].style['display'] = 'block'
        const clientHeight = this.t.tabPanels[index].offsetHeight
        this.t.tabPanels[index].style['opacity'] = '1'
        this.t.tabPanels[index].style['max-height'] = '0'
        timer = setTimeout(() => {
          clearInterval(timer)
          this.t.tabPanels[index].style['max-height'] = clientHeight + 'px'
        }, 100)
        break
      case 'slide-swiper':
        this.t.tabPanels[index].style['display'] = 'block'
        console.log(this.t.display, '還沒做好啦!!!!')
        break
      default:
        this.t.tabPanels[index].style['display'] = 'block'
        console.log(this.t.display, '沒有這個效果請自己想辦法!!!!')
        break
    }
    // this.t.tabPanels[el].hidden = false
    // 動畫 消失 動畫 出現 搭配 settimeout 使用
  }
  // 移動至指定位置
  #eventAnchor() {
    const gap = parseInt(this.t.gap, 10)
    const pageYOffset = window.pageYOffset
    const targetOffset = this.getBoundingClientRect().top
    const change = targetOffset + pageYOffset - gap
    this.#goAnchor(change)
  }
  // 移動
  #goAnchor(val) {
    window.scrollTo({
      top: val,
      behavior: 'smooth',
    })
  }
  // 事件綁定
  #event() {
    this.t.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.setActiveTab(index)
        this.#isTrue('eventAnchor')
      })
    })
    // Next按鈕
    this.#isTrue('eventNext')
    // Prev按鈕
    this.#isTrue('eventPrev')
  }
  // 判斷元件並執行
  #isTrue(fun, val) {
    switch (fun) {
      case 'step':
        if (isElement(this.t.step)) {
          this.#step(val)
        }
        break
      case 'eventAnchor':
        if (this.t.anchor) {
          this.#eventAnchor(val)
        }
        break
      case 'btnState':
        if (isElement(this.t.next) || isElement(this.t.prev)) {
          this.#btnState(val)
        }
        break
      case 'eventNext':
        if (isElement(this.t.next)) {
          this.t.next.addEventListener('click', () => {
            this.goNext()
          })
        }
        break
      case 'eventPrev':
        if (isElement(this.t.prev)) {
          this.t.prev.addEventListener('click', () => {
            this.goPrev()
          })
        }
        break
      default:
        console.log('請增加判斷，謝謝')
        break
    }
  }
  //  ------------- 我是分隔線呦 -------------
  // 頁籤切換
  // 外部呼叫方法 $0.setActiveTab(0)
  setActiveTab(index) {
    // 內容狀態
    this.t.tabPanels.forEach((panel, i) => {
      if (i === index) {
        this.#animationShow(i)
      } else {
        this.#animationHide(i)
      }
    })
    if (this.t.type != 'process') {
      // 頁籤按鈕狀態
      this.t.tabs.forEach((tab, i) => {
        if (i === index) {
          tab.setAttribute('aria-selected', true)
        } else {
          tab.setAttribute('aria-selected', false)
        }
      })
    }
    this.t.activeTab = index
    this.#isTrue('step', index)
    this.#isTrue('btnState')
  }

  // 按鈕切換
  // 外部呼叫方法 $0.goNext()
  goNext() {
    this.t.activeTab =
      this.t.activeTab + 1 > this.t.tabPanels.length - 1 ? this.t.tabPanels.length - 1 : this.t.activeTab + 1
    this.setActiveTab(this.t.activeTab)
    this.#btnState()
  }
  // 外部呼叫方法 $0.goPrev()
  goPrev() {
    this.t.activeTab = this.t.activeTab - 1 < 0 ? 0 : this.t.activeTab - 1
    this.setActiveTab(this.t.activeTab)
    this.#btnState()
  }
}

Object.assign(Tab4.prototype, SHARED)

if (!customElements.get('tab-el')) {
  customElements.define('tab-el', Tab4)
}

export default Tab4
