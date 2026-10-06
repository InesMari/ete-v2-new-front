import printJS from 'print-js'
import innerTab from "@/components/innerTab/innerTab.vue"
import printTagCode from "@/page/pt/wms/ord/printTagCode.vue"
export default {
    name: 'printOutOrder',
    data() {
        return {
            userName:this.common.userInfo().userName,
            printDate:this.common.formatDate.getDateTime(),
            info:{},
            totalInfo:{nums:0,boxNums:0,palletNums:0},
            materialList:[],
            custQrcodeList:[],
            packMaterialList:[],
            feeList:[],
            tabs: [
                {name: "出库单打印", active: true,type:1,},
            ],
            showType: 1,
            hasNewQrcode: false,
            newScanQrcode:false,
            hasCustQrcode:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadOrderInfo();
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
            this.tabs.forEach(item => {
                item.active = false;
                if(item.type == this.showType){
                    item.active = true;
                }
            })
            this.$refs.tabs.refresh();
            this.$forceUpdate();
        },
        // 客户码打印
        viewCustCode(){
            this.showType = 3;
            this.tabs.forEach(item => {
                item.active = false;
                if(item.type == this.showType){
                    item.active = true;
                }
            })
            this.$refs.tabs.refresh();
            this.$forceUpdate();
        },
        /**
         * 加载订单数据
         */
        async loadOrderInfo()
        {
            let data = await this.common.postUrl("wmsOutOrderTF", "queryWmsOutOrderInfoForPrint",
                {outOrderId: this.$route.query.outOrderId},
                null, null, null, true);
            this.info = data.info;
            this.newScanQrcode = data.info.newScanQrcode;
            this.hasNewQrcode = data.hasNewQrcode;
            if(this.hasNewQrcode) this.tabs.push({name: "标签打印",type:2});
            this.materialList = data.materialList;
            this.feeList = data.feeList;
            for (let i = 0; i < this.materialList.length; i++) {
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums,this.materialList[i].nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,this.materialList[i].boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,this.materialList[i].palletNums);
                this.info.planPalletNums = this.common.accAdd(this.info.planPalletNums,this.materialList[i].planPalletNums);
            }
            this.packMaterialList = data.packMaterialList;
            this.totalPalletNums();
            this.initTableHeight();
            this.custQrcodeList = await this.common.postUrl("wmsInOrderTF", "queryCustQrcodeList", {outOrderId: this.$route.query.outOrderId});
            if(this.custQrcodeList && this.custQrcodeList.length > 0){
                this.hasCustQrcode = true;
                this.tabs.push({name: "客户码打印",type:3});
            }
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
            // if(m_l<4){     //至少4行
            //     for(let i=0;i<4-m_l;i++){
            //         this.materialList.push({});
            //     }
            // }
            // if(p_l<2){  //包材至少2行
            //     for(let i=0;i<2;i++){
            //         this.packMaterialList.push({});
            //     }
            // }
        },
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/print.css',  //真实路径/public//static/css/print.css
                scanStyles: false,
            })
            //打印次数加一
            this.common.postUrl("wmsOutOrderTF", "addPrintTimes",
                {outOrderId: this.$route.query.outOrderId},
                null);
        },
        // 打印客户码
        printCustCode(){
            printJS({
                printable: 'custTable',
                type: 'html',
                css: './static/css/printCustCode.css',  //真实路径/public//static/css/print.css
                scanStyles: false,
            })            
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
