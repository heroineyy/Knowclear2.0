// pages/search/search.js
const api = require('../../lib/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    hotTopics: [],
  },
  //获取输入框内容
  expInput: function (e) {
    this.setData({
      text: e.detail.value
    })
    console.log(this.data.text)
  },
  toGambit(e) {
    wx.navigateTo({
      url: '/pages/gambit/gambit?topicid=' + e.currentTarget.dataset.topicid,
    })
    console.log(e, '当前话题id')
  },
  doSearch: function (e) {
    wx.navigateTo({
      url: '/pages/found/found?text=' + this.data.text
    })
  },
  //获取热门话题
  getTopic() {
    const token = wx.getStorageSync('acc_token');
    const collegeId = wx.getStorageSync('real_college_id');
    wx.request({
      //  url: api.getUrl('/knowclear/topic/hotTopics/' + collegeId,
      url: api.getUrl("/knowclear/topic/hotTopics/") + collegeId,
      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res.data.hotTopics, 'yes');
        this.setData({
          hotTopics: res.data.hotTopics
        })
      },
      fail: (error) => {
        console.log("获取话题失败")
        console.log(error)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.ac();
    this.getTopic();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      hasUserInfo: wx.getStorageSync('hasuserinfo')
    })
    const hasuserinfo = wx.getStorageSync('hasuserinfo');
    if (hasuserinfo == false) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000, //持续的时间
        success: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }, 500);
        },
      })
    } else {
      //切换了学校重新加载热门话题
      if (wx.getStorageSync('hasChangeSchool') == 'true') {
        this.setData({
          hotTopics: []
        })
        this.getTopic();
      }
    }
  },
})