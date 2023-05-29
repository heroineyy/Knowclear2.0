// pages/index/others/others.js

const util = require("../../utils/util");
const api=require('../../lib/api.js')
Page({
  data: {
    profile:{},
    openid_1:'',
    openid_0:'',
    college:"上海海事大学"
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      openid_1:options.openid
    })
    that.setData({
      openid_0:wx.getStorageSync('openid')
    })
    wx.request({
      // url:"https://knowclear.top/knowclear/account/getAccountByOpenId/"+options.openid,
      url:api.getUrl("/knowclear/account/getAccountByOpenId/")+options.openid,
      method:"GET",
      data:{
      },
      header: {       //下面是固定格式，照搬
        'Content-Type': 'application/json',
      },
      success:function(res){
        console.log(res,'某个用户详情');
        that.setData({
          profile:res.data.account,
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