import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'wmsQuoteSheetRptManage',
    data()
    {
        return {
            head: this.initBaseHead(),
            query:{},
            workList:[],
            customerData:[],
        }
    },
    async mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
    },
    methods: {
        initBaseHead() {
            return [
                {"name": "仓库", "code": "workName", "width": "150", "type": "text"},
                {"name": "客户", "code": "custName", "width": "120", "type": "text"},
                {"name": "账期", "code": "accountPeriod", "width": "120", "type": "text"},
                {"name": "报价单号", "code": "quoteNum", "width": "120", "type": "text"},
            ];
        },
        initQuery(){
           this.query={};
        },
        initData(){
            let that = this;
            // 仓库
            this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {}, function (data) {
                that.workList = data;
            });
            // 客户
            this.common.postUrl("customerTF", "loadCustomerList", {}, function (data) {
                that.customerData = data;
            });
        },
        async doQuery()
        {

            let headList = await this.common.postUrl("wmsQuoteSheetTF","queryQuoteSheetHead",this.query);
            let head1Tmp = this.common.copyObj(this.$refs.table.getHeadList());
            let head2Tmp = this.initBaseHead();
            headList.forEach(item => {
                head2Tmp.push({"name":item.headName,"code": item.headCode, "width": "120", "type": "text"})
            })
            let _arr1Set = new Set();
            head1Tmp.forEach(item=>{
                _arr1Set.add(item.code);
            })
            let _arr2Set = new Set();
            head2Tmp.forEach(item=>{
                _arr2Set.add(item.code);
            })

            let intersection = head1Tmp.filter(item => _arr2Set.has(item.code));
            let diff = head2Tmp.filter(item => !_arr1Set.has(item.code));
            this.head = intersection.concat(diff);
            await this.$refs.table.load("wmsQuoteSheetTF", "queryQuoteSheetRptPage", this.query);
        },
        // 查看详情
        dblclickItem(item){
            let quoteId = item.quoteId;
            this.$emit('openTab', {
                urlName: '报价单详情',
                urlId: 'detail'+quoteId,
                urlPathName: "/quoteSheetDetail",
                urlPath: "/pt/wms/quoteSheet/quoteSheetDetail.vue",
                query:{quoteId}
            });
        },
        /**
         * 导出
         */
        downExcel() {
            this.$refs.table.downloadExcelFile();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        },
    },
    computed:{

    },
}
