// compenent/Component.js
const App = getApp()
Component({
  properties: {

  },
  data: {

  },
  methods: {
    // 点赞
    tapLike(e) {
      let { likes, hasLike } = this.data
      likes += (hasLike && -1 || 1)
      hasLike = !hasLike
      this.updateFeeds(likes, hasLike).then(() => {
        this.setData({
          likes,
          hasLike
        })
        // 广播事件   ↓ 重点在这里 ↓
        App.emitFeedsLike({
          uid: this.data.uid,
          fid: this.data.fid,
          likes,
          hasLike
        })
      })
    },
  }
})
