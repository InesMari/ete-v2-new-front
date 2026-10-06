import tableCommon from "@/components/table/tableCommon.vue";
import authRoleTree from "@/components/auth/authRoleTree.vue";
import userRoleList from "@/components/auth/userRoleList.vue";

export default {
    name: 'roleManage',
    data()
    {
        return {
            head: [
                {"name": "名称", "code": "roleName", "type": "text"},
                {"name": "描述", "code": "roleDescribe", "width": "200", "type": "text"},
                {"name": "授权", "code": "", "width": "200", "type": "diy"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"}
            ],
            showEntityPage: false,
            showUserRolePage: false,
            query:{roleName: ""},
            adminRoleId: -1,
        }
    },

    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
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
            this.loadEntityTree({adminRoleId : this.adminRoleId}, false);
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
            this.loadEntityTree(array[0], false);
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
                this.common.postUrl("roleTF", "deleteRoleInfo", array[0], function (data)
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
            this.isShowUserRoleListPage(true);
        },
        /**
         * 查看角色权限
         */
        seeRoleAuth(item)
        {
            this.loadEntityTree(item, true);
        }
    },
}
