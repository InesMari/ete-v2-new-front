import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js";
import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from '@/components/myFileModel/myFileModel.vue'
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'costAccountManage',
    data() {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "车辆属性", "code": "vehicleAttributionName", "width": "90", "type": "text"},
                {"name": "记账类型", "code": "accountTypeName", "width": "80", "type": "text"},
                {"name": "记账金额", "code": "accountFee", "width": "80", "type": "text"},
                {"name": "票据类型", "code": "invoiceTypeName", "width": "80", "type": "text"},
                {"name": "税率", "code": "invoiceTax", "width": "80", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "80", "type": "text"},
                {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "130", "type": "text"}
            ],
            waybillHead: [
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "车辆属性", "code": "vehicleAttributionName", "width": "100", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "130", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "60", "type": "text"},
                {"name": "联系方式", "code": "linkPhone", "width": "100", "type": "text"},
                {"name": "要求运作时间", "code": "workDate", "width": "100", "type": "text"},
                {"name": "收车时间", "code": "endCarDate", "width": "100", "type": "text"},
                {"name": "账期", "code": "periodicalDay", "width": "60", "type": "text"},
                {"name": "运费", "code": "freight", "width": "80", "type": "text", "isSum": "true"},
                {"name": "记账金额", "code": "accountFee", "width": "80", "type": "text", "isSum": "true"}
            ],
            loadParam: {
                supplierId: this.common.isBlank(this.$route.query.supplierId) ? '' : Number(this.$route.query.supplierId),
                verifyState: this.$route.query.verifyState
            },
            waybillParam: {},
            accountInfo: {},//审核成本记账信息
            costInfo: {},//成本记账信息
            accountTypeData: [],//记账类型
            invoiceTypeData: [],//票据类型
            verifyStateData: [],//审核状态
            waybillData: [],//派车单下拉数据
            srcList:[],//图片
            supplierData:[],//
            title: '',//弹窗标题
            showVerify: false,//票据审核
            showAddCost: false,//新增记账
            isLock: false,//查看详情
            isGenralVote: false,//普票不能修改
        }
    },
    computed:{
            formData()
            {
                return [
                    {"name":"记账类型","model":"accountType","type":"select","options":this.accountTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                    {"name":"票据类型","model":"invoiceType","type":"select","options":this.invoiceTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                    {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                    {"name":"供应商","model":"supplierId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
                ]
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
        fileViewer,
        myFileModel,
        scrollTable,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query = this.loadParam) {
            this.loadParam = query;
            this.$refs.table.load("fcCostAccountTF", "queryCostAccountPage", query);
        },
        async init() {
            let that = this;
            //记账类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"ACCOUNT_TYPE"}, function (data) {
                that.accountTypeData = data;
            });
            //票据类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"INVOICE_TYPE"}, function (data) {
                that.invoiceTypeData = data;
            });
            //审核状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VERIFY_STATE"}, function (data) {
                that.verifyStateData = data;
            });
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        clear() {
            this.loadParam = {};
        },
        dblclickItem(data){
            this.toShowAddCost(true,3,data);
        },
        forupdate(){
            this.$forceUpdate();
        },
        /**
         * 切换票据类型
         * 普票税率默认0，专票税率默认13，普票不能改，专票可以修改
         * */
        changeInvoiceType(){
            for (let i = 0; i < this.invoiceTypeData.length; i++) {
                if(this.costInfo.invoiceType==this.invoiceTypeData[i].codeValue){
                    this.costInfo.invoiceTax = this.invoiceTypeData[i].codeDesc;
                    if(this.costInfo.invoiceType==enumData.invoiceType.genralVote){
                        this.isGenralVote = true;
                    }else{
                        this.isGenralVote = false;
                    }
                }
            }
        },
        /** 打开关闭 新增记账 type:1新增 2查看 3双击查看详情*/
        toShowAddCost(flag,type,obj) {
            if (flag) {
                if(type==1){//新增记账
                    this.title = "新增票据记账";
                    this.$nextTick(() => {
                        this.queryAddCostWaybillData();
                    })
                }else if(type==2 || type==3){//查看记账
                    this.title = "查看票据记账";
                    let selectData = this.$refs.table.getSelectItem();
                    if (selectData.length != 1 && type==2) {
                        this.$message.error("请选择一条数据!");
                        return;
                    }
                    let cost = selectData[0];
                    if(type==3){
                        cost = obj;
                    }
                    let that = this;
                    this.common.postUrl("fcCostAccountTF", "queryCostAccountDetail", {id:cost.id}, function (data) {
                        that.costInfo = data.costMap;
                        that.costInfo.invoiceType = that.costInfo.invoiceType.toString();
                        that.costInfo.accountType = that.costInfo.accountType.toString();
                        if(that.common.isNotBlank(that.costInfo.invoiceImgId)){
                            that.$refs.invoiceInfo.initDate(that.costInfo.invoiceImgId);
                        }
                        if(that.common.isNotBlank(that.costInfo.invoiceImgIdTwo)){
                            that.$refs.invoiceInfoTwo.initDate(that.costInfo.invoiceImgIdTwo);
                        }
                        if(that.common.isNotBlank(that.costInfo.invoiceImgIdThree)){
                            that.$refs.invoiceInfoThree.initDate(that.costInfo.invoiceImgIdThree);
                        }
                        if(that.common.isNotBlank(that.costInfo.invoiceImgIdFour)){
                            that.$refs.invoiceInfoFour.initDate(that.costInfo.invoiceImgIdFour);
                        }
                        if(that.common.isNotBlank(that.costInfo.invoiceImgIdFive)){
                            that.$refs.invoiceInfoFive.initDate(that.costInfo.invoiceImgIdFive);
                        }
                        that.$refs.waybillTable.initData(data.waybillList);//重新赋值
                        that.$refs.waybillTable.initHead();//刷新head
                        that.$refs.waybillTable.calcFootSum();//合计
                    });
                    this.isLock = true;
                }
                this.showAddCost = true;
            } else {
                this.costInfo = {};
                this.waybillParam = {};
                this.$refs.invoiceInfo.clean();
                this.$refs.invoiceInfoTwo.clean();
                this.$refs.invoiceInfoThree.clean();
                this.$refs.invoiceInfoFour.clean();
                this.$refs.invoiceInfoFive.clean();
                this.showAddCost = false;
                this.isLock = false;
            }
        },
        /** 新增记账查询派车单信息*/
        async queryAddCostWaybillData() {
            if(this.common.isNotBlank(this.waybillParam.daterange) && this.waybillParam.daterange.length==2){
                this.waybillParam.startDate = this.waybillParam.daterange[0];
                this.waybillParam.endDate = this.waybillParam.daterange[1];
            }else{
                this.waybillParam.startDate = '';
                this.waybillParam.endDate = '';
            }
            this.waybillData = await this.$refs.waybillTable.load("fcCostAccountTF", "queryAddCostWaybillData", this.waybillParam);
            this.$refs.waybillTable.initHead();
            this.$refs.waybillTable.calcFootSum();//合计
        },
        /**
         * 输入记账金额
         */
        inputFn(data, code, index)
        {
            if (data.accountFee > data.freight)
            {
                this.$message.error("记账金额不能大于运费金额!");
                data.accountFee = '';
            }
            let sumFee = '0';
            this.$refs.waybillTable.getData().forEach(item => {
                if (this.common.isNotBlank(item.accountFee))
                {
                    sumFee = this.common.accAdd(sumFee, item.accountFee);
                }
            })
            this.costInfo.accountFee = sumFee;
            this.$refs.waybillTable.calcFootSum();//合计
        },
        /**
         * 自动拆分
         * 按照运费的比例自动分摊
         */
        shareFee() {
            if(this.common.isBlank(this.costInfo.accountFee)){
                this.$message.error("请输入记账金额!");
                return;
            }
            //拿到运费合计
            let freightSum = 0;//运费合计
            let headData = this.$refs.waybillTable.getSum();
            headData.forEach(
                item => {
                    if(item.code == 'freight'){
                        freightSum = item.sum;
                    }
                }
            );
            if(this.common.isBlank(freightSum)){
                this.$message.error("没有派车单运费信息!");
                return;
            }
            let freightSum_old = 0;//已经计算的运费合计
            //计算分摊
            let remainFee = parseFloat(this.costInfo.accountFee);//记账金额
            if(remainFee>freightSum){
                this.$message.error("记账金额不能大于运费合计!");
                return;
            }
            for (let i = 0; i < this.waybillData.length; i++) {
                let item = this.waybillData[i];
                if(i==this.waybillData.length-1){//记账金额取整，剩余金额补到最后一个派车单
                    //如果剩余记账金额大于最后一个派车单运费，重新往上查找对应派车单
                    if(this.common.accSub(remainFee,freightSum_old) > item.freight){
                        item.accountFee = item.freight;
                        freightSum_old = this.common.accAdd(freightSum_old,item.accountFee);
                        for (let j = 0; j < this.waybillData.length-1; j++) {
                            let item_ = this.waybillData[j];
                            if(item_.freight > item_.accountFee){
                                if(this.common.accSub(remainFee,freightSum_old) > this.common.accSub(item_.freight,item_.accountFee)){
                                    freightSum_old = this.common.accAdd(freightSum_old,this.common.accSub(item_.freight,item_.accountFee));
                                    item_.accountFee = item_.freight;
                                }else{
                                    item_.accountFee = this.common.accAdd(item_.accountFee,this.common.accSub(remainFee,freightSum_old));
                                    freightSum_old = this.common.accAdd(freightSum_old,this.common.accSub(remainFee,freightSum_old));
                                    break;
                                }
                            }
                        }
                    }else{
                        item.accountFee = this.common.accSub(remainFee,freightSum_old);
                    }
                }else{
                    //派车单运费/运费合计*记账金额
                    let accountFee = this.common.accMul(this.common.accDiv(item.freight,freightSum),remainFee);
                    item.accountFee = Math.floor(accountFee);
                    freightSum_old = this.common.accAdd(freightSum_old,item.accountFee);
                }
                this.waybillData[i] = item;
            }
            this.$refs.waybillTable.initData(this.waybillData);//重新赋值
            this.$refs.waybillTable.calcFootSum();//合计
            // if (remainFee > 0) {
            //     this.$message.error("记账金额太大，拆分不完");
            // }
        },
        /** 保存记账信息 */
        saveCostAccountInfo() {
            //记账基本信息
            if(this.common.isBlank(this.costInfo.invoiceType)){
                this.$message.error("请选择票据类型!");
                return;
            }
            if(this.common.isBlank(this.costInfo.accountType)){
                this.$message.error("请选择票记账类型!");
                return;
            }
            if(this.common.isBlank(this.costInfo.accountFee)){
                this.$message.error("请输入记账金额!");
                return;
            }
            if(this.common.isBlank(this.costInfo.invoiceTax)){
                this.$message.error("请输入税率!");
                return;
            }
            this.costInfo.invoiceImgId = this.$refs.invoiceInfo.getImageData().flowId;
            this.costInfo.invoiceImgPath = this.$refs.invoiceInfo.getImageData().storePath;
            this.costInfo.invoiceImgIdTwo = this.$refs.invoiceInfoTwo.getImageData().flowId;
            this.costInfo.invoiceImgPathTwo = this.$refs.invoiceInfoTwo.getImageData().storePath;
            this.costInfo.invoiceImgIdThree = this.$refs.invoiceInfoThree.getImageData().flowId;
            this.costInfo.invoiceImgPathThree = this.$refs.invoiceInfoThree.getImageData().storePath;
            this.costInfo.invoiceImgIdFour = this.$refs.invoiceInfoFour.getImageData().flowId;
            this.costInfo.invoiceImgPathFour = this.$refs.invoiceInfoFour.getImageData().storePath;
            this.costInfo.invoiceImgIdFive = this.$refs.invoiceInfoFive.getImageData().flowId;
            this.costInfo.invoiceImgPathFive = this.$refs.invoiceInfoFive.getImageData().storePath;
            if(this.common.isBlank(this.costInfo.invoiceImgId) || this.common.isBlank(this.costInfo.invoiceImgPath)){
                this.$message.error("请上传票据图片!");
                return;
            }
            //记账派车单信息
            for (let i = 0; i < this.waybillData.length; i++) {
                if(i<this.waybillData.length-1 && this.waybillData[i].plateNumber != this.waybillData[i+1].plateNumber){
                    this.$message.error("只能保存同一车辆的派车单记账信息!");
                    return;
                }
                if(this.common.isBlank(this.waybillData[i].accountFee)){
                    this.$message.error("请输入第"+(i+1)+"行的记账金额!");
                    return;
                }
                if(this.waybillData[i].accountFee>this.waybillData[i].freight){
                    this.$message.error("第"+(i+1)+"行的记账金额不能大于运费金额!");
                    return;
                }
            }
            this.costInfo.waybillData = this.waybillData;
            let that = this;
            this.common.postUrl("fcCostAccountTF", "saveCostAccount", this.costInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.toShowAddCost(false);
                    that.$message.success("保存成功!");
                }
            },null,'',true);
        },
        /** 票据审核*/
        toShowVerify(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
                if(selectData[0].verifyState!=enumData.verifyState.notReviewed){
                    this.$message.error("该记账信息不是未审核状态!");
                    return;
                }
                let invoice = selectData[0];
                let that = this;
                this.common.postUrl("fcCostAccountTF", "queryCostAccountById", {id:invoice.id}, function (data) {
                    that.accountInfo = data;
                    that.srcList=[];
                    that.srcList.push(that.common.getBigImgPath(data.invoiceImgPath_));
                    if(that.common.isNotBlank(data.invoiceImgPathTwo_)){
                        that.srcList.push(that.common.getBigImgPath(data.invoiceImgPathTwo_));
                    }
                    if(that.common.isNotBlank(data.invoiceImgPathThree_)){
                        that.srcList.push(that.common.getBigImgPath(data.invoiceImgPathThree_));
                    }
                    if(that.common.isNotBlank(data.invoiceImgPathFour_)){
                        that.srcList.push(that.common.getBigImgPath(data.invoiceImgPathFour_));
                    }
                    if(that.common.isNotBlank(data.invoiceImgPathFive_)){
                        that.srcList.push(that.common.getBigImgPath(data.invoiceImgPathFive_));
                    }
                });
                this.showVerify = true;
      			this.$refs.viewer.show();
            } else {
                this.accountInfo = {};
                this.showVerify = false;
            }
        },
        /** 票据审核 1审核通过 2审核不通过*/
        verifyInvoice(state) {
            let param = {
                id: this.accountInfo.id,
                verifyRemark: this.accountInfo.verifyRemark,
                verifyState: state
            };
            let that = this;
            this.common.postUrl("fcCostAccountTF", "verifySure", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$message.success("审核成功!");
                    that.$parent.loadTodoData();
                }
            });
            this.toShowVerify(false);
        },
        /** 删除记账 */
        delCostAccount() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据!");
                return;
            }
            if(selectData[0].verifyState==enumData.verifyState.approved){
                this.$message.error("无法删除审核通过的记账信息!");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除记账",
                message: h('p', null, [
                    h('i', { style: 'color: red' }, "请确认删除记账信息？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("fcCostAccountTF", "delCostAccount", {id:selectData[0].id}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
    },
}
