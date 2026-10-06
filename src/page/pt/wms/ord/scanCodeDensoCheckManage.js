import tableCommon from "@/components/table/tableCommon.vue"
import selectWork from "@/page/pt/wms/selectWork.vue";
import searchList from "@/components/searchList/searchList.vue";
export default {
    name: 'scanCodeDensoCheckManage',
    data()
    {
        return {
            head: [
                {"name": "看板标签", "code": "kanbanCodeNum", "width": "200", "type": "text"},
                {"name": "供应商代码", "code": "supplierId", "width": "100", "type": "text"},
                {"name": "物料代码", "code": "partNo", "width": "150", "type": "text"},
                {"name": "批号", "code": "batchNo", "width": "120", "type": "text"},
                {"name": "数量", "code": "nums", "width": "80", "type": "text"},
                {"name": "包装箱号", "code": "boxNo", "width": "180", "type": "text"},
                {"name": "产品标签", "code": "materialCodeNums", "width": "300", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "120", "type": "text"},
                {"name": "客户物料编码", "code": "custMaterialNum", "width": "150", "type": "text"},
                {"name": "关联物料代码", "code": "relMaterialNum", "width": "150", "type": "text"},
                {"name": "出库单号", "code": "outOrderNum", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            showSelWork:false,
        }
    },
    mounted()
    {
        this.initSelWork();
    },
    components: {
        searchList,
        selectWork,
        tableCommon,
    },
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            //选择仓库之后加载列表
            this.doQuery();
        },
        async doQuery(query = this.query) {
            this.query = query;
            await this.$refs.table.load("wmsScanCodeCheckDensoTF", "queryScanCodeCheckInfoPage", this.query);
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
        /**
         * 双击查看详情
         * @param data
         * @returns {Promise<void>}
         */
       async dblclickItem(data){
            window.sessionStorage.setItem("scanCodeDensoCheckDetail", JSON.stringify(data));
            this.$emit("openTab",{
                urlId: "scanCodeDensoCheckDetail"+data.outOrderId,
                urlName: '电装扫码校验详情',
                urlPathName: "/scanCodeDensoCheckDetail",
                urlPath: '/pt/wms/ord/scanCodeDensoCheckDetail.vue'});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"关键字","model":"searchStr","type":"input","placeholder":"关键字","isshow":true},
            ]
        }
    },
}
