import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: 'batchGenerateBar',
    data() {
        return {
            batchList:[],
            ids:this.$route.query.ids,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            let that = this;
            this.common.postUrl("wmsStockMaterialTF", 'queryStockStorageList', {ids:this.ids}, function (data) {
                that.batchList = data;
            });
        },
        calNums(item){
            let sheets = this.common.accDiv(item.stockNums,item.nums);
            let sheetsInt = parseInt(sheets);
            if(sheets>sheetsInt){
                let remain = this.common.accSub(item.stockNums,this.common.accMul(item.nums,sheetsInt));
                item.sheets = sheetsInt+1;
                item.result = sheetsInt+'*'+item.nums+'+'+remain;
            }else{
                item.sheets = sheetsInt;
                item.result = sheetsInt+'*'+item.nums;
            }
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        //  提交
        async submit(){
            for (let i = 0; i < this.batchList.length; i++) {
                if(!this.batchList[i].nums){
                    this.$message.error("第"+(i+1)+"条数据的每张条码数量不能为空或者0");
                    return;
                }
            }
            let batchList = this.batchList;
            await this.common.postUrl('wmsStockMaterialTF','batchGenerateBar', {batchList},null,null,null,true);
            this.$message.success("保存成功")
            this.closePage();
        },
    },
}
