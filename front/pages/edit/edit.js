// pages/edit/edit.js
Page({
  data: {
     sex_flag: false, //true 为男
     grade: "大一",
    //获取的信息
    "profile": {
      "account": {
        "openid": "",
        "sex": '',
        "grade":"",
        "major": "",
        "collegeId":'',
        "nickname":"",
      },
      "college": ""
    }
  },

  onLoad: function (){                                                                                                              
    this.setData({
      profile:wx.getStorageSync('profile'),
    })
    if(this.data.profile.account.sex==1){
      this.setData({
        sex_flag:true
      })
    }
    this.setData({
      grade:this.data.profile.account.grade,
    })

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
          duration: 3000
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


  //选择年级
  choose: function (e) {
    let grade = e.target.dataset.grade;
    if (grade == this.data.grade) {
      return false;
    }
    this.setData({
      grade:grade,
      "profile.account.grade":grade
    });

  },
  //修改专业
  edit_major(e) {
    this.setData({
      "profile.account.major": e.detail.value
    })
  },
  //更改性别
  sexchange: function (e) {
    if (this.data.sex_flag) {
      this.setData({
        sex_flag: false,
        "profile.account.sex":0
      });
    } else {
      this.setData({
        sex_flag: true,
        "profile.account.sex":1
      });
    }
  },
})