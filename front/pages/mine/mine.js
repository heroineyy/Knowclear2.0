Page({
  data: {
    //页面加载
    isloading: false,
    like_url: "../../images/dianzan2.png",
    unlike_url: "../../images/dianzan.png",
    like_flag: false,
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
    current: '',
    limit: 3,
    message: "",
    topicid_index: '',
    upvotenum: ''
  },

  //页面加载
  onLoad() {
    this.ac();
    //获取当前用户的信息
    this.setData({
      current: 0
    })
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
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: 'https://knowclear.top/knowclear/account/updateAccount/'+this.data.profile.account.collegeId,
      method: "POST",
      data: {
        "sex": this.data.profile.account.sex,
        "grade": this.data.profile.account.grade,
        "major": this.data.profile.account.major,
        "nickname": wx.getStorageSync('user_name'),
      },
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '更新用户信息成功');
        wx.showToast({
          title: '更新成功',
          duration: 1000
        })
        wx.navigateBack({
          delta: 1,
        })
      },
      fail: () => {
        console.log("更新用户信息失败")
      },
    })
  },


  //点击登录向后端更新用户信息
  getUserProfile(e) {
    var nickName = this.data.profile.account.nickname
    var that = this;
    var complete_info = wx.getStorageSync('complete_info');
    wx.getUserProfile({
      desc: '用于完善个人信息',
      success: (res) => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          nickName: res.userInfo.nickName
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
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: "https://knowclear.top/knowclear/account/getSimpleAccount",
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
        });
      },
      fail: () => {
        console.log("获取当前用户信息失败");
      }
    });
  },

  //获取用户话题
  topic(cb) {
    var that = this;
    that.setData({
      isloading: true,
      current: that.data.current + 1
    })
    wx.showLoading({
      title: '数据加载中...',
    })

    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: 'https://knowclear.top/knowclear/topic/getUserTopics/' + that.data.current + '/' + that.data.limit,
      method: 'POST',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '获取用户话题成功');
        that.setData({
          //topics: res.data.topics
          topics: [...that.data.topics, ...res.data.topics]
        });
        that.changeTimestamp();
      },
      fail: () => {
        console.log("获取用户话题失败");
      },
      complete: () => {
        // wx.stopPullDownRefresh()
        cb && cb();
        wx.hideLoading();
        that.setData({
          isloading: false
        })
      }
    });
  },
  //点赞效果
  likes: function (e) {
    var index = e.currentTarget.dataset.curindex; //获取索引值
    var upvote = this.data.topics[index].upvote; //获取当前话题的点赞状态
    var num = this.data.topics[index].upvoteNum; //获取点赞数量
    if (upvote) {
      this.data.topics[index].upvoteNum = num - 1;
      this.data.topics[index].upvote = false;
      const token = wx.getStorageSync('acc_token');
      wx.request({
        url: "https://knowclear.top/knowclear/upvote/cancelUpvote/" + this.data.topics[index].topicId,
        method: 'POST',
        data: {
          topic_id: this.data.topics[index].topicId
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
    } else {
      this.data.topics[index].upvoteNum = (num + 1);
      this.data.topics[index].upvote = true;
      const token = wx.getStorageSync('acc_token');
      wx.request({
        url: "https://knowclear.top/knowclear/upvote/upvoteTopic/" + this.data.topics[index].topicId, //这里写后台点赞接口的url
        method: 'POST',
        data: {
          topic_id: this.data.topics[index].topicId
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
    console.log(e)
  },
  //页面优化--下拉刷新
  onPullDownRefresh: function () {
    this.getCurrentUserInfo();
    //获取话题
    this.setData({
      current:'',
      topics:[]
    })
    this.topic(() => {
      wx.stopPullDownRefresh()
    });
  },

  //图片预览
  previewImage(e) {
    let current = e.currentTarget.dataset.src;
    console.log(e)
    let urls = e.currentTarget.dataset.images;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //时间转换
  getDateDiff(dateTime) {
    let dateTimeStamp = new Date(dateTime).getTime();
    let result = '';
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let year = day * 365;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return;
    }
    let monthEnd = diffValue / month;
    let weekEnd = diffValue / (7 * day);
    let dayEnd = diffValue / day;
    let hourEnd = diffValue / hour;
    let minEnd = diffValue / minute;
    let yearEnd = diffValue / year;
    if (yearEnd >= 1) {
      result = dateTime;
    } else if (monthEnd >= 1) {
      result = "" + parseInt(monthEnd) + "月前";
    } else if (weekEnd >= 1) {
      result = "" + parseInt(weekEnd) + "周前";
    } else if (dayEnd >= 1) {
      result = "" + parseInt(dayEnd) + "天前";
    } else if (hourEnd >= 1) {
      result = "" + parseInt(hourEnd) + "小时前";
    } else if (minEnd >= 1) {
      result = "" + parseInt(minEnd) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
  },
  changeTimestamp() {
    this.data.aftertime = []
    for (var i = 0; i < this.data.topics.length; i++) {
      this.data.aftertime.push(this.getDateDiff(this.data.topics[i].gmtCreated))
    }
    this.setData({
      aftertime: this.data.aftertime
    })
  },

  //上拉触底
  onReachBottom() {
    if (this.data.isloading) return;
    this.topic();
  },

  //第一次登录到择校页面
  toschool() {
    wx.navigateTo({
      url: '/pages/setschool/setschool'
    })
  },

  //
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
 //  页面初始提示
 ac() {
  const info = wx.getStorageSync('complete_info');
  const hasuserinfo = wx.getStorageSync('hasuserinfo');
  if (hasuserinfo == false) {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000, //持续的时间
    })
  } else {
    if (info == 0) {
      wx.showToast({
        title: '请先完善择校信息',
        icon: 'none',
        duration: 2000, //持续的时间
        success: function () {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/setschool/setschool',
            })
          }, 2000);
        },
      })
    } else {
      if (info == 3) {
        wx.showModal({
          title: "提示",
          content: "您只能在自己的学校发布话题和评论\n点击确定回到信息修改页面\n点击取消继续看看",
          success: function (res) {
            if (res.confirm) {
              console.log("点击了确定");
              wx.navigateTo({
                url: '/pages/setschool/setschool',
              })
            } else if (res.cancel) {
              console.log("点击了取消");
              //              wx.switchTab({
              //                 url: '/pages/index/index',
              //              })
              return;
            }
          }
        })
      }
    }
  }
},
})