import common from '@/utils/common.js'
import {getLodop} from './LodopFuncs.js'
import {
    Message,
    MessageBox
} from 'element-ui'

/**********************************************
***********增信**众邦**打印业务*********************
***********************************************
*/

/**
 * 快递单对应的始发站、始发站电话、到达站、到达站电话信息
 * @param sourceStation : 始发站
 * @param sourceNumber : 始发站电话
 * @param destStation : 到达站
 * @param destNumber : 到达站电话 
 */
function ExpressAddressBean(sourceStation, sourceNumber, destStation, destNumber, destInfo,trackingNum) {
	return {// 就是一个测试
		sourceStation:sourceStation,
		sourceNumber : sourceNumber,
		destStation : destStation,
		destNumber : destNumber,
		destInfo: destInfo,
		trackingNum:trackingNum
	};
}
//js获取项目根路径，如： http://localhost:8083/uimcardprj
function getRootPath() {
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	let curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	let pathName = window.document.location.pathname;
	let pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	let localhostPaht = curWwwPath.substring(0, pos);
	return (localhostPaht);
}


/**
 * 快递单参与方(寄件方和收件方)信息
 * @param participantName : 收件方/寄件方 --> 公司/人
 * @param participantLinkNumber : 收件方/寄件方 --> 联系电话
 * @param detailPlace : 详细地址
 */
function ExpressParticipantBean(participantName, participantLinkNumber, detailPlace, pDetailPlace, rDetailPlace) {
	this.participantName = participantName;
	this.participantLinkNumber = participantLinkNumber;
	this.detailPlace = detailPlace;
	this.pDetailPlace = pDetailPlace;
	this.rDetailPlace = rDetailPlace;
}

/**
 * 物品信息
 * @param name : 托运物品名称
 * @param price : 物品价值
 * @param number : 件数
 * @param pkg : 包装
 * @param weight : 重量
 * @param volume : 体积
 * @returns
 */
function ExpressGoodsInfo(name, price, number, pkg, weight, volume, collectingMoney, freight) {
	this.name = name;
	this.price = price;
	this.number = number;
	this.pkg = pkg;
	this.weight = weight;
	this.volume = volume;
    this.collectingMoney = collectingMoney;
    this.freight = freight;
}

/**
 * 快递单交付信息
 * @param payTypes : 付款方式 数组
 * 	枚举如下 : 
 * 		1 : 到付
 * 		2 : 回单付
 * 		3 : 月结
 * 		4 : 现金 
 * @param deliveryTypes : 交货方式 数组
 * 	枚举如下 : 
 * 		1 : 自提
 * 		2 : 送货
 * 		3 : 等通知
 * 		4 : 签回单
 * @param expressDeliverType : 快递递送类型
 * 	枚举如下 : 
 * 		1 : 普快
 * 		2 : 定时达		
 * @param isNeedSmsReply : 是否需要短信回复
 * 	枚举如下　: 
 * 		非1 : 不需要
 * 		1 : 需要
 * @returns
 */
function ExpressDeliverInfo(payTypes, deliveryTypes, expressDeliverType, isNeedSmsReply) {
	this.payTypes = payTypes;
	this.deliveryTypes = deliveryTypes;
	this.expressDeliverType = expressDeliverType;
	this.isNeedSmsReply = isNeedSmsReply;
}

/**
 * 快递单费用信息
 * @param freight : 运费
 * @param deliveryCharge : 送货费
 * @param insuranceCharge : 保险费
 * @param pickUpCharge : 提货费
 * @param otherCharge : 其他费用
 * @param totalCost : 费用合计
 * @param agencyFund : 代收款金额
 * @param agencyFundTotal : 提现、代收款累计
 * @param discount: 回扣
 * @returns
 */
function ExpressCostInfo(freight, deliveryCharge, insuranceCharge, pickUpCharge, otherCharge, totalCost, agencyFund, agencyFundTotal, discount) {
	this.freight = freight;
	this.deliveryCharge = deliveryCharge;
	this.insuranceCharge = insuranceCharge;
	this.pickUpCharge = pickUpCharge;
	this.otherCharge = otherCharge;
	this.totalCost = totalCost;
	this.agencyFund = agencyFund;
	this.agencyFundTotal = agencyFundTotal;
	this.discount = discount;
}

/**
 * 快递单其他信息
 * @param createExpressDate : 制单时间
 * @param additionalTreaty : 附加条约
 * @param additionalTreatyDate : 附加条约时间
 * @param carrier: 承运人
 */
function ExpressOthersInfo(createExpressDate, additionalTreaty, additionalTreatyDate, carrier) {
	this.createExpressDate = createExpressDate;
	this.additionalTreaty = additionalTreaty;
	this.additionalTreatyDate = additionalTreatyDate;
	this.carrier = carrier;
}

/**
 * @param addressBean : 始发站和到达站信息(见ExpressAddressBean)
 * @param sender : 寄件方信息(见ExpressParticipantBean)
 * @param addressee : 收件方信息(见ExpressParticipantBean)
 * @param goodsInfos : 托运物信息(类型为Array，Array中的元素类型为ExpressGoodsInfo)，由于格式要求，只能打印两行
 * @param deliverInfo : 交付信息(见ExpressDeliverInfo)
 * @param costInfo : 费用信息(见ExpressCostInfo)
 * @param othersInfo : 其他信息(见ExpressOthersInfo)
 */
function ExpressBean(addressBean, sender, addressee, goodsInfos, deliverInfo, costInfo, othersInfo) {
	this.addressBean = addressBean;
	this.sender = sender;
	this.addressee = addressee;
	this.goodsInfos = goodsInfos;
	this.deliverInfo = deliverInfo;
	this.costInfo = costInfo;
	this.othersInfo = othersInfo;
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function(fmt) { //author: meizz   
  let o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(let k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

/**
 * 数字转大写
 */
ExpressAddressBean.prototype.transformNumToChinese = function(num){
    let tmpnewchar = "";
    switch (perchar) {
        case "0":
            tmpnewchar = "零";
            break;
        case "1":
            tmpnewchar = "壹";
            break;
        case "2":
            tmpnewchar = "贰";
            break;
        case "3":
            tmpnewchar = "叁";
            break;
        case "4":
            tmpnewchar = "肆";
            break;
        case "5":
            tmpnewchar = "伍";
            break;
        case "6":
            tmpnewchar = "陆";
            break;
        case "7":
            tmpnewchar = "柒";
            break;
        case "8":
            tmpnewchar = "捌";
            break;
        case "9":
            tmpnewchar = "玖";
            break;
    }
    return tmpnewchar
}

/**
 * 将费用转换为大写的字符串
 */
ExpressBean.prototype.transformChargeToChinese = function(charge) {
    charge += '';
    for (i = charge.length - 1; i >= 0; i--) {
        charge = charge.replace(",", "")// 替换tomoney()中的“,”
        charge = charge.replace(" ", "")// 替换tomoney()中的空格
    }
    charge = charge.replace("￥", "")// 替换掉可能出现的￥字符
    if (isNaN(charge)) { // 验证输入的字符是否为数字
        Message("请检查小写金额是否正确");
        return;
    }
    // 字符处理完毕后开始转换，采用前后两部分分别转换
    part = String(charge).split(".");
    newchar = "";
    // 小数点前进行转化
    for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
            Message("位数过大，无法计算");
            return "";
        }// 若数量超过拾亿单位，提示
        tmpnewchar = ""
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0":
                tmpnewchar = "零" + tmpnewchar;
                break;
            case "1":
                tmpnewchar = "壹" + tmpnewchar;
                break;
            case "2":
                tmpnewchar = "贰" + tmpnewchar;
                break;
            case "3":
                tmpnewchar = "叁" + tmpnewchar;
                break;
            case "4":
                tmpnewchar = "肆" + tmpnewchar;
                break;
            case "5":
                tmpnewchar = "伍" + tmpnewchar;
                break;
            case "6":
                tmpnewchar = "陆" + tmpnewchar;
                break;
            case "7":
                tmpnewchar = "柒" + tmpnewchar;
                break;
            case "8":
                tmpnewchar = "捌" + tmpnewchar;
                break;
            case "9":
                tmpnewchar = "玖" + tmpnewchar;
                break;
        }
        switch (part[0].length - i - 1) {
            case 0:
                tmpnewchar = tmpnewchar + "元";
                break;
            case 1:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "拾";
                break;
            case 2:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "佰";
                break;
            case 3:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "仟";
                break;
            case 4:
                tmpnewchar = tmpnewchar + "万";
                break;
            case 5:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "拾";
                break;
            case 6:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "佰";
                break;
            case 7:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "仟";
                break;
            case 8:
                tmpnewchar = tmpnewchar + "亿";
                break;
            case 9:
                tmpnewchar = tmpnewchar + "拾";
                break;
        }
        newchar = tmpnewchar + newchar;
    }
    //小数点之后进行转化
    if (charge.indexOf(".") != -1) {
        if (part[1].length > 2) {
            // Message("小数点之后只能保留两位,系统将自动截断");
            part[1] = part[1].substr(0, 2)
        }
        for (i = 0; i < part[1].length; i++) {
            tmpnewchar = ""
            perchar = part[1].charAt(i)
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;
                    break;
                case "1":
                    tmpnewchar = "壹" + tmpnewchar;
                    break;
                case "2":
                    tmpnewchar = "贰" + tmpnewchar;
                    break;
                case "3":
                    tmpnewchar = "叁" + tmpnewchar;
                    break;
                case "4":
                    tmpnewchar = "肆" + tmpnewchar;
                    break;
                case "5":
                    tmpnewchar = "伍" + tmpnewchar;
                    break;
                case "6":
                    tmpnewchar = "陆" + tmpnewchar;
                    break;
                case "7":
                    tmpnewchar = "柒" + tmpnewchar;
                    break;
                case "8":
                    tmpnewchar = "捌" + tmpnewchar;
                    break;
                case "9":
                    tmpnewchar = "玖" + tmpnewchar;
                    break;
            }
            if (i == 0)
                tmpnewchar = tmpnewchar + "角";
            if (i == 1)
                tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    //替换所有无用汉字
    while (newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if (newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
        newchar = newchar + "整";
    return newchar;
}

/**
 * 将费用转换为大写的数组
 */
ExpressBean.prototype.transformChargeToChineseWithArray = function(charge) {
	if (undefined == charge)
		return null;
	charge += ''; 
	for (i = charge.length - 1; i >= 0; i--) {
		charge = charge.replace(",", "")// 替换tomoney()中的“,”
		charge = charge.replace(" ", "")// 替换tomoney()中的空格
	}
	charge = charge.replace("￥", "")// 替换掉可能出现的￥字符
	if (isNaN(charge)) { // 验证输入的字符是否为数字
		Message("请检查小写金额是否正确");
		return null;
	}
	
	let index = charge.indexOf('.');
	let intStr = ''; // 整数部分
	let decimalStr = '';// 小数部分
	if (index > 0) {// 既有整数，又有小数
		intStr = charge.substr(0, index);
		decimalStr = charge.substr(index + 1);
	} else if (index == 0) {// 只有小数部分
		decimalStr = charge.substr(index + 1);
	} else {// 只有整数部分
		intStr = charge;
	}

	let qianwan = parseInt(parseInt(intStr) / 100000);
	let wan = parseInt(parseInt(intStr) / 10000);
	let qian = parseInt((parseInt(intStr) % 10000) / 1000);
	let bai = parseInt((parseInt(intStr) % 1000) / 100);
	let shi = parseInt((parseInt(intStr) % 100) / 10);
	let ge = parseInt(parseInt(intStr) % 10);
	
	let result = new Array();
    if (qianwan > 0) {
        qianwan=qianwan.toString();
        result.push(this.swithNumberToChinessNumber(parseInt(qianwan.charAt(qianwan.length-1))).charAt(0));
    } else {
        result.push("");
    }
	if (wan > 0) {
        wan=wan.toString();
        result.push(this.swithNumberToChinessNumber(parseInt(wan.charAt(wan.length-1))).charAt(0));
	} else {
        result.push("零");
    }

    if(qian>0){
        result.push(this.swithNumberToChinessNumber(qian).charAt(0));
    }else{
        result.push("零");
    }
    if(bai>0){
        result.push(this.swithNumberToChinessNumber(bai).charAt(0));
    }else{
        result.push("零");
    }
    if(shi>0){
        result.push(this.swithNumberToChinessNumber(shi).charAt(0));
    }else{
        result.push("零");
    }
    if(ge>0){
        result.push(this.swithNumberToChinessNumber(ge).charAt(0));
    }else{
        result.push("零");
    }

	// 处理小数点部分
	let decimalResult = '';
	for (let i = 0; i < decimalStr.length; i++) {
		let decimal = parseInt(decimalStr.charAt(i));
		if (i == 0) {
			decimalResult += (this.swithNumberToChinessNumber(decimal) + '角');
		} else if (i == 1) {
			decimalResult += (this.swithNumberToChinessNumber(decimal) + '分');
		}
	}
	if (decimalResult != '')
		result.push(decimalResult);
	return result;
}

ExpressBean.prototype.swithWanToChinese = function(number, unit) {
	if(undefined == unit || null == unit) {		
		unit = '';
	}
	let wan = parseInt(number / 10000);
	let qian = parseInt((number % 10000) / 1000);
	let bai = parseInt((number % 1000) / 100);
	let shi = parseInt((number % 100) / 10);
	let ge = parseInt(number % 10);
	let result = '';
	if (wan > 0) {
		result += this.swithWanToChinese(wan, '亿');
	}
	if(qian > 0) {
		result += (this.swithNumberToChinessNumber(qian) + '仟');
	}
	if(bai > 0) {
		result += (this.swithNumberToChinessNumber(bai) + '佰');
	}
	if(shi > 0) {
		result += (this.swithNumberToChinessNumber(shi) + '拾');
	}
	if(ge > 0) {
		result += this.swithNumberToChinessNumber(ge);
	}
	return result + unit;
}

/**
 *
 * @param chargeArr
 * @returns {*}
 */
ExpressBean.prototype.swithNumberToChinessNumber = function(chargeArr) {
    chargeArr += '';
    for (i = chargeArr.length - 1; i >= 0; i--) {
        chargeArr = chargeArr.replace(",", "")// 替换tomoney()中的“,”
        chargeArr = chargeArr.replace(" ", "")// 替换tomoney()中的空格
    }
    chargeArr = chargeArr.replace("￥", "")// 替换掉可能出现的￥字符
    if (isNaN(chargeArr)) { // 验证输入的字符是否为数字
        Message("请检查小写金额是否正确");
        return;
    }
    // 字符处理完毕后开始转换，采用前后两部分分别转换
    part = String(chargeArr).split(".");
    newchar = "";
    // 小数点前进行转化
    for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
            Message("位数过大，无法计算");
            return "";
        }// 若数量超过拾亿单位，提示
        tmpnewchar = ""
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0":
                tmpnewchar = "零" + tmpnewchar;
                break;
            case "1":
                tmpnewchar = "壹" + tmpnewchar;
                break;
            case "2":
                tmpnewchar = "贰" + tmpnewchar;
                break;
            case "3":
                tmpnewchar = "叁" + tmpnewchar;
                break;
            case "4":
                tmpnewchar = "肆" + tmpnewchar;
                break;
            case "5":
                tmpnewchar = "伍" + tmpnewchar;
                break;
            case "6":
                tmpnewchar = "陆" + tmpnewchar;
                break;
            case "7":
                tmpnewchar = "柒" + tmpnewchar;
                break;
            case "8":
                tmpnewchar = "捌" + tmpnewchar;
                break;
            case "9":
                tmpnewchar = "玖" + tmpnewchar;
                break;
        }
        switch (part[0].length - i - 1) {
            case 0:
                tmpnewchar = tmpnewchar + "元";
                break;
            case 1:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "拾";
                break;
            case 2:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "佰";
                break;
            case 3:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "仟";
                break;
            case 4:
                tmpnewchar = tmpnewchar + "万";
                break;
            case 5:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "拾";
                break;
            case 6:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "佰";
                break;
            case 7:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "仟";
                break;
            case 8:
                tmpnewchar = tmpnewchar + "亿";
                break;
            case 9:
                tmpnewchar = tmpnewchar + "拾";
                break;
        }
        newchar = tmpnewchar + newchar;
    }
    //小数点之后进行转化
    if (chargeArr.indexOf(".") != -1) {
        if (part[1].length > 2) {
            // Message("小数点之后只能保留两位,系统将自动截断");
            part[1] = part[1].substr(0, 2)
        }
        for (i = 0; i < part[1].length; i++) {
            tmpnewchar = ""
            perchar = part[1].charAt(i)
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;
                    break;
                case "1":
                    tmpnewchar = "壹" + tmpnewchar;
                    break;
                case "2":
                    tmpnewchar = "贰" + tmpnewchar;
                    break;
                case "3":
                    tmpnewchar = "叁" + tmpnewchar;
                    break;
                case "4":
                    tmpnewchar = "肆" + tmpnewchar;
                    break;
                case "5":
                    tmpnewchar = "伍" + tmpnewchar;
                    break;
                case "6":
                    tmpnewchar = "陆" + tmpnewchar;
                    break;
                case "7":
                    tmpnewchar = "柒" + tmpnewchar;
                    break;
                case "8":
                    tmpnewchar = "捌" + tmpnewchar;
                    break;
                case "9":
                    tmpnewchar = "玖" + tmpnewchar;
                    break;
            }
            if (i == 0)
                tmpnewchar = tmpnewchar + "角";
            if (i == 1)
                tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    //替换所有无用汉字
    while (newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if (newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
        newchar = newchar + "整";
    return newchar;
}

ExpressBean.prototype.transformDatesToSpecial = function(date, format){
	if (undefined == date || null == date) {
		return "";
	}
	if (undefined == format || null == format) {
		format = "yyyy  MM  dd";
	}
	let dateStr = "";
	if (date instanceof Date) {
		dateStr = date.format(format); 
	} else if (typeof(date) == 'string') {
		dateStr = date;
	}
	return dateStr;
}

/**
 * 添加地址信息到打印中
 */
ExpressBean.prototype.addAddressBeanToPrint = function() {
	/***************开始绘制“快递单对应的始发站、始发站电话、到达站、到达站电话信息”***************/
	let addressBean = this.addressBean;
	if(undefined != addressBean && null != addressBean) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		LODOP.ADD_PRINT_TEXT('24.5mm', '11mm', '40mm', '18mm' ,addressBean.sourceStation);
		LODOP.SET_PRINT_STYLE('FontSize', '9');
		
		
		if (undefined != addressBean.sourceNumber && undefined !=addressBean.destStation) { 
			let stationLength=0;
			if(undefined==addressBean.destStation){
				stationLength=4;
			}else{
				stationLength=addressBean.destStation.length;
			}//始发站电话
			let sourceNumberLength=addressBean.sourceNumber.length;
			LODOP.SET_PRINT_STYLE('FontSize', '9');
			LODOP.ADD_PRINT_TEXT('26.2mm', (24 +  stationLength* 4.5) + 'mm', '38mm', '18mm' ,addressBean.sourceNumber);
			if(undefined !=  addressBean.destInfo){
				LODOP.ADD_PRINT_TEXT('26.2mm', (24 +  stationLength* 4.5+sourceNumberLength + 20) + 'mm', '38mm', '18mm' ,addressBean.destInfo);
			}
			
		}
		
		if (undefined != addressBean.destStation) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.ADD_PRINT_TEXT('24.5mm', '92mm', '45mm', '18mm' ,addressBean.destStation);
		}
		
	/*	let trackingNum = addressBean.trackingNum;//运单号
		if(undefined != trackingNum && trackingNum != null) {
			LODOP.SET_PRINT_STYLE('FontSize', '11');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
			LODOP.ADD_PRINT_TEXT('5.0mm', '144mm', '30mm', '18mm' ,trackingNum);
		}*/
		
		if (undefined != addressBean.destNumber) {
			let stationLength=0;
			if(undefined==addressBean.destStation){
				stationLength=4;
			}else{
				stationLength=addressBean.destStation.length;
			}
			LODOP.SET_PRINT_STYLE('FontSize', '9');
			LODOP.ADD_PRINT_TEXT('25mm', (101 + stationLength * 4.5 + 2) + 'mm', '38mm', '18mm' ,addressBean.destNumber);
		}
	}
}

/**
 * 添加寄件方信息到打印中
 */
ExpressBean.prototype.addSenderAndAddresseeToPrint = function() {
	/*let sender = this.sender;
	if(undefined != sender && null != sender) {
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('40mm', '20.5mm', '53mm', '9mm' ,sender.participantName);
		LODOP.SET_PRINT_STYLE('FontSize', '9');
		LODOP.ADD_PRINT_TEXT('37.5mm', '18.5mm', '72mm', '9mm' ,sender.participantLinkNumber);
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		LODOP.ADD_PRINT_TEXT('59mm', '14.5mm', '51mm', '9mm' ,sender.detailPlace);
	}*/
	
	let addressee = this.addressee;
	if(undefined != addressee && null != addressee) {
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('38mm', '77.0mm', '70mm', '9mm' ,addressee.participantName);
		LODOP.SET_PRINT_STYLE('FontSize', '9');
		LODOP.ADD_PRINT_TEXT('47.5mm', '77.0mm', '72mm', '9mm' ,addressee.participantLinkNumber);
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		LODOP.ADD_PRINT_TEXT('57mm', '77.5mm', '72mm', '9mm' ,addressee.detailPlace);
	}
	
	let sender = this.sender;
	if(undefined != sender && null != sender) {
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('38mm', '12.0mm', '70mm', '9mm' ,sender.participantName);
		LODOP.SET_PRINT_STYLE('FontSize', '9');
		LODOP.ADD_PRINT_TEXT('47.5mm', '10.0mm', '72mm', '9mm' ,sender.participantLinkNumber);
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		LODOP.ADD_PRINT_TEXT('57mm', '11.5mm', '72mm', '9mm' ,sender.pDetailPlace);
	}
}

/**
 * 添加物品信息到打印中
 */
ExpressBean.prototype.addGoodsInfoToPrint = function() {
	let goodsInfos = this.goodsInfos;
	if(undefined == goodsInfos || null == goodsInfos) {
		return;
	}
	
	LODOP.SET_PRINT_STYLE('FontSize', '11');
	LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
	let xaxisStartPonit = 3;// x轴偏移量
	let yaxisStartPonit1 = 70;// 第一行对应的y轴起点
	let yaxisStartPonit2 = 89;// 第一行对应的x轴起点
	let rowLength = 7.8;// 行高
	for(let i = 0; i < goodsInfos.length; i++) {
		if (i > 1) continue;
		let yaxisPonit1 = yaxisStartPonit1 + i * rowLength;
		let yaxisPonit2 = yaxisStartPonit2 + i * rowLength;

		let goodsInfo = goodsInfos[i];
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		if (undefined != goodsInfo.name && null != goodsInfo.name){// 托运物品名称
			LODOP.ADD_PRINT_TEXT(yaxisPonit1 + 'mm', xaxisStartPonit + 'mm', '34mm', rowLength + 'mm' ,goodsInfo.name);
		}
		if (undefined != goodsInfo.price && null != goodsInfo.price){// 物品价值
			LODOP.ADD_PRINT_TEXT(yaxisPonit1 + 'mm', (xaxisStartPonit + 34) + 'mm', '32mm', rowLength + 'mm' ,goodsInfo.price);
		}
		if (undefined != goodsInfo.number && null != goodsInfo.number){
			LODOP.ADD_PRINT_TEXT(yaxisPonit2 + 'mm', (xaxisStartPonit-3) + 'mm', '17mm', rowLength + 'mm' ,goodsInfo.number);
		}
		if (undefined != goodsInfo.pkg && null != goodsInfo.pkg){
			LODOP.ADD_PRINT_TEXT(yaxisPonit2 + 'mm', (xaxisStartPonit + 9) + 'mm', '17mm', rowLength + 'mm' ,goodsInfo.pkg);
		}
		if (undefined != goodsInfo.weight && null != goodsInfo.weight){
			LODOP.ADD_PRINT_TEXT(yaxisPonit2 + 'mm', (xaxisStartPonit + 28) + 'mm', '17mm', rowLength + 'mm' ,goodsInfo.weight);
		}
		if (undefined != goodsInfo.volume && null != goodsInfo.volume){
			LODOP.ADD_PRINT_TEXT(yaxisPonit2 + 'mm', (xaxisStartPonit + 44) + 'mm', '17mm', rowLength + 'mm' ,goodsInfo.volume);
		}
	}
}

/**
 * 添加交付信息到打印中
 * 	this.deliverInfo = deliverInfo;
 */
ExpressBean.prototype.addDeliverInfoToPrint = function() {
	let deliverInfo = this.deliverInfo;
	if(undefined == deliverInfo || null == deliverInfo){
		return;
	}
	
	let expressDeliverType = deliverInfo.expressDeliverType;
	/*if(1 == expressDeliverType ||  2 == expressDeliverType) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		let xaxisStartPonit = 2.3;
		if (2 == expressDeliverType) {
			xaxisStartPonit = 30.5;
		}
		LODOP.ADD_PRINT_TEXT('103.5mm', xaxisStartPonit + 'mm', '3mm', '3mm' ,'√');
	}*/
	/*let isNeedSmsReply = deliverInfo.isNeedSmsReply;
	if(1 == isNeedSmsReply) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		LODOP.ADD_PRINT_TEXT('103.5mm', '61.2mm', '3mm', '3mm' ,'√');
	}*/
	for (let i = 0; i < deliverInfo.payTypes.length; i++) {
		let payType = deliverInfo.payTypes[i];
		if (1 == payType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((67 + (payType - 1) * 8.5) + 'mm', '60mm', '3mm', '3mm' ,'√');
		}
		if (2 == payType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((68 + (payType - 1) * 8.5) + 'mm', '60mm', '3mm', '3mm' ,'√');
		}
		if (3 == payType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((68.7 + (payType - 1) * 8.5) + 'mm', '60mm', '3mm', '3mm' ,'√');
		}
		if (4 == payType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((70 + (payType - 1) * 8.5) + 'mm', '60mm', '3mm', '3mm' ,'√');
		}
	}
	
	for (let i = 0; i < deliverInfo.deliveryTypes.length; i++) {
		let deliveryType = deliverInfo.deliveryTypes[i];
		if (1 == deliveryType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((67 + (deliveryType - 1) * 8.5) + 'mm', '82mm', '3mm', '3mm' ,'√');
		}
		if (2 == deliveryType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((68 + (deliveryType - 1) * 8.5) + 'mm', '82mm', '3mm', '3mm' ,'√');
		}
		if (3 == deliveryType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((69 + (deliveryType - 1) * 8.5) + 'mm', '82mm', '3mm', '3mm' ,'√');
		}
		if (4 == deliveryType) {
			LODOP.SET_PRINT_STYLE('FontSize', '13');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT((70 + (deliveryType - 1) * 8.5) + 'mm', '82mm', '3mm', '3mm' ,'√');
		}
	}

}

/**
 * 添加费用信息到打印中
 */
ExpressBean.prototype.addCostInfoToPrint = function() {
	let costInfo = this.costInfo;
	if(undefined == costInfo || null == costInfo) {
		return;
	}
	let discount = costInfo.discount;
	if (undefined != discount && discount != '') {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('5.0mm', '135mm', '25mm', '18mm' , 'zb' + discount);
	}
	
	LODOP.SET_PRINT_STYLE('FontSize', '11');
	LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
	
	let xaxisStartPonit = 113;
	let yaxisStartPonit = 75;
	let yspacing = 14;
	let xspacing = 21;

	let freight = costInfo.freight;
	if (undefined != freight && freight != null) {//运费
		LODOP.ADD_PRINT_TEXT(yaxisStartPonit + 'mm', xaxisStartPonit + 'mm', '21mm', '6mm' ,freight);
	}
	
	let deliveryCharge = costInfo.deliveryCharge;
	if (undefined != deliveryCharge && deliveryCharge != null) {// 送货费
		LODOP.ADD_PRINT_TEXT(yaxisStartPonit + 'mm', (xaxisStartPonit + xspacing) + 'mm', '21mm', '6mm' ,deliveryCharge);
	}
	
	let insuranceCharge = costInfo.insuranceCharge;
	if (undefined != insuranceCharge && insuranceCharge != null) {// 保险费
		LODOP.ADD_PRINT_TEXT((yaxisStartPonit + yspacing) + 'mm', (xaxisStartPonit) + 'mm', '21mm', '6mm' ,insuranceCharge);
	}
	
	let pickUpCharge = costInfo.pickUpCharge;
	if (undefined != pickUpCharge && pickUpCharge != null) {// 提货费
		LODOP.ADD_PRINT_TEXT((yaxisStartPonit + yspacing) + 'mm', (xaxisStartPonit + xspacing) + 'mm', '21mm', '6mm' ,pickUpCharge);
	}
	
	let otherCharge = costInfo.otherCharge;
	if (undefined != otherCharge && otherCharge != null) {// 提货费
		LODOP.ADD_PRINT_TEXT((yaxisStartPonit + 2 * yspacing) + 'mm', (xaxisStartPonit) + 'mm', '21mm', '6mm' ,otherCharge);
	}
	
	let totalCost = costInfo.totalCost;
	if (undefined != totalCost && totalCost != null) {// 提货费
		LODOP.ADD_PRINT_TEXT((yaxisStartPonit + 2 * yspacing) + 'mm', (xaxisStartPonit + xspacing-3) + 'mm', '21mm', '6mm' ,totalCost);
	}
	
	let agencyFund = costInfo.agencyFund;
	if (undefined != agencyFund && agencyFund != null) {// 代收款金额
		LODOP.ADD_PRINT_TEXT('80mm', '169mm', '30mm', '8mm' ,agencyFund);
		LODOP.SET_PRINT_STYLE('FontSize', '9');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		let chinessNumberArray = this.transformChargeToChineseWithArray(agencyFund);
		let tempXasis = 152.5;
		for (let i = 0; i < chinessNumberArray.length; i++) {
			if( i == 0) {	
				LODOP.ADD_PRINT_TEXT('92mm', '80.5mm', '7mm', '20mm' ,chinessNumberArray[i]);
			} else if (i == chinessNumberArray.length - 1) {
				LODOP.ADD_PRINT_TEXT('92mm', (tempXasis + (i - 1) * 8) + 'mm', '6mm', '16mm' ,chinessNumberArray[i]);
			} else {
				LODOP.ADD_PRINT_TEXT('92mm', (tempXasis + (i - 1) * 8) + 'mm', '6mm', '8mm' ,chinessNumberArray[i]);
			}
		}
	}
	
	let agencyFundTotal = costInfo.agencyFundTotal;
	if (undefined != agencyFundTotal && agencyFundTotal != null) {// 提现、代收款累计
		LODOP.ADD_PRINT_TEXT('101.5mm', '175.5mm', '30mm', '8mm' ,agencyFundTotal);
	}
}

/**
 * 添加其它信息到打印中
 */
ExpressBean.prototype.addOthersInfoToPrint = function() {
	let othersInfo = this.othersInfo;
	if(undefined != othersInfo && null != othersInfo) {
		let createExpressDate = this.transformDatesToSpecial(othersInfo.createExpressDate);// 制单时间
		if (createExpressDate != "") {
			LODOP.SET_PRINT_STYLE('FontSize', '10');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT('25.8mm', '161.6mm', '34mm', '18mm',createExpressDate);
		}
		let additionalTreaty = othersInfo.additionalTreaty;// 附加条约
		if(undefined != additionalTreaty && additionalTreaty != null) {
			LODOP.SET_PRINT_STYLE('FontSize', '10');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT('113.7mm', '152mm', '43mm', '8mm', additionalTreaty);
		}
		
		// 附加条约时间
		/**
		let additionalTreatyDate = this.transformDatesToSpecial(othersInfo.additionalTreatyDate, 'yyyy年MM月dd日');
		if(additionalTreatyDate != "") {
			LODOP.SET_PRINT_STYLE('FontSize', '12');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT('121.5mm', '167mm', '43mm', '8mm', additionalTreatyDate);
		}
		*/
		
		let carrier = othersInfo.carrier;
		if(carrier != undefined) {
			LODOP.SET_PRINT_STYLE('FontSize', '14');
			LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
			LODOP.ADD_PRINT_TEXT('118mm', '75mm', '43mm', '8mm', carrier);
		}
	}
}

/**
 * 信封信息
 * @param zipCode : 邮编
 * @param source : 始发地
 * @param dest : 目的地
 * @param goodsNo : 货号
 * @param fillInDate : 填写日期
 * @param comebackGoods : 签单带回货物
 * @param comebackGoodsCost : 货物运费
 * @param sender : 发货人
 * @param senderNumber : 发货人联系方式
 * @param agent : 经办人
 * @param signReq : 签收要求(枚举，1 : 收货单位公章; 2 : 签收人)
 * @param idCard : 身份证
 */
function EnvelopeInfo(zipCode, source, dest, goodsNo, fillInDate, comebackGoods, comebackGoodsCost, sender, senderNumber, agent, signReq, idCard) {
	this.zipCode = zipCode;
	this.source = source;
	this.dest = dest;
	this.goodsNo = goodsNo;
	this.fillInDate = fillInDate;
	this.comebackGoods = comebackGoods;
	this.comebackGoodsCost = comebackGoodsCost;
	this.sender = sender;
	this.senderNumber = senderNumber;
	this.agent = agent;
	this.signReq = signReq;
	this.idCard = idCard;
}

EnvelopeInfo.prototype.transformDatesToSpecial = function(date, format){
	if (undefined == date || null == date) {
		return "";
	}
	if (undefined == format || null == format) {
		format = "yyMMdd";
	}
	let dateStr = "";
	if (date instanceof Date) {
		dateStr = date.format(format); 
	} else if (typeof(date) == 'string') {
		dateStr = date;
	}
	return dateStr;
}

/**
 * 标签信息
 * @param tenantName: 租户名称(例如“众邦物流”)
 * @param tenantStaffPhone: 租户客服电话(例如“0757-85111487”)
 * @param lineName: 线路名称(例如“佛山-潮汕往返专线”)
 * @param source : 开单网点(例如“佛山”)
 * @param dest : 配送网点和配送区域(揭阳/揭阳区)
 * @param deliveryTypeName: 配送方式(自提)
 * @param goodsName: 品名(例如：威远药，多个用“/”分隔)
 * @param consignee : 收货人
 * @param goodsNo : 货物单号(运单号加货物数量，例如“28003278-30”)
 * @param detailAddress: 详细地址
 */
function StickerInfo(tenantName, tenantStaffPhone, lineName, source, dest, deliveryTypeName, goodsName, consignee, goodsNo, detailAddress) {
	this.tenantName = tenantName;
	this.tenantStaffPhone = tenantStaffPhone;
	this.lineName = lineName;
	this.source = source;
	this.dest = dest;
	this.deliveryTypeName = deliveryTypeName;
	this.goodsName = goodsName;
	this.consignee = consignee;
	this.goodsNo = goodsNo;
	this.detailAddress = detailAddress;
}

StickerInfo.prototype.transformDatesToSpecial = function(date, format){
	if (undefined == date || null == date) {
		return "";
	}
	if (undefined == format || null == format) {
		format = "yyMMdd";
	}
	let dateStr = "";
	if (date instanceof Date) {
		dateStr = date.format(format); 
	} else if (typeof(date) == 'string') {
		dateStr = date;
	}
	return dateStr;
}


/**
 * 打印快递单信息
 * @param expressBean : 快递单bean(见ExpressBean)
 * @param taskName : 任务名称(可为空)
 * lodop备注 : 打印任务名，字符型参数，由开发者自主设定，未限制长度，字符要求符合Windows文件起名规则，Lodop会根据该名记忆相关的打印设置、打印维护信息。
 * 若strTaskName空，控件则不保存本地化信息，打印全部由页面程序控制。
 * 系统备注 : 格式要求为 --> 子系统_模块名_任务名
 */
// const LODOP; // 全局变量，外层不能覆盖此变量
const printExpressInfo = function(expressBean, taskName) {
	if (undefined == expressBean || expressBean == null) {
		Message('无法获取需要打印的快递单信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	LODOP = getLodop();
	// PRINT_INITA(Top,Left,Width,Height,strPrintName)
	LODOP.PRINT_INITA('0mm', '0mm', '233.89mm', "148mm", taskName);
	//LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="' + getRootPath()+'/image/$tenantId$/110.jpg">');
	LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='/image/zb/110.jpg'>");
	LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
	// SET_PRINT_PAGESIZE(intOrient, PageWidth,PageHeight,strPageName)
	LODOP.SET_PRINT_PAGESIZE(0, "240mm", "148mm", "LodopCustomPage");
	LODOP.SET_SHOW_MODE("NP_NO_RESULT", true);// 解决谷歌浏览器长时间无反应是提示弹出框的问题
	LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW',1);
	LODOP.SET_SHOW_MODE("BKIMG_PRINT",0);
	
	LODOP.SET_SHOW_MODE("BKIMG_WIDTH",'203mm');
	LODOP.SET_SHOW_MODE("BKIMG_HEIGHT",'140mm');
	LODOP.SET_SHOW_MODE("BKIMG_TOP",'-4.0mm');	
	LODOP.SET_SHOW_MODE("BKIMG_LEFT",'-1.8mm');

	
	/******************将业务信息加入打印******************/
	expressBean.addAddressBeanToPrint();// 添加地址信息到打印中
	expressBean.addSenderAndAddresseeToPrint();// 添加寄件方和收件方信息到打印中
	expressBean.addGoodsInfoToPrint();// 添加货物信息到打印中
	expressBean.addDeliverInfoToPrint();// 添加交付信息到打印中	
	expressBean.addCostInfoToPrint();// 添加费用信息到打印中
	expressBean.addOthersInfoToPrint();// 添加其他信息到打印中

//	 “BKIMG_LEFT”：设置背景图位置X值
//	 “BKIMG_TOP”：设置背景图位置Y值
//	 “BKIMG_WIDTH”：设置背景图宽度
//	 “BKIMG_HEIGHT”：设置背景图高度
	LODOP.PREVIEW();
}

/**
 * 打印信封信息
 * @param envelopeInfo : 快递单bean(见EnvelopeInfo)
 * @param taskName : 任务名称(可为空)
 * @param pageNumber: 打印的份数
 * lodop备注 : 打印任务名，字符型参数，由开发者自主设定，未限制长度，字符要求符合Windows文件起名规则，Lodop会根据该名记忆相关的打印设置、打印维护信息。
 * 若strTaskName空，控件则不保存本地化信息，打印全部由页面程序控制。
 * 系统备注 : 格式要求为 --> 子系统_模块名_任务名
 */
const printEnvelopeInfo = function(envelopeInfo, taskName, pageNumber){
	if (undefined == envelopeInfo || envelopeInfo == null) {
		Message('无法获取需要打印的信封信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	if (undefined == pageNumber || pageNumber <= 0)
		pageNumber = 1;
	LODOP = getLodop();
	// PRINT_INITA(Top,Left,Width,Height,strPrintName)
	LODOP.PRINT_INITA('6.3mm', '0mm', '243mm', "120mm", taskName);
	// SET_PRINT_PAGESIZE(intOrient, PageWidth,PageHeight,strPageName)
	LODOP.SET_PRINT_PAGESIZE(0, "243mm", "120mm", "LodopCustomPage");
	LODOP.SET_SHOW_MODE("NP_NO_RESULT", true);// 解决谷歌浏览器长时间无反应是提示弹出框的问题
	LODOP.SET_PRINT_COPIES(pageNumber);
	
	let zipCode = envelopeInfo.zipCode;
	if (undefined != zipCode && null != zipCode) {
		LODOP.SET_PRINT_STYLE('FontSize', '16');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		for(let i = 0; i < zipCode.length; i++) {
			if (i == 6) 
				break;
				let code = zipCode.charAt(i);
			LODOP.ADD_PRINT_TEXT('3.1mm', (6.5 + i * 10)+ 'mm', '6mm', '6mm', code);
		}
	}
	
	let source = envelopeInfo.source;
	if (undefined != source && null != source) {
		LODOP.SET_PRINT_STYLE('FontSize', '14');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('39.0mm', '20mm', '35mm', '10mm', source);
	}
	
	let dest = envelopeInfo.dest;
	if (undefined != dest && null != dest) {
		LODOP.SET_PRINT_STYLE('FontSize', '14');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('39.0mm', '47.3mm', '35mm', '10mm', dest);
	}
	
	let goodsNo = envelopeInfo.goodsNo;
	if (undefined != goodsNo && null != goodsNo) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('39.0mm', '78.0mm', '40mm', '10mm', goodsNo);
	}
	
	let fillInDate = envelopeInfo.fillInDate;
	if (undefined != fillInDate && null != fillInDate) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		let fillInDateStr = envelopeInfo.transformDatesToSpecial(fillInDate);
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		if (undefined != fillInDateStr && null != fillInDateStr) {
			if (fillInDateStr.length >= 2) {
				LODOP.ADD_PRINT_TEXT('39.0mm', '139.5mm', '8mm', '10mm', fillInDateStr.substr(0,2));
			}
			if (fillInDateStr.length >= 4) {
				LODOP.ADD_PRINT_TEXT('39.0mm', '150.7mm', '8mm', '10mm', fillInDateStr.substr(2,2));
			}
			if (fillInDateStr.length >= 6) {
				LODOP.ADD_PRINT_TEXT('39.0mm', '162.5mm', '8mm', '10mm', fillInDateStr.substr(4,2));
			}
		}
	}

	let comebackGoods = envelopeInfo.comebackGoods;
	if (undefined != comebackGoods && null != comebackGoods) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('51.0mm', '34.5mm', '32mm', '20mm', comebackGoods);
	}
	
	let comebackGoodsCost = envelopeInfo.comebackGoodsCost;
	if (undefined != comebackGoodsCost && null != comebackGoodsCost) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('51.0mm', '87.5mm', '25mm', '20mm', comebackGoodsCost);
	}
	
	let sender = envelopeInfo.sender;
	if (undefined != sender && null != sender) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('60.2mm', '33.8mm', '33mm', '20mm', sender);
	}
	
	let senderNumber = envelopeInfo.senderNumber;
	if (undefined != senderNumber && null != senderNumber) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('60.2mm', '97.5mm', '42mm', '20mm', senderNumber);
	}
	
	let agent = envelopeInfo.agent;
	if (undefined != agent && null != agent) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('71.3mm', '121.5mm', '40mm', '20mm', agent);
	}
	
	let signReq = envelopeInfo.signReq;
	if (1 == signReq || 2 == signReq) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		if (signReq == 1) {			
			LODOP.ADD_PRINT_TEXT('80.8mm', '35.4mm', '42mm', '20mm', "√");
		} else {
			LODOP.ADD_PRINT_TEXT('80.8mm', '65.5mm', '42mm', '20mm', "√");
		}
	}
	
	let idCard = envelopeInfo.idCard;
	if (undefined != idCard && null != idCard) {
		LODOP.SET_PRINT_STYLE('FontSize', '13');
		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('93.9mm', '40.2mm', '65mm', '20mm', idCard);
	}
	LODOP.PREVIEW();
}

/**
 * 打印标签信息
 * @param stickerInfo : 贴纸bean(见StickerInfo)
 * @param taskName : 任务名称(可为空)
 * lodop备注 : 打印任务名，字符型参数，由开发者自主设定，未限制长度，字符要求符合Windows文件起名规则，Lodop会根据该名记忆相关的打印设置、打印维护信息。
 * 若strTaskName空，控件则不保存本地化信息，打印全部由页面程序控制。
 * 系统备注 : 格式要求为 --> 子系统_模块名_任务名
 */
const printStickerInfo = function(stickerInfo, taskName, pageNumber,strPName){
	if (undefined == stickerInfo || stickerInfo == null) {
		Message('无法获取需要打印的标签信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	if (undefined == pageNumber || pageNumber <= 0)
		pageNumber = 1;
	LODOP = getLodop();
	// PRINT_INITA(Top,Left,Width,Height,strPrintName)
	LODOP.PRINT_INITA('0mm', '0mm', '79.5mm', "49.5mm", taskName);
	// SET_PRINT_PAGESIZE(intOrient, PageWidth,PageHeight,strPageName)
	LODOP.SET_PRINT_PAGESIZE(0, "79.5mm", "49.5mm", "LodopCustomPage");
	LODOP.SET_PRINT_COPIES(pageNumber);
	LODOP.SET_SHOW_MODE("NP_NO_RESULT", true);// 解决谷歌浏览器长时间无反应是提示弹出框的问题
	LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
	
	let tenantName = stickerInfo.tenantName;
	LODOP.SET_PRINT_STYLE('FontSize', '16');
	if (undefined != tenantName) {// 租户名字
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('7.0mm', '6.0mm', '30mm', '12mm', tenantName);
	}

	LODOP.SET_PRINT_STYLE('Bold', 0);// 粗体
	let tenantStaffPhone = stickerInfo.tenantStaffPhone;
	if (undefined != tenantStaffPhone) {// 客服电话
		let offsetX = 35;
		if (undefined != tenantName) {
			offsetX = 6.0 + tenantName.length * 5.6 + 4.0;
		}
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('7.4mm', offsetX + 'mm', '40mm', '12mm', tenantStaffPhone);
	}
	
	let lineName = stickerInfo.lineName;
	if (undefined != lineName) {// 线路名称
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('13.0mm', '19mm', '60mm', '12mm', lineName);
	}

	LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
	let source = stickerInfo.source;
	if (undefined != source) {// 开单网点(例如“佛山”)
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('20mm', '6.0mm', '35mm', '10mm', source);

		let offsetX = 6.0 + source.length * 4.5;
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		//sLODOP.ADD_PRINT_TEXT('20mm', (offsetX + 1.5) + 'mm', '10mm', '10mm', '-');
		LODOP.ADD_PRINT_TEXT('20mm', offsetX + 'mm', '30mm', '10mm', '—');
	}
	
	let dest = stickerInfo.dest;
	if (undefined != dest) {//  配送网点和配送区域(揭阳/揭阳区)
		LODOP.SET_PRINT_STYLE('FontSize', '11');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		// 开单网点 ＋ 空格 + 至 + 空格
		let offsetX = source.length * 4.5 +10;
		LODOP.ADD_PRINT_TEXT('20mm', offsetX + 'mm', '50mm', '10mm', dest);//企安打印标签 xj02
	}
	
	let goodsName = stickerInfo.goodsName;
	if(undefined != goodsName) {	
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('26.5mm', '6.0mm', '60mm', '10mm', '品名：' + goodsName);
	}
	
	let consignee = stickerInfo.consignee;
	if(undefined != consignee) {	
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		let offsetX = 30;
		if (undefined != goodsName) {
			offsetX = 6.0 + (3 + goodsName.length) * 4.2 + 6.5;
		}
		LODOP.ADD_PRINT_TEXT('26.5mm', offsetX + 'mm', '60mm', '10mm', '收货人：' + consignee);
	}
	
	let goodsNo = stickerInfo.goodsNo;
	if(undefined != goodsNo) {	
		LODOP.SET_PRINT_STYLE('Bold', 0);// 粗体
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('33mm', '6.0mm', '60mm', '10mm', '货号：');

		LODOP.SET_PRINT_STYLE('Bold', 1);// 粗体
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		LODOP.ADD_PRINT_TEXT('33mm', '18.0mm', '60mm', '10mm', goodsNo);
	}
	
	let deliveryTypeName = stickerInfo.deliveryTypeName;
	if(undefined != deliveryTypeName) {	// 配送方式
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('33mm', '60mm', '14mm', '10mm', deliveryTypeName);
	}
	
	let detailAddress = stickerInfo.detailAddress;
	if (undefined != detailAddress) {
		LODOP.SET_PRINT_STYLE('FontSize', '12');
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT('39.5mm', '6mm', '67.5mm', '20mm', detailAddress);
	}
	if(strPName!=null){
		LODOP.SET_PRINTER_INDEXA(strPName);
	}
	LODOP.PREVIEW();
}

/**
 * 打印的HTML信息
 * @param {*} tableElementId 
 * @param {*} taskName 
 * @param {*} strPName 
 */
const printHTMLInfo = function(elementId, taskName,strPName,successFun){
	if (undefined == elementId) {
		Message('请选择需要打印的页面信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	LODOP=getLodop();  
	LODOP.PRINT_INIT(taskName);
	LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
	LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);
	LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);//宽度溢出缩放
	LODOP.ADD_PRINT_HTM(5, 2, "99.8%", "95%", document.getElementById(elementId).innerHTML);
	if(strPName!=null){
		 LODOP.SET_PRINTER_INDEXA(strPName);
	}
	if (LODOP.CVERSION) {
		// 监听打印状态
		LODOP.On_Return=function(TaskID,Value){
			successFun(Value)
		};
	}
	LODOP.PREVIEW();
}

/**
 * 打印的HTML信息 - A5
 * @param {*} tableElementId 
 * @param {*} taskName 
 * @param {*} strPName 
 */
const printHTMLInfoA5 = function(elementId, taskName,strPName,successFun){
	if (undefined == elementId) {
		Message('请选择需要打印的页面信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	LODOP=getLodop();  
	LODOP.PRINT_INIT(taskName);
	LODOP.SET_PRINT_PAGESIZE(0, 0, 0, "A5");
	LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);
	LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);//宽度溢出缩放
	LODOP.ADD_PRINT_HTM(5, 2, "99.8%", "99%", document.getElementById(elementId).innerHTML);
	if(strPName!=null){
		 LODOP.SET_PRINTER_INDEXA(strPName);
	}
	if (LODOP.CVERSION) {
		// 监听打印状态
		LODOP.On_Return=function(TaskID,Value){
            if(value){
                successFun(Value)
            }
		};
	}
	LODOP.PREVIEW();
}

/**
 * 打印的表格信息
 * @param {*} tableElementId 
 * @param {*} taskName 
 * @param {*} strPName 
 */
const printTableInfo = function(tableElementId, taskName,strPName,successFun){
	if (undefined == tableElementId) {
		Message('请选择需要打印的表格信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	LODOP=getLodop();  
	LODOP.PRINT_INIT(taskName);
	LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
	LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);
	LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);//宽度溢出缩放
	LODOP.ADD_PRINT_TABLE(5, 2, "99.8%", "95%", document.getElementById(tableElementId).innerHTML);
	if(strPName!=null){
		 LODOP.SET_PRINTER_INDEXA(strPName);
	}
	if (LODOP.CVERSION) {
		// 监听打印状态
		LODOP.On_Return=function(TaskID,Value){
			successFun(Value)
		};
	}
	LODOP.PREVIEW();
	// if(strPName!=null){
	// 	LODOP.PRINTB();
	// }else{
	// 	LODOP.PREVIEW();
	// }
}

const printTableInfo_dis = function(tableElementId, taskName,strPName,bo){
    if (undefined == tableElementId) {
        Message('请选择需要打印的表格信息');
        return false;
    }
    if (undefined == taskName || taskName == null) {
        taskName = '';
    }
    LODOP=getLodop();
    LODOP.PRINT_INIT(taskName);
    // LODOP.SET_PRINT_PAGESIZE(0, 0, 0, "A4");
    LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);
    LODOP.ADD_PRINT_TABLE(5, 2, "99.8%", "95%", document.getElementById(tableElementId).innerHTML);
    LODOP.SET_PRINT_STYLEA(0,"TableHeightScope",2);
    if(bo){
        LODOP.SET_PRINT_PAGESIZE(1,2400,1400);
    }
    if(strPName!=null){
        LODOP.SET_PRINTER_INDEXA(strPName);
    }
    let mes = null;
    if(strPName!=null){
        LODOP.PRINTB();
    }else{
        mes = LODOP.PREVIEW();
    }
    return mes;
}

const printTableInfoOnePage = function(tableElementId, taskName,strPName){
	if (undefined == tableElementId) {
		Message('请选择需要打印的表格信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	LODOP=getLodop();  
	LODOP.PRINT_INIT(taskName);
	LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
	LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);
    LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT",'Auto-Height');
	LODOP.ADD_PRINT_TABLE(5, 2, "99.8%", "95%", document.getElementById(tableElementId).innerHTML);
	if(strPName!=null){
		 LODOP.SET_PRINTER_INDEXA(strPName);
	}
	if(strPName!=null){
		LODOP.PRINTB();
	}else{
		LODOP.PREVIEW();
	}
}

const printTableInfoT = function(tableElementId, taskName,strPName){
	if (undefined == tableElementId) {
		Message('请选择需要打印的表格信息');
		return false;
	}
	if (undefined == taskName || taskName == null) {
		taskName = '';
	}
	LODOP=getLodop();  
	LODOP.PRINT_INIT(taskName);
	LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",0);
	LODOP.ADD_PRINT_TABLE(5, 2, "99.8%", "95%", document.getElementById(tableElementId).innerHTML);
	if(strPName!=null){
	   LODOP.SET_PRINTER_INDEXA(strPName);
	   }
	LODOP.PREVIEW();	
}

/**
 * config: 对应Sys_Print_Config表对象
 * itemList: 对应Sys_Print_item表对象
 */
function PrintConfigBean(config, itemList) {
	this.config = config;
	this.itemList = itemList;
}

/**
 * fieldName: 域名
 * fieldValue: 域值
 * topOffset: 整页上边距（相对于打印top偏移量）
 * leftOffset: 整页左边距（相对于打印top偏移量）
 * itemWidth: 宽度
 * itemHeight: 高度
 * fontSize: 字体大小
 * fontBold: 是否加粗
 */
function PrintItemBean(fieldName, fieldValue, topOffset, leftOffset, itemWidth, itemHeight, fontSize, fontBold){
	this.fieldName = fieldName;
	this.fieldValue = fieldValue;
	this.topOffset = topOffset;
	this.leftOffset = leftOffset;
	this.itemWidth = itemWidth;
	this.itemHeight = itemHeight;
	this.fontSize = fontSize;
	this.fontBold = fontBold;
}

function isBlankObject(obj) {
	return undefined == obj || null == obj;
}

function getObjectFieldValue(object, field, defaultVale) {
	let fieldValue = undefined;
	if(field.indexOf('.') > 0) {
		let subFields = field.split('.');
		let subObject = undefined;
		for(let i = 0; i < subFields.length - 1; i++) {
			if (i == 0) {
				subObject = object[subFields[i]];
			} else {
				subObject = subObject[subFields[i]];
			}
			if (isBlankObject(subObject) || typeof(subObject) != 'object')
				break;
		}
		if (!isBlankObject(subObject)) 
			fieldValue = subObject[subFields[subFields.length - 1]];
	} else {
		fieldValue = object[field];
	}
	if (isBlankObject(fieldValue) && !isBlankObject(defaultVale))
		return defaultVale;
	return fieldValue;
}

/**
 * 转换打印单位，默认为毫米(mm)
 * @param printField
 * @param unit
 */
function convertPrintUnit(printField, unit) {
	if (isBlankObject(unit))
		unit = 'mm';
	if (isBlankObject(printField))
		printField = 0;
	return printField + unit;
}

function parsePrintItem(itemList, dataSource) {
	let retItems = new Array();
	doParsePrintItem(itemList, dataSource, retItems);
	return retItems;
}

function doParsePrintItem(itemList, dataSource, retItems, specialFieldName) {
	for(let i = 0; undefined != itemList && i < itemList.length; i++) {
		let item = itemList[i];
		let fieldName = item.objectKey;// 域名
		if (isBlankObject(fieldName))// 如果fieldName为空，则不解析
			continue;
		
		if (!isBlankObject(specialFieldName) && fieldName != specialFieldName) // 值解析特定的fieldName
			continue;
		
		if (!isBlankObject(getSpecailFieldPrintItem(retItems,fieldName)))// 已经解析过
			continue;
		
			let fieldValue = item.specialObjectValue;// 域值
		if (isBlankObject(fieldValue) || fieldValue == '') {
			fieldValue = getObjectFieldValue(dataSource, fieldName, '');
		}
		
		// 计算偏移量
		let posType = item.posType;// 位置类型
		let relObjectKey = item.relObjectKey;// 位置相对对象key
		let offsetValue = item.offsetValue;// 位置相对relObjectKey偏移值
		let topOffset = item.topOffset;// top偏移值 
		let leftOffset = item.leftOffset;// left偏移值
		let itemWidth = item.itemWidth;// 宽度
		let itemHeight = item.itemHeight;// 高度
		let fontBold = item.fontBold;// 是否粗体
		let fontSize = item.fontSize;// 字体大小

		if (posType == 2 || posType == 3) {// X轴偏移 或 Y轴偏移
			if (fieldName == relObjectKey && fieldValue instanceof Array) {// 自己跟自己关联
				for (let j = 0; j < fieldValue.length; j++) {
					let subField = fieldValue[j];
					let mm = convertFontSizeToMM(fontSize);
					if (j != 0) {
						if (posType == 2) {// X轴偏移
							leftOffset = leftOffset + mm * fieldValue[j - 1].length + offsetValue;
						} else {// Y轴偏移
							topOffset = topOffset + mm + offsetValue;
						}
					}
					retItems.push(new PrintItemBean(fieldName + '_' + j, subField, topOffset, leftOffset, itemWidth, itemHeight, fontSize, fontBold));
				}
			} else if (!isBlankObject(relObjectKey) && fieldName != relObjectKey) {
				let relObjectItem = getSpecailFieldPrintItem(relObjectKey, retItems);
				if (isBlankObject(relObjectItem)) {// 没有的话，就解析
					doParsePrintItem(itemList, dataSource, retItems, relObjectKey);
					relObjectItem = getSpecailFieldPrintItem(relObjectKey, retItems);
				}
				if (!isBlankObject(relObjectItem)) {
					let mm = convertFontSizeToMM(relObjectItem.fontSize);
					if (posType == 2) {// X轴偏移
						leftOffset = relObjectItem.leftOffset + mm * relObjectItem.fieldValue.length + offsetValue;
						topOffset = relObjectItem.topOffset;
					} else {// Y轴偏移
						leftOffset = relObjectItem.leftOffset;
						topOffset = relObjectItem.topOffset + mm + offsetValue;
					}
					retItems.push(new PrintItemBean(fieldName, fieldValue, topOffset, leftOffset, itemWidth, itemHeight, fontSize, fontBold));
				}
			}// TODO 其他情况忽略
		} else {// 固定位置
			retItems.push(new PrintItemBean(fieldName, fieldValue, topOffset, leftOffset, itemWidth, itemHeight, fontSize, fontBold));
		}
	}
}

/**
 * 获取已经获得解析的打印项
 * 
 * @param fieldName
 * @param retItems
 * @returns
 */
function getSpecailFieldPrintItem(fieldName, retItems) {
	let retItem = undefined;
	for (let i = 0; i < retItems.length; i++) {
		let item = retItems[i];
		if (fieldName == item.fieldName) {
			retItem = item;			
			break;
		}
	}
	return retItem;
}

/**
 * 将字体磅数转换为毫米
 * 
 * @param fontSize
 * @returns
 */
function convertFontSizeToMM(fontSize) {
	if (fontSize == 5) {// 八号字体
		return 1.74;
	} else if (fontSize == 5.5) {// 七号
		return 1.94;
	} else if (fontSize == 6.5) {// 小六
		return 2.29;
	} else if (fontSize == 7.5) {// 六号
		return 2.65;
	} else if (fontSize == 9) {// 小五
		return 3.18;
	} else if (fontSize == 10.5) {// 五号
		return 3.70;
	} else if (fontSize == 12) {// 小四
		return 4.32;
	} else if (fontSize == 13) {
		return 4.63;
	} else if (fontSize == 14) {// 四号
		return 4.94;
	} else if (fontSize == 15) {// 小三
		return 5.29;
	} else if (fontSize == 16) {// 三号
		return 5.64;
	} else if (fontSize == 18) {// 小二
		return 6.35;
	} else if (fontSize == 22) {// 二号
		return 7.76;
	} else if (fontSize == 24) {// 小一
		return 8.47;
	} else if (fontSize == 26) {// 一号
		return 9.17;
	} else if (fontSize == 36) {// 小初
		return 12.70;
	} else if (fontSize == 42) {// 初号
		return 14.82;
	}
	return 0;// 其他字体一律返回0，表示不支持
	
}

/**
 * 通用打印方法(不支持表格打印)
 * 
 * @param printConfigBean: 见
 * @param pageNumber: 打印份数
 */
const commonPrint = function (printConfigBean, dataSource, pageNumber,isPreview,strPName) {
	let config = printConfigBean.config;// 打印配置信息
	let itemList = printConfigBean.itemList;// 打印项
	if (isBlankObject(printConfigBean) || isBlankObject(config) || isBlankObject(itemList) || itemList.length == 0) {
		Message('无法获取需要打印的信息');
		return;
	}
	let taskName = getObjectFieldValue(config, 'bizName', '打印任务');// 任务名称
	if (undefined == pageNumber || pageNumber <= 0)
		pageNumber = 1;
	// 处理打印项
	let printItmes = parsePrintItem(itemList, dataSource);
	if (isBlankObject(printItmes) || printItmes.length == 0) {
		Message('无法获取需要打印的信息');
		return;
	}
	
	LODOP = getLodop();
	// PRINT_INITA(Top,Left,Width,Height,strPrintName)
	LODOP.PRINT_INITA(convertPrintUnit(config.topOffset), convertPrintUnit(config.leftOffset), convertPrintUnit(config.editableWidth), convertPrintUnit(config.editableHeight), taskName);
	// SET_PRINT_PAGESIZE(intOrient, PageWidth,PageHeight,strPageName)
	LODOP.SET_PRINT_PAGESIZE(config.intOrient, convertPrintUnit(config.pageWidth), convertPrintUnit(config.pageHeight), config.pageName);
	if (!isBlankObject(config.bkimgName) && !isBlankObject(config.bkimgPrint) && config.bkimgPrint == 1) {// 存在打印预览背景图片
		let imageFullPath = getRootPath() + '/image/zb/' + config.bkimgName;
		LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="' + imageFullPath + '">');
		LODOP.SET_SHOW_MODE("BKIMG_WIDTH", convertPrintUnit(config.bkimgWidth));
		LODOP.SET_SHOW_MODE("BKIMG_HEIGHT", convertPrintUnit(config.bkimgHeight));
		LODOP.SET_SHOW_MODE("BKIMG_TOP", convertPrintUnit(config.bkimgTop));	
		LODOP.SET_SHOW_MODE("BKIMG_LEFT", convertPrintUnit(config.bkimgLeft));
		LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', config.bkimgPrint);
		LODOP.SET_SHOW_MODE("BKIMG_PRINT",0);
	}
    //let zxingImagePath = 'F:\\workspace\\vpzb\\html\\image\\zb\\1479879999.png';
	LODOP.SET_SHOW_MODE("NP_NO_RESULT", true);// 解决谷歌浏览器长时间无反应是提示弹出框的问题
	LODOP.SET_PRINT_COPIES(pageNumber);// 打印页数
    for (let i = 0; undefined != printItmes && i < printItmes.length; i++) {
		let item = printItmes[i];
		LODOP.SET_PRINT_STYLE('FontSize', item.fontSize);
		LODOP.SET_PRINT_STYLE('Bold', item.fontBold);
		// ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
		LODOP.ADD_PRINT_TEXT(convertPrintUnit(item.topOffset), convertPrintUnit(item.leftOffset), convertPrintUnit(item.itemWidth), convertPrintUnit(item.itemHeight), item.fieldValue);
	}
    //LODOP.ADD_PRINT_IMAGE('87mm','99mm','80mm','80mm',zxingImagePath);
    if(strPName!=null){
    	LODOP.SET_PRINTER_INDEXA(strPName);
    }
    if(undefined != isPreview && null != isPreview && isPreview){
        LODOP.PREVIEW();
    }else{
        LODOP.PRINTA();
    }

}


/**
 * 打印条码
 * @param {条码} codeTag 
 * @param {文字} txtTag 
 */
 const printQrcode = function(codeTag,txtTag){
	LODOP=getLodop();
    LODOP.ADD_PRINT_IMAGE('3mm','0','40mm','20mm',codeTag);
	LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
    LODOP.ADD_PRINT_HTM('23mm','0','40mm','7mm',txtTag);
	// LODOP.PREVIEW();
	LODOP.PRINT();
}

export default {
	printExpressInfo,		//打印快递单信息
	printEnvelopeInfo,		//打印信封信息
	printStickerInfo,		//打印标签信息
	printHTMLInfo,			//打印HTML信息
	printHTMLInfoA5,		//打印HTML信息 - A5
	printTableInfo,			//打印表格信息(A4)
	printTableInfo_dis,		//打印表格信息
	printTableInfoOnePage,	//打印表格信息
	printTableInfoT,		//打印表格信息
	commonPrint,			//通用打印方法(不支持表格打印)
	printQrcode,			//打印条码
}
