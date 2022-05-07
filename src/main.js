import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/index.css'

import router from '@/router/index';
Vue.use(ElementUI);



Vue.config.productionTip = false


Vue.filter("toDate", value=>{
  return new Date(parseInt(value)).toLocaleString().replace(/:\d{1,2}$/,' ')
})

Vue.filter("authors", value=>{
  return value.map(item=>item.name).join("/");
})


Vue.filter("SongTime", value=>{
  let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((value % (1000 * 60)) / 1000);
  if(minutes<10){
    minutes = "0" + minutes;
  }
  if(seconds<10){
    seconds = "0" + seconds;
  }
  return minutes+ ":" + seconds;
})

Vue.filter("CommentTime", value=>{
  let hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((value % (1000 * 60)) / 1000);
  if(hours<10){
    hours = "0" + hours;
  }
  if(minutes<10){
    minutes = "0" + minutes;
  }
  if(seconds<10){
    seconds = "0" + seconds;
  }
  return hours + ":" +minutes+ ":" + seconds;
})

new Vue({
  render: h => h(App),
  router,
  beforeCreate(){
    Vue.prototype.$bus = this;
  }
}).$mount('#app')
