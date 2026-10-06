import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: "exceptionHandle",
    components: {
        myFileModel,
    },
    data() {
        return {
            info: {
                state:'1',
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
            typeData:[],
            stateData:[],
            custData:[],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EXCEPTION_TYPE"}, function (data) {
                that.typeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EXCEPTION_STATE"}, function (data) {
                that.stateData = data;
                that.stateData.splice(3,3);
            });
            this.common.postUrl("customerTF", "loadCustomerList", {isLoadAllCustomer:1}, function (data) {
                that.custData = data;
            });
            if(this.$route.query.id){
                this.initExceptionData();
            }
        },
        // 初始化数据
        async initExceptionData() {
            this.info = await this.common.postUrl('exceptionTF','getExceptionInfo',{id:this.$route.query.id});
            this.info.type=this.info.type+'';
            this.info.state='2';
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
         * 上传回调
         * @param data
         */
        successCallback(data)
        {
            this.info.fileId = data.flowId;
            this.info.filePath = data.storePath;
        },
        // 保存
        async save() {
            if(this.common.isBlank(this.info.type)){
                this.$message.error("异常类型不能为空");
                return;
            }
            if(this.common.isBlank(this.info.state)){
                this.$message.error("处理状态不能为空");
                return;
            }
            if(this.common.isBlank(this.info.responsibleCompany)){
                this.$message.error("责任单位不能为空");
                return;
            }
            if(this.common.isBlank(this.info.peopleInjurySts)){
                this.$message.error("有无人员伤害不能为空");
                return;
            }
            if(this.common.isBlank(this.info.result)){
                this.$message.error("处理结果不能为空");
                return;
            }
            if(this.common.isBlank(this.info.isExamine)){
                this.$message.error("是否纳入月考核评定不能为空");
                return;
            }

            await this.common.postUrl('exceptionTF', 'doneExceptionInfo', this.info, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },
        /**
         * 关闭当前页面
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