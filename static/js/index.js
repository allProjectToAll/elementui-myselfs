/*
***********************************
 * 设置提示错误信息
 * @param paramList
 */
import $ from 'jquery'

export default (Vue, options) => {
  Vue.prototype.openErr = function (paramList, index) {
    // $(".errBox").css("display","block");
    // $(".errTitle").html(paramList);
    // console.log(Time);
    // if(Time){
    //     clearTimeout(Time);
    // }
    // Time = setTimeout(function(){
    //     $(".errBox").css("display","none");
    // },3000);
    if ($(".TitleMessageBox .errBox").length > 3) {
      $(".TitleMessageBox .errBox:eq(0)").remove();
    }
    let time = new Date().getTime();
    if (index) {
      if (index == 1) {//error
        $(".TitleMessageBox").append(`<div class="errBox errBox` + time + `">
                    <p>提示：</p>
                    <div class="errTitle" style="color:salmon;">` + paramList + `</div>
                </div>`);
        setTimeout(function () {
          $(".TitleMessageBox .errBox" + time).remove();
        }, 3000)
      } else if (index == 2) {//success
        $(".TitleMessageBox").append(`<div class="errBox errBox` + time + `">
                    <p>提示：</p>
                    <div class="errTitle" style="color:greenyellow;">` + paramList + `</div>
                </div>`);
        setTimeout(function () {
          $(".TitleMessageBox .errBox" + time).remove();
        }, 3000)
      }
    } else {
      $(".TitleMessageBox").append(`<div class="errBox errBox` + time + `">
                <p>提示：</p>
                <div class="errTitle"  style="color:greenyellow;">` + paramList + `</div>
            </div>`);
      setTimeout(function () {
        $(".TitleMessageBox .errBox" + time).remove();
      }, 3000)
    }
  };

  // <div class="closeError" >x</div>


  function getPostOptions() {
    // var token = localStorage.getItem("token");
    var token = sessionStorage.getItem("token");
    var header = token ? {
      headers: {
        "Authorization": "Bearer " + token,
        "Lang": localStorage.getItem("langular") ? localStorage.getItem("langular") : "cn"
      }
    } : null;
    return header;
  }

  /*
  ***********************************
  * post请求 src是路径，data是参数，success是返回成功之后ok，error返回错误函数
  */
  // http://chain.imwork.net/extop/api/8884
  Vue.prototype.postAjaxBaseUrl = process.env.NODE_ENV === 'development'?'http://192.168.125.231:8884':'https://erpapi.azex.io';
  console.log(process.env.NODE_ENV);
  Vue.prototype.postAjax = function (src, data = {}, success, errorCal) {
    var header = getPostOptions();
    var drd = $.Deferred();
    let that = this;
    this.$http.post(this.postAjaxBaseUrl + src, JSON.stringify(data), header).then(function (res) {
      console.log(res);
      if (res.body.isOk == true) {
        if (success) {
          success(res);
        }
        drd.resolve(res);
      } else {
        console.log("进入post isok为false函数");
        errorCal && errorCal(res);
        that.openErr(res.body.err.message, 1);

        /*
        * 判断所有提示信息
        */
        if (res.body.err.code == "-2" || res.body.err.code == "-1") {
          console.log("错误码为：" + res.body.err.code + ",跳转到登陆页面");
          // localStorage.setItem("isLogin",false);
          sessionStorage.setItem("isLogin", false);
          that.$router.push({path: "/login"});
        }
      }
    }, function (res) {
      if (res) {
        errorCal && errorCal(res);
        that.openErr(that.$t("message.SystermError"), 1);
      }
      drd.reject(res);
    });
    return drd.promise();
  }
  /**
   * 判断一个数或字符串是否在该数组内
   * var arr=new Array(["b",2,"a",4,"test"]);
   * IsInArray(arr,'test');
   */

  Vue.prototype.IsInArray = function (arr, val) {
    let testStr = ',' + arr.join(",") + ",";
    return testStr.indexOf("," + val + ",") != -1;
  };
  /**
   * 将秒的时间转化成日期格式
   */
  Vue.prototype.creatDay = function (day) {
    let date = new Date(day * 1000);
    let d = date.getFullYear() + "/" +
      ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "/" +
      (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate())) + " " +
      (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + ":" +
      (date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes())) + ":" +
      (date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()));
    return d;
  };

  Vue.prototype.htmlEncodeByRegExp = function (str) {/*用正则表达式实现html转码*/
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;
  };
  Vue.prototype.htmlDecodeByRegExp = function (str) {  /*用正则表达式实现html解码*/
    var s = "";
    if (str == "") return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
  }
};



var Time = null;
