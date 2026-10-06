import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'userRoleList',
    data()
    {
        return {
            head: [
                {"name": "账号", "code": "billId", "type": "text"},
                {"name": "用户名称", "code": "userName", "type": "text"},
                {"name": "角色", "code": "roleName", "type": "text"},
            ],
            //列表查询条件对象
            query: {},
            //新增用户数据对象
            user: {billId : ""},
            showAddUserPage: false,
            //当前角色可绑定的用户列表
            users: [],
        }
    },
    mounted()
    {

    },
    components: {
        tableCommon,
    },
    methods:
    {
        /**
         * 加载当前角色已绑定用户
         * @param role 当前角色
         * @returns {Promise<void>}
         */
        loadCurrentRoleBoundUser(role)
        {
            this.isShowAddUserPage(false);
            this.query.roleId = role.roleId;
            this.user.roleId = role.roleId;
            this.user.roleName = role.roleName;
            this.query.roleName = role.roleName;
            this.$refs.table.load("roleTF", "loadCurrentRoleBoundUser", this.query);
        },
        /**
         * 是否展示新增人员界面
         */
        isShowAddUserPage: function (flag)
        {
            flag ? this.loadCurrentRoleBindableUserList() : this.init();
            this.showAddUserPage = flag;
        },
        /**
         * 初始化
         */
        init()
        {
            this.users = [];
            this.user.userId = "";
            this.user.billId = "";
            this.user.userName = "";
        },
        /**
         * 清空查询条件
         */
        clear()
        {
            this.query.billIdOrUserName = "";
        },
        /**
         * 删除用户角色关系
         */
        deleteUserRoleRel()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一个用户删除!");
                return false;
            }
            let param = {userIds : "", roleId : this.query.roleId};
            array.forEach(item => param.userIds += item.userId + ",");
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("userTF", "deleteUserRoleRel", param, function ()
                {
                    that.loadCurrentRoleBoundUser(that.query);
                    that.$msgbox("操作成功!");
                });
            }).catch(() =>{})
        },
        /**
         * 加载当前角色可绑定的用户列表
         */
        loadCurrentRoleBindableUserList()
        {
            let that = this;
            this.common.postUrl("roleTF", "loadCurrentRoleBindableUserList", this.query, function (data)
            {
                that.users = data;
                for (let i in that.users) {
                    that.users[i].displayName = that.users[i].billId+" "+that.users[i].userName

                }
            })
        },
        /**
         * 改变用户
         * @param data 选中数据
         */
        changeUser(data)
        {
            let that = this;
            if (this.common.isBlank(data)){ that.user.userName = ""; }
            this.users.filter(function (item)
            {
                if (item.billId === data)
                {
                    that.user.userId = item.userId;
                    that.user.userName = item.userName;
                }
            });
        },
        /**
         * 保存用户角色关系
         */
        saveUserRoleRel()
        {
            if (this.common.isBlank(this.user.billId))
            {
                this.$message.error("请选择登录账号信息再保存！");
                return false;
            }
            let that = this;
            this.common.postUrl("userTF", "saveUserRoleRel", this.user, function (data)
            {
                that.isShowAddUserPage(false);
                that.loadCurrentRoleBoundUser(that.query);
                that.$msgbox("操作成功！");
            })
        }
    },
}
