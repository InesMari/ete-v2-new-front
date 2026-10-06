export default {
    name: 'codeDetail',
    data() {
        return {
            info:{},
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
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            let that = this;
            this.common.postUrl("wmsStockMaterialTF", 'queryStockMaterialQrcodeInfo', {id:this.$route.query.id}, function (data) {
                that.info = data;
            });
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        //  提交
        async print(){
            this.$message.success("没有打标机对接")
        },
    },
}
