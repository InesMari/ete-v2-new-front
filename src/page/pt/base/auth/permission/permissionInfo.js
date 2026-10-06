export default {
    name: 'permissionInfo',
    data()
    {
        return {
            info: {
                id:'',
                name:'',
                remark:'',
                type:null,
            },
            disabled:false,
            type:this.$route.query.type,
            initTypeData: [],
            typeData: [],
            menuData: [],
            orgData: [],
            list: [],
            showOrg: false,
        }
    },
    mounted()
    {
        this.init();
        if (this.type == 1)
            this.addItem();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadPermissionById(this.$route.query.id)
    },
    methods: {
        async init()
        {
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "AUTH_TYPE"});
            this.typeData = data.AUTH_TYPE;
            let initTypeData = this.common.copyObj(data.AUTH_TYPE);
            for (let i = 0; i <initTypeData.length; i++)
            {
                let item = initTypeData[i];
                if (item.codeValue == 4)
                {
                    initTypeData.splice(i, 1);
                    i--;
                }
            }
            this.initTypeData = initTypeData;
            this.menuData = await this.common.postUrl("menuTF", "queryAuthMenuList", {});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
        },
        async loadPermissionById(id)
        {
            if (id < 0)
                return false;
            let data = await this.common.postUrl("permissionService", "loadPermissionById", {id});
            this.info = data.info;
            if (data.info.type)
                this.info.type = String(data.info.type);
            this.list = data.list;
            if (data.list)
            {
                for (let item of data.list)
                {
                    if (item.type)
                        item.type = String(item.type);
                    if (item.orgIds)
                    {
                        item.orgId = item.orgIds.split(',');
                        item.orgId = item.orgId.map(Number);
                    }
                    await this.changeAuth(item, false);
                }
            }
            this.disabled = this.type == 0;
            this.$forceUpdate();
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        async changeAuth(data, initFlag)
        {
            let switchFlag = false
            for (let item of this.list)
            {
                if (item.type == 4)
                {
                    switchFlag = true;
                    break
                }
            }
            if (initFlag)
            {
                data.orgId = null;
            }
            this.showOrg = switchFlag;
            this.$forceUpdate();
        },
        addItem()
        {
            this.list.push({
                entityId: null,
                type: null,
                orgId: null,
            });
            this.$forceUpdate();
        },
        removeItem(index)
        {
            if (this.list.length > 0)
            {
                this.list.splice(index, 1);
            }
            this.$forceUpdate();
        },
        async savePermission()
        {
            let info = this.info;
            if (this.common.isBlank(info.name))
            {
                this.$message.error("请输入数据权限名称!")
                return false;
            }
            if (this.common.isBlank(info.type) || info.type < 0)
            {
                this.$message.error("请选择初始权限!")
                return false;
            }
            let list = this.common.copyObj(this.list);
            if (list.length > 0)
            {
                let set = new Set();
                for (let i = 0; i < list.length; i++)
                {
                    let item = list[i];
                    if (this.common.isBlank(item.entityId) || item.entityId < 0)
                    {
                        this.$message.error("请选择" + (i + 1) + "条特殊权限的数据模块!")
                        return false;
                    }
                    if (set.has(item.entityId))
                    {
                        this.$message.error("请选择" + (i + 1) + "条特殊权限的数据模块重复了!")
                    }
                    if (this.common.isBlank(item.type) || item.type < 0)
                    {
                        this.$message.error("请选择" + (i + 1) + "条特殊权限的数据权限!")
                        return false;
                    }
                    if (item.type == 4)
                    {
                        if (this.common.isBlank(item.orgId) || item.orgId.length == 0)
                        {
                            this.$message.error("请选择" + (i + 1) + "条特殊权限的指定的部门!")
                            return false;
                        }
                        item.orgIds = item.orgId.join(",");
                    }
                    set.add(item.entityId);
                }
            }
            let param = this.common.copyObj(this.info);
            param.list = list;
            if (this.type == 5)//copy
                param.id = null;
            await this.common.postUrl("permissionService", "saveOrUpdatePermission", param);
            this.$message.success("保存成功！");
            this.closePage();
        },

        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}