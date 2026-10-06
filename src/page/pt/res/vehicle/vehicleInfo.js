import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'vehicleInfo',
    data()
    {
        return {
            //0 查看 1 新增 2 修改 3审核
            isDisable: this.$route.query.type == 0 || this.$route.query.type == 3,
            type: this.$route.query.type,
            vehicleInfo: this.initVehicleInfo(),
            vehicleTypeData: [],
            transportTypeData: [],
            plateColorTypeData: [],
            vehicleEnergyTypeData: [],
            vehicleLengthData: [],
            vehicleUseCharacterData: [],
            whetherData: [],
            supplierData: [],
            driverData:[],
            vehicleTypeQuoteData:[],
            custData:[],

            viewerImages: [],    //查看器图片列表
            currentImageIndex: 0, //当前图片索引
        }
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        fileViewer
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        if (this.common.isNotBlank(this.$route.query.vehicleId))
            this.loadVehicleInfoById(this.$route.query.vehicleId);
    },
    methods: {
        initVehicleInfo(){
            return this.vehicleInfo = {
                vehicleAttribution: '2',
                sinoiovFlag: '1',
                plateNumber: null,//
                licensePlateColor: null,//
                energyType: null,
                vehicleType: null,
                vehicleLength: null,
                loadWeight: null,//
                totalWeight: null,
                vin: null,//
                engineNumber: null,
                useCharacter: null,
                issueUnit: null,
                issueDate: null,//
                registerDate: null,//
                roadTransportCertificate: null,
                vehicleOwner: null,
                vehicleSeller: null,//
                buyDate: null,//
                buyPrice: null,//
                purchaseTax: null,//
                brand: null,//
                supplierList: null,//
                transportType: null,//
                
                fileNumber: null,//
                tractionMass: null,
                tireSpecification: null,
                tiresNumber: null,
                rearWheelNumber: null,
                displacement: null,
                ratedPower: null,
                gearboxType: null,
                purchaseSource: null,
                trailerId: null,
            }
        },
        async initData()
        {
            let codeTypes = 'VEHICLE_TYPE_QUOTE,VEHICLE_TYPE,VEHICLE_ENERGY_TYPE,PLATE_COLOR,VEHICLE_LENGTH,VEHICLE_USE_CHARACTER,WHETHER,TRANSPORT_TYPE';
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': codeTypes});
            this.vehicleTypeData = data.VEHICLE_TYPE;
            this.vehicleEnergyTypeData = data.VEHICLE_ENERGY_TYPE;
            this.vehicleLengthData = data.VEHICLE_LENGTH;
            this.plateColorTypeData = data.PLATE_COLOR;
            this.vehicleUseCharacterData = data.VEHICLE_USE_CHARACTER;
            this.whetherData = data.WHETHER;//是否
            this.transportTypeData = data.TRANSPORT_TYPE;//运输类型
            this.vehicleTypeQuoteData = data.VEHICLE_TYPE_QUOTE;//
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.driverData = await this.common.postUrl("driverTF", "queryAllDriverList", {isOwn: 1});
            this.custData = await this.common.postUrl("customerTF", "loadCustomerList", {});
            this.$forceUpdate();
        },
        /**
         * 车牌号输入判断绿牌
         * @param e
         */
        inputPlateNumber(e)
        {
            let plateNumber = e.target.value;
            if (this.common.isNotBlank(plateNumber) && plateNumber.length > 7)
            {
                this.vehicleInfo.licensePlateColor = '3';
                this.$forceUpdate();
            }
        },
        async loadVehicleInfoById(vehicleId)
        {
            let data = await this.common.postUrl("resVehicleInfoTF", 'queryVehicleInfoById', {id: vehicleId, vTenantRelSts: 1});
            if (this.common.isNotBlank(data.licensePlateColor))
                data.licensePlateColor = data.licensePlateColor + "";
            if (this.common.isNotBlank(data.energyType))
                data.energyType = data.energyType + "";
            if (this.common.isNotBlank(data.vehicleType))
                data.vehicleType = data.vehicleType + "";
            if (this.common.isNotBlank(data.vehicleLength))
                data.vehicleLength = data.vehicleLength + "";
            if (this.common.isNotBlank(data.transportType))
                data.transportType = data.transportType + "";
            if (this.common.isNotBlank(data.vehicleTypeQuote))
                data.vehicleTypeQuote = data.vehicleTypeQuote + "";
            
            this.vehicleInfo = data;
            if (data.vehicleLicenseFrontImg)
                this.$refs.vehicleLicenseFront.initDate(data.vehicleLicenseFrontImg,false);
            if (data.vehicleLicenseBackImg)
                this.$refs.vehicleLicenseBack.initDate(data.vehicleLicenseBackImg,false);
            if (data.roadTransportCertificateImg)
                this.$refs.roadTransportCertificate.initDate(data.roadTransportCertificateImg,false);
            if (data.roadOperatingPermitImg)
                this.$refs.roadOperatingPermit.initDate(data.roadOperatingPermitImg,false);

            this.$forceUpdate();
        },
        async saveOrUpdateVehicleInfo()
        {
            if (this.common.isBlank(this.vehicleInfo.vehicleLicenseFrontImg))
            {
                this.$message.error("请上传行驶证主页图片！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.vehicleLicenseFrontImgPath))
            {
                this.$message.error("请上传行驶证主页图片！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.vehicleLicenseBackImg))
            {
                this.$message.error("请上传行驶证副页图片！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.vehicleLicenseBackImgPath))
            {
                this.$message.error("请上传行驶证副页图片！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.plateNumber))
            {
                this.$message.error("请填写车牌号码！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.vin))
            {
                this.$message.error("请填写车辆识别代号！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.useCharacter))
            {
                this.$message.error("请选择使用性质！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.vehicleType))
            {
                this.$message.error("请选择行驶证车型！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.registerDate))
            {
                this.$message.error("请选择注册日期！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.issueDate))
            {
                this.$message.error("请选择发证日期！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.loadWeight))
            {
                this.$message.error("请填写核定载质量！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.totalWeight))
            {
                this.$message.error("请填写总质量！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.licensePlateColor))
            {
                this.$message.error("请选择车辆颜色！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.vehicleLength))
            {
                this.$message.error("请选择车长！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.energyType))
            {
                this.$message.error("请选择能源类型！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.vehicleTypeQuote))
            {
                this.$message.error("请选择报价车型！");
                return false;
            }
            if (this.common.isBlank(this.vehicleInfo.supplierList) || this.vehicleInfo.supplierList.length == 0)
            {
                this.$message.error("请选择绑定供应商！");
                return false;
            }
            this.vehicleInfo.vehicleAttribution = 1;//固定是平台车
            await this.common.postUrl("resVehicleInfoTF", 'saveVehicleInfo', this.vehicleInfo, null, null, '', true);
            this.$message.success((this.type == 1 ? '新增' : '修改') + "成功！");
            this.closePage();
        },
        async audit(auditType, auditState) {
            await this.common.postUrl("bizAuthInfoTF", "updateAuditState", {
                "authObjId": this.$route.query.vehicleId,
                "authObjType": auditType,
                "auditState": auditState,
                "authRemarkInternal": this.vehicleInfo.authRemarkInternal,
            });
            this.$message.success("资质审核处理成功！");
            this.closePage();
        },
        clean()
        {
            this.$refs.vehicleLicenseFront.clean();
            this.$refs.vehicleLicenseBack.clean();
            this.$refs.roadTransportCertificate.clean();
            this.$refs.roadOperatingPermit.clean();
        },
        /**
         * 行驶证主页
         * @param imgData
         */
        async successCallbackVehicleLicenseFront(imgData)
        {
            try{
                this.$nextTick(()=>{
                    this.common.shade.show();
                })
                this.vehicleInfo.vehicleLicenseFrontImg = imgData.flowId;
                this.vehicleInfo.vehicleLicenseFrontImgPath = imgData.storePath;
                let data = await this.common.postUrl("resVehicleInfoTF", 'getVehicleLicenseInfo', {fileId: imgData.storePath});
                if (data)
                {
                    this.vehicleInfo.plateNumber = data.plateNumber;
                    this.vehicleInfo.vin = data.vin;
                    this.vehicleInfo.brand = data.model;
                    this.vehicleInfo.issueUnit = data.issueUnit;
                    this.vehicleInfo.registerDate = data.registerDate;
                    this.vehicleInfo.issueDate = data.issueDate;
                    this.vehicleInfo.vehicleOwner = data.vehicleOwner;
                    for (let i = 0; i < this.vehicleUseCharacterData.length; i++)
                    {
                        if (this.vehicleUseCharacterData[i].codeName == data.useCharacter)
                            this.vehicleInfo.useCharacter = this.vehicleUseCharacterData[i].codeValue;
                    }
                    for (let i = 0; i < this.vehicleTypeData.length; i++)
                    {
                        if (this.vehicleTypeData[i].codeName == data.vehicleType)
                            this.vehicleInfo.vehicleType = this.vehicleTypeData[i].codeValue;
                    }
                    
                    //车牌号长度大于7默认是绿牌车
                    if (this.plateNumber.length > 7)
                        this.vehicleInfo.licensePlateColor = '3';
                }
            } catch(e){}
            this.$nextTick(() =>
            {
                this.$nextTick(()=>{
                    this.common.shade.hide();
                })
            });

        },
        delCallbackVehicleLicenseFront()
        {
            this.vehicleInfo.vehicleLicenseFrontImg = '';
            this.vehicleInfo.vehicleLicenseFrontImgPath = '';
        },
        /**
         * 行驶证副页
         * @param imgData
         */
        async successCallbackVehicleLicenseBack(imgData)
        {
            this.vehicleInfo.vehicleLicenseBackImg = imgData.flowId;
            this.vehicleInfo.vehicleLicenseBackImgPath = imgData.storePath;
            let data = await this.common.postUrl("resVehicleInfoTF", 'getVehicleLicenseInfoBack', {fileId: imgData.storePath});
            if (data)
            {
                this.vehicleInfo.fileNumber = data.euid;
                if (this.common.isNotBlank(data.tractionMass))
                {
                    if (data.tractionMass.indexOf("kg") > 0)
                    {
                        this.vehicleInfo.tractionMass = parseInt(data.tractionMass.substring(0, data.tractionMass.indexOf("kg")));
                    }
                }
                //outSideSize:"7975X2550X3950mm"  vehicleLength
                if (this.common.isNotBlank(data.fuelType))
                {
                    for (let i = 0; i < this.vehicleEnergyTypeData.length; i++)
                    {
                        let staticData = this.vehicleEnergyTypeData[i];
                        if (staticData.codeName == data.fuelType)
                            this.vehicleInfo.energyType = staticData.codeValue;
                    }
                }
                if (this.common.isNotBlank(data.approvedLoadingQuality))
                    this.vehicleInfo.loadWeight = parseInt(data.approvedLoadingQuality);
                if (this.common.isNotBlank(data.totalMass))
                {
                    this.vehicleInfo.totalWeight = parseInt(data.totalMass);
                    //根据黄牌的要求，只要车长超过6米、总质量在4.5吨（含）以上的货车或乘座人数20人（含）以上均要悬挂此牌，因此即使是轿车，只要车长超过范畴，也要上黄牌。 一般情况下，黄牌车需要办理营运证；而蓝牌车则无需办理营运证。
                    if (this.vehicleInfo.totalWeight >= 4500)
                        this.vehicleInfo.licensePlateColor = '1';
                }
                //车牌号长度大于7默认是绿牌车
                if (data.plateNumberBack.length > 7)
                    this.vehicleInfo.licensePlateColor = '3';
            }
        },
        delCallbackVehicleLicenseBack()
        {
            this.vehicleInfo.vehicleLicenseBackImg = '';
            this.vehicleInfo.vehicleLicenseBackImgPath = '';
        },
        /**
         * 道路运输证
         * @param imgData
         */
        async successCallbackRoadTransportCertificate(imgData)
        {
            this.vehicleInfo.roadTransportCertificateImg = imgData.flowId;
            this.vehicleInfo.roadTransportCertificateImgPath = imgData.storePath;
            let data = await this.common.postUrl("resVehicleInfoTF", 'getRoadTransportCertificate', {fileId: imgData.storePath});
            if (data)
            {
                this.vehicleInfo.roadTransportCertificate = data.roadTransportCertificate;
            }
        },
        delCallbackRoadTransportCertificate()
        {
            this.vehicleInfo.roadTransportCertificateImg = '';
            this.vehicleInfo.roadTransportCertificateImgPath = '';
        },
        /**
         * 车身照片
         * @param imgData
         */
        successCallbackRoadOperatingPermit(imgData)
        {
            this.vehicleInfo.roadOperatingPermitImg = imgData.flowId;
            this.vehicleInfo.roadOperatingPermitImgPath = imgData.storePath;
        },
        delCallbackRoadOperatingPermit()
        {
            this.vehicleInfo.roadOperatingPermitImg = '';
            this.vehicleInfo.roadOperatingPermitImgPath = '';
        },
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
        // 查看示例图片大图
        viewExampleImage(imageName, index)
        {
            // 设置示例图片列表
            this.viewerImages = [
                require('@/static/image/own_car_img_1.png'),
                require('@/static/image/own_car_img_2.png'),
                require('@/static/image/own_car_img_3.png'),
                require('@/static/image/own_car_img_6.png')
            ];
            this.currentImageIndex = index;
            this.$refs.viewer.show();
        },
    },
}
