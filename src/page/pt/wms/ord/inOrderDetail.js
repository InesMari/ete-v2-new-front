import myFileModel from '@/components/myFileModel/myFileModel.vue'
import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue";
import tagTable from './tagTable.vue';
import operateLog from '@/components/operateLog/operateLog.vue'

export default {
    name: 'inOrderDetail',
    data() {
        return {
            info:{},
            totalInfo:{
                nums:0,
                boxNums:0,
                palletNums:0,
                stockNums:0,

                costNum:0,
                costTotalFee:0,
                costTotalFeeWithTax:0,
            },
            materialList:[],
            packMaterialList:[],
            stockMaterialList:[],
            feeList:[],
            costList:[],
            tabs: [
                {name: "入库详情", active: true,type:1,},
                // {name: "标签详情",type:2,},
                // {name: "客户码详情",type:3,},
                {name: "操作日志",type:4,},
            ],
            hasNewQrcode:false,
            showType: 1,
            materialCodeList:[],

            custQrcodeList:[],
            custQrcodeHead:[
                { "name": "客户码ID", "code": "codeNum", "width": "200", "type": "text" },
                { "name": "父标签ID", "code": "parentCodeNum", "width": "150", "type": "text" },
                { "name": "客户码类型", "code": "relCustQrcodeTypeName", "width": "80", "type": "text" },
                { "name": "库区", "code": "reservoirCode", "width": "100", "type": "text" },
                { "name": "库位", "code": "storageCode", "width": "100", "type": "text" },
                { "name": "物料编码", "code": "materialNum", "width": "150", "type": "text" },
                { "name": "物料描述", "code": "materialDesc", "width": "180", "type": "text" },
                { "name": "批次号", "code": "batchNum", "width": "120", "type": "text" },
                { "name": "供应商批次号", "code": "supplierBatchNum", "width": "120", "type": "text" },
                { "name": "ASN", "code": "asn", "width": "120", "type": "text" },
                { "name": "客户码状态", "code": "stsName", "width": "80", "type": "text" },
                { "name": "上架人", "code": "onShelvesUserName", "width": "100", "type": "text" },
                { "name": "上架时间", "code": "onShelvesDate", "width": "150", "type": "text" },
                { "name": "下架人", "code": "offShelvesUserName", "width": "100", "type": "text" },
                { "name": "下架时间", "code": "offShelvesDate", "width": "150", "type": "text" },
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
        myFileModel,
        innerTab,
        tableCommon,
        tagTable,
        operateLog
    },
    /**
     * 绑定函数
     */
    methods: {
        async selectCallback(data)
        {
            this.tab = data;
            this.showType = data.type;
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
            this.hasNewQrcode = data.hasNewQrcode;

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

            this.costList = data.costList;
            this.totalInfo.costNum = 0;
            this.totalInfo.costTotalFee = 0;
            this.totalInfo.costTotalFeeWithTax = 0;
            for (let i = 0; i < this.costList.length; i++) {
                this.totalInfo.costNum = this.common.accAdd(this.totalInfo.costNum,this.costList[i].num);
                this.totalInfo.costTotalFee = this.common.accAdd(this.totalInfo.costTotalFee,this.costList[i].fee);
                this.totalInfo.costTotalFeeWithTax = this.common.accAdd(this.totalInfo.costTotalFeeWithTax,this.costList[i].feeWithTax);
            }

            this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "queryStockQrcodeList", {inOrderId: this.$route.query.inOrderId});
            this.custQrcodeList = await this.common.postUrl("wmsInOrderTF", "queryCustQrcodeList", {inOrderId: this.$route.query.inOrderId});

            if(this.custQrcodeList && this.custQrcodeList.length>0){
                this.tabs.splice(1,0,{name: "客户码详情",type:3});
            }
            if(this.materialCodeList && this.materialCodeList.length>0){
                this.tabs.splice(1,0,{name: "标签详情",type:2});
            }
            // let that = this.$refs.table;
            // setTimeout(() => {
            //     that.resetTrHeight();
            // }, 100);
        },
        openDetail(id)
        {
            this.$emit('openTab', {
                urlName: '查看配送',
                urlId: 'wmsWaybillDetail' + id,
                urlPathName: "/wms/waybill",
                urlPath: "/pt/wms/waybill/wmsWaybillDetail.vue",
                query: {id: id}
            });
        },
        closePage(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        },
    },
}
