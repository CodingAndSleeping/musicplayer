<template>
  <div class="index-container">
    <div class="nav">
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/recommends?tag=全部">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
      </ul>
    </div>
    <div class="main">

      <!-- <keep-alive> -->
      <router-view :key="`${$route.path}`" />
      <!-- </keep-alive> -->


    </div>

      <div class="player">
    <span>{{ musicName}} - {{ musicAuthor }}</span>
    <audio
      ref="aud"
      :src="musicUrl"
      autoplay
      controls
      @ended="changeSong"
      @play="musicPlay"
    ></audio>
  </div>
    
  </div>
</template>

<script>
import MyAxios from "@/utils/requests";
export default {
  data() {
    return {
      musicUrl: "",
      musicID: "",
      musicName: "",
      musicAuthor: "",

      names: [],
      authors: [],
      ids: [],
      urls: [],
    };
  },

  mounted() {
    this.$bus.$on("getMusicUrl", (song) => {
      // console.log(song.id);
      if (!this.ids.includes(song.id)) {
        this.ids.push(song.id);
        this.names.push(song.name);
        if (song.hasOwnProperty("ar")) {
          this.authors.push(song.ar.map((item) => item.name).join("/"));
        } else {
          this.authors.push(song.artists.map((item) => item.name).join("/"));
        }
      }
      MyAxios({
        url: "/song/url",
        method: "get",
        params: {
          id: song.id,
        },
      }).then(
        (res) => {
          // console.log(res.data);
          this.musicName = song.name;
          // this.musicAuthor = song.ar.map((item) => item.name).join("/");
          if (song.hasOwnProperty("ar")) {
            this.musicAuthor = song.ar.map((item) => item.name).join("/");
          } else {
            this.musicAuthor = song.artists.map((item) => item.name).join("/");
          }
          if (!this.urls.includes(res.data.data[0].url)) {
            this.urls.push(res.data.data[0]);
          }
          this.musicUrl = res.data.data[0].url;
          this.musicID = song.id;
        },
        (error) => {
          console.log(error.message);
        }
      );
    });
    this.$bus.$on("getAllIDs", (songs) => {

      this.names = songs.map((item) => item.name);
      this.authors = songs.map((item) => {
        if (item.hasOwnProperty("ar")) {
          
          return item.ar.map((item) => item.name).join("/");
        } else {
          return item.artists.map((item) => item.name).join("/");
        }
      });

      this.ids = songs.map((item) => item.id);

      MyAxios({
        url: "/song/url",
        method: "get",
        params: {
          id: this.ids.join(","),
        },
      }).then(
        (res) => {
          // console.log(res.data.data);
          this.musicName = this.names[0];
          this.musicAuthor = this.authors[0];
          console.log(res.data);
          this.urls = res.data.data;
          this.musicUrl = this.urls.filter((item) => {
            return item.id == this.ids[0];
          })[0].url;
          this.musicID = this.urls.filter((item) => {
            return item.id == this.ids[0];
          })[0].id;
        },
        (error) => {
          console.log(error.message);
        }
      );
    });
  
    this.$bus.$on("musicPause", ()=>{
      if(this.$refs.aud && this.$refs.aud.paused == false){
        this.$refs.aud.pause()
      }
      
    })
  
  },

  methods: {
    changeSong() {
      if (this.ids.length) {
        let index = this.ids.indexOf(this.musicID);
        if (index == this.ids.length - 1) {
          index = -1;
        }
        this.musicName = this.names[index + 1];
        this.musicAuthor = this.authors[index + 1];
        this.musicID = this.ids[index + 1];
        this.musicUrl = this.urls.filter((item) => {
          return item.id == this.musicID;
        })[0].url;
      } else {
        console.log(this.$refs.aud.src);
        this.$refs.aud.play();
      }
    },

    musicPlay(){
      this.$bus.$emit("mvPause")
    }
  },

};
</script>

<style scoped>
.player span {
  position: relative;
  float: left;
  left: 20px;
}
</style>
