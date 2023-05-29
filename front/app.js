// app.js
var plugin = requirePlugin("chatbot");
const api=require('./lib/api.js');
const app = getApp();
App({
  onLaunch(options) {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('hasuserinfo', false);
    // 登录
    wx.login({
      success: res => {
        console.log('微信登录成功！code=', res)
        wx.setStorage({
          key: "acc_code",
          data: res.code
        })
        if (res.code) {
          var that = this;
          wx.request({ //发起网络请求
            // url: "http://:8001/knowclear/account/login/" + res.code,
            url: api.getUrl('/knowclear/account/login/')+res.code,
            method: 'POST',
            data: {},
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (ress) {
              if (ress.statusCode == 200) {
                console.log('获取token成功！token=', ress.data.token);
                wx.setStorage({
                  key: "acc_token",
                  data: ress.data.token
                })

                wx.setStorage({
                  key: "college_id",
                  data: ress.data.college_id
                })
                that.getopenid();
              }
            },
            fail: (err) => {
              console.log(err)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    this.getUserProfile();
  },
  globalData: {
    userInfo: null,

  },

  //获取用户的openid
  getopenid() {
    const token = wx.getStorageSync('acc_token');
    wx.request({
      // url: "http://localhost:8001/knowclear/account/getSimpleAccount",
      url: api.getUrl('/knowclear/account/getSimpleAccount'),
      method: 'GET',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '获取当前用户id成功');
        wx.setStorage({
          key: "account",
          data: res.data.account
        })
      }
    });
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善个人信息',
      success: (res) => {
        console.log('完善个人信息', res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
        wx.setStorage({
          key: "user_icon",
          data: res.userInfo.avatarUrl
        });
        wx.setStorage({
          key: "user_name",
          data: res.userInfo.nickName
        });
      }
    })
  },
})