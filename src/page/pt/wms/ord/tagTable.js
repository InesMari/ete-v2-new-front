import scrollTable from "@/components/scrollTable/scrollTable.vue";
import enumData from "@/page/pt/enum";
export default {
    name: 'outOrderDetail',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        head:{
            type: Array,
            default: () => [
                { "name": "标签ID", "code": "codeNum", "width": "150", "type": "text" },
                { "name": "父标签ID", "code": "parentCodeNum", "width": "150", "type": "text" },
                { "name": "物料编码", "code": "materialNum", "width": "150", "type": "text" },
                { "name": "物料描述", "code": "materialDesc", "width": "180", "type": "text" },
                { "name": "批次号", "code": "batchNum", "width": "120", "type": "text" },
                { "name": "供应商批次号", "code": "supplierBatchNum", "width": "120", "type": "text" },
                { "name": "ASN", "code": "asn", "width": "120", "type": "text" },
                { "name": "箱数", "code": "boxNums", "width": "80", "type": "text","isSum":true },
                { "name": "条码数量", "code": "nums", "width": "100", "type": "text","isSum":true },
                { "name": "是否尾数", "code": "isRemainderName", "width": "100", "type": "text" },
                { "name": "库位", "code": "storageCode", "width": "120", "type": "text" },
                { "name": "标签状态", "code": "stsName", "width": "80", "type": "text" },
                { "name": "上架人", "code": "onShelvesUserName", "width": "100", "type": "text" },
                { "name": "上架时间", "code": "onShelvesDate", "width": "150", "type": "text" },
                { "name": "下架人", "code": "offShelvesUserName", "width": "100", "type": "text" },
                { "name": "下架时间", "code": "offShelvesDate", "width": "150", "type": "text" },
            ]
        },
        showTagBtn: {
            type: Boolean,
            default: true,
        },
        type:{
            type : [Number,String],
            default : 1,
        }
    },
    data() {
        return {
            showType: 1,
            tagSearch: "",
            materialCodeList: [],
            selectAll:true,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initHead();
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
        initHead(){
            let obj = {};
            if(this.type == 1){     //入库
                obj = { "name": "出库单号", "code": "outOrderNum", "width": "150", "type": "diy" };
            }else if(this.type == 2){       //出库
                obj = { "name": "入库单号", "code": "inOrderNum", "width": "150", "type": "diy" };
            }
            this.head.splice(2,0,obj);
        },
        // 搜索条码
        searchCode() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.common.isBlank(this.tagSearch)) {
                    this.$refs.tagTable.setData(this.materialCodeListSearch);
                } else {
                    let materialCodeList = [];
                    this.materialCodeListSearch.forEach(item => {
                        for (const value of Object.values(item)) {
                            if (this.common.isNotBlank(value) && String(value).indexOf(this.tagSearch) > -1) {
                                materialCodeList.push(item);
                                break;
                            }
                        }
                    })
                    this.$refs.tagTable.setData(materialCodeList);
                    this.$refs.tagTable.changeTop(0)
                }
                clearTimeout(this.timer);
            }, 300);
        },
        // 标签预览
        printTagCode() {
            let type = this.type;
            if(type == 1){      //入库
                let isAll = this.$refs.tagTable.selectAll;
                let idArr = [];
                let data = this.$refs.tagTable.getSelectItem();
                if(this.materialCodeListSearch.length != data.length) isAll = false;
                if(data.length==0){
                    this.$message.error("请选择标签。");
                    return;
                }
                data.forEach(item => {
                    idArr.push(item.id);    //获取IDS
                })
                if(!isAll){   //没有全选并且有预览标签时
                    let ids = idArr.join();
                    this.$parent.$emit("openTab",{
                        urlId: "printTagCode_inOrderId"+this.$route.query.inOrderId,
                        query: {ids,type},
                        urlName: '标签预览',
                        urlPathName: "/printTagCode",
                        urlPath: '/pt/wms/ord/printTagCode.vue'});
                }else{
                    this.$parent.$emit("openTab",{
                        urlId: "printTagCode_inOrderId"+this.$route.query.inOrderId,
                        query: {inOrderId: this.$route.query.inOrderId,type},
                        urlName: '标签预览',
                        urlPathName: "/printTagCode",
                        urlPath: '/pt/wms/ord/printTagCode.vue'});
                }
            }else if(type ==2){     //出库
                this.$parent.$emit("openTab", {
                    urlId: "printTagCode_outOrderId" + this.$route.query.outOrderId,
                    query: { outOrderId: this.$route.query.outOrderId, type },
                    urlName: '标签预览',
                    urlPathName: "/printTagCode",
                    urlPath: '/pt/wms/ord/printTagCode.vue'
                });
            }
        },
        // 全选
        selectAllTag(){
            this.materialCodeList.forEach(item => {
                item.isSelect = this.selectAll;
            })
            this.$forceUpdate();
        },
        selectTag(item){
            item.isSelect = !item.isSelect;
            this.checkSelAll();
            this.$forceUpdate();
        },
        // 检查是否全选
        checkSelAll(){
            let isAll = true;
            this.materialCodeList.forEach(item => {
                if(!item.isSelect) isAll = false;
            })
            this.selectAll = isAll;
        },
        toDetail(item){
            if(this.type == 1){     //入库
                this.$parent.$emit("openTab", {
                    urlId: "outOrderDetail" + item.outOrderId,
                    query: {outOrderId: item.outOrderId},
                    urlName: '出库单详情',
                    urlPathName: "/outOrderDetail",
                    urlPath: '/pt/wms/ord/outOrderDetail.vue'
                });
            }else if(this.type == 2){       //出库
                this.$parent.$emit("openTab",{
                    urlId: "inOrderDetail"+item.inOrderId,
                    query: {inOrderId:item.inOrderId,
                        logId: item.inOrderId,
                        logType: enumData.LOG_TYPE.WMS_IN_ORDER,
                    },
                    urlName: '入库单详情',
                    urlPathName: "/inOrderDetail",
                    urlPath: '/pt/wms/ord/inOrderDetail.vue'});
            }
        },
    },

    watch: {
        data: {
            handler: function (val) {
                val.forEach(item => {
                    item.isSelect = true;
                    if(item.sts == 0) item.class = 'disabled';
                })
                this.$refs.tagTable.setData(val);
                this.$refs.tagTable.selectAll = true
                this.materialCodeListSearch = this.common.copyObj(val);
            }
        },
    },
}
