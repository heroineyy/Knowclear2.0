Component({
  /**
   * 组件的属性列表
   */
//从父组件传递过来的值
  properties: {
      node: Object,
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
    selecttap:function(e)
{var allpages = getCurrentPages();
  var now = allpages[allpages.length - 1];
now.selectTap()
this.triggerEvent('listener',{id:this.data.node.commentId ,name: this.data.node.account.nickname});
}, 
ComponentListener(e){
  let info = e.detail;
//  this.setData({parentId:info})
 this.triggerEvent('listener',e.detail);
},  urlto(){
  wx.navigateTo({
    url: '/pages/found/found',
  })
}
  }
})
