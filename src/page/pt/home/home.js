import myTab from '@/components/myTab/myTab.vue'
import navMenu from './navMenu.vue'
import chatBox from '@/components/chatBox/chatBox.vue'

export default {
    name: 'home',
    data() {
        return {
            userName:this.common.userInfo().userName,
            billId:this.common.userInfo().billId,
            passwordFlag:this.common.userInfo().passwordFlag,
            orgList:this.common.userInfo().orgList?this.common.userInfo().orgList['tenantId'+this.common.userInfo().tenantId]:[],
            orgId:this.common.userInfo().orgId,
            isshowInfoList:false, //右上 - 是否展示个人信息
            isshowChiildList:false, //右上 - 是否展示组织
            keepAlivePage : this.$store.state.keepAlivePage,
            password:'',
            confirmPassword:'',
            smsVaildCode:'',
            showDialog:false,
            showModifyDialog:false,
            msg : '获取验证码',
            stamp : true,
            miao : 60,
            isshowNav:true,
            todo: {
                totalSum: 0,
                orderSum: 0,
                customerZCQuoteSum: 0,
                customerLDSum: 0,
                supplierZCQuote: 0,
                supplierLDSum: 0,
                incomeFeeSum: 0,
                costFeeSum: 0,
                incomeFeeChangeSum:0,
                costFeeChangeSum:0,
                customerBillSum:0,
                supplierBillSum:0,
                applyInvoiceSum: 0,
                submitInvoiceSum: 0,
                g7PayApplyVerifySum: 0,
                gdPayApplyVerifySum: 0,
                costAccountSum: 0,
                projectSundryFeeCount: 0,
                regionOrderSum: 0,
                requestFeeSum: 0,
                payFeeSum: 0,
                purchaseApplySum: 0,
                claimApplySum: 0,
                assetsAllocatSum: 0,
                scheduleSum: 0,
            },
            isshowAgency:false,     //是否展示代办事项
            showOrgDialog:false,
            socket:'',
            userMenuLabel:[],   //收藏菜单
            marqueeList:[],     //跑马灯数据
            loadEntityEnd:false,    //权限Id是否加载完毕（会影响右上角消息提示）
            isshowHelpCenter:false, //是否展示帮助中心侧边弹窗内容
            quesListShow:[],//帮助中心展示数据
            helpCenterModel:'',//帮助中心搜索值
            showOperationDialog:false,
            operationList:[
                {name:"首页",url:"1.pdf"},
                {name:"客户中心",url:"2.pdf"},
                {name:"资源中心",url:"3.pdf"},
                {name:"运输中心",url:"4.pdf"},
                {name:"仓储中心",url:"5.pdf"},
                {name:"器具中心",url:"6.pdf"},
                {name:"商务中心",url:"7.pdf"},
                {name:"财务中心",url:"8.pdf"},
                {name:"行政中心",url:"9.pdf"},
                {name:"文件中心",url:"10.pdf"},
                {name:"采购中心",url:"11.pdf"},
                {name:"数据中心",url:"12.pdf"},
                {name:"异常中心",url:"13.pdf"},
                {name:"基础配置",url:"14.pdf"},
            ],

            //上线通知内容
            noticeFlag:false,
            noticeList:[],
            noticeInfo:{},
            noticeBtnStr:'立即关闭',
            noticeSecStr:'10s后自动关闭此窗口',
            noticeHaveMore:false,
            isShowRealTranslationInfos:false,
            //上线通知内容

        }
    },
    mounted() {
        this.common.initTheme();
        this.showDialog=this.passwordFlag==1;
        if(this.orgList&&this.orgList.length>1&&this.common.userInfo().loginFlg){
            this.showOrgDialog = true;
        }
        this.pageInfo = JSON.parse(localStorage.getItem("pageInfo"));
        this.openMain();
        this.checkUrl();
        this.$nextTick(() => {
            this.loadTodoData();
            let _this = this;
            _this.todoInterval = setInterval(async() => {
                _this.loadTodoData();
            }, 60000);
        });
        this.init();
        this.queryUserMenuLabelData();//查询收藏菜单
        this.queryHelps();//查询帮助中心
        this.queryOnlineNotice();
        this.initMap();
    },
    components: {
        myTab,
        navMenu,
        chatBox,
    },
    methods: {
        // 打开首页
        openMain(){
            try
            {
                let that = this;
                this.common.postUrl("roleTF", "getUserAllEntityIds", {}, function (entityIds){
                    if (that.common.isNotBlank(entityIds)){
                        localStorage.setItem("entityIds", entityIds);//刷新首页重新赋值授权数据
                    }else{
                        localStorage.setItem("entityIds", []);
                    }
                    that.loadEntityEnd = true;
                });
                this.common.postUrl("sysSearchParamConfigTF", "loadSysSearchParamConfigList", {}, function (res){
                    if (that.common.isNotBlank(res))
                        localStorage.setItem("sysSearchParam", JSON.stringify(res));//刷新首页重新赋值过滤条件配置
                });
            }
            catch (e)
            {
                console.log("加载新权限出错！")
            }
            this.openTab({
                urlName: "首页",
                urlId: "10000",
                urlPath: "/pt/home/toMain.vue",
                urlPathName: "/toMain"
            })
        },
        selOrgDlg(){
            for (let i = 0; i < this.orgList.length; i++) {
                if(this.orgId==this.orgList[i].id){
                    this.selOrg(this.orgList[i]);
                    this.showOrgDialog=false;
                    break;
                }
            }
        },
        //打开一个新页面
        openTab(item) {
            this.$refs.myTab.openTab(item);
        },
        /**
         * 关闭页面
         * @param {页面id} id 
         * @param {父页面id} parentId 
         * @param {是否执行父页面方法} isDoParentMethod 
         * @param {执行父页面的方法名，不传默认doQuery} parentMethodName 
         */
        closeTab(id,parentId,isDoParentMethod,parentMethodName){
            this.$refs.myTab.close(id,parentId,isDoParentMethod,parentMethodName);
        },
        //关闭其它页面
        closeOthers() {
            this.$refs.myTab.closeOthers();
        },
        //关闭当前页面转到父级页面
        closeToOther(id){
            this.closeTab(id,this.$route.meta.parentId);
        },
        //刷新tab
        refreshTab(id,query){
            this.$refs.myTab.refresh(id,query);
        },
        //刷新全部tab
        refreshAllTab(){
            this.$refs.myTab.refreshAll();
        },
        navMenuSwitch(state){
            this.isshowNav = state;
        },
        //检测路径，如果后台有配置，则自动跳转，没用则回到首页
        checkUrl(){
            let tab = this.pageInfo;
            let visitPageInfo = this.$store.state.visitPageInfo;
            let appointPage = sessionStorage.getItem("appointPage");
            if(appointPage == 1){
                let appointPageInfo = sessionStorage.getItem("appointPageInfo");
                this.openTab(JSON.parse(appointPageInfo));
                sessionStorage.removeItem("appointPage");
                sessionStorage.removeItem("appointPageInfo");
            }else if(this.common.isNotBlank(visitPageInfo) && (this.common.isBlank(tab) || tab.urlPathName!=visitPageInfo.path)){    //访问可直接访问路径
                this.openTab({
                    urlName: decodeURI(visitPageInfo.query.urlName),
                    urlId: new Date().getTime(),
                    urlPath: visitPageInfo.path,
                    urlPathName: visitPageInfo.path,
                    query:visitPageInfo.query
                })
            }else if(this.common.isNotBlank(tab)){    //访问缓存路径
                this.openTab(tab);
            }else if(this.$route.path.indexOf('/static')>-1){
                return
            }
        },
        modifyPasswordFirst(){
            let that = this;
            let password = this.password;
            let confirmPassword = this.confirmPassword;
            if(this.common.isBlank(password)){
                this.$message.error("请输入密码!")
                return false;
            }
            if(this.common.isBlank(confirmPassword)){
                this.$message.error("请输入确认密码!")
                return false;
            }
            let param = {};
            param.password=that.$getRsaCode(password);
            param.confirmPassword=that.$getRsaCode(confirmPassword);

            this.common.postUrl("userTF", "modifyPasswordFirst", param, function (data) {
                if(data){
                    let usernfo = that.common.userInfo();
                    usernfo.passwordFlag = 9;
                    that.$forceUpdate();
                    localStorage.setItem("userInfo",JSON.stringify(usernfo));
                    that.showDialog = false;
                }
            },null,null,true);
        },
        logout(){
            let that = this;
            this.common.postUrl("userTF", "logout", {}, function (data) {
                if(data){
                    that.$store.commit('resetData',{name:'componentName',data:'login'});
                    localStorage.removeItem("defaultUrl");
                    localStorage.removeItem("token");
                    localStorage.removeItem("entityIds");
                    localStorage.removeItem("userInfo");
                    localStorage.removeItem("rememberAccount");
                    localStorage.removeItem("pageInfo");
                    const timer = new Date().getTime();
                    window.location.href=`/?ver=${timer}`;
                }
            });
        },
        sendWsMsg(){
            let that = this;
            this.common.postUrl("userTF", "sendWsMsg", {}, function (data) {
                if(data){
                    that.$message.success("发送成功！");
                }
            });
        },
        sendSmsValidCode(){
            let that=this;
            if(that.stamp){
                that.common.postUrl("userTF","webPtSendPasswordSmsValidCode", {billId:that.billId},function(data){
                    //成功执行
                    if(that.common.isNotBlank(data)){
                        that.stamp=false;
                        that.miao = 60;
                        const timer = setInterval(() =>{
                            // 某些定时器操作
                            if(!that.stamp){
                                that.miao = parseInt(that.miao) - 1;
                                that.msg = that.miao+"S后可重新获取";
                                if(that.miao == 0){
                                    that.msg="获取验证码";
                                    that.stamp=true;
                                    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
                                    that.$once('hook:beforeDestroy', () => {
                                        clearInterval(timer);
                                    })
                                }
                            }else{
                                that.msg="获取验证码";
                                that.stamp=true;
                            }
                        }, 1000);
                    }
                })
            }
        },
        async smsModifyPassword() {
            let that = this;
            if(this.common.isBlank(this.smsVaildCode)){
                this.$message.error("请输入验证码!")
                return false;
            }
            if (this.common.isBlank(this.password)) {
                this.$message.error("请输入密码!")
                return false;
            }
            if (this.common.isBlank(this.confirmPassword)) {
                this.$message.error("请输入二次确认密码!")
                return false;
            }
            if (this.password != this.confirmPassword) {
                this.$message.error("两次输入密码不一致!")
                return false;
            }
            let param = {};
            param.billId = that.billId;
            param.smsVaildCode = that.smsVaildCode;
            param.password = that.$getRsaCode(that.password);
            param.confirmPassword = that.$getRsaCode(that.confirmPassword);
            let data = await this.common.postUrl("userTF", "smsModifyPassword", param);
            if (data) {
                that.$message.success("修改密码成功！");
                that.showModifyDialog = false;
                that.smsVaildCode='';
                that.password='';
                that.confirmPassword='';
                return;
            }
        },
        selOrg(item){
            let that = this;
            this.common.postUrl("userTF", "selOrg", {orgId:item.id,regionId:item.regionId}, function (data) {
                if(data){
                    let usernfo = that.common.userInfo();
                    usernfo.orgId = item.id;
                    that.orgId = item.id;
                    that.$forceUpdate();
                    usernfo.regionId = item.regionId;
                    usernfo.orgName = item.regionName+'-'+item.orgName;
                    usernfo.oneLevelOrgId = item.oneLevelOrgId;
                    usernfo.oneLevelOrgName = item.oneLevelOrgName;
                    usernfo.workId = data.workId;
                    usernfo.workName = data.workName;
                    usernfo.linkmanName = data.linkmanName;
                    usernfo.bill = data.bill;
                    usernfo.workAddressStr = data.workAddressStr;
                    usernfo.useSapStockNums = data.useSapStockNums;
                    usernfo.loginFlg = false;
                    localStorage.setItem("userInfo",JSON.stringify(usernfo));
                    that.hideDom();
                    that.loadTodoData();
                    that.refreshAllTab();
                }
            });
        },
        // 展示右上角个人信息
        showInfoList(){
            this.isshowInfoList = true;
        },
        // 展示右上角组织
        showChiildList(){
            this.isshowChiildList = true;
        },
        // 隐藏部分弹出层
        hideDom(){
            this.isshowInfoList = false;
            this.isshowChiildList = false;
        },
        doSomething(item)
        {
            if (item.bizType == 1)
            {
                this.openTab({
                    urlId: 'supplierZCQuoteManage',
                    query: {quoteNum: item.bizNum},
                    urlName: "供应商整车报价",
                    urlPathName: "/supplierZCQuoteManage",
                    urlPath: "/pt/res/quote/supplierZCQuoteManage.vue"});
            }
            else if (item.bizType == 2)
            {
                this.openTab({
                    urlId: 'quoteManageLD',
                    query: {quoteNum: item.bizNum},
                    urlName: "供应商零担报价",
                    urlPathName: "/quoteManageLD",
                    urlPath: "/pt/res/quote/quoteManageLD.vue"});
            }
            else if (item.bizType == 3)
            {
                this.openTab({
                    urlId: 'customerZCQuoteManage' + item.tenantId,
                    query: {quoteNum: item.bizNum},
                    urlName: "客户整车报价",
                    urlPathName: "/customer",
                    urlPath: "/pt/cm/customer/quote/customerZCQuoteManage.vue"});
            }
            else if (item.bizType == 4)
            {
                this.openTab({
                    urlId: 'quoteManageLD' + item.tenantId,
                    query: {quoteNum: item.bizNum},
                    urlName: "客户零担报价",
                    urlPathName: "/customer",
                    urlPath: "/pt/cm/customer/quote/quoteManageLD.vue"});
            }
            // else if (item.bizType == 5)
            // {
            //     this.openTab({
            //         urlId: 'supplierWMSQuoteManage',
            //         query: {quoteNum: item.bizNum},
            //         urlName: "供应商仓配报价",
            //         urlPathName: "/supplierWMSQuoteManage",
            //         urlPath: "/pt/res/quote/supplierWMSQuoteManage.vue"});
            // }
            else if (item.bizType == 6)
            {
                this.openTab({
                    urlId: 1011002 + 'customerContract',
                    query: {contractNum: item.bizNum},
                    urlName: "合同管理",
                    urlPathName: "/customerContract",
                    urlPath: "/pt/cm/contract/contractManageMain.vue"});
            }
            else if (item.bizType == 7)
            {
                this.openTab({
                    urlId: 1011002 + 'supplierContract',
                    query: { openTab:2,contractNum: item.bizNum},
                    urlName: "合同管理",
                    urlPathName: "/supplierContract",
                    urlPath: "/pt/cm/contract/contractManageMain.vue"});
            }
            else if (item.bizType == 8)
            {
                this.openTab({
                    urlId: 1011002 + 'storageEquipmentContract',
                    query: { openTab:3,contractNum: item.bizNum},
                    urlName: "合同管理",
                    urlPathName: "/storageEquipmentContract",
                    urlPath: "/pt/cm/contract/contractManageMain.vue"});
            }
            else if (item.bizType == 9)
            {
                this.openTab({
                    urlId: 1011002 + 'packingContainerContract',
                    query: { openTab:4,contractNum: item.bizNum},
                    urlName: "合同管理",
                    urlPathName: "/packingContainerContract",
                    urlPath: "/pt/cm/contract/contractManageMain.vue"});
            }
            else if (item.bizType == 10)
            {
                this.openTab({
                    urlId: 1011002 + 'insuranceContract',
                    query: { openTab:5,contractNum: item.bizNum},
                    urlName: "合同管理",
                    urlPathName: "/insuranceContract",
                    urlPath: "/pt/cm/contract/contractManageMain.vue"});
            }
            else if (item.bizType == 11)
            {
                this.openTab({
                    urlId: 'supplierWmsWorkContractManage',
                    // query: {supplierId: item.tenantId, contractNum: item.bizNum},
                    query: {contractNum: item.bizNum},
                    urlName: "供应商仓储作业合同",
                    urlPathName: "/supplierWmsWorkContractManage",
                    urlPath: "/pt/res/supplierWmsWorkContractManage.vue"});
            }
            else if(item.bizType==12){
                this.openTab({
                    urlName: "仓储合同",
                    urlId: 'storeHouseSaleManage' + new Date().getTime(),
                    urlPathName: "/res",
                    urlPath: "/pt/res/storeHouseSaleManage.vue",
                    query:{
                        quoteNum: item.bizNum,
                        pId: 1001053,
                    },
                });
            }
        },
        /**
         * 跳转客户整车报价页面
         */
        gotoCustomerQuoteZCList(bizNum)
        {
            this.closeAgency();
            this.openTab({
                urlId: 'customerZCQuoteVerify'+new Date().getTime(),
                query: {todo: 1, pId: 1010006, quoteNum: bizNum},
                urlName: "客户新整车报价审核",
                urlPathName: "/customerZCQuoteVerify",
                urlPath: "/pt/cm/customer/quote/customerZCQuoteManage.vue"});
        },
        /**
         * 跳转供应商整车报价页面
         */
        gotoSupplierQuoteZCList(bizNum)
        {
            this.closeAgency();
            this.openTab({
                urlId: 'supplierZCQuoteVerify'+new Date().getTime(),
                query: {todo: 1, pId: 1010004, quoteNum: bizNum, verifyState:'0'},
                urlName: "供应商新整车报价审核",
                urlPathName: "/supplierZCQuoteVerify",
                urlPath: "/pt/res/quote/supplierZCQuoteVerify.vue"});
        },
        /**
         * 跳转接单拒单页面
         */
        gotoTodoOrder()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'receiveOrRefuseOrder'+new Date().getTime(),
                query: {pId: 1010010},
                urlName: "接单拒单列表",
                urlPathName: "/receiveOrRefuseOrderManage",
                urlPath: "/pt/ord/order/todo/receiveOrRefuseOrderManage.vue"});
        },
        gotoRegionOrder()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'cdtRegionOrderMain'+new Date().getTime(),
                query: {pId: 1003030},
                urlName: "区域协同管理",
                urlPathName: "/cdtRegionOrderMain",
                urlPath: "/pt/ord/cdt/cdtRegionOrderMain.vue"});
        },
        /**
         * 跳转客户零担报价审核页面
         */
        gotoCustomerQuoteLDList(bizNum)
        {
            this.closeAgency();
            this.openTab({
                urlId: 'customerQuoteLd'+new Date().getTime(),
                query: {pId: 1010007, quoteNum: bizNum},
                urlName: "客户零担新报价审核",
                urlPathName: "/quote",
                urlPath: "/pt/cm/customer/quote/quoteManageVerifyLD.vue"});
        },
        /**
         * 跳转供应商零担报价审核页面
         */
        gotoSupplierQuoteLDList(bizNum)
        {
            this.closeAgency();
            this.openTab({
                urlId: 'supplierQuoteLd'+new Date().getTime(),
                query: {pId: 1010005, quoteNum: bizNum},
                urlName: "供应商零担新报价审核",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/quoteManageVerifyLD.vue"});
        },
        gotoIncomeFeeManage(){
            this.closeAgency();
            this.openTab({
                urlId: 'incomeFeeManage'+new Date().getTime(),
                query: {verifyState:'0', pId: 1001111},
                urlName: "收入费用异动",
                urlPathName: "/incomeFeeStatementManage",
                urlPath: "/pt/ord/order/incomeFeeStatementManage.vue"});
        },
        gotoCostFeeManage(){
            this.closeAgency();
            this.openTab({
                urlId: 'costFeeManage'+new Date().getTime(),
                query: {verifyState:'0', pId: 1002028},
                urlName: "成本费用异动",
                urlPathName: "/feeChangeManage",
                urlPath: "/pt/ord/waybill/feeChangeManage.vue"});
        },

        /**
         * 费用补录
         */
        gotoFeeChangeManage(tab)
        {
            this.closeAgency();
            this.openTab({
                urlId: 'feechangeMain'+new Date().getTime(),
                query: {sts: [1,2], openTab: tab},
                urlName: "费用补录",
                urlPathName: "/feechangeMain",
                urlPath: "/pt/fc/financialCenter/feechangeMain.vue"});
        },
        /**
         * 开票申请处理
         */
        gotoApplyInvoice()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'applyInvoiceManage'+new Date().getTime(),
                query: {verifyState: "0", pId: 1006007},
                urlName: "客户开票申请",
                urlPathName: "/invoice",
                urlPath: "/pt/fc/invoice/applyInvoiceManage.vue"});
        },
        /**
         * 发票提交处理
         */
        gotoSubmitInvoice()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'submitInvoiceManage'+new Date().getTime(),
                query: {verifyState: "0", pId: 1006008},
                urlName: "供应商发票提交",
                urlPathName: "/invoice",
                urlPath: "/pt/fc/invoice/submitInvoiceManage.vue"});
        },
        /**
         * G7付款申请审核
         */
        gotoG7PayApplyVerify()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'G7PayApplyVerify'+new Date().getTime(),
                query: {syncState: 0, pId: 1006015},
                urlName: "G7付款申请审核",
                urlPathName: "/g7Bill",
                urlPath: "/pt/fc/g7Bill/payApplyVerify.vue"});
        },
        /**
         * 高登付款申请审核
         */
        gotoGdPayApplyVerify()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'gdPayApplyVerify'+new Date().getTime(),
                query: {verifyState: "0", pId: 1006018},
                urlName: "高登付款申请审核",
                urlPathName: "/gdBill",
                urlPath: "/pt/fc/gdBill/payApplyVerify.vue"});
        },
        /**
         * 自有车成本记账
         */
        gotoCostAccount()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'costAccountManage'+new Date().getTime(),
                query: {verifyState: "0", pId: 1006009},
                urlName: "自有车成本记账",
                urlPathName: "/invoice",
                urlPath: "/pt/fc/invoice/costAccountManage.vue"});
        },
        gotoProjectSundryFeeManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'prjSundryFeeManage1'+new Date().getTime(),
                query: {paySts: '0',pId: 1002033},
                urlName: "供应商其他费用",
                urlPathName: "/sundry",
                urlPath: "/pt/fc/sundry/prjSundryFeeManage.vue?t=1&showTabs=1&supplierType=1"});//跳转个人  阿涛定的
        },
        /**
         * 客户账单待确认
         */
        gotoCustomerBill()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'customerBillManageMain'+new Date().getTime(),
                query: {verifyState: "0", pId: 1001142},
                urlName: "客户账单待审核",
                urlPathName: "/customerBillManageMain",
                urlPath: "/pt/fc/custBill/customerBillManageMain.vue"});
        },
        /**
         * 供应商账单待确认
         */
        gotoSupplierBill()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'supplierBillManageMain'+new Date().getTime(),
                query: {verifyState: "0", pId: 1002035},
                urlName: "供应商账单待审核",
                urlPathName: "/supplierBillManageMain",
                urlPath: "/pt/fc/supplierBill/supplierBillManageMain.vue"});
        },
        /**
         *
         */
        gotoReceiptsRequestFeeManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'verify1006105'+new Date().getTime(),
                query: {type: 1, pId: 1006105, verifyStateFlag: 1},
                urlName: "单据审批管理",
                urlPathName: "/receiptsManageMain",
                urlPath: "/pt/fc/receipts/receiptsManageMain.vue"});
        },
        /**
         *
         */
        gotoReceiptsFeePayManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'verify1006105'+new Date().getTime(),
                query: {type: 2, pId: 1006105, verifyStateFlag: 1},
                urlName: "单据审批管理",
                urlPathName: "/receiptsManageMain",
                urlPath: "/pt/fc/receipts/receiptsManageMain.vue"});
        },
        /**
         * 采购申请审核
         */
        gotoPurchaseApplyManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: '1009002&fromHome'+new Date().getTime(),
                query: {verifyState: [1,0], openTab: 1, currentVerifyUserName: this.common.userInfo().userName},
                urlName: "采购申请审核管理",
                urlPathName: "/bizManageMain",
                urlPath: "/pt/biz/bizManageMain.vue"});
        },
        /**
         * 物品领用审核审核
         */
        gotoClaimApplyManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: '1009002&fromHome'+new Date().getTime(),
                query: {verifyState: [1,0], openTab: 2, currentVerifyUserName: this.common.userInfo().userName},
                urlName: "物品领用审核",
                urlPathName: "/bizManageMain",
                urlPath: "/pt/biz/bizManageMain.vue"});
        },
        /**
         * 固定资产调拨审核
         */
        gotoAssetsAllocatManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: '1009002&fromHome'+new Date().getTime(),
                query: {verifyState: [1,0], openTab: 3, currentVerifyUserName: this.common.userInfo().userName},
                urlName: "固定资产调拨审核",
                urlPathName: "/bizManageMain",
                urlPath: "/pt/biz/bizManageMain.vue"});
        },
        gotoPage(path,pathName,urlName){
            this.closeAgency();
            this.openTab({
                urlId: "urlId"+new Date().getTime(),
                query: {todo:1},
                urlName: urlName,
                urlPathName: "/"+pathName,
                urlPath: path});
        },
        /**
         * 运力&计划匹配列表
         */
        gotoScheduleTodoManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'scheduleTodoManage'+new Date().getTime(),
                query: {fromHome: 1},
                urlName: "运力&计划匹配列表",
                urlPathName: "/scheduleTodoManage",
                urlPath: "/pt/ord/scheduleTodoManage.vue"});
        },
        /**
         * 询价管理
         */
        gotoSectionQuoteManage()
        {
            this.closeAgency();
            this.openTab({
                urlId: 'sectionQuoteManage'+new Date().getTime(),
                query: {rfqSts:3,selVerifyState:1,verifyState:0},
                urlName: "询价管理",
                urlPathName: "/sectionQuoteManage",
                urlPath: "/pt/res/sectionQuote/sectionQuoteManage.vue"});
        },
        /**
         * 询价管理
         */
        gotoContractReviewManage(type)
        {
            this.closeAgency();
            this.openTab({
                urlId: 'contractReviewManageMain'+new Date().getTime(),
                query: {userName:this.common.userInfo().userName,openTab: type},
                urlName: "合同评审",
                urlPathName: "/contractReviewManageMain",
                urlPath: "/pt/cm/contract/review/contractReviewManageMain.vue"});
        },
        /**
         * 加载待办数目
         * @returns {Promise<void>}
         */
        async loadTodoData()
        {
            if ("localhost" != location.hostname) //本地用于调试不刷新代办和跑马灯数据
            {
              this.todo = await this.common.postUrl("userTF", "loadTodoData", {});
              // await this.loadMarqueeListData();
            }
        },
        /**
         * 加载跑马灯数据
         * @returns {Promise<void>}
         */
        async loadMarqueeListData()
        {
            this.marqueeList = await this.common.postUrl("homeCollectTF", "queryHomeMarqueeList", {rows: 999});
            this.$forceUpdate();
        },
        /**
         * 展示代办事项侧边栏
         */
        showAgency(){
            this.isshowAgency = true;
        },
        /**
         * 隐藏代办事项侧边栏
         */
        closeAgency(){
            this.isshowAgency = false;
        },
        init: async function () {
            if (typeof (WebSocket) === "undefined") {
                this.$message.success("您的浏览器不支持socket");
            } else {
                let searchValue = window.location.host.indexOf("1000e56.com") > -1 ? 'https://' : 'http://';
                var url = document.location.toString().replace(searchValue, '');
                var ip;
                if (url.indexOf(":") > 0) {
                    ip = url.substring(0, url.indexOf(":"));
                } else {
                    ip = url.substring(0, url.indexOf("/"));
                }
                if (ip == 'pt.1000e56.com') {
                    //生产环境映射1000端口号
                    url = "wss://" + ip + ":1000/ws";
                } else {
                    url = "ws://" + ip + "/ws";
                }

                // console.log("WebSocket url:" + url);
                // 实例化socket
                this.socket = new WebSocket(url);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                this.socket.onerror = this.error;
                // 监听socket消息
                this.socket.onmessage = this.getMessage;
                this.socket.onclose = this.close;
            }

            let usernfo = this.common.userInfo();
            if(usernfo.workId){
                let workInfo = await this.common.postUrl("userTF", "getWorkInfo", {workId: usernfo.workId});
                usernfo.useSapStockNums = workInfo.useSapStockNums;
                localStorage.setItem("userInfo",JSON.stringify(usernfo));
            }
        },
        close:function (e){
            // eslint-disable-next-line no-console
            console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
            // eslint-disable-next-line no-console
            console.log(e)
        },
        open: function () {
            // eslint-disable-next-line no-console
            console.log("socket连接成功")
        },
        error: function (e) {
            // eslint-disable-next-line no-console
            console.log(e)
            // this.$message.success("连接错误");
        },
        getMessage: function (msg) {
            // this.$message.success(msg.data);
            this.agencyNotify(msg.data);
        },
        agencyNotify(msgDataStr) {
            let _this = this;
            let msgData = JSON.parse(msgDataStr);
            let notify = this.$notify({
                title: '提醒',
                duration: 0,
                position: 'bottom-right',
                dangerouslyUseHTMLString: true,
                message: '<strong style="cursor:pointer;"><a class="link">'+msgData.content+'</a></strong>',
                onClick(){
                    if(msgData.type==1||msgData.type==2){
                        let query = {pId: 1002024,waybillNums:msgData.relIds};
                        _this.openTab({
                            urlId: 'waybillManage',
                            query: query,
                            urlName: '派车单管理',
                            urlPathName: '',
                            urlPath: '/pt/ord/waybill/waybillManage.vue'});
                    }
                    notify.close();
                }
            });
        },
        send: function () {
            // this.socket.send(params);
        },
        // 收藏菜单
        async queryUserMenuLabelData(){
            this.userMenuLabel = await this.common.postUrl("userTF", "queryUserMenuLabelData");
        },
        // 删除菜单
        async delUserMenuLabel(id){
            await this.common.postUrl("userTF", "delUserMenuLabel",{id}, null, null, null, true);
            await this.queryUserMenuLabelData();
            this.$message({message: '删除成功',type: 'success'});
            this.$refs.navMenu.initAllMenus();
        },
        // 菜单跳转
        toUserMenuLabel(item){
            this.openTab({
                urlId: item.menuId,
                urlName: item.menuName,
                urlPath: item.menuPath,
                parentId:item.parentId,
                entityId:item.entityId,
                query:{
                    pId:item.parentId
                }
            });
        },
        // 查询帮助中心
        async queryHelps(){
            this.quesList = await this.common.postUrl("hcQuestionTF", "queryAllQuestionList");
            this.quesListShow = this.common.copyObj(this.quesList);
        },
        async queryOnlineNotice() {
            this.noticeList = await this.common.postUrl("projRequirementTF", "queryRemindOnlineInfo");
            if(this.noticeList.length>0){
                this.isShowRealTranslationInfos = true;
            }
            // this.setCurrentNoticeInfo();
        },
        setCurrentNoticeInfo(){
            let noticeSecStr = '';
            this.isShowRealTranslationInfos = false;
            if(this.noticeList.length>0){
                this.noticeFlag = true;
                this.noticeInfo = this.noticeList[0];
                if(this.noticeList.length>1){
                    this.noticeBtnStr = '下一条';
                    noticeSecStr = 's后自动切换下一条';
                    this.noticeHaveMore=true;
                }else{
                    this.noticeBtnStr = '立即关闭';
                    noticeSecStr = 's后自动关闭此窗口';
                    this.noticeHaveMore=false;
                }

                this.noticeList.splice(0,1);
                let that  = this;
                clearInterval(that.noticeTimer);
                this.stamp=false;
                this.miao = 10;
                this.noticeSecStr = this.miao + noticeSecStr;
                this.noticeTimer = setInterval(() => {
                    // 某些定时器操作
                    if (!that.stamp) {
                        that.miao = parseInt(that.miao) - 1;
                        that.noticeSecStr = that.miao + noticeSecStr;
                        if (that.miao == 0) {
                            that.noticeSecStr = "";
                            that.stamp = true;
                            // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
                            that.$once('hook:beforeDestroy', () => {
                                clearInterval(that.noticeTimer);
                            });
                            that.noticeSubmit();
                        }
                    } else {
                        that.noticeSecStr = "";
                        that.stamp = true;
                    }
                },1000);
            }
        },
        viewRequirement(){
            this.openTab({
                urlId: 'viewRequirement' + new Date().getTime(),
                query: {id:this.noticeInfo.requirementId},
                urlName: "需求详情",
                urlPathName: "/viewRequirement",
                urlPath: "/pt/proj/requirement/requirementDetail.vue"});
            this.noticeFlag = false;
            this.saveReadRemindOnlineInfo(this.noticeInfo.id);
            if(this.noticeHaveMore){
                this.isShowRealTranslationInfos = true;
            }
        },
        noticeSubmit(){
            //把当前数据处理掉关闭
            this.saveReadRemindOnlineInfo(this.noticeInfo.id);
            if(this.noticeHaveMore){//说明是有下一条
                this.setCurrentNoticeInfo();
            }else{
                this.noticeFlag = false;
            }
        },
        saveReadRemindOnlineInfo(id){
            clearInterval(this.noticeTimer);
            this.common.postUrl("projRequirementTF", 'saveReadRemindOnlineInfo', {id});
        },

        // 过滤帮助中心
        filterHelpCenter(){
            this.quesListShow = [];
            this.quesList.forEach(item => {
                if(item.typeName.indexOf(this.helpCenterModel)>-1){
                    this.quesListShow.push(item);
                }else{
                    let details = [];
                    item.details.forEach(el => {
                        if(el.name.indexOf(this.helpCenterModel)>-1){
                            details.push(el);
                        }
                    })
                    if(details.length>0){
                        let obj = {
                            details,
                            typeName:item.typeName,
                            type:item.type
                        }
                        this.quesListShow.push(obj);
                    }
                }
            })
        },
        // 跳到帮助中心
        toHelp(id){
            this.openTab({
                query: {type: 3,id},//type 1 新增 2 修改 3 查看
                urlId: 'questionDetail'+id,
                urlName: '查看问题',
                urlPathName: '/questionDetail',
                urlPath: "/pt/base/hc/qa/questionDetail.vue",
            });
            this.isshowHelpCenter = false;
        },
        // 跳到个人资料
        toPersonal(){
            this.openTab({
                urlId: 'personal',
                urlName: '个人资料',
                urlPathName: '/personal',
                urlPath: "/pt/home/personal.vue",
            });
        },
        // 全局引入百度地图
        initMap(){
            const script1 = document.createElement('script');
            script1.setAttribute("type", "text/javascript");
            script1.setAttribute("src", "https://api.map.baidu.com/api?v=2.0&ak=ZZPMXMsHVRLZzHR6GUBRcGA2YfqzXOcG&s=1&callback=onBMapCallback");
            document.body.appendChild(script1);
            window.onBMapCallback = function () {
                console.log("百度地图脚本初始化成功...");
                const script2 = document.createElement('script');
                script2.src = "https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js";
                document.body.appendChild(script2);
                const script3 = document.createElement('script');
                script3.src = "/static/map/LuShu.js";
                document.body.appendChild(script3);
            };
        },
        // 跳转到薪资系统
        async toSalary(){
            let token = localStorage.getItem("token");
            let site = "https://salary.1000e56.com";
            let url = site + "?token=" + token;
            window.open(url);
        },
    },
    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close;
        clearInterval(this.todoInterval);
    }
}
