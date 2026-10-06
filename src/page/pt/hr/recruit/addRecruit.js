import WangEditor from "@/components/wangEditor/wangEditor.vue";
import Mytag from "@/components/myTag/myTag.vue";

export default {
    name: "addRecruit",
    components: {
        WangEditor,
        Mytag
    },
    data() {
        return {
            info: {
                id:this.$route.query.id,
                positionName:'',
                positionDesc:'',
                requirementDesc:'',
                salaryStart:'',
                salaryEnd:'',
                workCity:'',
                workAddress:'',
                tagArray:[],
            },
        };
    },
    mounted() {
        if(this.$route.query.id>0){
            this.initRecruitDetail();
        }
    },
    methods: {
        // 初始化数据
        async initRecruitDetail() {
            this.info = await this.common.postUrl('hrRecruitInfoTF','queryHrRecruitInfoDetail',{id:this.$route.query.id});
            this.$refs.positionDesc.setEditor(this.info.positionDesc);
            this.$refs.requirementDesc.setEditor(this.info.requirementDesc);
            this.$forceUpdate();
        },
        // 保存
        async save() {
            if(!this.info.positionName){
                this.$message.error("职位名称不能为空");
                return;
            }
            this.info.positionDesc = this.$refs.positionDesc.html;
            this.info.requirementDesc = this.$refs.requirementDesc.html;
            if(!this.info.positionDesc){
                this.$message.error("职位描述不能为空");
                return;
            }
            if(!this.info.positionDesc){
                this.$message.error("任职要求描述不能为空");
                return;
            }
            if(!this.info.salaryStart||!this.info.salaryEnd){
                this.$message.error("薪资范围不能为空");
                return;
            }
            if(!this.info.workCity){
                this.$message.error("工作城市不能为空");
                return;
            }
            this.info.tags = this.$refs.tags.getData();

            await this.common.postUrl('hrRecruitInfoTF', 'saveHrRecruitInfo', this.info, null, null, null, true);
            this.$message.success("保存成功")
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
};