import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";

export default {
    name: 'packCostManage',
    data() {
        return {
            head: [
                {"name": "采购单号", "code": "purchaseOrderNum", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "包装名称", "code": "packName", "width": "200", "type": "text"},
                {"name": "采购数量", "code": "purchaseNums", "width": "80", "type": "text"},
                {"name": "含税单价", "code": "price", "width": "80", "type": "text"},
                {"name": "税点", "code": "taxRate", "width": "80", "type": "text"},
                {"name": "含税价", "code": "totalFeeWithTax", "width": "100", "type": "text"},
                {"name": "不含税价", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "是否入账", "code": "billFlag", "width": "80", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "150", "type": "text"},
                {"name": "采购人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "采购日期", "code": "createDate", "width": "150", "type": "text"},
            ],
            headDetail:[
                {"name": "月份", "code": "billMonth", "width": "120", "type": "text"},
                {"name": "分摊金额", "code": "shareFeeWithTax", "width": "100", "type": "text"},
            ],
            loadParam: {supplierName: this.$route.query.supplierName},
            whetherData:[],
            dialogShow:false,
            feeInfo:{},
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        scrollTable
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            this.$refs.table.load("pkgFeeTF", "queryPackCostPage", this.loadParam);
        },
        init() {
            this.initStaticData();
        },
        //初始化页面的静态数据
        initStaticData(){
            let that = this;
            //是否
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"WHETHER"}, function (data) {
                that.whetherData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        showDialog(flag){
            this.feeInfo={};
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条成本数据！");
                    return false;
                }
                this.feeInfo = selectData[0];
                this.dialogShow = flag;
                this.$nextTick(()=>{
                    this.$refs.scrollTable.load("pkgFeeTF", "queryCostShareInfo", {purchaseOrderId:this.feeInfo.id});
                })
            }else{
                this.dialogShow = flag;
            }
        },
    },
}
