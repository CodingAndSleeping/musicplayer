<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <el-carousel-item :key="index" v-for="(banner, index) in banners">
        <img
          :src="banner.imageUrl"
          :alt="banner.typeTitle"
        />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div class="item" :key="music.id" v-for="music in recommendMusics">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ music.name }}</span>
            </div>
            <img :src="`${music.picUrl}?param=200y200`" alt="图片" />
            <router-link :to="{
              path:'/playlist',
              query:{
                id:music.id
              }
            }">
              <span class="iconfont icon-play"></span>
            </router-link>
            
          </div>
          <p class="name">{{ music.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div class="item" :key="newAlbum.id" v-for="newAlbum in newAlbums">
          <div class="img-wrap">
            <img :src="`${newAlbum.picUrl}?param=200y200`" alt="图片"/>
            <span class="iconfont icon-play" @click="toAlbum(newAlbum.id)"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{newAlbum.name}}</div>
            <div class="singer">{{newAlbum.artist.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" :key="mv.id" v-for="mv in mvs">
          <div class="img-wrap" @click="toMv(mv.id)">
            <img :src="`${mv.cover}?param=200y200`" alt="视频" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{mv.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{mv.name}}</div>
            <div class="singer">{{mv.artistName}}</div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import MyAxios from "@/utils/requests";
export default {
  name: "discovery",
  data() {
    return {
      banners: [],
      recommendMusics: [],
      newAlbums: [],
      mvs:[]
    };
  },
  created() {
    //请求轮播图
    MyAxios({
      url: "/banner",
      method: "get",
      params: {
        type: 0,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.banners = res.data.banners;
      },
      (error) => {
        console.log(error.message);
      }
    );
    //请求推荐歌单
    MyAxios({
      url: "/personalized",
      method: "get",
      params: {
        limit: 10,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.recommendMusics = res.data.result;
      },
      (error) => {
        console.log(error.message);
      }
    );

    //请求最新专辑
    MyAxios({
      url: "/album/newest",
      method: "get"
    }).then(
      (res) => {
        // console.log(res.data);
        this.newAlbums = res.data.albums.slice(0,10);
      },
      (error) => {
        console.log(error.message);
      }
    );

    //请求最新mv
    MyAxios({
      url: "/mv/first",
      method: "get",
      params:{
        limit:4
      }
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
  methods: {

    toAlbum(id){
      this.$router.push({
        name:"album",
        params:{
          id
        }
      })
      
    },

    toMv(id){
      this.$router.push({
        name:"mv",
        params:{
          id
        }
      })
    }
  },
};
</script>

<style >
</style>
