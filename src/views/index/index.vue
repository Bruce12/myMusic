<template>
  <div class="page-container">
    <ExpandMore
      ellipsis="很第三方士大夫水电费撒旦法水电费水电费水电费水电费塑料袋房管局临时卡大姐夫水电费s很第三方士大夫水电费撒旦法水电费水电费水电费水电费塑料袋房管局临时卡大姐夫水电费s"
      :duration="300"
    />
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
import ExpandMore from '@/components/ExpandMore/index.vue'
import Popup from '@/components/Popup/index.vue'

@Component({
  name: 'Index',
  components: {
    ExpandMore,
    Popup
  }
})

export default class extends Vue {
  created() {
  }
}
</script>
<style lang="less">
  .page-container {
    margin: 50px 100px;
  }
</style>
