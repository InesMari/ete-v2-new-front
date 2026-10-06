import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'driverManage',
    data()
    {
        return {
            //0 查看 1 新增 2 修改 4审核
            isDisable: this.$route.query.type == 0 || this.$route.query.type == 4,
            type: this.$route.query.type,
            
            stsData: [],
            bizAuditStateData: [],
            whetherData: [],
            dicQuasiDrivingTypeData: [],
            authStateShowTextList: [],
            srcList: [],
            supplierData: [],
            driverInfoData: this.initDriverInfo(),
            supplierOptions: '',
            userId: this.common.userInfo().userId,
            authShow: false,
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
                individualSupplier: '',
                createUserId: '',
                createDate: '',
                updateUserId: '',
                updateDate: '',
                sts: '',
                authRemarkInternal: '',
                supplierList: '',
                authFlag: '',
            }
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            //加载静态枚举
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "STS,WHETHER,BIZ_AUDIT_STATE,QUASI_DRIVING_TYPE"});
            this.bizAuditStateData = data.BIZ_AUDIT_STATE;
            this.stsData = data.STS;
            this.whetherData = data.WHETHER;
            this.dicQuasiDrivingTypeData = data.QUASI_DRIVING_TYPE;
            this.supplierOptions = await this.common.postUrl("supplierTF", "getSupplierSelectData", {});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        async loadDriverInfoById(id)
        {
            let data = await this.common.postUrl("driverTF", 'queryDriverInfoById', {id});
            
            this.driverInfoData = data;
            this.authStateShowTextList = data.authStateShowTextList;
            if (data.authStateShowTextList && data.authStateShowTextList.length > 0)
            {
                this.authShow = true;
            }
            this.driverInfoData.individualSupplier = data.individualSupplier + '';
            this.driverInfoData.supplierList = data.supplierList;
            if (this.driverInfoData.idCardFrontImg)
                this.$refs.idCardFrontImg.initDate(this.driverInfoData.idCardFrontImg, false);
            if (this.driverInfoData.idCardBackImg)
                this.$refs.idCardBackImg.initDate(this.driverInfoData.idCardBackImg, false);
            if (this.driverInfoData.driverLicenceFrontImg)
                this.$refs.driverLicenceFrontImg.initDate(this.driverInfoData.driverLicenceFrontImg, false);
            if (this.driverInfoData.driverLicenceBackImg)
                this.$refs.driverLicenceBackImg.initDate(this.driverInfoData.driverLicenceBackImg, false);
            if (this.driverInfoData.qualifyCertImg)
                this.$refs.qualifyCertImg.initDate(this.driverInfoData.qualifyCertImg, false);
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
                this.$message.error("请上传身份证正面照!");
                return;
            }
            if (!that.driverInfoData.idCardBackImg)
            {
                this.$message.error("请上传身份证反面照!");
                return;
            }
            if (!that.driverInfoData.driverLicenceFrontImg)
            {
                this.$message.error("请上传驾驶证主页照!");
                return;
            }
            if (!that.driverInfoData.driverLicenceBackImg)
            {
                this.$message.error("请上传驾驶证副页照!");
                return;
            }
            if (!that.driverInfoData.driverLicenceBackImg)
            {
                this.$message.error("请上传驾驶证副页照!");
                return;
            }
            await this.common.postUrl("driverTF", "saveDriverProcess", this.driverInfoData);
            this.$message.success((this.type == 1 ? "新增" : "修改") + "成功！");
            this.closePage();
        },
        async audit(auditType, auditState)
        {
            await this.common.postUrl("bizAuthInfoTF", 'updateAuditState', {
                "authObjId": this.$route.query.id,
                "authObjType": auditType,
                "auditState": auditState,
                "authRemarkInternal": this.driverInfoData.authRemarkInternal,
            });
            this.$message.success("提交成功！");
            this.closePage();
        },
        async successCallbackIdCardFront(imgData)
        {
            this.driverInfoData.idCardFrontImg = imgData.flowId;
            this.driverInfoData.idCardFrontImgPath = imgData.storePath;
            if (this.type == 1)
            {
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
            let that = this;
            that.driverInfoData.driverLicenceBackImg = imgData.flowId;
            that.driverInfoData.driverLicenceBackImgPath = imgData.storePath;
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
