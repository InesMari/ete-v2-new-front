import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'workCostManage',
    data()
    {
        return {
            head: [
                {"name": "操作费名称", "code": "operateName", "width": "150", "type": "text"},
                {"name": "到货形式", "code": "deliveryFormName", "width": "150", "type": "text"},
                {"name": "辅助材料", "code": "assistPrice", "width": "150", "type": "text"},
                {"name": "设备折旧", "code": "equipmentDepreciation", "width": "120", "type": "text"},
                {"name": "办公折旧", "code": "officeDepreciation", "width": "120", "type": "text"},
                {"name": "损坏费", "code": "damage", "width": "120", "type": "text"},
                {"name": "招待费", "code": "entertain", "width": "120", "type": "text"},
                {"name": "管理成本", "code": "managePercent", "width": "120", "type": "text"},
                {"name": "辅助小计", "code": "assistAmount", "width": "120", "type": "text"},
                {"name": "最终成本", "code": "amount", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {},
            deliveryFormData: [],
        }
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
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
     * 绑定函数
     */
    methods: {
        /**
         * 初始化数据
         */
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'DELIVERY_FORM'});
            this.deliveryFormData = data.DELIVERY_FORM;
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("standardCostWorkService", "queryStandardCostWorkPage", this.query);
            items.forEach((el) =>
            {
                if (el.sts == 0)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        addInfo()
        {
            this.$emit('openTab', {
                urlName: "估算仓储成本",
                urlId: 'workCostInfo' + new Date().getDate(),
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/workCostInfo.vue",
                query: {},
            });
        },
        updateInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据~");
                return false;
            }
            let item = selectData[0];
            this.$emit('openTab', {
                urlName: "修改仓储成本",
                urlId: 'workCostInfo' + item.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/workCostInfo.vue",
                query: {
                    id: item.id,
                    type: 2,
                },
            });
        },
        async deleteCost()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据~");
                return false;
            }
            let item = selectData[0];
            let that = this;
            this.$confirm("你将删除当前数据，是否确认删除", "删除提示" ,{
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                center: true
            }).then(async () => {
                await that.common.postUrl("standardCostWorkService", "deleteStandardCostWork", {id: item.id});
                await that.doQuery();
                that.$message.success("删除成功!");
            }).catch(() =>{})
        },
        detailIncome()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看详情的数据~");
                return false;
            }
            this.dblclickItem(selectData[0]);
        },
        dblclickItem(data)
        {
            this.$emit('openTab', {
                urlName: "仓储成本详情",
                urlId: 'workCostInfo' + data.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/workCostInfo.vue",
                query: {
                    id: data.id,
                    type: 5,
                },
            });
        },
        download(){
          this.$refs.table.downloadExcelFile('仓储成本管理列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"操作费名称","model":"operateName","type":"input","placeholder":"操作费名称","isshow":true},
                {"name":"到货形式","model":"deliveryForm","type":"select","options":this.deliveryFormData,"label":"codeName","value":"codeValue","placeholder":"到货形式","method":"doQuery","isshow":true},
                {"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
            ]
        }
    },
}
