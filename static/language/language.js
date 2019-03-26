/*
***********************************
 * 设置网页显示的文字
 * @param paramList
 */
exports.install = function (Vue, options) {
    Vue.prototype.loadTxt = function (paramList){
        localStorage.setItem("language","chinese")

        var valueArray=[];
        var language=localStorage.getItem("language");
        if(language==null||language==""||language=="chinese"){
            language="chinese";
            for(var i=0;i<paramList.length;i++){
                valueArray.push(paramList[i].chinese);
            }
        }else if(language=="english"){
            language="english";
            for(var i=0;i<paramList.length;i++){
                valueArray.push(paramList[i].english);
            }
        }
        return valueArray;
    };
};

loginList = [
    {"number":"0","english":"User：","chinese":"用户名: "},
    {"number":"1","english":"Password：","chinese":"密码: "},
    {"number":"2","english":"Exit","chinese":"退出"},
    {"number":"3","english":"Login","chinese":"登录"}
];

headerListLng = [
    {"number":"0","english":"","chinese":"修改密码"},
    {"number":"1","english":"","chinese":"切换语言"},
    {"number":"2","english":"Sign out","chinese":"退出登录"},
    {"number":"3","english":"english","chinese":"英语"},
    {"number":"4","english":"chinese","chinese":"中文"},

];

index=[
    {"number":"0","english":"language","chinese":"语言 "},
    {"number":"1","english":"English","chinese":"英语 "},
    {"number":"2","english":"Chinese","chinese":"中文"},
    {"number":"3","english":"Theme","chinese":"主题"},
    {"number":"4","english":"acquiescent","chinese":"默认"},
    {"number":"5","english":"Exit","chinese":"退出"},
    {"number":"6","english":"Modify password","chinese":"修改密码"},
    {"number":"7","english":"color","chinese":"颜色"}
];
