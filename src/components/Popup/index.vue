<template>
  <div
    class="popup-box"
    @mouseleave.stop="mouseleave()"
    @mouseenter.stop="mouseenter()"
  >
    <span
      href="javascrpt:;"
    >{{ val }}</span>
    <div
      ref="myPopup"
      class="popup-content"
      :class="[show && 'my-popover']"
      :style="{left: left + 'px', top: top + 'px'}"
      @mouseenter="innerMouseenter()"
      @mouseleave="innerMouseleave()"
    >
      <ul>
        <li
          v-for="item in defaultOptions"
          :key="item"
        >
          <a
            href="javascript:;"
            @click.stop="handleAction(item)"
          >
            <img
              :src="config[item] && config[item].icon"
              alt=""
            ></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { getPosition, eventOn, eventOff } from '@/utils/dom'
@Component({
  name: 'Popup'
})
export default class extends Vue {
  @Prop({ default: '' }) private val!:string
  @Prop({ default: [] }) private options!: Array<string>
  @Prop({ default: {} }) private data!: any
  show: boolean = false
  left: number = 0
  top: number = 0
  currentTop: number = -1
  active: boolean = false
  defaultOptions: Array<string> = []
  endTimer: any = null
  startTimer: any = null
  animateEnd = false
  target: any = ''
  config = {
    phone: {
      icon: '//img.yimutian.com/crm/5d9ece6e2d211f714f09e01cdd37801c-60-60C.png'
    },
    user: {
      icon: '//img.yimutian.com/crm/5d9ecdae2d211f714f09df3483325490-60-60C.png'
    },
    archive: {
      icon: '//img.yimutian.com/crm/5d9ecdf82d211f714f09df790e7203dd-60-60C.png'
    },
    buyer: {
      icon: '//img.yimutian.com/crm/5d9ecc01b827736e3b09ec7653834283-60-60C.png'
    },
    wechat: {
      icon: '//img.yimutian.com/crm/5d9ece3d2d211f714f09dfe7fa8c57bd-60-60C.png'
    },
    truck: {
      icon: '//img.yimutian.com/crm/5d9ecee0b827736e3b09ee706cbe9f1c-60-60C.png'
    },
    yen: {
      icon: '//img.yimutian.com/crm/5d9ecf39b827736e3b09eece363dbd1c-60-60C.png'
    }
  }
  @Watch('data')
  private onDataChange() {
    // do someting
  }
  beforeDestroy() {
    console.log('销毁了')
    if (this.target) {
      eventOff(this.target, 'transitionend')
      document.body.removeChild(this.target)
    }
  }
  private showPopup() {
    clearTimeout(this.startTimer)
    clearTimeout(this.endTimer)
    this.startTimer = setTimeout(() => {
      this.active = true
      if (!this.show) {
        this.show = true
        this.top = this.top - 48
      } else {
        this.active = false
      }
    }, 500)
  }
  private mouseleave() {
    clearTimeout(this.startTimer)
    clearTimeout(this.endTimer)
    console.log('鼠标离开')
    this.endTimer = setTimeout(() => {
      this.show = false
      this.setPosition(20)
      this.active = false
    }, 500)
  }
  private innerMouseenter() {
    console.log('内部进入')
    clearTimeout(this.endTimer)
  }
  private innerMouseleave() {
    // 里面lave 隐藏
    console.log('内部离开了', this.active)
    if (!this.active) this.mouseleave()
  }
  private handleAction(evName: string) {
    if (!evName) {
      return null
    }
    const data = this.data
    const baseUrl = location.href.replace(location.hash, '')
    switch (evName) {
      case 'wechat':
        if (!data.id) return null
        window.open(`${baseUrl}#/relationship?userId1=${data.id}`)
        break
      // 认领
      case 'archive':
        if (!data.id) return null
        // api.saveTags([data.id])
        //   .then((res: any) => {
        //     this.$message({
        //       message: res.success ? '认领线索成功' : res.message,
        //       type: res.success ? 'success' : 'error'
        //     })
        //   })
        break
      case 'user':
        // uc?id=4544
        if (!data.id) return null
        window.open(`${baseUrl}#/uc?id=${data.id}`, '_blank')
        break
      case 'buyer':
        if (!data.id) return null
        window.open(`${baseUrl}#/buyerInfo?cId=${data.id}`, '_blank')
        break
      case 'truck':
        if (!data.id) return null
        window.open(`${baseUrl}#/supply/manage?id=${data.id}`, '_blank')
        break
      case 'phone':
        // 拨打电话
        break
      case 'yen':
        if (!data.id) return null
        window.open(`${baseUrl}#/trade/orderlist?id=${data.id}`)
        break
    }
  }
  private setPosition(y: number) {
    let dom = this.$el as HTMLElement
    const resDom = getPosition(dom, false)
    // 查找父亲元素的 position
    this.left = resDom.x
    this.top = resDom.y + y
  }
  private mouseenter() {
    if (this.active) return null
    this.showPopup()
  }
  created() {
    this.options.forEach((item: string, inx: number) => {
      if (!this.defaultOptions.includes(item)) {
        this.defaultOptions.push(item)
      }
    })
  }
  mounted() {
    this.target = this.$refs.myPopup as HTMLDivElement
    document.body.appendChild(this.target)
    this.setPosition(20)
    eventOn(this.target, 'transitionend', () => {
      console.log('动画结束了')
      this.active = false
    })
  }
}
</script>
<style lang="less">
  .popup-box {
    display: inline-block;
    > span {
      color: #3c8dbc;
      cursor: pointer;
    }
  }
  .popup-content {
    border-radius: 6px;
    position: absolute;
    top: 0px;
    transition: top .3s;
    z-index: -1;
    border-radius: 4px;
    box-shadow: 0 1px 2px #ddd;
    background: #fff;
    border: 1px solid #ddd;
    text-align: left;
    white-space: nowrap;
    font-size: 14px;
    line-height: 14px;
    padding-left: 2px;
    opacity: 0;
    > ul {
      margin: 0px;
      padding: 0px;
      li {
        list-style: none;
        text-align: center;
        padding: 4px;
        display: inline-block;
        margin-right: 2px;
        vertical-align: middle;
        cursor: pointer;
        >a {
          display: inline-block;
          > img {
            height: 18px;
            color: #3c8dbc;
          }
        }
      }
    }
  }
  .my-popover {
    opacity: 1 !important;
    z-index: 99999 !important;
  }
</style>
