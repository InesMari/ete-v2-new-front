import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'receiveAdvanceManage',
    data() {
        return {
            head: [
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "预收原因", "code": "advanceCause", "width": "110", "type": "text"},
                {"name": "预收金额", "code": "advanceFee", "width": "110", "type": "text"},
                {"name": "收款日期", "code": "advanceDate", "width": "110", "type": "text"},
                {"name": "已核销金额", "code": "isVerificationFee", "width": "110", "type": "text"},
                {"name": "未核销金额", "code": "noVerificationFee", "width": "110", "type": "text"},
                {"name": "预收状态", "code": "advanceStateName", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"}
            ],
            detailHead: [
                {"name": "核销金额", "code": "verificationFee", "width": "110", "type": "text", "isSum":"true"},
                {"name": "核销人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "核销时间", "code": "createDate", "width": "110", "type": "text"}
            ],
            loadParam: {customerName: this.$route.query.customerName},
            receive: {},//预收信息
            advanceStateData: [],//预收状态下拉
            customerData: [],//客户下拉
            showReceive: false,//预收
            showVerification: false,//核销
            showVerificationDetail: false,//核销明细
            pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,//初始化日期快捷
            verificationFee: '',//核销金额
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        scrollTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            if(this.common.isNotBlank(this.loadParam.daterange) && this.loadParam.daterange.length==2){
                this.loadParam.startDate = this.loadParam.daterange[0];
                this.loadParam.endDate = this.loadParam.daterange[1];
            }else{
                this.loadParam.startDate = '';
                this.loadParam.endDate = '';
            }
            this.$refs.table.load("fcAdvanceTF", "queryReceiveVancePage", this.loadParam);
        },
        init() {
            let that = this;
            //预收状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ADVANCE_STATE"}, function (data) {
                that.advanceStateData = data;
            });
            //客户
            this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
                that.customerData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 打开关闭 新增预收弹窗 */
        toAddReceive(flag) {
            if(flag){
                this.title = "新增预收";
                this.showReceive = true;
            }else{
                this.receive = {};
                this.showReceive = false;
            }
        },
        /** 打开关闭 修改预收弹窗 */
        async toUpReceive() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条预收信息！");
                return;
            }
            this.receive = await this.common.postUrl("fcAdvanceTF", "queryReceiveInfoById", {id:selectData[0].id});
            this.title = "修改预收";
            this.showReceive = true;
        },
        /** 保存预收信息 */
        saveReceiveInfo() {
            if(this.common.isBlank(this.receive.tenantId)){
                this.$message.error("请选择客户名称！");
                return;
            }
            if(this.common.isBlank(this.receive.advanceCause)){
                this.$message.error("请输入预收原因！");
                return;
            }
            if(this.common.isBlank(this.receive.advanceFee)){
                this.$message.error("请输入收款金额！");
                return;
            }
            if(this.common.isBlank(this.receive.advanceDate)){
                this.$message.error("请选择收款日期！");
                return;
            }
            let mes = this.common.isBlank(this.receive.id) ? "新增成功！" : "修改成功！";
            let that = this;
            that.receive.custName = that.customerData.find(item=>item.tenantId===that.receive.tenantId).name;
            that.common.postUrl("fcAdvanceTF", "saveReceiveInfo", that.receive, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.toAddReceive(false);
                    that.$message.success(mes);
                }
            },null,'',true);
        },
        /** 删除预收信息 */
        delReceiveInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条预收信息！");
                return;
            }
            let that = this;
            this.$confirm("是否确认删除？", "提示").then(async () =>{
                await this.common.postUrl("fcAdvanceTF", "delReceiveInfo", selectData[0],
                null, null, '', true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        /** 打开关闭 预收核销弹窗 */
        async toAddVerification(flag) {
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条预收信息！");
                    return;
                }
                this.receive = await this.common.postUrl("fcAdvanceTF", "queryReceiveInfoById", {id:selectData[0].id});
                this.receive.custName = selectData[0].tenantName;
                this.showVerification = true;
            }else{
                this.receive = {};
                this.verificationFee = '';
                this.showVerification = false;
            }
        },
        /** 保存核销信息 */
        saveVerification() {
            if(this.common.isBlank(this.verificationFee)){
                this.$message.error("请输入本次核销金额！");
                return;
            }
            let param = {id: this.receive.id,custName:this.receive.custName, verificationFee: this.verificationFee};
            let that = this;
            that.common.postUrl("fcAdvanceTF", "saveVerification", param, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.toAddVerification(false);
                    that.$message.success("核销成功");
                }
            },null,'',true);
        },
        /** 打开关闭 预收核销明细弹窗 */
        toShowVerificationDetail(flag) {
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条预收信息！");
                    return;
                }
                this.showVerificationDetail = true;
                this.$nextTick(() => {
                    this.$refs.detailTable.load("fcAdvanceTF", "queryReceiveDetail", {id:selectData[0].id});
                });
                this.receive = selectData[0];
            }else{
                this.receive = {};
                this.showVerificationDetail = false;
            }
        },
    },
}
