import myFileModel from '@/components/myFileModel/myFileModel.vue'
import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue";
import tagTable from "@/page/pt/wms/ord/tagTable.vue";

export default {
    name: 'inOrderDetail',
    data() {
        return {
            info:{},
            totalInfo:{nums:0,boxNums:0,palletNums:0,stockNums:0},
            materialList:[],
            packMaterialList:[],
            stockMaterialList:[],
            feeList:[],
            tabs: [
                {name: "入库详情", active: true,type:1,},
                // {name: "条码详情",type:2,},
            ],
            showType: 1,
            materialCodeList:[],
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
        this.loadInOrderInfo();
        this.common.tableStretch(this.$refs.orderDetail);
        this.common.tableStretch(this.$refs.orderInfo);
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
        async loadInOrderInfo()
        {
            let data = await this.common.postUrl("wmsInOrderTF", "queryWmsInOrderInfoForView",
                {inOrderId: this.$route.query.inOrderId},
                null, null, null, true);
            this.info = data.info;
            this.$refs.receiptsImg.initDate(this.info.receiptsImgId);
            this.materialList = data.materialList;
            for (let i = 0; i < this.materialList.length; i++) {
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums,this.materialList[i].nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,this.materialList[i].boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,this.materialList[i].palletNums);
            }
            this.packMaterialList = data.packMaterialList;
            this.stockMaterialList = data.stockMaterialList;

            for (let i = 0; i < this.stockMaterialList.length; i++) {
                this.totalInfo.stockNums = this.common.accAdd(this.totalInfo.stockNums,this.stockMaterialList[i].nums);
            }
            this.feeList = data.feeList;
            this.totalInfo.num = 0;
            this.totalInfo.totalFee = 0;
            this.totalInfo.totalFeeWithTax = 0;
            for (let i = 0; i < this.feeList.length; i++) {
                this.totalInfo.num = this.common.accAdd(this.totalInfo.num,this.feeList[i].num);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,this.feeList[i].totalFee);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax,this.feeList[i].totalFeeWithTax);
            }
            this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "queryStockQrcodeList", {inOrderId: this.$route.query.inOrderId});
            if(this.materialCodeList && this.materialCodeList.length>0){
                this.tabs.push({name: "标签详情",type:2});
            }
            // await this.$refs.table.load("wmsStockMaterialTF", "queryStockMaterialQrcodePage", {inOrderId: this.$route.query.inOrderId});
            // let that = this.$refs.table;
            // setTimeout(() => {
            //     that.resetTrHeight();
            // }, 100);
        },
        closePage(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        }
    },
}
