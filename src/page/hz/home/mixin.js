export default {
    data() {
        return {
            tabsCache: [
                {
                      urlName: "demo",
                      urlId: "123321",
                      children:[
                          {
                              urlName: "demo列表",
                              urlId: "123456",
                              children:[
                                  {
                                      urlName: "demo",
                                      urlId: "11111",
                                      urlPath: '/demo/demo/demo.vue',
                                      urlPathName: "/demo"
                                  },
                                  {
                                      urlName: "树形",
                                      urlId: "5412",
                                      urlPath: "/demo/permission/permission.vue",
                                      urlPathName: "/permission"
                                  },
                                  {
                                      urlName: "新增/修改运价",
                                      urlId: "54312",
                                      urlPath: "/demo/addfee/addfee.vue",
                                      urlPathName: "/addfee"
                                  },
                                  {
                                      urlName: "运单详情",
                                      urlId: "4434433",
                                      urlPath: "/demo/orderxq/orderxq.vue",
                                      urlPathName: "/orderxq"
                                  },
                                  {
                                      urlName: "运单录入设置",
                                      urlId: "432",
                                      urlPath: "/demo/billing/billingSet.vue",
                                      urlPathName: "/billingSet"
                                  },
                                  {
                                      urlName: "客户pc端权限",
                                      urlId: "432322",
                                      urlPath: "/demo/pcLimits/pcLimits.vue",
                                      urlPathName: "/pcLimits"
                                  },
                                  {
                                      urlName: "双表格",
                                      urlId: "24124",
                                      urlPath: "/demo/dbTableDemo/dbTableDemo.vue",
                                      urlPathName: "/dbTableDemo"
                                  },
                                  {
                                      urlName: "批量跟踪",
                                      urlId: "rr432",
                                      urlPath: "/demo/batchTarckDemo/batchTarckDemo.vue",
                                      urlPathName: "/batchTarckDemo"
                                  },
                                  {
                                      urlName: "提交开票",
                                      urlId: "submitInvoice",
                                      urlPath: "/demo/submitInvoice/submitInvoice.vue",
                                      urlPathName: "/submitInvoice"
                                  },
                                  {
                                      urlName: "开票登记",
                                      urlId: "registerInvoice",
                                      urlPath: "/demo/registerInvoice/registerInvoice.vue",
                                      urlPathName: "/registerInvoice"
                                  },
                                  {
                                      urlName: "平台录入",
                                      urlId: "3232343",
                                      urlPath: "/order/billing/billingPlat.vue",
                                      urlPathName: "/billingPlat"
                                  },
                                  {
                                      urlName: "财务日记账",
                                      urlId: "ttttg",
                                      urlPath: "/demo/cwrjz/cwrjz.vue",
                                      urlPathName: "/cwrjz"
                                  },
                                  {
                                      urlName: "科目自定义",
                                      urlId: "kmzdy",
                                      urlPath: "/demo/subjectDef/subjectDef.vue",
                                      urlPathName: "/subjectDef"
                                  },
                                  {
                                      urlName: "新增手工账",
                                      urlId: "xzkgz",
                                      urlPath: "/demo/addLabourAccount/addLabourAccount.vue",
                                      urlPathName: "/addLabourAccount"
                                  },
                                  {
                                      urlName: "包装箱",
                                      urlId: "bzx",
                                      urlPath: "/demo/package/package.vue",
                                      urlPathName: "/package"
                                  },
                                  {
                                      urlName: "定义模板",
                                      urlId: "dymb",
                                      urlPath: "/demo/dymb/dymb.vue",
                                      urlPathName: "/dymb"
                                  },
                                  {
                                      urlName: "echart图表",
                                      urlId: "echart",
                                      urlPath: "/demo/echartDemo/echartDemo.vue",
                                      urlPathName: "/echartDemo"
                                  },
                                
                              ]
                          }
                      ]
                  },
                
            ],
            sysMenuUse:[],
            sysUserOragnizeList:[],
            sysUserRegion:[],
            userName:null,
            tenantName:null,
            orgName:null,
            oragnizeName:null,
            menuSearch:"",  //菜单搜索
            menuSearchList:[],//菜单搜索列表
            menuPage:false,//是否展示菜单页
            usuallyUse:false,//展示我的常用
            isShowSlider:true,//是否展示侧边栏
            showMenuSearchState:false,//侧边栏缩起时是否展开搜索栏
        }
    },
    mounted() {
        this.initResize();
        this.initTabsCache();
        this.checkUrl();
        this.initWebSocket();
        this.initHeight();
    },
    methods:{   
        initResize(){
            console.log(1);
            let _this = this;
            window.onresize = function(){
                _this.initHeight()
                _this.common.initTableHeight();
            }
        },
        initTabsCache(){
            if(!this.common.isLocalHost()){
                this.tabsCache = [];
            }
        },
        //初始化websocket
        initWebSocket(){
            let that = this;
            that.common.startWebSocket(function(data){
                console.log(data);
                // socket 推送逻辑
                if(that.common.isNotBlank(data.pushContentOut)){
                    that.$message({"type":"success", message: data.pushContentOut.text});   
                    return;
                }else{
                    console.log("推送格式非法");
                }
               
            }); 
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
        //关闭当前页面转到父级页面
        closeToOther(id){
            this.closeTab(id,this.$route.meta.parentId);
        },
        //是否展示菜单页
        isShowMenuPage(isShow){
            this.menuPage = isShow;
        },
        //检测路径，如果后台有配置，则自动跳转，没用则回到首页
        checkUrl(){
            let tab = JSON.parse(localStorage.getItem("pageInfo"));
            if(this.common.isNotBlank(tab)){
                this.openTab(tab);
            }else if(this.$route.path.indexOf('/static')>-1){
                return
            }else{
                this.$router.push('/');
            }
        },
        getTab(){
            let that = this;
            let url = "api/sysMenuBO.ajax?cmd=getSysMenu";
            this.common.postUrl(url,{},function(data){
                that.tabsCache.push(...data.items);
                that.checkUrl();
            })
        },
        getSysMenuButton(){
            let that = this;
            let url = "api/sysMenuBO.ajax?cmd=getSysMenuButton";
            this.common.postUrl(url,{},function(data){
                localStorage.setItem("entityIds",data)
            });
        },
        showChild(tab){
            if(this.isShowSlider) return
            tab.isOpen = true
            this.$forceUpdate();
        },
        hideChild(tab){
            if(this.isShowSlider) return
            tab.isOpen = false
            this.$forceUpdate();
        },
        //tab展开收起
        openChild(tab){
            tab.isOpen = tab.isOpen?false:true;
            this.$forceUpdate();
        },
        //计算内容高度
        initHeight(){
            let windowH = window.innerHeight;
            let headerH = this.$refs.header.offsetHeight;
            this.$refs.maincontent.style.height = (windowH - headerH -1) + 'px';
            this.$refs.mainFrame.style.height = (windowH - headerH - 42) + 'px';
        },
        //保存常用菜单
        doSaveSysMenuUse:function (tab3) {
            let that = this;
            let url = "api/sysMenuBO.ajax?cmd=doSaveSysMenuUse";
            that.$confirm("确认设置此菜单为常用菜单？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.common.postUrl(url,{"urlId": tab3.urlId},function (data) {
                    if(data != 'success'){
                        return;
                    }else {
                        that.getSysMenuUse();
                        that.$message({
                            type: 'success',
                            message: "操作成功"
                        });
                    }
                });
            });
        },
        //删除常用菜单
        deleteSysMenuUse:function (tab3) {
            let that = this;
            let url = "api/sysMenuBO.ajax?cmd=deleteSysMenuUse";
            that.$confirm("确认删除常用菜单？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.common.postUrl(url,{"id": tab3.id},function (data) {
                    if(data != 'success'){
                        return;
                    }else {
                        that.getSysMenuUse();
                        that.$message({
                            type: 'success',
                            message: "操作成功"
                        });
                    }
                });
            });
        },
        //获取常用菜单
        getSysMenuUse(){
            let that = this;
            let url = "api/sysMenuBO.ajax?cmd=getSysMenuUse";
            this.common.postUrl(url,{},function(data){
                 that.sysMenuUse = data.items;
            });
        },
        //获取cookie
        getCookie(){
            let that  = this;
            that.userName = this.common.getCookie("userName");
            that.tenantName = this.common.getCookie("tenantName");
            that.orgName = this.common.getCookie("orgName");
        },
        //获取部门下拉
        getSysUserOragnize(){
            let that = this;
            that.userId = this.common.getCookie("userId");
            let url = "api/sysOragnizeBO.ajax?cmd=getUserOragnizeList";
            this.common.postUrl(url,{"userId":that.userId},function(data){
                that.sysUserOragnizeList = data.items;
                if(data.items.length > 0){
                    that.oragnizeName = data.items[0].oragnizeName;
                }
                that.sysUserOragnizeList.splice(0,1);
            });
        },
        //获取区域下拉
        getSysUserRegion(){
            let that = this;
            that.userId = this.common.getCookie("userId");
            let url = "api/sysUserBO.ajax?cmd=getUserRegion";
            this.common.postUrl(url,{"userId":that.userId},function(data){
                that.sysUserRegion = data.items;
            });
        },
        selectOrg(obj){
            let that = this;
            that.orgId = this.common.getCookie("orgId");
            if(that.orgId == obj.regionId){
                that.$message.error('已在本区域,无需切换！');
                return;
            }
            that.$confirm(that.rms, '是否切换区域？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = "api/portalBusiBO.ajax?cmd=selectOrg";
                that.common.postUrl(url,obj,function (data) {
                    if(data != 'success'){
                        return;
                    }else {
                        that.$message({
                            type: 'success',
                            message: "切换成功"
                        });
                        window.location.reload(true);
                    }
                });
            });
        },
        doLogout(){
            let that = this;
            that.$confirm(that.rms, '确认退出系统？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = "api/portalBusiBO.ajax?cmd=doLogout";
                that.common.postUrl(url,{},function (data) {
                    if(data != '0'){
                        return;
                    }else {
                        that.$message({
                            type: 'success',
                            message: "退出成功"
                        });
                        window.location.href = "/login";
                    }
                });
            });
        },
        sysUserDetails(type){
            let that = this;
            that.userId = this.common.getCookie("userId");
            if(type == 1){
                that.urlName = "个人信息";
            }else if(type == 2){
                that.urlName = "修改密码";
            }else {
                that.urlName = "更换手机号";
            }
            let item = {
                urlName: that.urlName,
                urlId: "10" + type,
                urlPath: "/sys/sysUserDetails.vue",
                urlPathName: "/sysUserDetails",
                query:{"userId":that.userId,type:type}
            }
            that.openTab(item);
        },
        //菜单搜索
        searchMenu(){
            if(this.common.isBlank(this.menuSearch)) return;
            let list = [];
            // 一层
            this.tabsCache.forEach(item => {
                if(item.urlName.indexOf(this.menuSearch)>-1&&item.urlType==2){
                    list.push(item);
                }
                if(item.children!=null){
                    // 二层
                    item.children.forEach(item2 => {
                        if(item2.urlName.indexOf(this.menuSearch)>-1&&item2.urlType==2){
                            list.push(item2);
                        }
                        if(item2.children!=null){
                            // 三层
                            item2.children.forEach(item3 => {
                                if(item3.urlName.indexOf(this.menuSearch)>-1&&item3.urlType==2){
                                    list.push(item3);
                                }                                
                                if(item3.children!=null){
                                    // 四层，再多就写递归了
                                    item2.children.forEach(item4 => {
                                        if(item4.urlName.indexOf(this.menuSearch)>-1&&item4.urlType==2){
                                            list.push(item4);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            this.menuSearchList = list;
        },
        // 关闭菜单搜索
        hideMenuSearchList(){
            const timer = setTimeout(() => {
                this.menuSearchList = [];
                clearTimeout(timer);
            },400)
        },
        //展开搜索菜单输入框
        showMenuSearch(){
            this.showMenuSearchState = true;
        },
        //隐藏搜索菜单输入框
        hideMenuSearch(){
            this.menuSearch = '';
            this.showMenuSearchState = false;
        },
        // 跳转至首页
        toHome(){
            this.menuPage = false;
            this.$router.push('/');
        },
        //是否展示我的常用
        isShowUsuallyUse(){
            this.usuallyUse = this.usuallyUse?false:true;
        },
        //展示我的常用（侧边栏缩起时）
        showUsuallyUse(){
            if(this.isShowSlider) return;
            this.usuallyUse = true;
        },
        //隐藏我的常用（侧边栏缩起时）
        hideUsuallyUse(){
            if(this.isShowSlider) return;
            this.usuallyUse = false;
        },
        //展示隐藏侧边栏
        hideSlider(){
            this.isShowSlider = this.isShowSlider?false:true;
            this.tabsCache.forEach(el => {
                el.isOpen = false;
            })
        }
    }
}