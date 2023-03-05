// pages/dom2/dom2.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    hotTopics:[],
},
 //获取输入框内容
 expInput: function (e) {
  this.setData({ text: e.detail.value })
  console.log(this.data.text)
},
toGambit(e){
  wx.navigateTo({
    url: '/pages/gambit/gambit?topicid='+e.currentTarget.dataset.topicid,
  })
  console.log(e,'当前话题id')
},
doSearch: function(e) {
  wx.navigateTo({
  url: '/pages/found/found?text='+this.data.text
})
},
//获取热门话题
getTopic(){
  const token=wx.getStorageSync('acc_token');
  const  collegeId=wx.getStorageSync('real_college_id');
  wx.request({
    url: 'https://knowclear.top/knowclear/topic/hotTopics/'+collegeId,
    method:"GET",
    data:{
    },
    header: {       //下面是固定格式，照搬
      'Content-Type': 'application/json',
      'token': token
    },
    success: (res) =>  {
      console.log(res.data.hotTopics,'yes');
      this.setData({hotTopics:res.data.hotTopics})
    },
    fail:(error)=>{
      console.log("获取话题失败")
      console.log(error)
    }
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.ac();
    this.getTopic();
  },
 //  页面初始提示
 ac(){
     const info=wx.getStorageSync('complete_info');
     const hasuserinfo=wx.getStorageSync('hasuserinfo');
     if(hasuserinfo==false){
       wx.showToast({
         title: '请先登录',
         icon: 'none',
         duration: 2000,//持续的时间
         success:function(){
           setTimeout(function(){
             wx.switchTab({
       url: '/pages/mine/mine',      })
       },500);
      },
    })
  }
  else{
   if(info==0){
     wx.showToast({
       title: '请先完善择校信息',
       icon: 'none',
       duration: 2000,//持续的时间
       success:function(){
         setTimeout(function(){
            wx.navigateTo({
               url: '/pages/setschool/setschool',
            })
        },2000);
      },
   })
 }else{
     if(info==3){
        wx.showModal({
           title:"提示",
           content:"您只能在自己的学校发布话题和评论\n点击确定回到信息修改页面\n点击取消继续看看",
           success:function (res) {
              if(res.confirm){
                 console.log("点击了确定");
                    wx.navigateTo({
                       url: '/pages/setschool/setschool',
                    })
              }else if(res.cancel){
                 console.log("点击了取消");
    //              wx.switchTab({
    //                 url: '/pages/index/index',
    //              })
    return;
              }
           }
        })
     }
   }
  }
 },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      hasUserInfo: wx.getStorageSync('hasuserinfo')
    })  
    const hasuserinfo=wx.getStorageSync('hasuserinfo');
    if(hasuserinfo==false){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,//持续的时间
        success:function(){
          setTimeout(function(){
            wx.switchTab({
      url: '/pages/mine/mine',      })
      },500);
      },
    })
 }else{
   //切换了学校重新加载热门话题
   if (wx.getStorageSync('hasChangeSchool') == 'true'){
    this.setData({
      hotTopics:[]
    })
    this.getTopic();
   }  
 }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})