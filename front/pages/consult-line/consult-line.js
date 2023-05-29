// pages/dom/dom.js
const api = require('../../lib/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collected: false,
    show: false,
    id: '',
    consultList: [],
    pageNum: 1, //当前页
    pageSize: 3 //当前页个数
  },
  change: function () {

    this.setData({
      collected: !this.data.collected
    })

  },
  onClose() {
    this.setData({
      show: true
    });
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  previewImage(e) {
    console.log(e);
    let current = e.currentTarget.dataset.current;
    let urls = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.gettopic()
  },
  gettopic1() {
    const token = wx.getStorageSync('acc_token');
    const collegeId = wx.getStorageSync('real_college_id');
    wx.request({
      // url:'https://knowclear.top/knowclear/consult/getConsultList/'+collegeId+'/'+this.data.id+'/'+'1'+'/'+this.data.consultList.length,
      url: api.getUrl('/knowclear/consult/getConsultList/') + collegeId + '/' + this.data.id + '/' + this.data.pageNum + '/' + this.data.pageSize,
      method: "POST",
      data: {},
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res)
        this.setData({
          consultList: res.data.consultList
        })
      }
    })
  },
  gettopic() {
    const token = wx.getStorageSync('acc_token');
    const collegeId = wx.getStorageSync('real_college_id');
    wx.request({
      // url:'https://knowclear.top/knowclear/consult/getConsultList/'+collegeId+'/'+this.data.id+'/'+this.data.pageNum1+'/'+this.data.pape,
      url: api.getUrl('/knowclear/consult/getConsultList/') + collegeId + '/' + this.data.id + '/' + this.data.pageNum + '/' + this.data.pageSize,
      method: "POST",
      data: {},
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res)
        this.setData({
          consultList: res.data.consultList
        })
      }
    })
  },
  upvote: function (e) {
    const token = wx.getStorageSync('acc_token');
    var id1 = e.currentTarget.dataset.id1;
    var num = this.data.consultList[id1].upvoteNum;
    this.data.consultList[id1].upvoteNum = (num + 1);
    this.data.consultList[id1].upvote = true
    wx.request({
      // url: 'https://knowclear.top/knowclear/consult-upvote/upvoteConsult/' + this.data.consultList[id1].consultId,
      url: api.getUrl('/knowclear/consult-upvote/upvoteConsult/') + this.data.consultList[id1].consultId,
      method: "POST",
      data: {},
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res)
      }
    })
    this.setData({
      consultList: this.data.consultList
    })
  },
  //取消点赞
  cancleupvote: function (e) {
    const token = wx.getStorageSync('acc_token');
    var id1 = e.currentTarget.dataset.id1;
    var num = this.data.consultList[id1].upvoteNum;
    this.data.consultList[id1].upvoteNum = (num - 1);
    this.data.consultList[id1].upvote = false
    wx.request({
      url: api.getUrl('/knowclear/consult-upvote/cancelUpvote/') + this.data.consultList[id1].consultId,
      method: "POST",
      data: {},
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res);
      }
    })
    this.setData({
      consultList: this.data.consultList
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.gettopic1()
  },

  loadData: function (tail, callback) {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    const real_college_id = wx.getStorageSync('real_college_id')
    wx.request({
      url: api.getUrl('/knowclear/consult/getConsultList/') + real_college_id + '/' + this.data.id,
      //+'/'+that.data.pageNum1+'/'+this.data.pape,
      method: "POST",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res, '事务话题数组');
        var arr1 = that.data.consultList; //从data获取当前datalist数组
        var arr2 = res.data.consultList; //从此次请求返回的数据中获取新数组
        arr1 = arr1.concat(arr2); //合并数组
        that.setData({
          consultList: arr1 //合并后更新datalist
        })
        if (callback) {
          callback();
        }
        if (res.data.consultList.length == 0) {
          wx.showToast({
            title: '没有资讯话题了哦',
            icon: 'none',
          })
        }
      },
      fail: (err) => {
        console.info(err)
      },
      complete: function () {}
    })
  },



  // 上滑加载更多
  onReachBottom: function (e) {
    var that = this;
    var pageNum1 = that.data.pageNum1 + 1; //获取当前页数并+1
    that.setData({
      pageNum1: pageNum1, //更新当前页数
    })

    var loadingData = this.data.loadingData,
      that = this;
    if (loadingData) {
      return;
    }
    this.setData({
      loadingData: true
    });
    that.loadData(true, () => {
      that.setData({
        loadingData: false
      });
      wx.hideLoading();
    });

    // 加载数据,模拟耗时操作
    // wx.showLoading({
    //   title: '数据加载中...',
    // });
    // setTimeout(function() {
    //   that.loadData(true, () => {
    //     that.setData({
    //       hidden: true,
    //       loadingData: false
    //     });
    //     wx.hideLoading();
    //   });
    //   // console.info('上拉数据加载完成.');
    // }, 100);
  }
})