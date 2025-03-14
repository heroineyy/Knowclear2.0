const util = require("../../utils/util");
const api = require('../../lib/api.js');
Page({
  data: {
    //当前导航栏
    navbar: ['闲聊', '事务', '咨讯'],
    currentTab: 0,
    //轮播图数组
    bannerList: [],
    //闲聊话题数组
    pageSize: 4, //每页加载的数据量
    pageNum: 1, //当前页
    topics_chat: [],
    //闲聊标签数组
    labels_0: [],
    //事务标签数组
    labels_1: [],
    //事务话题数组
    pageSize1: 4, //每页加载的数据量
    pageNum1: 1, //当前页
    topics_business: [],
    consult0: [],
    consult1: [],
    consult2: [],
    consult3: [],
    collegeId: '',
    aftertime: [],
    aftertime1: [],
    upImage: [],
    hasUserInfo: false,
    loadBool: true,
  },
  consultId: '1',
  onLoad() {
    this.getBannerList();
    util.ac();
    this.getTopicList_0(); //获取闲聊页面话题
    this.getLabelList_0(); //获取闲聊热度标签
  },
  onShow() {
    this.setData({
      hasUserInfo: wx.getStorageSync('hasuserinfo'),
    })
    //若为图片预览则不重新加载页面
    if (this.data.isPreview) {
      this.setData({
        isPreview: false
      })
      return;
    } else {
      if (wx.getStorageSync('hasuserinfo') == true) {
        //切换了学校重新加载
        if (wx.getStorageSync('hasChangeSchool') == 'true') {
          this.getBannerList();
          this.setData({
            pageNum: 1,
            topics_chat: [],
            pageNum1: 1,
            topics_business: [],
            currentTab: 0
          })
          console.log("切换学校成功")
          this.getTopicList_0(); //获取闲聊页面话题
          this.getLabelList_0(); //获取闲聊热度标签
          this.getTopic();
        }
        //发布话题后更新话题
        if (wx.getStorageSync('hasPublish') == 'true') {
          this.setData({
            pageNum: 1,
            topics_chat: []
          })
          this.getTopicList_0(); //获取闲聊页面话题
        }
        //创建小屋后更新标签
        if (wx.getStorageSync('hasAddLabel') == true) {
          this.setData({
            labels_0: []
          })
          this.getLabelList_0(); //获取闲聊页面话题
        }
      } else { //必须先登录
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
      }

      //闲聊页面点赞更新
      for (var i = 0; i < this.data.topics_chat.length; i++) {
        if (this.data.topicid_index == this.data.topics_chat[i].topicId) {
          var up = 'topics_chat[' + i + '].upvote';
          var upnum = 'topics_chat[' + i + '].upvoteNum'
          this.setData({
            [up]: this.data.message,
            [upnum]: this.data.upvotenum
          });
          break;
        }
      };
      //事务页面点赞更新
      for (var i = 0; i < this.data.topics_business.length; i++) {
        if (this.data.topicid_index == this.data.topics_business[i].topicId) {
          var up = 'topics_business[' + i + '].upvote';
          var upnum = 'topics_business[' + i + '].upvoteNum'
          this.setData({
            [up]: this.data.message,
            [upnum]: this.data.upvotenum
          });
          break;
        }
      };


    }
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //切换bar
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (this.data.currentTab == 1) {
      this.setData({
        topics_chat: [],
        pageNum1: 1,
        topics_business: [],  
      })
      this.getTopicList_1();
      this.getLabelList_1();
    }
    if (this.data.currentTab == 2) {
      // wx.showLoading({
      //   title: '数据加载中',
      // })
      // setTimeout(function () {
      //   wx.hideLoading()
      // }, 500)
      this.getTopic();
    }
  },
  //更多
  toMoreLabelChat() {
    wx.navigateTo({
      url: '/pages/chat-tag/chat'
    })
  },
  toMoreLabelBusiness() {
    wx.navigateTo({
      url: '/pages/business-tag/business'
    })
  },
  //跳转至话题内页
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
  //跳转至更多的标签页
  toMoreLabel(e) {
    wx.navigateTo({
      url: '/pages/chat-tag/chat-tag',
    })
  },
  //闲聊页面点赞
  clickDianzan_chat(e) {
    console.log(e, '当前点赞话题索引')
    var index = e.currentTarget.dataset.curindex;
    if (this.data.topics_chat[index]) {
      var upvote = this.data.topics_chat[index].upvote;
      if (upvote == true || upvote == false) {
        var num = this.data.topics_chat[index].upvoteNum;
        const token = wx.getStorageSync('acc_token');
        if (upvote) { //取消点赞
          this.data.topics_chat[index].upvoteNum = num - 1;
          this.data.topics_chat[index].upvote = false;
          wx.request({
            //url: "https://knowclear.top/knowclear/upvote/cancelUpvote/" + this.data.topics_chat[index].topicId,
            url: api.getUrl('/knowclear/upvote/cancelUpvote/') + this.data.topics_chat[index].topicId,
            method: 'POST',
            data: {
              topic_id: this.data.topics_chat[index].topicId
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
          this.data.topics_chat[index].upvoteNum = (num + 1);
          this.data.topics_chat[index].upvote = true;
          wx.request({
            //url: "https://knowclear.top/knowclear/upvote/upvoteTopic/" + this.data.topics_chat[index].topicId,
            url: api.getUrl('/knowclear/upvote/upvoteTopic/') + this.data.topics_chat[index].topicId,
            method: 'POST',
            data: {},
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
        var topic_upvoteNum = 'topics_chat[' + index + '].upvoteNum';
        var topic_upvote = 'topics_chat[' + index + '].upvote';
        this.setData({
          [topic_upvoteNum]: this.data.topics_chat[index].upvoteNum,
          [topic_upvote]: this.data.topics_chat[index].upvote
        })
      }
    }
  },
  //事务页面点赞
  clickDianzan_business(e) {
    console.log(e, '当前点赞话题索引')
    var index = e.currentTarget.dataset.curindex;
    if (this.data.topics_business[index]) {
      var upvote = this.data.topics_business[index].upvote;
      if (upvote == true || upvote == false) {
        var num = this.data.topics_business[index].upvoteNum;
        const token = wx.getStorageSync('acc_token');
        if (upvote) { //取消点赞
          this.data.topics_business[index].upvoteNum = num - 1;
          this.data.topics_business[index].upvote = false;
          wx.request({
            //url: "https://knowclear.top/knowclear/upvote/cancelUpvote/" + this.data.topics_business[index].topicId,
            url: api.getUrl('/knowclear/upvote/cancelUpvote/') + this.data.topics_business[index].topicId,
            method: 'POST',
            data: {
              topic_id: this.data.topics_business[index].topicId
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
          this.data.topics_business[index].upvoteNum = (num + 1);
          this.data.topics_business[index].upvote = true;
          wx.request({
            //url: "https://knowclear.top/knowclear/upvote/upvoteTopic/" + this.data.topics_business[index].topicId,
            url: api.getUrl('/knowclear/upvote/upvoteTopic/') + this.data.topics_business[index].topicId,
            method: 'POST',
            data: {
              topic_id: this.data.topics_business[index].topicId
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
        var topic_upvoteNum = 'topics_business[' + index + '].upvoteNum';
        var topic_upvote = 'topics_business[' + index + '].upvote';
        this.setData({
          [topic_upvoteNum]: this.data.topics_business[index].upvoteNum,
          [topic_upvote]: this.data.topics_business[index].upvote
        })
      }
    }
  },
  //跳转至标签内页
  toTag(e) {
    wx.navigateTo({
      url: '/pages/tag/tag?labelId=' + e.currentTarget.dataset.labelid,
    })
    // console.log(e)
  },
  //图片预览
  previewImage(e) {
    var that = this;
    that.setData({
      isPreview: true
    })
    let current = e.currentTarget.dataset.src;
    console.log(e)
    let urls = e.currentTarget.dataset.images;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //获取轮播图
  getBannerList() {
    var that = this;
    const real_college_id = wx.getStorageSync('real_college_id')
    wx.request({
      // url: api.getUrl('/knowclear/banner/getBannerImgs/' + real_college_id,
      url: api.getUrl('/knowclear/banner/getBannerImgs/') + real_college_id,
      method: 'GET',
      data: {
        // college_id:'1'
      },
      success: function (res) {
        console.log(res, '轮播图数组');
        that.setData({
          bannerList: res.data.banner
        })
      },
      fail: (err) => {
        console.log(err)
        console.log("获取轮播图失败")
      }
    })
  },
  //触底加载函数
  onReachBottom: function () {
    var that = this;
    if (that.data.currentTab == 0) {
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
    }
    if (that.data.currentTab == 1) {
      var pageNum1 = that.data.pageNum1 + 1; //获取当前页数并+1
      that.setData({
        pageNum1: pageNum1, //更新当前页数
      })
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
      that.getTopicList_1(); //重新调用请求获取下一页数据
    }

  },
  //获取闲聊页面话题 携带token
  getTopicList_0() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    const real_college_id = wx.getStorageSync('real_college_id')
    wx.request({
      //url: "https://knowclear.top/knowclear/topic/selectTopicByCollegeId/" + real_college_id + "/0/" + that.data.pageNum + "/" + that.data.pageSize,
      url: api.getUrl('/knowclear/topic/selectTopicByCollegeId/') + real_college_id + "/0/" + that.data.pageNum + "/" + that.data.pageSize,
      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res, '闲聊话题数组');
        that.setData({
          //拼接topics
          topics_chat: [...that.data.topics_chat, ...res.data.topics]
        });
        that.changeTimestamp();
        wx.setStorageSync('hasPublish', 'false');
        wx.setStorageSync('hasChangeSchool', 'false');
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  //获取闲聊页面的热度标签
  getLabelList_0() {
    var that = this;
    const real_college_id = wx.getStorageSync('real_college_id')
    const classify = '0';
    wx.request({
      //url: "https://localhost:8001/knowclear/label/selectLabelsByCollegeId/" + real_college_id + '/' + classify,
      url: api.getUrl('/knowclear/label/selectLabelsByCollegeId/') + real_college_id + '/' + classify,
      method: 'GET',
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res, '闲聊标签数组');
        that.setData({
          labels_0: res.data.labels
        })
        wx.setStorageSync('hasAddLabel', false)
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },

  //获得事务页面话题 携带token
  getTopicList_1() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    const real_college_id = wx.getStorageSync('real_college_id');
    wx.request({
      //url: "https://localhost:8001/knowclear/topic/selectTopicByCollegeId/" + real_college_id + "/1/" + that.data.pageNum1 + "/" + that.data.pageSize1,
      url: api.getUrl('/knowclear/topic/selectTopicByCollegeId/') + real_college_id + "/1/" + +that.data.pageNum1 + "/" + that.data.pageSize1,
      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
      
          that.setData({
            //拼接topics
            topics_business: [...that.data.topics_business, ...res.data.topics]
          });
          that.changeTimestamp(1);   
      },
      fail: (err) => {
        console.log(err)
      },
    })
},
  //获得事务页面的热度标签
  getLabelList_1() {
    var that = this;
    const real_college_id = wx.getStorageSync('real_college_id');
    const classify = '1';
    wx.request({
      //url: "https://localhost:8001/knowclear/label/selectLabelsByCollegeId/" + real_college_id + '/' + classify,
      url: api.getUrl('/knowclear/label/selectLabelsByCollegeId/') + real_college_id + '/' + classify,
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res, '事务标签数组');
        that.setData({
          labels_1: res.data.labels
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  //请求数据获取资讯
  getTopic() {
    const token = wx.getStorageSync('acc_token');
    const collegeId = wx.getStorageSync('real_college_id');
    wx.request({
      //url: 'https://localhost:8001/knowclear/consult/selectSimpleConsult/' + collegeId,
      url: api.getUrl('/knowclear/consult/selectSimpleConsult/') + collegeId,
      method: "GET",
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res);
        this.setData({
          consult0: res.data.consult0
        })
        this.setData({
          consult1: res.data.consult1
        })
        this.setData({
          consult2: res.data.consult2
        })
        this.setData({
          consult3: res.data.consult3
        })
      },
      fail: (error) => {
        console.log("获取闲聊页面话题失败")
        console.log(error)
      }
    })
  },
  //时间转换
  changeTimestamp(flag) {
    if (flag == 1) {
      this.data.aftertime1 = []
      for (var i = 0; i < this.data.topics_business.length; i++) {
        this.data.aftertime1.push(util.getDateDiff(this.data.topics_business[i].gmt_modified))
      }
      this.setData({
        aftertime1: this.data.aftertime1
      })
    } else {
      this.data.aftertime = []
      for (var i = 0; i < this.data.topics_chat.length; i++) {
        this.data.aftertime.push(util.getDateDiff(this.data.topics_chat[i].gmt_modified))
      }
      this.setData({
        aftertime: this.data.aftertime
      })

    }

  },
  //时间转换
  changeTimestamp1() {
    this.data.aftertime1 = []
    for (var i = 0; i < this.data.topics_business.length; i++) {
      this.data.aftertime1.push(util.getDateDiff(this.data.topics_business[i].gmt_modified))
    }
    this.setData({
      aftertime1: this.data.aftertime1
    })
  },
 

  //页面优化--下拉刷新
  onPullDownRefresh: function () {
    this.getTopicList_0();
    //获取话题
    this.getTopicList_0(() => {
      wx.stopPullDownRefresh()
    });
  },
  //页面置顶
  gotoaction() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: 'hhhh'
      })
    }
  },
})