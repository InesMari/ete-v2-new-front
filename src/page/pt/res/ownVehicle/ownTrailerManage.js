import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'ownVehicleTrailerManage',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "绑定车头", "code": "frontPlateNumber", "width": "90", "type": "text"},
                {"name": "查看图片", "code": "", "width": "280", "type": "diy"},
                {"name": "车辆识别代号", "code": "vin", "width": "150", "type": "text"},
                {"name": "品牌型号", "code": "brand", "width": "150", "type": "text"},
                {"name": "使用性质", "code": "useCharacterName", "width": "120", "type": "text"},
                {"name": "行驶证车型", "code": "vehicleTypeName", "width": "120", "type": "text"},
                {"name": "发证机关", "code": "issueUnit", "width": "200", "type": "text"},
                {"name": "注册日期", "code": "registerDate", "width": "120", "type": "text"},
                {"name": "发证日期", "code": "issueDate", "width": "120", "type": "text"},
                {"name": "所有人", "code": "vehicleOwner", "width": "180", "type": "text"},
                {"name": "档案编号", "code": "fileNumber", "width": "150", "type": "text"},
                {"name": "核定载质量", "code": "loadWeight", "width": "100", "type": "text"},
                {"name": "总质量", "code": "totalWeight", "width": "100", "type": "text"},
                {"name": "车牌颜色", "code": "licensePlateColorName", "width": "60", "type": "text"},
                {"name": "车厢重量", "code": "carriageWeight", "width": "100", "type": "text"},
                {"name": "轴数", "code": "axleCount", "width": "100", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "90", "type": "text"},
                {"name": "车厢类型", "code": "carriageTypeName", "width": "150", "type": "text"},
                {"name": "轮胎规格", "code": "tireSpecification", "width": "150", "type": "text"},
                {"name": "前轮个数", "code": "tiresNumber", "width": "150", "type": "text"},
                {"name": "后轮个数", "code": "rearWheelNumber", "width": "150", "type": "text"},
                {"name": "车桥", "code": "axleName", "width": "90", "type": "text"},
                {"name": "内长(m)", "code": "length", "width": "150", "type": "text"},
                {"name": "内宽(m)", "code": "width", "width": "150", "type": "text"},
                {"name": "内高(m)", "code": "height", "width": "150", "type": "text"},
                {"name": "购置来源", "code": "purchaseSourceName", "width": "150", "type": "text"},
                {"name": "购买日期", "code": "buyDate", "width": "120", "type": "text"},
                {"name": "车厢购买日期", "code": "carriageBuyDate", "width": "120", "type": "text"},
                {"name": "购车年限(月)", "code": "buyMonths", "width": "120", "type": "text"},
                {"name": "车辆销售方", "code": "vehicleSeller", "width": "150", "type": "text"},
                {"name": "购置价格", "code": "buyPrice", "width": "120", "type": "text"},
                {"name": "购置税", "code": "purchaseTax", "width": "120", "type": "text"},
                {"name": "所属公司", "code": "tenantName", "width": "180", "type": "text"},
                // {"name": "车辆状态", "code": "stsName", "width": "180", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                
            ],
            query: {},
            
            vehicleTypeData: [],
            vehicleLengthTypeData: [],
            transportTypeData: [],
            srcList: [],
            stsData: [],
            uploadOpen: false,
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
            this.query.vehicleAttributionFlag = 2;
            this.query.isTrailer = 1;
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
        async initStaticData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'VEHICLE_TYPE,VEHICLE_LENGTH,STS,EQUIPMENT_TYPE,EQUIPMENT_MODEL,TRANSPORT_TYPE,VEHICLE_ENERGY_TYPE'});
            this.vehicleTypeData = data.VEHICLE_TYPE;
            this.vehicleLengthTypeData = data.VEHICLE_LENGTH;
            this.equipmentTypeData = data.EQUIPMENT_TYPE;//设备类型
            this.equipmentModelDataAll = data.EQUIPMENT_MODEL;//设备型号
            this.transportTypeData = data.TRANSPORT_TYPE;//运输类型
            this.energyTypeData = data.VEHICLE_ENERGY_TYPE;//能源类型
            this.stsData = data.STS;//
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
            let urlPath = "/pt/res/ownVehicle/ownTrailerInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增自有车挂车";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的挂车！");
                    return false;
                }
                data = selectData[0];
                param.time = data.vehicleId;
                param.vehicleId = data.vehicleId;
                title = "修改自有车挂车";
            }
            else if(type == 0)
            {
                param.time = data.vehicleId + "detail";
                param.vehicleId = data.vehicleId;
                title = "查看自有车挂车";
                urlPath = "/pt/res/ownVehicle/ownTrailerInfoMain.vue";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'ownTrailerInfo' + param.time,
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
        
        download(){
            this.$refs.table.downloadExcelFile('自有车车辆');
        },
        openInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一个挂车！");
                return false;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'ownTrailerRecord' + data.vehicleId,
                query: {
                    vehicleId: data.vehicleId,
                },
                urlName: "挂车档案卡",
                urlPathName: "/res",
                urlPath: "/pt/res/ownVehicle/ownTrailerRecord.vue"});
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
    },
    computed: {
        formData()
        {
            return [
                {"name": "车牌号码", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "绑定车头", "model": "frontPlateNumber", "type": "input", "isshow": true},
                {"name": "所有人", "model": "vehicleOwner", "type": "input", "isshow": true},
                {"name": "行驶证车型", "model": "vehicleType", "type": "select", "options": this.vehicleTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "车长", "model": "vehicleLength", "type": "select", "options": this.vehicleLengthTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "车辆状态", "model": "sts", "type": "select", "options": this.stsData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
            ]
        }
    },
}
