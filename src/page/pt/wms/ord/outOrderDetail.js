import myFileModel from '@/components/myFileModel/myFileModel.vue'
import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue";
import tagTable from './tagTable.vue'
import dbTable from "@/components/dbTable/dbTable.vue";
import operateLog from "@/components/operateLog/operateLog.vue";

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

                costNum:0,
                costTotalFee:0,
                costTotalFeeWithTax:0,
            },
            materialList:[],
            packMaterialList:[],
            outMaterialList:[],
            feeList:[],
            costList:[],
            tabs: [
                {name: "出库详情", active: true,type:1,},
                {name: "操作日志",type:4,},
            ],
            showType: 1,
            materialCodeList:[],
            materialCodeHead: [
                {"name": "批次号", "code": "batchNum", "width": "120", "type": "text"},
                {"name": "供应商批次号", "code": "supplierBatchNum", "width": "120", "type": "text"},
                {"name": "ASN", "code": "asn", "width": "100", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
                {"name": "物料描述", "code": "materialDesc", "width": "120", "type": "text"},
                {"name": "规格", "code": "materialSpecsName", "width": "100", "type": "text"},
                {"name": "生产日期", "code": "produceDate", "width": "120", "type": "text"},
                {"name": "库存数量", "code": "storeNums", "width": "80", "type": "text"},
                {"name": "管理单位", "code": "unitName", "width": "80", "type": "text"},
                {"name": "库区", "code": "reservoirCode", "width": "120", "type": "text"},
                {"name": "库位", "code": "storageCode", "width": "120", "type": "text"},
                {"name": "卸货点", "code": "workDetailName", "width": "120", "type": "text"},
                {"name": "客户码", "code": "custQrcodeNum", "width": "80", "type": "diy"},
                {"name": "计划出库数量", "code": "planNums", "width": "100", "type": "text"},
                {"name": "计划出库箱数", "code": "planBoxNums", "width": "100", "type": "text"},
                {"name": "计划出库托数", "code": "planPalletNums", "width": "100", "type": "text"},
                {"name": "时代条码编号", "code": "codeNum", "width": "150", "type": "text"},
                {"name": "时代条码", "code": "qrcodeUrl", "width": "180", "type": "diy"},
                {"name": "实际出库数量", "code": "nums", "width": "100", "type": "text"},
                {"name": "实际出库箱数", "code": "boxNums", "width": "100", "type": "text"},
                {"name": "实际出库托数", "code": "palletNums", "width": "100", "type": "text"}
            ],

            custQrcodeList:[],
            custQrcodeHead:[
                { "name": "客户码ID", "code": "codeNum", "width": "150", "type": "text" },
                { "name": "父标签ID", "code": "parentCodeNum", "width": "150", "type": "text" },
                { "name": "客户码类型", "code": "relCustQrcodeTypeName", "width": "150", "type": "text" },
                { "name": "库位", "code": "reservoirCode", "width": "100", "type": "text" },
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
            currentItem:{},
            custQrcodeDialog:false,
            custCodeHead:[
                {name:"父标签ID",code:'parentCodeNum',width:"120", "type": "text"},
                {name:"码类型",code:'relCustQrcodeTypeName',width:"80", "type": "text"},
                {name:"客户码",code:'codeNum',width:"120", "type": "text"},
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
        operateLog,
        myFileModel,
        innerTab,
        tableCommon,
        tagTable,
        dbTable,
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
            this.outMaterialList.forEach(item => {
                item.custQrcodeNum = 0;
                if(item.custQrcodeList){
                    item.custQrcodeList.forEach(el => {
                        if(el.selState == 1) item.custQrcodeNum++;
                    })
                }
            });
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

            this.costList = data.costList;
            this.totalInfo.costNum = 0;
            this.totalInfo.costTotalFee = 0;
            this.totalInfo.costTotalFeeWithTax = 0;
            for (let i = 0; i < this.costList.length; i++) {
                this.totalInfo.costNum = this.common.accAdd(this.totalInfo.costNum,this.costList[i].num);
                this.totalInfo.costTotalFee = this.common.accAdd(this.totalInfo.costTotalFee,this.costList[i].fee);
                this.totalInfo.costTotalFeeWithTax = this.common.accAdd(this.totalInfo.costTotalFeeWithTax,this.costList[i].feeWithTax);
            }

            // 查询条码详情
            this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "queryStockQrcodeList", {outOrderId: this.$route.query.outOrderId,isLoadAllOut:1});
            this.custQrcodeList = await this.common.postUrl("wmsInOrderTF", "queryCustQrcodeList", {outOrderId: this.$route.query.outOrderId});
            if(this.custQrcodeList && this.custQrcodeList.length>0){
                this.tabs.splice(1,0,{name: "客户码详情",type:3});
            }
            if(this.materialCodeList && this.materialCodeList.length>0){
                this.tabs.splice(1,0,{name: "标签详情",type:2});
            }
            this.initTableData();
            this.$forceUpdate();
        },
        initTableData(){
            if(this.info.orderType==2){
                this.materialCodeHead.splice(3,0,{"name": "货主", "code": "srcTenantName", "width": "250", "type": "text"});
            }
            this.materialCodeHead.forEach(hd => {
                if(hd.code == "storeNums"){
                    hd.sum = this.totalInfo.nums2;
                }else if(hd.code == "planNums"){
                    hd.sum = this.totalInfo.stockPlanNums;
                }else if(hd.code == "planBoxNums"){
                    hd.sum = this.totalInfo.stockPlanBoxNums;
                }else if(hd.code == "planPalletNums"){
                    hd.sum = this.totalInfo.stockPlanPalletNums;
                }else if(hd.code == "nums"){
                    hd.sum = this.totalInfo.stockNums;
                }else if(hd.code == "boxNums"){
                    hd.sum = this.totalInfo.stockBoxNums;
                }else if(hd.code == "palletNums"){
                    hd.sum = this.totalInfo.stockPalletNums;
                }
            })
            this.$refs.table.totalNum = "合计";
            this.$refs.table.resetData(this.outMaterialList);
            this.$refs.table.initHead();
            this.$nextTick(()=>{
                this.$refs.table.changeTop(1);
            })
        },
        /**
         * 选择客户码
         * @param {Object} item - 客户信息对象
         * @param {number} type - 打开方式，1表示通过弹窗打开，2表示外部打开
         */
        selCustQrcode(item){
            // 打开客户码选择对话框
            this.custQrcodeDialog = true;
            // 保存当前操作的客户信息
            this.currentItem = item;
            // 初始化左侧(未选中)数据
            let leftData = [];
            // 初始化右侧(已选中)数据
            let rightData = [];
            
            // 遍历客户码列表，根据选中状态分别放入leftData和rightData
            item.custQrcodeList.forEach(el => {
                if(el.selState == 1){
                    rightData.push(this.common.copyObj(el));
                }else{
                    leftData.push(this.common.copyObj(el));
                }
            });
            
            // 在下次DOM更新循环之后执行，确保组件渲染后设置数据
            this.$nextTick(()=>{
                // 设置左侧表格数据
                this.$refs.custCodeTable.setLeftData(leftData);
                // 设置右侧表格数据
                this.$refs.custCodeTable.setRightData(rightData);    
                this.$nextTick(()=>{
                    this.$refs.custCodeTable.changeTop(1)
                    this.$refs.custCodeTable.changeTop(1,'right')
                })                
            })
        },
        /**
         * 关闭当前页面
         */
        close(){
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        }
    },
}
