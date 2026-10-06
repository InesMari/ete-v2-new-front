import printJS from 'print-js'
export default {
    name: 'printDevicePurOrder',
    data() {
        return {
            info:{baseInfo:{},dtlList:[]},
            purchaseNums:'',
            totalFees:'',
            totalFeeChiness:'',
            totalInfo:{},
			settleBodyData:[],
			transportModeData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
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
        /**
         * 加载数据
         */
        async doQuery()
        {
			this.supplierData = await this.common.postUrl("devPurchaseOrderService", "querySupplierTenants", {});
			this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
			this.transportModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TRANSPORT_MODE"});
            this.info = await this.common.postUrl("devPurchaseOrderService", "getDevPurchaseOrderInfo",{id:this.$route.query.id},null, null, null, true);
            
            let transportMode = this.transportModeData.find(item => item.codeValue == this.info.baseInfo.transportMode);
            console.log(transportMode)
            this.info.baseInfo.transportModeName = transportMode ? transportMode.codeName : '';
            this.info.dtlList.forEach(item => {
                this.purchaseNums = this.common.accAdd(item.purchaseNum,this.purchaseNums);
                this.totalFeeNoTaxs = this.common.accAdd(item.totalFeeNoTax,this.totalFeeNoTaxs);
                this.totalFees = this.common.accAdd(item.totalFee,this.totalFees);
            });
            this.getPurseInfo();
            this.changeSuppier();
            this.calcTotal();
            this.$forceUpdate();
        },
        getPurseInfo(){
            this.settleBodyData.forEach(item => {
                if(this.info.baseInfo.settleBody == item.codeValue){
                    this.info.baseInfo.settleBodyName = item.codeName;
                }
            })
        },
		changeSuppier(){
            let supplierInfo = this.supplierData.find(item => item.tenantId === this.info.baseInfo.suppierTenantId);
            console.log(supplierInfo)
            this.info.baseInfo.suppierName = supplierInfo.tenantName;
            this.info.baseInfo.suppierAddress = supplierInfo.address;
            this.info.baseInfo.suppierLinkPhone = supplierInfo.linkPhone;
            this.info.baseInfo.suppierLinkman = supplierInfo.linkman;
            this.info.baseInfo.suppierEmail = supplierInfo.email;
            this.info.baseInfo.bankAccountName = supplierInfo.bankAccountName;
            this.info.baseInfo.bankSubName = supplierInfo.bankSubName;
            this.info.baseInfo.bankCard = supplierInfo.bankCard;
		},
		calcTotal(){
			let purchaseNums=0;
			let totalFeeWithTax=0;
			for (let i = 0; i < this.info.dtlList.length; i++) {
				purchaseNums = this.common.accAdd(this.info.dtlList[i].purchaseNums,purchaseNums);
				totalFeeWithTax = this.common.accAdd(this.info.dtlList[i].totalFeeWithTax,totalFeeWithTax);
			}
			this.totalInfo.purchaseNums = purchaseNums;
			this.totalInfo.totalFeeWithTax = totalFeeWithTax;
			this.totalInfo.totalFeeWithTaxChinese = this.common.numberToChinese(totalFeeWithTax);
			this.$forceUpdate();
		},
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/printDevicePurOrder.css',  //真实路径/public//static/css/printDevicePurOrder.css
                scanStyles: false,
            })
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id)
        },
    },
}
