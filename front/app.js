// app.js
var plugin = requirePlugin("chatbot");
const app = getApp();
App({
  onLaunch(options) {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('hasuserinfo',false);
    // 登录
    wx.login({
      success: res => {
        console.log('登录成功！code=',res)
        wx.setStorage({
          key:"acc_code",
          data:res.code
        })
        if (res.code) {
          var that=this;
          wx.request({    //发起网络请求
            url:"https://knowclear.top/knowclear/account/login/"+res.code,
            method: 'POST',
            data: { },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (ress) {
              console.log('获取token成功！token=',ress)
              wx.setStorage({
                key:"acc_token",
                data:ress.data.token
              })
              wx.setStorage({
                key:"college_id",
                data:ress.data.college_id
              })
              that.getopenid();
            },
            fail:(err)=>{
              console.log(err)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })  
    // const token=wx.getStorage('acc_token')
    // if(token){
      // this.getopenid();
    // }
    
    const openid = wx.getStorageSync('openid');
    plugin.init({
       appid: "1VJ6oUxOkPOaDHbPmR1HJrsTeWtrmk", //小程序示例账户，仅供学习和参考
       openid: "openid", //用户的openid，非必填，建议传递该参数
      success: (res) => {
        console.log('调用接口成功！', res)
      }, //非必填
      fail: (error) => {
        console.log('调用接口失败！', error)
      }, //非必填
    });
    
     this.getUserProfile();
  },
  globalData: {
    userInfo: null,
  
  },

    //获取用户的openid
    getopenid() {
      var that = this;
      const token = wx.getStorageSync('acc_token');
      wx.request({
        url: "https://knowclear.top/knowclear/account/getSimpleAccount",
        method: 'GET',
        data: {},
        header: { //下面是固定格式，照搬
          'Content-Type': 'application/json',
          'token': token
        },
        success: function (res) {
          console.log(res, '获取当前用户id成功');
          wx.setStorage({
            key: "openid",
            data: res.data.profile.account.openid
          })
        }
      });
    },
     getUserProfile() {
          wx.getUserProfile({
            desc: '用于完善个人信息', 
            success: (res) => {
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true,
              });
              wx.setStorage({
                key: "user_icon",
                data: res.userInfo.avatarUrl
              });
              wx.setStorage({
                key: "user_name",
                data: res.userInfo.nickName
              });
            }
          })
        },

//      //获取头像信息
//   getUserInfo(){
//       wx.getUserInfo({
//         success: function(res) {
//        console.log("获取头像信息成功！")
//           var userInfo = res.userInfo
//           var nickName = userInfo.nickName
//           var avatarUrl = userInfo.avatarUrl
//           wx.setStorage({
//             key: "user_icon",
//             data: avatarUrl
//           });
//           wx.setStorage({
//             key: "user_name",
//             data: nickName
//           })
//         }
//       });
//     }
})
