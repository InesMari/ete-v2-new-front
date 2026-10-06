import lodopUtil from "@/utils/lodop/lodop-business.js"
export default {
    props:['isShowSet','businessTypes'],
    name: 'printSet',
    data() {
        return {
            isShow:false,
            listTem:[
                  { bizName:"面单打印",printerName:"",businessTypes:"1"}
            ],
            devicesList :[], //电脑打印列表
            devicesListTem :[], //电脑打印列表
            printerBusinessTypeList:[], // 打印业务类型
            currentPrinterList : [], // 已设置打印机列表
            printerBusinessTypeListTem : [] // 打印业务类型 - TEM

            
        }
    },
    mounted(){
        this.queryPrinters();
        this.initSysStaticData();
        let that = this;
    //     setTimeout(function(){
    //         that.initDevices();
    //         setTimeout(function(){
    //             that.dealPrintList();
    //         },5000)
    //    },3000)
    },

    methods: {
        // 初始化静态数据
        initSysStaticData(){
            let that = this;
            let url = "api/sysStaticDataBO.ajax?cmd=getSysStaticDataSimpleByCodeTypes";
            let codeTypes = [];
            codeTypes.push("PRINTER_BUSINESS_TYPES");  
            that.common.postUrl(url,{"codeTypes":codeTypes.join(",")},function(data){
                 that.printerBusinessTypeList = data.PRINTER_BUSINESS_TYPES;
                
            });
        },
        /**初始化打印机列表 */
        initDevices(){
           let arrs = lodopUtil.queryPrintDevices();
        //    console.log(arrs);
           if(this.common.isNotBlank(arrs)){
            //    this.devicesList = arrs;
               this.devicesListTem = arrs;
               
           }
        },
        // 查询设置的打印机
        queryPrinters (){
            let that = this;
            let params = {};
            that.common.postUrl("api/sysPrintBO.ajax?cmd=queryPrinters&1=1", params,function(data){
              if(that.common.isNotBlank(data) && that.common.isNotBlank(data.items)){
                 that.currentPrinterList = data.items;
              }
            });
        },
        // 过滤 选择打印列表
        dealPrintList (){
            if(this.common.isBlank(this.devicesListTem) || this.devicesListTem.length == 0){
                 // 未返回数据不校验处理
                 return;
            }
            let that = this;
            let businessTypes = this.businessTypes;
            that.devicesList  = [];
            that.printerBusinessTypeListTem = that.common.copyObj(that.printerBusinessTypeList);
            if(that.common.isNotBlank(businessTypes)){
               let tems = [];
               let buss = businessTypes.split(",");
               let printerBusinessTypeListTem = that.printerBusinessTypeListTem;
               for(let b in buss){
                    for(let i in printerBusinessTypeListTem){
                       if(buss[b] == printerBusinessTypeListTem[i].codeValue){
                           tems.push(printerBusinessTypeListTem[i]);
                       }
                    }
               }
               that.printerBusinessTypeList = tems;
            }
            let arrs = [];
            for(let i in that.printerBusinessTypeList){
                 let p =  that.printerBusinessTypeList[i];
                 var arr = {};
                 arr.businessTypes = p.codeValue;
                 arr.bizName = p.codeName;
                 arr.bizCode = p.codeDesc;
                 for(let j in that.currentPrinterList){
                     let c =  that.currentPrinterList[j];
                     if(p.codeValue == c.businessTypes){
                           let chceck = lodopUtil.checkPrintDevice(c.printerName);
                           if(that.common.isBlank(chceck) ||  !chceck){
                               that.$message({"type":"success", message: p.codeName +"在本电脑，未找到打印机："+c.printerName+"；请重新设置"});   
                           }else{
                              arr.printerName = c.printerName;
                           }
                     }
                 }
                 arrs.push(arr);
            }
            that.devicesList  = arrs;
            console.log(that.devicesList);
            // that.forceUpdate();

        },
         /** 隐藏 */
        hidePrint(){
            this.isShow = false;
            this.$emit("showChange",this.isShow);
        },
         /** 保存设置 */
        sureSet(){
            let that = this;
            let params = {};
            let devices = [];
            for(let i in that.devicesList){
                let d = that.devicesList[i];
                if(that.common.isNotBlank(d.printerName)){
                    d.printerSerialNum = that.getPrintIndex(d.printerName);
                    devices.push(d);
                }
            }
            if(devices.length <= 0){
                that.$message({"type":"success", message:"至少要选择1种类型打印"});   
                return;
            }
            params.paramStr = JSON.stringify(devices);
            params.businessTypes = that.businessTypes;
            that.common.postUrl("api/sysPrintBO.ajax?cmd=savePrinter", params,function(data){
              if(that.common.isNotBlank(data)){
                 that.$message({"type":"success", message:"设置成功"});   
                 that.hidePrint();
                 that.$emit("sureCallback",devices);
              }
            });
           
        },
        /**获取打印机位置 */
        getPrintIndex (printerName){
            let lists = this.devicesListTem;
            for(let i in lists){
               if(lists[i].printerName == printerName ){
                return lists[i].printerSerialNum; 
               }
            }
        },
        // 默认值 select BUG  @change="forceUpdate()"
       forceUpdate() {
         this.$forceUpdate();
      },
    },
    watch:{
        isShowSet:{
            handler(n){
                if(n){
                    this.initDevices();
                    this.dealPrintList();
                }
                this.isShow = n;
            }
        }
    }
}