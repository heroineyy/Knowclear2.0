// pages/information/information.js
Page({
  data: {
    "profile": {
      "account": {
        "openid": "",
        "sex":'',
        "grade": "",
        "major": "",
        "collegeId": '',
        "nickname": ""
      },
      "college": ""
    },
     //微信头像和微信昵称
        user_icon:"",
        user_name:"",
  },
  onLoad: function () {
    this.getCurrentUserInfo();
    this.getInfo();
  },
  onShow:function(){
    this.getCurrentUserInfo();
    this.getInfo();
  },
  editinfo: function () {
    wx.navigateTo({
      url: '/pages/edit/edit'
    })
  },
  getCurrentUserInfo() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: 'https://knowclear.top/knowclear/account/getSimpleAccount',
      method: 'GET',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '获取当前用户信息成功');
        that.setData({
          profile: res.data.profile
        });
        wx.setStorageSync('profile', res.data.profile);
      },
      fail: () => {
        console.log("获取当前用户信息失败");
      },
      complete:()=>{
         wx.stopPullDownRefresh()
      }
    });
  },
  //下拉刷新效果
  onPullDownRefresh:function(){
    this.getCurrentUserInfo();
  },
   //获取头像信息
     getInfo(){
        this.setData({
          user_icon:wx.getStorageSync('user_icon'),
          user_name:wx.getStorageSync('user_name')
        })
  }
})