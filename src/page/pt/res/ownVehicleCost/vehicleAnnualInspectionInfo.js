import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'vehicleAnnualInspectionInfo',
    data()
    {
        return {
            isDisable: this.$route.query.type == 0 || this.$route.query.type == 3,
            type: this.$route.query.type,
            info: {},
            vehicleData: [],
            fileList: [this.initFileItem()],
            verifyRemark: null,
        }
    },
    mounted()
    {
        this.initStaticData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadInfoById(this.$route.query.id);
    },
    components: {
        myFileModel,
        tableCommon,
        searchList,
    },
    methods: {
        async initStaticData()
        {
            this.vehicleData = await this.common.postUrl("resVehicleInfoTF", "queryAllVehicleNoPage", {vehicleAttribution: 2});
            this.$forceUpdate();
        },
        async loadInfoById(id)
        {
            let data = await this.common.postUrl("vehicleAnnualInspectionTF", 'getVehicleAnnualInspectionInfo', {id});
            this.info = data.info;
            this.fileList = data.files;
            if (this.type == 2 && this.fileList.length < 5)
                this.fileList.push(this.initFileItem());
            if (this.fileList.length == 0)
                this.fileList.push(this.initFileItem());
            this.initListComponentId();
            this.initImg();
            this.$forceUpdate();
        },
        initFileItem()
        {
            return {
                flowId: null,
                storePath: null,
            }
        },
        successCallback(imgData)
        {
            this.fileList[imgData.componentId].flowId = imgData.flowId;
            this.fileList[imgData.componentId].storePath = imgData.storePath;
            if (this.fileList.length < 5 && !imgData.isInit)
                this.fileList.push(this.initFileItem());
            //设置下componentId
            this.initListComponentId();
        },
        delCallback(index)
        {
            this.fileList.splice(index,1);
            let flag = true;//不存在空的
            for (let i = 0; i < this.fileList.length; i++)
            {
                if (this.common.isBlank(this.fileList[i].flowId))
                    flag = false;
            }
            if(this.fileList.length < 5 && flag){
                this.fileList.push(this.initFileItem());
            }
            this.initListComponentId();
        },
        initListComponentId()
        {
            for (let i = 0; i < this.fileList.length; i++)
                this.fileList[i].componentId = i;
            this.$forceUpdate();
        },
        initImg(){
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.fileList.length; i++) {
                    if (that.fileList[i].flowId) {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.fileList[i].flowId + ")");
                    } else {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
        async saveOrUpdateInfo()
        {
            if (this.common.isBlank(this.info.vehicleId))
            {
                this.$message.error("车辆编号为空！");
                return false;
            }
            if(this.common.isBlank(this.info.inspectionDate)){
                this.$message.error("年检日期为空！");
                return false;
            }
            if(this.common.isBlank(this.info.inspectionFee)){
                this.$message.error("年审费用为空！");
                return false;
            }
            if(this.common.isBlank(this.info.nextInspectionDate)){
                this.$message.error("年检到期日期为空！");
                return false;
            }
            let param = this.common.copyObj(this.info);
            param.fileList = this.common.copyObj(this.fileList);
            await this.common.postUrl("vehicleAnnualInspectionTF", 'saveVehicleAnnualInspectionInfo', param, null, null, '', true);
            this.$message.success((this.type == 1 ? '新增' : '修改') + "成功！");
            this.closePage();
        },
        async verifyInfo(verifyState)
        {
            let param = {verifyState};
            param.id = this.$route.query.id;
            if (verifyState == 2 && this.common.isBlank(this.verifyRemark))
            {
                this.$message.error("审核不通过的审核备注不能为空！");
                return false;
            }
            param.verifyRemark = this.verifyRemark;
            await this.common.postUrl("vehicleAnnualInspectionTF", 'verifyVehicleAnnualInspectionById', param, null, null, '', true);
            this.$message.success("审核成功！");
            this.closePage();
        },
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
