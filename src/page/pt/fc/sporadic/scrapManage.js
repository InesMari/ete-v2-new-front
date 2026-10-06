import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'scrapManage',
    data()
    {
        return {
            head: [
                {"name": "物流基地", "code": "workName", "width": "250", "type": "text"},
                {"name": "废品名称", "code": "name", "width": "150", "type": "text"},
                {"name": "计量单位", "code": "unit", "width": "150", "type": "text"},
                {"name": "售卖方式", "code": "salesMethodName", "width": "120", "type": "text"},
                {"name": "联系人", "code": "linkman", "width": "120", "type": "text"},
                {"name": "联系电话", "code": "linkPhone", "width": "120", "type": "text"},
                {"name": "回收方", "code": "recyclingSubject", "width": "120", "type": "text"},
                {"name": "单价(元)", "code": "price", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {},
            workData: [],
            salesMethodData: [],
            scrapTypeData: [],
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
                {'codeType': 'SALES_METHOD,SCRAP_TYPE'});
            this.salesMethodData = data.SALES_METHOD;
            this.scrapTypeData = data.SCRAP_TYPE;
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("scrapService", "queryScrapPage", this.query);
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
                urlName: "新增废品",
                urlId: 'scrapInfo' + new Date().getDate(),
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/scrapInfo.vue",
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
                urlName: "修改废品",
                urlId: 'scrapInfo' + item.id,
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/scrapInfo.vue",
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
                await that.common.postUrl("scrapService", "deleteScrap", {id: item.id});
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
                urlName: "废品详情",
                urlId: 'scrapInfo' + data.id,
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/scrapInfo.vue",
                query: {
                    id: data.id,
                    type: 5,
                },
            });
        },
        download(){
          this.$refs.table.downloadExcelFile('废品列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"物流基地","model":"workId","type":"select","options":this.workData, "label":"workName","value":"workId","method":"doQuery","isshow":true},
                {"name":"售卖方式","model":"salesMethod","type":"select","options":this.salesMethodData,"label":"codeName","value":"codeValue","placeholder":"售卖方式","method":"doQuery","isshow":true},
                {"name":"废品名称","model":"scrapType","type":"select","options":this.scrapTypeData,"label":"codeName","value":"codeValue","placeholder":"废品名称","method":"doQuery","isshow":true},
                {"name":"联系人","model":"linkman","type":"input","placeholder":"联系人","isshow":true},
                {"name":"回收方","model":"recyclingSubject","type":"input","placeholder":"回收方","isshow":true},
            ]
        }
    },
}
