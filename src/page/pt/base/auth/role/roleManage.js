import tableCommon from "@/components/table/tableCommon.vue";
import authRoleTree from "@/components/auth/authRoleTree.vue";
import userRoleList from "@/components/auth/userRoleList.vue";

export default {
    name: 'roleManage',
    data()
    {
        return {
            head: [
                {"name": "名称", "code": "roleName", "width": "200","type": "text"},
                {"name": "描述", "code": "roleDescribe", "width": "200", "type": "text"},
                {"name": "授权", "code": "", "width": "150", "type": "diy"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            showEntityPage: false,
            showUserRolePage: false,
            query:{roleName: ""},
            adminRoleId: -1,
            authRoleTreeTitle:'',
            roleData:[],//角色列表
            showDialog:false,
            compareRoleId:"",
            currentItem:{},
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
        tableCommon,
        authRoleTree,
        userRoleList,
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 新增角色
         */
        addRole()
        {
            this.$emit("openTab",{
				query:{
                    adminRoleId:this.adminRoleId,
                },
				urlId: 'addRoleEntity' + new Date().getTime(),
				urlName: '新增角色',
				urlPathName: '/addRoleEntity',
				urlPath: "/pt/base/auth/role/addRoleEntity.vue",
            })
        },
        async initData(){
            //加载角色数据
            let data = await this.common.postUrl("roleTF", "loadRoleInfoListNoPage");
            this.roleData = data;
        },
        /**
         * 修改角色
         */
        updateRole()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一个需要修改的角色!");
                return false;
            }
            this.$emit("openTab",{
				query:{
                    roleId:array[0].roleId,
                    roleName:array[0].roleName,
                    adminRoleId:array[0].adminRoleId,
                },
				urlId: 'addRoleEntity' + array[0].roleId,
				urlName: '修改角色',
				urlPathName: '/addRoleEntity',
				urlPath: "/pt/base/auth/role/addRoleEntity.vue",
            })
        },
        copyRole(){
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一个需要复制的角色!");
                return false;
            }            
            this.$emit("openTab",{
				query:{
                    roleId:array[0].roleId,
                    roleName:array[0].roleName,
                    adminRoleId:array[0].adminRoleId,
                    copy:1,
                },
				urlId: 'addRoleEntity' + new Date().getTime(),
				urlName: '复制角色',
				urlPathName: '/addRoleEntity',
				urlPath: "/pt/base/auth/role/addRoleEntity.vue",
            })
        },
        /**
         * 删除角色
         */
        deleteRole()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一个需要删除的角色!");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                that.common.postUrl("roleTF", "deleteRoleInfo", array[0], function (data)
                {
                    that.doQuery();
                    that.$msgbox("角色删除成功!");
                });
            }).catch(() =>{})
        },
        /**
         * 加载角色列表
         */
        doQuery()
        {
            let that = this;
            this.$refs.table.load("roleTF", "loadRoleInfoList", this.query, function (data)
            {
                if (data.items.length > 0)
                that.adminRoleId = data.items[0].adminRoleId;
            });
        },
        /**
         * 是否展示权限页
         * @param flag 开关展示
         */
        isShowEntityPage(flag)
        {
            this.showEntityPage = flag;
        },
        /**
         * 加载权限实体树
         * @param role
         * @param isOnlySee
         */
        loadEntityTree(role, isOnlySee)
        {
            console.log(role)
            this.$refs.authRoleTree.loadEntityTree(role, isOnlySee, 1);
            this.isShowEntityPage(true);
        },
        /**
         * 清空查询条件
         */
        clear()
        {
            this.query = {roleName: ""};
        },
        /**
         * 是否展示用户角色列表页
         */
        isShowUserRoleListPage(flag)
        {
            this.showUserRolePage = flag;
        },
        /**
         * 加载角色用户
         */
        loadCurrentRoleBoundUser(item)
        {
            this.$refs.userRoleList.loadCurrentRoleBoundUser(item);
            this.authRoleTreeTitle = '成员管理';
            this.isShowUserRoleListPage(true);
        },
        /**
         * 查看角色权限
         */
        seeRoleAuth(item)
        {
            this.$emit("openTab",{
				query:{
                    roleId:item.roleId,
                    roleName:item.roleName,
                    adminRoleId:item.adminRoleId,
                },
				urlId: 'addRoleEntity' + item.roleId,
				urlName: '查看角色权限',
				urlPathName: '/addRoleEntity',
				urlPath: "/pt/base/auth/role/addRoleEntity.vue",
            })
        },
        /**
         * 权限对比
         */
        entityCompare(item){
            this.showDialog = true;
            this.currentItem = item;
        },
        /**
         * 权限对比
         */        
        sureRole(){
            let data = this.roleData.find(item => item.roleId == this.compareRoleId);
			this.$emit("openTab",{
				query:{
                    roleId:this.currentItem.roleId,
                    roleName:this.currentItem.roleName,
                    adminRoleId:this.currentItem.adminRoleId,
                    compareRoleId:this.compareRoleId,
                    compareRoleName: data.roleName,
                },
				urlId: 'entityCompare' + this.currentItem.roleId,
				urlName: '角色权限对比',
				urlPathName: '/entityCompare',
				urlPath: "/pt/base/auth/role/entityCompare.vue",
            })
            this.showDialog = false;
        },
    },
}
