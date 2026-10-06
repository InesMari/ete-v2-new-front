import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";
import mycity from '@/components/mycity/mycity.vue'

export default {
    name: 'ownVehicleInfo',
    data()
    {
        return {
            isDisable: this.$route.query.type == 0,
            type: this.$route.query.type,
            isOCRFlag: this.$route.query.type == 1,
            info: this.initInfo(),
            sexData: [],
            driverData: [],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadSupercargoInfoById(this.$route.query.id);
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        tableCommon,
        searchList,
        mycity,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                id: '',
                sex: '2',
                supercargoName: null,
                idCard: null,
                billId: null,
                supercargoLicence: null,
                effectiveDate: null,
                expireDate: null,
                entryDate: null,
                entryAge: null,
                entrySupercargoAge: null,
            }
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': "SEX"});
            this.sexData = data.SEX;
            this.driverData = await this.common.postUrl("driverTF", "queryAllDriverList", {isOwn: 1});
            this.$forceUpdate();
        },
        async loadSupercargoInfoById(id)
        {
            let data = await this.common.postUrl("supercargoService", 'querySupercargoInfoById', {id});
            this.info = data;
            if (data.idCardFrontImg)
                this.$refs.idCardFrontImg.initDate(data.idCardFrontImg);
            if (data.idCardBackImg)
                this.$refs.idCardBackImg.initDate(data.idCardBackImg);
            if (data.supercargoLicenceImg)
                this.$refs.supercargoLicenceImg.initDate(data.supercargoLicenceImg);
            if (data.cityId)
                this.$refs.city.initData(data.provinceId, data.cityId, data.districtId);
            this.$forceUpdate();
        },
        async saveOrUpdateVehicleInfo()
        {
            let imageData = this.$refs.idCardFrontImg.getImageData();
            if (this.common.isBlank(imageData.flowId))
            {
                this.$message.error("请上传身份证正面图片！");
                return false;
            }
            if (this.common.isBlank(imageData.storePath))
            {
                this.$message.error("请上传身份证正面图片！");
                return false;
            }
            this.info.idCardFrontImg = imageData.flowId;
            this.info.idCardFrontImgPath = imageData.storePath;
            imageData = this.$refs.idCardBackImg.getImageData();
            if (this.common.isBlank(imageData.flowId))
            {
                this.$message.error("请上传身份证反面图片！");
                return false;
            }
            if (this.common.isBlank(imageData.storePath))
            {
                this.$message.error("请上传身份证反面图片！");
                return false;
            }
            this.info.idCardBackImg = imageData.flowId;
            this.info.idCardBackImgPath = imageData.storePath;
            imageData = this.$refs.supercargoLicenceImg.getImageData();
            if (this.common.isBlank(imageData.flowId))
            {
                this.$message.error("请上传押运证图片！");
                return false;
            }
            if (this.common.isBlank(imageData.storePath))
            {
                this.$message.error("请上传押运证图片！");
                return false;
            }
            this.info.supercargoLicenceImg = imageData.flowId;
            this.info.supercargoLicenceImgPath = imageData.storePath;
            if (this.common.isBlank(this.info.sex))
            {
                this.$message.error("请选择性别！");
                return false;
            }
            if (this.common.isBlank(this.info.supercargoName))
            {
                this.$message.error("请填写押运员姓名！");
                return false;
            }
            if (this.common.isBlank(this.info.idCard))
            {
                this.$message.error("请填写身份证号！");
                return false;
            }
            if (this.common.isBlank(this.info.billId))
            {
                this.$message.error("请填写手机号码！");
                return false;
            }
            if (this.common.isBlank(this.info.supercargoLicence))
            {
                this.$message.error("请填写押运证证号！");
                return false;
            }
            if (this.common.isBlank(this.info.effectiveDate))
            {
                this.$message.error("请选择押运证生效日期！");
                return false;
            }
            if (this.common.isBlank(this.info.expireDate))
            {
                this.$message.error("请选择押运证失效日期！");
                return false;
            }
            if (this.common.isBlank(this.info.entryDate))
            {
                this.$message.error("请选择入职日期！");
                return false;
            }
            if (this.common.isBlank(this.info.entryAge))
            {
                this.$message.error("请填写入职年龄！");
                return false;
            }
            if (this.common.isBlank(this.info.provinceId))
            {
                this.$message.error("请选择住址省份！");
                return false;
            }
            if (this.common.isBlank(this.info.cityId))
            {
                this.$message.error("请选择住址城市！");
                return false;
            }
            if (this.common.isBlank(this.info.districtId))
            {
                this.$message.error("请选择住址区县！");
                return false;
            }
            if (this.common.isBlank(this.info.entrySupercargoAge))
            {
                this.$message.error("请填写入职押运龄！");
                return false;
            }
            if (this.common.isBlank(this.info.driverId))
            {
                this.$message.error("请选择绑定司机！");
                return false;
            }
            await this.common.postUrl("supercargoService", 'saveOrUpdateSupercargo', this.info, null, null, '', true);
            this.$message.success((this.type == 1 ? '新增' : '修改') + "成功！");
            this.closePage();
        },
        successCallbackIdCardFront(imgData)
        {
            this.info.idCardFrontImg = imgData.flowId;
            this.info.idCardFrontImgPath = imgData.storePath;
            if (this.isOCRFlag)
            {
                let that = this;
                that.common.postUrl("driverTF", 'getIdCardOcrData', {fileId: imgData.storePath}, function (data)
                {
                    if (data)
                    {
                        that.info.supercargoName = data.name;
                        that.info.idCard = data.idCardNum;
                    }
                });
            }
            else
                this.isOCRFlag = true;
        },
        successCallbackIdCardBackImg(imgData)
        {
            this.info.idCardBackImg = imgData.flowId;
            this.info.idCardBackImgPath = imgData.storePath;
        },
        successCallbackSupercargoLicenceImg(imgData)
        {
            this.info.supercargoLicenceImg = imgData.flowId;
            this.info.supercargoLicenceImgPath = imgData.storePath;
        },
        async selectCallback()
        {
            let address = this.$refs.city.getData();
            this.info.provinceId = address.ProvinceId;
            this.info.cityId = address.CityId;
            this.info.districtId = address.DistrictId;
            this.$forceUpdate();
        },
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
