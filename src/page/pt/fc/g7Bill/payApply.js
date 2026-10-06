import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'payApply',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "custName", "width": "150", "type": "text"},
                {"name": "区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "diy"},
                {"name": "派车单状态", "code": "waybillStateName", "width": "90", "type": "text"},
                {"name": "费用合计", "code": "amount", "width": "90", "type": "text","isSum":true},
                {"name": "预付金额", "code": "prePay", "width": "90", "type": "text","isSum":true},
                {"name": "到付金额", "code": "afterPay", "width": "90", "type": "text","isSum":true},
                {"name": "周期付金额", "code": "periodicalPay", "width": "90", "type": "text","isSum":true},
                {"name": "周期付天数", "code": "periodicalDay", "width": "90", "type": "text"},
                {"name": "已申请金额", "code": "applyFee", "width": "90", "type": "text","isSum":true},
                {"name": "可申请金额", "code": "applyAbleFee", "width": "90", "type": "text","isSum":true},
                {"name": "供应商", "code": "supplierName", "width": "150", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "100", "type": "text"},
                {"name": "手机号", "code": "driverPhone", "width": "100", "type": "text"},
                {"name": "是否加急", "code": "isUrgentName", "width": "90", "type": "text"},
                {"name": "是否回单", "code": "haveReceiptName", "width": "90", "type": "text"},
                {"name": "要求运作时间", "code": "startWorkDate", "width": "150", "type": "text"},
                {"name": "出车时间", "code": "startCarDate", "width": "150", "type": "text"},
                {"name": "完成时间", "code": "endCarDate", "width": "150", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "调度件数/件", "code": "totalGoodsCount", "width": "80", "type": "text","isSum":true},
                {"name": "调度重量/kg", "code": "totalGoodsWeight", "width": "80", "type": "text","isSum":true},
                {"name": "调度体积/m³", "code": "totalGoodsVolume", "width": "80", "type": "text","isSum":true},
                {"name": "计费方式", "code": "billTypeName", "width": "100", "type": "text"},
                {"name": "净重/kg", "code": "netWeight", "width": "80", "type": "text","isSum":true},
                {"name": "毛重/kg", "code": "grossWeight", "width": "80", "type": "text","isSum":true},
                {"name": "体积/m³", "code": "volume", "width": "80", "type": "text","isSum":true},
                {"name": "计费单价", "code": "freightPrice", "width": "90", "type": "text"},
                {"name": "中途点数", "code": "midwayPointNum", "width": "90", "type": "text"},
                {"name": "点位费", "code": "pointFee", "width": "90", "type": "text"},
                {"name": "点位费合计", "code": "totalPointFee", "width": "90", "type": "text","isSum":true},
                {"name": "运费", "code": "freight", "width": "90", "type": "text","isSum":true},
                {"name": "保险费", "code": "premiumFee", "width": "90", "type": "text","isSum":true},
                {"name": "装货费", "code": "loadingFee", "width": "90", "type": "text","isSum":true},
                {"name": "卸货费", "code": "dischargeFee", "width": "90", "type": "text","isSum":true},
                {"name": "其他费", "code": "otherFee", "width": "90", "type": "text","isSum":true},
                {"name": "运费合计", "code": "totalFee", "width": "90", "type": "text","isSum":true},
                {"name": "调度人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "调度时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            headAdd:[
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "120", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "80", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "80", "type": "text"},
                {"name": "手机号", "code": "driverPhone", "width": "100", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "开户名字", "code": "receiveBankId", "width": "220", "type": "diy"},
                {"name": "开户卡号", "code": "bankNum", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankName", "width": "110", "type": "text"},
                {"name": "支行名称", "code": "branchName", "width": "110", "type": "text"},
                {"name": "身份证", "code": "receiveUserIdCard", "width": "120", "type": "text"},
                {"name": "费用合计", "code": "amount", "width": "80", "type": "text","isSum":"true"},
                {"name": "已申请金额", "code": "applyFee", "width": "80", "type": "text","isSum":"true"},
                {"name": "可申请金额", "code": "applyAbleFee", "width": "80", "type": "text","isSum":"true"},
                {"name": "申请金额", "code": "fee", "width": "80", "type": "diy","isSum":"true"},
                {"name": "申请备注", "code": "remark", "width": "150", "type": "input"},
            ],
            query:{supplierName: this.$route.query.supplierName},
            showDialog:false,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth()-1);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth()-3);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            selectItem:[],
            regionData:[],
            totalInfo:{},
            allFee:'',
            totalSelFee:0,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        scrollTable,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        clickItem(){
            let selectData = this.$refs.table.getSelectItem();
            this.totalSelFee = 0;
            for (let i = 0; i < selectData.length; i++) {
                this.totalSelFee = this.common.accAdd(this.totalSelFee,selectData[i].applyAbleFee);
            }
            this.$forceUpdate();
        },
        /**
         *
         */
        doQuery(query=this.query){
            this.query=query;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length==2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            this.$refs.table.load("fcThirdPayFeeTF", "queryOrdWaybillForG7Page", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
            let that = this;
            this.common.postUrl('fcThirdPayFeeTF','getCurrentOperatorAllChildRegions',{},function (data) {
                that.regionData = data;
            });
        },
        showPayApplyDialog(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个派车单！");
                return false;
            }
            //查询所有的银行卡信息
            this.selectItem = selectData;
            let supplierTenantId = [];
            this.allFee = 0;
            for (let i = 0; i < this.selectItem.length; i++) {
                let item = this.selectItem[i];
                this.selectItem[i].fee = 0;
                this.selectItem[i].remark = '';
                supplierTenantId.push(item.supplierTenantId);
            }

            this.showDialog = true;
            this.$nextTick(async()=>{
                let data = await this.common.postUrl("fcThirdPayFeeTF", "querySupplierBankDataNoPage", {supplierTenantId,g7Flag:1});
                for (let i = 0; i < this.selectItem.length; i++) {
                    let item = this.selectItem[i];
                    item.supplierBankData = data[item.supplierTenantId+''];
                    if(item.supplierBankData!=null&&item.supplierBankData.length>0){
                        this.setBankInfo(item,item.supplierBankData[0]);
                    }
                }
                this.$refs.scrollTable.setData(this.selectItem);    //设置表格数据
                this.$refs.scrollTable.calcFootSum();   //表格合计
                this.$nextTick(()=>{
                    this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
                })
            })
        },
        selBank(item){
            // item.receiveBankId = '';
            item.receiveUserId = '';
            item.bankNum = '';
            item.bankName = '';
            item.branchName = '';
            item.receiveUserIdCard = '';

            for (let i = 0; i < item.supplierBankData.length; i++) {
                let bankInfo = item.supplierBankData[i];
                if(item.receiveBankId==bankInfo.receiveBankId){
                    this.setBankInfo(item,bankInfo);
                    break;
                }
            }
            this.$forceUpdate();
        },
        setBankInfo(item,bankInfo){
            item.receiveBankId = bankInfo.receiveBankId;
            item.receiveUserId = bankInfo.receiveUserId;
            item.bankNum = bankInfo.bankNum;
            item.bankName = bankInfo.bankName;
            item.branchName = bankInfo.branchName;
            item.receiveUserIdCard = bankInfo.receiveUserIdCard;
        },
        inputFee(item){
            if(!this.checkFee(item)){
                return;
            }
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$forceUpdate();
        },
        checkFee(item){
            if(item.fee>item.applyAbleFee){
                this.$message.error("申请金额不能大于可申请金额");
                return false;
            }
            return true;
        },
        shareFee(){
            let selectItem = this.common.copyObj(this.$refs.scrollTable.getData())
            let remainFee = parseFloat(this.allFee);
            for (let i = 0; i < selectItem.length; i++) {
                let item = selectItem[i];
                if(remainFee>item.applyAbleFee){
                    item.fee = item.applyAbleFee;
                    remainFee = this.common.accSub(remainFee,item.applyAbleFee);
                }else{
                    item.fee = remainFee;
                    remainFee = 0;
                }
                selectItem[i] = item;
            }
            this.$refs.scrollTable.setData(selectItem);    //设置表格数据
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$forceUpdate();
            if(remainFee>0){
                this.$message.error("申请金额太大，拆分不完");
            }
        },
        applyPay(){
            this.selectItem = this.common.copyObj(this.$refs.scrollTable.getData())
            let payList = [];
            for (let i = 0; i < this.selectItem.length; i++) {
                if(!this.checkFee(this.selectItem[i])){
                    return ;
                }
                if(this.selectItem[i].fee>0&&this.selectItem[i].receiveBankId>0){
                    payList.push(this.selectItem[i]);
                }
            }
            if(payList.length==0){
                this.$message.error("请填写金额或者收款人");
                return;
            }
            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "addFcThirdPayFeeInfo", {payList}, function (data) {
                that.$message.success("申请成功");
                that.showDialog = false;
                that.$forceUpdate();
                that.doQuery();
            },null,null,true);
        },
        download(){
            this.$refs.table.downloadExcelFile('G7待申请付款列表');
        },
        /**
         * 清空
         */
        clear(){
            this.query={};
        },
        /**
         * 打开详情
         * @param data
         * @param isCallParent 是否调用父组件调用
         */
        openDetail(data)
        {
            if (data.isTransit == 1)
            {
                this.$emit('openTab', {
                    urlName: '查看中转',
                    urlId: 'transitManage' + data.waybillId,
                    urlPathName: "/order",
                    urlPath: "/pt/ord/transit/transitDetailMain",
                    query:{t:3,waybillNum: data.waybillNum, tansitWaybillId: data.waybillId},
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + data.waybillId,
                    query: {waybillId: data.waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
        },

    },
    computed:{
        formData(){
            return [
                {"name":"派车单号","placeholder":"派车单号","model":"waybillNum","type":"input","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"完成时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"司机","placeholder":"司机","model":"driverName","type":"input","isshow":true},
                {"name":"手机号","placeholder":"手机号","model":"driverPhone","type":"input","isshow":true},
                {"name":"车牌号码","placeholder":"车牌号码","model":"plateNumber","type":"input","isshow":true},
                {"name":"客户名称","placeholder":"客户名称","model":"custName","type":"input","isshow":true},
                {"name":"区域","model":"regionId","type":"select","options":this.regionData,"label":"regionName","value":"id","placeholder":"选择区域","method":"doQuery","isshow":true},
            ]
        }
    },
}
