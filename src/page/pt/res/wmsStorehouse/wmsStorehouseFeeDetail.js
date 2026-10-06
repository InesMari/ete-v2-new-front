import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'wmsStorehouseFeeDetail',
    data() {
        return {
            info: {
            },
        }
    },
    computed:{
    },
    /**
     * 初始化
     */
    mounted() {
        this.getInfo();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        async getInfo() {
            this.info = await this.common.postUrl("wmsStorehouseTF", "getStorehouseFeeDetail", {id:this.$route.query.id});
            this.forceUpdate();
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        /**
         * 关闭新增客户
         */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        },
    },
}
