// pages/edit/edit.js

const api = require('../../lib/api.js');
Page({
  data: {

    grade: "大一",
    sex: 1,
    //获取的信息
    "account": {
      "openid": "",
      "sex": '',
      "grade": "",
      "major": "",
      "collegeId": '',
      "nickname": "",
    },
  },


  onLoad: function () {
    this.setData({
      account: wx.getStorageSync('account'),
    })

    this.setData({
      grade: this.data.account.grade,
      sex: this.data.account.sex
    })

  },

  //更新用户信息
  updateAccount() {
    var that = this;
    const token = wx.getStorageSync('acc_token');
    wx.request({
      url: api.getUrl('/knowclear/account/updateAccount/') + that.data.account.collegeId,
      method: "POST",
      data: {
        "sex": that.data.account.sex,
        "grade": that.data.account.grade,
        "major": that.data.account.major,
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
          duration: 3000
        })
        wx.setStorageSync('account', that.data.account)
        wx.navigateBack({
          delta: 1,
        })
      },
      fail: () => {
        console.log("更新用户信息失败")
      },
    })
  },


  //选择年级
  choose: function (e) {
    let grade = e.target.dataset.grade;
    if (grade == this.data.grade) {
      return false;
    }
    this.setData({
      grade: grade,
      "account.grade": grade
    });

  },
  //修改专业
  edit_major(e) {
    this.setData({
      "account.major": e.detail.value
    })
  },
  //更改性别
  sexchange: function (e) {
    let sex = e.target.dataset.sex;
    if (sex == this.data.sex) {
      return false;
    }
    this.setData({
      sex: sex,
      "account.sex": sex
    });

  },
})