//公用方法

import axios from 'axios'
import {
    Message,
    MessageBox
} from 'element-ui'
import md5 from './md5.js'
import base64 from './base64.js'
import CryptoJS from './sha.js'
import ReconnectingWebSocket from 'reconnecting-websocket';
import Decimal from 'decimal.js';
import enumData from "@/page/pt/enum";

let intfKey = "F08eEGe2TuMIeS9Lc123X0w6EB3D3881"
let appId = "WEB"

//对象深拷贝
const copyObj = (obj) => JSON.parse(JSON.stringify(obj));
//对象合并,key相同则后对象覆盖前对象
const mergeObj = (...obj) => Object.assign({}, ...obj);

// 复制相同 key 值
const copyObjValue = function (obj,objValue){
    for(let k in obj){
        if(!isBlank(objValue[k])){
            obj[k] = objValue[k]
        }
    }
    return obj;
};

//加法
const accAdd = function(arg1, arg2) {
    arg1 = isBlank(arg1) ? 0 : arg1;
    arg2 = isBlank(arg2) ? 0 : arg2;

    arg1 = new Decimal(arg1);
    arg2 = new Decimal(arg2);
    let num = Number(arg1.add(arg2).toString());

    return num;
};

//减法
const accSub = function(arg1, arg2) {
    arg1 = isBlank(arg1) ? 0 : arg1;
    arg2 = isBlank(arg2) ? 0 : arg2;

    arg1 = new Decimal(arg1);
    arg2 = new Decimal(arg2);
    let num = Number(arg1.sub(arg2).toString());

    return num;
};

//乘法，获取精确乘法的结果值
const accMul = function(arg1, arg2) {
    if(isBlank(arg1) || isBlank(arg2)){
        return 0;
    }

    arg1 = new Decimal(arg1);
    arg2 = new Decimal(arg2);
    let num = Number(arg1.mul(arg2).toString());

    return num;
};

//除法，获取精确除法的结果值
const accDiv = function(arg1, arg2) {
    if(isBlank(arg1) || isBlank(arg2)){
        return 0;
    }

    arg1 = new Decimal(arg1);
    arg2 = new Decimal(arg2);
    let num = arg1.div(arg2);   //Decimal对象
    // 格式转换
    num = Number(num.toString());

    return num;
};

/**
 * 截取位数方法（四舍五入）
 * @param {截取多少位} digit 
 * @returns 
 */
Number.prototype.myToFixed = function(digit){
    let num = new Decimal(this);
    let pow = new Decimal(Math.pow(10,digit));
    // 放大整数再四舍五入取整
    num = num.mul(pow);
    num = num.round();
    num = num.div(pow);
    num = num.toString();
    // 小数补0
    let numArr = num.split('.');
    if(numArr[1] == undefined){
        num += ".";
        for(let i=0; i<digit; i++){
            num += 0;
        }
    }else{
        let length = digit -numArr[1].length;
        for(let i=0; i<length; i++){
            num += 0;
        }
    }
    return Number(num);
}

const postUrl = function (beanName = '', methodName = '', param={}, successFun, errorFun, type = "post", shadow) {
    if(shadow) shade.show();//遮罩层
    let url = "";
    localStorage.setItem("sessionTime",new Date().getTime());
    return new Promise((resolve, reject) => {
        // if (isBlank(url)) return;
        // if(isBlank(param)) return;
        if (isBlank(type)) {
            type = "post";
        };
        let urlManager = {};    //url请求记录（限制重复请求）
        // 数据格式转换
        const tranParam = function (obj) {
            let query = "";
            for (let name in obj) {
                let value = obj[name];
                if (value instanceof Array) {
                    for (let i = 0; i < value.length; ++i) {
                        let subValue = value[i];
                        let fullSubName = name + "[" + i + "]";
                        let innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + "&";
                    }
                } else if (value instanceof Object) {
                    for (let subName in value) {
                        let subValue = value[subName];
                        let fullSubName = name + "[" + subName + "]";
                        let innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + "&";
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };

        /**
         * 用于解析的内容是对象
         */
        const objToPostObj = function (obj, key, retmap) {
            let j = 0;
            for (let i in obj) {
                if (obj[i] instanceof Array == true) {
                    objToPostList(obj[i], key + "[" + j + "]", retmap);
                } else if (obj[i] instanceof Object == true) {
                    objToPostObj(obj[i], key + "." + i, retmap);
                } else {
                    retmap[key + "." + i] = obj[i];
                }
                j++;
            }
        }
        /**
         * 用于解析的内容是列表
         *
         *
         */
        const objToPostList = function (obj, key, retmap) {
            let j = 0;
            for (let i in obj) {
                if (obj[i] instanceof Array == true) {
                    objToPostList(obj[i], key + "[" + j + "]", retmap);
                } else if (obj[i] instanceof Object == true) {
                    objToPostObj(obj[i], key + "[" + j + "]", retmap);
                }
                j++;
            }
            retmap[key] = obj.toString();
        }
        /**
         * 对于传入的对象转换成可以post的形式
         *
         *
         */
        const objToPostParam = function (obj) {
            let map = {};
            for (let i in obj) {
                if (obj[i] instanceof Array == true) {
                    objToPostList(obj[i], i, map);
                } else if (obj[i] instanceof Object == true) {
                    objToPostObj(obj[i], i, map);
                } else {
                    map[i] = obj[i];
                }
            }
            return map;
        }
        // encode转码
        const urlEncode = function (param, key, encode) {
            if (param == null) return '';
            let paramStr = '';
            let t = typeof (param);
            if (t == 'string' || t == 'number' || t == 'boolean' || param instanceof Array) {
                if (param !== "") {
                    paramStr = key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
                }
            } else {
                let idx = 0;
                let paramArray = new Array();
                if (param.url != undefined) {
                    if ((idx = param.url.indexOf("&")) > 0) {
                        paramStr = param.url.substring(0, idx);
                        let params = param.url.substring(idx + 1).split("&");
                        for (let i in params) {
                            if (params[i].split("=")[1] !== "null" && params[i].split("=")[1] !== "") {
                                paramArray.push(params[i]);
                            }
                        }
                    } else {
                        paramStr = param.url;
                    }
                }
                if (param.data != undefined) {
                    for (let i in param.data) {
                        if (param.data[i] != null && param.data[i] !== "null" && param.data[i] !== "") {
                            paramArray.push(urlEncode(param.data[i], i, encode));
                        }
                    }
                }
                if (paramArray.length > 0)
                    paramStr += "&" + paramArray.sort().join("&");
            }
            return paramStr;
        };
        //发起请求
        const httpPost = function (inParam, successFun, errorFun, urlStr, shadow) {
            //调用发送请求
            axios(inParam).then(function ({
                                              data: response,
                                              status,
                                              headers,
                                              config
                                          }) {
                // let {data, status, headers, config} = data;
                delete urlManager[urlStr];
                try {
                    let {
                        message
                    } = response;
                    if(response.status==200){
                        if (typeof (successFun) == "function") {
                            successFun(response.content, status, headers, config);
                            resolve(response.content)
                        } else {
                            resolve(response.content)
                        }
                    }else if (response.status == 403) {
                        if (typeof errorFun == "function") {
                            errorFun(response.content);
                        }else{
                            reject(response.content);
                        }
                        //30秒内不操作自动跳转到登录页（防止停留导致无效请求）
                        const timer = setTimeout(() => {
                            window.location.href = "/login";
                            clearTimeout(timer);
                        }, 30000);
                        MessageBox("登录信息有误",function(){
                            clearTimeout(timer);
                            window.location.href = "/login";
                        })
                    } else if (response.status == 500) {
                        if (typeof errorFun == "function") {
                            errorFun(response.content);
                        }else{
                            reject(response.content);
                        }
                        Message.error("系统网络丢啦，请刷新试试~");
                    } else if (response.status == 501) {
                        if (typeof errorFun == "function") {
                            errorFun(response);
                        }else{
                            reject(response.content);
                        }
                        Message.error(message);
                    }else if (response.status == 0 || response.status == 504) {

                    } else if (errorFun == undefined || errorFun == "" || errorFun == null) {
                        Message.error(message);
                    }
                    if(shadow) shade.hide();
                } catch (error) {
                    if(shadow) shade.hide();
                    console.log(error)
                }

            }).catch(function ({
                                   response
                               }) {
                delete urlManager[urlStr];
                if(shadow) shade.hide();
                if (errorFun == undefined || errorFun == "" || errorFun == null) {
                    MessageBox(response.message);
                } else if (typeof errorFun == "function") {
                    errorFun(response.content);
                }
                reject(response.content);
            });
        }
        let inParam = {}
        inParam.appId = appId;
        inParam.beanName = beanName;
        inParam.method = methodName;
        inParam.time = new Date().getTime().toString();
        inParam.rd = Math.round(Math.random() * 1000).toString();
        param.inCode = url;
        inParam.content = param;
        inParam.menuPath = window.vm.$route.meta.menuPath;  //页面路径
        inParam.inCode = url;
        inParam.tokenId = localStorage.getItem("token")||'';
        let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
        let str = "[";
        for (let item of paramArray) str += (item + ', ');
        str = str.replace(/, $/, '');
        str += "]";
        inParam.sign = CryptoJS.SHA1(str).toString();
        let queryObject = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: type,
            data: inParam,
            url: window.location.origin+"/api/intf?"+url
        };
        let urlStr = '';
        httpPost(queryObject, successFun, errorFun, urlStr, shadow);
        // let queryObject;
        // if (typeof param == "string") {
        //     if (param !== "") {
        //         if (url.indexOf("?") == -1) {
        //             url = url + "?" + param;
        //         } else {
        //             url = url + "&" + param;
        //         }
        //     }
        //     queryObject = {
        //         method: type,
        //         url: url
        //     };
        // } else {
        //     queryObject = {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //         },
        //         transformRequest: [tranParam],
        //         method: type,
        //         data: objToPostParam(param),
        //         url: url
        //     };
        // }
        // if (queryObject.data != undefined && queryObject.data.sign != undefined) {
        //     delete queryObject.data.sign;
        // }
        // let urlStr = urlEncode(queryObject, null, false).replace("api/", "");
        // let sign = md5(urlStr + getCookie("token"));
        // if (queryObject.data != undefined) {
        //     queryObject.data.sign = sign;
        // } else {
        //     queryObject.url += "&sign=" + sign;
        // }
        // if (type == "POST") {
        //     //限制重复请求
        //     if (urlManager[urlStr] == undefined) {
        //         urlManager[urlStr] = "1";
        //         //zycode
        //         httpPost(queryObject, successFun, errorFun, urlStr, shadow);
        //     }else{
        //         console.log("重复请求")
        //     }
        // } else {
        //     //zycode
        //     httpPost(queryObject, successFun, errorFun, urlStr, shadow);
        // }
    })
}

//变量是否不为空
const isNotBlank = function (data) {
    if (data !== null && data !== undefined && data !== "") {
        return true
    } else {
        return false
    }
}
//变量是否为空
const isBlank = function (data) {
    if (data === null || data === undefined || data === "") {
        return true
    } else {
        return false
    }
}

/**检查手机号码 新增属性进行校验 很多地方用到**/
const validatemobile = function(mobile){
    if(mobile==undefined || mobile.length==0){
        return false;
    }
    if(mobile.length!=11){
        return false;
    }
    let myreg = /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
    if(!myreg.test(mobile)){
        return false;
    }
    return true;
}

/**检查固定电话**/
const validateTel = function(tel){
    if(tel.length==0 || tel==undefined){
        return false;
    }
    var myreg = /^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/;
    if(!myreg.test(tel)){
        return false;
    }
    return true;
}

/** 格式化当前 时间**/
const  formatTime = function(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'y+': date.getFullYear + 1,
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
const padLeftZero = function (str) {
    return ('00' + str).substr(str.length);
}
/** 获取cookie  */
const getCookie = function(name) {
    let arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    let obj  = "";
    if(arr=document.cookie.match(reg)){
        obj =  decodeURIComponent(arr[2]);
        if(isNotBlank(obj)){
            obj =  obj.replace(/\"/g, "");
        }
    }
    return obj;
}
/**获取当前路径 */
const getRootPath = function() {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    return localhostPaht;
}
// 查询 初始化打印
const  initDevices = function(businessTypes,callback){
    let params = {};
    params.businessTypes = businessTypes;
    postUrl("api/sysPrintBO.ajax?cmd=queryPrinters", params,function(data){
        let items = data.items;
        callback(items);
    });
}
// 获取 json 第一层长度
const getMapLength = function(json){
    let j = 0;
    for(let k in json){
        j ++;
    }
    return j;
}

//下载文件
const downloadFile = function(url){
    //url中含有特殊字符导致下载文件没有后缀打不开问题处理
    if (this.isNotBlank(url))
    {
        let replaceFromIndex = url.indexOf("filename");
        let url1 = url.substring(0, replaceFromIndex);
        let url2 = url.substring(replaceFromIndex);
        url2 = url2.replaceAll('+', '%2B');
        // url2 = url2.replaceAll('/', '%2F');这个上传已经替换成:,
        url2 = url2.replaceAll('&', '%26');
        // url2 = url2.replaceAll('?', '%3F'); 这个无法转译
        url2 = url2.replaceAll('#', '%23');
        url = url1 + url2;
    }
    // 增加filename触发下载
    // const urlObj = new URL(url);
    // const params = new URLSearchParams(urlObj.search);
    // let hasFilename = params.has('filename');
    // if (!hasFilename) {
    //     const pathname = urlObj.pathname;
    //     const fileName = pathname.split('/').pop();
    //     // 对文件名进行编码（避免特殊字符）
    //     const encodedFileName = encodeURIComponent(fileName);
    //     params.append('filename', encodedFileName);
    //     // 重新拼接URL（保留原查询参数，新增filename）
    //     urlObj.search = params.toString();
    //     url = urlObj.toString();
    // }
    let div = document.createElement("div");
    div.innerHTML = `<iframe id="downloadFileFrame" name="downloadFileFrame" src="${url}" sandbox="allow-downloads allow-same-origin" style = "display:none;visibility:hidden" ></iframe>`
    document.body.appendChild(div);
    const timer = setTimeout(() => {
        document.getElementById('downloadFileFrame').parentNode.remove();
        clearTimeout(timer);
    },500)
}

//打开pdf文件
const visitPDF = function(url){
    let div = document.createElement("div");
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.left = 0;
    div.style.zIndex = 999999;
    div.style.height = "100%";
    div.style.width = "100%";
    div.innerHTML = `
        <iframe name="downloadFileFrame" src="${url}" style = "height:100%;width:100%;" ></iframe>
        <div id="visitPDFBtn" style="position:absolute;z-index:99;top:13px;right:145px;border:1px solid #eee;border-radius:3px;background:#fff;line-height:30px;width:80px;text-align:center;cursor:pointer;">关闭页面</div>
    `
    document.body.appendChild(div);
    var visitPDFBtn = document.getElementById('visitPDFBtn');
    visitPDFBtn.onclick = function(){
        visitPDFBtn.parentNode.remove();
    }
}

//websocket
const startWebSocket = function(callback) {
    if (!window.WebSocket) alert("WebSocket not supported by this browser!");
    // 创建WebSocket
    let ishttps = 'https:' == document.location.protocol ? true : false;
    if(ishttps){
        var url = document.location.toString().replace('https://', '');
    }else{
        var url = document.location.toString().replace('http://', '');
    }
    let ip,ws;
    if (url.indexOf(":") > 0) {
        ip = url.substring(0, url.indexOf(":"));
    } else {
        ip = url.substring(0, url.indexOf("/"));
    }
    if(isLocalHost()){
        url = "ws://" + ip + ":11002/ws";
    }else if(ishttps){
        // url = "wss://" + ip + ":1000/ws";
        url = "wss://" + ip + "/ws";
    }else{
        url = "ws://" + ip + "/ws";
        // url = "ws://" + ip + ":1000/ws";
    }
    try {
        ws = new ReconnectingWebSocket(url, null, {debug: false, reconnectInterval: 5000, maxReconnectInterval: 120000});
    } catch (e) {
        ws = new WebSocket(url);
    }
    // 收到消息时在消息框内显示

    ws.onmessage = function(evt) {
        console.info(evt);
        let data = eval("("+evt.data+")");
        callback(data);
    };
    // 断开时会走这个方法
    ws.onclose = function() {
        console.log("close~~");
    };
    // 连接上时走这个方法
    ws.onopen = function() {
        console.log("open~~");
    };
}


//get URL加密
function signUrl(orgiUrl) {
    let paramArray = new Array();
    let idx,paramStr;
    if (orgiUrl != undefined) {
        let url = orgiUrl.substring(orgiUrl.lastIndexOf("/")+1);
        if ((idx = url.indexOf("&")) > 0) {
            paramStr = url.substring(0, idx);
            let params = url.substring(idx+1).split("&");
            for (let i in params) {
                if (params[i].split("=")[1] !== "null" && params[i].split("=")[1] !== "") {
                    paramArray.push(params[i]);
                }
            }
        } else {
            paramStr = url;
        }
    }
    if (paramArray.length > 0)
        paramStr += "&"+ paramArray.sort().join("&");
    paramStr += "&sign=" +md5(paramStr+getCookie("token"));
    return paramStr;
}
const postDownload = function (tableName,fileName,successFun,fileSubName,isTemp){
    let inParam = {}
    inParam.appId = appId;
    inParam.beanName = 'baseTF';
    inParam.method = 'downloadExcelFileFromServer';
    inParam.time = new Date().getTime().toString();
    inParam.rd = Math.round(Math.random() * 1000).toString();
    let param={tableName:tableName}
    param.inCode = '';
    inParam.content = param;
    inParam.inCode = '';
    inParam.tokenId = localStorage.getItem("token")||'';
    let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
    let str = "[";
    for (let item of paramArray) str += (item + ', ');
    str = str.replace(/, $/, '');
    str += "]";
    inParam.sign = CryptoJS.SHA1(str).toString();


    var suffix = '';
    if(!fileName){
        fileName = '';
    }else{
        suffix = fileName.substring(fileName.lastIndexOf("."));
        fileName = fileName.substring(0,fileName.lastIndexOf("."));
    }
    if(isBlank(isTemp)||!isTemp){
        let time = formatTime(new Date(), "yyyyMMddHHmmss");
        fileName = userInfo().userName+'导出-'+fileName+'数据-'+time ;
    }

    let type = 'application/vnd.ms-excel;charset=utf-8';
    if(isNotBlank(fileSubName)){
        fileName += '.'+fileSubName;
        if(suffix=='zip'){
            type = 'application/zip;charset=utf-8';
        }
    }else{
        if(suffix!==''){
            fileName += suffix;
            if(suffix=='.pdf'){
                type = 'application/pdf;charset=utf-8';
            }
        }else{
            fileName += '.xls';
        }
    }

    axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        url: window.location.origin+"/api/intf?",
        method: 'post',
        data: inParam,
        responseType:"blob"
    }).then(function (response) {
        let contentDisposition = response.headers['content-disposition'];
        if (contentDisposition){
            // 正则表达式匹配 filename*=UTF-8'' 和其后的编码文件名
            const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
            // URL 解码简单文件名
            if(filenameMatch){
                const decodedFilename = decodeURIComponent(filenameMatch[1]);
                if(decodedFilename){
                    fileName = decodedFilename;
                }
            }
        }
        const blob = new Blob(
            [response.data], { type: type })
        const aEle = document.createElement('a');     // 创建a标签
        const href = window.URL.createObjectURL(blob);       // 创建下载的链接
        aEle.href = href;
        aEle.download = fileName;  // 下载后文件名
        document.body.appendChild(aEle);
        aEle.click();     // 点击下载
        document.body.removeChild(aEle); // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
        if (typeof (successFun) == "function") {
            successFun();
        }
    })

}
//导出功能
/**
 * queryUrl  格式如：api/commonExportBO.ajax?cmd=downloadExcelFile
 * params   请求的参数对象:{"date":"2016-07-12"}
 * excelLables  excel的列名: 批次号，时间
 * excelKeys    excel的字段名称:batchNum,date
 * tableName  用于多次提交导出时区分不同的导出，系统唯一
 */
const downloadExcelFile=function(queryUrl,params,excelLables,excelKeys,filename,tableName,isAscTrue){

    let progress = document.getElementById('fileProgress');
    let rate = document.getElementById('fileProgressRate');

    tableName = tableName || queryUrl;

    filename = filename||"";

    let that=this;
    params["queryUrl"]=queryUrl;
    params["excelKeys"]=excelKeys;
    params["excelLables"]=excelLables;
    params["fileName"]=filename;
    params["tableName"]=tableName;

    if(typeof isAscTrue != "undefined"){
        params["isAscTrue"]=isAscTrue;
    }
    that.postUrl("baseTF","downloadExcelFile",params,function(){});

    progress.style.display = "block";

    postUrl("baseTF","checkFinishDownLoad",{tableName:tableName},function(data){
        if(data.result=="true"){
            rate.style.width = "100%";
            rate.innerHTML = "<div>100%</div>"
            // if (data.fileName && data.fileName.endsWith(".xlsx"))
            // {
            //     params.fileSubName = ".xlsx";
            // }
            postDownload(tableName,filename,function (){
                progress.style.display = "none";
                rate.style.width = "1%";
                rate.innerHTML = "<div>1%</div>"
            },params.fileSubName,params.isTemp)
        } else {
            let preRate = 0;
            let reqCount = 0;  //重复请求进度条相同次数
            let interval=setInterval(() => {
                postUrl("baseTF","checkFinishDownLoad",{tableName:tableName},function(data){
                    if(preRate == data.rate){
                        reqCount++;
                        if(reqCount == 30){     //多次请求进度不变，则认为导出失败取消请求
                            clearInterval(interval);
                            progress.style.display = "none";
                            rate.style.width = "1%";
                            rate.innerHTML = "<div>1%</div>";
                            that.postUrl("baseTF","clearDownLoadMap",{tableName:tableName},function(){});
                            MessageBox("导出超时");
                        }
                    }else{
                        preRate = data.rate;
                        reqCount = 0;
                    }
                    let rateBar = parseInt(data.rate)-5;
                    if(rateBar>0){
                        rate.style.width = rateBar+"%";
                        rate.innerHTML = `<div>${rateBar}%</div>`
                    }
                    if(data.result=="true"){
                        rate.style.width = "100%";
                        rate.innerHTML = "<div>100%</div>"
                        clearInterval(interval);
                        // if (data.fileName && data.fileName.endsWith(".xlsx"))
                        // {
                        //     params.fileSubName = ".xlsx";
                        // }
                        postDownload(tableName,filename,function (){
                            const timer = setTimeout(() => {
                                progress.style.display = "none";
                                rate.style.width = "1%";
                                rate.innerHTML = "<div>1%</div>"
                                clearTimeout(timer);
                            },1000)
                        },params.fileSubName,params.isTemp)
                    }

                });
            }, 1000)
        }
    });

};



//el-tree控件获取全部id（包括父级id）
/**
 * data 树对象
 * ids  子集选中id集合
 * urlId   节点id字段名称,默认urlId
 * childrenName  子节点对象字段名称,默认children
 */
const treeFn = {
    getTreeParentId(data,ids,urlId="urlId",childrenName="children"){
        let dataCopy = copyObj(data);
        this.ids = ids;
        //遍历生成模拟id,id记录所有父级的id,例子 1-11-123
        this.setSimulateId(dataCopy,urlId,childrenName);
        //获取所有父级id
        this.ids.forEach(id => {
            this.getParentId(dataCopy,id,urlId,childrenName)
        });
        //id转number再去重
        this.ids = Array.from(new Set(this.ids.map(Number)));
        return this.ids;
    },
    ids:[],//用于记录id
    simulateIds:[],
    setSimulateId(data,urlId="urlId",childrenName="children",simulateId){
        data.forEach(el => {
            if(isNotBlank(simulateId)){
                el.simulateId =  simulateId + '-' + el[urlId];
            }else{
                el.simulateId = el[urlId].toString();
            }
            this.simulateIds.push(el.simulateId);
            //有子节点时进行递归
            if(isNotBlank(el[childrenName])&&el[childrenName].length>0){
                this.setSimulateId(el[childrenName],urlId,childrenName,el.simulateId);
            }
        });
    },
    getParentId(data,id,urlId,childrenName){
        data.forEach(el => {
            if(id==el[urlId]){
                let array = el.simulateId.split("-");//id转数组获取索取所有父级id
                this.ids = this.ids.concat(array);
            }
            //有子节点时进行递归
            if(isNotBlank(el[childrenName])&&el[childrenName].length>0){
                this.getParentId(el[childrenName],id,urlId,childrenName);
            }
        });
    },
    checkChange(data,checked,indeterminate,ids){
        let array = data.simulateId.split("-");//id转数组获取索取所有父级id
        if(checked){    //选中节点时
            let currentId = '';//遍历存储id
            array.forEach((id,index) => {   //遍历拿出父级id
                if(index==0){
                    currentId = id;
                }else{
                    currentId += '-' + id;
                }
                ids.push(currentId);
            });
            this.simulateIds.forEach((id,index) => {    //遍历拿出子级id
                if(id.indexOf(data.simulateId)==0){
                    ids.push(id);
                }
            })
            ids = Array.from(new Set(ids)); //数组去重
            return ids;
        }else{
            this.simulateIds.
            array.forEach(a => {
                for(let index=0;index<ids.length-1;index++){
                    if(a==ids[index]){
                        ids.splice(index,1);
                        index--;
                    }
                }
            });
        }
    }
}

//禁用页面输入
/*
    id  页面id
*/
const diabledInput = function(id){
    let dom = document.getElementById(id);
    let inputList = dom.querySelectorAll(".el-input");
    let selectList = dom.querySelectorAll(".el-select");
    let dateList = dom.querySelectorAll(".el-date-editor");
    let textareaList = dom.querySelectorAll(".el-textarea");
    let checkboxList = dom.querySelectorAll(".el-checkbox");
    inputList.forEach(el => {
        el.classList.add("is-disabled");
        el.querySelector("input").disabled=true;
        el.style.pointerEvents = 'none'
    })
    selectList.forEach(el => {
        el.style.pointerEvents = 'none'
    })
    dateList.forEach(el => {
        el.style.pointerEvents = 'none'
        el.classList.add("is-disabled");
    })
    textareaList.forEach(el => {
        el.classList.add("is-disabled");
        el.querySelector("textarea").disabled=true;
    })
    checkboxList.forEach(el => {
        el.classList.add("is-disabled");
        el.querySelector(".el-checkbox__input").classList.add("is-disabled");
        el.style.pointerEvents = 'none'
    })
}

//判断是否为本地环境
const isLocalHost = function(){
    let host = window.location.host;
    if(host.indexOf('localhost')>-1 || host.indexOf('127.0.0.1') >-1 || host.indexOf('192.168') >-1){
        return true
    }else{
        return false
    }
}

//遮罩层方法
const shade = {
    _requestCount: 0,
    show(){
        //获取加载中遮罩层对象
        this._requestCount++;
        const mainPopup = document.getElementById("mainPopup");
        if(isBlank(mainPopup)) return;
        mainPopup.style.display = "block";
    },
    hide(){
        //请求计数器递减
        this._requestCount--;
        //当所有请求都完成时才隐藏遮罩
        if(this._requestCount <= 0){
            this._requestCount = 0;
            window.vm.$nextTick(() => {
                const mainPopup = document.getElementById("mainPopup");
                if(isBlank(mainPopup)) return;
                mainPopup.style.display = "none";
            })
        }
    }
}
// 格式 内容
const formatData = function(v){
    if(isBlank(v)){
        return "";
    }
    return v;
}
// 获取 年月下拉列表
const queryMonthList = function(m){
    let date = new Date();
    let year = date.getFullYear();  //获取当前年份
    let month = date.getMonth()+1; //获取当前月份
    let months =[];
    months.push({"codeValue":m,"codeName":"近"+m+"个月"}); // 数字代表近3个月
    for(let i = 1;i <= m; i++){
        let j = month -  i;
        let yyyyMM = "";
        if(j > 9){
            yyyyMM = year + "-"+ j;
            months.push({"codeValue": yyyyMM,"codeName":year+"年"+""+j+"月"});
        }else{
            yyyyMM = year + "-0"+ j;
            months.push({"codeValue":yyyyMM,"codeName":year+"年"+"0"+j+"月"});
        }
    }
    return months;
}

// 获取以后的年月，默认一年
const getYearMonths = function(){
    let date = new Date();
    let year = date.getFullYear();  //获取当前年份
    let month = date.getMonth()+1; //获取当前月份
    let array = [];
    //获取当前年份的月份
    for(month;month<=12;month++){
        let m = month;
        if(m<10){
            m = '0'+m;
        }
        let obj = {
            codeValue:year+"-"+m,
        };
        array.push(obj);
    }
    //获取下年离现月份刚好一年的剩余月份
    let remain = 12 - array.length;
    for(let nextM=1;nextM<=remain;nextM++){
        let m = nextM;
        if(m<10){
            m = '0'+m;
        }
        let obj = {
            codeValue:(year+1)+"-"+m,
        };
        array.push(obj);
    }
    return array;
}

//tableCommon表格高度计算
const initTableHeight = function(){
    // 新版高度算法
    let innerTabDom = document.getElementById("innerTab");         //内部tab栏
    let searchListDom = document.querySelector(".search-list");         //搜索内容
    let tableContentDom = document.querySelector(".table-content");       //表格内容
    let innerTab = 0;            //内部tab栏高度
    let searchList = 0;    //搜索内容高度
    let tabNoInMain = false;    //tab栏页面是否存在子页面
    if(isNotBlank(innerTabDom)){
        let innerTabSiblings = innerTabDom.parentNode.children;     //获取tab的兄弟节点
        for(let i=0;i<innerTabSiblings.length;i++){        //遍历判断是否存在父子页面
            if(innerTabSiblings[i].className=="table-content"){
                tabNoInMain = true;
            }
        }
    }
    if(innerTabDom&&tabNoInMain) innerTab = innerTabDom.offsetHeight;        //内部tab栏高度
    if(searchListDom) searchList = searchListDom.offsetHeight;  //搜索内容高度
    if(tableContentDom) tableContentDom.style.height = "calc(100% - " + (searchList+innerTab+20) + "px)";
}
const userInfo = function(){
    return JSON.parse(localStorage.getItem("userInfo"));
}

// 获取日期时间
const formatDate = {
    year(date){
        return (date ? date : new Date()).getFullYear()
    },
    month(date){
        return (date ? date : new Date()).getMonth() + 1
    },
    day(date){
        return (date ? date : new Date()).getDate()
    },
    hour(date){
        return (date ? date : new Date()).getHours()
    },
    min(date){
        return (date ? date : new Date()).getMinutes()
    },
    sec(date){
        return (date ? date : new Date()).getSeconds()
    },
    week(date){
        return (date ? date : new Date()).getDay()
    },
    // 获取月份
    getMonth(date){
        let year = this.year(date);
        let month = this.month(date);
        return year +"-" + (month<10?'0'+month:month);
    },
    // 获取日期
    getDate(date){
        let year = this.year(date);
        let month = this.month(date);
        let day = this.day(date);
        return year +"-" + (month<10?'0'+month:month) +"-" + (day<10?'0'+day:day);
    },
    getDate2(date){
        let year = this.year(date);
        let month = this.month(date);
        let day = this.day(date);
        return year +"" + (month<10?'0'+month:month) +"" + (day<10?'0'+day:day);
    },
    // 获取时间
    getTime(date){
        let hour = this.hour(date);
        let min = this.min(date);
        let sec = this.sec(date);
        return (hour<10?'0'+hour:hour) +":" + (min<10?'0'+min:min) +":" + (sec<10?'0'+sec:sec);
    },
    getTime2(date){
        let hour = this.hour(date);
        let min = this.min(date);
        let sec = this.sec(date);
        return (hour<10?'0'+hour:hour) +"" + (min<10?'0'+min:min) +"" + (sec<10?'0'+sec:sec);
    },
    // 获取日期时间
    getDateTime(date){
        return this.getDate(date) + " " + this.getTime(date);
    },
    // 获取日期时间
    getDateTime2(date){
        return this.getDate(date) + "" + this.getTime(date);
    },
    getCurrentMonthBeginEndRangeDateStr(date)
    {
        const start = date ? date : new Date();
        const end = date ? date : new Date();
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        return [this.getDate(start), this.getDate(end)];
    },
    // 获取周几
    getWeek(date){
        let week = this.week(date);
        let weekName = "";
        switch(week){
            case 0:
                weekName = "星期日";
                break;
            case 1:
                weekName = "星期一";
                break;
            case 2:
                weekName = "星期二";
                break;
            case 3:
                weekName = "星期三";
                break;
            case 4:
                weekName = "星期四";
                break;
            case 5:
                weekName = "星期五";
                break;
            case 6:
                weekName = "星期六";
                break;
        }
        return weekName;
    }
}
/*
 * 校验是否为纯数字
 * js的isNaN函数
 */
var checkNum = function(num){
    if(isNaN(num)){
        return false;
    }
    return true;
}
/**
 * 拼接大图路径
 */
const getBigImgPath = function(path){
    let paramIdx = path.lastIndexOf("?");
    if(paramIdx>-1){
        path = path.substring(0,paramIdx);
    }
    
    // 检查是否已经包含 "_big"
    let pathWithoutExt = path.substring(0, path.lastIndexOf("."));
    let extension = path.substring(path.lastIndexOf("."));
    
    if (pathWithoutExt.endsWith("_big")) {
        return path; // 已经是 _big 路径，直接返回
    } else {
        return pathWithoutExt + "_big" + extension; // 添加 _big
    }
}

const getSrcFileName = function(fullPath){
    let name = fullPath.substring(fullPath.lastIndexOf('/')+1,fullPath.length);
    let end = name.indexOf('=')+1;
    return name.substring(end,name.length);
}

const getRealFileName = function(fullPath){
    let name = fullPath.substring(fullPath.lastIndexOf('/')+1,fullPath.length);
    let end = name.indexOf('.');
    return name.substring(0,end);
}

/**
 * 获取文件类型
 * @param fileName
 * @param fullPath
 * @returns {string}
 */
const getFileType = function (fileName,fullPath){
    let type = "img";
    var suffix;
    if(this.isNotBlank(fileName)){
        suffix = fileName.substring(fileName.lastIndexOf('.'),fileName.length);
    }else if(this.isNotBlank(fullPath)){
        let name = fullPath.substring(fullPath.lastIndexOf('/'),fullPath.length);
        let num = name.indexOf('.');
        let end = name.indexOf('?');
        suffix = name.substring(num,name.length);
    }
    // 判断识别类型
    if(suffix.indexOf('.pdf')>-1||suffix.indexOf('.PDF')>-1){
        type = 'pdf';
    }else if(suffix.indexOf('.doc')>-1 || suffix.indexOf('.DOC')>-1){
        type = 'word';
    }else if(suffix.indexOf('.ppt')>-1 || suffix.indexOf('.PPT')>-1){
        type = 'ppt';
    }else if(suffix.indexOf('.xls')>-1 || suffix.indexOf('.XLS')>-1){
        type = 'excel';
    }else if(suffix.indexOf('.mp4')>-1){
        type = 'mp4';
    }else{
        type = 'file';
    }
    // 上传限制
    let typeList={
        img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
        table:".xls,.xlsx,.XLS,.XLSX",
        file:"file"
    };
    let imgArr = typeList.img.split(",");
    imgArr.forEach(el => {
        if(suffix.indexOf(el)>-1){
            type = 'img';
        }
    })
    return type;
}
/**
 * 生成表格title
 */
const setTableTitle = function(){
    setTimeout(() => {
        let tableArr = document.querySelectorAll("table");  //获取全部table
        for(let tb of tableArr){
          let tdArr = tb.querySelectorAll("td");    //获取table里的td
          for(let td of tdArr){
            if(this.isNotBlank(td.innerText)){  //提取td中的内容
              td.title = td.innerText;
            }
            if(this.isNotBlank(td.querySelector("input"))){     //如果含有input则使用input内容
              td.title = td.querySelector("input").value;
            }
            if(this.isNotBlank(td.querySelector("table"))){     //如果有子table则不展示title
                td.title = "";
            }
          }
        }
      }, 2000);
}
/**
 * 搜索栏条件是否全部展示
 */
const setSearchIsshowAll = function(){
    setTimeout(() => {
        let searchListDoms = document.querySelectorAll(".search-list");         //搜索内容
        if (isNotBlank(searchListDoms)) {
            for (let i = 0; i < searchListDoms.length; i++) {
                let searchListDom = searchListDoms[i];//是否有搜索栏
                if(isNotBlank(searchListDom)){      //是否有搜索栏
                    if(searchListDom.offsetHeight>40){  //搜索栏高度是否超过一行
                        let searchBotDom = searchListDom.querySelector(".search-bot");  //展示隐藏按钮
                        let searchFormDom = searchListDom.querySelector(".search-form");  //搜索条件
                        let downDom = searchBotDom.querySelector(".el-icon-arrow-down"); //向下图标
                        let upDom = searchBotDom.querySelector(".el-icon-arrow-up"); //向下图标
                        if(upDom.style.display == "block"){
                            searchFormDom.style.height = 'auto';
                        }else{
                            searchFormDom.style.height = '35px';
                        }
                        searchBotDom.style.display = "block";   //搜索栏超过一行展示按钮
                        let tableHeight = document.querySelector(".table-content").querySelectorAll(".table_height");       //表格内容
                        searchBotDom.onclick = function(){  //点击逻辑
                            if(upDom.style.display == "block"){    //隐藏
                                searchFormDom.style.height = '35px';
                                upDom.style.display = "none";
                                downDom.style.display = "block";
                            }else{      //展示
                                searchFormDom.style.height = 'auto';
                                upDom.style.display = "block";
                                downDom.style.display = "none";
                            }
                            initTableHeight();
                            if(tableHeight.length>0){
                                tableHeight.forEach(el => {     //触发滚动事件调整表格footer定位位置
                                    el.scrollLeft = el.scrollLeft+1;
                                })
                            }
                        }                        
                        initTableHeight();
                        if(tableHeight.length>0){
                            tableHeight.forEach(el => {     //触发滚动事件调整表格footer定位位置
                                el.scrollLeft = el.scrollLeft+1;
                            })
                        }
                    }
                }
            }
        }
    }, 500);
}


//表单列宽自由拖动
const tableStretch = function(myTAbId){
    let tTD; //用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题
    //document点击调用的方法
    var docMouseUpFn = function(){
        tTD.mouseDown = false;
        removeDocMouseUpFn();
    }
    // 绑定document的mouseup方法，用于处理鼠标操作过快导致的拖动异常
    var bindDocMouseUpFn = function(){
        document.addEventListener('mouseup',docMouseUpFn);
    }
    // 移除document的mouseup方法，防止不必要调用
    var removeDocMouseUpFn = function(){
        document.removeEventListener('mouseup',docMouseUpFn);
    }
    for (let j = 0; j < myTAbId.rows[0].cells.length; j++) {
        myTAbId.rows[0].cells[j].index = j;
        myTAbId.rows[0].cells[j].onmousedown = function (event) {
            //记录单元格
            tTD = this;
            if (event.offsetX > tTD.offsetWidth - 10) {
                tTD.mouseDown = true;
                tTD.oldX = event.clientX;
                tTD.oldWidth = tTD.offsetWidth;
            }
            bindDocMouseUpFn();
        };
        myTAbId.rows[0].cells[j].onmouseup = function (event) {
            //结束宽度调整
            if (tTD == undefined) tTD = this;
            tTD.mouseDown = false;
            tTD.style.cursor = 'default';
            if(tTD.getAttribute("data-mouse")=="true"){
                (function(tTD){
                    let timer = setTimeout(function(){
                        tTD.setAttribute("data-mouse","false");
                        clearTimeout(timer);
                    }, 500)
                })(tTD);
            }
        };
        myTAbId.rows[0].cells[j].onmousemove = function (event,m) {
            //更改鼠标样式
            if (event.offsetX > this.offsetWidth - 10)
            this.style.cursor = 'col-resize';
            else
            this.style.cursor = 'default';
            //取出暂存的Table Cell
            if (tTD == undefined) tTD = this;
            //调整宽度
            if (tTD.mouseDown != null && tTD.mouseDown == true) {
                tTD.setAttribute("data-mouse","true");

                tTD.style.cursor = 'default';
                if (tTD.oldWidth + (event.clientX - tTD.oldX)>0)
                tTD.width = tTD.oldWidth + (event.clientX - tTD.oldX);
                //调整列宽
                tTD.style.cursor = 'col-resize';
                //调整该列中的每个Cell
                myTAbId = tTD; while (myTAbId.tagName != 'TABLE') myTAbId = myTAbId.parentElement;
                let tableElement = this.parentElement.parentElement.parentElement;
                for (let k = 0; k < tableElement.rows.length; k++) {
                    tableElement.rows[k].cells[tTD.cellIndex].width = tTD.width;
                }
            }
        };
    }
}

/**
 * 前端导出excel
 * headList  表头
 * tableData  表数据
 */
const frontDownloadExcelFile = function(filename,headList,tableData,dataType="Object"){
    import('@/utils/excelOut').then(excel => {
        //表头
        let tHeader = []
        //表头对应字段
        let filterVal = []
        let list = []
        let data = []
        if(headList){            
            headList.forEach(el => {
                tHeader.push(el.name);
                filterVal.push(el.code);
            })
        }else{
            tHeader = undefined
        }
        if(dataType == 'Object'){            
            tableData.forEach(item => {
                list.push(item);
            })
            if(list.length==0){
                Message({message: '请选择至少一条数据',type: 'warning'});
                return
            }
            data = list.map(v => filterVal.map(j => v[j]))
            data.map(item => {
                item.map((i, index) => {
                    if (!i) {
                        item[index] = ''
                    }
                })
            })
        }else if(dataType == 'Array'){
            data = tableData;
        }
        excel.export_json_to_excel({
            header: tHeader,
            data,
            filename,   // 文件名
            autoWidth: true,
            bookType: 'xlsx'
        })
    })
}

// 上传图片/文件
const uploadFile = function(file,callback){
    let limitVal = 2;
    let limitSize = accMul(limitVal,1024);
    let fileSize = accDiv(file.size,1024);
    if(fileSize > limitSize){
        this.$message.error('图片文件不可超过' + limitVal + 'M！请压缩处理!');
        return false;
    }
    let inParam = {}
    inParam.appId = appId;
    inParam.beanName = "fileCommonTF";
    inParam.method = "doUpload";
    inParam.time = new Date().getTime().toString();
    inParam.rd = Math.round(Math.random() * 1000).toString();
    inParam.content = {};
    inParam.inCode = '';
    inParam.tokenId = localStorage.getItem("token") || '';
    let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
    let str = "[";
    for (let item of paramArray) str += (item + ', ');
    str = str.replace(/, $/, '');
    str += "]";
    inParam.sign = CryptoJS.SHA1(str).toString();

    let fd = new FormData();
    let that = this;
    fd.append('file', file);//传文件
    fd.append('json', JSON.stringify(inParam));
    //遮罩层
    const mainPopup = document.getElementById("mainPopup");
    mainPopup.style.display = "block";

    axios.post('api/intf', fd).then(function (res) {
        if (res.data.status == 200) {
            callback(res.data.content);
        } else {
            Message.error(res.data.message);
        }
        mainPopup.style.display = "none";//关闭遮罩层
    });
}

// 秒转时分秒
const formatSeconds = function(seconds) {
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds - hour * 3600) / 60);
    var second = seconds - hour * 3600 - minute * 60;
    
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }

    // 返回值
    if(hour > 0){
        return hour + "小时" + minute + "分钟" + second + "秒";
    }else if(minute > 0){
        return minute + "分钟" + second + "秒";
    }else{
        return msecond + "秒";
    }
    
}

  /**
 * @description 数字转中文
 * @param {Number|String}   num     数字[正整数]
 * @param {String}          type    文本类型，lower|upper，默认upper
 * @example number2text(100000000) => "壹亿元整"
 */
const numberToChinese = function(number, type = 'upper') {
    // 配置
    const confs = {
      lower: {
        num: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
        unit: ['', '十', '百', '千', '万'],
        level: ['', '万', '亿']
      },
      upper: {
        num: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
        unit: ['', '拾', '佰', '仟'],
        level: ['', '万', '亿']
      },
      decimal: {
        unit: ['分', '角']
      },
      maxNumber: 999999999999.99
    }
    // 过滤不合法参数
    if (Number(number) > confs.maxNumber) {
      console.error(`The maxNumber is ${confs.maxNumber}. ${number} is bigger than it!`)
      return false
    }
    const conf = confs[type]
    const numbers = String(Number(number).toFixed(2)).split('.')
    const integer = numbers[0].split('')
    const decimal = Number(numbers[1]) === 0 ? [] : numbers[1].split('')
    // 四位分级
    const levels = integer.reverse().reduce((pre, item, idx) => {
      let level = pre[0] && pre[0].length < 4 ? pre[0] : []
      let value = item === '0' ? conf.num[item] : conf.num[item] + conf.unit[idx % 4]
      level.unshift(value)
      if (level.length === 1) {
        pre.unshift(level)
      } else {
        pre[0] = level
      }
      return pre
    }, [])
    // 整数部分
    const _integer = levels.reduce((pre, item, idx) => {
      let _level = conf.level[levels.length - idx - 1]
      let _item = item.join('').replace(/(零)\1+/g, '$1') // 连续多个零字的部分设置为单个零字
      // 如果这一级只有一个零字，则去掉这级
      if (_item === '零') {
        _item = ''
        _level = ''
        // 否则如果末尾为零字，则去掉这个零字
      } else if (_item[_item.length - 1] === '零') {
        _item = _item.slice(0, _item.length - 1)
      }
      return pre + _item + _level
    }, '')
    // 小数部分
    let _decimal = decimal
      .map((item, idx) => {
        const unit = confs.decimal.unit
        const _unit = item !== '0' ? unit[unit.length - idx - 1] : ''
        return `${conf.num[item]}${_unit}`
      })
      .join('')
    // 如果是整数，则补个整字
    return `${_integer}元` + (_decimal || '整')
}

/**
 * 设置主题色
 * @param {主题，不传为默认，edu为大学} theme 
 * 默认主题：主色：#1990ff，经过：#2e9aff
 * 大学主题：主色：#e70b1d，经过：#f1192b
 */
const initTheme = function(theme){
    if(theme == 'edu'){
        document.documentElement.style.setProperty('--theme-color','#e70b1d');
        document.documentElement.style.setProperty('--theme-color-hover','#f1192b');
    }else{
        document.documentElement.style.setProperty('--theme-color','#1990ff');
        document.documentElement.style.setProperty('--theme-color-hover','#2e9aff');
    }
}

//将excel的日期格式转成Date对象
function getFormatDate_XLSX(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    var date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    return date;
}

//获取指定月份的天数
function getDaysInMonthByString(dateString) {
    // 解析日期字符串
    const date = new Date(dateString);

    // 如果解析失败，尝试在字符串后添加"-01"再解析（处理"YYYY-MM"格式）
    if (isNaN(date.getTime())) {
        date = new Date(`${dateString}-01`);
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.log("无效的日期格式，请使用类似'2025-08-01'的格式");
      return
    }
    
    // 获取年份和月份
    const year = date.getFullYear();
    const month = date.getMonth(); // 月份是从 0 开始的
    
    // 创建下个月的第一天
    const nextMonthFirstDay = new Date(year, month + 1, 1);
    // 将日期减去 1 天，得到当前月份的最后一天
    const lastDayOfCurrentMonth = new Date(nextMonthFirstDay - 1);
    
    // 返回当月的总天数
    return lastDayOfCurrentMonth.getDate();
  }

  async function getFileFullPath(filePaths, isBigImg) {
      let filePath = filePaths.join(',');
      let data = await  postUrl("fileCommonTF", "getFileFullPath", {filePaths: filePath,isBigImg});
      return data;
  }

function parseBoxQrcodeInfo(qrcode) {
    // 检查长度是否为150
    if (qrcode.length !== 150) {
        return null;
    }

    // 创建返回对象
    const boxQrcodeInfo = {};

    // 解析各个字段
    boxQrcodeInfo.fixedInfo = qrcode.substring(0, 66);
    boxQrcodeInfo.custMaterialNum = qrcode.substring(66, 91);
    boxQrcodeInfo.materialNum = qrcode.substring(91, 106);
    boxQrcodeInfo.nums = parseFloat(qrcode.substring(106, 113));
    boxQrcodeInfo.processCode = qrcode.substring(113, 118);
    boxQrcodeInfo.no = parseInt(qrcode.substring(118, 125));
    boxQrcodeInfo.productDate = qrcode.substring(125, 133);
    boxQrcodeInfo.bucketNum = qrcode.substring(133, 141);
    boxQrcodeInfo.orderNum = qrcode.substring(141, 150);

    return boxQrcodeInfo;
}

function getDisplayCodeNum(qrcode){
    if (qrcode.length !== 150) {
        return qrcode;
    }
    return parseBoxQrcodeInfo(qrcode).no;
}

function getUrlId(type, id)
{
    if (type == enumData.OPEN_PAGE_TYPE.DETAIL)
        return "detail" + id;
    if (type == enumData.OPEN_PAGE_TYPE.ADD)
        return "add" + new Date().getTime();
    if (type == enumData.OPEN_PAGE_TYPE.UPDATE)
        return "update" + id;
    if (type == enumData.OPEN_PAGE_TYPE.VERIFY)
        return "verify" + id;
    if (type == enumData.OPEN_PAGE_TYPE.PRINT)
        return "print" + id;
    if (type == enumData.OPEN_PAGE_TYPE.COPY)
        return "copy" + id;
    
    return "";
}

let shareRate = 1;

//对象抛出
const common = {
    copyObj,    //对象深度拷贝
    mergeObj,   //对象合并或拷贝
    accAdd, // 加法
    accSub, // 减法
    accMul, // 乘法，获取精确乘法的结果值
    accDiv, // 除法，获取精确除法的结果值
    postUrl,    //请求公用方法
    isBlank,    //是否为空
    isNotBlank, //是否不为空
    md5,        //md5加密
    base64,     //base64转换
    validatemobile, //验证手机号
    validateTel,    //验证固定电话
    formatTime, // 格式时间
    getCookie, // 获取cookie
    getRootPath, // 获取 当前路径
    initDevices, // 初始化打印机
    downloadFile,//下载文件
    visitPDF,//查看pdf
    startWebSocket,//初始化websocket
    treeFn,//el-tree控件获取全部id
    getMapLength, // 获取json 第一层长度
    downloadExcelFile,//导出文件
    diabledInput,//可操作框禁用
    isLocalHost,//判断是否为本地打开
    shade,//遮罩层公用方法
    formatData, // 格式内容
    getYearMonths,//获取接下来一年的年月
    initTableHeight,//计算表格高度
    queryMonthList, // 获取近3个月列表
    appId,
    intfKey,
    userInfo,
    formatDate, //获取日期时间
    checkNum,
    getBigImgPath,  //拼接大图路径
    getFileType, //获取文件类型
    getRealFileName,
    getSrcFileName,
    setTableTitle,  //生成表格title
    setSearchIsshowAll, //搜索栏条件是否全部展示
    tableStretch,   //表单列宽自由拖动
    frontDownloadExcelFile, //前端导出excel
    uploadFile, //上传文件/图片
    formatSeconds,//秒转时分秒
    initTheme,//设置主题
    numberToChinese,//阿拉伯数字转繁体中文数字
    getFormatDate_XLSX,//将excel的日期格式转成Date对象
    getDaysInMonthByString,//获取指定月份的天数
    getFileFullPath,//获取文件完整路径
    parseBoxQrcodeInfo,
    getDisplayCodeNum,
    getUrlId,
    shareRate,
}

export default common
