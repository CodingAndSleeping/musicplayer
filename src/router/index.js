import Discovery from '@/views/Discovery';
import Mv from '@/views/Mv';
import Mvs from '@/views/Mvs';
import Playlist from '@/views/Playlist';
import Recommends from '@/views/Recommends';
import Result from '@/views/Result';
import Songs from '@/views/Songs';
import Album from '@/views/Album';
import Vue from 'vue';

// const originalPush = VueRouter.prototype.push

// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: "/",
            redirect: "/discovery"
        },
        {
            name:"discovery",
            path: "/discovery",
            component: Discovery
        }, 
        {
            // 推荐歌单
            name:"recommends",
            path: '/recommends',
            component: Recommends
        },
        {
            // 播放列表
            name: "playlist",
            path: '/playlist',
            component: Playlist
        },
        {
            // 专辑页
            name:"album",
            path:"/album/:id",
            component:Album
        },
        {
            // 最新音乐
            path: '/songs',
            component: Songs
        },
        {
            // mv
            path: '/mvs',
            component: Mvs
        },
        // mv详情
        {
            name:"mv",
            path: '/mv/:id',
            component: Mv
        },
        // 搜索结果页
        {
            name:"result",
            path: '/result/:query',
            component: Result
        }
    ],
    mode:"history"
    

})