Page({
  data: {
    labelTopics:[],
    topicVOList:[],
    attention:'',
    buttonText:'',
    buttonColor:'',
    aftertime:[],
    pageSize:4,//每页加载的数据量
    pageNum:1,//当前页
},
  //图片预览
  previewImage(e){
    let current = e.currentTarget.dataset.src;
    console.log(e)
    let urls =e.currentTarget.dataset.images;
    wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
    })
  },
  onLoad: function (options) {
    // console.log(options.labelId)
    this.getLabelTopic();
    this.getAttention();
    this.getTopicVOList()
  },
  onShow(){
    var that = this;
    that.getLabelTopic();
    for (var i=0; i < that.data.topicVOList.length; i++) {
      if(that.data.topicid_index==that.data.topicVOList[i].topicId){  
       var up='topicVOList['+i+'].upvote';
       var upnum='topicVOList['+i+'].upvoteNum'
      that.setData({
        [up]:that.data.message,
        [upnum]:that.data.upvotenum
      });
      break;
    }
  }
},
    //  * 页面上拉触底事件的处理函数
    onReachBottom: function () {
      console.log("触底")
      var that=this;
      var pageNum = that.data.pageNum + 1; //获取当前页数并+1
      that.setData({
        pageNum: pageNum, //更新当前页数
      })
      that.getTopicVOList();//重新调用请求获取下一页数据
  },
  //请求标签内容  请求头包含token
  getLabelTopic(){
    var that=this;
    const token=wx.getStorageSync('acc_token');
    wx.request({
      url:"https://knowclear.top/knowclear/label/selectLabelTopicById/"+that.options.labelId+"/"+that.data.pageNum+"/"+that.data.pageSize,
      method:'POST',
      data:{
        label_id:1
      },
      header: {       //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success:(res)=>{
        console.log(res,'标签内容');
        var arr3 = res.data.labelTopics; //从此次请求返回的数据中获取新数组
        that.setData({
          labelTopics:arr3,
        })
      },
      fail:(err)=>{
        console.log(err,"获取标签内容及话题失败")
      }
    })
  },
  //请求标签对应话题接口  请求头包含token
  getTopicVOList(){
    var that=this;
    wx.showLoading({
      title: '数据加载中...',
    })
    const token=wx.getStorageSync('acc_token');
    wx.request({
      url:"https://knowclear.top/knowclear/label/selectLabelTopicById/"+that.options.labelId+"/"+that.data.pageNum+"/"+that.data.pageSize,
      method:'POST',
      data:{
        label_id:1
      },
      header: {       //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success:(res)=>{
        console.log(res,'标签话题');
        var arr1 = that.data.topicVOList; //从data获取当前datalist数组
        var arr2 = res.data.labelTopics.topicVOList; //从此次请求返回的数据中获取新数组
        arr1 = arr1.concat(arr2); //合并数组
        that.setData({
          topicVOList: arr1 //合并后更新datalist
        })
        that.changeTimestamp();
      },
      fail:(err)=>{
        console.log(err,"获取标签内容及话题失败")
      },
      complete:()=>{
        wx.hideLoading();
      }
    })
  },
  clickDianzan(e){
    console.log(e,'当前点赞话题索引')
    var index=e.currentTarget.dataset.curindex;
    if(this.data.topicVOList[index]){
     var upvote=this.data.topicVOList[index].upvote;
     if(upvote==true||upvote==false){
       var num=this.data.topicVOList[index].upvoteNum;
       if(upvote){  //取消点赞
        this.data.topicVOList[index].upvoteNum=num-1;
        this.data.topicVOList[index].upvote=false;
        const token=wx.getStorageSync('acc_token');
        wx.request({
          url: "https://knowclear.top/knowclear/upvote/cancelUpvote/"+this.data.topicVOList[index].topicId,
          method: 'POST',
          data: {
          },
          header: {       //下面是固定格式，照搬
            'Content-Type': 'application/json',
            'token': token
          },
          success: function (res) {
            console.log(res,"取消赞成功");
          },
          fail: function (err) {
            console.log(err,"取消点赞失败");
          },
        });
       }else{     //点赞
        this.data.topicVOList[index].upvoteNum=(num+1);
        this.data.topicVOList[index].upvote=true;  
        const token=wx.getStorageSync('acc_token');
        wx.request({
          url:"https://knowclear.top/knowclear/upvote/upvoteTopic/"+this.data.topicVOList[index].topicId,//这里写后台点赞接口的url
          method: 'POST',
          data: {
            topic_id:this.data.topicVOList[index].topicId
          },
          header: {       //下面是固定格式，照搬
            'Content-Type': 'application/json',
            'token': token
          },
          success: function (res) {
            console.log(res,"点赞成功");
          },
          fail: function (err) {
            console.log(err,"点赞失败");
          },
        });
       }
       this.setData({
        topicVOList:this.data.topicVOList
      })
      
     }
     } 
     
  },
  toGambit(e){
    wx.navigateTo({
      url: '/pages/gambit/gambit?topicid='+e.currentTarget.dataset.topicid,
    })
    // console.log(e,'当前话题id')
  },
  //用户是否关注该标签
  getAttention(e){  
    var that=this;
    const token=wx.getStorageSync('acc_token');
    wx.request({
      url: "https://knowclear.top/knowclear/collection/selectIsCollected/"+that.options.labelId,
      method:"GET",
      data:{
      },
      header: {       //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success:function(res){
        console.log(res,'该用户是否关注了该标签');     
        // that.setData({
        //   // attention:res.data.status
        // })  
        if(res.data.status=='yes'){
          that.setData({
            attention:res.data.status,
            buttonText:'已关注',
            buttonColor:'white'
          })
        }else{
          that.setData({
            attention:res.data.status,
            buttonText:'关注标签',
            buttonColor:'green'
          })
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  //取消关注标签
  cancelAttention(e){
    var that=this;
    const token=wx.getStorageSync('acc_token');
    wx.request({
      url: "https://knowclear.top/knowclear/collection/cancelCollectLabel/"+that.options.labelId,
      method:"GET",
      data:{
      },
      header: {       //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success:function(res){
        console.log(res,'取消关注标签成功');     
        that.setData({
          attention:'no',
          buttonText:'关注标签',
          buttonColor:'green'
        }) 
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  //关注标签
  toAttention(e){
    var that=this;
    const token=wx.getStorageSync('acc_token');
    wx.request({
      url: "https://knowclear.top/knowclear/collection/collectLabel/"+that.options.labelId,
      method:"GET",
      data:{
      },
      header: {       //下面是固定格式，照搬
        'Content-Type': 'application/json',
        'token': token
      },
      success:function(res){
        console.log(res,'关注标签成功');     
        that.setData({
          attention:'yes',
          buttonText:'已关注',
          buttonColor:'white'
        }) 
      },
      fail:(err)=>{
        console.log(err)
      }
    })

  },
  toOthers(e){
    wx.navigateTo({
      url: '/pages/others/others?openid='+e.currentTarget.dataset.openid+'&isAnonymous='+e.currentTarget.dataset.isanonymous,
    })
  },
  toTag(){
    wx.navigateTo({
      url: '/pages/tag/tag',
    })
  },
  getDateDiff(dateTime) {
        let dateTimeStamp = new Date(dateTime).getTime();
        let result = '';
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let halfamonth = day * 15;
        let month = day * 30;
        let year = day * 365;
        let now = new Date().getTime();
        let diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
          return;
        }
        let monthEnd = diffValue / month;
        let weekEnd = diffValue / (7 * day);
        let dayEnd = diffValue / day;
        let hourEnd = diffValue / hour;
        let minEnd = diffValue / minute;
        let yearEnd = diffValue / year;
        if (yearEnd >= 1) {
          result = dateTime;
        } else if (monthEnd >= 1) {
          result = "" + parseInt(monthEnd) + "月前";
        } else if (weekEnd >= 1) {
          result = "" + parseInt(weekEnd) + "周前";
        } else if (dayEnd >= 1) {
          result = "" + parseInt(dayEnd) + "天前";
        } else if (hourEnd >= 1) {
          result = "" + parseInt(hourEnd) + "小时前";
        } else if (minEnd >= 1) {
          result = "" + parseInt(minEnd) + "分钟前";
        } else {
          result = "刚刚";
        }
        return result;
      }, changeTimestamp() {
        this.data.aftertime=[]
        for(var i=0;i<this.data.topicVOList.length;i++)
      {  this.data.aftertime.push(this.getDateDiff(this.data.topicVOList[i].gmtCreated))}
      this.setData({aftertime:this.data.aftertime})
      console.log(this.data.aftertime)
      },
})