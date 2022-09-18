// pages/component/comment.js
Component({
  properties: {
    model: Object,
    parent:{
      type:String,
      value:""
    }
  },
  data: {

  },

  methods: {
       //点击头像进入用户信息页
   toOthers(e){
    wx.navigateTo({
      url: '/pages/others/others?openid='+e.currentTarget.dataset.openid+'&isAnonymous='+e.currentTarget.dataset.isanonymous,
    })
  },
  // tapItem: function (e) {
  //   var that = this;
  //   console.log('-2------------',e);
  //   var itemid = e.currentTarget.dataset.id;
  //   console.log('组件里点击的id: ' + itemid);
  //   this.setData({
  //     isBranch:true
  //   })
  //   this.triggerEvent('tapitem', { id: itemid }, { bubbles: true, composed: true });
  // }
  tapItem: function (e) {
    var tonickname = e.currentTarget.dataset.tonickname;
    var tocommentid = e.currentTarget.dataset.tocommentid;
    var topicid=e.currentTarget.dataset.topicid;
    // console.log(e)
    // console.log('要回复的人: ' + e.currentTarget.dataset);
    this.setData({
      tonickname:tonickname,
      tocommentid:tocommentid,
      topicid:topicid
    })
    this.triggerEvent('tapitem', { tonickname: tonickname,tocommentid:tocommentid,topicid:topicid }, { bubbles: true, composed: true });
    // this.triggerEvent()
  }
},
})
