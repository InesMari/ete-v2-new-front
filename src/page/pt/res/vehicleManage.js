import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'vehicleManage',
    data() {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "查看图片", "code": "", "width": "280", "type": "diy"},
                {"name": "车辆所有人", "code": "vehicleOwner", "width": "250", "type": "text"},
                {"name": "行驶证车型", "code": "vehicleTypeName", "width": "120", "type": "text"},
                {"name": "报价车型", "code": "vehicleTypeQuoteName", "width": "120", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "车牌颜色", "code": "licensePlateColorName", "width": "90", "type": "text"},
                {"name": "核定载质量", "code": "loadWeight", "width": "100", "type": "text"},
                {"name": "总质量", "code": "totalWeight", "width": "100", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "车辆状态", "code": "stsName", "width": "100", "type": "diyColorTd"},
                {"name": "车辆运作状态", "code": "runTypeName", "width": "100", "type": "text"},
                {"name": "定位时间", "code": "gpsTime", "width": "100", "type": "text"},
                {"name": "最新位置", "code": "location", "width": "100", "type": "text"},
                {"name": "定位设备类型", "code": "equipmentTypeName", "width": "100", "type": "text"},
                {"name": "设备型号", "code": "equipmentModelName", "width": "100", "type": "text"},
                {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                {"name": "资质审核", "code": "authStateInternalName", "width": "100", "type": "text"},
                {"name": "资质审核备注", "code": "authRemarkInternal", "width": "100", "type": "text"},
            ],
            query: {
                plateNumber: '',
                internalAudit: '',
                sts: '',
                tenantId: this.$route.query.supplierId ? parseInt(this.$route.query.supplierId) : null,
            },
            runTypeData: [
                {"codeValue":1,"codeName":"运作中"},
                {"codeValue":2,"codeName":"空闲中"},
            ],
            //运作状态
            showUpEquipment: false,
            upEquipmentParam: {},
            equipmentTypeData: [],//设备类型
            equipmentModelData: [],//设备型号 这里设备型号归属的设备类型用sys_static_data表中CODE_ID来区分
            equipmentModelData_: [],
            dic_vehicle_type_quote: [],
            dic_vehicle_length_type: [],
            dic_biz_audit_state: [],
            dic_sts: [],
            srcList: [],
            supplierData: [],
            equipmentData: [],
            showSync: false,
            plateNumber:null,
            uploadOpen: false,
            impParam:{},
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        myImport,
        myFileModel,
        fileViewer,
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         *
         * query  空值时，默认为页面配置参this.query，传值时为传值参
         */
        async doQuery(query = this.query) {
            this.uploadOpen=false;
            this.query = query;
            if (this.common.isNotBlank(this.query.daterange) && this.query.daterange.length == 2) {
                this.query.startDate = this.query.daterange[0];
                this.query.endDate = this.query.daterange[1];
            } else {
                this.query.startDate = '';
                this.query.endDate = '';
            }
            let {items} = await this.$refs.table.load("resVehicleInfoTF", "queryVehicleInfoListByCond", this.query);
            items.forEach((el) => {
                if (el.sts == 0) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        /**
         * 初始化数据
         */
        async initData() {
            //加载静态枚举
            let codeTypes = 'VEHICLE_TYPE_QUOTE,VEHICLE_LENGTH,' +
                            'BIZ_AUDIT_STATE,STS,EQUIPMENT_TYPE,EQUIPMENT_MODEL';
            let data = await this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType': codeTypes});
            this.dic_vehicle_type_quote = data.VEHICLE_TYPE_QUOTE;
            this.dic_vehicle_length_type = data.VEHICLE_LENGTH;
            this.dic_biz_audit_state = data.BIZ_AUDIT_STATE;
            this.dic_sts = data.STS;
            this.equipmentTypeData = data.EQUIPMENT_TYPE;//设备类型
            this.equipmentModelData = data.EQUIPMENT_MODEL;//设备型号
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
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
            let urlPath = "/pt/res/vehicle/vehicleInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增车辆";
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
                title = "修改车辆";
            }
            else if(type == 3)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要审核的车辆！");
                    return false;
                }
                data = selectData[0];
                param.time = data.vehicleId + "verify";
                param.vehicleId = data.vehicleId;
                title = "审核车辆";
                if(data.authStateInternal == 1){
                    this.$message.error("该数据已是资质审核通过状态！");
                    return false;
                }
            }
            else if(type == 0)
            {
                param.time = data.vehicleId + "detail";
                param.vehicleId = data.vehicleId;
                title = "查看车辆";
                urlPath = "/pt/res/vehicle/vehicleInfoMain.vue";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'vehicle' + param.time,
                query: {
                    vehicleId: param.vehicleId,
                    type,
                    logId: param.vehicleId,
                    logType: enumData.LOG_TYPE.VEHICLE,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath
            });
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        
        updateState() {
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条数据");
                return false;
            }
            let vehicleIds = '';
            let plateNumber = '';
            for (let i = 0; i < array.length; i++) {
                vehicleIds += ',' + array[i].vehicleId;
                plateNumber += ',' + array[i].plateNumber;
            }
            vehicleIds = vehicleIds.substr(1);
            plateNumber = plateNumber.substr(1);
            let state = array[0].sts == 1 ? 0 : 1;
            let info = '';
            if (array[0].sts == 1) {
                info = '禁用';
            } else if (array[0].sts == 0) {
                info = '启用';
            }
            this.common.postUrl("resVehicleInfoTF", 'updateVehicleState', {vehicleIds, state,plateNumber}, function (data) {
                if (data) {
                    that.doQuery();
                    that.$message.success(info + "成功！");
                }
            },null,'',true);
        },
        forceInput() {
            this.$forceUpdate();//强制刷新视图，每一个无法输入的input框都需要使用该方法
        },

        /** 更换车辆定位设备弹窗 */
        toShowUpEquipment(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据！");
                    return;
                }
                this.upEquipmentParam.vehicleId = selectData[0].vehicleId;
                this.upEquipmentParam.plateNumber = selectData[0].plateNumber;
                if (this.common.isNotBlank(selectData[0].equipmentNumber)) {
                    this.upEquipmentParam.equipmentType = selectData[0].equipmentType + "";
                    this.upEquipmentParam.equipmentNumber = selectData[0].equipmentNumber;
                    this.upEquipmentParam.equipmentId = selectData[0].equipmentId;
                    this.equipmentModelData_ = [];
                    for (let i = 0; i < this.equipmentModelData.length; i++) {
                        if (this.upEquipmentParam.equipmentType == this.equipmentModelData[i].codeId) {
                            this.equipmentModelData_.push(this.equipmentModelData[i]);
                        }
                    }
                    this.upEquipmentParam.equipmentModel = selectData[0].equipmentModel + "";
                    this.changeEquipmentTypeSelect();
                } else {
                    //this.upEquipmentParam.equipmentType = this.equipmentTypeData[0].codeValue;
                    //this.changeEquipmentTypeSelect();
                }
                this.showUpEquipment = true;
            } else {
                this.upEquipmentParam = {};
                this.showUpEquipment = false;
            }
        },
        /** 选中设备类型事件 */
        changeEquipmentTypeSelect() {
            this.equipmentModelData_ = [];
            for (let i = 0; i < this.equipmentModelData.length; i++) {
                if (this.upEquipmentParam.equipmentType == this.equipmentModelData[i].codeId) {
                    this.equipmentModelData_.push(this.equipmentModelData[i]);
                }
            }
            this.upEquipmentParam.equipmentModel = this.equipmentModelData_[0].codeValue;
            this.queryVehicleEquipment();
        },
        /** 查询车辆对应类型、型号设备 */
        queryVehicleEquipment() {
            let that = this;
            if (this.upEquipmentParam.equipmentType > 0)
            {
                if (that.upEquipmentParam.equipmentType == 8)
                {
                    this.common.postUrl("equipmentTF", "getGpsEquipmentList", this.upEquipmentParam, function (data) {
                        that.equipmentData = data;
                        that.forceInput();
                    });
                }
                else
                {
                    this.common.postUrl("equipmentTF", "queryVehicleEquipment", this.upEquipmentParam, function (data) {
                        if (that.common.isNotBlank(data.equipmentNumber)) {
                            that.upEquipmentParam.equipmentId = data.id;
                            that.upEquipmentParam.equipmentNumber = data.equipmentNumber;
                        } else {
                            that.upEquipmentParam.equipmentId = "";
                            that.upEquipmentParam.equipmentNumber = "";
                        }
                        that.forceInput();
                    });
                }
            }
        },
        /** 保存车辆定位设备 */
        saveVehicleEquipment() {
            let selectData = this.$refs.table.getSelectItem();
            if (this.upEquipmentParam.equipmentType != 8)
            {
                if (this.upEquipmentParam.equipmentNumber == selectData[0].equipmentNumber) {
                    this.$message.error("请选择需要重新绑定的设备！");
                    return;
                }
            }
            if (this.common.isBlank(this.upEquipmentParam.equipmentId)) {
                this.$message.error("请选择需要绑定的设备！");
                return;
            }
            if (this.common.isBlank(this.upEquipmentParam.vehicleId)) {
                this.$message.error("请选择车辆！");
                return;
            }
            let that = this;
            this.common.postUrl("equipmentTF", "saveVehicleEquipment", this.upEquipmentParam, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.$message.success("更换成功！");
                    that.toShowUpEquipment(false);
                    that.doQuery();
                }
            },null,'',true);
        },


        /**
         * 显示照片-行驶证
         * @param data
         */ async showVehicleLicenseImg(data) {
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
         */ async showRoadTransportCertificateImg(data) {
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
         * 显示照片-道路运输经营许可证
         * @param data
         */ async showRoadOperatingPermitImg(data) {
            if (!data.roadOperatingPermitImgPath) {
                // this.$message.error("没有图片~");
                return;
            }
            let fileList = await this.common.getFileFullPath([data.roadOperatingPermitImgPath], true);
            this.srcList = [];
            this.srcList.push(...fileList);
            this.$refs.viewer.show();
        },
        
        openSync(flag){
            this.showSync = flag;
            this.plateNumber = '';
            this.$forceUpdate();
        },
        syncVehicleInfo(){
            let that = this;
            this.common.postUrl("resVehicleInfoTF", 'syncVehicleInfo', {plateNumber:this.plateNumber}, function (data)
            {
                if (data)
                {
                    that.$message.success("同步成功！");
                    that.openSync(false);
                    that.doQuery();
                }
            }, null, '', true);
        },
    },
    computed:{
      formData(){  
            return [
            {"name":"车牌号码","model":"plateNumber","type":"input","isshow":true},
            {"name":"供应商","model":"tenantId","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
            {"name":"车辆所有人","model":"vehicleOwner","type":"input","isshow":true},
            {"name":"车辆状态","model":"sts","type":"select","options":this.dic_sts,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            {"name":"资质审核状态","model":"internalAudit","type":"select","options":this.dic_biz_audit_state,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            {"name":"车辆运作状态","model":"runType","type":"select","options":this.runTypeData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            {"name":"定位日期","model":"daterange","type":"daterange","isshow":true,"row":2},
            {"name":"最新位置","model":"location","type":"input","isshow":true},
            {"name":"报价车型","model":"vehicleTypeQuote","type":"select","options":this.dic_vehicle_type_quote,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            {"name":"车长","model":"vehicleLength","type":"select","options":this.dic_vehicle_length_type,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
