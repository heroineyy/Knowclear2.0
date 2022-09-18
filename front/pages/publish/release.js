// pages/release/release.js
var plugin = requirePlugin("chatbot");
Page({
  data: {
    safe: true,
    openstyle: true,
    upImage: [],
    mycontent: '',
    myimage: [],
    chooseLabel: 0,
    labelName: '',
    idx: 0,
    niming: [{
        id: '0',
        text: '公开',
        img: "cloud://knowclear-6gbgnac5346e9091.6b6e-knowclear-6gbgnac5346e9091-1308790420/image/release-to-all-active.png"
      },
      {
        id: '1',
        text: '匿名',
        img: "cloud://knowclear-6gbgnac5346e9091.6b6e-knowclear-6gbgnac5346e9091-1308790420/image/release-to-none-active.png"
      }
    ]
  },
  selectNiming(e) {
    let id = e.target.dataset.id
    this.setData({
      idx: id
    })
  },

  onLoad: function () {
    wx.setStorageSync('chooseLabel', 0)
    this.setData({
      safe: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    console.log("onshow")
    this.ac()
    this.getLabelName();
    this.setData({
      safe: true,
    });
    //this.getLabelId();
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
        success: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }, 500);
        },
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
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
      }
    }
  },

  //图片上传以供预览
  uploadImg() {
    console.log('uploadImg')
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        let old_data = that.data.upImage;
        let new_data = res.tempFilePaths;
        if (that.data.upImage.length + res.tempFilePaths.length <= 9) {
          that.setData({
            upImage: old_data.concat(new_data)
          })
        } else {
          wx.showToast({
            title: '上传图片不能超过9张',
            icon: "none"
          })
        }
      }
    })

  },
  //图片预览
  previewImage(e) {
    console.log('preview')
    let current = e.currentTarget.dataset.src;
    let urls = this.data.upImage;
    urls.push(current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //图片删除
  delete(e) {
    console.log('delete');
    var that = this;
    let myimage = this.data.myimage;
    let upImage = this.data.upImage;
    let index = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确定要删除此图片吗？",
      success: function (res) {
        if (res.confirm) {
          console.log("点击了确定");
          upImage.splice(index, 1);
          that.setData({
            upImage
          });
          myimage.splice(index, 1);
          that.setData({
            myimage
          })
        } else if (res.cancel) {
          console.log("点击了取消");
        }
      }
    })
  },
  //图片上传到后端
  upToBack() {
    console.log('uptoback');
    if (this.data.upImage.length !== 0) {
      for (let i = 0; i < this.data.upImage.length; i++) {
        wx.getFileSystemManager().readFile({
          filePath: this.data.upImage[i],
          encoding: "base64",
          success: (res) => { //成功的回调
            this.data.myimage.push('data:image/jpeg;base64,' + res.data)
            this.setData({
              myimage: this.data.myimage
            })
          }
        })
      }
    }
  },


  //实现post请求
  publish() {
    const token = wx.getStorageSync('acc_token');
    const college_id = wx.getStorageSync('real_college_id');
    console.log('publish')
    var that = this
    if (this.data.myimage) {
      console.log(189)
      console.log(this.data.myimage)
      wx.request({
        url: 'https://knowclear.top/knowclear/topic/publishTopic/' + college_id,
        method: "POST",
        data: {
          "content": this.data.mycontent,
          "isAnonymous": this.data.idx,
          "imgs": this.data.myimage,
          "labelId": this.data.chooseLabel,
          "classify": 0,
        },
        header: { //下面是固定格式，照搬
          'Content-Type': 'application/json',
          'token': token
        },
        success: function (res) {
          console.log(res, '发布话题成功');
          that.data.myimage = [];
          that.data.chooselabel = 0;
          wx.setStorageSync('labelName', '');
          wx.setStorageSync('chooseLabel', '0');
          wx.showToast({
            title: '发布成功',
            duration: 2000, //持续的时间
            success: function () {
              wx.setStorageSync('hasPublish', 'true');
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 2000);
            },
          })
        },
        fail: (error) => {
          console.log("发布话题失败")
          console.log(error)
        }
      })
    }
  },
  //敏感词检测
  sensitive() {
    var i = 0;
    this.setData({
      safe: true
    })
    plugin.api.nlp('sensitive', {
      q: this.data.mycontent,
      mode: 'cnn'
    }).then(res => {
      console.log("res.result:",res)
      for (i; i < 4; i++) {
        if (res.result[i][0] == "other") {
          if (res.result[i][1] < 0.8) {
            console.log("不安全！")
            this.setData({
              safe: false
            });
            wx.showToast({
              title: 'peace&love',
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

  // 获取小屋内容并且发布提示
  submitEvent: function (event) {
    console.log('submitEvent')
    var that = this;


    //得到输入的内容
    that.setData({
      mycontent: event.detail.value.mycontent
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
        if (!that.data.mycontent) {
          wx.showToast({
            title: '发布内容为空',
            icon: 'none',
            duration: 1500,
          })
        } else {
          // 图片转码
          that.upToBack()
          console.log('that.data.myimage', that.data.myimage);

          // 标签号
          const chooseLabel = wx.getStorageSync('chooseLabel');
          that.setData({
            chooseLabel: chooseLabel
          });
          that.notice();
        }
      }
      that.setData({
        safe: true,
      })
    }, 3000);

  },

  //提示公开或者匿名发布
  notice: function () {
    console.log('notice')
    var that = this;
    if (that.data.idx == 0) {
      wx.showModal({
        title: "提示",
        content: "确定公开发布？",
        success: (res) => {
          if (res.confirm) {
            console.log("点击了确定");
            this.publish();

          } else if (res.cancel) {
            console.log("点击了取消");
            this.data.myimage = []
          }
        }
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "确定匿名发布？",
        success: (res) => {
          if (res.confirm) {
            console.log("点击了确定");
            this.publish();
          } else if (res.cancel) {
            console.log("点击了取消");
            this.data.myimage = []
          }
        }
      })
    }
  },

  choose: function () {
    wx.navigateTo({
      url: '/pages/labelList/labelList',
    })
  },

  //获取标签名字
  getLabelName() {
    var that = this;
    const labelName = wx.getStorageSync('labelName')
    that.setData({
      labelName: labelName
    })
  },
  // //获取标签id
  //   getLabelId(){
  //   console.log("getlabel")
  //   var that=this;
  //   // console.log("label",app.globalData.chooseLable);
  //   const chooseLable=wx.getStorageSync('chooseLable');
  //   that.setData({ chooseLable:chooseLable
  // })
  // }
})