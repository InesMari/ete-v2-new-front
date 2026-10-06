import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'ownVehicleManage',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "绑定挂车", "code": "trailerNumber", "width": "90", "type": "text"},
                {"name": "查看图片", "code": "", "width": "280", "type": "diy"},
                {"name": "所有人", "code": "vehicleOwner", "width": "180", "type": "text"},
                {"name": "运输类型", "code": "transportTypeName", "width": "90", "type": "text"},
                {"name": "能源类型", "code": "energyTypeName", "width": "90", "type": "text"},
                {"name": "行驶证车型", "code": "vehicleTypeName", "width": "120", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "90", "type": "text"},
                {"name": "车牌颜色", "code": "licensePlateColorName", "width": "60", "type": "text"},
                {"name": "核定载质量", "code": "loadWeight", "width": "100", "type": "text"},
                {"name": "准牵引总质量", "code": "tractionMass", "width": "100", "type": "text"},
                {"name": "总质量", "code": "totalWeight", "width": "100", "type": "text"},
                {"name": "车辆识别代号", "code": "vin", "width": "150", "type": "text"},
                {"name": "档案编号", "code": "fileNumber", "width": "150", "type": "text"},
                {"name": "发动机号", "code": "engineNumber", "width": "150", "type": "text"},
                {"name": "使用性质", "code": "useCharacterName", "width": "120", "type": "text"},
                {"name": "发证机关", "code": "issueUnit", "width": "200", "type": "text"},
                {"name": "发证日期", "code": "issueDate", "width": "120", "type": "text"},
                {"name": "注册日期", "code": "registerDate", "width": "120", "type": "text"},
                {"name": "道路运输证号", "code": "roadTransportCertificate", "width": "120", "type": "text"},
                {"name": "车辆销售方", "code": "vehicleSeller", "width": "150", "type": "text"},
                {"name": "购买日期", "code": "buyDate", "width": "120", "type": "text"},
                {"name": "购车年限(月)", "code": "buyMonths", "width": "120", "type": "text"},
                {"name": "购置价格", "code": "buyPrice", "width": "120", "type": "text"},
                {"name": "购置税", "code": "purchaseTax", "width": "120", "type": "text"},
                {"name": "品牌型号", "code": "brand", "width": "150", "type": "text"},
                {"name": "轮胎规格", "code": "tireSpecification", "width": "150", "type": "text"},
                {"name": "前轮个数", "code": "tiresNumber", "width": "150", "type": "text"},
                {"name": "后轮个数", "code": "rearWheelNumber", "width": "150", "type": "text"},
                {"name": "排量(L)", "code": "displacement", "width": "150", "type": "text"},
                {"name": "额定功率(kw)", "code": "ratedPower", "width": "150", "type": "text"},
                {"name": "变速箱类型", "code": "gearboxTypeName", "width": "150", "type": "text"},
                {"name": "购置来源", "code": "purchaseSourceName", "width": "150", "type": "text"},
                {"name": "车辆状态", "code": "stsName", "width": "100", "type": "diyColorTd"},
                {"name": "交强险", "code": "heavyTrafficInsurance", "width": "100", "type": "text"},
                {"name": "商业险", "code": "commercialInsurance", "width": "100", "type": "text"},
                {"name": "保险公司", "code": "insuranceCompany", "width": "100", "type": "text"},
                {"name": "车辆运作状态", "code": "runTypeName", "width": "100", "type": "text"},
                {"name": "定位时间", "code": "gpsTime", "width": "100", "type": "text"},
                {"name": "最新位置", "code": "location", "width": "100", "type": "text"},
                {"name": "定位设备类型", "code": "equipmentTypeName", "width": "100", "type": "text"},
                {"name": "设备型号", "code": "equipmentModelName", "width": "100", "type": "text"},
                {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                {"name": "所属公司", "code": "tenantName", "width": "180", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                
            ],
            query: {},
            runTypeData: [
                {"codeValue": 1, "codeName": "运作中"},
                {"codeValue": 2, "codeName": "空闲中"},
            ],
            showUpEquipment: false,//更新设备弹窗
            upEquipmentParam: this.initUpEquipmentParam(),
            equipmentTypeData: [],//设备类型
            equipmentModelDataAll: [],//设备型号 这里设备型号归属的设备类型用sys_static_data表中CODE_ID来区分
            equipmentModelData: [],
            vehicleTypeData: [],
            vehicleLengthTypeData: [],
            transportTypeData: [],
            energyTypeData: [],//能源类型
            stsData: [],
            srcList: [],
            uploadOpen: false,
            impParam:{isOwn: 1},
        }
    },
    mounted()
    {
        this.initStaticData();
        this.doQuery();
    },
    components: {
        myImport,
        myFileModel,
        fileViewer,
        tableCommon,
        searchList
    },
    methods: {
        /**
         * 查询列表
         * query  空值时，默认为页面配置参this.query，传值时为传值参
         */
        async doQuery(query = this.query)
        {
            this.query = query;
            if (this.common.isNotBlank(this.query.daterange) && this.query.daterange.length == 2)
            {
                this.query.stratDate = this.query.daterange[0];
                this.query.endDate = this.query.daterange[1];
            }
            else
            {
                this.query.stratDate = '';
                this.query.endDate = '';
            }
            this.query.vehicleAttributionFlag = 2;
            let {items} = await this.$refs.table.load("resVehicleInfoTF", "queryOwnVehicleInfoListByCond", this.query);
            items.forEach((el) => {
                if (el.sts == 0) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        async handleSuccess()
        {
            this.uploadOpen = false;
            this.doQuery();
        },
        initUpEquipmentParam()
        {
            return this.upEquipmentParam = {
                vehicleId: '',
                plateNumber: '',
                equipmentType: '',
                equipmentModel: '',
                equipmentNumber: '',
            }
        },
        async initStaticData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'VEHICLE_TYPE,VEHICLE_LENGTH,STS,EQUIPMENT_TYPE,EQUIPMENT_MODEL,TRANSPORT_TYPE,VEHICLE_ENERGY_TYPE'});
            this.vehicleTypeData = data.VEHICLE_TYPE;
            this.vehicleLengthTypeData = data.VEHICLE_LENGTH;
            this.stsData = data.STS;
            this.equipmentTypeData = data.EQUIPMENT_TYPE;//设备类型
            this.equipmentModelDataAll = data.EQUIPMENT_MODEL;//设备型号
            this.transportTypeData = data.TRANSPORT_TYPE;//运输类型
            this.energyTypeData = data.VEHICLE_ENERGY_TYPE;//能源类型
            this.$forceUpdate();
        },
        toShowUpEquipment(flag)
        {
            this.initUpEquipmentParam();
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1)
                {
                    this.$message.error("请选择一台车辆数据！");
                    return;
                }
                this.upEquipmentParam.vehicleId = selectData[0].vehicleId;
                this.upEquipmentParam.plateNumber = selectData[0].plateNumber;
                if (this.common.isNotBlank(selectData[0].equipmentNumber))
                {
                    this.upEquipmentParam.equipmentType = selectData[0].equipmentType + "";
                    this.upEquipmentParam.equipmentNumber = selectData[0].equipmentNumber;
                    this.changeEquipmentTypeSelect(false);
                    this.upEquipmentParam.equipmentModel = selectData[0].equipmentModel + "";
                }
                else
                {
                    flag = false;
                    this.$message.warning("该车辆没有绑定设备,无法更换！");
                }
            }
            else
                this.upEquipmentParam = {};
            this.showUpEquipment = flag;
            this.$forceUpdate();
        },
        changeEquipmentTypeSelect(isQueryVehicleEquipment)
        {
            this.equipmentModelData = [];
            for (let i = 0; i < this.equipmentModelDataAll.length; i++)
            {
                if (this.upEquipmentParam.equipmentType == this.equipmentModelDataAll[i].codeId)
                    this.equipmentModelData.push(this.equipmentModelDataAll[i]);
            }
            if (isQueryVehicleEquipment) this.queryVehicleEquipment();
        },
        async queryVehicleEquipment()
        {
            let data = await this.common.postUrl("equipmentTF", "queryVehicleEquipment", this.upEquipmentParam);
            if (this.common.isNotBlank(data.equipmentNumber))
            {
                this.upEquipmentParam.equipmentId = data.id;
                this.upEquipmentParam.equipmentNumber = data.equipmentNumber;
            }
            else
            {
                this.upEquipmentParam.equipmentId = "";
                this.upEquipmentParam.equipmentNumber = "";
                this.$message.error("该车辆没有绑定设备！");
            }
            this.$forceUpdate();
        },
        /**
         * 0 查看 1 增加 2 修改
         * @param type
         * @returns {boolean}
         */
        openPage(type, data)
        {
            let param = {};
            let title = "";
            let urlPath = "/pt/res/ownVehicle/ownVehicleInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增自有车车辆";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的车辆！");
                    return false;
                }
                data = selectData[0];
                param.time = data.vehicleId;
                param.vehicleId = data.vehicleId;
                title = "修改自有车车辆";
            }
            else if(type == 0)
            {
                param.time = data.vehicleId + "detail";
                param.vehicleId = data.vehicleId;
                title = "查看自有车车辆";
                urlPath = "/pt/res/ownVehicle/ownVehicleInfoMain.vue";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'ownVehicleVehicle' + param.time,
                query: {vehicleId: param.vehicleId, type,
                    logId: param.vehicleId,
                    logType: enumData.LOG_TYPE.VEHICLE,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath});
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        async updateState()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一台车辆");
                return false;
            }
            let vehicleIds = '';
            let plateNumber = '';
            for (let i = 0; i < array.length; i++)
            {
                vehicleIds += ',' + array[i].vehicleId;
                plateNumber += ',' + array[i].plateNumber;
            }
            vehicleIds = vehicleIds.substr(1);
            plateNumber = plateNumber.substr(1);
            let state = array[0].sts == 1 ? 0 : 1;
            let info = array[0].sts == 1 ? '禁用' : '启用';
            await this.common.postUrl("resVehicleInfoTF", 'updateVehicleState', {vehicleIds, state, plateNumber}, null, null, '', true);
            await this.doQuery();
            this.$message.success(info + "成功！");
        },
        /**
         * 显示照片-行驶证
         * @param data
         */ async showVehicleLicenseImg(data)
        {
            if (!data.vehicleLicenseFrontImgPath && !data.vehicleLicenseBackImgPath) {
                // this.$message.error("没有图片~");
                return;
            }
            let flowId = [data.vehicleLicenseFrontImgPath, data.vehicleLicenseBackImgPath];
            let fileList = await this.common.getFileFullPath(flowId, true);
            this.srcList = [];
            this.srcList.push(...fileList);
            this.$refs.viewer.show();
        },
        /**
         * 显示照片-道路运输证
         * @param data
         */
        async showRoadTransportCertificateImg(data) {
            if (!data.roadTransportCertificateImgPath) {
                // this.$message.error("没有图片~");
                return;
            }
            let fileList = await this.common.getFileFullPath([data.roadTransportCertificateImgPath], true);
            this.srcList = [];
            this.srcList.push(...fileList);
            this.$refs.viewer.show();
        },
        /**
         * 显示照片-车身
         * @param data
         */
        async showCarBody(data) {
            if (!data.carBodyImgPath) {
                // this.$message.error("没有图片~");
                return;
            }
            let fileList = await this.common.getFileFullPath([data.carBodyImgPath], true);
            this.srcList = [];
            this.srcList.push(...fileList);
            this.$refs.viewer.show();
        },
        async saveVehicleEquipment()
        {
            if (this.common.isBlank(this.upEquipmentParam.vehicleId))
            {
                this.$message.error("请选择需要更换绑定设备的车辆！");
                return;
            }
            if (this.common.isBlank(this.upEquipmentParam.equipmentId))
            {
                this.$message.error("请选择车辆需要更换绑定的设备！");
                return;
            }
            let data = await this.common.postUrl("equipmentTF", "saveVehicleEquipment", this.upEquipmentParam, null, null, '', true);
            this.toShowUpEquipment(false);
            if (this.common.isNotBlank(data))
            {
                await this.doQuery();
                this.$message.success("更换成功！");
            }
        },
        download(){
            this.$refs.table.downloadExcelFile('自有车车辆');
        },
        // 车辆档案
        toVehicleRecord(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一个车辆！");
                return false;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'ownVehicleRecord' + data.vehicleId,
                query: {
                    vehicleId: data.vehicleId,
                },
                urlName: "车辆档案卡",
                urlPathName: "/res",
                urlPath: "/pt/res/ownVehicle/ownVehicleRecord.vue"});
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "车牌号码", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "所有人", "model": "vehicleOwner", "type": "input", "isshow": true},
                {"name": "车辆状态", "model": "sts", "type": "select", "options": this.stsData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "运输类型", "model": "transportType", "type": "select", "options": this.transportTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "车辆运作状态", "model": "runType", "type": "select", "options": this.runTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "定位日期", "model": "daterange", "type": "daterange", "isshow": true, "row": 2},
                {"name": "最新位置", "model": "location", "type": "input", "isshow": true},
                {"name": "行驶证车型", "model": "vehicleType", "type": "select", "options": this.vehicleTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "车长", "model": "vehicleLength", "type": "select", "options": this.vehicleLengthTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "能源类型", "model": "energyType", "type": "select", "options": this.energyTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "绑定挂车", "model": "trailerNumber", "type": "input", "isshow": true},
            ]
        }
    },
}
