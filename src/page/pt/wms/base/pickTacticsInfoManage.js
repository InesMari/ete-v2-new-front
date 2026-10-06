import tableCommon from "@/components/table/tableCommon.vue";
import vuedraggable from 'vuedraggable';
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'pickTacticsInfoManage',
    data() {
        return {
            head: [
                {"name": "策略编码", "code": "tacticsNum", "width": "110", "type": "text"},
                // {"name": "所属货主", "code": "srcTenantName", "width": "110", "type": "text"},
                {"name": "策略名称", "code": "tacticsName", "width": "110", "type": "text"},
                {"name": "是否默认", "code": "isDefaultName", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "110", "type": "text"}
            ],
            loadParam: {srcTenantName: this.$route.query.srcTenantName},
            pickTactics: {isDefaultFlag:true},//策略信息
            // srcTenantData: [],//所属货主
            tacticeWayData: [],//策略方式
            showPickTactics: false,//新增拣货策略
            isLock: false,//查看
            title: '新增拣货策略',
            strategyList:[],//策略纬度
            strategyTable:[],
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
        this.initStrategyTable();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        vuedraggable,
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
            this.$refs.table.load("wmsMaterialPickTF", "queryPickTacticsPage", this.loadParam);
        },
        init() {
            let that = this;
            // //所属货主
            // this.common.postUrl("wmsTenantTF", "queryConsignorTenantList", {}, function (data) {
            //     that.srcTenantData = data;
            // });
            //策略纬度
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TACTICS_LATITUDE"}, function (data) {
                that.strategyList = data;
                that.strategyList.forEach(item => {
                    item.ascend = true;
                });
            });
            //策略方式
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TACTICS_WAY"}, function (data) {
                that.tacticeWayData = data;
            });
        },
        // 初始化拣货策略表格
        initStrategyTable(){
            //策略纬度
            let list = this.common.copyObj(this.strategyList);
            let isAdd = list.filter(item=>item.isShow).length > this.strategyTable.length;  //增加还是减少行
            if(isAdd){  //增加行
                this.strategyTable = [...this.strategyTable,...list.filter(obj=>(!this.strategyTable.some(obj1=>obj1.codeId==obj.codeId)&&obj.isShow))];
            }else{  //减少
                this.strategyTable = this.strategyTable.filter(obj=>list.some(obj1=>obj1.codeId==obj.codeId&&obj1.isShow));
            }
        },
        clear() {
            this.loadParam = {};
        },
        /** 打开关闭 新增拣货策略弹窗 */
        toAddPickTactics(flag) {
            if(flag){
                this.title = "新增拣货策略";
                this.showPickTactics = true;
                this.init();
            }else{
                this.pickTactics = {isDefaultFlag:true};
                this.showPickTactics = false;
                this.isLock = false;
            }
        },
        /** 双击查看详情 */
        dblclickItem(data){
            this.toUpPickTactics(data);
        },
        /** 打开关闭 修改拣货策略弹窗 */
        async toUpPickTactics(data) {
            if(this.common.isBlank(data)){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条拣货策略信息！");
                    return;
                }
                data = selectData[0];
                this.title = "修改拣货策略";
            }else{//查看详情
                this.isLock = true;
                this.title = "查看拣货策略";
            }
            this.pickTactics = await this.common.postUrl("wmsMaterialPickTF", "queryPickTacticeById", {id:data.id});
            this.pickTactics.isDefaultFlag = this.pickTactics.isDefault == 1 ? true : false;
            this.strategyList.forEach(item_ => {
                this.pickTactics.tacticeDtlList.forEach(item => {
                    if(item_.codeValue==item.tacticsCol){
                        item.tacticsType=='ASC' ? (item_.ascend=true,item_.descend=false) : (item_.ascend=false,item_.descend=true);
                        item_.isShow = true;
                    }
                });
            });
            this.showPickTactics = true;
            this.initStrategyTable();
        },
        /** 点击升序 */
        changeAscend(index){
            if(!this.strategyTable[index].ascend && !this.strategyTable[index].descend){
                this.strategyTable[index].ascend = true;
                return;
            }
            if(this.strategyTable[index].ascend){
                this.strategyTable[index].descend = false;
            }
        },
        /** 点击降序 */
        changeDescend(index){
            if(!this.strategyTable[index].ascend && !this.strategyTable[index].descend){
                this.strategyTable[index].descend = true;
                return;
            }
            if(this.strategyTable[index].descend){
                this.strategyTable[index].ascend = false;
            }
        },
        /** 保存拣货策略信息 */
        savePickTactics() {
            // if(this.common.isBlank(this.pickTactics.srcTenantId)){
            //     this.$message.error("请选择所属货主！");
            //     return;
            // }
            if(this.common.isBlank(this.pickTactics.tacticsName)){
                this.$message.error("请输入拣货策略名称！");
                return;
            }
            if(this.strategyTable.length==0){
                this.$message.error("请选择策略纬度！");
                return;
            }
            this.pickTactics.isDefault = this.pickTactics.isDefaultFlag == true ? 1 : 0;
            let strategyData = [];
            for (let i = 0; i < this.strategyTable.length; i++) {
                if(this.common.isBlank(this.strategyTable[i].codeValue)){
                    this.$message.error("请选择第"+(i+1)+"行策略列！");
                    return;
                }
                if(this.common.isBlank(this.strategyTable[i].ascend) && this.common.isBlank(this.strategyTable[i].descend)){
                    this.$message.error("请选择第"+(i+1)+"行策略方式！");
                    return;
                }
                strategyData.push({
                    "tacticsCol": this.strategyTable[i].codeValue,
                    "tacticsType": this.common.isNotBlank(this.strategyTable[i].ascend) && this.strategyTable[i].ascend==true ? "ASC" : "DESC",
                });
            }
            this.pickTactics.pickTacticsDtlData = strategyData;
            let mes = this.common.isBlank(this.pickTactics.id) ? "新增成功！" : "修改成功！";
            let that = this;
            that.common.postUrl("wmsMaterialPickTF", "savePickTactics", that.pickTactics, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.toAddPickTactics(false);
                    that.$message.success(mes);
                }
            },null,'',true);
        },
        /** 删除拣货策略信息 */
        delPickTactics() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条拣货策略信息！");
                return;
            }
            this.$confirm("是否确认删除？", "提示").then(async () =>{
                await this.common.postUrl("wmsMaterialPickTF", "delPickTactice", selectData[0],
                null, null, '', true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
    },
    watch:{
        strategyList:{
            handler(n){
                this.initStrategyTable();
            },
            deep:true
        }
    },
}
