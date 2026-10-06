import dbTable from "@/components/dbTable/dbTable.vue";
import simpleTable from "@/components/simpleTable/simpleTable.vue";

export default {
    name: 'mergeGenerateBar',
    data() {
        return {
            head: [
                {"name": "序号", "code": "idx", "width": "100", "type": "text"},
                {"name": "条码号码", "code": "codeNum", "width": "120", "type": "diy"},
                {"name": "条码数量", "code": "nums", "width": "120", "type": "text"},
                {"name": "是否尾数", "code": "isRemainder", "width": "120", "type": "text"},
            ],
            batchList:[],
            ids:this.$route.query.ids,
            nums:'',
            sheets:'',
            codeList:[],
            mergeNums:'',
            bottomInfoH:300
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
        simpleTable
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            let that = this;
            this.common.postUrl("wmsStockMaterialTF", 'queryStockMaterialQrcodeList', {ids:this.ids}, function (data) {
                that.batchList = data;
                for (let i = 0; i < that.batchList.length; i++) {
                    that.mergeNums = that.common.accAdd(that.mergeNums,that.batchList[i].nums);
                }    
                that.$nextTick(() => {
                    that.initHeight()
                })            
            });
        },
        initHeight(){
            let pageH = this.$refs.mergeGenerateBar.clientHeight;
            let topH = this.$refs.tableItem.clientHeight;
            this.bottomInfoH = pageH - topH - 120;
        },
        calNums(){
            let that =this;
            let sheets = this.common.accDiv(that.mergeNums,that.nums);
            let sheetsInt = parseInt(sheets);
            this.codeList=[];
            for (let i = 0; i < sheetsInt; i++) {
                this.codeList.push({idx:i+1,codeNum:'保存后自动生成',nums:that.nums,isRemainder:'否'});
            }
            if(sheets>sheetsInt){
                let remain = this.common.accSub(that.mergeNums,this.common.accMul(that.nums,sheetsInt));
                this.codeList.push({idx:that.codeList.length+1,codeNum:'保存后自动生成',nums:remain,isRemainder:'是'});
                this.sheets = sheetsInt+1;
            }else{
                this.sheets = sheetsInt;
            }
            this.codeList.push({idx:'合计：'+that.codeList.length,nums:that.mergeNums});
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
            await this.common.postUrl('wmsStockMaterialTF','mergeGenerateBar', {ids:this.ids,nums:this.nums},null,null,null,true);
            this.$message.success("保存成功")
            this.closePage();
        },
    },
}
