// pages/gambit/gambit.js
var plugin = requirePlugin("chatbot");
const api = require('../../lib/api.js');
const util = require("../../utils/util");
let comment = [];
Page({
  data: {
    safe: true,
    consultList: [],
    children: [],
    show: false,
    text: '',
    backname: '',
    backid: '',
    isAnonymous: '',
    aa: '0',
    sex: '',
    topic: [],
    comments: [],
    commentsChildren: [],
    content: '',
    clean: '',
    idx: '',
    placeholder: '评论',
    niming: [{
        id: '0',
        text: '公开'
      },
      {
        id: '1',
        text: '匿名'
      },
    ],
    parent: '',
    topicId: '',
    canComment: true,
    input_bottom: 0

  },
  onLoad: function (options) {
    this.getTopicContent(); //获取某一个话题详情
    this.setData({
      topicId: options.topicid
    })
    this.getComments();
  },
  

  //图片预览
  previewImage(e) {
    let current = e.currentTarget.dataset.src;
    let urls = e.currentTarget.dataset.images;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //获取某一个话题详情 携带token
  getTopicContent() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    wx.request({
      //url: "https://knowclear.top/knowclear/topic/getOneTopic/" + that.options.topicid,
      url: api.getUrl('/knowclear/topic/getOneTopic/') + that.options.topicid,
      method: 'POST',
      data: {},
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '话题详情数组');
        that.setData({
          topic: res.data.topic[0]
        })
      },
      fail: () => {
        console.log("获取话题详情失败")
      }
    })
  },
  //点击头像进入用户信息页
  toOthers(e) {
    wx.navigateTo({
      url: '/pages/others/others?openid=' + e.currentTarget.dataset.openid + '&isAnonymous=' + e.currentTarget.dataset.isanonymous,
    })
  },
  //点赞
  clickDianzan(e) {
    console.log(e, '当前点赞话题id')
    // var index=e.currentTarget.dataset.curindex;
    if (this.data.topic) {
      var upvote = this.data.topic.upvote;
      if (upvote == true || upvote == false) {
        var num = this.data.topic.upvoteNum;
        if (upvote) { //取消点赞
          this.data.topic.upvoteNum = num - 1;
          this.data.topic.upvote = false;
          const token = wx.getStorageSync('acc_token');
          wx.request({
            // url: "https://knowclear.top/knowclear/upvote/cancelUpvote/" + this.data.topic.topicId,
            url: api.getUrl('/knowclear/upvote/cancelUpvote/') + this.data.topic.topicId,
            method: 'POST',
            data: {
              topic_id: this.data.topic.topicId
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
          this.data.topic.upvoteNum = (num + 1);
          this.data.topic.upvote = true;
          const token = wx.getStorageSync('acc_token');
          wx.request({
            // url: "https://knowclear.top/knowclear/upvote/upvoteTopic/" + this.data.topic.topicId, 
            url: api.getUrl('/knowclear/upvote/upvoteTopic/') + this.data.topic.topicId, 
            method: 'POST',
            data: {
              topic_id: this.data.topic.topicId
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
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        // 修改值
        prevPage.setData({
          message: this.data.topic.upvote,
          topicid_index: this.data.topicId,
          upvotenum: this.data.topic.upvoteNum
        })
        this.setData({
          topic: this.data.topic
        });

      }
    }
  },
  //获取评论
  getComments() {
    var that = this;
    wx.request({
      // url: "https://knowclear.top/knowclear/comment/getTopicComments/" + that.options.topicid,
      url:api.getUrl('/knowclear/comment/getTopicComments/')+ that.options.topicid,
      method: 'POST',
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res, '话题评论数组');
        that.setData({
          comments: res.data.comments
        })
      },
      fail: () => {
        console.log("获取话题评论失败")
      }
    })
  },
  //获取用户输入的评论内容
  getContent(event) {
    this.content = event.detail.value
    this.setData({
      content: this.content
    })
    console.log(this.content)
  },
  //发布评论
  pubComment() {
    var that = this;
    if (that.data.content == '') {
      wx.showToast({
        icon: "none",
        title: '评论不能为空',
      })
      return;
    } else {
      if (that.data.content.replace(/ /g, "") == '') {
        wx.showToast({
          icon: "none",
          title: '评论不能为空',
        })
        return;
      }
      if (!that.data.idx) {
        wx.showToast({
          icon: "none",
          title: '请选择公开或者匿名',
        })
        return;
      }
      let commentItem = {}
      commentItem.isAnonymous = that.idx;
      console.log(commentItem.isAnonymous)
      commentItem.content = that.data.content;
      that.data.comments.push(commentItem)
      console.log(that.data.comments)
      const token = wx.getStorageSync('acc_token');
      wx.request({
        // url: "https://knowclear.top/knowclear/comment/addTopicComment",
        url:api.getUrl('/knowclear/comment/addTopicComment'),
        method: 'POST',
        data: {
          "parentId": that.data.tocommentid,
          "topicId": that.options.topicid,
          "isAnonymous": that.data.idx,
          "content": that.content
        },
        header: { //下面是固定格式，照搬
          'Content-Type': 'application/json',
          'token': token
        },
        success: function (res) {
          console.log(res, '评论成功');
          that.setData({
            comments: that.data.comments,
            content: ''
          })
          wx.showToast({
            // icon:"none",
            title: '评论成功',
          })
          that.getComments();

        },
        fail: () => {
          console.log("评论失败")
        }
      })
    }
  },

  selectNiming(e) {
    this.setData({
      aa: 0
    })
  },

  FselectNiming() {
    this.setData({
      aa: 1
    })
  },

  ComponentListener(e) {
    let info = e.detail;
    this.setData({
      backname: info.name
    })
    this.setData({
      backid: info.id
    })
    this.setData({
      isAnonymous: info.isAnonymous
    })
    this.setData({
      sex: info.sex
    })
    console.log(this.data.isAnonymous)
  },

  cleanInput: function () {
    var setMessage = {
      clean: that.content
    }
    this.setData(setMessage)
  },

  toComments(e) { //一级评论
    console.log(e.currentTarget.dataset, '当前topicId')
    this.setData({
      tocommentid: '',
      placeholder: '评论'
    })
  },
  toReply(e) { //回复一级评论
    console.log(e)
    var tonickname = e.currentTarget.dataset.tonickname;
    var tocommentid = e.currentTarget.dataset.tocommentid;
    var topicid = e.currentTarget.dataset.topicid;
    this.setData({
      tonickname: tonickname,
      tocommentid: tocommentid,
      topicid: topicid,
      placeholder: '回复' + tonickname
    })
  },

  tapItem: function (e) { //回复二级评论
    console.log(e)
    var tonickname = e.detail.tonickname;
    var tocommentid = e.detail.tocommentid;
    var topicid = e.detail.topicid;
    this.setData({
      tonickname: tonickname,
      tocommentid: tocommentid,
      topicid: topicid,
      placeholder: '回复' + tonickname
    })
  },

  databack: function (e) {
    const info = wx.getStorageSync('complete_info');
    const hasuserinfo = wx.getStorageSync('hasuserinfo');
    if (hasuserinfo == true && info == 2) {
      if (this.data.show == true) {
        this.setData({
          show: false
        })
      } else {
        var id = e.currentTarget.dataset.id;
        this.setData({
          isAnonymous: this.data.comments[id].isAnonymous
        })
        this.setData({
          backname: this.data.comments[id].account.nickname
        })
        this.setData({
          backid: this.data.comments[id].commentId
        })
        this.setData({
          show: !this.data.show
        })
      }
    } else {
      util.ac()
    };

  },
  //敏感词检测
  sensitive() {
    var i = 0;
    this.setData({
      safe: true
    })
    plugin.api.nlp('sensitive', {
      q: this.data.text,
      mode: 'cnn'
    }).then(res => {
      console.log("敏感字节检测",res)
      for (i; i < 4; i++) {
        if (res.result[i][0] == "other") {
          if (res.result[i][1] < 0.8) {
            console.log("不安全！")
            this.setData({
              safe: false
            });
            wx.showToast({
              title: 'peace&love',
              icon: 'none',
              duration: 2000,
            })
            console.log("safe1:", this.data.safe);
          } else {
            console.log("安全！")
          }
        }
      }
    });
  },
  //评论资讯话题
  comment() {
    var that = this;
    const info = wx.getStorageSync('complete_info');
    const hasuserinfo = wx.getStorageSync('hasuserinfo');
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
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '内容检测中，请稍后。。。',
        icon: 'none',
        duration: 1000,
      })
      that.sensitive();
      setTimeout(function () {
        if (that.data.safe) {
          if (that.data.text.replace(/ /g, "") == '') {
            wx.showToast({
              icon: "none",
              title: '评论不能为空',
            })
            return;
          }
          const token = wx.getStorageSync('acc_token');
          const urlconsultId = that.data.urlconsultId
          const content = that.data.text
          const backid = that.data.backid
          const aa = that.data.aa

          wx.request({
            //url: "https://knowclear.top/knowclear/comment/addTopicComment",
            url:api.getUrl('/knowclear/comment/addTopicComment'),
            method: 'POST',
            data: {
              "parentId": backid,
              "topicId": that.options.topicid,
              "isAnonymous": aa,
              "content": content
            },
            header: { //下面是固定格式，照搬
              'Content-Type': 'application/json',
              'token': token
            },
            success: function (res) {
              console.log(res, '评论成功');
              that.setData({
                comments: that.data.comments,
                content: ''
              })
              wx.showToast({
                // icon:"none",
                title: '评论成功',
              })
              that.getComments()
            },
            fail: () => {
              console.log("评论失败")
            }
          })
          that.onClose()
        }
      }, 3000)
    }
  },

  urlto(e) {
    wx.navigateTo({
      url: '/pages/others/others?openid=' + e.currentTarget.dataset.openid + '&isAnonymous=' + e.currentTarget.dataset.isanonymous,
    })
  },
  //评论框
  onClose() {
    this.setData({
      show: false
    });
  },
  backfirst() {
    const info = wx.getStorageSync('complete_info');
    const hasuserinfo = wx.getStorageSync('hasuserinfo');
    if (hasuserinfo == true && info == 2) {
      this.backfirst1();
    } else {
      util.ac()
    }
  },
  backfirst1() {
    util.ac(); //若不是不是本校不能评论\
    if (this.data.show == true) {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        isAnonymous: this.data.topic.isAnonymous
      })
      this.setData({
        backname: this.data.topic.account.nickname
      })
      this.setData({
        backid: 'null'
      })
      this.setData({
        show: true,
      })
    }
  },
  selectTap() {
    const info = wx.getStorageSync('complete_info');
    const hasuserinfo = wx.getStorageSync('hasuserinfo');
    if (hasuserinfo == true && info == 2) {
      this.setData({
        show: !this.data.show
      });
    } else {
      util.ac()
    }
  },
  //获取输入框内容
  expInput: function (e) {
    this.setData({
      text: e.detail.value
    })
  },

  onShow: function () {},
  //  页面初始提示
 
})