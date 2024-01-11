<template>
  <div class="q-pa-md doc-container">
    <div class="column items-center" style="height: 150px">
      <q-timeline-entry v-for="(entry, index) in commits" :key="index" >
      
        <div>
          提交名称：<router-link to="/look_single">{{entry.name}}</router-link>
        </div>
        <div>
          提交时间：{{entry.time}}
        </div>
        <div>
          提交说明：{{entry.note}}
        </div>
        <div>
          提交id：{{entry.id}}
        </div>
        <div>
          提交人：{{entry.committer}}
        </div>
        <div>
          提交标签：{{entry.tag}}
        </div>
      </q-timeline-entry>
    </div>
  </div>

</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'look_single'
})
</script>