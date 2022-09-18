// pages/dom/dom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consult0:[],
    consult1:[],
    consult2:[],
    consult3:[],
    collegeId:''
  },
    consultId:'1',
     
    //请求数据获取资讯
  getTopic(){
    const token=wx.getStorageSync('acc_token');
    const  collegeId=wx.getStorageSync('collegeId');
    wx.request({
      url: 'https://knowclear.top/knowclear/consult/selectSimpleConsult/'+collegeId,
      method:"GET",
      data:{
      },
      header: {       //下面是固定格式，照搬
         'Content-Type': 'application/json',
        'token': token
      },
      success: (res) =>  {
        console.log(res);
       this.setData({consult0:res.data.consult0})  
       this.setData({consult1:res.data.consult1})
       this.setData({consult2:res.data.consult2})
       this.setData({consult3:res.data.consult3})
      },
      fail:(error)=>{
        console.log("获取闲聊页面话题失败")
        console.log(error)
      }
    })
  },
   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.getTopic();
 
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

  }
})