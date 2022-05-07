<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video ref="vid" controls :src="url" @play="mvPlay"></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap" v-if="artistImg">
            <img :src="`${artistImg}?param=200y200`" alt="图片"/>
          </div>
          <span class="name">{{ details.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ details.name }}</h2>
          <span class="date">发布：{{ details.publishTime }}</span>
          <span class="number">播放：{{ details.playCount }}次</span>
          <p class="desc">
            {{ details.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotComments">
        <p class="title">
          精彩评论<span class="number">({{ total }})</span>
        </p>
        <div class="comments-wrap">
          <div
            class="item"
            :key="hotComment.commentId"
            v-for="hotComment in hotComments"
          >
            <div class="icon-wrap">
              <img :src="`${hotComment.user.avatarUrl}?param=200y200`" alt="图片" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ hotComment.user.nickname }}：</span>
                <span class="comment">{{ hotComment.content }}</span>
              </div>
              <div class="re-content" v-if="hotComment.beReplied.length">
                <span class="name"
                  >{{ hotComment.beReplied[0].user.nickname }}：</span
                >
                <span class="comment">{{
                  hotComment.beReplied[0].content
                }}</span>
              </div>
              <div class="date">
                {{ hotComment.timeStr }} {{ hotComment.time | CommentTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论<span class="number">({{ total }})</span>
        </p>
        <div class="comments-wrap">
          <div
            class="item"
            :key="comment.commentId"
            v-for="comment in comments"
          >
            <div class="icon-wrap">
              <img :src="`${comment.user.avatarUrl}?param=200y200`" alt="图片"/>
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ comment.user.nickname }}：</span>
                <span class="comment">{{ comment.content }}</span>
              </div>
              <div class="re-content" v-if="comment.beReplied.length">
                <span class="name"
                  >{{ comment.beReplied[0].user.nickname }}：</span
                >
                <span class="comment">{{ comment.beReplied[0].content }}</span>
              </div>
              <div class="date">
                {{ comment.timeStr }} {{ comment.time | CommentTime }}
              </div>
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
        :current-page="page"
        :page-size="20"
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" :key="mv.id" v-for="mv in mvs" @click="toMv(mv.id)">
            <div class="img-wrap">
              <img :src="`${mv.cover}?param=200y120`" alt="视频" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ mv.playCount }}</div>
              </div>
              <span class="time">{{mv.duration | SongTime}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{mv.name}}</div>
              <div class="singer">{{mv.artists | authors}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyAxios from "@/utils/requests";
export default {
  name: "mv",
  data() {
    return {
      id: this.$route.params.id,
      details: {},
      artistImg: "",
      url: "",
      comments: [],
      hotComments: [],
      mvs: [],
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 20,
    };
  },
  methods: {
    // 分页功能
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 获得专辑评论
      MyAxios({
        url: "/comment/mv",
        method: "get",
        params: {
          id: this.id,
          limit: 20,
          offset: (val - 1) * this.limit,
        },
      }).then(
        (res) => {
          //   console.log(res.data);
          this.comments = res.data.comments;
          this.hotComments = res.data.hotComments;
          // this.total = res.data.total;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    toMv(id){
      this.$router.replace({
        name:"mv",
        params:{
          id
        }
      })
    },

    mvPlay(){

        this.$bus.$emit("musicPause")
      
    }
  },


  created() {
    this.$bus.$on("mvPause", ()=>{
      if(this.$refs.vid && this.$refs.vid.paused == false){
      this.$refs.vid.pause()
      }

    })

    MyAxios({
      url: "/mv/detail",
      method: "get",
      params: {
        mvid: this.id,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.details = res.data.data;

        MyAxios({
          url: "/artist/detail",
          method: "get",
          params: {
            id: this.details.artistId,
          },
        }).then(
          (res) => {
            this.artistImg = res.data.data.artist.cover;
          },
          (error) => {
            console.log(error.message);
          }
        );
      },
      (error) => {
        console.log(error.message);
      }
    );

    MyAxios({
      url: "/mv/url",
      method: "get",
      params: {
        id: this.id,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        // this.details = res.data.data;
        this.url = res.data.data.url;
      },
      (error) => {
        console.log(error.message);
      }
    );

    MyAxios({
      url: "/comment/mv",
      method: "get",
      params: {
        id: this.id,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.comments = res.data.comments;
        this.hotComments = res.data.hotComments;
        this.total = res.data.total;
      },
      (error) => {
        console.log(error.message);
      }
    );

    MyAxios({
      url: "/simi/mv",
      method: "get",
      params: {
        mvid: this.id,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.mvs = res.data.mvs;
      },
      (error) => {
        console.log(error.message);
      }
    );
  },


 

};
</script>

<style></style>
