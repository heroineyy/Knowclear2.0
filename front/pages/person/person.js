// pages/person/person.js
const api=require('../../lib/api.js')
//url: api.getUrl('/knowclear/account/updateAccount/') + account.collegeId,
Page({
  data: {
    "accounts": [],
  },
  onLoad(options) {
    this.selectChatAccount();
  },

  selectChatAccount() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: api.getUrl('/knowclear/chat/selectChatAccount'),
      method: 'GET',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '获取列表信息成功');
        that.setData({
          accounts: res.data.accounts
        })
      },
      fail: () => {
        console.log("获取列表信息失败");
      },
      complete: () => {
        wx.stopPullDownRefresh();
      }
    });
  },

  chatwith: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/private/private?openid=' + e.currentTarget.dataset.openid + '&name=' + e.currentTarget.dataset.name + '&sex=' + e.currentTarget.dataset.sex
    })
  },

  onPullDownRefresh: function () {
    this.selectChatAccount();
  }
})