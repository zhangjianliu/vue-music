<template>
  <div ref="wrapper">
    <!--插槽-->
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      /*点击列表是否派发click事件*/
      click: {
        type: Boolean,
        default: true
      },
      /*是否派发滚动事件*/
      listenScroll: {
        type: Boolean,
        default: false
      },
      /*列表的数据*/
      data: {
        type: Array,
        default: null
      },
      /*是否派发滚动到底部的事件，用于上拉加载*/
      pullup: {
        type: Boolean,
        default: false
      },
      /*是否派发列表滚动开始的事件*/
      beforeScroll: {
        type: Boolean,
        default: false
      },
      /* 当数据更新后，刷新scroll的延时*/
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    methods: {
      // better-scroll的初始化
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        // 是否派发滚动事件  从父组件传递过来的
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)  //vue实例派发一个事件
          })
        }
        // 是否派发滚动到底部事件，用于上拉加载
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable () {
        // 代理better-scroll的disable方法
        this.scroll && this.scroll.disable()
      },
      enable () {
        // 代理better-scroll的enable方法
        this.scroll && this.scroll.enable()
      },
      refresh () {
        // 代理better-scroll的refresh方法
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        // 代理better-scroll的scrollTo方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        // 代理better-scroll的scrollToElement方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    mounted () {
      // 保证在DOM渲染完毕后初始化better-scroll
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    computed: {},
    components: {},
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
