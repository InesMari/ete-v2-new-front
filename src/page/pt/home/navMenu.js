export default {
    name: 'navMenu',
    data() {
        return {
            tabs:[],
            routeId:'-1',
            isshowNav:true,
            allMenus:[],    //所有菜单(二级)
            menuSearch:"",
            isshowMenuList:false,
        }
    },
    mounted() {
        this.initDevTab();
        this.loadMenuTree();
        this.initAllMenus();
        this.$nextTick(()=>{
            this.routeId = this.$store.state.routeId+'';

        })
    },
    components: {
        
    },
    methods: {
        openTab(item){
            item.query = item.query?item.query:{};
            item.query.pId = item.entityId;
            this.$emit("openTab",item);
            this.openMenuList(false);
        },
        openMenuList(flag)
        {
            if (flag)
            {
                if (this.isshowMenuList)
                    this.isshowMenuList = false;
                else
                    this.isshowMenuList = flag;
            }
            else
                this.isshowMenuList = flag;
            this.$forceUpdate();
        },
        /**
         * 加载菜单树
         */
        async loadMenuTree()
        {
            let data = await this.common.postUrl("menuTF", "loadMenuTree",{});
            this.tabs = [...this.tabs,...data];
        },
        // 初始化所有菜单
        async initAllMenus(){
            this.allMenus = await this.common.postUrl("menuTF", "loadMenuTree",{});
            if(this.common.isNotBlank(this.menuSearch)){
                this.searchMenu();
            };
        },
        /*
        * 侧边栏展示隐藏
        */
        navMenuSwitch(){
            this.isshowNav = this.isshowNav?false:true;
            this.$emit("navMenuSwitch",this.isshowNav);
        },
        // 外部调用方法,内部操作过后，拦截外部调用
        navMenuSwitchTab(state){
            if(!this.isNavMenuSwitchOp){
                this.isshowNav = state
                this.$emit("navMenuSwitch",this.isshowNav);
            }
        },
        // 是否操作过侧边栏展示隐藏
        navMenuSwitchOp(){
            this.isNavMenuSwitchOp = true;
        },
        /**
         * 搜素菜单
         */
        searchMenu(){
            this.menuSearchList = [];
            this.eachMenus(this.allMenus);
        },
        /**
         * 深度遍历所有菜单
         */
        eachMenus(data){
            data.forEach(el => {
                if(el.urlName.indexOf(this.menuSearch)>-1 && el.parentId!=10000 && el.parentId!=-1){
                    this.menuSearchList.push(el);   //插值
                }
                // 递归
                if(el.children.length>0){
                    this.eachMenus(el.children);
                }
            })
            this.$forceUpdate();
        },
        /**
         * 收藏/取消收藏菜单
         */
        collect(menu){
            let _this = this;
            menu.menuId = menu.id;
            if(menu.favoritesFlag==0){
                _this.$confirm('是否收藏'+menu.urlName, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    _this.common.postUrl("userTF", "saveUserMenu",menu,function(){
                        _this.$message({
                            type: 'success',
                            message: '收藏成功!'
                        });
                        _this.initAllMenus();
                        _this.$parent.queryUserMenuLabelData();
                    });
                });
            }else if(menu.favoritesFlag==1){
                _this.$confirm('是否取消收藏'+menu.urlName, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    _this.common.postUrl("userTF", "delUserMenu",{menuId:menu.menuId},function(){
                        _this.$message({
                            type: 'success',
                            message: '取消收藏成功!'
                        });
                        _this.initAllMenus();
                        _this.$parent.queryUserMenuLabelData();
                    });
                });
            }
        },
        initDevTab(){
            if(window.location.href.indexOf('localhost')>-1){
                this. tabs = [
                    {
                        urlName: "demo(本地才显示)",
                        urlId: "000",
                        children:[
                            {
                                urlName: "上传下载",
                                urlId: "myImportDownDemo",
                                urlPath: '/demo/myImportDownDemo/myImportDownDemo.vue',
                                urlPathName: "/myImportDownDemo",
                                children:[]
                            },
                            {
                                urlName: "经营数据",
                                urlId: "operatingDataMain",
                                urlPath: '/pt/dataReport/operatingData/operatingDataMain.vue',
                                urlPathName: "/operatingDataMain",
                                children:[]
                            },
                            {
                                urlName: "标准成本",
                                urlId: "standardCost",
                                urlPath: '/pt/fc/standardCost/standardCostMain.vue',
                                urlPathName: "/standardCost",
                                children:[]
                            },
                            {
                                urlName: "零星收入",
                                urlId: "insuranceRebate",
                                urlPath: '/demo/insuranceRebate/insuranceRebate.vue',
                                // urlPath: '/pt/fc/sporadic/sporadicIncomeMain.vue',
                                urlPathName: "/insuranceRebate",
                                children:[]
                            },
                            {
                                urlName: "巡检详情",
                                urlId: "inspectionDetail",
                                urlPath: '/demo/inspectionDetail/inspectionDetail.vue',
                                urlPathName: "/inspectionDetail",
                                children:[]
                            },
                            {
                                urlName: "巡检打印",
                                urlId: "inspectionPrintCode",
                                urlPath: '/demo/inspectionPrintCode/inspectionPrintCode.vue',
                                urlPathName: "/inspectionPrintCode",
                                children:[]
                            },
                            {
                                urlName: "巡检-未选定",
                                urlId: "inspectionScan",
                                urlPath: '/demo/inspectionScan/inspectionScan.vue',
                                urlPathName: "/inspectionScan",
                                children:[]
                            },
                            {
                                urlName: "经营分析",
                                urlId: "businessAnalysisMain",
                                urlPath: '/pt/fc/businessAnalysis/businessAnalysisMain.vue',
                                urlPathName: "/businessAnalysisMain",
                                children:[]
                            },
                            {
                                urlName: "实绩-详情",
                                urlId: "actualDetail",
                                urlPath: '/demo/budget/actualDetail.vue',
                                urlPathName: "/actualDetail",
                                children:[]
                            },
                            {
                                urlName: "实绩-审核",
                                urlId: "actualAudit",
                                urlPath: '/demo/budget/actualAudit.vue',
                                urlPathName: "/actualAudit",
                                children:[]
                            },
                            {
                                urlName: "大华监控",
                                urlId: "videoPlayer",
                                urlPath: '/demo/videoPlayer/videoPlayer.vue',
                                urlPathName: "/videoPlayer",
                                children:[]
                            },
                            {
                                urlName: "邮件html模板",
                                urlId: "emailTemp",
                                urlPath: '/demo/emailTemp/emailTemp.vue',
                                urlPathName: "/emailTemp",
                                children:[]
                            },
                            {
                                urlName: "月成本详情",
                                urlId: "monthlyCostDetail",
                                urlPath: '/demo/monthlyCostDetail/monthlyCostDetail.vue',
                                urlPathName: "/monthlyCostDetail",
                                children:[]
                            },
                            // {
                            //     urlName: "车辆监控管理",
                            //     urlId: "wmsPackMaterialManage",
                            //     urlPath: '/pt/res/vehicleWorkRecordManage.vue',
                            //     urlPathName: "/vehicleWorkRecordManage",
                            //     children:[]
                            // },
                            {
                                urlName: "新增任务",
                                urlId: "addTask",
                                urlPath: '/demo/task/addTask.vue',
                                urlPathName: "/addTask",
                                children:[]
                            },
                            {
                                urlName: "任务详情",
                                urlId: "taskDetail",
                                urlPath: '/demo/task/taskDetail.vue',
                                urlPathName: "/taskDetail",
                                children:[]
                            },
                            // {
                            //     urlName: "供应商作业合同管理",
                            //     urlId: "demo18",
                            //     urlPath: '/pt/res/supplierWmsWorkContractManage.vue',
                            //     urlPathName: "/supplierWmsWorkContractManage",
                            //     children:[]
                            // },
                            // {
                            //     urlName: "仓储作业单",
                            //     urlId: "demo17",
                            //     urlPath: '/pt/wms/workOrder/wmsWorkOrderManage.vue',
                            //     urlPathName: "/wmsWorkOrderManage",
                            //     children:[]
                            // },
                            {
                                urlName: "礼品方案登记",
                                urlId: "demo16",
                                urlPath: '/pt/biz/gift/giftManage.vue',
                                urlPathName: "/giftManage",
                                children:[]
                            },
                            {
                                urlName: "条形码详情",
                                urlId: "demo14",
                                urlPath: '/demo/codeDetail/codeDetail.vue',
                                urlPathName: "/codeDetail",
                                children:[]
                            },
                            {
                                urlName: "条形码打印预览",
                                urlId: "demo13",
                                urlPath: '/demo/codePrintView/codePrintView.vue',
                                urlPathName: "/codePrintView",
                                children:[]
                            },
                            {
                                urlName: "预算达成",
                                urlId: "demo12",
                                urlPath: '/demo/budgetAchievement/budgetAchievement.vue',
                                urlPathName: "/list",
                                children:[]
                            },
                            {
                                urlName: "打印入库单",
                                urlId: "demo11",
                                urlPath: '/demo/printWarehousingOrder/printWarehousingOrder.vue',
                                urlPathName: "/printWarehousingOrder",
                                children:[]
                            },
                            {
                                urlName: "入库单详情",
                                urlId: "demo10",
                                urlPath: '/demo/warehousingDetail/warehousingDetail.vue',
                                urlPathName: "/warehousingDetail",
                                children:[]
                            },
                            // {
                            //     urlName: "新增付款单",
                            //     urlId: "demo9",
                            //     urlPath: '/demo/addPaymentOrder/addPaymentOrder.vue',
                            //     urlPathName: "/addPaymentOrder",
                            //     children:[]
                            // },
                            // {
                            //     urlName: "新增请款单",
                            //     urlId: "demo8",
                            //     urlPath: '/demo/cashOutOrder/cashOutOrder.vue',
                            //     urlPathName: "/cashOutOrder",
                            //     children:[]
                            // },
                            {
                                urlName: "视频监控",
                                urlId: "demo7",
                                urlPath: '/demo/ysMonitor/EZUIKitJs.vue',
                                urlPathName: "/EZUIKitJs.vue",
                                children:[]
                            },
                            {
                                urlName: "富文本示例",
                                urlId: "demo6",
                                urlPath: '/demo/wangEditorDemo/wangEditorDemo.vue',
                                urlPathName: "/wangEditorDemo.vue",
                                children:[]
                            },
                            {
                                urlName: "按钮权限",
                                urlId: "demo4",
                                urlPath: '/pt/base/auth/entityButton/entityButton.vue',
                                urlPathName: "/entityButton.vue",
                                children:[]
                            },
                            {
                                urlName: "人员招聘",
                                urlId: "demo3",
                                urlPath: '/pt/hr/recruit/recruitManage.vue',
                                urlPathName: "/recruitManage.vue",
                                children:[]
                            },
                            {
                                urlName: "招聘详情",
                                urlId: "demo2",
                                urlPath: '/pt/hr/recruit/applicantDetail.vue',
                                urlPathName: "/applicantDetail.vue",
                                children:[]
                            },
                            {
                                urlName: "旧版器具登记",
                                urlId: "demo1",
                                urlPath: '/pt/wms/base/wmsPackMaterialManage.vue',
                                urlPathName: "/wmsPackMaterialManage.vue",
                                children:[]
                            },
                            {
                                urlName: "管理成本",
                                urlId: "hrManagementCostManage",
                                urlPath: '/pt/hr/cost/hrManagementCostManage.vue',
                                urlPathName: "/hrManagementCostManage.vue",
                                children:[]
                            },
                        ]
                    },
                ]
            }
        }
    }
}