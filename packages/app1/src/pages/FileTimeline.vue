<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline color="secondary">
      <q-timeline-entry heading>
          推荐的项目
      </q-timeline-entry>
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
    </q-timeline>
  </div>
</template>
  
<script>
import { user } from 'src/stores/user_logined';
import commit from '../model/commit';
import axios from 'axios';
const current_user = new user();

export default {
  data() {
    return {
      commits: [],
    };
  },
  methods: {
    fetchData() {
      let baseurl = 'http://127.0.1:9001/'

      axios({
        method: 'get',
        url: baseurl + "get_commits",
        params: {
          user_name : "all_commits"
        }
      }).then((res) => {
        // console.log(res);
        this.commits = res.data
      }).catch(error=>{
        console.log("请求失败：");
        console.log(error);
      })
    },
  },
  mounted:function(){
    if (current_user.search) {
      this.commits = current_user.index_main_commits;
      current_user.search = false;
    }
    else {
      this.fetchData();//需要触发的函数
    }
  }
};
</script>