import myFileModel from '@/components/myFileModel/myFileModel.vue';
import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: "writeOffFeeApply",
    components: {
        myFileModel,
        dbTable,
    },
    data() {
        return {
            info: {
                dtls:[],
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            this.info = await this.common.postUrl('purFeeApplyTF','getPurFeeApplyInfo',{id:this.$route.query.id});
            this.$forceUpdate();
        },

        // 保存
        async save() {
            let that = this;
            this.$confirm("核销操作后，未采购数量将不可再进行采购操作，是否继续？", "保存提示" ,{
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString:true
            }).then(async () => {
                await that.common.postUrl('purFeeApplyTF', 'writeOffFeeApply', this.info, null, null, null, true);
                this.$message.success("提交成功")
                that.closePage();
            }).catch(() =>{})
        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        forceUpdate(){
            this.$forceUpdate();
        }
    },
};