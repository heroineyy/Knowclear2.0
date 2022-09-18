Page({
  data: {
    text: "",
    i:[1,2,3]
  },
  expInput: function (e) {
    this.setData({ text: e.detail.value })
    console.log(this.data.text)
  },
//修改信息
change(){
  const token=wx.getStorageSync('token');
  wx.request({
    url: 'https://knowclear.top/knowclear/account/updateAccount/1',
    method:"POST",
    data:{
       "sex":1,
            "grade":"你好呀！",
            "major":"1",
            "nickname":"haha"
    },
    header: {       //下面是固定格式，照搬
       'Content-Type': 'application/json',
      'token': token
    },
    success:function(res){
      console.log(res,'yes');
      console.log(token);
      
    }})
},
Jump: function (e) {
  // 获取点击选项卡的下标
  var id = e.currentTarget.dataset.id;
console.log(id)
console.log(this.data.i[0])
},
ComponentListener(e){
  let info = e.detail;
},

  //获取token
  getToken(){
    var token = getApp().globalData.token;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({    //发起网络请求
            url:"https://knowclear.top/knowclear/account/login/"+res.code,
            method: 'POST',
            data: {
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            complete(res){
              console.log(res.data.token);
              wx.setStorageSync("token",res.data.token);
            }
            // success: function (res) {
            //   console.log(res)
            // },
            // fail:()=>{
            //   console.log("获取token失败")
            // }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })  
  },
  getTopicList_0(){
    const token=wx.getStorageSync('token');
    wx.request({
      url: 'https://knowclear.top/knowclear/topic/searchTopic/1/'+this.data.text,
      method:"GET",
      data:{
      },
      header: {       //下面是固定格式，照搬
         'Content-Type': 'application/json',
        'token': token
      },
      success:function(res){
        console.log(res,'yes');
        console.log(token)
      },
      fail:(error)=>{
        console.log("获取闲聊页面话题失败")
        console.log(error)
      }
    })
},
//简介
getTopicList_1(){
  const token=wx.getStorageSync('token');
  wx.request({
    url: 'https://knowclear.top/knowclear/account/getSimpleAccount',
    method:"GET",
    data:{
    },
    header: {       //下面是固定格式，照搬
       'Content-Type': 'application/json',
      'token': token
    },
    success:function(res){
      console.log(res,'yes');
      console.log(token)
      wx.setStorageSync('collegeId',res.data.profile.account.collegeId);
    },
    fail:(error)=>{
      console.log("获取闲聊页面话题失败")
      console.log(error)
    }
  })
},
handle(){
  //判断缓存中有没有token
  const token=wx.getStorageSync('token');
  //判断
  if(!token){
    wx.navigateTo({
      url: '/pages/dom4/dom4',
    })
    return; 
  }}
  
})





























// // pages/news/news.js
// Page({
//   handle(){
// //判断缓存中有没有token
// const token=wx.getStorageSync('token');
// //判断
// if(!token){
//   wx.navigateTo({
//     url: '/pages/dom4/dom4',
//   })
//   return; 
// }
// console.log("已经存在");
//   },
//   handleGetUserInfo(e){     console.log(e);
//     //获取用户信息
//     const {encryptedData,rawData,iv,sianature} = e.detail;
//     //获取小程序登录成功后的code值
// wx.login({
//     success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//         console.log(res)
//         if (res.code) {
//             //发起网络请求
//             wx.request({
//                 url: 'https://knowclear.top/knowclear/account/login/1',
//                 method: 'POST',
//                 data: {
//                     // x: '',
//                     // y: ''
//                     encryptedData:encryptedData,
//                     rawData:rawData,
//                     iv:iv,
//                     sianature:sianature,
//                     code: res.code //将code发给后台拿token
//                 },
//                 header: {
//                     'content-type': 'application/json' // 默认值
//                 },
//                 success: function(res) {
//                     // 存token
//                     console.log('token=' + res.data.data.token)
//                     that.globalData.token = res.data.data.token; //拿到后将token存入全局变量  以便其他页面使用
                  
//                 }
//             })
//         } else {
//             console.log('获取用户登录态失败！' + res.errMsg)
//         }
//     }
// });

// //发送请求，获取用户的token值
  
 
// // const res=wx.request({
// //   url: ' https://knowclear.top/knowclear/account/login/1',
// //   data: {encryptedData,rawData,iv,sianature},
// //   method: "POST"
// // });
// //  console.log(res);
// }
// })