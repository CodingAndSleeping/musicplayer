<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span
        class="item"
        :class="{ active: nowTagNum == 0 }"
        @click="changeTags(0)"
        >全部</span
      >
      <span
        class="item"
        :class="{ active: nowTagNum == 7 }"
        @click="changeTags(7)"
        >华语</span
      >
      <span
        class="item"
        :class="{ active: nowTagNum == 96 }"
        @click="changeTags(96)"
        >欧美</span
      >
      <span
        class="item"
        :class="{ active: nowTagNum == 8 }"
        @click="changeTags(8)"
        >日本</span
      >
      <span
        class="item"
        :class="{ active: nowTagNum == 16 }"
        @click="changeTags(16)"
        >韩国</span
      >
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table" >
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" :key="song.id" v-for="(song, index) in songs">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap" @click="getMusicUrl(song)">
              <img :src="`${song.album.picUrl}?param=70y70`" alt="图片" />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <td style="text-align:center">
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ song.name }}</span>
                <span class="iconfont icon-mv"></span>
              </div>
              <span>{{ song.alias[0] }}</span>
            </div>
          </td>
          <td style="text-align:center">{{ song.artists | authors }}</td>
          <td style="text-align:center">{{ song.album.name }}</td>
          <td style="text-align:center">{{ song.duration | SongTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import MyAxios from "@/utils/requests";
export default {
  name: "songs",
  data() {
    return {
      nowTagNum: 0,
      songs: [],
    };
  },

  methods: {
    changeTags(type) {
      this.nowTagNum = type;
      MyAxios({
        url: "/top/song",
        method: "get",
        params:{
           type
        }
       
      }).then(
        (res) => {
          // console.log(res.data);
          this.songs = res.data.data;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    // 将音乐id发送给index组件
    getMusicUrl(song){
        // console.log(id)
        this.$bus.$emit("getMusicUrl",  song);
    },
  },

  created() {
    MyAxios({
      url: "/top/song",
      method: "get",
      type: this.nowTagNum,
    }).then(
      (res) => {
        // console.log(res.data);
        this.songs = res.data.data;
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
