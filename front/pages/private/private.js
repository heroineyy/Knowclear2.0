// pages/private/private.js
const app = getApp();
var inputVal = '';
var chats = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var toView = '';

function initData(that) {
  that.setData({
    account: options
  });
  that.getchatlist();
  that.getCurrentUserInfo(); 
  wx.setNavigationBarTitle({
    title: options.name,
  })    
}



Page({
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    //聊天记录
    "chats": [],
    //当前用户的信息
    "profile": {},
    //从上一个页面获取的聊天对象信息
    account: {},
    content:'',
    toView:''
  },
  //页面加载函数
  onLoad: function (options) {
    initData(this);
  },



  //获取聊天信息
  getchatlist() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: 'https://knowclear.top/knowclear/chat/selectChatList/' + that.data.account.openid,
      method: 'GET',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '获取留言记录成功');
        that.setData({
          chats: res.data.chats
        })
      },
      fail: () => {
        console.log("获取留言记录失败");
      }
    });
  },

  //获取当前用户信息
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
        })
      },
      fail: () => {
        console.log("获取当前用户信息失败");
      }
    });
  },
 
  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (chats.length - 1),
      inputBottom: keyHeight + 'px'
    })
    // 计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (chats.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    var that = this;
   var chats = that.data.chats;
    chats.push({
      "sid": that.data.profile.account.openid,
      "rid": that.data.account.openid,
      //  content: e.detail.value,
      "content": that.data.content,
      "gmtCreated": ""
    });
    //发送信息
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: 'https://knowclear.top/knowclear/chat/sendChatMessage',
      method: 'POST',
      data: {
        "rid": that.data.account.openid,
        // "content": e.detail.value
        "content":that.data.content,
      },
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '发送信息成功');
        that.setData({
          content:''
        })
      },
      fail: () => {
        console.log("发送信息失败");
      }
    });
    //发完信息后让输入框的值为0
    inputVal = '';
    //更新值
    this.setData({
      chats,
      inputVal
    });
  },

  getContent(e){
    var that = this;
    that.setData({
      content:e.detail.value
    })
  }
})