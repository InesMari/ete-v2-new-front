import tableCommon from "@/components/table/tableCommon.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'reservoirInfoManage',
    data() {
        return {
            head: [
                {"name": "库区编码", "code": "reservoirCode", "width": "110", "type": "text"},
                {"name": "库区名称", "code": "reservoirName", "width": "110", "type": "text"},
                {"name": "库区类型", "code": "reservoirTypeName", "width": "110", "type": "text"},
                {"name": "库位数", "code": "storageCount", "width": "110", "type": "text"},
                {"name": "是否为VMI", "code": "isVmiName", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "110", "type": "text"}
            ],
            loadParam: {},
            reservoir: {},//库区信息
            reservoirTypeData: [],//库区类型下拉
            whetherData: [],//是否VMI
            showReservoir: false,//新增库区
            isLock: false,//查看
            title: '新增库区',
            showSelWork:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        selectWork
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.doQuery();
        },
        doQuery() {
            this.$refs.table.load("wmsReservoirTF", "queryReservoirPage", this.loadParam);
        },
        init() {
            let that = this;
            //库区类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RESERVOIR_TYPE"}, function (data) {
                that.reservoirTypeData = data;
            });
            //是否VMI
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data) {
                that.whetherData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 打开关闭 新增库区弹窗 */
        toAddReservoir(flag) {
            if(flag){
                this.title = "新增库区";
                this.showReservoir = true;
                this.init();
            }else{
                this.reservoir = {};
                this.showReservoir = false;
                this.isLock = false;
            }
        },
        /** 双击查看详情 */
        dblclickItem(data){
            this.toUpReservoir(data);
        },
        /** 打开关闭 修改库区弹窗 */
        async toUpReservoir(data) {
            if(this.common.isBlank(data)){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条库区信息！");
                    return;
                }
                data = selectData[0];
                this.title = "修改库区";
            }else{//查看详情
                this.isLock = true;
                this.title = "查看库区";
            }
            this.reservoir = await this.common.postUrl("wmsReservoirTF", "queryReservoirInfoById", {id:data.id});
            this.reservoir.reservoirType = this.reservoir.reservoirType.toString();
            this.reservoir.isVmi = this.reservoir.isVmi.toString();
            this.showReservoir = true;
        },
        /** 保存库区信息 */
        saveReservoir() {
            if(this.common.isBlank(this.reservoir.reservoirCode)){
                this.$message.error("请输入库区编码！");
                return;
            }
            if(this.common.isBlank(this.reservoir.reservoirName)){
                this.$message.error("请输入库区名称！");
                return;
            }
            if(this.common.isBlank(this.reservoir.reservoirType)){
                this.$message.error("请选择库区类型！");
                return;
            }
            if(this.common.isBlank(this.reservoir.isVmi)){
                this.$message.error("请选择是否为VMI！");
                return;
            }
            let mes = this.common.isBlank(this.reservoir.id) ? "新增成功！" : "修改成功！";
            let that = this;
            that.common.postUrl("wmsReservoirTF", "saveReservoir", that.reservoir, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.toAddReservoir(false);
                    that.$message.success(mes);
                }
            },null,'',true);
        },
        /** 删除库区信息 */
        delReservoirInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条库区信息！");
                return;
            }
            this.$confirm("是否确认删除？", "提示").then(async () =>{
                await this.common.postUrl("wmsReservoirTF", "delReservoirInfo", selectData[0],
                null, null, '', true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
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
                urlId: 'reservoir' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.RESERVOIR,
                },
                urlName: "库区" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
