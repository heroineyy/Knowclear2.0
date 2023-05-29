const util = require("../../utils/util");
const api=require('../../lib/api.js');

Page({
  data: {
    //页面加载
    isloading: false,
    like_url: "../../images/dianzan2.png",
    unlike_url: "../../images/dianzan.png",
    //当前账户数组
    "profile": {},
    //用户话题
    "topics": [],
    //获取用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    //时间转换
    aftertime: [],
    limit: 3,
    message: "",
    topicid_index: '',
    upvotenum: '',
    picture:"../../images/dianzan2.png",
    pageNum:0,
    pageSize:5
  },

  //页面加载
  onLoad() {
    this.setData({
      pageNum: 0,
      token: wx.getStorageSync('acc_token')
    })
     //判断是否登录
    util.ac(); 
    //获取当前用户的信息
    this.getCurrentUserInfo();
    //获取话题
    this.topic();
    //新的获取用户信息
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  //更新用户信息
  updateAccount() {
    //const token = wx.getStorageSync('acc_token');
    const account = wx.getStorageSync('account');
    wx.request({
      // url: 'https://localhost/knowclear/account/updateAccount/'+this.data.profile.account.collegeId,
      url: api.getUrl('/knowclear/account/updateAccount/') + account.collegeId,
      method: "POST",
      data: {
        "sex": this.data.userInfo.gender,
        "grade":account.grade,
        "major": account.major,
        "nickname": this.data.userInfo.nickName,
      },
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      success: function (res) {
        console.log(res, '更新用户信息成功');
        wx.showToast({
          title: '更新成功',
          duration: 1000
        })
        // wx.navigateBack({
        //   delta: 1,
        // })
      },
      fail: () => {
        console.log("更新用户信息失败")
      },
    })
  },

  //点击登录向后端更新用户信息
  getUserProfile(e) {
    var that = this;
    var complete_info = wx.getStorageSync('complete_info');
    wx.getUserProfile({
      desc: '用于完善个人信息',
      success: (res) => {
        console.log("微信获取用户信息接口success！")
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          //nickName: res.userInfo.nickName
        });
        
        wx.setStorage({
          key: "user_icon",
          data: res.userInfo.avatarUrl
        });
        wx.setStorage({
          key: "user_name",
          data: res.userInfo.nickName
        });
        that.updateAccount();
        if (complete_info == 0) {
          that.toschool();
        };
        wx.setStorageSync('hasuserinfo', true);
      }
    })

  },

  getUserInfo(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },

  //获取当前用户的信息
  getCurrentUserInfo() {
    var that = this;
    //const token = wx.getStorageSync('acc_token');
    wx.request({
      // url: "http://localhost:8001/knowclear/account/getSimpleAccount",
      url: api.getUrl('/knowclear/account/getSimpleAccount'),
      method: 'GET',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': this.data.token
      },
      success: function (res) {
        console.log(res, '获取当前用户信息成功');
        that.setData({
          account: res.data.account
        });
        wx.setStorage({
          key: "my_account",
          data: res.data.account
        });
      },
      fail: () => {
        console.log("获取当前用户信息失败");
      }
    });
  },

  //获取用户话题
  topic() {
    var that = this;
    //const token = wx.getStorageSync('acc_token');
    wx.request({
      // url: 'http://localhost:8001/knowclear/topic/getUserTopics/',
      url: api.getUrl('/knowclear/topic/getUserTopics/'+that.data.pageNum+"/"+that.data.pageSize),
      method: 'POST',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': that.data.token
      },
      success: function (res) {
        console.log(res, '获取用户话题成功');
        // if(res.data.topics.length){
        //   wx.showToast({
        //     title: '到底啦',
        //     icon: 'none',
        //     duration:500//持续的时间
        //   })
        // }
        that.setData({
          //拼接topics
          topics: [...that.data.topics, ...res.data.topics]
        });
       
        //转化时间:更新aftertime
        that.changeTimestamp();
      },
      fail: () => {
        console.log("获取用户话题失败");
      },
      complete:()=>{
        wx.showLoading();
        wx.hideLoading();
      }
    });
  },
  
  //点赞效果
  likes: function (e) {
    var that=this;
    var index = e.currentTarget.dataset.curindex; //获取索引值
    var upvote = that.data.topics[index].upvote; //获取当前话题的点赞状态
    var num = that.data.topics[index].upvoteNum; //获取点赞数量
    if (upvote) {
      that.data.topics[index].upvoteNum = num - 1;
      that.data.topics[index].upvote = false;
      wx.request({
        //url: "http://localhost:8001/knowclear/upvote/cancelUpvote/" + this.data.topics[index].topicId,
        url: api.getUrl('/knowclear/upvote/cancelUpvote/')+ that.data.topics[index].topicId,
        method: 'POST',
        header: { //下面是固定格式，照搬
          'Content-Type': 'application/json',
          'token': that.data.token
        },
        success: function (res) {
          console.log(res, "取消赞成功");
        },
        fail: function (err) {
          console.log(err, "取消点赞失败");
        },
      });
    } else {
      that.data.topics[index].upvoteNum = (num + 1);
      that.data.topics[index].upvote = true;
      wx.request({
        // url: "http://localhost:8001/knowclear/upvote/upvoteTopic/" + this.data.topics[index].topicId,
        url: api.getUrl('/knowclear/upvote/upvoteTopic/')+ that.data.topics[index].topicId,
        method: 'POST',
        header: { //下面是固定格式，照搬
          'Content-Type': 'application/json',
          'token': that.data.token
        },
        success: function (res) {
          console.log(res, "点赞成功");
        },
        fail: function (err) {
          console.log(err, "点赞失败");
        },
      });
    }
    var topic_upvoteNum='topics['+index+'].upvoteNum';
    var topic_upvote='topics['+index+'].upvote';
    this.setData({
      [topic_upvoteNum]: that.data.topics[index].upvoteNum,
      [topic_upvote]:that.data.topics[index].upvote
    })
  },

  //点击头像进入用户信息页
  toOthers(e) {
    wx.navigateTo({
      url: '/pages/others/others?openid=' + e.currentTarget.dataset.openid + '&isAnonymous=' + e.currentTarget.dataset.isAnonymous,
    })
  },

  //到指定话题
  totopic(e) {
    wx.navigateTo({
      url: '/pages/gambit/gambit?topicid=' + e.currentTarget.dataset.topicid
    })
  },

  //页面优化--下拉刷新
  onPullDownRefresh: function () {
    this.getCurrentUserInfo();
    //获取话题
    this.setData({
      topics:[],
      pageNum:0,
    })
    this.topic(() => {
      wx.stopPullDownRefresh()
    });
  },

  //图片预览
  previewImage(e) {
    util.previewImage(e);
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

  //上拉触底
  onReachBottom() {
    var that=this;
    var pageNum = that.data.pageNum+1;
    that.setData({
      pageNum:pageNum,
    })
    wx.showLoading({
      title:'加载中',
    })
    setTimeout(function(){
      wx.hideLoading()
    },500)
    that.topic();
  },

  //第一次登录到择校页面
  toschool() {
    wx.navigateTo({
      url: '/pages/setschool/setschool'
    })
  },

  //展示时，刷新点赞
  onShow() {
    var that = this;
    for (var i = 0; i < that.data.topics.length; i++) {
      if (that.data.topicid_index == that.data.topics[i].topicId) {
        var up = 'topics[' + i + '].upvote';
        var upnum = 'topics[' + i + '].upvoteNum'
        that.setData({
          [up]: that.data.message,
          [upnum]: that.data.upvotenum
        });
        break;
      }
    }

  },

  //页面置顶
  gotoaction(){
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'hhhh'
      })
    }
  },

})