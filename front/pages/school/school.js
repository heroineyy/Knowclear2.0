// pages/school/school.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
      // college_id:0,
      // choice:0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(){
      
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

    },

    // 选择学校，将选择的数据存入缓存区"visitor_college_id"
        // 选择之后，以游客身份可以浏览相关学校帖子，但不能发布标签和话题，也不能评论和点赞
        chooseASchool_haishi:function(){
          wx.setStorageSync("real_college_id",1);
          this.chooseASchool();
        },
        chooseASchool_haiyang:function(){
          wx.setStorageSync("real_college_id",2);
          this.chooseASchool();
        },
        chooseASchool_dianli:function(){
          wx.setStorageSync("real_college_id",3);
          this.chooseASchool();
        },
        chooseASchool_dianji:function(){
          wx.setStorageSync("real_college_id",4);
          this.chooseASchool();
        },
        chooseASchool_jianqiao:function(){
          wx.setStorageSync("real_college_id",5);
          this.chooseASchool();
        },
        // 新用户，后端数据库返回空值，complete_info=false
        // 新用户完善个人信息并且择校后，complete_info=true
        // 老用户选择其他学校
        chooseASchool:function(){
          const visitor_college_id=wx.getStorageSync('real_college_id');
    //       this.getCollegeIdFromBackEnd();
          const college_id=wx.getStorageSync('college_id')
          if (college_id !== null) {
            if(college_id == visitor_college_id){
              wx.setStorageSync("complete_info",2);    //
            }
            else{
              wx.setStorageSync("complete_info",3);
            }
          } else {
            wx.setStorageSync("complete_info",0);     
            //0:初次进入 1:修改个人信息 2:本校状态，可以发帖 3:外校状态，只能浏览
          }    
           wx.switchTab({
                url: '/pages/index/index',
              })
        },

//  //获取college_id
//    getCollegeIdFromBackEnd(){
//           var that=this;
//           const code=wx.getStorage('acc_code')
//           wx.request({    //发起网络请求
//             url:"https://knowclear.top/knowclear/account/login/"+code,
//             method: 'POST',
//             data: {},
//             header: {
//               'content-type': 'application/json' // 默认值
//             },
//             success: function (ress) {
//               that.setData({'college_id' : ress.data.college_id}); 
//               console.log("college_id",that.data.college_id)         
//              },
//              fail:()=>{
//                console.log("获取token失败")
//              }
//           })
//         }
})