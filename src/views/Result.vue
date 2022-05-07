<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{query}}</h2>
      <span class="sub-title">找到{{ totalNum }}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              :key="song.id"
              v-for="(song, index) in songs"
            >
              <td>{{ index + 1 }}</td>
              <td @dblclick="getMusicUrl(song)">
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ song.name }}</span>
                    <span class="iconfont icon-mv"></span>
                  </div>
                  <span>{{ song.alia[0] }}</span>
                </div>
              </td>
              <td>{{ song.ar | authors }}</td>
              <td>{{ song.al.name }}</td>
              <td>{{ song.dt | SongTime }}</td>
            </tr>
          </tbody>
        </table>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="songTotal"
          :current-page="songPage"
          :page-size="30"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
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
              <img
                :src="`${playList.coverImgUrl}?param=200y120`"
                height="120px"
                alt="图片"
              />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ playList.name }}</p>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="listTotal"
          :current-page="listPage"
          :page-size="30"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" :key="mv.id" v-for="mv in mvs" @click="toMv(mv.id)">
            <div class="img-wrap">
              <img :src="`${mv.cover}?param=200y120`" alt="视频"/>
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ mv.playCount }}</div>
              </div>
              <span class="time">{{ mv.duration | SongTime }}</span>
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
          :total="mvTotal"
          :current-page="mvPage"
          :page-size="24"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MyAxios from "@/utils/requests";
export default {
  name: "result",
  data() {
    return {
      activeIndex: "songs",
      query: this.$route.params.query,
      songs: [],
      playLists: [],
      mvs: [],

      songTotal: 0,
      songPage: 1,

      listTotal: 0,
      listPage: 1,

      mvTotal: 0,
      mvPage: 1,
    };
  },

  methods: {
    handleCurrentChange(val) {
      switch (this.activeIndex) {
        case "songs":
          MyAxios({
            url: "/cloudsearch",
            method: "get",
            params: {
              keywords: this.query,
              type: 1,
              offset: (val - 1) * 30,
            },
          }).then(
            (res) => {
              // console.log(res.data);
              this.songs = res.data.result.songs;
            },
            (error) => {
              console.log(error.message);
            }
          );
          break;
        case "lists":
          MyAxios({
            url: "/cloudsearch",
            method: "get",
            params: {
              keywords: this.query,
              type: 1000,
              offset: (val - 1) * 30,
            },
          }).then(
            (res) => {
              // console.log(res.data);
              this.playLists = res.data.result.playlists;
            },
            (error) => {
              console.log(error.message);
            }
          );
          break;
        case "mv":
          MyAxios({
            url: "/cloudsearch",
            method: "get",
            params: {
              keywords: this.query,
              type: 1004,
              offset: (val - 1) * 24,
              limit: 24,
            },
          }).then(
            (res) => {
              // console.log(res.data);
              this.mvs = res.data.result.mvs;
            },
            (error) => {
              console.log(error.message);
            }
          );
          break;
      }
    },

    // 将音乐id发送给index组件
    getMusicUrl(song) {
      // console.log(id)
      this.$bus.$emit("getMusicUrl", song);
    },

    toPlayList(id) {
      this.$router.push({
        name: "playlist",
        query: {
          id,
        },
      });
    },

    toMv(id) {
      this.$router.push({
        name: "mv",
        params: {
          id,
        },
      });
    },
  },

  computed: {
    totalNum() {
      return this.songTotal + this.listTotal + this.mvTotal;
    },
  },

  created() {
    MyAxios({
      url: "/cloudsearch",
      method: "get",
      params: {
        keywords: this.query,
        type: 1,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.songs = res.data.result.songs;
        this.songTotal = res.data.result.songCount;
      },
      (error) => {
        console.log(error.message);
      }
    );

    MyAxios({
      url: "/cloudsearch",
      method: "get",
      params: {
        keywords: this.query,
        type: 1000,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.playLists = res.data.result.playlists;
        this.listTotal = res.data.result.playlistCount;
      },
      (error) => {
        console.log(error.message);
      }
    );

    MyAxios({
      url: "/cloudsearch",
      method: "get",
      params: {
        keywords: this.query,
        type: 1004,
        limit: 24,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.mvs = res.data.result.mvs;
        this.mvTotal = res.data.result.mvCount;
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
