// pages/createNew/createNew.js
var plugin = requirePlugin("chatbot");
const api = require('../../lib/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "mytagName": "",
    "mytagContent": "",
    "mytagPicture": "",
    // college_id:1,
    // classify:0,

    upImage: []

  },
  //敏感词检测
  sensitive() {
    var i = 0;
    this.setData({
      safe: true
    })
    plugin.api.nlp('sensitive', {
      q: this.data.mytagContent + this.data.mytagName,
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

  // 小屋名字
  submitEvent: function (event) {
    var that = this;
    that.setData({
      mytagName: event.detail.value.tagname
    }); //得到输入的内容
    that.setData({
      mytagContent: event.detail.value.tagcontent
    });

    //敏感词检测
    wx.showToast({
      title: '内容检测中，请稍后。。。',
      icon: 'none',
      duration: 3000,
    })

    that.sensitive();
    setTimeout(function () {
      if (that.data.safe) {
        that.releaseYourHouse()
      }
    }, 3000)
    // this.releaseYourHouse();
  },

  // POST数据请求
  releaseYourHouse() {
    const token = wx.getStorageSync('acc_token');
    const college_id = wx.getStorageSync('college_id')
    var that = this;
      wx.request({
         url: api.getUrl('/knowclear/label/publishChatLabel/0/') + college_id,
        method: "POST",
        data: {
          "name": that.data.mytagName,
          "content": that.data.mytagContent,
          "img": that.data.mytagPicture
        },
        header: { //下面是固定格式，照搬

          'Content-Type': 'application/json',
          'token': token
        },
        success: function (res) {
          if (res.data.status == 500) {
            wx.showModal({
              title: "提示",
              content: "小屋重名，请重新填写",
            })
          } else {
            wx.navigateBack({
              delta: 0,
            })
            wx.showToast({
              title: '创建成功'
            })
            wx.setStorageSync('hasAddLabel', true)
          }
          console.log(res, 'yes');
        },
        fail: (error) => {
          console.log("发布小屋失败")
        }
      })
  },

  //图片上传
  uploadImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {

        const tempFilePaths = res.tempFilePaths[0];
        let old_data = that.data.upImage;
        let new_data = res.tempFilePaths;
        if (that.data.upImage.length + res.tempFilePaths.length <= 1) {
          that.setData({
            upImage: old_data.concat(new_data)
          })
        } else {
          wx.showToast({
            title: '上传图片不能超过1张',
            icon: "none"
          })
        }

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({
              mytagPicture: 'data:image/png;base64,' + res.data
            })
          }
        })
      }
    })
  },
  //图片预览
  previewImage(e) {
    let that = this;
    let current = e.currentTarget.dataset.src;
    let urls = that.data.upImage;
    // urls.push(current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //图片删除
  delete(e) {
    console.log(e);
    let that = this;
    let upImage = that.data.upImage;
    let index = e.currentTarget.dataset.id;
    console.log(index);
    wx.showModal({
      title: "提示",
      content: "确定要删除此图片吗？",
      success: function (res) {
        if (res.confirm) {
          console.log("点击了确定");
          upImage.splice(index, 1);
          that.setData({
            upImage
          })
        } else if (res.cancel) {
          console.log("点击了取消");
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const info = wx.getStorageSync('complete_info');
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
        wx.showToast({
          title: '您不是当前学校的学生，只能浏览，不能发布哦',
          icon: 'none',
          duration: 2000, //持续的时间
          success: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 2000);
          },
        })
      }

    }
  },
})