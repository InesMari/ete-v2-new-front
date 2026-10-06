import myFileModel from '@/components/myFileModel/myFileModel.vue'
export default {
    name: 'inOrderDetail',
    data() {
        return {
            info:{},
            totalInfo:{nums:0,boxNums:0,palletNums:0,stockNums:0,stockPalletNums:0,stockBoxNums:0},
            materialList:[],
            packMaterialList:[],
            stockMaterialList:[],
            feeList:[],
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
        myFileModel
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 加载订单数据
         */
        async loadInOrderInfo()
        {
            let data = await this.common.postUrl("wmsInOrderTF", "queryWmsInOrderInfoForView",
                {inOrderId: this.$route.query.inOrderId},
                null, null, null, true);
            this.info = data.info;
            // this.$refs.receiptsImg.initDate(this.info.receiptsImgId);
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
                this.totalInfo.stockPalletNums = this.common.accAdd(this.totalInfo.stockPalletNums,this.stockMaterialList[i].palletNums);
                this.totalInfo.stockBoxNums = this.common.accAdd(this.totalInfo.stockBoxNums,this.stockMaterialList[i].boxNums);
            }
            // this.feeList = data.feeList;
            // this.totalInfo.num = 0;
            // this.totalInfo.totalFee = 0;
            // this.totalInfo.totalFeeWithTax = 0;
            // for (let i = 0; i < this.feeList.length; i++) {
            //     this.totalInfo.num = this.common.accAdd(this.totalInfo.num,this.feeList[i].num);
            //     this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,this.feeList[i].totalFee);
            //     this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax,this.feeList[i].totalFeeWithTax);
            // }
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        /**
         * 改变入库数量计算
         * @param index
         */
        calc(){
            let stockPalletNums = 0;
            let stockBoxNums = 0;
            for (let i = 0; i < this.stockMaterialList.length; i++) {
                if(this.stockMaterialList[i].palletNums){
                    stockPalletNums = this.common.accAdd(this.stockMaterialList[i].palletNums, stockPalletNums);
                }
                if(this.stockMaterialList[i].boxNums){
                    stockBoxNums = this.common.accAdd(this.stockMaterialList[i].boxNums, stockBoxNums);
                }
            }
            this.totalInfo.stockPalletNums = stockPalletNums;
            this.totalInfo.stockBoxNums = stockBoxNums;
            this.$forceUpdate();
        },
        updateInOrderMaterial() {
            let param = {inOrderId: this.$route.query.inOrderId};
            //物料规格信息
            if(this.stockMaterialList.length==0){
                this.$message.error("请输入物料库存信息！");
                return;
            }
            for (let i = 0; i < this.stockMaterialList.length; i++) {
                if(this.common.isBlank(this.stockMaterialList[i].palletNums)){
                    this.$message.error("请输入第"+(i+1)+"行的物料实际入库托数！");
                    return;
                }
                if(this.common.isBlank(this.stockMaterialList[i].boxNums)){
                    this.$message.error("请输入第"+(i+1)+"行的物料实际入库箱数！");
                    return;
                }
            }
            param.stockMaterialList = this.stockMaterialList;
            let that = this;
            that.common.postUrl("wmsInOrderTF", "updateInOrderMaterial", param, function (data) {
                that.$message.success("入库物料更新完毕！");
                that.closePage();
            },null,'',true);
        },
    },
}
