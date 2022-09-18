// pages/index/others/others.js
Page({
  data: {
    profile:[],
    openid_1:'',
    openid_0:''
  },
  onLoad: function (options) {
    console.log(options)
    // console.log(options.isAnonymous)
    var that=this;
    that.setData({
      openid_1:options.openid
    })
    that.setData({
      openid_0:wx.getStorageSync('openid')
    })
    wx.request({
      url:"https://knowclear.top/knowclear/account/getAccountByOpenId/"+options.openid,
      method:"GET",
      data:{
      },
      header: {       //下面是固定格式，照搬
        'Content-Type': 'application/json',
      },
      success:function(res){
        console.log(res,'某个用户详情');
        that.setData({
          profile:res.data.profile,
          isAnonymous:options.isAnonymous
        })
      },
      fail:(err)=>{
        console.log(err)
      },
      
    })
  },
  toPrivate(e){
    console.log(e)
    wx.navigateTo({
      url: '../private/private?openid='+e.currentTarget.dataset.openid+'&name='+e.currentTarget.dataset.name,
    })
  }
  
})