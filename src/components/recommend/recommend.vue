<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!--轮播图组件-->
        <banner v-if="recommends.length"  @loadImage="loadImage" :banner-list="recommends"></banner>
        <!--歌单推荐列表组件-->
        <recommend-song-list  @childrenSelect="childSelectHandler" :disc-list="discList"></recommend-song-list>
      </div>
      <!--loading组件-->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- 二级路由容器-->
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import { getRecommend, getDiscList } from 'api/recommendPage'
  import { ERR_OK } from 'api/config'
  import Loading from 'base/loading/loading'
  import Banner from 'components/banner/banner'
  import RecommendSongList from 'base/recommend-song-list/recommend-song-list'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        recommends: [], // 轮播图
        discList: [] // 热们歌单列表
      }
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      // 二级路由实现跳转
      childSelectHandler (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        // 设置vuex
        this.setDisc(item)
      },
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            setTimeout(()=>{
              this.discList = res.data.list
            },100)
          }
        })
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      ...mapMutations({
        setDisc:'SET_DISC'
      })
    },
    components: {
      Banner,
      RecommendSongList,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
