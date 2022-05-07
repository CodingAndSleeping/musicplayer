<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card" v-if="titleList.hasOwnProperty('coverImgUrl')">
      <div class="icon-wrap">
        <img :src="`${titleList.coverImgUrl}?param=150y150`"  alt="图片" />
      </div>
      <div class="content-wrap">
        <div class="tag" @click="toPlayList(titleList.id)">精品歌单</div>
        <div class="title">
          {{ titleList.name }}
        </div>
        <div class="info">
          {{ titleList.description }}
        </div>
      </div>
      <img :src="`${titleList.coverImgUrl}?param=50y50`" alt="图片" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span
          class="item"
          :class="{ active: nowTagName == '全部' }"
          :key="0"
          @click="changeTags('全部')"
          >全部</span
        >
        <span
          class="item"
          :class="{ active: nowTagName == tag.name }"
          :key="tag.id"
          v-for="tag in tags"
          @click="changeTags(tag.name)"
          >{{ tag.name }}</span
        >
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div
            class="item"
            :key="playList.id"
            v-for="playList in playLists"
            @click="toPlayList(playList.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ playList.playCount }}</span>
              </div>
              <img :src="`${playList.coverImgUrl}?param=200y200`" alt="图片" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ playList.description }}</p>
          </div>
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
      :page-size="50"
    >
    </el-pagination>
  </div>
</template>

<script>
import MyAxios from "@/utils/requests";
export default {
  name: "recommends",
  data() {
    return {
      titleList: {},
      nowTagName: "全部",
      tags: [],
      playLists: [],
      // 总条数
      total: 0,
      // 页码
      page: 1,
      limit:50
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      // console.log(`当前页: ${val}`);
      MyAxios({
        url: "/top/playlist",
        method: "get",
        params: {
          cat: this.nowTagName != "全部" ? this.nowTagName : "",
          offset: (val - 1) * this.limit,
        },
      }).then(
        (res) => {
          // console.log(res.data);
          // this.titleList = res.data.playlists[0];
          this.playLists = res.data.playlists;
          // this.total = res.data.total;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    changeTags(cat) {
      this.page=1;
      this.nowTagName = cat;
      MyAxios({
        url:"/top/playlist",
        method:"get",
        params:{
          cat
        }
      }).then(
      (res) => {
        // console.log(res.data);
        this.titleList = res.data.playlists[0];
        this.playLists = res.data.playlists;
        this.total = res.data.total;
      },
      (error) => {
        console.log(error.message);
      }
    );

    },

    toPlayList(id) {
      this.$router.push({
        name: "playlist",
        query: {
          id,
        },
      });
    },
  },


  created() {
    //请求tags
    MyAxios({
      url: "/playlist/hot",
      method: "get",
    }).then(
      (res) => {
        // console.log(res.data);
        this.tags = res.data.tags;
      },
      (error) => {
        console.log(error.message);
      }
    );

    //请求全部歌单
    MyAxios({
      url: "/top/playlist",
      method: "get"
    }).then(
      (res) => {
        // console.log(res.data);
        this.titleList = res.data.playlists[0];
        this.playLists = res.data.playlists;
        this.total = res.data.total;
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
