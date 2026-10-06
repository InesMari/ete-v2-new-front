import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'custAppointManage',
    data() {
        return {
            head: [
                {"name": "仓库", "code": "workName", "width": "300", "type": "text"},
                {"name": "预约编号", "code": "appointNum", "width": "120", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "预计到达时间", "code": "expectArriveDate", "width": "160", "type": "text"},
                {"name": "实际到达时间", "code": "actualArriveDate", "width": "160", "type": "text"},
                {"name": "状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "货物类型", "code": "goodsType", "width": "120", "type": "text"},
                {"name": "批次号", "code": "batchNum", "width": "120", "type": "text"},
                {"name": "货物件数", "code": "goodsCount", "width": "120", "type": "text"},
                {"name": "货物托数", "code": "goodsPallet", "width": "120", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "120", "type": "text"},
                {"name": "手机号", "code": "billId", "width": "120", "type": "text"},
                {"name": "预约时间", "code": "createDate", "width": "160", "type": "text"},
            ],
            loadParam: {
                workId:'',
                custName:'',
                plateNumber:'',
                vehicleLength:'',
                billId:'',
                daterange1:'',
                state:'',
            },
            stateData:[],
            workList:[],
            vehicleLengthData:[],

            info:{},
            isLock:false,
            title:'新增预约',
            dialogShow:false,
            uploadOpen:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myElDatePicker,
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        init() {
            let that = this;
            //入库状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "CUST_APPOINT_STATE"}, function (data) {
                that.stateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"}, function (data) {
                that.vehicleLengthData = data;
            });
            // 仓库
            this.common.postUrl("wmsCustAppointTF", "getCustRelWorkStore", {}, function (data) {
                that.workList = data;
            });
        },
        uploadSuccess()
        {
            this.doQuery();
            this.uploadOpen=false;
            this.$message.success("导入成功！");
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            if (this.common.isNotBlank(this.loadParam.daterange1) && this.loadParam.daterange1.length == 2) {
                this.loadParam.startExpectArriveDate = this.loadParam.daterange1[0];
                this.loadParam.endExpectArriveDate = this.loadParam.daterange1[1];
            } else {
                this.loadParam.startExpectArriveDate = '';
                this.loadParam.endExpectArriveDate = '';
            }
            await this.$refs.table.load("wmsCustAppointTF", "queryWmsAppointInfoPageForCust", this.loadParam);
        },
        download(){
            this.$refs.table.downloadExcelFile('客户预约');
        },
        close(){
          this.dialogShow=false;
          this.info={};
        },
        toAdd(){
            this.title='新增预约';
            this.dialogShow=true;
            this.info={};
            if(this.workList.length==1){
                this.info.workId = this.workList[0].workId;
            }
        },
        toUpdate(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条预约信息！");
                return;
            }
            if(selectData[0].state!=1){
                this.$message.error("不是已预约状态不能修改！");
                return;
            }
            this.dialogShow=true;
            this.info=this.common.copyObj(selectData[0]);
            this.info.vehicleLength = this.info.vehicleLength+'';
            this.title='修改预约';
        },
        del(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条预约信息！");
                return;
            }
            if(selectData[0].state!=1){
                this.$message.error("不是已预约状态不能删除！");
                return;
            }
            this.$confirm("是否确认删除预约信息？", "提示").then(async () =>{
                await this.common.postUrl("wmsCustAppointTF", "delWmsAppoint", {id:selectData[0].id},
                    null, null, '', true);
                this.$message.success("删除预约成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        save(){
            let mes = this.common.isBlank(this.info.id) ? "新增预约成功！" : "修改预约成功！";
            let that = this;
            that.common.postUrl("wmsCustAppointTF", "saveWmsAppoint", that.info, function (data) {
                that.$message.success(mes);
                that.doQuery();
                that.dialogShow=false;
                that.info={};
            },null,'',true);
        }
    },
    computed:{
        formData(){
            return [
                {"name":"仓库","model":"workId","type":"select","options":this.workList,"label":"workName","value":"workId","placeholder":"仓库","method":"doQuery","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"司机手机","model":"billId","type":"input","placeholder":"司机手机","isshow":true},
                {"name":"预计到达时间","model":"daterange1","type":"daterange","isshow":true},
                {"name":"预约状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"预约状态","method":"doQuery","isshow":true},
            ]
        }
    },
}
