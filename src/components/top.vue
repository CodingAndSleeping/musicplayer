<template>
  <div class="top-container">
    <div class="left-box">
      <!-- <div class="icon-wrapper">
        <span class="iconfont icon-home" @click="toHome"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span>
      </div> -->
      <div class="history-wrapper">
        <span class="iconfont icon-arrow-lift" @click="back"></span>
        <span class="iconfont icon-arrow-right" @click="forward"></span>
      </div>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <input
          type="text"
          autocomplete="off"
          placeholder="搜索"
          class="el-input__inner"
          v-model="query"
          @keyup.enter="search"
        />
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "top",
  data() {
    return {
      query: "",
    };
  },
  methods: {
    back() {
      this.$router.back(); //后退
    },
    forward() {
      this.$router.forward(); //前进
    },

    search() {
      if (this.$route.params.query != this.query && this.query!="") {
        this.$router.push({
          name: "result",
          params: {
            query: this.query,
          },
        })
      }
    },

    toHome() {
      if (this.$route.name == "discovery") return;
      this.$router.push("/");
    },
  }
};
</script>

<style scoped></style>
