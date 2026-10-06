import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'ordStockManage',
    data() {
        return {
            head: [
                {"name": "订单号", "code": "orderNum", "width": "130", "type": "text"},
                {"name": "下单客户", "code": "orderCustName", "width": "250", "type": "text"},
                {"name": "货物名称", "code": "goodsName", "width": "110", "type": "text"},
                {"name": "货物重量(KG)", "code": "goodsWeight", "width": "80", "type": "text"},
                {"name": "体积(㎡)", "code": "goodsVolume", "width": "80", "type": "text"},
                {"name": "件数(件)", "code": "goodsCount", "width": "80", "type": "text"},
                {"name": "库存状态", "code": "stockStateName", "width": "80", "type": "text"},
                {"name": "库存仓库", "code": "workName", "width": "110", "type": "text"},
                {"name": "库存仓库地址", "code": "workAddressStr", "width": "300", "type": "text"},
                {"name": "到达仓库", "code": "destWorkName", "width": "110", "type": "text"},
                {"name": "到达仓库地址", "code": "destWorkAddressStr", "width": "130", "type": "text"},
                {"name": "客户下单时间", "code": "customerOrderDate", "width": "130", "type": "text"},
                {"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
            ],
            loadParam: {
                orderCustName: this.$route.query.tenantName //客户详情库存管理跳转
            },
            stockStateData:[],
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.customerOrderDate) && this.loadParam.customerOrderDate.length === 2){
                this.loadParam.startCustomerOrderDate = this.loadParam.customerOrderDate[0];
                this.loadParam.endCustomerOrderDate = this.loadParam.customerOrderDate[1];
            }else{
                this.loadParam.startCustomerOrderDate = '';
                this.loadParam.endCustomerOrderDate = '';
            }

            this.$refs.table.load("orderTF", "queryOrdStockData", this.loadParam);
        },
        init() {
            let that = this;
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"STOCK_STATE"}, function (data) {
                that.stockStateData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },

        /**
         * 初始化日期快捷集合
         * @returns {{shortcuts: [{onClick(*): void, text: string}, {onClick(*): void, text: string}, {onClick(*): void, text: string}]}}
         */
        initPickerOptions() {
            this.pickerOptions = {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            };
            return this.pickerOptions;
        }


    },
    computed:{
        formData(){
            return [
                {"name":"订单号","model":"orderNum","type":"input","placeholder":"订单号","isshow":true},
                {"name":"下单客户","model":"orderCustName","type":"input","placeholder":"下单客户","isshow":true},
                {"name":"库存仓库","model":"workName","type":"input","placeholder":"库存仓库","isshow":true},
                {"name":"到达仓库","model":"destWorkName","type":"input","placeholder":"到达仓库","isshow":true},
                {"name":"库存状态","model":"stockState","type":"select","options":this.stockStateData,"label":"codeName","value":"codeValue","placeholder":"库存状态","method":"doQuery","isshow":true},
                {"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
            ]
        }
    },
}
