import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'transportationCostOutManage',
    data()
    {
        return {
            head: [
                {"name": "单趟成本", "code": "cost", "width": "120", "type": "text"},
                {"name": "管理成本(%)", "code": "manageCost", "width": "120", "type": "text"},
                {"name": "单趟运输成本(含管理费)", "code": "transportationCost", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {},
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
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            this.query.type = 2;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            let {items} = await this.$refs.table.load("standardCostTransportationService", "queryStandardCostTransportationPage", this.query);
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
                urlName: "估算运输成本-外包",
                urlId: 'transportationCostOutInfo' + new Date().getDate(),
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/transportationCostOutInfo.vue",
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
                urlName: "修改运输成本-外包",
                urlId: 'transportationCostOutInfo' + item.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/transportationCostOutInfo.vue",
                query: {
                    id: item.id,
                    type: 2,
                },
            });
        },
        async deleteInfo()
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
                await that.common.postUrl("standardCostTransportationService", "deleteStandardCostTransportation", {id: item.id});
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
                urlName: "运输成本详情-外包",
                urlId: 'transportationCostOutInfo' + data.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/transportationCostOutInfo.vue",
                query: {
                    id: data.id,
                    type: 5,
                },
            });
        },
        download(){
          this.$refs.table.downloadExcelFile('运输成本-外包列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
            ]
        }
    },
}
