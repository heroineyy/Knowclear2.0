// pages/person/person.js
Page({
  data: {
    "accounts": [
      //{
      //     "openid": "1",
      //     "sex": 1,
      //     "grade": "1",
      //     "major": "1",
      //     "collegeId": 1,
      //     "nickname": "哈哈"
      //   },
      //   {
      //     "openid": "3",
      //     "sex": 2,
      //     "grade": "1",
      //     "major": "111",
      //     "collegeId": 1,
      //     "nickname": "11"
      //   },
      //   {
      //     "openid": "4",
      //     "sex": 1,
      //     "grade": "1",
      //     "major": "1111",
      //     "collegeId": 1,
      //     "nickname": "233"
      //   }
    ],
  },
  onLoad(options) {
    this.selectChatAccount();
  },

  selectChatAccount() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: 'https://knowclear.top/knowclear/chat/selectChatAccount',
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