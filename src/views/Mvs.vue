<template>
  <div class="mvs-container">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowArea == '全部' }"
              @click="changeArea('全部')"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowArea == '内地' }"
              @click="changeArea('内地')"
              >内地</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowArea == '港台' }"
              @click="changeArea('港台')"
              >港台</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowArea == '欧美' }"
              @click="changeArea('欧美')"
              >欧美</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowArea == '日本' }"
              @click="changeArea('日本')"
              >日本</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowArea == '韩国' }"
              @click="changeArea('韩国')"
              >韩国</span
            >
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowType == '全部' }"
              @click="changeType('全部')"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowType == '官方版' }"
              @click="changeType('官方版')"
              >官方版</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowType == '原声' }"
              @click="changeType('原声')"
              >原声</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowType == '现场版' }"
              @click="changeType('现场版')"
              >现场版</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowType == '网易出品' }"
              @click="changeType('网易出品')"
              >网易出品</span
            >
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowOrder == '上升最快' }"
              @click="changeOrder('上升最快')"
              >上升最快</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowOrder == '最热' }"
              @click="changeOrder('最热')"
              >最热</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: nowOrder == '最新' }"
              @click="changeOrder('最新')"
              >最新</span
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div class="item" :key="mv.id" v-for="mv in mvs" @click="toMv(mv.id)">
          <div class="img-wrap">
            <img :src="`${mv.cover}?param=200y120`" alt="视频" />
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ mv.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ mv.name }}</div>
            <div class="singer">{{ mv.artists | authors }}</div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="page"
        :page-size="12"
        :limit="limit"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import MyAxios from "@/utils/requests";
export default {
  name: "mvs",
  data() {
    return {
      nowArea: "全部",
      nowType: "全部",
      nowOrder: "上升最快",
      mvs: [],
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 12,
    };
  },
  methods: {
    toMv(id) {
      this.$router.push({
        name: "mv",
        params: {
          id,
        },
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      // console.log(`当前页: ${val}`);
      MyAxios({
        url: "/mv/all",
        method: "get",
        params: {
          area: this.nowArea,
          type: this.nowType,
          order: this.nowOrder,
          limit: 12,
          offset: (val - 1) * this.limit,
        },
      }).then(
        (res) => {
          // console.log(res.data);
          this.mvs = res.data.data;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    changeArea(area) {
      this.page = 1;
      this.nowArea = area;
      MyAxios({
        url: "/mv/all",
        method: "get",
        params: {
          area,
          type: this.nowType,
          order: this.nowOrder,
          limit: 12,
        },
      }).then(
        (res) => {
          // console.log(res.data);
          this.mvs = res.data.data;
          this.total = res.data.count;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },
    changeType(type) {
      this.page = 1;
      this.nowType = type;
      MyAxios({
        url: "/mv/all",
        method: "get",
        params: {
          area: this.nowArea,
          type,
          order: this.nowOrder,
          limit: 12,
        },
      }).then(
        (res) => {
          // console.log(res.data);
          this.mvs = res.data.data;
          this.total = res.data.count;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },
    changeOrder(order) {
      this.page = 1;
      this.nowOrder = order;
      MyAxios({
        url: "/mv/all",
        method: "get",
        params: {
          area: this.nowArea,
          type: this.nowType,
          order,
          limit: 12,
        },
      }).then(
        (res) => {
          // console.log(res.data);
          this.mvs = res.data.data;
          this.total = res.data.count;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },
  },

  created() {
    MyAxios({
      url: "/mv/all",
      method: "get",
      params: {
        area: this.nowArea,
        type: this.nowType,
        order: this.nowOrder,
        limit: 12,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.mvs = res.data.data;
        this.total = res.data.count;
      },
      (error) => {
        console.log(error.message);
      }
    );
  },
};
</script>

<style >
</style>
