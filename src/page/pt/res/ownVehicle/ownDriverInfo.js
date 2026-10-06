import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";

export default {
    name: 'ownDriverInfo',
    data()
    {
        return {
            //0 查看 1 新增 2 修改
            isDisable: this.$route.query.type == 0,
            type: this.$route.query.type,
            quasiDrivingTypeData: [],
            sexData: [],
            supplierData: [],
            vehicleData: [],
            driverInfoData: this.initDriverInfo(),
            confirmText: this.type == 1 ? '新增' : '修改',
            isLoadUpdate: false,
        }
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadDriverInfoById(this.$route.query.id);
    },
    /**
     * 绑定函数
     */
    methods: {
        initDriverInfo()
        {
            return this.driverInfoData = {
                id: '',
                userId: '',
                sex: '1',
                nativePlace: '',
                driverName: '',
                driverPhone: '',
                idCard: '',
                driverLicence: '',
                driverClass: '',
                licenseIssuingAuthority: '',
                effectiveDate: '',
                expireDate: '',
                idCardFrontImg: '',
                idCardFrontImgPath: '',
                idCardBackImg: '',
                idCardBackImgPath: '',
                driverLicenceFrontImg: '',
                driverLicenceFrontImgPath: '',
                driverLicenceBackImg: '',
                driverLicenceBackImgPath: '',
                createUserId: '',
                createDate: '',
                updateUserId: '',
                updateDate: '',
                sts: '',
                supplierList: '',
                entryDate: '',
                entryAge: '',
                entryDriverLicenceAge: '',
            }
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'QUASI_DRIVING_TYPE,SEX'});
            this.quasiDrivingTypeData = data.QUASI_DRIVING_TYPE;
            this.sexData = data.SEX;
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.vehicleData = await this.common.postUrl("resVehicleInfoTF", "queryAllVehicleNoPage", {vehicleAttribution: 2});
        },
        async loadDriver()
        {
           let data = await this.common.postUrl("driverTF", 'loadDriverByIdCard', {idCard: this.driverInfoData.idCard});
           if (this.type == 1 && data && data.id)
           {
               //系统检测到已经存在该身份证的司机
               let that = this;
               this.$confirm("系统检测到已经存在该身份证的司机,是否加载司机信息？", "提示", {
                   center: true,
               }).then(async () =>{
                    that.confirmText = "保存";
                    that.isLoadUpdate = true;
                    await that.loadDriverInfoById(data.id);
                    setTimeout(()=>{
                        that.isLoadUpdate = false;
                    }, 3000);
               }).catch(() =>{
                   //取消
               });
           }
        },
        async loadDriverInfoById(id)
        {
            let data = await this.common.postUrl("driverTF", 'queryDriverInfoById', {id});
            
            this.driverInfoData = data;
            if (this.driverInfoData.idCardFrontImg)
                this.$refs.idCardFrontImg.initDate(this.driverInfoData.idCardFrontImg);
            if (this.driverInfoData.idCardBackImg)
                this.$refs.idCardBackImg.initDate(this.driverInfoData.idCardBackImg);
            if (this.driverInfoData.driverLicenceFrontImg)
                this.$refs.driverLicenceFrontImg.initDate(this.driverInfoData.driverLicenceFrontImg);
            if (this.driverInfoData.driverLicenceBackImg)
                this.$refs.driverLicenceBackImg.initDate(this.driverInfoData.driverLicenceBackImg);
            if (this.driverInfoData.qualifyCertImg)
                this.$refs.qualifyCertImg.initDate(this.driverInfoData.qualifyCertImg);
            this.$forceUpdate();
        },
        async saveDriverInfo()
        {
            this.driverInfoData.idCardFrontImg = this.$refs.idCardFrontImg.getImageData().flowId;
            this.driverInfoData.idCardFrontImgPath = this.$refs.idCardFrontImg.getImageData().storePath;
            this.driverInfoData.idCardBackImg = this.$refs.idCardBackImg.getImageData().flowId;
            this.driverInfoData.idCardBackImgPath = this.$refs.idCardBackImg.getImageData().storePath;
            this.driverInfoData.driverLicenceFrontImg = this.$refs.driverLicenceFrontImg.getImageData().flowId;
            this.driverInfoData.driverLicenceFrontImgPath = this.$refs.driverLicenceFrontImg.getImageData().storePath;
            this.driverInfoData.driverLicenceBackImg = this.$refs.driverLicenceBackImg.getImageData().flowId;
            this.driverInfoData.driverLicenceBackImgPath = this.$refs.driverLicenceBackImg.getImageData().storePath;
            this.driverInfoData.qualifyCertImg = this.$refs.qualifyCertImg.getImageData().flowId;
            this.driverInfoData.qualifyCertImgPath = this.$refs.qualifyCertImg.getImageData().storePath;
            let that = this;
            if (!that.driverInfoData.idCardFrontImg)
            {
                this.$message.error("请上传身份证正面!");
                return;
            }
            if (!that.driverInfoData.idCardBackImg)
            {
                this.$message.error("请上传身份证反面!");
                return;
            }
            if (!that.driverInfoData.driverLicenceFrontImg)
            {
                this.$message.error("请上传驾驶证正面!");
                return;
            }
            if (!that.driverInfoData.driverLicenceBackImg)
            {
                this.$message.error("请上传驾驶证副页!");
                return;
            }
            if (!that.driverInfoData.driverLicenceBackImg)
            {
                this.$message.error("请上传驾驶证副页照!");
                return;
            }
            if (this.common.isBlank(this.driverInfoData.driverName))
            {
                this.$message.error("请填写司机姓名！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.idCard))
            {
                this.$message.error("请填写身份证号！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.driverPhone))
            {
                this.$message.error("请填写手机号！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.nativePlace))
            {
                this.$message.error("请填写籍贯！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.sex))
            {
                this.$message.error("请选择性别！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.driverClass))
            {
                this.$message.error("请选择准驾车型！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.driverLicence))
            {
                this.$message.error("请填写驾驶照号！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.licenseIssuingAuthority))
            {
                this.$message.error("请填写发证机关！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.effectiveDate))
            {
                this.$message.error("请选择有效期生效日期！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.expireDate))
            {
                this.$message.error("请选择有效期失效日期！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.entryDate))
            {
                this.$message.error("请选择入职日期！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.entryAge))
            {
                this.$message.error("请填写入职年龄！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.entryDriverLicenceAge))
            {
                this.$message.error("请填写入职驾龄！");
                return false;
            }
            if (this.common.isBlank(this.driverInfoData.supplierId))
            {
                this.$message.error("请选择所属公司！");
                return false;
            }
            this.driverInfoData.individualSupplier = 0;
            this.driverInfoData.isOwn = 1;
            await this.common.postUrl("driverTF", "saveDriverProcess", this.driverInfoData);
            this.$message.success((this.type == 1 ? "新增" : "修改") + "成功！");
            this.closePage();
        },
        clean()
        {
            this.$refs.idCardFrontImg.clean();
            this.$refs.idCardBackImg.clean();
            this.$refs.driverLicenceFrontImg.clean();
            this.$refs.driverLicenceBackImg.clean();
            this.$refs.qualifyCertImg.clean();
        },
        async successCallbackIdCardFront(imgData)
        {
            this.driverInfoData.idCardFrontImg = imgData.flowId;
            this.driverInfoData.idCardFrontImgPath = imgData.storePath;
            if (this.type == 1)
            {
                if (this.isLoadUpdate)
                    return;
                let data = await this.common.postUrl("driverTF", 'getIdCardOcrData', {fileId: imgData.storePath});
                if (this.common.isBlank(data))
                    return;
                this.driverInfoData.driverName = data.name;
                this.driverInfoData.idCard = data.idCardNum;
                this.driverInfoData.qualifyCertId = data.idCardNum;
            }
        },
        delCallbackIdCardFront()
        {
            this.driverInfoData.idCardFrontImg = '';
            this.driverInfoData.idCardFrontImgPath = '';
        },
        successCallbackIdCardBackImg(imgData)
        {
            this.driverInfoData.idCardBackImg = imgData.flowId;
            this.driverInfoData.idCardBackImgPath = imgData.storePath;
        },
        delCallbackIdCardBackImg()
        {
            this.driverInfoData.idCardBackImg = '';
            this.driverInfoData.idCardBackImgPath = '';
        },
        successCallbackQualifyCertImg(imgData)
        {
            this.driverInfoData.qualifyCertImg = imgData.flowId;
            this.driverInfoData.qualifyCertImgPath = imgData.storePath;
        },
        delCallbackQualifyCertImg()
        {
            this.driverInfoData.qualifyCertImg = '';
            this.driverInfoData.qualifyCertImgPath = '';
        },
        async successCallbackDriverLicenceFrontImg(imgData)
        {
            this.driverInfoData.driverLicenceFrontImg = imgData.flowId;
            this.driverInfoData.driverLicenceFrontImgPath = imgData.storePath;
            if (this.type == 1)
            {
                if (this.isLoadUpdate)
                    return;
                let data = await this.common.postUrl("driverTF", 'getDrivingLicenseOcrData', {fileId: imgData.storePath});
                if (this.common.isBlank(data))
                    return;
                this.driverInfoData.driverClass = data.driverClass;
                this.driverInfoData.drivingLicense = data.drivingLicense;
                this.driverInfoData.effectiveDate = data.effectiveDate;
                this.driverInfoData.expireDate = data.expireDate;
            }
        },
        delCallbackDriverLicenceFrontImg()
        {
            this.driverInfoData.driverLicenceFrontImg = '';
            this.driverInfoData.driverLicenceFrontImgPath = '';
        },
        successCallbackDriverLicenceBackImg(imgData)
        {
            this.driverInfoData.driverLicenceBackImg = imgData.flowId;
            this.driverInfoData.driverLicenceBackImgPath = imgData.storePath;
        },
        delCallbackDriverLicenceBackImg()
        {
            this.driverInfoData.driverLicenceBackImg = '';
            this.driverInfoData.driverLicenceBackImgPath = '';
        },
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
