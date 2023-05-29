// pages/found/found.js
const util = require("../../utils/util");
const api=require('../../lib/api.js');
Page({
  data: {
    urltext: "",
    pageSize: 6, //每页加载的数据量
    pageNum: '1', //当前页
    topics: [],
    text: '',
    aftertime: []
  },


  changeTimestamp() {
    this.data.aftertime = []
    for (var i = 0; i < this.data.topics.length; i++) {
      this.data.aftertime.push(util.getDateDiff(this.data.topics[i].gmt_modified))
    }
    this.setData({
      aftertime: this.data.aftertime
    })
 
  },
  //触底加载函数
  onReachBottom: function () {
    console.log("0000")
    var that = this;
    var pageNum = that.data.pageNum + 1; //获取当前页数并+1
    that.setData({
      pageNum: pageNum, //更新当前页数
    })
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    that.getTopicList_0(); //重新调用请求获取下一页数据
  },
  getTopicList_0() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    const collegeId = wx.getStorageSync('real_college_id');
    wx.request({
      // url: "https://knowclear.top/knowclear/topic/searchTopic/" + collegeId + "/" + that.data.urltext + "/" + that.data.pageNum + "/" + that.data.pageSize,
      url:api.getUrl("/knowclear/topic/searchTopic/")+ collegeId + "/" + that.data.urltext,
      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
      
        console.log(res, '搜索结果数组');
        var arr1 = that.data.topics; //从data获取当前datalist数组
        var arr2 = res.data.topics; //从此次请求返回的数据中获取新数组
        arr1 = arr1.concat(arr2); //合并数组
        that.setData({
          topics: arr1 //合并后更新datalist
        })
        this.changeTimestamp()
      },
      fail: (error) => {
        console.log("搜索话题失败")
        console.log(error)
      }
    })
  },
  //获取输入框内容
  expInput: function (e) {
    this.setData({
      text: e.detail.value
    })
    console.log(this.data.text)
  },
  clickDianzan: function (e) {
    var index = e.currentTarget.dataset.curindex;
    if (this.data.topics[index]) {
      var upvote = this.data.topics[index].upvote;
      var num = this.data.topics[index].upvoteNum;
      if (upvote == true) { //取消点赞
        this.data.topics[index].upvoteNum = num - 1;
        this.data.topics[index].upvote = false;
        const token = wx.getStorageSync('acc_token');
        wx.request({
           url: api.getUrl('/knowclear/upvote/cancelUpvote/') + this.data.topics[index].topicId,
          method: 'POST',
          data: {

          },
          header: { //下面是固定格式，照搬
            'Content-Type': 'application/json',
            'token': token
          },
          success: function (res) {
            console.log(res, "取消赞成功");
          },
          fail: function (err) {
            console.log(err, "取消点赞失败");
          },
        });
      } else { //点赞
        this.data.topics[index].upvoteNum = (num + 1);
        this.data.topics[index].upvote = true;
        const token = wx.getStorageSync('acc_token');
        wx.request({
          // url: "https://knowclear.top/knowclear/upvote/upvoteTopic/" + this.data.topics[index].topicId, //这里写后台点赞接口的url
          url: api.getUrl('/knowclear/upvote/upvoteTopic/') + this.data.topics[index].topicId,
          method: 'POST',
          data: {

          },
          header: { //下面是固定格式，照搬
            'Content-Type': 'application/json',
            'token': token
          },
          success: function (res) {
            console.log(res, "点赞成功");
          },
          fail: function (err) {
            console.log(err, "点赞失败");
          },
        });
      }
      this.setData({
        topics: this.data.topics
      })
    }
  },

  doSearch: function (e) {
    const token = wx.getStorageSync('acc_token');
    const collegeId = wx.getStorageSync('real_college_id');
    wx.request({
       url: api.getUrl('/knowclear/topic/searchTopic/') + collegeId + "/" + this.data.text ,
      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res.data.topics);
        this.setData({
          topics: res.data.topics
        })
        console.log(2)
      }
    })
  },
  
  //跳转话题详情
  toGambit(e) {
    wx.navigateTo({
      url: '/pages/gambit/gambit?topicid=' + e.currentTarget.dataset.topicid,
    })
    console.log(e, '当前话题id')
  },
  //跳转至他人信息页
  toOthers(e) {
    wx.navigateTo({
      url: '/pages/others/others?openid=' + e.currentTarget.dataset.openid + '&isAnonymous=' + e.currentTarget.dataset.isanonymous,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    that.setData({
      urltext: options.text
    })
    console.log(this.data.urltext)
    // this.getTopicList_0();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      pageNum: 1,
      topics: []
    })

    if (this.data.urltext != '' && this.data.text == '') {
      this.getTopicList_0();
    }
    if (this.data.text != '') {
      this.doSearch();
    }

  },
 
})