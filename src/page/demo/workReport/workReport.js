// import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";

export default {
    name: 'workReport',
    data() {
        return {
            head:[],
            headCache: [
                {"name": "客户", "code": "orderCustName", "width": "110", "type": "text","isFix":true},
                {"name": "全年累计", "width": "320", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "goodsCount", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "finishGoodsCount", "width": "80", "type": "text"},
                        {"name": "毛利额", "code": "remainGoodsCount", "width": "80", "type": "text"},
                        {"name": "毛利率", "code": "remainGoodsCountx", "width": "80", "type": "text"},
                    ]
                },
            ],
            obj_month:{
                "name": "1月", "width": "720", "type": "text",
                "children":[
                    {"name": "订单金额", "code": "goodsWeight", "width": "80", "type": "text"},
                    {"name": "仓储金额", "code": "finishGoodsWeight", "width": "80", "type": "text"},
                    {"name": "其他金额", "code": "remainGoodsWeightx", "width": "80", "type": "text"},
                    {"name": "收入合计", "code": "remainGoodsWeight1", "width": "80", "type": "text"},
                    {"name": "订单成本", "code": "remainGoodsWeight2", "width": "80", "type": "text"},
                    {"name": "其他成本", "code": "remainGoodsWeight3", "width": "80", "type": "text"},
                    {"name": "成本合计", "code": "remainGoodsWeight4", "width": "80", "type": "text"},
                    {"name": "毛利额", "code": "remainGoodsWeight5", "width": "80", "type": "text"},
                    {"name": "毛利率", "code": "remainGoodsWeight6", "width": "80", "type": "text"},
                ]
            },
            loadParam: {},
            monthArr:[
                {value:"-1",name:"全部"},
                {value:"1",name:"1月"},
                {value:"2",name:"2月"},
                {value:"3",name:"3月"},
                {value:"4",name:"4月",disabled:true},
                {value:"5",name:"5月"},
                {value:"6",name:"6月"},
                {value:"7",name:"7月"},
                {value:"8",name:"8月"},
                {value:"9",name:"9月"},
                {value:"10",name:"10月"},
                {value:"11",name:"11月"},
                {value:"12",name:"12月"},
            ],
            months:"",
            year:"",
            companyOptions:[],
            companyList:"",
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initHead();    //初始化表头数据
        this.chooseMonth(this.monthArr[0]);     //默认选择全部月份
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        scrollTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery() {
            this.loadParam.stratDate = '';
            this.loadParam.endDate = '';
            this.$refs.table.load("ordPlanTF", "queryOrdPlanData", this.loadParam);
            this.companyOptions = await this.common.postUrl("supplierTF", "getSupplierSelectData", {});
        },
        /**
         * 选择月份
         * @param {*} item 
         */
        chooseMonth(item){
            if(item.value == "-1"){     //点击全选
                if(this.isSelectAllMonth()){    //全选则反选
                    this.monthArr.forEach(el => {
                        el.isSelect = false;
                    })
                    this.initHead(item.value,false);
                }else{  //非全选则全选
                    this.monthArr.forEach(el => {
                        el.isSelect = true;
                    })
                    this.initHead(item.value,true);
                }
            }else{
                item.isSelect = item.isSelect?false:true;
                //全选是默认选中全部，非全选去掉全部
                if(this.isSelectAllMonth()){
                    this.monthArr[0].isSelect = true;
                }else{
                    this.monthArr[0].isSelect = false;
                }
                this.initHead(item.value)
            }
            this.$forceUpdate();
        },
        /**
         * 月份是否全选
         */
        isSelectAllMonth(){
            let isSelectAll = true;
            this.monthArr.forEach((el,index) => {   //是否已经全选
                if(!el.isSelect&&index!=0){
                    isSelectAll = false;
                }
            })
            return isSelectAll;
        },
        //重设表头
        initHead(){
            this.head = this.common.copyObj(this.headCache);
            this.monthArr.forEach((el,index) => {   //是否已经全选
                if(el.isSelect&&index!=0){
                    let obj_month = this.common.copyObj(this.obj_month);
                    obj_month.name = index+"月";
                    obj_month.children.forEach(m => {
                        m.code = m.code+index;
                    })
                    this.head.push(obj_month);
                }
            })
            this.$nextTick(()=>{
                this.$refs.table.initHead();
            })
        },
    },
}
