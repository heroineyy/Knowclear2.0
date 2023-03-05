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
  getDateDiff: getDateDiff
}
// function getDateDiff(dateTime) {
//   let dateTimeStamp = new Date(dateTime).getTime();
//   let result = '';
//   let minute = 1000 * 60;
//   let hour = minute * 60;
//   let day = hour * 24;
//   let halfamonth = day * 15;
//   let month = day * 30;
//   let year = day * 365;
//   let now = new Date().getTime();
//   let diffValue = now - dateTimeStamp;
//   if (diffValue < 0) {
//     return;
//   }
//   let monthEnd = diffValue / month;
//   let weekEnd = diffValue / (7 * day);
//   let dayEnd = diffValue / day;
//   let hourEnd = diffValue / hour;
//   let minEnd = diffValue / minute;
//   let yearEnd = diffValue / year;
//   if (yearEnd >= 1) {
//     result = dateTime;
//   } else if (monthEnd >= 1) {
//     result = "" + parseInt(monthEnd) + "月前";
//   } else if (weekC >= 1) {
//     result = "" + parseInt(weekEnd) + "周前";
//   } else if (dayC >= 1) {
//     result = "" + parseInt(dayEnd) + "天前";
//   } else if (hourC >= 1) {
//     result = "" + parseInt(hourEnd) + "小时前";
//   } else if (minC >= 1) {
//     result = "" + parseInt(minEnd) + "分钟前";
//   } else {
//     result = "刚刚";
//   }
//   return result;
// }


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