let head = [ 
    {"name":"发车批次","code":"batchNumAlias","width":"100","type" : "text"},
    {"name":"派车时间","code":"loadTime","width":"110","type" : "text"},
    {"name":"车辆状态","code":"stateName","width":"100","type" : "text"},
    {"name":"司机","code":"driverName","width":"100","type" : "text"},
    {"name":"车牌","code":"plateNumber","width":"80","type" : "text"},
    {"name":"司机电话","code":"driverBill","width":"100","type" : "text"},
    {"name":"运费","code":"freight","width":"100","type":"text","isSum":"true"},
    {"name":"装卸费","code":"handingCosts","width":"100","type" : "text","isSum":"true"},
    {"name":"自定义名称","code":"customFeeName","width":"100","type" : "text"},
    {"name":"自定义金额","code":"customFee","width":"100","type" : "text","isSum":"true"},
    {"name":"体积(方)","code":"volume","numberic":"4","width":"90","type" : "text","isSum":"true"},
    {"name":"重量(吨)","code":"weight","numberic":"4","width":"90","type" : "text","isSum":"true"},
    {"name":"件数","code":"count","width":"80","type" : "text","isSum":"true"},
    {"name":"订单数","code":"orderNum","width":"80","type" : "text","isSum":"true"},
    {"name":"提货人","code":"loader","width":"100","type" : "text"},
    {"name":"备注","code":"remarks","width":"200","type" : "text"}
]
let data = {"hasNext":false,"count":30,"page":1,"totalNum":4,"items":[{"loader":"蔡蓓丽","freight":"22.00","count":100.0,"batchNum":12.0,"weight":14.0,"orderNum":1.0,"batchNumAlias":"2-20190808-1","plateNumber":"粤A88888","driverBill":"15270200049","customFeeName":"","volume":2.8,"loadTime":"2019-08-08 16:07","stateName":"未发车","driverName":"彭广才","customFee":"100.00","state":1.0,"handingCosts":0.0,"remarks":""},{"loader":"蔡蓓丽","freight":"50000.00","count":10002.0,"batchNum":11.0,"weight":50001.0,"orderNum":1.0,"batchNumAlias":"2-20190802-5","plateNumber":"粤A88888","driverBill":"15270200049","customFeeName":"护送费","volume":502.0,"loadTime":"2019-08-02 15:40","stateName":"已到货","driverName":"彭广才","customFee":"7070.00","state":3.0,"handingCosts":"7000.00","remarks":""},{"loader":"蔡蓓丽","freight":"3333333.00","count":801.0,"batchNum":7.0,"weight":110.81,"orderNum":9.0,"batchNumAlias":"2-20190730-4","plateNumber":"赣G96825","driverBill":"18620057602","customFeeName":"","volume":442.6,"loadTime":"2019-07-30 20:15","stateName":"未发车","driverName":"周江华","customFee":0.0,"state":1.0,"handingCosts":0.0,"remarks":""},{"loader":"蔡蓓丽","freight":"14.00","count":100.0,"batchNum":6.0,"weight":14.0,"orderNum":1.0,"batchNumAlias":"2-20190730-3","plateNumber":"赣G96825","driverBill":"18620057602","customFeeName":"","volume":2.8,"loadTime":"2019-07-30 19:43","stateName":"运输中","driverName":"周江华","customFee":"8.00","state":2.0,"handingCosts":"7.00","remarks":""}]}
let arr = [{
    "name": "1111",
    "checked": false
  }, {
    "name": "2222",
    "checked": false
  }, {
    "name": "3333",
    "checked": false
  }]
  
export{
    head,
    data,
    arr
}