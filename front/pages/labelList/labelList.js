// pages/myhouse/myhouse.js
const api = require('../../lib/api.js');
Page({

  data: {
    arr: [],
    total: 0,
    current: 1,
    pageSize:7,
    isShow: false
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
      const token = wx.getStorageSync('acc_token');

      wx.request({
        //  url: api.getUrl('/knowclear/label/selectAllLabelByCollegeId/' + collegeid + '/0/' + this.data.current + '/5',
        url: api.getUrl("/knowclear/label/selectAllLabelByCollegeId/") + collegeid + '/0/'
        + this.data.current + '/5',
        success: (res) => {
          console.log('res.data.labels', res.data.labels)
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
    wx.request({ // 首次请求商品列表
      //  url: api.getUrl('/knowclear/label/selectAllLabelByCollegeId/' + collegeid + '/0/0/5',
      url: api.getUrl('/knowclear/label/selectAllLabelByCollegeId/') + collegeid + '/0'+'/'+that.data.current+'/'+that.data.pageSize,
      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, 'yes');
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

  chosen: function (e) {
    console.log(e);
    wx.setStorageSync('chooseLabel', e.currentTarget.dataset.item.labelId);
    wx.setStorageSync('labelName', e.currentTarget.dataset.item.name);
    wx.navigateBack({
      delta: 0,
    })
  }
})