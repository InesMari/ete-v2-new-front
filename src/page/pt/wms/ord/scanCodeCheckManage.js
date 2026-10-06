import tableCommon from "@/components/table/tableCommon.vue"
import selectWork from "@/page/pt/wms/selectWork.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'scanCodeCheckManage',
    data()
    {
        return {
            head: [
                {"name": "扫码编号", "code": "orderNum", "width": "150", "type": "text"},
                {"name": "条码编号", "code": "codeNum", "width": "200", "type": "text"},
                {"name": "扫码次数", "code": "scanTimes", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
            ],
            query: this.initQuery(),
        }
    },
    mounted()
    {
        this.doQuery();
    },
    components: {
        searchList, selectWork,
        tableCommon,
    },
    methods: {
        async doQuery()
        {
            await this.$refs.table.load("wmsScanCodeCheckTF", "queryScanCodeCheckInfoPage", this.query);
        },

        initQuery()
        {
            return this.query = {
                searchStr: '',
            };
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
    },
}
