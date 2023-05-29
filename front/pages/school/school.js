// pages/school/school.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // college_id:0,
    // choice:0
  },
  
  // 选择学校，将选择的数据存入缓存区"visitor_college_id"
  // 选择之后，以游客身份可以浏览相关学校帖子，但不能发布标签和话题，也不能评论和点赞
  chooseASchool_haishi: function () {
    wx.setStorageSync("real_college_id", 1);
    this.chooseASchool();
  },
  chooseASchool_haiyang: function () {
    wx.setStorageSync("real_college_id", 2);
    this.chooseASchool();
  },
  chooseASchool_dianli: function () {
    wx.setStorageSync("real_college_id", 3);
    this.chooseASchool();
  },
  chooseASchool_dianji: function () {
    wx.setStorageSync("real_college_id", 4);
    this.chooseASchool();
  },
  chooseASchool_jianqiao: function () {
    wx.setStorageSync("real_college_id", 5);
    this.chooseASchool();
  },
  // 新用户，后端数据库返回空值，complete_info=false
  // 新用户完善个人信息并且择校后，complete_info=true
  // 老用户选择其他学校
  chooseASchool: function () {
    const visitor_college_id = wx.getStorageSync('real_college_id');
    // this.getCollegeIdFromBackEnd();
    const college_id = wx.getStorageSync('college_id')
    if (college_id !== null) {
      if (college_id == visitor_college_id) {
        wx.setStorageSync("complete_info", 2); //
      } else {
        wx.setStorageSync("complete_info", 3);
      }
    } else {
      wx.setStorageSync("complete_info", 0);
      //0:初次进入 1:修改个人信息 2:本校状态，可以发帖 3:外校状态，只能浏览
    }
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

})