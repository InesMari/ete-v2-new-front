import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'supplierWmsWorkContractDetailManage',
    data()
    {
        return {
            head: this.initBaseHead(),
            query: {},
            workList: [],
            supplierData: [],
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        searchList,
        tableCommon,
    },
    computed: {
        formData()
        {
            return [
                {"name":"物流中心","model":"workId","type":"select","options":this.workList,"label":"workName","value":"workId","placeholder":"物流中心","method":"doQuery","isshow":true},
                {"name":"供应商","model":"tenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
            ]
        }
    },
    methods: {
        initBaseHead()
        {
            return [
                {"name": "仓库", "code": "workName", "width": "150", "type": "text"},
                {"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
                // {"name": "作业合同编号", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "账期", "code": "accountPeriod", "width": "120", "type": "text"},
            ];
        },
        initQuery()
        {
            this.query = {
                workId: null,
                tenantId: null,
            };
        },
        async initData()
        {
            this.workList = await this.common.postUrl('storeHouseBizTF', 'queryStoreHouseList', {});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let headList = await this.common.postUrl("workContractService", "queryWorkContractHead", this.query);
            let head1Tmp = this.common.copyObj(this.$refs.table.getHeadList());
            let head2Tmp = this.initBaseHead();
            headList.forEach(item =>
            {
                head2Tmp.push({"name": item.headName, "code": item.headCode, "width": "150", "type": "text"})
            })
            let _arr1Set = new Set();
            head1Tmp.forEach(item =>
            {
                _arr1Set.add(item.code);
            })
            let _arr2Set = new Set();
            head2Tmp.forEach(item =>
            {
                _arr2Set.add(item.code);
            })

            let intersection = head1Tmp.filter(item => _arr2Set.has(item.code));
            let diff = head2Tmp.filter(item => !_arr1Set.has(item.code));
            this.head = intersection.concat(diff);
            await this.$refs.table.load("workContractService", "queryWorkContractDetailPage", this.query);
        },
        // 查看详情
        dblclickItem(item)
        {
            let contractId = item.contractId;
            this.$emit('openTab', {
                urlName: '作业合同详情',
                urlId: 'workContractInfo-detail' + contractId,
                urlPathName: "/res",
                urlPath: "/pt/res/workContract/workContractInfo.vue",
                query: {id: contractId, type: 0}//0详情 1新增  2修改 3复制
            });
        },
        /**
         * 导出
         */
        downExcel()
        {
            this.$refs.table.downloadExcelFile();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
    },

}
