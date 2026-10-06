import myFileModel from '@/components/myFileModel/myFileModel.vue';
import myElDatePicker from "@/components/myElDatePicker/index.js";

export default {
    name: "addException",
    components: {
        myFileModel,
        myElDatePicker
    },
    data() {
        return {
            info: {
                incidentDate:'',
                incidentAddress:'',
                incidentProcess:'',
                problemDescribe:'',
                emergencyTreatment:'',
                assistContent:'',
                party:'',
                discoverer:'',
                orgName:this.common.userInfo().orgName,
                createUserName:this.common.userInfo().userName,
                type:'',
                responsibleCompany:'',
                responsiblePeople:'',
                relCustTenantId:'',
                peopleInjurySts:0,
                peopleInjuryStr:'',
                lossFee:'',
                files:[{}],
                whetherReport: 0,
                insureClass: null,
                reportNum: null,
            },
            type:this.$route.query.type,
            typeData:[],
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
            this.$nextTick(()=> {
                this.info.files.forEach((item,index) => {
                    this.$refs['imgCover'+index][0].initDate(item.fileId);
                })
                if (this.$route.query.type == 2 && (!this.info.files || this.info.files.length == 0))
                {
                    this.info.files.push({});
                }
            });
            this.$forceUpdate();
        },
        /**
         * 上传回调
         * @param data
         */
        successCallback(data)
        {
            let index = data.componentId;
            this.info.files[index].fileId = data.flowId;
            this.info.files[index].filePath = data.storePath;

            // 检查最后一个对象是否为空，为空时不继续push
            if(index<7){
                const lastFile = this.info.files[this.info.files.length - 1];
                const isEmpty = Object.keys(lastFile).length === 0;
                if (!isEmpty) {
                    this.info.files.push({});
                }
            }

        },
        // 保存
        async save() {
            if(this.common.isBlank(this.info.incidentDate)){
                this.$message.error("事发时间不能为空");
                return;
            }
            if(this.common.isBlank(this.info.incidentAddress)){
                this.$message.error("发生地点/线路不能为空");
                return;
            }
            if(this.common.isBlank(this.info.incidentProcess)){
                this.$message.error("事件经过不能为空");
                return;
            }
            if(this.common.isBlank(this.info.type)){
                this.$message.error("异常类型不能为空");
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
            if (this.info.whetherReport == 1)
            {
                if(this.common.isBlank(this.info.insureClass)){
                    this.$message.error("保险种类不能为空");
                    return;
                }
                if(this.common.isBlank(this.info.reportNum)){
                    this.$message.error("报案号不能为空");
                    return;
                }
            }
            await this.common.postUrl('exceptionTF', 'saveExceptionInfo', this.info, null, null, null, true);
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