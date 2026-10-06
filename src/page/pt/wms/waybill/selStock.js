import dbTable from "@/components/dbTable/dbTable.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'wmsWaybillSelStock',
    data()
    {
        return {
            head: [
                {"name": "出/入库单号", "code": "outOrderNum", "width": "200", "type": "text"},
                {"name": "货主", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
                {"name": "批次号", "code": "batchNum", "width": "150", "type": "text"},
                {"name": "供应商批次号", "code": "supplierBatchNum", "width": "150", "type": "text"},
                {"name": "ASN", "code": "asn", "width": "150", "type": "text"},
                {"name": "物料描述", "code": "materialDesc", "width": "150", "type": "text"},
                {"name": "作业点", "code": "workName", "width": "150", "type": "text",},
                {"name": "卸货点", "code": "workDetailName", "width": "150", "type": "text",},
                {"name": "送货卸货地址", "code": "workNameDetail", "width": "300", "type": "text",},
                {"name": "管理单位", "code": "unitName", "width": "150", "type": "text",},
                {"name": "出/入库数量", "code": "nums", "width": "150", "type": "text",},
                {"name": "出/入库箱数", "code": "boxNums", "width": "150", "type": "text",},
                {"name": "出/入库托数", "code": "palletNums", "width": "150", "type": "text", "issum": "true"},
                {"name": "可配送数量", "code": "deliverableNums", "width": "120", "type": "text", "issum": "true"},
                {"name": "可配送箱数", "code": "deliverableBoxNums", "width": "120", "type": "text", "issum": "true"},
                {"name": "可配送托数", "code": "deliverablePalletNums", "width": "120", "type": "text", "issum": "true"},
            ],
            param: {
                outOrderNum: '',
                srcTenantName: '',
                materialNum: '',
                workNameDetail: '',
                // id: this.$route.query.id,//修改的时候还能查询到已经配送的单吗?
            },
        }
    },
    mounted()
    {
        this.doQuery();
    },
    components: {
        dbTable,
        searchList
    },
    methods: {
        doQuery(query = this.param)
        {
            this.param = query;
            this.$refs.table.load("wmsWaybillService", "queryOutOrderMaterialListPage", this.param);
        },
        getSelectItem()
        {
            return this.$refs.table.getRightData();
        },
        next()
        {
            this.$emit("next");
        },
        initData(data)
        {
            this.$refs.table.setRightData(data);
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "出/入库单号", "model": "outOrderNum", "type": "input", "placeholder": "出/入库单号", "isshow": true},
                {"name": "货主", "model": "srcTenantName", "type": "input", "placeholder": "货主","isshow": true},
                {"name": "物料编码", "model": "materialNum", "type": "input", "placeholder": "物料编码", "isshow": true},
                {"name": "批次号", "model": "batchNum", "type": "input", "placeholder": "批次号", "isshow": true},
                {"name": "供应商批次号", "model": "supplierBatchNum", "type": "input", "placeholder": "供应商批次号", "isshow": true},
                {"name": "ASN", "model": "asn", "type": "input", "placeholder": "ASN", "isshow": true},
                {"name": "送货卸货地址", "model": "workNameDetail", "type": "input", "placeholder": "送货卸货地址", "isshow": true},
            ]
        }
    },
}
