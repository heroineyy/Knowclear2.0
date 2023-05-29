// pages/chat/chat.js
const util = require("../../utils/util");
const api = require('../../lib/api.js');
Page({

  data: {
    arr: [],
    total: 0,
    current: 0,
    isShow: false

  },

  //跳转至标签内页
  toTag(e) {
    wx.navigateTo({
      url: '/pages/tag/tag?labelId=' + e.currentTarget.dataset.labelid,
    })

  },


  onLoad: function (options) {
    this.getTopicList_0();
  },

  // 触底加载5条数据
  onReachBottom: function () {
    // 如果数据请求完整，显示提示并返回
    if (this.data.isShow == true) {
      wx.showToast({
        title: '没有啦',
      })
      return
    } else {
      // 否则继续请求下一页
      this.data.current++
      const collegeid = wx.getStorageSync('real_college_id')
      wx.request({
        url: api.getUrl('/knowclear/label/selectAllLabelByCollegeId/') + collegeid + '/0/' + this.data.current + '/5',
        success: (res) => {
          if (res.data.labels.length < 5) {
            this.setData({
              isShow: true
            })
          }
          this.setData({
            arr: [...this.data.arr, ...res.data.labels]
          })
        }
      })
    }
  },

  // 懒加载获取标签
  getTopicList_0() {
    const token = wx.getStorageSync('acc_token');
    const collegeid = wx.getStorageSync('real_college_id')
    var that = this;
    wx.request({
      url: api.getUrl('/knowclear/label/selectAllLabelByCollegeId/') + collegeid + '/0/' + that.data.current + '/5',

      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        that.data.current++ //当前页面+1         
        console.log(that.data.current)
        that.setData({
          arr: res.data.labels
        })
      },
      fail: (error) => {
        console.log("获取小屋失败")
        console.log(error)
      }
    })
  },


  onShow: function () {
    if (wx.getStorageSync('hasAddLabel') == true) {
      this.setData({
        arr: [],
        total: 0,
        current: 0,
        isShow: false
      })
      this.getTopicList_0();
    }
  },

  clickToCreate: function () {
    wx.navigateTo({
      url: '../createNew/createNew',
    })
  }
})