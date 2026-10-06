import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'operateFeeManage',
    data()
    {
        return {
            head: [
                {"name": "操作费名称", "code": "name", "width": "150", "type": "text"},
                {"name": "到货形式", "code": "deliveryFormName", "width": "250", "type": "text"},
                {"name": "工序名称", "code": "processTypeName", "width": "150", "type": "text"},
                {"name": "合计金额", "code": "amount", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {},
            deliveryFormData: [],
            processTypeData: [],
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
                {'codeType': 'DELIVERY_FORM,PROCESS_TYPE'});
            this.deliveryFormData = data.DELIVERY_FORM;
            this.processTypeData = data.PROCESS_TYPE;
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("standardCostOperateFeeService", "queryStandardCostOperateFeePage", this.query);
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
                urlName: "新增操作费",
                urlId: 'operateFeeInfo' + new Date().getDate(),
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/operateFeeInfo.vue",
                query: {},
            });
        },
        /**
         * 修改
         */
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
                urlName: "修改操作费",
                urlId: 'operateFeeInfo' + item.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/operateFeeInfo.vue",
                query: {
                    id: item.id,
                    type: 2,
                },
            });
        },
        async deleteIncome()
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
                await that.common.postUrl("standardCostOperateFeeService", "deleteStandardCostOperateFee", {id: item.id});
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
                urlName: "操作费详情",
                urlId: 'operateFeeInfo' + data.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/operateFeeInfo.vue",
                query: {
                    id: data.id,
                    type: 5,
                },
            });
        },
        download(){
          this.$refs.table.downloadExcelFile('操作费列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"操作费名称","model":"name","type":"input","placeholder":"操作费名称","isshow":true},
                {"name":"到货形式","model":"deliveryForm","type":"select","options":this.deliveryFormData,"label":"codeName","value":"codeValue","placeholder":"到货形式","method":"doQuery","isshow":true},
                {"name":"工序名称","model":"processType","type":"select","options":this.processTypeData,"label":"codeName","value":"codeValue","placeholder":"工序名称","method":"doQuery","isshow":true},
            ]
        }
    },
}
