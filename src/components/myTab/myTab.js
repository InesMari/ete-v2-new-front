import common from "../../utils/common";
import vuedraggable from 'vuedraggable';

export default {
    name: 'myTab',
    data(){
        return{
            tabs:[],
            tabW:0, //菜单栏总宽度
            showArrow:false,   //是否展示左右点击滚动按钮
            newId:"",   //页面刷新产生的随机id
            showCollectSet:false,
            // 优化拖动配置
            dragOptions: {
                animation: 300,
                ghostClass: "flip-list-dragging",
                chosenClass: "flip-list-dragging",
                dragClass: "flip-list-dragging",
                filter: ".close, .refresh", // 排除关闭和刷新按钮的拖动
                preventOnFilter: true
            },
            showRightMenuflag: false, // 是否显示右键菜单
            rightMenuIndex: -1, // 右键菜单当前选中的tab索引
            mouseX: 0, // 鼠标X坐标
            mouseY: 0, // 鼠标Y坐标
        }
    },
    components: {
        vuedraggable
    },
    mounted(){
        this.initParentMethodParams();
    },
    methods:{
        initParentMethodParams(){
            this.closeParentId = "";
            this.isDoParentMethod = false;
            this.parentMethodName = "doQuery";
        },
        /**
         * 打开一个新tab
         * @param {路由信息} item 
         * @returns 
         */
        openTab(item){
            // 保留原始路径
            item.urlPathCache = item.urlPath;
            //判断路径是否带参
            let urlPathParamIdx = item.urlPath.indexOf("?");
            //query对象生成
            item.query = this.common.isNotBlank(item.query) ? item.query : {};
            if(urlPathParamIdx>-1){ //带参处理
                let params = item.urlPath.split("?")[1];    //截取带参
                let paramsArr = params.split("&");  //带参分解数组
                paramsArr.forEach(el => {   //遍历插入query对象
                    let data = el.split("=");
                    item.query[data[0]] = data[1]
                })
                item.urlPath = item.urlPath.split("?")[0];  //获取不带参路径
            }
            if(this.common.isBlank(item.urlPathName)){
                let number = item.urlPath.lastIndexOf("/");
                item.urlPathName= item.urlPath.substr(number).replace(".vue","");
            }
            if(this.common.isBlank(item.urlPathName)&&item.urlType==1) return;
            if(this.common.isBlank(item.formerPath)){
                item.formerPath = item.urlPathName;
            }
            if(item.urlPathName.indexOf(item.urlId)==-1){
                item.urlPathName = item.urlPathName+"_"+item.urlId;
            }
            //vuex记录页面ID
            this.$store.commit('resetData',{name:'routeId',data:item.urlId});
            //添加路由
            this.$router.addRoute({
                path: item.urlPathName,
                name: item.urlName,
                params:item.params,
                component: () => import(`@/page${item.urlPath}`),
                meta:{
                    keep:true,
                    id:item.urlId,
                    path:item.formerPath,
                    menuPath:item.urlPath,
                    parentPath:this.$route.path,
                    parentId:this.$route.meta.id
                }
            })
            this.$router.push({path:item.urlPathName,query: item.query});

            /* 路由异常错误处理，尝试解析一个异步组件时发生错误，判断为js丢失时，提示刷新网页*/
            let _this = this;
            this.$router.onError((error) => {
                const pattern = /Loading chunk .+ failed/g;
                const isChunkLoadFailed = error.message.match(pattern);
                if (isChunkLoadFailed) {
                    const targetId = _this.$router.history.current.meta.id;
                    console.log("捕获到js丢失");
                    _this.$confirm('发现系统更新，是否刷新网页，以便下一步操作', '提示', {
                        confirmButtonText: '刷新页面',
                        // cancelButtonText: '取消',
                        showCancelButton:false,
                        closeOnClickModal:false,
                        type: 'warning'
                    }).then(() => {
                        let time = new Date().getTime();
                        let href = "/?ver="+time;
                        window.location.href = href;
                    }).catch(() => {
                        _this.tabs.splice(_this.tabs.length-1,1);
                        _this.tabs.forEach((obj,index) => {
                            if (obj.urlId == targetId) {
                                _this.$set(obj,"active",true);
                            }
                        })
                    });
                }else{
                    if(this.common.isBlank(item.urlName) || item.urlName == 'undefined'){
                        this.close(item.urlId)
                    }
                }
            });

            if(item.urlId!=0){
                this.addKeepaliveRoute(this.tabs.length);   //插入到keepalive列表,length不减一，因为下面有插入多一个
            }
            //tab栏逻辑
            this.$set(item,"active",true);
            let isHaveItem = false;
            let itemIndex = '';
            this.tabs.forEach((obj,index) => {
                this.$set(obj,"active",false);
                if (obj.urlId == item.urlId) {
                    this.tabs[index] = this.common.copyObj(item);    //参数替换
                    this.$set(obj,"active",true);
                    isHaveItem = true;
                    itemIndex = index;
                }
            })
            this.$forceUpdate();
            if (!isHaveItem) this.tabs.push(item);
            if(item.urlId!=0) this.saveTab(item); //保存页面信息
            this.calcTab(itemIndex);//计算tab栏是否溢出
        },
        
        // 执行页面方法
        doParentMethod(){
            // 获取当前路由对应的组件实例
            const routeRecord = this.$route.matched[0];
            if (routeRecord && routeRecord.instances) {
                const componentInstance = routeRecord.instances.default;
                if (componentInstance && typeof componentInstance[this.parentMethodName] === 'function') {
                    componentInstance[this.parentMethodName]();
                }else if(componentInstance.$refs && componentInstance.$refs.ref && typeof componentInstance.$refs.ref[this.parentMethodName] === 'function'){
                    //内嵌了innerTab的处理方案
                    componentInstance.$refs.ref[this.parentMethodName]();
                }
            }
            this.initParentMethodParams();
        },

        // 优化拖动结束后的处理
        onDragEnd() {
            // 拖动结束后重新计算tab位置
            this.$nextTick(() => {
                this.calcTab();
            });
        },
        
        /**
         * 切换页面
         * @param {页面下标} index 
         * @returns 
         */
        changeTab(index){
            try{
                this.$parent.$refs.navMenu.navMenuSwitchTab(true);
            }catch(e){}
            if(index==-1){  //tab栏空时处理
                this.tabs = [];
                this.$router.push('/');
                this.$forceUpdate();
                return
            }
            this.addKeepaliveRoute(index);
            let item = this.tabs[index];
            this.tabs.forEach(obj => {
                this.$set(obj,"active",false);
            });
            this.$set(item,"active",true);
            this.$router.push({path:item.urlPathName,query: item.query});
            this.saveTab(item);
            if(this.isDoParentMethod) this.doParentMethod();
            
            this.$forceUpdate();
        },
        /**
         * 关闭页面
         * @param {页面id} id 
         * @param {父页面id} toParentId 
         */
        close(id,toParentId,isDoParentMethod = false,parentMethodName = 'doQuery'){
            let toIndex = null;
            this.destroyRoute({id});    //删除路由
            let parentId = this.$route.meta.parentId;
            this.closeParentId = parentId;
            this.isDoParentMethod = isDoParentMethod;
            this.parentMethodName = parentMethodName;
            this.$nextTick(() => {
                for(let index in this.tabs){
                    let el = this.tabs[index];
                    if(this.common.isNotBlank(toParentId)&&toParentId==el.urlId){   //判断是否有传入指定跳转的页面
                        toIndex = index;
                    }else if(this.common.isNotBlank(parentId)&&parentId==el.urlId){     //回去父级页面
                        toIndex = index;
                    }
                    if(el.urlId == id){
                        if(this.common.isNotBlank(toIndex)){
                            this.changeTab(toIndex)
                        }else if(index==0&&this.tabs.length>1){
                            this.changeTab(1)
                        }else{
                            this.changeTab(index-1)
                        }
                        this.tabs.splice(index,1)
                        break;
                    }
                }
                this.calcTab();
            })
        },
        /**
         * 关闭全部页面（保留首页）
         */
        closeAll(){
            this.tabs.forEach((el,index) => {
                if(index>0) this.destroyRoute({id:el.urlId});    //删除路由
            })
            this.$nextTick(()=>{
                this.tabs = this.tabs.splice(0,1);
                this.changeTab(0);
                this.calcTab(0);
                this.hideRightMenu();
            })
        },
        /**
         * 关闭其它页面（保留首页和当前页）
         */
        closeOthers(){
            let tabs = [this.tabs[0]];
            let idx = 0;
            this.tabs.forEach((item,index) => {
                if(item.active){
                    tabs.push(item);
                    idx = index;
                }
                if(index>0&&!item.active) {
                    this.destroyRoute({id:item.urlId});//删除路由
                }
            })
            this.$nextTick(()=>{
                this.tabs = tabs;
                this.changeTab(idx);
                this.calcTab(1);
            })
        },
        /**
         * 刷新页面
         * @param {页面id} id 
         * @param {带参} query 
         */
        refresh(id,query){
            //数据渲染成功后进行下一步操作
            this.$nextTick(() => {
                for(let index in this.tabs){    //修改对应的tab栏参数
                    let item = this.tabs[index];
                    if(item.urlId == id){
                        this.destroyRoute({id,isrefresh:true});    //先进行路由销毁（不缓存该路由）
                        //添加路由
                        this.$nextTick(()=>{    //延迟执行等vuex删除路由缓存记录
                            this.$router.replace('/');  //跳转到空白页
                            this.$nextTick(()=>{    //延迟支持等空白页成功跳转，旧页面成功销毁
                                this.$router.addRoute({     //重新添加该路由
                                    path: item.urlPathName,
                                    name: item.urlName,
                                    params:item.params,
                                    component: () => import(`@/page${item.urlPath}`),
                                    meta:{
                                        keep:true,
                                        id:this.urlId,
                                        path:item.formerPath,
                                        parentPath:this.$route.path,
                                        parentId:this.$route.meta.id
                                    }
                                })
                                if(this.common.isNotBlank(query)){      //页面刷新带参
                                    item.query = {...item.query,...query}
                                }
                                this.$router.push({path:item.urlPathName,query: item.query});
                                this.addKeepaliveRoute(index);
                            })
                        })
                        break;
                    }
                }
            })
        },
        /**
         * 刷新全部页面
         */
        refreshAll(){
            this.tabs.forEach(el=>{
                this.refresh(el.urlId);
            })
        },
        /**
         * 计算tab偏移
         * @param {页面位置下标} itemIndex 
         */
        calcTab(itemIndex){
            let _this = this;
            // 延时执行让dom渲染出来
            let timer = setTimeout(() => {
                _this.$refs.scrollTab.style.left = 0;    //先重置位置
                let tabsW = _this.$refs.myTab.offsetWidth;   //tab栏总长度
                _this.tabW = 0;
                let currentPos = 0;   //当前tab的位置
                _this.tabs.forEach((item,index) => {
                    if(_this.common.isNotBlank(itemIndex)&&itemIndex==index){
                        currentPos = _this.tabW -15;
                    }
                    _this.tabW += _this.$refs['tab'+index][0].offsetWidth+15;
                });
                //宽度溢出的时候
                if(tabsW<this.tabW){
                    _this.$refs.scrollTab.style.left = (tabsW-_this.tabW)+'px';
                    _this.showArrow = true;
                }else{
                    _this.showArrow = false;
                }
                //当存在已经打开的tab时，跳转其位置
                if(currentPos+(tabsW-_this.tabW)<0&&_this.common.isNotBlank(itemIndex)){
                    _this.$refs.scrollTab.style.left = -currentPos+'px';
                }
                clearTimeout(timer);
            }, 300);
        },
        //tab溢出时往左移动
        moveLeft(){
            let scrollTab = this.$refs.scrollTab;  //整个tab栏对象
            let left = Number(scrollTab.style.left.replace(/px/,''));   //获取left的数值
            if(left<-100){
                scrollTab.style.left = (left+100)+'px';
            }else{
                scrollTab.style.left = 0
            }
        },
        //tab溢出时往右移动
        moveRight(){
            let tabsW = this.$refs.myTab.offsetWidth;   //tab栏总长度
            let scrollTab = this.$refs.scrollTab;
            let left = Number(scrollTab.style.left.replace(/px/,''));
            if(tabsW-left<this.tabW-50){
                scrollTab.style.left = (left-100)+'px';
            }else{
                scrollTab.style.left = tabsW - this.tabW;
            }
        },
        //保存最后打开的页面信息
        saveTab(item){
          localStorage.setItem("pageInfo",JSON.stringify(item));
        },
        //插入到keepalive列表
        addKeepaliveRoute(index){
            let _this = this;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {     
                if(_this.$route.matched.length==0 || _this.tabs.length<=index){
                    return;
                }
                let name = _this.$route.matched[0].components.default.name;  //获取路由组件定义的名称(页面js定义的name)
                _this.tabs[index].componentId = name;
                //vuex添加keepalive页面
                let keepAlivePage = _this.$store.state.keepAlivePage;    //获取keepalive页面数组
                _this.tabs.forEach(el => {
                    if(!keepAlivePage.includes(el.componentId)&&_this.common.isNotBlank(el.componentId)){
                        keepAlivePage.push(el.componentId)
                    }
                })
                _this.$store.commit('resetData',{name:'keepAlivePage',data:keepAlivePage});  //存放到vuex后生效
                _this.$forceUpdate();
            },1000)
        },
        // 销毁路由（vuex删除keepalive页面）
        destroyRoute({id,isrefresh}){
            let keepAlivePage = this.$store.state.keepAlivePage;    //获取keepalive页面数组
            if(this.$route.matched.length == 0) return;
            let name = '';
            let openRoutes = [];  //记录打开了多少个相同路由
            this.tabs.forEach(el => {
                if(keepAlivePage.includes(el.componentId) && this.common.isNotBlank(el.componentId)&&el.urlId==id){
                    name=el.componentId;
                }
            })
            openRoutes = this.tabs.filter(el => el.componentId==name)
            if(openRoutes.length>1 && !isrefresh) return;    //如果打开的页面大于1，说明有相同路由，不删除
            for(let i in keepAlivePage){    //遍历移除
                if(keepAlivePage[i] == name){
                    keepAlivePage.splice(i,1);
                    break;
                }
            }
            // if(!isrefresh){
            //     this.tabs.forEach(el => {
            //         if(!keepAlivePage.includes(el.componentId)&&this.common.isNotBlank(el.componentId)&&el.urlId!=id){
            //             console.log(isrefresh)
            //             keepAlivePage.push(el.componentId)
            //         }
            //     })
            // }
            this.$store.commit('resetData',{name:'keepAlivePage',data:keepAlivePage});  //存放到vuex后生效
        },
        // 收藏菜单
        async saveCollect(){
            this.showCollectSet = false;
            let menuData = [];
            this.tabsCollect.forEach(el => {
                if(el.isSelect){
                    menuData.push({
                        menuId:el.urlId,
                        parentId:el.query.pId,
                        entityId:el.entityId,
                        menuName:el.urlName,
                        menuPath:el.urlPathCache,
                    })
                }
            })
            await this.common.postUrl("userTF", "saveUserMenuLabel", {menuData}, null, null, null, true);
            this.$message({message: '收藏成功',type: 'success'});
            this.$parent.queryUserMenuLabelData();
        },
        // 显示右键菜单
        showRightMenu(index, e) {
            this.rightMenuIndex = index;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.showRightMenuflag = true;

            // 防止菜单溢出屏幕
            this.$nextTick(() => {
                const menuWidth = this.$refs.rightMenu.offsetWidth;
                const menuHeight = this.$refs.rightMenu.offsetHeight;
                const screenWidth = document.documentElement.clientWidth;
                const screenHeight = document.documentElement.clientHeight;

                if (this.mouseX + menuWidth > screenWidth) {
                    this.mouseX = screenWidth - menuWidth - 10;
                }

                if (this.mouseY + menuHeight > screenHeight) {
                    this.mouseY = screenHeight - menuHeight - 10;
                }
            });
        },

        // 隐藏右键菜单
        hideRightMenu() {
            this.showRightMenuflag = false;
            this.rightMenuIndex = -1;
        },

        // 关闭当前标签页
        closeCurrentTab() {
            if (this.rightMenuIndex === 0) return; // 不关闭首页
            this.close(this.tabs[this.rightMenuIndex].urlId);
            this.hideRightMenu();
        },

        // 关闭左侧标签页
        closeLeftTabs() {
            if (this.rightMenuIndex <= 0) return;

            const closeTabs = this.tabs.slice(1, this.rightMenuIndex);
            closeTabs.forEach(tab => {
                this.destroyRoute({id: tab.urlId});
            });

            this.$nextTick(() => {
                this.tabs = [this.tabs[0], ...this.tabs.slice(this.rightMenuIndex)];
                this.changeTab(1);
                this.calcTab(1);
                this.hideRightMenu();
            });
        },

        // 关闭右侧标签页
        closeRightTabs() {
            if (this.rightMenuIndex >= this.tabs.length - 1) return;

            const closeTabs = this.tabs.slice(this.rightMenuIndex + 1);
            closeTabs.forEach(tab => {
                this.destroyRoute({id: tab.urlId});
            });

            this.$nextTick(() => {
                this.tabs = this.tabs.slice(0, this.rightMenuIndex + 1);
                this.calcTab(this.rightMenuIndex);
                this.hideRightMenu();
            });
        },
    },
    computed: {
        tabsCollect: function () {
            return this.tabs.filter(function (item) {
                return item.query.unShowCheck != 1 && item.urlId != "10000";
            })
        },
    }    
}