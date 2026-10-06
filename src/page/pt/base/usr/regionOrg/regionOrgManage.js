import tableCommon from "@/components/table/tableCommon.vue"
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import mycity from '@/components/mycity/mycity.vue'
import tree from '@/components/tree/tree.vue'

export default {
    name: 'regionOrgManage',
    data() {
        return {
            head: [
                {"name": "区域名称", "code": "regionName", "width": "110", "type": "text"},
                {"name": "区域详细地址", "code": "address", "width": "350", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "100", "type": "diyColorTd"},
                {"name": "负责人", "code": "linkmanName", "width": "100", "type": "text"},
                {"name": "联系方式", "code": "linkmanBill", "width": "100", "type": "text"}
            ],
            loadParam: {},
            regionInfo: {},//区域信息
            orgInfo: {
                regionId: null,
                parentOrgId: null,
                orgName: null,
                projectTeam: 0,
                weComPushUrl: null,
            },//部门信息
            staffInfo: {},//人员信息
            regionData: [],//所有区域数据
            orgData: [],//所有部门数据
            staffData: [],//所有人员数据
            showModify: false,//显示区域弹窗
            showAddOrg: false,//显示部门弹窗
            showAddStaff: false,//显示人员弹窗
            treeData: [],//树形数据
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            itemInfo:{},
            showBidRelSubsidiary:false,
            relSubsidiaryData:[],
            orgTitle: "新增部门",
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
        mycity,
        scrollTable,
        tree,
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery() {
            await this.$refs.table.load("regionOrgTF", "queryRegionData", this.loadParam);
            // 赋值右侧高度
            const timer = setInterval(()=> {
                if(this.$refs.tableContent.offsetHeight > 10){
                    this.resetHeight();
                    clearTimeout(timer);
                }
            })
        },
        resetHeight(){
            this.$refs.treeList.style.height = this.$refs.tableContent.offsetHeight+"px";
        },
        init() {
            this.queryRegionData();
            this.queryStaffData();
            this.getOrgTreeList();
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"}, function (data) {
                that.relSubsidiaryData = data;
            });
        },
        /** 查询区域列表 */
        queryRegionData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryRegionSelect", {}, function (data) {
                that.regionData = data;
            });
        },
        /** 查询人员列表 */
        queryStaffData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryStaffData", {}, function (data) {
                that.staffData = data;
            });
        },
        /** 查询区域部门树 */
        getOrgTreeList(regionId) {
            let that = this;
            //1、区域
            //2、部门
            //3、人员
            this.common.postUrl("regionOrgTF", "getOrgTreeList", {regionId:regionId}, function (data) {
                that.treeData = data;
                //遍历数据判断是否人员
                that.echoData(that.treeData);
            });
        },
        //遍历数据判断是否人员
        echoData(data){
            data.forEach(item => {
                if(item.type!=3){
                    item.notFolderFile = true;
                }
                if(item.children && item.children.length > 0){
                    this.echoData(item.children);
                }
            })
        },
        /** 列表单击行事件 */
        clickItem(data) {
            let regionId = data.id;
            if(this.common.isBlank(data.parentRegionId)){
                regionId = -1;
            }
            this.getOrgTreeList(regionId);
        },
        changeRegion(orgInfo)
        {
            orgInfo.parentOrgId = null;
            this.changeRegionSelect();
        },
        /** 选中区域 */
        changeRegionSelect() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryOrgData", {regionId: this.orgInfo.regionId}, function (data) {
                that.orgData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 打开关闭 区域弹窗 */
        add(flag) {
            if (flag) {
                this.showModify = true;
            } else {
                this.showModify = false;
            }
        },
        async dblclickItem(data)
        {
            let entity = localStorage.getItem("entityIds").match("1008062");
            if(data.type==2 && this.common.isNotBlank(entity)){
                if (this.common.isBlank(data.parentOrgId) || data.parentOrgId < 0){
                    var parentOrgId = null;
                }else{
                    var parentOrgId = data.parentOrgId;
                }
                console.log(data)
                this.$emit('openTab', {
                    urlName: "修改部门",
                    urlId: 'changeRegionOrg' + data.id,
                    urlPathName: "/changeRegionOrg",
                    urlPath: "/pt/base/usr/regionOrg/changeRegionOrg.vue",
                    query: {
                        regionId:data.regionId,
                        orgName:data.orgName,
                        weComPushUrl:data.weComPushUrl,
                        orgId:data.id,
                        parentOrgId,
                        id:data.id,
                        projectTeam:data.projectTeam,
                    },
                });
            }
        },
        // 绑定客户
        bidCustomer(data){
            if (this.common.isBlank(data.parentOrgId) || data.parentOrgId < 0){
                var parentOrgId = null;
            }else{
                var parentOrgId = data.parentOrgId;
            }
            this.$emit('openTab', {
                urlName: "绑定客户",
                urlId: 'changeRegionOrg' + data.id,
                urlPathName: "/changeRegionOrg",
                urlPath: "/pt/base/usr/regionOrg/changeRegionOrg.vue",
                query: {
                    regionId:data.regionId,
                    orgName:data.orgName,
                    weComPushUrl:data.weComPushUrl,
                    orgId:data.id,
                    parentOrgId,
                    id:data.id,
                    projectTeam:data.projectTeam,
                    onlyBind:true,
                },
            });
        },
        /** 打开关闭 部门弹窗 */
        async addOrg(data) {
            // this.orgTitle = "新增部门";
            // if (this.showAddOrg) {
            //     this.orgInfo = {};
            //     this.showAddOrg = false;
            // } else {
            //     if(data.type==1){//区域下新增部门
            //         this.orgInfo.regionId = data.id;
            //     }else if(data.type==2){//部门下新增部门
            //         this.orgInfo.regionId = data.regionId;
            //         this.orgInfo.parentOrgId = data.id;
            //     }else
            //         return;
            //     await this.changeRegionSelect();
            //     this.showAddOrg = true;
            // }
            if(data.type==1){//区域下新增部门
                var regionId = data.id;
            }else if(data.type==2){//部门下新增部门
                var regionId = data.regionId;
                var parentOrgId = data.id;
            }else{
                return;
            }
            this.$emit('openTab', {
                urlName: "新增部门",
                urlId: 'changeRegionOrg' + new Date().getDate(),
                urlPathName: "/changeRegionOrg",
                urlPath: "/pt/base/usr/regionOrg/changeRegionOrg.vue",
                query: {regionId,parentOrgId,orgId:data.id},
            });
        },
        /** 打开关闭 人员弹窗 */
        addStaff(data) {
            if (this.showAddStaff) {
                this.staffInfo = {};
                this.showAddStaff = false;
            } else {
                if(data.type!=2){
                    return;
                }
                this.staffInfo.orgName = data.orgName;
                this.staffInfo.orgId = data.id;
                this.showAddStaff = true;
            }
        },
        bidRelSubsidiary(data) {
            if (this.showBidRelSubsidiary) {
                this.itemInfo = {};
                this.showBidRelSubsidiary = false;
            } else {
                if(data.type!=2){
                    return;
                }
                this.itemInfo.orgName = data.orgName;
                this.itemInfo.orgId = data.id;
                this.itemInfo.relSubsidiary = data.relSubsidiary?data.relSubsidiary+'':'';
                this.showBidRelSubsidiary = true;
            }
        },
        saveRelSubsidiary(){
            if(!this.itemInfo.relSubsidiary){
                this.$message.error("请选择绑定公司！");
                return;
            }
            let that = this;
            this.common.postUrl("regionOrgTF", "bidRelSubsidiary", this.itemInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.itemInfo = {};
                    that.showBidRelSubsidiary = false;
                    that.getOrgTreeList();
                    that.$message.success("保存成功！");
                }
            });
        },
        /** 保存区域信息 */
        addRegion() {
            if (this.common.isBlank(this.regionInfo.regionName)) {
                this.$message.error("请输入区域名称！");
                return;
            }
            if (this.common.isBlank(this.regionInfo.address)) {
                this.$message.error("请输入区域详细地址！");
                return;
            }
            if (this.common.isBlank(this.regionInfo.staffId)) {
                this.$message.error("请选择区域负责人！");
                return;
            }

            let methodName = "addRegionInfo";
            if (this.common.isNotBlank(this.regionInfo.id)) {
                methodName = "updateRegionInfo";
            }
            let that = this;
            this.common.postUrl("regionOrgTF", methodName, this.regionInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.add(false);
                    that.doQuery();
                    that.queryRegionData();
                    //关闭弹窗区域对象重新赋值
                    that.clearRegion(that);
                    that.$message.success("保存成功！");
                }
            });
        },
        /** 清除区域信息 */
        clearRegion(that) {
            that.regionInfo = {};
        },
        /** 修改区域信息 */
        modify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            if (selectData[0].sts == 0) {
                this.$message.error("无法修改已禁用区域！");
                return;
            }
            // if (selectData[0].id == 1) {
            //     this.$message.error("无法修改总部区域！");
            //     return;
            // }
            this.regionInfo = this.common.copyObj(selectData[0]);
            this.add(true);
        },
        /** 1启用2禁用 区域 */
        del(type) {
            let mes = "启用";
            if (type == 2) {
                mes = "禁用";
            }
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要" + mes + "的数据！");
                return;
            }
            let ids = "";
            let regionNameStr = "";
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].id == 1) {
                    this.$message.error("总部区域无法操作！");
                    return;
                }
                if (type == 1 && selectData[i].sts == 1) {
                    this.$message.error("区域【" + selectData[i].regionName + "】已是" + mes + "状态！");
                    return;
                } else if (type == 2 && selectData[i].sts == 0) {
                    this.$message.error("区域【" + selectData[i].regionName + "】已是" + mes + "状态！");
                    return;
                }
                ids += selectData[i].id + ",";
                regionNameStr += selectData[i].regionName + ",";
            }
            ids = ids.substring(0, ids.length - 1);
            regionNameStr = regionNameStr.substring(0, regionNameStr.length - 1);
            let that = this;
            this.common.postUrl("regionOrgTF", "delRegionInfo", {regionIdStr: ids,regionNameStr:regionNameStr, type: type}, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.queryRegionData();
                    that.$message.success(mes + "成功！");
                }
            });
        },
        appendOrg(newChild, data) {
            let key = "";
            if (data.parentOrgId > 0)
                key = data.parentOrgId + "-2";
            else
            {
                key = data.regionId + "-1";
            }
            this.recursionOrg(key, this.treeData, newChild)
        },
        recursionOrg(key, treeData, newChild)
        {
            for (let i = 0; i < treeData.length; i++) {
                if (treeData[i].nodeKey == key) {
                    if (!treeData[i].children) {
                        treeData[i].children = [];
                    }
                    treeData[i].children.push(newChild);
                    return;
                }
                if (treeData[i].children && treeData[i].children.length > 0) {
                    this.recursionOrg(key, treeData[i].children, newChild);
                }
            }
        },
        /** 删除 树形数据 */
        remove(data) {
            if(data.type!=2 && data.type!=3){
                return;
            }

            let that = this;
            let mes = "此操作将";
            let message = " (区域) " + data.regionName + " - (部门) " + data.orgName;
            let mes_ = " 删除，是否继续？";
            let title = "删除部门";
            let methodName = "delOrgInfo";
            let param = {orgId: data.id,regionName:data.regionName,orgName:data.orgName};
            if(data.type==3){//删除人员
                message = " (区域) " + data.regionName + " - (部门) " + data.orgName + " - (人员) " + data.userName;
                title = "删除人员";
                methodName = "delStaffInfo";
                param = {orgStaffIdStr: data.id,regionName:data.regionName,orgName:data.orgName,userName:data.userName};
            }

            const h = this.$createElement;
            this.$msgbox({
                title: title,
                message: h('p', null, [
                    h('span', null, mes),
                    h('i', { style: 'color: red' }, message),
                    h('span', null, mes_),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("regionOrgTF", methodName, param, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.getOrgTreeList();
                        that.$message.success("删除成功！");
                    }
                });
            }).catch(() => {
                this.$message.info("已取消删除");
            });

            // this.$confirm(mes, mes_, {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning"
            // }).then(() => {
            //     this.common.postUrl("regionOrgTF", methodName, param, function (data) {
            //         if (that.common.isNotBlank(data)) {
            //             that.getOrgTreeList();
            //             that.$message.success("删除成功！");
            //         }
            //     });
            // }).catch(() => {
            //     this.$message.info("已取消删除");
            // });
        },
        /** 保存部门信息 */
        saveOrg() {
            if (this.common.isBlank(this.orgInfo.orgName)) {
                this.$message.error("请输入部门名称！");
                return;
            }
            let that = this;
            this.common.postUrl("regionOrgTF", "addOrgInfo", this.orgInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    if (!(that.orgInfo.id > 0))
                    {
                        const newChild = {
                            id: data.orgId,
                            regionId: data.regionId,
                            parentOrgId: data.parentOrgId,
                            label: data.orgName,
                            orgName: data.orgName,
                            regionName: data.regionName,
                            type: '2',
                            children: []
                        };
                        //添加部门到页面
                        that.appendOrg(newChild, data)
                    }
                    that.addOrg();
                    that.$message.success("保存成功！");
                }
            });
        },
        /** 保存人员信息 */
        saveStaff() {
            if (this.common.isBlank(this.staffInfo.orgId)) {
                this.$message.error("请选择所属部门！");
                return;
            }
            if (this.common.isBlank(this.staffInfo.staffIds) || this.staffInfo.staffIds.length == 0) {
                this.$message.error("请选择人员！");
                return;
            }
            
            let that = this;
            this.common.postUrl("regionOrgTF", "addStaffInfo", this.staffInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.addStaff();
                    that.getOrgTreeList();
                    that.$message.success("保存成功！");
                }
            });
        },
        // 保存树节点修改
        saveItem(item){            
            if(this.common.isBlank(item.label)){
                this.$message.error("部门名称不能为空")
            }else{
                let that = this;
                item.orgName = item.label;
                this.common.postUrl("regionOrgTF", "upOrgInfo", item, function (data) {
                    if (that.common.isNotBlank(data)) {
                        item.isEdit = false;
                    }
                });
            }
        },
        changeSwitch() {
            this.orgInfo.projectTeam = this.orgInfo.projectTeam == 1 ? 0 : 1;
            this.$forceUpdate();
        },
    },
}
