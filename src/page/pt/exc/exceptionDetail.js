import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";

export default {
    name: "exceptionDetail",
    components: {
        myFileModel,
    },
    data() {
        return {
            info: {
                state:'',
                type:'',
                responsibleCompany:'',
                responsiblePeople:'',
                relCustTenantId:'',
                peopleInjurySts:'',
                peopleInjuryStr:'',
                lossFee:'',
                result:'',
                isExamine:'0',
                files:[{}]
            },
            type:this.$route.query.type
        };
    },
    mounted() {
        this.initExceptionData();
    },
    methods: {
        // 初始化数据
        async initExceptionData() {
            this.info = await this.common.postUrl('exceptionTF','getExceptionInfo',{id:this.$route.query.id});
            this.info.type=this.info.type+'';
            this.info.state=this.info.state+'';
            if(this.common.isNotBlank(this.info.fileId)){
                this.$refs['file'].initDate(this.info.fileId);
            }
            this.$nextTick(()=> {
                this.info.files.forEach((item, index) => {
                    this.$refs['imgCover' + index][0].initDate(item.fileId);
                })
            });
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },

        async verify(type){
            if (!(2 == this.info.state || 3 == this.info.state)){
                this.$message.error("只有待审核和审核中的数据才可以审核！");
                return false;
            }
            let param = {};
            param.id = this.info.id;
            param.type = type;
            if (type === 2){
                this.$prompt('请输入不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(async ({ value }) => {
                    if (this.common.isBlank(value))
                    {
                        this.$message.error("请填写不通过原因！");
                        return false;
                    }
                    param.verifyRemark = value;
                    await this.verifyById(param);
                }).catch(() => {});
            }
            else
                await this.verifyById(param);
        },
        async verifyById(param){
            await this.common.postUrl("exceptionTF", "verifyExceptionInfo", param);
            this.$message.success("审核成功！");
            let that = this;
            setTimeout(() => {
                that.closePage();
            }, 500);
        },
    },
};