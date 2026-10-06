import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import myFileModel from "@/components/myFileModel/myFileModel.vue";

export default {
    name: 'bankManage',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "开户行", "code": "bankDepositName", "width": "120", "type": "text"},
                {"name": "开户手机号", "code": "bankPhone", "width": "120", "type": "text"},
                {"name": "支行名称", "code": "bankSubName", "width": "300", "type": "text"},
                {"name": "银行卡类型", "code": "bankTypeName", "width": "120", "type": "text"},
                {"name": "纳税人识别号/身份证号", "code": "taxpayerNum", "width": "250", "type": "text"},
                {"name": "开户卡号", "code": "bankCard", "width": "200", "type": "text"},
                {"name": "开户名字", "code": "bankAccountName", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            loadParam: {supplierName: this.$route.query.supplierName},
            bankInfo: {
                bankType: '1'
            },//银行卡信息
            bankTypeData: [],//银行卡类型
            bankDepositData: [],//开户行
            supplierData: [],//供应商
            showModify: false,//银行卡弹窗
            isLock: false,//查看信息
            showBankPayCard: false,//是否显示身份证
            title: "新增银行卡",
            fileArray: [
                {
                    fileId:null,
                    filePath:null,
                },
                {
                    fileId:null,
                    filePath:null,
                },
                {
                    fileId:null,
                    filePath:null,
                },
            ],
            isSelfBank: false,//是否个人银行卡
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
        myFileModel,
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            this.$refs.table.load("bankTF", "queryBankManageData", this.loadParam);
        },
        init() {
            //银行卡类型
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BANK_TYPE"}, function (data) {
                that.bankTypeData = data;
            });
            //开户行
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BANK_DEPOSIT"}, function (data) {
                that.bankDepositData = data;
            });
            this.initSupplierData();
        },
        initSupplierData(){
            let that = this;
            //
            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.supplierData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        dblclickItem(data){
            this.add(true,4,data);
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        successCallback(imgData)
        {
            let componentId = imgData.componentId
            this.fileArray[componentId].fileId = imgData.flowId;
            this.fileArray[componentId].filePath = imgData.storePath;
        },
        delCallback(componentId)
        {
            this.fileArray[componentId].fileId = "";
            this.fileArray[componentId].filePath = "";
        },
        /** 打开关闭 银行卡弹窗 1新增 2修改 4双击查看详情*/
        async add(flag,type,obj) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1 && (type==2 || type==3)) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
                let bank = selectData[0];
                if(type==4){
                    bank = obj;
                }
                this.isLock = false;
                this.isSelfBank = false;
                let that = this;
                //1新增
                if(type==1){
                    this.title = "新增银行卡";
                    that.$nextTick(()=>{
                        for(let i = 0; i < that.fileArray.length; i++)
                        {
                            eval('that.$refs.file' + i + '[0].clean()')
                        }
                    })
                }else{
                    //后台查询银行卡信息
                    let data = await that.common.postUrl("bankTF", "queryBankInfoById", {id:bank.bankId});
                    that.bankInfo = data;
                    that.bankInfo.bankDeposit = that.bankInfo.bankDeposit.toString();
                    that.bankInfo.bankType = that.bankInfo.bankType.toString();
                    that.clickRadio(that.bankInfo.bankType);
                    this.isSelfBank = this.common.isBlank(data.tenantId) && data.bankType == 2;
                    if(type==2) {//2修改
                        this.title = "修改银行卡";
                        //个人的不能修改
                        if (this.isSelfBank)
                        {
                            this.$message.error("个人银行卡只能查看不能修改，请对找对应人员在其账号的个人资料自行修改！");
                            return;
                        }
                    }else if(type==3 || type==4) {
                        this.title = "查看银行卡";
                        this.isLock = true;
                    }
                    that.$nextTick(()=>{
                        if (data.files)
                        {
                            for(let i = 0; i < data.files.length; i++)
                            {
                                let item = data.files[i];
                                if (that.common.isNotBlank(item.fileId))
                                {
                                    that.fileArray[i].fileId = item.fileId;
                                    that.fileArray[i].filePath = item.filePath;
                                    eval('that.$refs.file' + i + '[0].initDate(' + item.fileId + ')')
                                }
                            }
                        }
                    })
                }
                this.showModify = true;
            } else {
                this.bankInfo = {};
                this.isLock = false;
                this.showModify = false;
            }
        },
        /** 切换供应商 */
        changSupplier(tenantId) {
            this.bankInfo.userId = '';
            this.bankInfo.taxpayerNum = '';
            for (let i = 0; i < this.supplierData.length; i++) {
                if(this.supplierData[i].tenantId == tenantId){
                    this.bankInfo.userId = this.supplierData[i].adminUserId;
                    this.bankInfo.taxpayerNum = this.supplierData[i].credentialNumber;
                    break;
                }
            }
        },
        /** 切换银行卡类型 */
        clickRadio(bankType) {
            if(bankType==1){
                this.bankInfo.userPayeeCard = '';
                this.showBankPayCard = false;
            }else if(bankType==2){
                this.bankInfo.taxpayerNum = '';
                this.showBankPayCard = true;
            }
        },
        /** 新增、修改银行卡 */
        saveorupdateBank() {
            let param = this.common.copyObj(this.bankInfo);
            if(this.common.isBlank(this.bankInfo.tenantId) || this.bankInfo.tenantId<0){
                this.$message.error("请选择供应商！");
                return;
            }
            if(this.common.isBlank(this.bankInfo.bankCard)){
                this.$message.error("请输入银行卡号！");
                return;
            }
            if(this.common.isBlank(this.bankInfo.bankDeposit) || this.bankInfo.bankDeposit<0){
                this.$message.error("请选择开户行！");
                return;
            }
            if(this.bankInfo.bankType==2){
                if(this.common.isBlank(this.bankInfo.bankPhone)){
                    this.$message.error("请输入开户手机号！");
                    return;
                }
                if(this.bankInfo.bankPhone.length!=11){
                    this.$message.error("请输入有效的开户手机号！");
                    return false;
                }
            }
            if(this.common.isBlank(this.bankInfo.bankSubName)){
                this.$message.error("请输入支行名称！");
                return;
            }
            if(this.common.isBlank(this.bankInfo.bankType) || this.bankInfo.bankType<0){
                this.$message.error("请选择银行卡类型！");
                return;
            }
            if(this.common.isBlank(this.bankInfo.bankAccountName)){
                this.$message.error("请输入开户名字！");
                return;
            }
            if(this.bankInfo.bankType==1 && this.common.isBlank(this.bankInfo.taxpayerNum)){
                this.$message.error("请输入纳税人识别号！");
                return;
            }
            if(this.bankInfo.bankType==2 && this.common.isBlank(this.bankInfo.userPayeeCard)){
                this.$message.error("请输入身份证号！");
                return;
            }
            let hasFile = false;
            for (let i = 0; i < this.fileArray.length; i++)
            {
                let item = this.fileArray[i];
                if (this.common.isNotBlank(item.fileId))
                {
                    hasFile = true;
                }
            }
            if (!hasFile)
            {
                this.$message.error("请上传合同或协议！");
                return;
            }
            param.fileArray = this.fileArray;
            let that = this;
            that.common.postUrl("bankTF", "saveBankInfo", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.add(false);
                    let message = that.bankInfo.id>0 ? "修改成功!" : "新增成功!";
                    that.$message.success(message);
                }
            },null,'',true);
        },
        /** 删除银行卡 */
        delBank() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据!");
                return;
            }
            if (this.common.isBlank(selectData[0].tenantId) && selectData[0].bankType == 2)
            {
                this.$message.error("个人银行卡不能删除，人员离职删除对应人员银行卡自动删除！");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除银行卡",
                message: h('p', null, [
                    h('i', { style: 'color: red' }, "请确认删除？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("bankTF", "cancleBankInfo", selectData[0], function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
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
                urlId: 'bankDetail' + data.id,
                query: {
                    logId: data.bankId,
                    logType: enumData.LOG_TYPE.BANK,
                },
                urlName: "银行卡操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
