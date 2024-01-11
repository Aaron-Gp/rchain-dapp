<template>
  <div class="q-pa-md">

    <div class="row">
      <div class="col-3">
        <div class="q-pa-md">
          <MyHistoryFile></MyHistoryFile>
        </div>
      </div>
      <div class="col-6">
        <div class="q-pa-md">
          <FileTimeline></FileTimeline>
        </div>
      </div>
      <div class="col-3"><Compare></Compare></div>
    </div>

  </div>
</template>

<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  background: rgba(86,61,124,.15)
  border: 1px solid rgba(86,61,124,.2)
.row + .row
  margin-top: 1rem
</style>

<script>
import { defineComponent } from 'vue'
import MyHistoryFile from "./MyHistoryFile.vue";
import FileTimeline from "./FileTimeline.vue";
import Compare from "./CompareCommit.vue";
export default defineComponent({
  name: 'IndexPage',
  components: {
    MyHistoryFile: MyHistoryFile,
    FileTimeline: FileTimeline,
    Compare: Compare,
  },
})
</script>