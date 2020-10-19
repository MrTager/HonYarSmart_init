<template>
  <div class="Background">
    <div class="header">
      <img class="back" src="../assets/images/back_white.png" alt="返回" @click="goback()" />
      <div class="title">背景</div>
    </div>
    <div class="swiper_group">
      <div class="swiper_group_2">
        <swiper class="swiper" ref="swiper" :options="swiperOption">
          <swiper-slide v-for="(item,i) in img_arr" :key="i" :style="{'opacity':now_swiper_index == i ? 1 : 0.3}">
            <img
              class="swiper_img"
              :src="require(`../assets/themeImg/choose/${item.name}.png`)"
              alt
            />
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination" slot="pagination"></div>
      </div>
      <router-link :to="{path:'/main'}" tag="div" replace>
      <div class="choose_button" @click="use_background()">使用此背景</div>
      </router-link>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Tool from "@/utils/Tool";
import axios from "axios";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
let _this = null;
let window_proportion = 10;
export default {
  name: "Background",
  data() {
    return {
      img_arr: [
        { name: "1" },
        { name: "2" },
        { name: "3" },
        { name: "4" },
        { name: "5" },
        { name: "6" },
      ],
      swiperOption: {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: window_proportion * 7,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "fraction",
        },
        on: {
          slideChange() {
            _this.now_swiper_index = this.activeIndex;
          },
        },
      },
      now_swiper_index: 0,
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  computed: {
    chooseTheme() {
      return this.now_swiper_index+1 + '.png'
    },
  },
  methods: {
    goback() {
      this.$router.replace({ path: "/setting" });
    },
    use_background(){
        let _this = this;
        _this.$store.dispatch("changeDate", {
            theme_img: _this.chooseTheme,
          });
          Tool.add_sql("web_Theme", _this.chooseTheme, (res) => {
          });
    }
  },
  mounted() {
    // setInterval(()=>{
    //     console.log(this.now_swiper_index)
    // },200)
  },
  created() {
    _this = this;
    let s_width = Number(window.screen.width);
    //设置自适应比例
    window_proportion = (s_width / 1280) * 10;
  },
};
</script>
<style lang="scss" scoped>
.Background {
  width: 100%;
  height: 100%;
  background-color: black;
  color: white;
}
.header {
  position: relative;
  height: 8rem;
  width: 100%;
}
.back {
  position: absolute;
  width: 1.45rem;
  height: 2.76rem;
  left: 5rem;
  top: calc(50% - 1.38rem);
}
.title {
  position: absolute;
  width: 40%;
  height: 8rem;
  left: 30%;
  text-align: center;
  color: white;
  font-size: 3rem;
  line-height: 8rem;
}
.swiper_group {
  width: 100%;
  height: calc(100% - 11.4rem);
  margin-top: 3.4rem;
}
.swiper_group_2 {
  width: 100%;
  height: 61.2rem;
}
.swiper {
  height: 46.6rem;
}
.swiper-slide {
  width: 79.3rem;
  height: 46.6rem;
}
.swiper_img {
  width: 100%;
  height: 100%;
}
.swiper-pagination-fraction {
  font-size: 2rem;
  height: 3rem;
  color: rgba(153, 153, 153, 1);
  top: 61.2rem !important;
}
.choose_button {
  position: absolute;
  width: 20rem;
  height: 6rem;
  left: calc(50% - 10rem);
  top: 67.1rem;
  background-color: rgba(64, 104, 255, 1);
  border-radius: 3rem;
  color: white;
  font-size: 2.4rem;
  line-height: 6rem;
  text-align: center;
}
.choose_button:active {
  background-color: white;
  color: rgba(64, 104, 255, 1);
}
</style>