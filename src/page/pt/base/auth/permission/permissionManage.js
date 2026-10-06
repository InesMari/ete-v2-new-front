import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";

export default {
    name: 'permissionManage',
    data()
    {
        return {
            head: [
                {"name": "数据权限名称", "code": "authName", "width": "100", "type": "text"},
                {"name": "描述", "code": "remark", "width": "200", "type": "text"},
                {"name": "初始权限", "code": "typeName", "width": "100", "type": "text"},
                {"name": "特殊权限", "code": "specificAuth", "width": "100", "type": "text"},
                {"name": "创建人员", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            dialogShow: false,
            title: '绑定人员',
            info: this.initInfo(),
            staffData: [],//人员列表
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
    },
    methods: {
        initQuery() {
            return this.query = {
                name: '',
                userName: '',
            };
        },
        initInfo()
        {
            return this.info = {
                id: '',
                authName: '',
                userIds: [],
            }
        },
        async doQuery()
        {
            await this.$refs.table.load("permissionService", "loadPermissionPage", this.query);
        },
        async initData()
        {
            this.staffData = await this.common.postUrl("regionOrgTF", "queryStaffData", {});
        },
        async open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        async addPermission() {
            let data = {
                query:{type:1},
                urlId: 'addPermissionInfo' + new Date().getTime(),
                urlName: '新增数据权限',
                urlPathName: '/addPermissionInfo',
                urlPath: "/pt/base/auth/permission/permissionInfo.vue",
            }
            await this.open(data);
        },
        async dblclickItem(item) {
            let data = {
                query: {id:item.id, type: 0},
                urlId: 'permissionInfoDetail' + item.id,
                urlName: '数据权限详情',
                urlPathName: '/permissionInfoDetail',
                urlPath: "/pt/base/auth/permission/permissionInfo.vue",
            }
            await this.open(data);
        },
        async updatePermission() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let data = {
                query: {type: 2,id:selectData[0].id},
                urlId: 'updatePermissionInfo' + selectData[0].id,
                urlName: '修改数据权限',
                urlPathName: '/updatePermissionInfo',
                urlPath: "/pt/base/auth/permission/permissionInfo.vue",
            }
            await this.open(data);
        },
        async copyPermission() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的数据！");
                return false;
            }
            let data = {
                query: {type: 5,id:selectData[0].id},
                urlId: 'copyPermissionInfo' + new Date().getTime(),
                urlName: '复制数据权限',
                urlPathName: '/copyPermissionInfo',
                urlPath: "/pt/base/auth/permission/permissionInfo.vue",
            }
            await this.open(data);
        },
        deletePermission(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定删除数据权限？", "提示").then(() =>{
                this.common.postUrl("permissionService", "deletePermissionById", {id: selectData[0].id}, function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        async bindUser() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要绑定的数据！");
                return false;
            }
            this.info = this.common.copyObj(selectData[0]);
            if (this.common.isNotBlank(this.info.userIds))
            {
                this.info.userIds = this.info.userIds.split(',').map(Number);
            }
            await this.openDialog(true);
        },
        openDialog(flag)
        {
            this.dialogShow = flag;
            this.$forceUpdate();
        },
        async bindUserPermissionById()
        {
            if (this.common.isBlank(this.info.id))
            {
                this.$message.error("请选择数据权限!");
                return;
            }
            let param = this.common.copyObj(this.info);
            if (param.userIds.length != 0)
            {
                param.userIds = param.userIds.join(",");
            }
            await this.common.postUrl("permissionService", "bindUserPermissionById", param, null, null, '', true);
            await this.openDialog(false);
            await this.doQuery();
            this.$message.success(this.title + "成功！");
        },


    },
}
