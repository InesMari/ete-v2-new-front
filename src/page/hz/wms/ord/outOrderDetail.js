import myFileModel from '@/components/myFileModel/myFileModel.vue'
import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue";
import tagTable from "@/page/pt/wms/ord/tagTable.vue";

export default {
    name: 'outOrderDetail',
    data() {
        return {
            info:{},
            totalInfo:{
                nums:0,
                boxNums:0,
                palletNums:0,

                nums2:0,
                stockPlanNums: 0,
                stockNums:0,
                stockBoxNums:0,
                stockPalletNums:0,

                num:0,
                totalFee:0,
                totalFeeWithTax:0,
                },
            materialList:[],
            packMaterialList:[],
            outMaterialList:[],
            feeList:[],
            tabs: [
                {name: "出库详情", active: true,type:1,},
                // {name: "条码详情",type:2,},
            ],
            materialCodeList:[],
            showType: 1,
            head: [
                {"name": "物料编码", "code": "materialNum", "width": "120", "type": "text"},
                {"name": "物料描述", "code": "materialDesc", "width": "120", "type": "text"},
                {"name": "批次号", "code": "batchNum", "width": "120", "type": "text"},
                {"name": "供应商批次号", "code": "supplierBatchNum", "width": "120", "type": "text"},
                {"name": "ASN", "code": "asn", "width": "120", "type": "text"},
                {"name": "条码编号", "code": "codeNum", "width": "120", "type": "text"},
                {"name": "条码", "code": "qrcodeUrl", "width": "180", "type": "diy"},
                {"name": "条码数量", "code": "qrcodeNums", "width": "120", "type": "text"},
                {"name": "是否尾数", "code": "isRemainderName", "width": "110", "type": "text"},
            ],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadOrderInfo();
        this.common.tableStretch(this.$refs.orderDetail);
    },
    /**
     * 组件
     */
    components: {
        tagTable,
        myFileModel,
        innerTab,
        tableCommon
    },
    /**
     * 绑定函数
     */
    methods: {
        selectCallback(data)
        {
            this.tab = data;
            this.showType = data.type;
            if(data.type==2){
                let that = this.$refs.table;
                const timer = setTimeout(() => {
                    that.resetTrHeight();
                    clearTimeout(timer);
                }, 100);
            }
        },
        /**
         * 加载订单数据
         */
        async loadOrderInfo()
        {
            let data = await this.common.postUrl("wmsOutOrderTF", "queryWmsOutOrderInfoForView",
                {outOrderId: this.$route.query.outOrderId},
                null, null, null, true);
            this.info = data.info;
            // 		public static final int WAIT_OUT = 1;待出库
            // 		public static final int ALLOCAT = 2;已分配
            // 		public static final int SORTING = 4;已分拣
            // 		public static final int OUT = 5;已出库
            if (this.info.receiptsImgId)
                this.$refs.receiptsImg.initDate(this.info.receiptsImgId);

            this.materialList = data.materialList;
            this.packMaterialList = data.packMaterialList;
            this.outMaterialList = data.outMaterialList;
            this.feeList = data.feeList;
            for (let i = 0; i < this.materialList.length; i++) {
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums,this.materialList[i].nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,this.materialList[i].boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,this.materialList[i].palletNums);
            }
            for (let i = 0; i < this.outMaterialList.length; i++) {
                this.totalInfo.nums2=this.common.accAdd(this.totalInfo.nums2,this.outMaterialList[i].storeNums);
                this.totalInfo.stockPlanNums = this.common.accAdd(this.totalInfo.stockPlanNums,this.outMaterialList[i].planNums);
                this.totalInfo.stockPlanBoxNums = this.common.accAdd(this.totalInfo.stockPlanBoxNums,this.outMaterialList[i].planBoxNums);
                this.totalInfo.stockPlanPalletNums = this.common.accAdd(this.totalInfo.stockPlanPalletNums,this.outMaterialList[i].planPalletNums);
                this.totalInfo.stockNums = this.common.accAdd(this.totalInfo.stockNums,this.outMaterialList[i].nums);
                this.totalInfo.stockBoxNums = this.common.accAdd(this.totalInfo.stockBoxNums,this.outMaterialList[i].boxNums);
                this.totalInfo.stockPalletNums = this.common.accAdd(this.totalInfo.stockPalletNums,this.outMaterialList[i].palletNums);
            }
            for (let i = 0; i < this.feeList.length; i++) {
                this.totalInfo.num = this.common.accAdd(this.totalInfo.num,this.feeList[i].num);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,this.feeList[i].totalFee);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax,this.feeList[i].totalFeeWithTax);
            }
            // await this.$refs.table.load("wmsStockMaterialTF", "queryStockMaterialQrcodePage", {outOrderId: this.$route.query.outOrderId});
            // 查询条码详情
            this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "queryStockQrcodeList", {outOrderId: this.$route.query.outOrderId,isLoadAllOut:1});
            if(this.materialCodeList && this.materialCodeList.length>0){
                this.tabs.push({name: "标签详情",type:2});
            }
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        }
    },
}
