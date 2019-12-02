<template>
  <div
    class="popup-box"
    @mouseenter="mouseenter($event)"
  >
    <Popup
      v-if="show"
      ref="popup"
      :data="data"
      :options="options"
      :overwrite-conf="overwriteConf"
      :show.sync="show"
      :position.sync="position"
      :is-show-telephone.sync="isShowTelephone"
      :z-index="zIndex"
    />
    <span>
      <template v-if="val">{{ val }}</template>
      <template v-else><slot /></template>
    </span>
    <!-- <TelephonePane
      v-if="isShowTelephone"
      :z-index="zIndex"
      :is-show-pane.sync="isShowTelephone"
      :cid="data.id"
    /> -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { getPosition, existStyle } from '@/utils/dom'
import Popup from './components/Popup.vue'
// import TelephonePane from '@/components/TelephonePane/index.vue'
@Component({
  name: 'aa',
  components: {
    Popup
    // TelephonePane
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private val!:string
  @Prop({ default: [] }) private options!: Array<string>
  @Prop({ default: {} }) private data!: any
  @Prop() private overwriteConf!: any
  private $popup: any = null
  private show: boolean = false
  private timer: any = null
  private position:string = 'absolute'
  private isShowTelephone: boolean = false
  private zIndex: number = 9999
  private mouseenter(el: Event) {
    this.show = true
    this.$nextTick(() => {
      const res = existStyle(this.$el as HTMLElement, { name: 'position', value: 'fixed' })
      if (res.resutl) {
        this.position = 'fixed'
      }
      this.$popup = this.$refs.popup as Popup
      if (!this.$popup) return
      this.$popup.setPosition(el.target as HTMLDivElement, this.position)
    })
  }
}
</script>
<style lang="less" scoped>
  .popup-box {
    display: inline-block;
    > span {
       color: #3c8dbc;
    }
  }
</style>
