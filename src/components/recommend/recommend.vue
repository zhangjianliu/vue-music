<template>
  <div class="recommend" ref="recommend">
    <!--二级路由显示区域-->
    <!--轮播图组件-->
    <scroll ref="scroll" class="recommend-content" :discListData="discList">
      <div>
        <banner v-if="recommends.length" :banner-list="recommends"></banner>
        <song-list :disc-list="discList"></song-list>
      </div>
      <!--歌单推荐组件-->
    </scroll>
    <router-view></router-view>
  </div>

</template>

<script type="text/ecmascript-6">

  import { getRecommend, getDiscList } from 'api/tuijian'
  import { ERR_OK } from 'api/config'
  import Banner from 'components/banner/banner'
  import songList from 'base/reco-song-list/song-list'
  import Scroll from 'base/scroll/scroll'

  export default {
    data () {
      return {
        recommends: [],
        discList: []

      }
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      loadImage () {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      selectItem (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
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
            this.discList = res.data.list
            console.log(this.discList)
          }
        })
      }
    },
    components: {
      Banner,
      songList,
      Scroll
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
