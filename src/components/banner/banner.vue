<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- 幻灯内容 -->
        <swiper-slide :key="i" v-for="(str, i) in bannerList">
          <img :src="str.picUrl" style="height:100%"/>
        </swiper-slide>
        <!-- 以下控件元素均为可选 -->
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    props: ['bannerList'],
    data () {
      return {
        data: {},
        swiperOption: {
          // 所有配置均为可选（同Swiper配置）
          initialSlide: 0,
          pagination: {
            el: '.swiper-pagination'
          },
          loop: true,
          speed: 400,
          direction: 'horizontal',
          paginationClickable: true,
          mousewheelControl: true,
          autoplay: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          observeParents: true,
          debugger: true,
          onTransitionStart (swiper) {
            console.log(swiper)
          }
        }
      }
    },
    mounted () {
      // 这边就可以使用swiper这个对象去使用swiper官网中的那些方法
      this.swiper.slideTo(1, 1000, false)
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .swiper-container {
    width: 100%
    height: 10rem
    .swiper-wrapper {
      width: 100%
      height: 100%
    }
    .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 100%
      height: 100%
      img {
        width: 100%
        height: 100%
      }
    }
  }
</style>
