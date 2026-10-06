import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'insuranceRebate',
    data()
    {
        return {
            id: this.$route.query.id,
            type: this.$route.query.type,
            info: this.initInfo(),
            settleBodyData: [],
            isVisible: this.$route.query.id > 0 && this.$route.query.type > 2,
            fileList: [{}],
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
        myFileModel,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                settleBody: null,
                plateNumber: null,
                insuranceProduct: null,
                sumInsured: null,
                rebateAmount: null,
                postedAmount: null,
                insuranceCompany: null,
                insuranceDate: null,
                postedDate: null,
            };
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'PAY_TITLE,'});
            this.settleBodyData = data.PAY_TITLE;
            if (this.$route.query.id)
            {
                this.loadDataById(this.$route.query.id);
            }
        },
        successCallback(fileData)
        {
            if (this.fileList.length <= 5)
            {
                this.fileList[fileData.componentId].fileId = fileData.flowId;
                this.fileList[fileData.componentId].filePath = fileData.storePath;
                if (this.fileList.length < 5)
                {
                    if (this.type != 5)//详情
                        this.fileList.push({});
                }
            }
            this.initListComponentId();
        },
        deleteCallback(index)
        {
            this.fileList.splice(index, 1);
            let flag = false;
            for (let i = 0; i < this.fileList.length; i++)
            {
                if (this.common.isBlank(this.fileList[i].flowId))
                {
                    flag = true;//存在空的
                }
            }
            //存在未上传的文件不
            if (!flag && this.fileList.length <= 4)
            {
                this.fileList.push({});
            }
            this.showFile();
            this.initListComponentId();
        },
        showFile()
        {
            this.$nextTick(() =>
            {
                let that = this;
                for (let i = 0; i < this.fileList.length; i++)
                {
                    if (this.fileList[i].fileId)
                    {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.fileList[i].fileId + ")");
                    } else
                    {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
        initListComponentId()
        {
            for (let i = 0; i < this.fileList.length; i++)
                this.fileList[i].componentId = i;
            this.$forceUpdate();
        },
        async loadDataById(id)
        {
            let data = await this.common.postUrl('insuranceRebateIncomeService', 'loadInsuranceRebateIncomeById', {id});
            this.info = data.info;
            this.info.settleBody = data.info.settleBody + "";
            this.info.insuranceDate = [data.info.startDate, data.info.endDate];
            if (data.fileList &&  data.fileList.length > 0)
            {
                this.fileList = data.fileList;
                this.showFile();
            }
            if(this.type == 6){
                this.info.receiveFeeDate = this.common.formatDate.getDate();
            }
            this.$forceUpdate();
        },
        async confirm()
        {
            await this.common.postUrl('insuranceRebateIncomeService', 'confirmInsuranceRebateIncome', this.info);
            this.$message.success("确认成功！");
            this.closePage();
        },
        async save()
        {
            if (this.common.isBlank(this.info.settleBody)) {
                this.$message.error("请选择结算主体！");
                return false;
            }
            if (this.common.isBlank(this.info.plateNumber)) {
                this.$message.error("请输入车牌号！");
                return false;
            }
            if (this.common.isBlank(this.info.insuranceProduct)) {
                this.$message.error("请输入险种！");
                return false;
            }
            if (this.common.isBlank(this.info.sumInsured) || this.info.sumInsured <= 0) {
                this.$message.error("请输入保额！");
                return false;
            }
            if (this.common.isBlank(this.info.postedAmount) || this.info.postedAmount <= 0) {
                this.$message.error("请输入入账金额！");
                return false;
            }
            if (this.common.isBlank(this.info.insuranceCompany)) {
                this.$message.error("请输入保险公司！");
                return false;
            }
            if(this.common.isNotBlank(this.info.insuranceDate) && this.info.insuranceDate.length === 2){
                this.info.startDate = this.info.insuranceDate[0];
                this.info.endDate = this.info.insuranceDate[1];
            }else{
                this.$message.error("请输入保险起止日期！");
                return false;
            }
            if (this.common.isBlank(this.info.postedDate)) {
                this.$message.error("请输入入账日期！");
                return false;
            }
            let param = this.common.copyObj(this.info)
            param.fileList = this.fileList;
            
            await this.common.postUrl("insuranceRebateIncomeService", "saveOrUpdateInsuranceRebateIncome", param);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}