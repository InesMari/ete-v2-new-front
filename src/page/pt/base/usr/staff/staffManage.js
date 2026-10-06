import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'staffManage',
    data()
    {
        return {
            head: [
                {"name": "登录账号", "code": "billId", "width": "150", "type": "text"},
                {"name": "邮箱", "code": "email", "width": "150", "type": "text"},
                {"name": "使用人", "code": "userName", "width": "100", "type": "text"},
                {"name": "岗位", "code": "positionName", "width": "100", "type": "text"},
                {"name": "启用禁用", "code": "stateName", "width": "100", "type": "diyColorTd"},
                {"name": "最后登录时间", "code": "lastLoginDate", "width": "150", "type": "text"},
                {"name": "所属部门", "code": "orgNames", "width": "200", "type": "text"},
                {"name": "所属角色", "code": "roleNames", "width": "200", "type": "text"},
                {"name": "数据权限", "code": "authNames", "width": "200", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUser", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            query: this.initQuery(),
            staffDialogShow:false,//弹出框是否展示
            dialogTitle:'新增人员',
            form:this.initInfo(),
            roleData:[],//角色列表
            orgData:[],//区域部门数据
            orgDatas:[],//区域部门数据
            selData:[],//初始化展开的区域部门数据
            positionData:[],
            permissionData:[],
            stsData:[],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        searchList,
        tableCommon
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 清空查询条件
         */
        initQuery()
        {
            return this.query = {
                billId: "",
                userName: "",
                email: "",
                positionName: "",
                remark: "",
            };
        },
        initInfo()
        {
            return this.form = {
                billId:'',
                userName:'',
                roleIds:[],
                positionId:'',
                orgIds:[],
                permissionId:null,
            }
        },

        /**
         * 加载角色列表
         */
        async doQuery(query=this.query) {
            this.query = query;
            let {items} = await this.$refs.table.load("staffTF", "queryStaffs", this.query);
            items.forEach((el)=>{
                el.disabled = el.state == 0;
            });
            this.$refs.table.resetData(items);
        },
        changeRows(items){
            items.forEach((el)=>{
                el.disabled = el.state == 0;
            });
            this.$refs.table.resetData(items);
        },
        /**
         * 初始化数据
         */
        async initData(){
            let that = this;
            //加载区域部门数据
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data){
                that.orgDatas = data;
            });
            this.common.postUrl("positionService", "queryPositionList", {}, function (data) {
                that.positionData = data;
            });
            //加载角色数据
            this.common.postUrl("roleTF", "loadRoleInfoListNoPage", {}, function (data) {
                that.roleData = data;
            });
            
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType:"STS"});
            this.stsData = data.STS;
        },
        checkBillId(){
            let that = this;
            this.common.postUrl("staffTF", "getUserName", {billId:that.form.billId}, function (data) {
                that.form.userName = data.userName;
            });
        },
        /**
         * 显示人员新增修改框
         * @param type
         */
        showStaffDialog(type){
            let that = this;
            this.initInfo();
            if(type==1){
                this.dialogTitle = '新增人员';
            }
            else if(type==2){
                this.dialogTitle = '修改人员';
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据！");
                    return;
                }
                this.common.postUrl("staffTF", "getStaff", {staffId:selectData[0].staffId}, function (data) {
                    that.form=data;
                    //角色多选要转换成数组
                    if (that.common.isNotBlank(that.form.roleIds))
                    {
                        that.form.roleIds=that.form.roleIds.split(',');
                        that.form.roleIds=that.form.roleIds.map(Number);
                    }
                    if (that.common.isNotBlank(that.form.orgIdStr))
                        that.selData=that.form.orgIdStr.split(',');
                });
            }
            // 岗位
            this.common.postUrl("positionService", "queryPositionList", {}, function (data) {
                that.positionData = data;
            });
            //加载角色数据
            this.common.postUrl("roleTF", "loadRoleInfoListNoPage", {}, function (data) {
                that.roleData = data;
            });
            // 数据权限
            this.common.postUrl("permissionService", "loadPermissionList", {}, function (data) {
                that.permissionData = data;
            });
            // 区域部门
            this.common.postUrl("regionOrgTF", "queryAllRegionOrgs", {}, function (data) {
                that.orgData = [];
                that.orgData.push(data);
            });
            this.staffDialogShow = true;
        },
        /**
         * 区域部门联动
         */
        regionOrgReact(){
            let allCheckedNodes = this.$refs.elTree.getCheckedNodes();
            let newCheckedKey = new Array();
            for (let allCheckedNodesKey in allCheckedNodes) {
                let node = allCheckedNodes[allCheckedNodesKey];
                newCheckedKey.push(node.elId);
                if(node.type==2){
                    newCheckedKey.push('1-'+node.regionId);
                }
            }
            newCheckedKey=Array.from(new Set(newCheckedKey));
            this.$refs.elTree.setCheckedKeys(newCheckedKey);

        },
        /**
         * 关闭弹出框
         */
        close(){
            this.staffDialogShow = false;
            this.orgData = JSON.parse(JSON.stringify(this.orgData));
            this.selData = [];
            if(this.$refs.elTree){
                this.$refs.elTree.setCheckedKeys([]);
            }
        },
        /**
         * 新增修改员工
         */
        addStaff()
        {
            let that = this;
            let method = "addStaff";
            if(this.form.staffId){
                method = "updateStaff";
            }
            if(!this.form.billId){
                this.$message.error("请输入登录账号!");
                return;
            }
            if(this.form.billId.length!=11){
                this.$message.error("登录账号长度不对");
                return;
            }
            if(!this.form.userName){
                this.$message.error("请输入使用人!");
                return;
            }
            if(this.form.userName.length<2){
                this.$message.error("使用人长度不对");
                return;
            }
            if(this.common.checkNum(this.form.userName)){
                this.$message.error("使用人不能全部为数字");
                return;
            }
            let param = JSON.parse(JSON.stringify(this.form));
            if (this.common.isNotBlank(param.roleIds))
            {
                param.roleIds = param.roleIds.join(",");
            }
            let allCheckedNodes = this.$refs.elTree.getCheckedNodes();
            let newCheckedKey = new Array();
            for (let allCheckedNodesKey in allCheckedNodes) {
                let node = allCheckedNodes[allCheckedNodesKey];
                if(node.type==2){
                    newCheckedKey.push(node.id);
                }
            }
            if(allCheckedNodes!=null && allCheckedNodes.length!=0 && newCheckedKey.length==0){
                this.$message.error("选择区域必须选择部门!");
                return;
            }
            param.orgIds = newCheckedKey.join(",");
            this.common.postUrl("staffTF", method, param, function (data) {
                if(data){
                    that.staffDialogShow = false;
                    that.doQuery();
                    that.$message.success(that.dialogTitle + "成功！");
                }
            },null,'',true);
        },
        /**
         * 删除角色
         */
        deleteStaff() {
            let that = this;
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let staffIds = '';
            let userNames = '';
            for (let i = 0; i < selectData.length; i++) {
                staffIds+=','+selectData[i].staffId;
                userNames+=','+selectData[i].userName;
            }
            staffIds = staffIds.substr(1);
            userNames = userNames.substr(1);

            that.$confirm('您正在操作删除人员：'+userNames+'，确认删除？？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                that.common.postUrl("staffTF", "delStaff", {staffIds:staffIds,userNames:userNames}, function (data) {
                    if(data){
                        that.doQuery();
                        that.$message.success("删除人员成功！");
                    }
                },null,'',true);
            }).catch(() => {
                // 取消
            });
        },
        showInfo(item,index){
            this.tableData = this.$refs.table.getData();
            this.tableData[index].showInfo = true;
            let info = {
                isDiyTr:true,
                regionOrgInfoStr:item.regionOrgInfoStr
            }
            this.tableData.splice(index+1,0,info);
            this.$refs.table.resetData(this.tableData);
            this.$forceUpdate();
        },
        hideInfo(item,index){
            this.tableData = this.$refs.table.getData();
            this.tableData[index].showInfo = false;
            this.tableData.splice(index+1,1);
            this.$refs.table.resetData(this.tableData);
        },
        /**
         * 全员下线
         */
        kickAllUserEnds() {
            let that  = this;
            this.common.postUrl("userTF", "kickAllUserEnds", {}, function (data) {
                if(data){
                    that.$message.success("全员下线成功！");
                }
            },null,'',true);
        },
        /**
         * 启用禁用
         */
        async changeUserSts()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要启用/禁用的人员！");
                return false;
            }
            let param = this.common.copyObj(selectData[0]);
            this.$confirm("确定启用/禁用该人员？", "提示",{center: true}).then(async() =>{
                let data = await this.common.postUrl("staffTF", "changeUserSts", param);
                this.doQuery();
                this.$message.success(data.state == 1 ? "启用成功" : "禁用成功");
            }).catch(() =>{});
        },
        
    },
    computed:{
        formData(){
            return [
                {"name":"使用人","model":"userName","type":"input","placeholder":"使用人","isshow":true},
                {"name":"登录账号","model":"billId","type":"input","placeholder":"登录账号","isshow":true},
                {"name":"n天内无登录","model":"nDay","type":"input","placeholder":"请输入天数","isshow":true},
                {"name":"邮箱","model":"email","type":"input","placeholder":"邮箱","isshow":true},
                {"name":"岗位名称","model":"positionName","type":"input","placeholder":"岗位名称","isshow":true},
                {"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
                {"name":"所属部门","model":"orgIds","type":"select","options":this.orgDatas,"label":"orgName","value":"id","placeholder":"所属部门","method":"doQuery","isshow":true,"multiple":true},
                {"name":"所属角色","model":"roleId","type":"select","options":this.roleData,"label":"roleName","value":"roleId","placeholder":"所属角色","method":"doQuery","isshow":true},
                {"name":"启用/禁用","model":"state","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"启用/禁用","method":"doQuery","isshow":true},
            ]
        }
    },
}
