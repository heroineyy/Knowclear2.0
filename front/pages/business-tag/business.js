// pages/business/business.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      arr:[],
      total:0,
      current:0,
      isShow:false
    },

    //跳转至标签内页
    toTag(e){
      wx.navigateTo({
        url: '/pages/tag/tag?labelId='+e.currentTarget.dataset.labelid,
      })
      // console.log(e)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getTopicList_0();
    },

    // 触底加载5条数据
    onReachBottom: function () {
      // 如果数据请求完整，显示提示并返回
      if(this.data.isShow == true){  
        wx.showToast({
          title: '没有啦',
        })
        return;
      }
      else{
        // 否则继续请求下一页
        this.data.current++
        const collegeid=wx.getStorageSync('real_college_id')
        const token=wx.getStorageSync('acc_token');

        wx.request({
           url: api.getUrl('/knowclear/label/selectAllLabelByCollegeId/')+collegeid+'/1/',
          //  +this.data.current+'/5'
          success:(res)=>{
            console.log('res.data.labels',res.data.labels)
            if(res.data.labels.length < 5){
              this.setData({
                isShow:true  
              })
            }
            this.setData({
              arr:[...this.data.arr,...res.data.labels]
            })
          }
        }) 
      }
    },

    // 懒加载获取标签
    getTopicList_0(){
      const token=wx.getStorageSync('acc_token');
      const collegeid=wx.getStorageSync('real_college_id')
      var that = this;
      wx.request({   // 首次请求，一次请求9页
        url: api.getUrl('/knowclear/label/selectAllLabelByCollegeId/')+collegeid+'/1',
        method:"GET",
        data:{},
        header: {       //下面是固定格式，照搬
          'Content-Type': 'application/json',
          'token': token
        },
        success:function(res){
          console.log(res,'yes');
          that.data.current++                        //当前页面+1         
          console.log(that.data.current)
          
          that.setData({
           arr:res.data.labels
        })
        },
        fail:(error)=>{
          console.log("获取小屋失败")
          console.log(error)
        }
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    
})