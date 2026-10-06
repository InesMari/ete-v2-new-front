
import lodopUtil from "@/utils/lodop/lodop-business.js"
export default {
    name: 'payApplyPrint',
    data() {
        return {
            userName:this.common.userInfo().userName,
            orgName:this.common.userInfo().orgName,
            printDate:this.common.formatDate.getDateTime(),
            payFee:this.$route.query.payFee,
            totalShareFee:0,
            printData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadPrintData();
    },
    /**
     * 组件
     */
    components: {
    },
    /**
     * 绑定函数
     */
    methods: {
        async loadPrintData() {
            this.printData = await this.common.postUrl("fcThirdPayFeeTF", "queryFcThirdPayFeeInfoForPrint", this.$route.query);
            let waybillNumSet = new Set();
            for (let i = 0; i < this.printData.length; i++) {
                if (!waybillNumSet.has(this.printData[i].waybillNum))
                    this.totalShareFee = this.common.accAdd(this.totalShareFee,this.printData[i].shareTotalFee);
                waybillNumSet.add(this.printData[i].waybillNum);
            }
        },
        print(){
            lodopUtil.printTableInfo("printTable", "G7付款申请单");
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        // 导出excel
        downloadFile(){
            let array = [
                {name:"下单客户",code:"orderCustName"},
                {name:"客户单号",code:"custOrderNum"},
                {name:"订单编号",code:"orderNum"},
                {name:"派车单号",code:"waybillNum"},
                {name:"供应商",code:"supplierName"},
                {name:"发货日期",code:"startWorkDate"},
                {name:"完成天数",code:"endDays"},
                {name:"起始地",code:"startWorkAddress"},
                {name:"目的地",code:"endWorkAddress"},
                {name:"重量/KG",code:"goodsWeight"},
                {name:"件数/件",code:"goodsCount"},
                {name:"体积/m³",code:"goodsVolume"},
                {name:"车长/m",code:"vehicleLengthName"},
                {name:"司机",code:"driverName"},
                {name:"总运费",code:"totalFee"},
                {name:"收款人",code:"receiveUserName"},
                {name:"申请金额",code:"fee"},
                {name:"申请备注",code:"remark"},
                {name:"申请人",code:"createUserName"},
                {name:"平台基地",code:"g7NtoccGroundName"},
            ]
            this.common.frontDownloadExcelFile('G7付款申请单',array,this.printData)
        }
    },
}
