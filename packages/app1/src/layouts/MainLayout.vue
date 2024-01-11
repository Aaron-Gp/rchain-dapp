<template>
  <q-layout view="lHr Lpr fFr">

    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
          <q-toolbar-title>
            <router-link to="/">
                <q-avatar >
                  <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                </q-avatar>
            
            原创作品发布与验证平台
          </router-link>
          </q-toolbar-title>

        <label for="site-search">Search the commit:</label>
        <input type="search" id="site-search" name="q" v-model="searchQuery"/>
          <router-link to="/">
            <q-btn  color="green" @click="fetchData">
              Search
            </q-btn>
          </router-link>

        <div class="q-gutter-x-sm">
          
          <router-link to="/commit">
            <q-btn round>
              +
            </q-btn>
          </router-link>
        </div>

        <router-link to="/user">
          <q-btn round>
          <!-- <q-btn round onclick='location.href=("./CommitPage")'> -->
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar.png">
            </q-avatar>
          </q-btn>
        </router-link>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="mobile" elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style>
label {
  display: block;
  font:
    1rem 'Fira Sans',
    sans-serif;
}

input,
label {
  margin: 0.4rem 0;
}
</style>

<script>
import { ref } from 'vue';
import { user } from 'src/stores/user_logined';
import axios from 'axios';

const current_user = new user();

export default {
  setup() {
    const rightDrawerOpen = ref(false);
    const commits = ref([]);
    const searchQuery = ref('');

    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };

    const fetchData = () => {
      let baseurl = 'http://127.0.1:9001/';

      axios({
        method: 'get',
        url: baseurl + "all_commits",
        params: {
          user_name: "all_commits",
        },
      })
        .then((res) => {
          commits.value = res.data;
        })
        .catch((error) => {
          console.log('请求失败：');
          console.log(error);
        });

      var ansArr = commits.value.filter(function(item) {
        // 这个是按照提交的名字来检索
        return item.name.includes(searchQuery.value);
      });
      commits.value = ansArr;
      console.log(ansArr);
      current_user.index_main_commits = ansArr;
      current_user.search = true;
    };

    return {
      commits,
      searchQuery,
      rightDrawerOpen,
      toggleRightDrawer,
      fetchData,
    };
  },
};
</script>
