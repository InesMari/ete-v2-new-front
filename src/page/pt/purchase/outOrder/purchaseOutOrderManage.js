import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'purchaseOutOrderManage',
    data() {
        return {
            head: [
                {"name": "出库地", "code": "workName", "width": "300", "type": "text"},
                {"name": "出库单号", "code": "outNum", "width": "150", "type": "text"},
                {"name": "物种品类", "code": "feeSubTypeName", "width": "150", "type": "text"},
                {"name": "品名", "code": "projectNames", "width": "150", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "150", "type": "text"},
                {"name": "数量单位", "code": "units", "width": "150", "type": "text"},
                {"name": "出库数量", "code": "outTotalNums", "width": "100", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "出库日期", "code": "outDate", "width": "150", "type": "text"},
                {"name": "出库人员", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "出库操作时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {
                workId:'',
                outNum:'',
                feeType:'',
                feeSubType:'',
                projectName:'',
                createUserName:'',
                outDate:'',
            },
            workData: [],
            feeTypeData: [],
            feeSubTypeData: [],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.initStaticData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData()
        {
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.workData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
        },
        async doQuery(query = this.query) {
            this.query = query;
            if (this.common.isNotBlank(this.query.outDate) && this.query.outDate.length == 2) {
                this.query.beginOutDate = this.query.outDate[0];
                this.query.endOutDate = this.query.outDate[1];
            } else {
                this.query.beginOutDate = '';
                this.query.endOutDate = '';
            }
            await this.$refs.table.load("purPurchaseOrderDeliveryService", "queryPurOutStockPage", this.query);
        },
        dblclickItem(item){
            this.open({
                query:{id:item.id},
                urlId: 'outOrderDetail' + item.id,
                urlName: '出库管理详情',
                urlPathName: '/outOrderDetail',
                urlPath: "/pt/purchase/outOrder/outOrderDetail.vue",
            });
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"出库地","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
                {"name":"出库单号","model":"outNum","type":"input","isshow":true},
                {"name":"物品种类","model":"feeType","type":"select","options":this.feeTypeData,"label":"codeName","value":"codeValue","placeholder":"物品种类","method":"doQuery","isshow":true},
                {"name":"物品子种类","model":"feeSubType","type":"select","options":this.feeSubTypeData,"label":"codeName","value":"codeValue","placeholder":"物品种类","method":"doQuery","isshow":true},
                {"name":"品名","model":"projectName","type":"input","isshow":true},
                {"name":"出库日期","model":"outDate","type":"daterange","isshow":true},
                {"name":"出库人员","model":"createUserName","type":"input","isshow":true},
            ]
        }
    },
}
