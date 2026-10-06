import myFileModel from '@/components/myFileModel/myFileModel.vue'
export default {
    name: 'inOrderModify',
    data() {
        return {
            info:{},
            totalInfo:{nums:0,boxNums:0,palletNums:0,stockNums:0},
            materialList:[],
            packMaterialList:[],
            stockMaterialList:[],
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
        },
        changeBatchNum(item){
            for (let i = 0; i < this.stockMaterialList.length; i++) {
                if(item.inOrderMaterialRelId==this.stockMaterialList[i].inOrderMaterialRelId){
                    this.stockMaterialList[i].batchNum = item.batchNum;
                }
            }
        },
        changeAsn(item){
            for (let i = 0; i < this.stockMaterialList.length; i++) {
                if(item.inOrderMaterialRelId==this.stockMaterialList[i].inOrderMaterialRelId){
                    this.stockMaterialList[i].asn = item.asn;
                }
            }
        },
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        //
        inOrderModify(){
            let param = {};
            param.inOrderId=this.$route.query.inOrderId;
            param.materialList = this.materialList;
            param.stockMaterialList = this.stockMaterialList;
            let that = this;
            that.common.postUrl("wmsInOrderTF", "inOrderModify", param, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.$message.success('修改成功');
                    that.close();
                }
            },null,'',true);
        },
    },
}
