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
                    quoteDate:''
                },
                details:[],
                hisInfo:[],
                rebuildDetails:[],
            },
            isViewDetail:false,
            head: [
                {"name": "费用项目名称", "code":"itemName", "width": "110"},
                {"name": "器具名称", "code":"deviceName", "width": "110","type":"device"},
                {"name": "计费单位", "code": "unit", "width": "80","type":"select"},
                {"name": "标准成本（含税）", "code": "costWithTax", "width": "80","type":"text"},
                {"name": "起始地", "parent":"delivery", "code": "beginWorkName", "width": "110"},
                {"name": "起始地", "parent":"purchase", "code": "endWorkName", "width": "110"},
                {"name": "目的地", "parent":"delivery", "code": "endWorkName", "width": "110"},
                {"name": "报价车型", "parent":"delivery", "code": "quoteVehicleTypeName", "width": "80"},
                {"name": "报价车长", "parent":"delivery", "code": "vehicleLengthName", "width": "80"},
                {"name": "未税单价", "code": "price", "width": "80","type":"input"},
                {"name": "增值税率", "code": "tax", "width": "80","type":"input"},
                {"name": "价税合计", "code": "priceWithTax", "width": "80","type":"input"},
                {"name": "费用项目备注", "code": "remark", "width": "220","type":"inputText"}
            ],
            head2: [
                {"name": "费用项目名称", "code":"itemName", "width": "110"},
                {"name": "计费单位", "code": "unit", "width": "110","type":"select"},
                {"name": "标准成本（含税）", "code": "costWithTax", "width": "110","type":"text"},
                {"name": "未税单价", "code": "price", "width": "110","type":"input"},
                {"name": "增值税率", "code": "tax", "width": "110","type":"input"},
                {"name": "价税合计", "code": "priceWithTax", "width": "110","type":"input"},
                {"name": "费用项目备注", "code": "remark", "width": "220","type":"inputText"},
                {"name": "匹配条件", "code": "matchCondition", "width": "220"}
            ],
            mergeArr:[],
            firstTableItem:[],
            firstTableItem0:[],
            firstTableItem1:[],
            tableList:[],
            currentCodeId:null, //存储当前操作的codeId
            customerData:[],    //客户数组
            workList:[],    //仓库数组
            hisId:-1,   //版本号，最新版本是-1
            currentHisId:-1,
            mergeTotal:0,
            page:1,
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
            let that = this;
            // 仓库
            this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {}, function (data) {
                that.workList = data;
            });
            // 客户
            this.customerData = await this.common.postUrl("customerTF", "loadCustomerList", {});
            this.queryDetail();
        },
        async queryDetail(){
            this.info = await this.common.postUrl('wmsQuoteSheetTF','queryQuoteSheet',{quoteId:this.$route.query.quoteId,hisId:this.hisId});
            this.customerData.forEach(el => {
                if(el.tenantId == this.info.baseInfo.custTenantId){
                    this.info.baseInfo.custAddress = el.address;
                }
            })            
            this.info.details.forEach(item => {
                if(item.codeId == 11){
                    item.items.forEach(el => {
                        if(el.merge == 1){
                            this.mergeTotal++;
                        }
                    })
                }
            })
            // 合并数据
            let mergeArr = [];
            this.info.rebuildDetails.forEach(merge => {
                if(merge.rebuildType == 1){     //合并项
                    var obj = {titleName:merge.title,merge:[],rebuildType:'1'};
                    merge.items.forEach((item,index) => {
                        obj.merge[index] = {
                            items:[item]
                        };
                        if(this.common.isNotBlank(item.relDetailList)){
                            obj.merge[index].items = [item,...item.relDetailList];
                        }
                    })
                }else if(merge.rebuildType == 2){   //分类项
                    var obj = {titleName:merge.title,merge:[],rebuildType:'2'};
                    if(this.common.isNotBlank(merge.relDetailList)){
                        let innerObj = {items:[]};
                        merge.relDetailList.forEach(item => {
                            innerObj.items.push(item);
                        })
                        obj.merge.push(innerObj);
                    }
                }
                mergeArr.push(obj);
                console.log(mergeArr)
            })
            this.mergeArr = mergeArr;
            // 仓储费对象
            this.firstTableItem0 = [];
            this.firstTableItem1 = [];
            this.firstTableItem = this.info.details[0];
            this.firstTableItem.items.forEach(item => {
                if(item.itemCode == "monthFee"){ //"定量仓储面积计费"
                    item.storageCondition = item.storageCondition?String(item.storageCondition):'';
                    this.firstTableItem0.push(item)
                }else if(item.itemCode == "tmpMonthFee"){    //"按件仓储计费"
                    item.countRule = item.countRule?String(item.countRule):'';
                    item.storageCondition = item.storageCondition?String(item.storageCondition):'';
                    this.firstTableItem1.push(item)
                }
            })

            this.tableList = this.info.details.filter(item => item.display==1);
            this.$forceUpdate();
        },
        //  切换历史版本
        changeHisVer(hisId){
            this.hisId = hisId;
            this.currentHisId = hisId;
            this.queryDetail();
        },
        // 查看明细
        viewDetail(state){
            this.isViewDetail = state;
            this.$forceUpdate();
        },
        // 更新视图
        forceUpdate(){
            this.$forceUpdate();
        },
        // 选择tab
        selTab(page){
            this.page = page;
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
    computed: {
        deviceDetails: function () {
            return this.info.details.filter(function (item) {
                return item.codeId == 107;
            })
        },
    }
}
