import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum.js";
import innerTab from "@/components/innerTab/innerTab.vue"
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import searchList from "@/components/searchList/searchList.vue";
import {MessageBox} from "element-ui";
// import BMap from 'BMap'

export default {
    name: 'equipmentInfoManage',
    data() {
        return {
            allHead:[
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "供应商", "code": "tenantName", "width": "110", "type": "text"},
                    {"name": "设备开始使用日期", "code": "equipmentStartTime", "width": "150", "type": "text"},
                    {"name": "设备到期日期", "code": "equipmentEndTime", "width": "150", "type": "text"},
                    {"name": "是否到期", "code": "isExpireName", "width": "60", "type": "text"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "SIM卡号", "code": "equipmentSimCard", "width": "110", "type": "text"},
                    {"name": "SIM卡到期日期", "code": "simExpirationTime", "width": "100", "type": "text"},
                    {"name": "是否到期", "code": "cardIsExpireName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "270", "type": "diy"},
                    {"name": "供应商", "code": "tenantName", "width": "110", "type": "text"},
                    {"name": "设备开始使用日期", "code": "equipmentStartTime", "width": "150", "type": "text"},
                    {"name": "设备到期日期", "code": "equipmentEndTime", "width": "150", "type": "text"},
                    {"name": "是否到期", "code": "isExpireName", "width": "60", "type": "text"},
                    {"name": "锁状态", "code": "lockStateName", "width": "60", "type": "text"},
                    {"name": "电量%", "code": "batteryLevel", "width": "60", "type": "text"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "SIM卡号", "code": "equipmentSimCard", "width": "110", "type": "text"},
                    {"name": "SIM卡到期日期", "code": "simExpirationTime", "width": "100", "type": "text"},
                    {"name": "是否到期", "code": "cardIsExpireName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
                [
                    {"name": "设备编号", "code": "equipmentNumber", "width": "120", "type": "text"},
                    {"name": "操作", "code": "", "width": "150", "type": "diy"},
                    {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                    {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                    {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                    {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                    {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                    {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                    {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                ],
            ],
            head: [
            ],
            bandHead: [
                {"name": "供应商", "code": "tenantName", "width": "110", "type": "text"},
                {"name": "设备型号", "code": "equipmentModelName", "width": "80", "type": "text"},
                {"name": "设备类型", "code": "equipmentTypeName", "width": "80", "type": "text"},
                {"name": "设备编号", "code": "equipmentNumber", "width": "110", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "blurFn": "blurBack","width": "110", "type": "input"},
                {"name": "操作和提示", "code": "title", "width": "170", "type": "diy"}
            ],
            logHead:[
                {"name": "操作类型", "code": "lockStateName", "width": "80", "type": "text"},
                {"name": "操作时间", "code": "uploadDate", "width": "100", "type": "text"},
                {"name": "操作地点", "code": "location", "width": "200", "type": "text"},
            ],
            loadParam: {},//列表查询参数
            bandParam: {isBand:1},//绑定设备列表入参
            sellParam: {},//销售设备列表入参
            impParam: {},//导入入参
            equipmentInfo: {equipmentModel:''},//设备信息
            sellTenantId: "",//销售设备供应商编号
            sinoiovPlateNumber: "",//部标机查询车牌号
            addressStr:'',//部标机查询地址

            equipmentModelData: [],//设备型号 这里设备型号归属的设备类型用sys_static_data表中CODE_ID来区分
            equipmentModelData_: [],
            equipmentTypeData: [],//设备类型
            equipmentTypeData_: [],
            equipmentExpireTimeData: [],//设备到期时间
            runTypeData: [
                {"codeValue":1,"codeName":"运作中"},
                {"codeValue":2,"codeName":"空闲中"},
            ],//运作状态
            tableData: [],//设备
            bandTableData: [],//绑定设备列表
            sellQuipmentData: [],//销售设备列表
            tenantData: [],//供应商
            vehicleData: [],//车辆下拉数据
            sinoiovVclResult: '',//中交兴路车辆查询结果
            showModify: false,//修改设备
            isLook: false,//查看禁用设备
            isMarking: false,//是否中交兴路(巴蜀) 中交兴路(巴蜀)设备号后台自动生成，无需输入
            isAdd: false,//是否新增设备
            isUpdate: false,//是否修改设备
            showBandEquipment: false,//绑定设备
            showSellEquipment: false,//销售设备
            showSinoiovQuery: false,//部标机查询
            title: "新增设备",
            uploadOpen : false,
            uploadOpenTime : false,
            equipmentFocus:false,    //设备号是否获取焦点
            showRFID:false,//RFID卡授权
            rfidInfo:{},
            rfidDatas:[],
            pickerOptions: {//禁用小于当前时间日期
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                },
            },
            pickerOptions_: {//禁用小于开始时间日期
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                },
            },
            baseTabs: [
                {
                    name: "定位器",
                    equipmentType:1,
                    entityId:'1002038',
                },
                {
                    name: "部标机",
                    equipmentType:2,
                    entityId:'1002039',
                },
                {
                    name: "电子锁",
                    equipmentType:3,
                    entityId:'1002040',
                },
                {
                    name: "巴蜀",
                    equipmentType:4,
                    entityId:'1002041',
                },
                {
                    name: "凯成",
                    equipmentType:5,
                    entityId:'1002042',
                },
                {
                    name: "意诚源",
                    equipmentType:6,
                    entityId:'1002097',
                },
                {
                    name: "江岑",
                    equipmentType:7,
                    entityId:'1002157',
                },
                {
                    name: "G7",
                    equipmentType:8,
                    entityId:'1002208',
                },
                {
                    name: "交通809",
                    equipmentType:9,
                    entityId:'1002209',
                },
                {
                    name: "一汽陆顺",
                    equipmentType:10,
                    entityId:'1002232',
                },
                {
                    name: "赛格",
                    equipmentType:11,
                    entityId:'1002238',
                },
            ],
            tabs:[
            ],
            equipmentType:-1,
            componentName:'notFindPage',

            loading: true,
            showSetLockIp: false,//设置锁IP窗口
            lockTitle: "",
            lock: this.initLockSet(),
            isshowLock:false,
            subLocks:[],
            title2: "部标机查询",
            isLockPlateNumber:false,
        }
    },
    /**
     * 初始化
     */
    async mounted() {
        await this.init();
        this.initTabs();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myImport,
        notFindPage,
        innerTab,
        searchList,
        scrollTable
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 列表查询
         * @returns {Promise<void>}
         */
        async doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.daterange) && this.loadParam.daterange.length==2){
                this.loadParam.stratDate = this.loadParam.daterange[0];
                this.loadParam.endDate = this.loadParam.daterange[1];
            }else{
                this.loadParam.stratDate = '';
                this.loadParam.endDate = '';
            }
            this.tableData = await this.$refs.table.load("equipmentTF", "queryEquipmentData", this.loadParam);
            for (let i = 0; i < this.tableData.items.length; i++) {
                this.tableData.items[i].logShow = false;
            }
        },
        show(item){
            let flag = item.logShow;
            for (let i = 0; i < this.tableData.items.length; i++) {
                this.tableData.items[i].logShow = false;
            }
            // this.$refs.table.resetData(this.tableData.items);
            item.logShow = !flag;
            setTimeout(()=>{
                this.$refs['logTable'+item.id].load("equipmentTF", "queryLockLog", item);
            },0);
            this.$forceUpdate();
        },
        unShow(){
            for (let i = 0; i < this.tableData.items.length; i++) {
                this.tableData.items[i].logShow = false;
            }
            // this.$refs.table.resetData(this.tableData.items);
            this.$forceUpdate();
        },
        async init() {
            let that = this;
            //设备型号
            await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"EQUIPMENT_MODEL"}, function (data) {
                that.equipmentModelData = data;
                that.equipmentModelData_ = that.common.copyObj(data);
            });
            //设备类型
            await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"EQUIPMENT_TYPE"}, function (data) {
                that.equipmentTypeData = data;
                that.equipmentTypeData_ = that.common.copyObj(data);
            });
            //设备到期时间
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EQUIPMENT_EXPIRE_TIME"}, function (data) {
                that.equipmentExpireTimeData = data;
            });
            //所有车辆
            this.common.postUrl("resVehicleInfoTF", "queryAllVehicleNoPage", {}, function (data) {
                that.vehicleData = data;
            });
        },
        /**
         * 清空查询条件
         */
        clear() {
            this.loadParam = {};
        },
        /** 选中设备型号自动带出设备类型 */
        changeModelSelect() {
            this.isMarking = false;
            this.equipmentInfo.equipmentType = '';
            for (let i = 0; i < this.equipmentModelData.length; i++) {
                if (this.equipmentInfo.equipmentModel == this.equipmentModelData[i].codeValue) {
                    for (let j = 0; j < this.equipmentTypeData.length; j++) {
                        if (this.equipmentModelData[i].codeId == this.equipmentTypeData[j].codeValue) {
                            this.equipmentInfo.equipmentType = this.equipmentTypeData[j].codeValue;
                            if(this.equipmentInfo.equipmentType==enumData.equipmentType.marking
                                || this.equipmentInfo.equipmentType==enumData.equipmentType.bs){
                                this.isMarking = true;
                            }else{
                                this.isMarking = false;
                            }
                            break;
                        }
                    }
                }
            }
        },
        initEquipmentTypeData(){
            this.isMarking = false;
            this.equipmentModelData_=[];
            this.equipmentInfo.equipmentType = this.equipmentType+'';
            this.bandParam.equipmentType = this.equipmentType+'';
            // if (this.equipmentInfo.equipmentType == '7')
            // {
            //     this.equipmentInfo.equipmentType = '10';
            // }
            // if (this.bandParam.equipmentType == '7')
            // {
            //     this.bandParam.equipmentType = '10';
            // }
            if(this.equipmentType==enumData.equipmentType.marking){
                this.isMarking = true;
            }
            for (let i = 0; i < this.equipmentModelData.length; i++) {
                if (this.equipmentModelData[i].codeId == this.equipmentInfo.equipmentType) {
                    this.equipmentModelData_.push(this.equipmentModelData[i]);
                }
            }
            this.equipmentInfo.equipmentModel = this.equipmentModelData_[0].codeValue;
            this.forceUpdate();
        },
        /** 选中起始日期、禁用结束日期 */
        changeStartDate() {
            if(this.common.isBlank(this.equipmentInfo.equipmentStartTime)){
                return;
            }
            let that = this;
            this.pickerOptions_={
                disabledDate(time) {
                    return time.getTime() < new Date(that.equipmentInfo.equipmentStartTime).getTime();
                }
            }
        },
        /** 打开关闭 设备弹窗 */
        add(flag) {
            if (flag) {
                this.showModify = true;
                this.isAdd = true;
                this.isUpdate = false;
                this.title = "新增设备";
            } else {
                this.showModify = false;
                this.isLook = false;
                this.equipmentInfo = {equipmentModel: this.equipmentModelData_[0].codeValue,equipmentType: this.equipmentType+''};
            }
        },
        dblclickItem(data){
            this.modify(3,data);
        },
        /** 修改设备 */
        modify(type,item) {//type 1修改 2查看 3双击查看详情
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1 && type==1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let equip = selectData[0];
            if(type!=1){
                equip = item;
            }
            if(equip.sts==0){
                this.$message.error("无法修改已删除的设备！");
                return;
            }
            let that = this;
            this.common.postUrl("equipmentTF", "queryEquipmentInfoById", {id:equip.id}, function (data) {
                that.equipmentInfo = data;
                if(that.equipmentInfo.equipmentType==enumData.equipmentType.marking){
                    that.isMarking = true;
                }else{
                    that.isMarking = false;
                }
                that.equipmentInfo.equipmentModel = that.equipmentInfo.equipmentModel+"";
                that.equipmentInfo.equipmentType = that.equipmentInfo.equipmentType+"";
                that.equipmentInfo.subLockIds = equip.subLockIds;
            });
            if(type==1){
                this.title = "修改设备";
                this.showModify = true;
                this.isUpdate = true;
            }else{
                this.title = "查看设备";
                this.showModify = true;
                this.isLook = true;
            }
            this.isAdd = false;
        },
        /** 查看位置 */
        toMonitor(item) {
            if(this.common.isBlank(item.plateNumber)){
                this.$message.error("该设备没有绑定车辆！");
                return;
            }
            this.$emit("openTab",{
                urlId: 'vehicleMonitor' + item.vehicleId,
                query: {plateNumber:item.plateNumber},
                urlName: "车辆监控",
                urlPathName: "/res",
                urlPath: "/pt/res/vehicleMonitor.vue"});
        },
        /** 删除设备 */
        del() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要删除的设备！");
                return;
            }
            let ids = "";
            let names = "";
            let equipmentStr = '';
            for (let i = 0; i < selectData.length; i++) {
                ids += selectData[i].id + ",";
                names += "【"+selectData[i].equipmentNumber + "】";
                equipmentStr = selectData[i].equipmentTypeName+"-"+selectData[i].equipmentNumber + ",";
            }
            ids = ids.substring(0, ids.length-1);
            equipmentStr = equipmentStr.substring(0, equipmentStr.length-1);
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除设备",
                message: h('p', null, [
                    h('span', null, "此操作将设备："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("equipmentTF", "delEquipmentInfo", {ids:ids,equipmentStr}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        /** 保存设备 */
        saveEquipmentInfo() {
            if(this.common.isBlank(this.equipmentInfo.equipmentModel)){
                this.$message.error("请选择设备型号！");
                return;
            }
            if(this.common.isBlank(this.equipmentInfo.equipmentType)){
                this.$message.error("请选择设备类型！");
                return;
            }
            if(this.common.isBlank(this.equipmentInfo.equipmentNumber)
                && this.equipmentInfo.equipmentType!=enumData.equipmentType.marking && this.equipmentInfo.equipmentType!=enumData.equipmentType.bs){
                this.$message.error("请输入设备编号！");
                return;
            }
            if(this.common.isBlank(this.equipmentInfo.vehicleId) && this.equipmentInfo.equipmentType==enumData.equipmentType.marking){
                this.$message.error("请选择车辆！");
                return;
            }
            //车牌号码
            for (var i = 0; i < this.vehicleData.length; i++) {
                if(this.equipmentInfo.vehicleId == this.vehicleData[i].id){
                    this.equipmentInfo.plateNumber = this.vehicleData[i].plateNumber;
                }
            }

            let that = this;
            this.common.postUrl("equipmentTF", "addEquipmentInfo", this.equipmentInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.add(false);
                    that.$message.success("保存成功！");
                }
            },null,null,true);
        },
        /** 导出EXCEL */
        download(){
            this.$refs.table.downloadExcelFile('定位设备列表');
        },
        async doQueryBand() {
            this.bandTableData = await this.$refs.bandTable.load("equipmentTF", "queryEquipmentData", this.bandParam);
        },
        clearBand() {
            this.bandParam = {isBand:1,equipmentType:this.equipmentType};
        },
        /** 输入车牌号 失焦事件 */
        blurBack(item,code,index) {
            let plateNumber = item[code];
            let param = {
                plateNumber: item[code],
                tenantId: item["tenantId"],
                equipmentModel: item["equipmentModel"],
            };
            if(this.common.isBlank(plateNumber)){
                return;
            }
            let list = this.bandTableData.items;
            for (let i = 0; i < list.length; i++) {
                if(param.plateNumber==list[i].plateNumber && param.equipmentModel==list[i].equipmentModel && i!=index){
                    item.title = "已存在相同型号车牌号";
                    this.$refs.bandTable.resetItem(item,index);
                    return;
                }
            }
            let that = this;
            this.common.postUrl("equipmentTF", "checkBandPlateNumber", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    item.title = data.message;
                    item.bandType = data.type;
                    if(data.type==3 || data.type==4){
                        item.bandVehicleId = data.vehicleId;
                    }
                    that.$refs.bandTable.resetItem(item,index);
                }
            });
        },
        /** 绑定设备弹窗 */
        async toShowBand(flag){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length>0){
                this.bandParam.equipmentData = '';
                for (let i = 0; i < selectData.length; i++) {
                    if(this.common.isNotBlank(selectData[i].plateNumber)){
                        this.$message.error("设备编号："+selectData[i].equipmentNumber+"已绑定车辆！");
                        return false;
                    }
                    this.bandParam.equipmentData += selectData[i].equipmentNumber+"\n";
                }
                this.bandParam.equipmentData = this.bandParam.equipmentData.substring(0,this.bandParam.equipmentData.length-1);
            }
            if (flag) {
                //查询未绑定设备列表
                this.showBandEquipment = true;
                this.$nextTick(async()=>{
                    this.bandTableData = await this.$refs.bandTable.load("equipmentTF", "queryEquipmentData", this.bandParam);
                })
            } else {
                this.clearBand();
                this.showBandEquipment = false;
            }
        },
        /** 绑定设备 */
        bandEquipment(){
            let param = [];
            let list = this.bandTableData.items;
            let equipmentStr = '';
            for (let i = 0; i < list.length; i++) {
                if(this.common.isNotBlank(list[i].bandVehicleId)){
                    let map = {
                        equipmentId:list[i].id,
                        vehicleId:list[i].bandVehicleId,
                        equipmentModel:list[i].equipmentModel
                    };
                    equipmentStr = list[i].equipmentTypeName+"-"+list[i].equipmentNumber + ",";
                    param.push(map);
                }
            }
            if(param.length==0){
                this.$message.error("请输入至少一条可绑定设备的车牌号！");
                return;
            }
            equipmentStr = equipmentStr.substring(0, equipmentStr.length-1);
            let that = this;
            this.common.postUrl("equipmentTF", "bandEquipment", {bandData:param,equipmentStr}, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.toShowBand(false);
                    that.$message.success("绑定成功！");
                }
            },null,'',true);
        },
        /** 弹窗解除绑定 */
        cancleBandEquipment_(plateNumber,equipmentModel){
            let list = this.tableData.items;
            let boolean = false;
            for (let i = 0; i < list.length; i++) {
                if(plateNumber==list[i].plateNumber && equipmentModel==list[i].equipmentModel){
                    this.cancleBandEquipment(list[i]);
                    boolean = true;
                    break;
                }
            }
            if(!boolean){
                this.$message.error("没有匹配到对应车辆型号的设备，请刷新看看~");
                return;
            }
        },
        /** 解绑设备 */
        cancleBandEquipment(item){
            let ids = "";
            let names = "";
            let equipmentStr = '';
            if(item==null||item==undefined){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length == 0) {
                    this.$message.error("请选择需要解绑的设备！");
                    return;
                }
                for (let i = 0; i < selectData.length; i++) {
                    if(this.common.isBlank(selectData[i].plateNumber)){
                        this.$message.error("设备编号【"+selectData[i].equipmentNumber+"】没有绑定车辆，无法继续操作！");
                        return;
                    }
                    ids += selectData[i].id + ",";
                    names += "【"+selectData[i].equipmentNumber + "】";
                    equipmentStr = selectData[i].plateNumber+"-"+selectData[i].equipmentNumber + ",";
                }
                ids = ids.substring(0, ids.length-1);
                names = names.substring(1, names.length-1);
                equipmentStr = equipmentStr.substring(0, equipmentStr.length-1);
            }else{
                ids = item.id;
                names = item.equipmentNumber;
                equipmentStr = item.plateNumber+"-"+item.equipmentNumber;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "解绑设备",
                message: h('p', null, [
                    h('span', null, "此操作将设备编号："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 解除绑定，是否继续？"),
                ]),
                showCancelButton: true,
                center: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("equipmentTF", "cancleBandEquipment", {ids:ids,equipmentStr}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("解绑成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消解绑");
            });
        },
        /** 销售设备弹窗 */
        toShowSell(flag){
            if (flag) {
                let that = this;
                //
                this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                    that.tenantData = data;
                });
                //如果选中设备，弹窗列表就查询选中设备，否则默认不执行查询
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length > 0) {
                    let equipmentData = "";
                    for (let i = 0; i < selectData.length; i++) {
                        // if(this.common.isNotBlank(selectData[i].tenantName)){
                        //     this.$message.error("设备编号【"+selectData[i].equipmentNumber+"】已绑定供应商！");
                        //     return;
                        // }
                        equipmentData += selectData[i].equipmentNumber + ",";
                    }
                    equipmentData = equipmentData.substring(0, equipmentData.length-1);
                    this.sellParam.equipmentData = equipmentData;
                    this.doQuerySell(1);
                }
                this.showSellEquipment = true;
            } else {
                this.sellParam = {};
                this.showSellEquipment = false;
            }
        },
        /** 部标机查询弹窗 */
        toShowSinoiovQuery(flag, type){
            this.sinoiovPlateNumber = '';
            this.sinoiovVclResult = {};
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (type == 2)
                {
                    if (selectData.length != 1) {
                        this.$message.error("请选择一条需要查询的车辆！");
                        return;
                    }
                    this.sinoiovPlateNumber = selectData[0].plateNumber;
                    this.title2 = "定位查询";
                    this.isLockPlateNumber = true;
                }
                else
                {
                    if (selectData.length == 1) {
                        this.sinoiovPlateNumber = selectData[0].plateNumber;
                    }
                    this.title2 = "部标机查询";
                    this.isLockPlateNumber = false;
                }
                this.showSinoiovQuery = true;
            } else {
                this.showSinoiovQuery = false;
            }
        },

        /** 部标机查询 */
        doSinoiovQuery() {
            let that = this;
            this.common.postUrl("sinoiovBusinessTF", "queryVehicle", {
                    plateNumber: this.sinoiovPlateNumber,
                    addressStr:this.addressStr,
                    equipmentType:this.equipmentType,
                },
                function (data) {
                if (data) {
                    that.sinoiovVclResult = data;
                    that.$nextTick(()=>{
                        that.map = new BMap.Map('mapId');
                        let poi = new BMap.Point(data.lng,data.lat);
                        that.map.centerAndZoom(poi, 15);
                        that.map.enableScrollWheelZoom();
                        // 创建小车图标
                        let myIcon = new BMap.Icon("/static/image/car.png", new BMap.Size(48, 24));
                        // 创建Marker标注，使用小车图标
                        let marker = new BMap.Marker(poi, {
                            icon: myIcon
                        });
                        let rotation = parseInt(Math.random()*360);//车辆随机旋转
                        marker.setRotation(rotation);
                        // 将标注添加到地图
                        that.map.addOverlay(marker)
                    })
                }
            });
        },

        //输入车牌号
        inputPlateNumber(e) {
            if(this.common.isNotBlank(e.target.value)){
                this.sinoiovPlateNumber = e.target.value;
                this.$forceUpdate();
            }
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        /** 销售设备 */
        sellEquipment(){
            if(this.sellQuipmentData.length==0){
                this.$message.error("请先查询需要销售的设备！");
                return;
            }
            let equipmentIds = "";
            let equipmentStr = '';
            for (let i = 0; i < this.sellQuipmentData.length; i++) {
                // if(this.common.isNotBlank(this.sellQuipmentData[i].tenantId)){
                //     this.$message.error("设备编号：【"+this.sellQuipmentData[i].equipmentNumber+"】已绑定供应商！");
                //     return;
                // }
                equipmentIds += this.sellQuipmentData[i].id + ",";
                equipmentStr = this.sellQuipmentData[i].equipmentTypeName+"-"+this.sellQuipmentData[i].equipmentNumber + ",";
            }
            equipmentIds = equipmentIds.substring(0, equipmentIds.length-1);
            equipmentStr = equipmentStr.substring(0, equipmentStr.length-1);
            if(this.common.isBlank(this.sellTenantId)){
                this.$message.error("请选择销售设备供应商！");
                return;
            }

            let that = this;
            this.common.postUrl("equipmentTF", "sellEquipment", {equipmentIds:equipmentIds,tenantId:this.sellTenantId,equipmentStr}, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.toShowSell(false);
                    that.$message.success("销售成功！");
                }
            },null,'',true);
        },
        /** 查询销售设备 */
        doQuerySell(queryType) {//查询类型 1 按,分割 2 按/分割
            this.sellParam.queryType = queryType;
            if(queryType==2){
                this.sellParam.equipmentData = this.sellParam.equipmentNumberData;
            }
            if(this.common.isBlank(this.sellParam.equipmentData)){
                this.$message.error("请输入需要查询的设备编号！");
                return;
            }
            let that = this;
            this.common.postUrl("equipmentTF", "queryEquipmentByNumberData", this.sellParam, function (data) {
                that.sellQuipmentData = data;
                that.sellParam.equipmentCount = data.length;
            });
        },
        clearSell() {
            this.sellParam = {};
        },
        clearSinoiovQuery() {
            this.sinoiovPlateNumber = '';
            this.sinoiovVclResult = {};
        },
        /** 删除销售设备 */
        delSellEquipment(index) {
            this.sellQuipmentData.splice(index,1);
        },
        /** 设备号获取/失去焦点 */
        setEquipmentFocus(){
            this.equipmentFocus = this.equipmentFocus?false:true;
        },
        /**
         * 远程开锁
         */
        openLock()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一个电子锁开锁！");
                return false;
            }
            if (selectData[0].equipmentType != 3)
            {
                this.$message.error("只有电子锁才能开锁！");
                return false;
            }
            // if (selectData[0].lockState == 0)
            // {
            //     this.$message.error("电子锁已经是开锁状态！");
            //     this.doQuery();
            //     return false;
            // }
            let that = this;
            let loading = this.$loading({text: '开锁指令正在发送路上...请稍候！',target: "#equipmentInfoManage",background:'rgba(0, 0, 0, 0.5)'});

            this.common.postUrl("equipmentTF", "remoteOpenLockByEquipmentNumber", selectData[0]);
            let count = 0;
            let interval = setInterval(() => {
                this.common.postUrl("equipmentTF", "checkOpenLockStateByEquipmentNumber", selectData[0], function (data){
                    if (that.common.isNotBlank(data.lockOrderState) && data.lockOrderState >= 0)//指令已经送达设备已经回复平台
                    {
                        if (data.lockState === "0")//锁状态变更为开锁0
                        {
                            loading.setText('开锁成功！！！');
                            setTimeout(() => {
                                that.doQuery();
                                loading.close();
                                clearInterval(interval);
                            }, 1000);
                        }
                        else
                            loading.setText('正在开锁中...');
                    }
                });
                //30秒没有接收到
                if (count === 60)
                {
                    loading.setText('开锁失败！！！');
                    setTimeout(() => {
                        that.doQuery();
                        loading.close();
                        clearInterval(interval);
                    }, 1000);
                }
                count++;
            }, 500);
        },
        initLockSet()
        {
            return this.lock = {
                equipmentNumber : "",
                ip : "",
                port : "",
            }
        },
        /**
         * 设置电子锁IP
         */
        setLockIP()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一个电子锁！");
                return false;
            }
            if (selectData[0].equipmentType != 3)
            {
                this.$message.error("只有电子锁才能设置！");
                return false;
            }
            this.lockTitle = "电子锁《" + selectData[0].equipmentNumber + "》IP设定";
            this.closeDialog(true);

            this.lock.ip = selectData[0].ip;
            this.lock.port = selectData[0].port;
            this.lock.equipmentNumber = selectData[0].equipmentNumber;
        },
        closeDialog(flag)
        {
            this.showSetLockIp = flag;
            this.initLockSet();
        },
        async saveLockIP()
        {
            if (this.common.isBlank(this.lock.equipmentNumber))
            {
                this.$message.error("请选择锁信息！");
                return false;
            }
            if (this.common.isBlank(this.lock.port))
            {
                this.$message.error("请输入锁绑定的端口号！");
                return false;
            }
            await this.common.postUrl("equipmentTF", "saveLockIP", this.lock);
            this.closeDialog(false);
            await this.doQuery();
            this.$message.success("设置成功！");
        },

        selectCallback(data) {
            this.clear();
            this.equipmentType = data.equipmentType;
            this.loadParam.equipmentType = this.equipmentType;
            this.head = this.allHead[parseInt(this.equipmentType)-1];
            this.$nextTick(() => {
                this.doQuery();
            });
            this.initEquipmentTypeData();
        },
        initTabs(){
            let entityIds = localStorage.getItem("entityIds").split(",");
            let active = false;
            let that = this;
            let set = new Set();
            this.baseTabs.forEach(item1=>{
                for (let i = 0; i < entityIds.length; i++) {
                    if(item1.entityId==entityIds[i]){
                        if(!active){
                            item1.active = true;
                            active = true;
                            that.equipmentType = item1.equipmentType;
                            that.loadParam.equipmentType = this.equipmentType;
                            that.head = this.allHead[parseInt(that.equipmentType)-1];
                        }
                        that.tabs.push(item1);
                        break;
                    }
                }
            });
            if(this.equipmentType>0){
                this.$nextTick(() => {
                    this.doQuery();
                });
            }else{
                this.equipmentType = 0;
            }
            this.initEquipmentTypeData();
        },
        toShowRFID(flag){
            if(!flag){
                this.rfidInfo={};
                this.rfidDatas=[];
                this.showRFID=false;
            }
        },
        qryRfidCardDirect(){
            if(!this.rfidInfo.lockId){
                this.$message.error("请输入电子锁号！");
                return;
            }
            let that = this;
            let loading = this.$loading({text: '查询指令正在发送路上...请稍候！',target: "#rfidDialog",background:'rgba(0, 0, 0, 0.5)'});
            this.common.postUrl("JT70TF", "qryRfidCardDirect", this.rfidInfo, function (data) {
                // that.$message.success("已经发送查询指令,请稍等！");
                let reqCount = 0;  //重复请求进度条相同次数
                let interval=setInterval(() => {
                    that.common.postUrl("JT70TF","qryRfidCard",that.rfidInfo,function(data){
                        reqCount++;
                        loading.setText('正在查询中...');
                        if(reqCount == 60){     //多次请求进度不变，则认为导出失败取消请求
                            clearInterval(interval);
                            loading.setText('查询失败！！！');
                            loading.close();
                        }
                        if(data!='0'){
                            clearInterval(interval);
                            if(data){
                                loading.setText('查询成功！！！');
                                that.rfidDatas = data.split(',');
                            }else{
                                loading.setText('查询失败！！！');
                            }
                            loading.close();
                        }
                    });
                }, 1000)
            });
        },
        addRfidCardDirect(){
            if(!this.rfidInfo.lockId){
                this.$message.error("请输入电子锁号！");
                return;
            }
            if(!this.rfidInfo.cardId){
                this.$message.error("请输入授权卡号！");
                return;
            }
            let that = this;
            let loading = this.$loading({text: '新增指令正在发送路上...请稍候！',target: "#rfidDialog",background:'rgba(0, 0, 0, 0.5)'});
            this.common.postUrl("JT70TF", "addRfidCardDirect", this.rfidInfo, function (data) {
                // that.$message.success("已经发送新增指令,请稍等！");
                let reqCount = 0;  //重复请求进度条相同次数
                let interval=setInterval(() => {
                    that.common.postUrl("JT70TF","qryRfidCard",that.rfidInfo,function(data){
                        reqCount++;
                        loading.setText('正在新增中...');
                        if(reqCount == 60){     //多次请求进度不变，则认为导出失败取消请求
                            clearInterval(interval);
                            loading.setText('新增失败！！！');
                            loading.close();
                        }
                        if(data!='0'){
                            clearInterval(interval);
                            if(data){
                                loading.setText('新增成功！！！');
                                that.rfidDatas = data.split(',');
                            }else{
                                loading.setText('新增失败！！！');
                            }
                            loading.close();
                        }
                    });
                }, 1000)
            });
        },
        delRfidCardDirect(item){
            if(!this.rfidInfo.lockId){
                this.$message.error("请输入电子锁号！");
                return;
            }
            let that = this;
            let loading = this.$loading({text: '删除指令正在发送路上...请稍候！',target: "#rfidDialog",background:'rgba(0, 0, 0, 0.5)'});
            this.common.postUrl("JT70TF", "delRfidCardDirect", {lockId:this.rfidInfo.lockId,cardId:item}, function (data) {
                // that.$message.success("已经发送删除指令,请稍等！");
                let reqCount = 0;  //重复请求进度条相同次数
                let interval=setInterval(() => {
                    that.common.postUrl("JT70TF","qryRfidCard",that.rfidInfo,function(data){
                        reqCount++;
                        loading.setText('正在删除中...');
                        if(reqCount == 60){     //多次请求进度不变，则认为导出失败取消请求
                            clearInterval(interval);
                            loading.setText('删除失败！！！');
                            loading.close();
                        }
                        if(data!='0'){
                            clearInterval(interval);
                            if(data){
                                loading.setText('删除成功！！！');
                                that.rfidDatas = data.split(',');
                            }else{
                                loading.setText('删除失败！！！');
                            }
                            loading.close();
                        }
                    });
                }, 1000)
            });
        },
        showLock(item){
            this.subLocks=[];
            let subLockIds = item.subLockIds.split(",")
            let subLockNames = item.subLockNames.split(",")
            for (let i = 0; i < subLockIds.length; i++) {
                this.subLocks.push({
                    lockId:item.equipmentNumber,
                    subLockId:subLockIds[i],
                    subLockName:subLockNames[i],
                    lock:1,
                })
            }
            this.isshowLock = true;
        },
        saveSubLockName:function(subLockId,subLockName){
            let that = this;
            this.common.postUrl("equipmentTF", "saveSubLockName", {subLockId,subLockName},function (data){
                that.doQuery();
            });
        },
        unlock:function(idx){
            let that = this;
            this.common.postUrl("equipmentTF", "remoteOpenSubLockByLockId", that.subLocks[idx],function (data){
                that.$message.info("指令发送成功，请尝试开锁");
            });
        },
        gotoLog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'equipment' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.GPS,
                },
                urlName: "设备" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },

    },
    computed:{
        formData(){
            return [
                {"name":"设备号","model":"equipmentData","type":"textarea","placeholder":"设备号","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"设备到期时间","model":"equipmentEndTime","type":"select","options":this.equipmentExpireTimeData,"label":"codeName","value":"codeValue","placeholder":"设备到期时间","method":"doQuery","isshow":true,if:this.equipmentType==1 || this.equipmentType==3},
                {"name":"卡到期时间","model":"equipmentExpireTime","type":"select","options":this.equipmentExpireTimeData,"label":"codeName","value":"codeValue","placeholder":"卡到期时间","method":"doQuery","isshow":true,if:this.equipmentType==1 || this.equipmentType==3},
                {"name":"设备状态","model":"runType","type":"select","options":this.runTypeData,"label":"codeName","value":"codeValue","placeholder":"设备状态","method":"doQuery","isshow":true},
                {"name":"定位日期","model":"daterange","type":"daterange","isshow":true},
                {"name":"最新位置","model":"location","type":"input","placeholder":"最新位置","isshow":true},
            ]
        }
    },
}
