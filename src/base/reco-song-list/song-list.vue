<template>
  <div class="recommend-list">
    <h1 class="list-title">热门歌单推荐</h1>
    <ul>
      <li @click="selectItem(item)" v-for="item in discList" class="item">
        <div class="icon">
          <img width="60" height="60"  :src="item.imgurl">
        </div>
        <div class="text">
          <h2 class="name" v-html="item.creator.name"></h2>
          <p class="desc" v-html="item.dissname"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: ['discList'],
    data () {
      return {
        data: {}
      }
    },
    mounted () {

    },
    computed: {

    },
    components: {

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
          font-size: 15px
        .desc
          color: $color-text
          font-size: 13px

</style>
