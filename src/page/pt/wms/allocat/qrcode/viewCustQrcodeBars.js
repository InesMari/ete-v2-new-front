import dbTable from "@/components/dbTable/dbTable.vue";
import simpleTable from "@/components/simpleTable/simpleTable.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'viewCustQrcodeBars',
    data() {
        return {
            head: [
                { "name": "客户码ID", "code": "codeNum", "width": "100", "type": "text" },
                { "name": "客户码类型", "code": "relCustQrcodeTypeName", "width": "150", "type": "text" },
                { "name": "库区", "code": "reservoirCode", "width": "100", "type": "text" },
                { "name": "库位", "code": "storageCode", "width": "100", "type": "text" },
                { "name": "物料编码", "code": "materialNum", "width": "150", "type": "text" },
                { "name": "物料描述", "code": "materialDesc", "width": "180", "type": "text" },
                { "name": "批次号", "code": "batchNum", "width": "120", "type": "text" },
                { "name": "供应商批次号", "code": "supplierBatchNum", "width": "120", "type": "text" },
                { "name": "ASN", "code": "asn", "width": "120", "type": "text" },
                { "name": "客户码状态", "code": "stsName", "width": "80", "type": "text" },
                { "name": "上架人", "code": "onShelvesUserName", "width": "100", "type": "text" },
                { "name": "上架时间", "code": "onShelvesDate", "width": "150", "type": "text" },
                { "name": "下架人", "code": "offShelvesUserName", "width": "100", "type": "text" },
                { "name": "下架时间", "code": "offShelvesDate", "width": "150", "type": "text" },
            ],
            id:this.$route.query.id,
            baseInfo:{},
            codeList:[],
            updateFlg:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        simpleTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            let that = this;
            this.common.postUrl("wmsStockMaterialTF", 'getCustQrcodeInfo', {id:this.id}, function (data) {
                that.baseInfo = data.baseInfo;
                that.codeList=data.codeList;
            });
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        // 查看入库单
        toInOrderDetail(id){
            this.$emit("openTab",{
                urlId: "inOrderDetail"+id,
                query: {inOrderId:id,
                    logId: id,
                    logType: enumData.LOG_TYPE.WMS_IN_ORDER,
                },
                urlName: '入库单详情',
                urlPathName: "/inOrderDetail",
                urlPath: '/pt/wms/ord/inOrderDetail.vue'});

        },
        toUpdate(){
            this.head[0].type='input';
            this.updateFlg = true;
        },
        custQrcodeModify(){
            let that = this;
            let codeList = this.$refs.table.getData();
            this.common.postUrl("wmsStockMaterialTF", 'custQrcodeModify', {codeList}, function (data) {
                that.head[0].type='text';
                that.updateFlg = false;
                that.$message.success("修改成功");
            });
        },
        toCancel(){
            this.head[0].type='text';
            this.updateFlg = false;
            let that = this;
            this.common.postUrl("wmsStockMaterialTF", 'getCustQrcodeInfo', {id:this.id}, function (data) {
                that.baseInfo = data.baseInfo;
                that.codeList=data.codeList;
            });
        },
        exportExcel(){
            let {codeNum,inOrderNum,nums,boxNums} = this.baseInfo;
            let head = this.common.copyObj(this.head);
            head.unshift({ "name": "序号"});
            let data = [
                ["标签编号","入库单号","数量","箱数"],
                [codeNum,inOrderNum,nums,boxNums],
                [],
                head.map(item => item.name)
            ];
            this.codeList.forEach((item,index) => {
                data.push([
                    index,
                    item.codeNum,
                    item.relCustQrcodeTypeName,
                    item.reservoirCode,
                    item.storageCode,
                    item.materialNum,
                    item.materialDesc,
                    item.batchNum,
                    item.supplierBatchNum,
                    item.asn,
                    item.stsName,
                    item.onShelvesUserName,
                    item.onShelvesDate,
                    item.offShelvesUserName?item.offShelvesUserName:"",
                    item.offShelvesDate?item.offShelvesDate:"",
                ])
            })
            
            this.common.frontDownloadExcelFile("客户码详情",undefined,data,'Array')
        },
    },
}
