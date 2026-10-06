import printJS from 'print-js'
import innerTab from "@/components/innerTab/innerTab.vue"
import printTagCode from "@/page/pt/wms/ord/printTagCode.vue"
export default {
    name: 'printInOrder',
    data() {
        return {
            userName:this.common.userInfo().userName,
            printDate:this.common.formatDate.getDateTime(),
            info:{},
            totalInfo:{nums:0,boxNums:0,palletNums:0},
            materialList:[],
            packMaterialList:[],
            feeList:[],
            tabs: [
                {name: "入库单打印", active: true,type:1,},
                {name: "标签打印",type:2,},
            ],
            showType: 1,
            hasNewQrcode: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadInOrderInfo();
    },
    /**
     * 组件
     */
    components: {
        innerTab,
        printTagCode,
    },
    /**
     * 绑定函数
     */
    methods: {        
        async selectCallback(data)
        {
            this.tab = data;
            this.showType = data.type;
        },
        // 条码打印
        printTag(){
            this.showType = 2;
            this.tabs[0].active = false;
            this.tabs[1].active = true;
        },
        /**
         * 加载订单数据
         */
        async loadInOrderInfo()
        {
            let data = await this.common.postUrl("wmsInOrderTF", "queryWmsInOrderInfoForPrint",
                {inOrderId: this.$route.query.inOrderId},
                null, null, null, true);
            this.info = data.info;
            this.hasNewQrcode = data.hasNewQrcode;
            if(this.common.isNotBlank(this.info.rejectedTypeName)){
                this.info.rejectedStateName = this.info.rejectedStateName+"("+this.info.rejectedTypeName+")";
            }
            this.materialList = data.materialList;
            this.feeList = data.feeList;
            for (let i = 0; i < this.materialList.length; i++) {
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums,this.materialList[i].nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,this.materialList[i].boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,this.materialList[i].palletNums);
            }
            this.packMaterialList = data.packMaterialList;
            this.totalPalletNums();
            this.initTableHeight();
        },
        // 统计板数
        totalPalletNums(){
            let totalPalletNums = 0;
            this.materialList.forEach(item => {
                totalPalletNums += item.palletNums;
            })
            this.info.totalPalletNums = parseInt(totalPalletNums);
            this.$forceUpdate();
        },
        // 同步表格高度
        initTableHeight(){
            let m_l = this.materialList.length;
            // let f_l = this.feeList.length;
            let p_l = this.packMaterialList.length;
            if(m_l<4){     //至少4行
                for(let i=0;i<4-m_l;i++){
                    this.materialList.push({});
                }
            }
            if(p_l<2){  //包材至少2行
                for(let i=0;i<2;i++){
                    this.packMaterialList.push({});
                }
            }
            // if(m_l>f_l){                
            //     for(let i=0;i<m_l - f_l;i++){
            //         this.feeList.push({});
            //     }
            // }else{         
            //     for(let i=0;i<f_l - m_l;i++){
            //         this.materialList.push({});
            //     }
            // }
        },
        print(){
            // lodopUtil.printHTMLInfo("printTable", "打印入库单");
            printJS({
                printable: 'printTable',
                type: 'html',
                scanStyles: false,
            })
            // //打印次数加一
            this.common.postUrl("wmsInOrderTF", "addPrintTimes",
                {inOrderId: this.$route.query.inOrderId},
                null);
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id)
        },
    },
}
