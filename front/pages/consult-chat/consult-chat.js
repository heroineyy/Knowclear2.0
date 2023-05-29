// pages/consult-chat/consult-chat.js

var plugin = requirePlugin("chatbot");
const api = require('../../lib/api.js');
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    safe: true,
    consultList: [],
    urlconsultId: '',
    comments: [],
    children: [],
    show: false,
    text: '',
    backname: '',
    backid: '',
    isAnonymous: '',
    aa: '0',
    sex: ''
  },
  previewImage(e) {
    let current = e.currentTarget.dataset.current;
    let urls = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //获取用户信息
  getuser() {
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: api.getUrl('/knowclear/account/getSimpleAccount'),
      method: "GET",
      data: {},
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res, 'yes');
        this.setData({
          comments: res.data.comments
        })
      },
      fail: (error) => {
        console.log("获取话题失败")
        console.log(error)
      }
    })
  },
  selectNiming() {
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

  //获取资讯话题评论
  getcomment() {
    wx.request({
      url: api.getUrl('/knowclear/consult-comment/getConsultComments/') + this.data.urlconsultId,
      method: "POST",
      data: {},
      header: {

      },
      success: (res) => {
        console.log(res, 'yes');
        this.setData({
          comments: res.data.comments
        })
      },
      fail: (error) => {
        console.log("获取话题失败")
        console.log(error)
      }
    })
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
    if (this.data.show == true) {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        isAnonymous: 0
      })
      this.setData({
        backname: this.data.consultList[0].publisher
      })
      this.setData({
        backid: 'null'
      })
      this.setData({
        show: !this.data.show
      })
    }
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
              duration: 3000,
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
    wx.showToast({
      title: '内容检测中，请稍后。。。',
      icon: 'none',
      duration: 3000,
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
          url: api.getUrl('/knowclear/consult-comment/addConsultComment'),
          method: "POST",
          data: {
            "parentId": backid,
            "consultId": urlconsultId,
            "isAnonymous": aa,
            "content": content
          },
          header: {
            'Content-Type': 'application/json',
            'token': token
          },
          success: (res) => {
            that.onShow();
            console.log(res, 'yes');
            console.log(45);
            that.getcomment()
          },
          fail: (error) => {
            console.log("获取话题失败")
            console.log(error)
          }
        })
        that.onClose()
      }
    }, 3000)

  },
  //获取资讯话题
  getTopic() {
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: api.getUrl('/knowclear/consult/getOneConsult/') + this.data.urlconsultId,
      method: "POST",
      data: {},
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        console.log(res, 'yes');
        this.setData({
          consultList: res.data.consultList
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


    console.log(options)
    this.setData({
      urlconsultId: options.consult,
      safe: true
    })

    this.getTopic();
    this.getcomment()
  },
  //点赞
  upvote() {
    const token = wx.getStorageSync('acc_token');
    var num = this.data.consultList[0].upvoteNum;
    this.data.consultList[0].upvoteNum = (num + 1);
    this.data.consultList[0].upvote = true
    wx.request({
      url: api.getUrl('/knowclear/consult-upvote/upvoteConsult/') + this.data.urlconsultId,
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
  cancleupvote() {
    const token = wx.getStorageSync('acc_token');
    var num = this.data.consultList[0].upvoteNum;
    this.data.consultList[0].upvoteNum = (num - 1);
    this.data.consultList[0].upvote = false
    wx.request({
      url: api.getUrl('/knowclear/consult-upvote/cancelUpvote/') + this.data.urlconsultId,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getcomment()
    this.setData({
      safe: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})