import tableCommon from "@/components/table/tableCommon.vue";
import authRoleTree from "@/components/auth/authRoleTree.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'shareholderManage',
    data()
    {
        return {
            head: [
                {"name": "股东名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "股东简称", "code": "abbreviationName", "width": "250", "type": "text"},
                {"name": "股东类型", "code": "shareholderTypeName", "width": "150", "type": "text"},
                {"name": "所属中心", "code": "orgIdsName", "width": "200", "type": "text"},
                {"name": "是否启用", "code": "stsName", "width": "120", "type": "diyColorTd"},
                {"name": "股东管理员", "code": "linkman", "width": "120", "type": "text"},
                {"name": "股东管理员账号", "code": "linkPhone", "width": "150", "type": "text"},
                {"name": "地址", "code": "address", "width": "350", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {
                tenantName: '',
                linkPhone: '',
                sts: '',
            },
            showEntityPage: false,
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
        tableCommon,
        authRoleTree,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         * 列表查询
         */
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("shShareholderTF", "queryShareholderInfoPage", this.query);
            items.forEach((el) =>
            {
                if (el.sts == 0)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        /**
         * 初始化数据
         */
        initData()
        {
            let that = this;
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STS"}, function (data)
            {
                that.stsData = data;
            });
        },
        /**
         * 清空
         */
        clear()
        {
            this.query = {
                custName: '',
                linkPhone: '',
                sts: '',
            };
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
         */
        loadEntityTree()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条股东信息");
                return false;
            }
            this.$refs.authRoleTree.loadEntityTree({roleId: array[0].roleId, isPT: 1}, false, 1);
            this.isShowEntityPage(true);
        },
        delShareholderInfo(){
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条股东信息");
                return false;
            }
            this.$confirm('此操作将删除股东'+array[0].tenantName+', 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.common.postUrl("shShareholderTF", "delShareholderInfo", array[0], function (data)
                {
                    that.$message.success("删除成功");
                    that.doQuery();
                });
            }).catch(() =>{});
        },
        updateShareholderState(state)
        {
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length == 0)
            {
                this.$message.error("请至少选择一条股东信息");
                return false;
            }
            let tenantIds = '';
            let tenantNames = '';
            for (let i = 0; i < array.length; i++)
            {
                tenantIds += ',' + array[i].tenantId;
                tenantNames += ',' + array[i].tenantName;
                if (array[i].sts == state)
                {
                    this.$message.error("股东状态不对");
                    return false;
                }
            }
            tenantIds = tenantIds.substr(1);
            tenantNames = tenantNames.substr(1);
            let info = '';
            if (state == 0)
            {
                info = '禁用';
            } else if (state == 1)
            {
                info = '启用';
            }
            this.common.postUrl("shShareholderTF", 'updateShareholderState', {tenantIds, tenantNames, state}, function (data)
            {
                if (data)
                {
                    that.doQuery();
                    that.$message.success(info + "成功！");
                }
            }, null, '', true);
        },
        dblclickItem(data)
        {
            let item = {
                urlName: this.common.isBlank(data.abbreviationName) ? "股东详情" : data.abbreviationName + "-股东详情",
                urlId: 'viewShareholder' + data.tenantId,
                urlPathName: "/viewShareholder",
                urlPath: "/pt/base/sh/addShareholder.vue",
                query: {
                    tenantId: data.tenantId,
                    isLock: 1,
                },
            }
            this.$emit('openTab', item);
        },
        addShareholderInfo(){
            let item = {
                urlName: "新增股东",
                urlId: 'addShareholder',
                urlPathName: "/addShareholder",
                urlPath: "/pt/base/sh/addShareholder.vue",
                query: {
                },
            }
            this.$emit('openTab', item);
        },
        updateShareholderInfo(){
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条股东信息");
                return false;
            }
            if(array[0].sts==0){
                this.$message.error("该股东已禁用，请先启用");
                return false;
            }
            let item = {
                urlName: "修改股东",
                urlId: 'updateShareholder' + array[0].tenantId,
                urlPathName: "/updateShareholder",
                urlPath: "/pt/base/sh/addShareholder.vue",
                query: {
                    tenantId: array[0].tenantId,
                },
            }
            this.$emit('openTab', item);
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"股东名称","model":"tenantName","type":"input","placeholder":"股东名称","isshow":true},
                {"name":"股东管理员账号","model":"linkPhone","type":"input","placeholder":"股东管理员账号","isshow":true},
                {"name":"是否启用","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"是否启用","method":"doQuery","isshow":true},
            ]
        }
    },
}
