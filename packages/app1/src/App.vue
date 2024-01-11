<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import api from './boot/axios'

export default defineComponent({
  name: 'App'
})

api.get('http://localhost:8080/json/users/me').then((res) => {
  console.log(res.data)
})
</script>
