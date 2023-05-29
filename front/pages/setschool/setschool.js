// pages/school/school.js
const api = require('../../lib/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    college_id: 1,
    choice: 0,
    college_name: '',
    view_college_name: ''
  },

  setNameView() {
    const view_college_name_id = wx.getStorageSync('real_college_id')
    if (view_college_name_id == 1) {
      this.setData({
        view_college_name: '上海海事大学'
      })
    } else if (view_college_name_id == 2) {
      this.setData({
        view_college_name: '上海海洋大学'
      })
    } else if (view_college_name_id == 3) {
      this.setData({
        view_college_name: '上海电力大学'
      })
    } else if (view_college_name_id == 4) {
      this.setData({
        view_college_name: '上海电机学院'
      })
    } else if (view_college_name_id == 5) {
      this.setData({
        view_college_name: '上海建桥学院'
      })
    }
  },

  setNameBack() {
    const college_name_id = wx.getStorageSync('college_id_from_back')
    console.log("您来自的学校id", college_name_id)
    if (college_name_id == 1) {
      this.setData({
        college_name: '上海海事大学'
      })
    } else if (college_name_id == 2) {
      this.setData({
        college_name: '上海海洋大学'
      })
    } else if (college_name_id == 3) {
      this.setData({
        college_name: '上海电力大学'
      })
    } else if (college_name_id == 4) {
      this.setData({
        college_name: '上海电机学院'
      })
    } else if (college_name_id == 5) {
      this.setData({
        college_name: '上海建桥学院'
      })
    }

    console.log("您来自的学校名", this.data.college_name),
      console.log("您正在浏览的学校名", this.data.view_college_name)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCollegeIdFromBackEnd();
    this.setNameView();
    this.setNameBack();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    const info = wx.getStorageSync('complete_info');
    if (info == 0) {
      wx.showToast({
        title: '请注意，此页面填写的学校将认定为您的真实学校，并且不可修改',
        icon: 'none',
        duration: 5000 //持续的时间
      })
    } else {
      wx.showToast({
        title: '您已经选择过学校，接下来可以任意选择其他学校进行浏览，或者回到本校发帖',
        icon: 'none',
        duration: 5000 //持续的时间
      })

    }
  },

  // 选择学校，将选择的数据存入缓存区"visitor_college_id"
  // 选择之后，以游客身份可以浏览相关学校帖子，但不能发布标签和话题，也不能评论和点赞
  chooseASchool_haishi: function () {
    wx.setStorageSync("real_college_id", 1);
    wx.setStorageSync("hasChangeSchool", 'true');
    this.chooseASchool();
  },
  chooseASchool_haiyang: function () {
    wx.setStorageSync("real_college_id", 2);
    wx.setStorageSync("hasChangeSchool", 'true');
    this.chooseASchool();
  },
  chooseASchool_dianli: function () {
    wx.setStorageSync("real_college_id", 3);
    wx.setStorageSync("hasChangeSchool", 'true');
    this.chooseASchool();
  },
  chooseASchool_dianji: function () {
    wx.setStorageSync("real_college_id", 4);
    wx.setStorageSync("hasChangeSchool", 'true');
    this.chooseASchool();
  },
  chooseASchool_jianqiao: function () {
    wx.setStorageSync("real_college_id", 5);
    wx.setStorageSync("hasChangeSchool", 'true');
    this.chooseASchool();
  },
  // 新用户，后端数据库返回空值，complete_info=false
  // 新用户完善个人信息并且择校后，complete_info=true
  // 老用户选择其他学校
  chooseASchool: function () {
    const info = wx.getStorageSync('complete_info');
    if (info == 0) {
      this.postCollegeIdToBackEnd();
      this.updateAccount();
      wx.setStorageSync("complete_info", 1)
      const infoo = wx.getStorageSync('complete_info');
      //0:初次进入 1:已经修改个人信息 2:本校状态，可以发帖 3:外校状态，只能浏览
    } else {
      const visitor_college_id = wx.getStorageSync('real_college_id');
      const college_name_id = wx.getStorageSync('college_id')

      if (college_name_id == visitor_college_id) {
        wx.setStorageSync("complete_info", 2); //
        const infoo = wx.getStorageSync('complete_info');
        console.log(infoo)
      } else {
        wx.setStorageSync("complete_info", 3);
        const infoo = wx.getStorageSync('complete_info');
        console.log(infoo)
      }
    }
    wx.navigateBack({
      delta: 0,
    })
  },

  //发送college_id到后端
  postCollegeIdToBackEnd() {
    wx.login({
      success: res => {
        var that = this;
        const realCollegeId = wx.getStorageSync('real_college_id');
        console.log("realCollegeIdToBack", realCollegeId);
        const token = wx.getStorageSync('acc_token');
        wx.request({ //发起网络请求
          //url: "https://knowclear.top/knowclear/account/updateAccount/" + realCollegeId,
          url: api.getUrl('/knowclear/account/updateAccount/') + realCollegeId,
          method: 'POST',
          data: {},
          header: {
            'content-type': 'application/json', // 默认值
            'token': token
          },
          success: function (res) {
            console.log(res)
          },
          fail: () => {
            console.log("发送college_id失败")
          }
        })
      }
    })
  },

  //获取college_id
  getCollegeIdFromBackEnd() {
    wx.login({
      success: res => {
        if (res.code) {
          var that = this;
          wx.request({ //发起网络请求
            // url: "https://knowclear.top/knowclear/account/login/" + res.code,
            url: api.getUrl('knowclear/account/login/') + res.code,
            method: 'POST',
            data: {},
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (ress) {
              console.log("college_id", ress.data.college_id)
              wx.setStorageSync("college_id_from_back", ress.data.college_id);
            },
          })
        }
      }
    })

  },
  //更新用户信息
  updateAccount() {
    const token = wx.getStorageSync('acc_token');
    var nickName = wx.getStorageSync('user_name');
    var real_college_id = wx.getStorageSync('real_college_id');
    wx.request({
      url: api.getUrl('/knowclear/account/updateAccount/') + real_college_id,
      method: "POST",
      data: {
        "sex": null,
        "grade": null,
        "major": null,
        "nickname": nickName
      },
      header: { //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res, '更新用户信息成功');
        wx.showToast({
          title: '更新成功',
          duration: 3000
        })
        console.log("nickName", nickName)
      },
      fail: () => {
        console.log("更新用户信息失败")
      },
    })
  },
})