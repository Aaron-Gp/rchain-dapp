<template>
    <div class="q-pa-md" style="max-width: 350px">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>对比提交的先后</q-toolbar-title>
      </q-toolbar>
      <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onCompare"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="commit1"
        label="提交1的id"
        hint="Name and surname"
        lazy-rules
      />

      <q-input
        filled
        v-model="commit2"
        label="提交2的id"
        lazy-rules
      />
    <q-card class="my-card">
      <q-card-section class="bg-grey-8 text-white">
        <div class="text-h6">{{ earlier_commit_id }}的提交更早</div>
      </q-card-section>
    </q-card>
      <div>
        <q-btn label="Compare" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
  
    </div>
  
  </template>
  
<script>
import axios from 'axios';
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar();
    const commit1_id = ref(null);
    const commit2_id = ref(null);
    const commit1 = ref(null);
    const commit2 = ref(null);
    const commits = ref([]);
    const earlier_commit_id = ref(0);

    return {
      earlier_commit_id,
      commits,
      commit1,
      commit2,
      commit1_id,
      commit2_id,

      onCompare () {
        let baseurl = 'http://127.0.1:9001/'
        let that = this;

        axios({
          method: 'get',
          url: baseurl + "get_commits",
          params: {
            user_name: "all_commits"
          }
        }).then((res) => {
          that.commits = res.data;
          console.log(that.commits);
          var ansArr = that.commits.filter(function (item) {
            // 这个是按照提交的名字来检索
            return item.id.isArray(that.commit1_id), item.id.isArray(that.commit2_id);
            // return item.id.includes(commit1_id, commit2_id);
          });
          that.commit1, that.commit2 = ansArr;
          console.log(ansArr);
          if (that.commit1.time < that.commit2.time) {
            that.earlier_commit_id = that.commit1_id; 
          } 
          else {
            that.earlier_commit_id = that.commit2_id; 
          }
        }).catch(error => {
          console.log("请求失败：");
          console.log(error);
        })
      },

      onReset () {
        commit1.value = null;
        commit2.value = null;
      }
    }
  }
}
</script>
  <!-- <script setup>
  import { useCounterStore } from 'stores/example-store'
  import { useCounterStore2 } from 'stores/example-store copy'
  
  const store = useCounterStore()
  const store2 = useCounterStore2()
  </script> -->
  
  
  
  
  