<template>
  <div id="app">
    <top></top>

    <index></index>   
  </div>
</template>

<script>
import Index from './components/index.vue'
import Top from './components/top.vue'


export default {
  name: 'App',
  components: {
    Index,
    Top,

  }

}
</script>

<style>

</style>
