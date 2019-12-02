<template>
  <div
    ref="expandBody"
    class="expand-wrap"
    :style="{height: height, transition: 'height ' + _duration + 's'}"
  >
    {{ text }}
    <a
      v-if="show"
      href="javascript:;"
      class="expand-wrap__btn"
      @click="toggle()"
    >{{ expandText }}</a>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { addClass, getStyle, eventOn, eventOff } from '@/utils/dom'
import Ellipsis from './ellipsis'
@Component({
  name: 'ExpandText'
})
export default class extends Vue {
  // 要截取的行数
  @Prop({ default: 2 }) private lineClamp!: number
  @Prop({ default: '' }) private ellipsis!: string
  // 持续的时间
  @Prop({ default: 300 }) private duration!: number
  private isExpand: boolean = false
  private expandText: string = '...'
  private toggleVal: Array<string> = ['...', '收起']
  private hideExpand: boolean = true
  private height: string = 'auto'
  private maxHeight!: number
  private minHeight!: number
  private show: boolean = true
  private text: string = this.ellipsis
  private ellippsisText = ''
  private eps!: any
  private timer!: any
  created() {
    this.eps = new Ellipsis(this.ellipsis, this.lineClamp, this.toggleVal)
    this.init()
  }
  mounted() {
    this.$nextTick(() => {
      eventOn(window, 'resize', this.onResize)
    })
  }
  destroyed() {
    eventOff(window, 'resize', this.onResize)
  }
  get _duration() {
    return (this.duration || 300) / 1000
  }
  private onResize() {
    clearTimeout(this.timer)
    this.expandText = this.toggleVal[0]
    this.isExpand = false
    this.height = this.minHeight + 'px'
    this.timer = setTimeout(() => {
      this.init()
    }, 200)
  }
  private init() {
    this.$nextTick(() => {
      let elTarget = this.$refs.expandBody as HTMLElement
      let resData = this.eps.cliff(elTarget)
      this.ellippsisText = resData.ellipsis
      this.height = resData.minHeight + 'px'
      if (!resData.isCliff) {
        this.ellippsisText = this.ellipsis
      }
      // console.log(resData)
      this.text = this.ellippsisText
      this.minHeight = resData.minHeight
      this.maxHeight = resData.maxHeight
      this.show = resData.isCliff
    })
  }
  // 内容展开收起
  private toggle() {
    this.isExpand = !this.isExpand
    if (this.isExpand) {
      this.text = this.ellipsis
      this.expandText = this.toggleVal[1]
      this.height = this.maxHeight + 'px'
    } else {
      this.height = this.minHeight + 'px'
      setTimeout(() => {
        this.text = this.ellippsisText
        this.expandText = this.toggleVal[0]
      }, this.duration)
    }
  }
}
</script>
<style lang="less" scoped>
  .expand-wrap {
      word-break: break-all;
      word-wrap: break-word;
      display: inline-block;
      overflow: hidden;
      &__btn {
          color: #3c8dbc;
          cursor: pointer;
          font-size: 12px;
      }
  }
</style>
