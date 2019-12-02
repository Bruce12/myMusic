<template>
  <div
    v-if="show"
    ref="myPopupBox"
    :style="{width: shellWidth, height: shellHeight, left: shellLeft + 'px', top: shellTop + 'px', position: position, zIndex: zIndex}"
    class="component-popup-wrap"
    @mouseleave="mouseleave"
  >
    <div
      ref="myPopup"
      class="component-popup-wrap__content"
      :style="{top: (top - 30) + 'px', left: left + 'px', zIndex: zIndex}"
    >
      <ul>
        <li
          v-for="item in defaultOptions"
          :key="item"
        >
          <a
            v-if="config[item]"
            href="javascript:;"
            :title="config[item].text"
            @click.stop="handleAction(item)"
          >
            <i :class="['iconfont', config[item].icon]" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { getPosition, getStyle, animate } from '@/utils/dom'
// import api from '../api'
@Component({
  name: 'PopupUserBox',
  components: {
  }
})
export default class extends Vue {
  @Prop({ default: [] }) private options!: Array<string>
  @Prop({ default: {} }) private data!: any
  @Prop() private overwriteConf!: any
  @Prop({ default: 'absolute' }) private position!: string
  @Prop({ default: true, type: Boolean }) private show!: boolean
  @Prop({ default: false, type: Boolean }) private isShowTelephone!: boolean
  @Prop({ default: 9999 }) private zIndex!: number
  private left: number = 0
  private top: number = 0
  private shellWidth: number = 0
  private shellHeight: number = 0
  private shellTop: number= 0
  private shellLeft: number = 0
  private defaultOptions: Array<string> = ['phone', 'truck', 'user', 'wechat', 'archive', 'buyer', 'seller']
  private endTimer: any = null
  private target: any = ''
  private preventClick: boolean = true
  private startTimer: any = null
  private config = {
    phone: {
      icon: 'icon-phone',
      text: '打电话'
    },
    user: {
      icon: 'icon-user',
      text: '用户详细信息'
    },
    archive: {
      icon: 'icon-archive',
      text: '线索认领'
    },
    buyer: {
      icon: 'icon-buyer',
      text: '买家详情'
    },
    wechat: {
      icon: 'icon-wechat',
      text: '微信'
    },
    truck: {
      icon: 'icon-truck',
      text: '物流'
    },
    yen: {
      icon: 'icon-yen',
      text: '线索交易订单'
    },
    seller: {
      icon: 'icon-seller',
      text: '卖家详情'
    },
    email: {
      icon: 'icon-email',
      text: '邮箱'
    }
  }
  @Watch('$route')
  private onRoute(val: any) {
    this.mouseleave()
  }
  @Watch('position')
  private onPositionChange(val: string) {
    if (val) this.$emit('update:position', val)
  }
  mounted() {
    this.$nextTick(() => {
      this.target = this.$refs.myPopup as HTMLDivElement
      document.body.appendChild(this.$refs.myPopupBox as HTMLElement)
    })
  }
  created() {
    this.init()
    this.singleton()
  }
  destroyed() {
    if (this.show) {
      this.$emit('update:show', false)
    }
  }
  //
  private init() {
    const overwriteConf = this.overwriteConf
    if (!overwriteConf || !overwriteConf.length) {
      this.options.forEach((item: string, inx: number) => {
        if (!this.defaultOptions.includes(item)) {
          this.defaultOptions.push(item)
        }
      })
    } else {
      this.defaultOptions = this.overwriteConf
    }
  }
  private mouseleave() {
    clearTimeout(this.startTimer)
    setTimeout(() => {
      this.$emit('update:show', false)
      this.preventClick = true
    }, 500)
  }
  private handleAction(evName: string) {
    if (!evName || this.preventClick) {
      return null
    }
    const data = this.data
    const baseUrl = location.href.replace(location.hash, '')
    switch (evName) {
      case 'wechat':
        if (!data.id) return null
        this.$router.push({ name: 'relationship', query: { userId1: data.id } })
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
        if (!data.id) return null
        // this.$router.push({ name: 'uc', query: { id: data.id } })
        window.open(`${baseUrl}#/uc?id=${data.id}`, '_blank')
        break
      case 'buyer':
        if (!data.id) return null
        // this.$router.push({ name: 'buyerInfo', query: { cId: data.id } })
        window.open(`${baseUrl}#/buyerInfo?cId=${data.id}`, '_blank')
        break
      case 'truck':
        if (!data.id) return null
        // this.$router.push({ name: 'supplyManage', query: { id: data.id1 } })
        window.open(`${baseUrl}#/supply/manage?id=${data.id}`, '_blank')
        break
      case 'phone':
        // 拨打电话
        if (!this.isShowTelephone) this.$emit('update:isShowTelephone', true)
        break
      case 'yen':
        if (!data.id) return null
        // this.$router.push({ name: 'tradeManage', query: { id: data.id } })
        window.open(`${baseUrl}#/trade/orderlist?id=${data.id}`)
        break
      case 'seller':
        if (!data.id) return null
        // this.$router.push({ name: 'seller_info', query: { cId: data.id } })
        window.open(`${baseUrl}#/seller_info?cId=${data.id}`)
        break
    }
  }
  private setPosition(el: HTMLDivElement, position: string) {
    let resDom = { x: 0, y: 0 }
    if (position === 'fixed') {
      resDom.x = el.getBoundingClientRect().left
      resDom.y = el.getBoundingClientRect().top
    } else {
      resDom = getPosition(el)
    }
    // 查找父亲元素的 position
    this.top = 20
    this.shellWidth = getStyle(el, 'width')
    this.shellHeight = getStyle(el, 'height')
    this.shellTop = resDom.y
    this.shellLeft = resDom.x
    ;(this.$el as HTMLDivElement).style.display = 'block'
    this.startTimer = setTimeout(() => {
      animate(this.target, { opacity: 1, top: this.top - 50 }, () => {
        this.preventClick = false
      })
    }, 900)
  }
  // 单例模式
  private singleton() {
    this.$root.$emit('oncePopup', this)
    const oncePopup = (page: any) => {
      this.$root.$off('oncePopup', oncePopup)
      if (page !== this) {
        this.$emit('update:show', false)
      }
    }
    this.$root.$on('oncePopup', oncePopup)
  }
}
</script>
<style lang="less" scoped>
.component-popup-wrap {
  position: absolute;
  top: 0px;
  display: none;
  cursor: pointer;
  &__content {
    border-radius: 6px;
    position: absolute;
    top: 0px;
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
        padding: 8px 4px;
        display: inline-block;
        margin-right: 2px;
        vertical-align: middle;
        cursor: pointer;
        >a {
          display: inline-block;
          > i {
            color: #3c8dbc;
            vertical-align: bottom;
          }
        }
      }
    }
  }
}
@font-face {font-family: "iconfont";
  src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2')
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 18px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-archive:before {
  content: "\e9d6";
}
.icon-wechat:before {
  content: "\e640";
}

.icon-truck:before {
  content: "\e728";
}

.icon-yen:before {
  content: "\e743";
}

.icon-email:before {
  content: "\e7a1";
}

.icon-buyer:before {
  content: "\e670";
}

.icon-user:before {
  content: "\e755";
}

.icon-phone:before {
  content: "\e623";
}
.icon-seller:before {
  content: "\e62c";
}
</style>
