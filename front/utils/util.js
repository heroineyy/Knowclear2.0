const api=require('../lib/api.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  getDateDiff: getDateDiff,
  sensitive: sensitive,
  getCurrentUserInfo: getCurrentUserInfo,
  previewImage: previewImage,
  ac:ac
}

//转换时间格式函数
function getDateDiff(dateTime) {
  let dateTimeStamp = new Date(dateTime).getTime();
  let result = '';
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let year = day * 365;
  let now = new Date().getTime();
  let diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  let monthEnd = diffValue / month;
  let weekEnd = diffValue / (7 * day);
  let dayEnd = diffValue / day;
  let hourEnd = diffValue / hour;
  let minEnd = diffValue / minute;
  let yearEnd = diffValue / year;
  if (yearEnd >= 1) {
    //result = dateTime;
    result ="" + parseInt(yearEnd) + "年前";
  } else if (monthEnd >= 1) {
    result = "" + parseInt(monthEnd) + "月前";
  } else if (weekEnd >= 1) {
    result = "" + parseInt(weekEnd) + "周前";
  } else if (dayEnd >= 1) {
    result = "" + parseInt(dayEnd) + "天前";
  } else if (hourEnd >= 1) {
    result = "" + parseInt(hourEnd) + "小时前";
  } else if (minEnd >= 1) {
    result = "" + parseInt(minEnd) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
}

 //敏感词检测
 function sensitive() {
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
            duration: 2000,
          })
          console.log("safe1:", this.data.safe);
        } else {
          console.log("安全！")
        }
      }
    }
  });
}

//获取当前用户信息
function getCurrentUserInfo(token) {
  wx.request({
    url: api.getUrl('/knowclear/account/getSimpleAccount'),
    method: 'GET',
    data: {},
    header: { //下面是固定格式，照搬
      'Content-Type': 'application/json',
      'token': token
    },
    success: function (res) {
      console.log(res, '获取当前用户信息成功');
      wx.setStorageSync('account', res.data.account);
    },
    fail: () => {
      console.log("获取当前用户信息失败");
    },
    complete:()=>{
       wx.stopPullDownRefresh()
    }
  });
}

//图片预览
function previewImage(e){
  let current = e.currentTarget.dataset.src;
  let urls = e.currentTarget.dataset.images;
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: urls // 需要预览的图片http链接列表
  });
}

function ac() {
  const info = wx.getStorageSync('complete_info');
  const hasuserinfo = wx.getStorageSync('hasuserinfo');
  if (hasuserinfo == false) {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000, //持续的时间
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
              return;
            }
          }
        })
      }
    }
  }
}