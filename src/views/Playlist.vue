<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap" v-if="details.hasOwnProperty('coverImgUrl')">
        <img :src="`${details.coverImgUrl}?param=200y200`" alt="图片" />
      </div>
      <div class="info-wrap">
        <p class="title">{{ details.name }}</p>
        <div class="author-wrap">
          <img
            class="avatar"
            v-if="details.creator"
            :src="`${details.creator.avatarUrl}?param=200y200`"
            alt="图片"
            
          />
          <span class="name" v-if="details.creator">{{
            details.creator.nickname
          }}</span>
          <span class="time">{{ details.createTime | toDate }} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play" @click="getAllIDs"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li :key="index" v-for="(tag, index) in details.tags">{{ tag }}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ details.description }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlit-table">
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              style="height: 80px"
              class="el-table__row"
              :key="song.id"
              v-for="(song, index) in songs"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap">
                  <img :src="`${song.al.picUrl}?param=200y200`" alt="图片" />
                  <span
                    class="iconfont icon-play"
                    @click="getMusicUrl(song)"
                  ></span>
                </div>
              </td>
              <td style="text-align: center">
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ song.name }}</span>
                    <span class="iconfont icon-mv"></span>
                  </div>
                  <span>{{ song.alia[0] }}</span>
                </div>
              </td>
              <td style="text-align: center">
                <span>
                  {{ song.ar | authors }}
                </span>
              </td>
              <td style="text-align: center">{{ song.al.name }}</td>
              <td style="text-align: center">{{ song.dt | SongTime }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="`评论${total}`" name="2">
        <!-- 精彩评论 -->
        <div v-if="hotComments" class="comment-wrap">
          <p class="title">
            精彩评论<span class="number">{{ hotComments.length }}</span>
          </p>
          <div class="comments-wrap">
            <div
              class="item"
              :key="hotComment.commentId"
              v-for="hotComment in hotComments"
            >
              <div class="icon-wrap">
                <img
                  :src="`${hotComment.user.avatarUrl}?param=200y200`"
                  alt="图片"
                  
                />
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
            最新评论<span class="number">{{ total }}</span>
          </p>
          <div class="comments-wrap">
            <div
              class="item"
              :key="comment.commentId"
              v-for="comment in comments"
            >
              <div class="icon-wrap">
                <img
                  :src="`${comment.user.avatarUrl}?param=200y200`"
                  alt="图片"
                />
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
                  <span class="comment">{{
                    comment.beReplied[0].content
                  }}</span>
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
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MyAxios from "@/utils/requests";
export default {
  name: "playlist",
  data() {
    return {
      id: this.$route.query.id,
      details: {},
      songs: [],
      // songIDs: [],
      comments: [],
      hotComments: [],
      activeIndex: "1",
      // 总条数
      total: 0,
      // 页码
      page: 1,
      limit: 20,
    };
  },
  methods: {
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);

      // 获得歌单评论
      MyAxios({
        url: "/comment/playlist",
        method: "get",
        params: {
          id: this.id,
          limit: 20,
          offset: (val - 1) * this.limit,
        },
      }).then(
        (res) => {
          // console.log(res.data);
          this.comments = res.data.comments;
          this.hotComments = res.data.hotComments;
          // this.total = res.data.total
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    // 将音乐id发送给index组件
    getMusicUrl(song) {
      // console.log(id)
      this.$bus.$emit("getMusicUrl", song);
    },
    // 将全部音乐id发送给index组件
    getAllIDs() {
      // MyAxios({
      //   url: "/song/detail",
      //   method: "get",
      //   params: {
      //     ids: ids.join(","),
      //   },
      // }).then(
      //   (res) => {
      //     // console.log( res.data);
      //     this.musicName = res.data.songs[0].name;
      //     this.musicAuthor = res.data.songs[0].ar
      //       .map((item) => item.name)
      //       .join("/");
      //     this.names = res.data.songs.map((item) => item.name);
      //     this.authors = res.data.songs.map((item) =>
      //       item.ar.map((item) => item.name).join("/")
      //     );
      //   },
      //   (error) => {
      //     console.log(error.message);
      //   }
      // );
      this.$bus.$emit("getAllIDs", this.songs);
    },
  },
  created() {
    //获得歌单详情
    MyAxios({
      url: "/playlist/detail",
      method: "get",
      params: {
        id: this.id,
      },
    }).then(
      (res) => {
        // console.log(res.data.playlist);
        this.details = res.data.playlist;
      },
      (error) => {
        console.log(error.message);
      }
    );

    // 获得歌单歌曲
    MyAxios({
      url: "/playlist/track/all",
      method: "get",
      params: {
        id: this.id,
      },
    }).then(
      (res) => {
        // console.log(res.data);
        this.songs = res.data.songs;
        // this.songIDs = res.data.songs.map((item) => item.id);

      },
      (error) => {
        console.log(error.message);
      }
    );

    // 获得歌单评论
    MyAxios({
      url: "/comment/playlist",
      method: "get",
      params: {
        id: this.id,
        limit: 20,
        offset: 0,
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
  },
};
</script>

<style scoped>
</style>
