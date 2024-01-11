import { defineStore } from 'pinia';

export const user = defineStore('user', {
  state: () => ({
    user_name: 'user1',
    user_private: "这是私钥",
    user_public: "这是公钥",
    user_commit_num: 0,
    index_main_commits: "",
    search : false
  }),
  getters: {
  },
  actions: {
  },
});
