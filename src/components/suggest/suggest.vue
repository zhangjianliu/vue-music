<template>
  <!--搜索结果组件-->
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!--上拉刷新loading效果-->
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll' // 滚动组件 引入上拉加载更多
  import Loading from 'base/loading/loading' // loading组件
  import NoResult from 'base/no-result/no-result' // 没有搜索结果组件
  import {search} from 'api/search' // search
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song' // 歌曲类
  import {mapMutations, mapActions} from 'vuex' // vuex
  import Singer from 'common/js/singer' //歌手类 实例化一个歌手对象
  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1, // 请求参数
        pullup: true, // 上拉刷新开关
        beforeScroll: true, //
        hasMore: true, // 当前是不是最后一页
        result: [] // 搜索结果数组
      }
    },
    methods: {
      // 为scroll组件的refresh方法做一个代理
      refresh() {
        this.$refs.suggest.refresh()
      },
      // 请求服务端数据
      search() {
        this.page = 1  // 请求当前页码
        this.hasMore = true // 是否有下一页
        this.$refs.suggest.scrollTo(0, 0) // 滚动到顶部
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      // 上拉刷新加载更所事件
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._geResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      // 派发scroll事件主要为了解决移动端滚动时输入框的隐藏
      listScroll() {
        this.$emit('listScroll')
      },
      // 跳转
      selectItem(item) {
        // 点击歌手跳转到歌手详情页
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          // 通信
          this.setSinger(singer)
        } else {
          this.insertSong(item) // 点击添加到当前歌曲到播放列表
        }
        this.$emit('select', item)
      },
      // 处理名字显示
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername // 显示歌手名字
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      // 因为请求回来的列表有可能是歌手
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'  // 歌手图标
        } else {
          return 'icon-music'
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          // ...obj 拓展运算符 vuex 用的多
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      // 检测是否还有更多数据
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER' // 组件间通信
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      // 检测watch的变化 去请求服务端数据
      query(newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
