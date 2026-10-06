import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'sensorInfoManage',
    data() {
        return {
            head: [
                {"name": "仓库名称", "code": "workName", "width": "150", "type": "text"},
                {"name": "设备编号", "code": "deviceAddress", "width": "150", "type": "text"},
                {"name": "设备名称", "code": "name", "width": "200", "type": "text"},
                {"name": "设备位置", "code": "location", "width": "250", "type": "text"},
                {"name": "温度报警下限", "code": "remindMinTemperature", "width": "120", "type": "text"},
                {"name": "温度报警上限", "code": "remindMaxTemperature", "width": "120", "type": "text"},
                {"name": "湿度报警下限", "code": "remindMinHumidity", "width": "120", "type": "text"},
                {"name": "湿度报警上限", "code": "remindMaxHumidity", "width": "120", "type": "text"},
                {"name": "最新温度", "code": "lastTemperature", "width": "120", "type": "text"},
                {"name": "最新湿度", "code": "lastHumidity", "width": "120", "type": "text"},
                {"name": "最新电量", "code": "lastElectricity", "width": "120", "type": "text"},
                {"name": "最新记录时间", "code": "lastRecordTime", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            loadParam: {
                deviceAddress:'',
                name:'',
            },

            acctInfo:{
                loginName:'',
                loginPwd:'',
            },
            showSensorAcctFlg:false,

            sensorInfo:{
                deviceAddress:'',
                name:'',
                location:'',
                remindMinTemperature:'',
                remindMaxTemperature:'',
                remindMinHumidity:'',
                remindMaxHumidity:'',
                remark:'',
            },
            showSensorFlg:false,
            sensorInfoDisable:false,

            uploadOpen:false,

            electricity:10,
            title:'',
            isShowSetUserDialog:false,
            basicSettingsInfo:{
                intervalHour:'4',
                remindElectricity:'',
                emailUserList:[],
                workId:'',
            },
            workData: [],
            staffData:[],
            regionId:this.common.userInfo().regionId,
            allSettingsInfoList:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myElDatePicker,
        myImport,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化数据
         */
        async initData() {
            let that = this;
            this.common.postUrl('wmsBaseTF','getAllWorkStore',{},function (data) {
                that.workData = data;
            });
        },
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            this.$refs.table.load("sensorTF", "querySensorPage", this.loadParam);
        },

        uploadSuccess(){
            this.doQuery();
            this.uploadOpen=false;
            this.$message.success("传感器设备导入成功！");
        },
        async showSensorAcctDialog(flag) {
            if (flag) {
                //加载数据回显
                let data = await this.common.postUrl("sensorTF", "getSensorAcctInfo", {});
                this.acctInfo = data;
            }
            this.showSensorAcctFlg = flag;
            this.$forceUpdate();
        },
        saveAcctInfo(){
            if(!this.acctInfo.loginName){
                this.$message.error("请输入账号！");
                return;
            }
            if(!this.acctInfo.password){
                this.$message.error("请输入密码！");
                return;
            }
            let acctInfo = this.common.copyObj(this.acctInfo);
            acctInfo.password=this.$getRsaCode(acctInfo.password);
            let that = this;
            this.common.postUrl("sensorTF", "saveSensorAcctInfo", acctInfo, function (data) {
                that.$message.success("保存成功");
                that.showSensorAcctDialog(false);
            },null,'',true);
        },
        add(){
            this.showSensorFlg = true;
            this.sensorInfoDisable = false;
            this.sensorInfo={
                deviceAddress:'',
                name:'',
                location:'',
                remindMin:'',
                remindMax:'',
                remark:'',
            };
            this.$forceUpdate();
        },
        modify(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条设备信息！");
                return;
            }
            this.showSensorFlg = true;
            this.sensorInfoDisable = false;
            this.sensorInfo = this.common.copyObj(selectData[0]);
            this.$forceUpdate();
        },
        del(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条设备信息！");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除传感器",
                message: h('p', null, [
                    h('span', null, "此操作将传感器："),
                    h('i', { style: 'color: red' }, selectData[0].name),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("sensorTF", "deleteSensorInfo", selectData[0], function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        saveSensorInfo(){
            if(!this.sensorInfo.deviceAddress){
                this.$message.error("请输入设备编号！");
                return;
            }
            if(!this.sensorInfo.name){
                this.$message.error("请输入设备名称！");
                return;
            }
            let that = this;
            this.common.postUrl("sensorTF", "saveSensorInfo", this.sensorInfo, function (data) {
                that.$message.success("保存成功");
                that.doQuery();
                that.close();
            },null,'',true);
        },
        close(){
          this.showSensorFlg = false;
          this.$forceUpdate();
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },

        /**
         * 展示接收邮件人员Dialog
         * @param isShow
         */ async showSetUserDialog(isShow) {
            this.title = "基础配置";
            if (isShow) {
                this.isShowSetUserDialog = true;
                let data = await this.common.postUrl("sensorTF", "getBasicSettingsInfo", {});
                if(this.regionId!=1){
                    this.basicSettingsInfo = data;
                    if (this.basicSettingsInfo.emailUserList.length == 0) {
                        this.addRow();
                    }
                }else{
                    this.allSettingsInfoList = data.allSettingsInfoList;
                }
                this.queryStaffData();
            } else {
                this.isShowSetUserDialog = false;
                this.basicSettingsInfo.workId = '';
            }
        },
        async changeWork() {
            if (this.basicSettingsInfo.workId) {
                let workId = this.basicSettingsInfo.workId;
                let data = await this.common.postUrl("sensorTF", "getBasicSettingsInfo", {workId});
                this.basicSettingsInfo = data;
                this.basicSettingsInfo.workId = workId;
                if (this.basicSettingsInfo.emailUserList.length == 0) {
                    this.addRow();
                }
            }else{
                this.basicSettingsInfo = {
                    intervalHour:'4',
                    remindElectricity:'',
                    emailUserList:[],
                    workId:'',
                };
            }
            this.$forceUpdate();
        },
        /**
         * 保存仓库人员信息
         */
        saveEmailUser() {
            let method = 'saveEmailUser';
            let that = this;
            this.common.postUrl("sensorTF", method, this.basicSettingsInfo, function (data) {
                if (data) {
                    that.showSetUserDialog(false);
                    that.$message.success("操作成功！");
                }
            },null,'',true);
        },
        /** 新增仓库用户行 */
        addRow() {
            let newRow = {
                id: '',
                userName:'',
                billId: '-',
                email: '-',
            };
            this.basicSettingsInfo.emailUserList.push(newRow);
            this.$forceUpdate();
        },


        /** 删除仓库用户行 */
        delRow(index) {
            this.basicSettingsInfo.emailUserList.splice(index,1);
            if(this.basicSettingsInfo.emailUserList.length === 0){
                this.addRow();
            }
            this.$forceUpdate();
        },

        /** 查询人员列表 */
        queryStaffData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryStaffData", {haveEmail:1}, function (data) {
                that.staffData = data;
            });
        },
        /**
         * 选择用户
         * @param userData
         */
        selectUser(userData) {
            for (let i = 0; i < this.staffData.length; i++) {
                if (this.staffData[i].userId == userData.userId) {
                    userData.billId = this.staffData[i].billId;
                    userData.userName = this.staffData[i].staffName;
                    userData.email = this.staffData[i].email;
                    break;
                }
            }
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
                urlId: 'sensorInfo' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.WMS_SENSOR,
                },
                urlName: "传感器" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
        goPrint(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'humitureLogPrint' + data.id,
                query: {
                    id: data.id,
                    deviceAddress:data.deviceAddress,
                    location:data.location,
                },
                urlName: "打印温湿度记录表",
                urlPathName: "/humitureLogPrint",
                urlPath: "/pt/wms/sensor/humitureLogPrint.vue"});

        },
        goPrintCode(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'humitureLogPrint' + data.id,
                query: {
                    id: data.id,
                    deviceAddress:data.deviceAddress,
                    name:data.name,
                    qrcodeUrl:data.qrcodeUrl,
                },
                urlName: "打印传感器二维码",
                urlPathName: "/humiturePrintCode",
                urlPath: "/pt/wms/sensor/humiturePrintCode.vue"});            
        }

    },
    computed:{
        formData(){
            return [
                {"name":"设备编号","model":"deviceAddress","type":"input","placeholder":"设备编号","isshow":true},
                {"name":"设备名称","model":"name","type":"input","placeholder":"设备名称","isshow":true},
                {"name":"仓库名称","model":"workName","type":"input","placeholder":"仓库名称","isshow":true},
            ]
        }
    },
}
