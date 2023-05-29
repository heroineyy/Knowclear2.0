// pages/information/information.js
const util = require("../../utils/util");
Page({
  data: {
    "account": {
      "openid": "",
      "sex": '',
      "grade": "",
      "major": "",
      "collegeId": '',
      "nickname": ""
    },
    "college": "上海海事大学",
    //微信头像和微信昵称
    user_icon: "",
    user_name: "",
  },

  onLoad: function () {
    this.getInfo();
  },
  onShow: function () {
    this.getInfo();
  },

  //编辑信息
  editinfo: function () {
    wx.navigateTo({
      url: '/pages/edit/edit'
    })
  },

  //下拉刷新效果
  onPullDownRefresh: function () {
    const token = wx.getStorageSync('acc_token');
    util.getCurrentUserInfo(token);
  },
  
  //获取头像信息
  getInfo() {
    this.setData({
      user_icon: wx.getStorageSync('user_icon'),
      user_name: wx.getStorageSync('user_name'),
      account: wx.getStorageSync('account')
    })
  }
})