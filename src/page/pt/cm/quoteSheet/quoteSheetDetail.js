export default {
    name: 'quoteSheetDetail',
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{
                    custTenantId:'',
                    custName:'',
                    linkman:'',
                    billId:'',
                    ourLinkman:'',
                    ourBillId:'',
                    email:'',
                    ourEmail:'',
                    remark:'',
                    workStoreId:'',
                    quoteDate:'',
                },
                details:[],
                hisInfo:[]
            },
            head: [
                {"name": "计费方式", "code": "billingTypeName", "width": "110"},
                {"name": "报价车型", "code": "quoteVehicleTypeName", "width": "110"},
                {"name": "车长", "code": "vehicleLengthName", "width": "110"},
                {"name": "是否往返", "code": "isRoundName", "width": "110"},
                {"name": "未税单价（元）", "code": "fee", "width": "110"},
                {"name": "增值税（%）", "code": "taxRate", "width": "110"},
                {"name": "价税合计（元）", "code": "feeWithTax", "width": "110"},
                {"name": "备注", "code": "remark", "width": "220"}
            ],
            head2: [
                {"name": "费用类型", "code": "feeTypeName", "width": "110"},
                {"name": "计费方式", "code": "billingTypeName", "width": "110"},
                {"name": "区间", "code": "rangeStart","code2":"rangeEnd", "type":"range", "width": "110"},
                {"name": "区间单位", "code": "rangeUnitName", "width": "110"},
                {"name": "未税单价（元）", "code": "fee", "width": "110"},
                {"name": "增值税（%）", "code": "taxRate", "width": "110"},
                {"name": "价税合计（元）", "code": "feeWithTax", "width": "110"},
                {"name": "备注", "code": "remark", "width": "220"}
            ],
            customerData:[],    //客户数组
            tableList:[],
            hisId:-1,   //版本号，最新版本是-1
            currentHisId:-1,
            mergeTotal:0,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        
    },
    /**
     * 绑定函数
     */
    methods: {
        // 初始化数据
        async initData() {
            // 客户
            this.customerData = await this.common.postUrl("customerTF", "loadCustomerList", {});
            // 结算主体
            this.payTitle = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            // 报价车型
            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            // 车长
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.queryDetail();
        },
        async queryDetail(){
            this.info = await this.common.postUrl('quoteSheetTF','queryQuoteSheet',{quoteId:this.$route.query.quoteId,hisId:this.hisId});
            this.customerData.forEach(el => {
                if(el.tenantId == this.info.baseInfo.custTenantId){
                    this.info.baseInfo.custAddress = el.address;
                }
            })
            this.payTitle.forEach(el => {
                if(el.codeValue == this.info.baseInfo.settleBody){
                    this.info.baseInfo.settleBodyName = el.codeName;
                }
            })
            this.info.titles.forEach(item => {
                if(item.itemType == 1){
                    item.routes.forEach(router => {
                        router.details.forEach(td => {
                            //报价车型
                            if(td.quoteVehicleType=='0'){   
                                td.quoteVehicleTypeName = '通用'
                            }else{
                                td.quoteVehicleTypeName = '';
                                td.quoteVehicleTypeArr = td.quoteVehicleType.split(",");
                                this.quoteVehicleTypeData.forEach(el => {   
                                    if(td.quoteVehicleTypeArr.includes(String(el.codeValue))){
                                        td.quoteVehicleTypeName += el.codeName + ",";
                                    }
                                })
                                td.quoteVehicleTypeName = td.quoteVehicleTypeName.substring(0,td.quoteVehicleTypeName.length-1)
                            }
                            //车长
                            if(td.vehicleLength=='0'){   
                                td.vehicleLengthName = '通用'
                            }else{
                                td.vehicleLengthName = '';
                                td.vehicleLengthArr = td.vehicleLength.split(",");
                                this.vehicleLengthData.forEach(el => {   
                                    if(td.vehicleLengthArr.includes(String(el.codeValue))){
                                        td.vehicleLengthName += el.codeName + ",";
                                    }
                                })
                                td.vehicleLengthName = td.vehicleLengthName.substring(0,td.vehicleLengthName.length-1)
                            }
                        })
                    })
                }
            })
            this.tableList = this.info.titles.filter(item => item.display==1);
            this.$forceUpdate();
        },
        //  切换历史版本
        changeHisVer(hisId){
            this.hisId = hisId;
            this.currentHisId = hisId;
            this.queryDetail();
        },
        // 更新视图
        forceUpdate(){
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
