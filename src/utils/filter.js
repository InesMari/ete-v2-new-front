import Vue from 'vue'
let numberToCurrencyNo = function (value){
    if(value===''||value===undefined||value===null) return '';
    if (!value) return 0
    // 获取整数部分
    const intPart = Math.trunc(value)
    // 整数部分处理，增加,
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    // 预定义小数部分
    let floatPart = ''
    // 将数值截取为小数部分和整数部分
    const valueArray = value.toString().split('.')
    if (valueArray.length === 2) { // 有小数部分
        floatPart = valueArray[1].toString() // 取得小数部分
        return intPartFormat + '.' + floatPart
    }
    return intPartFormat + floatPart;
};

Vue.filter('double', function(value) {
    let realVal = ''
    if (value) {
        realVal = parseFloat(value).toFixed(2)
    }else{
        realVal = 0.00
    }
    return realVal
})

Vue.filter('permill', function(num) {
    // 检查输入是否为有效数字
    if (typeof num !== 'number' || isNaN(num)) {
        return num;
    }
    
    // 将数字转换为字符串并按小数点分割
    const parts = num.toString().split('.');
    // 处理整数部分
    const integerPart = parts[0];
    // 处理小数部分（如果存在）
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    // 对整数部分添加千位分隔符
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // 组合整数部分和小数部分并返回
    return formattedInteger + decimalPart;
})

Vue.filter('numberToCurrencyNoByFlag', function(value,flag) {
    if(!flag){
        return value;
    }
    return numberToCurrencyNo(value);
})

Vue.filter('numberToCurrencyNo', function(value) {
    return numberToCurrencyNo(value);
})


Vue.filter('emptyToStr', function(value) {
    return value?value:"--";
})
Vue.filter('emptyToZero', function(value) {
    return value?value:0;
})