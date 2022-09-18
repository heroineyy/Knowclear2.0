// components/commentdetail/commentdetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comments: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
},

  /**
   * 组件的方法列表
   */
  methods: {
    ComponentListener(e){
      let info = e.detail;
    //  this.setData({parentId:info})
    this.triggerEvent('listener',e.detail);
   },
    //跳转至他人信息页
 toOthers(e){
  wx.navigateTo({
    url: '/pages/others/others?openid='+e.currentTarget.dataset.openid+'&isAnonymous='+e.currentTarget.dataset.isanonymous,
  })
},
selecttap:function(e)
{var allpages = getCurrentPages();
  var now = allpages[allpages.length - 1];
now.selectTap()
var id = e.currentTarget.dataset.id;
this.triggerEvent('listener',{
  id:this.data.comments[id].commentId ,name: this.data.comments[id].account.nickname,isAnonymous:this.data.comments[id].isAnonymous,sex:this.data.comments[id].account.sex

});
}
}
})
