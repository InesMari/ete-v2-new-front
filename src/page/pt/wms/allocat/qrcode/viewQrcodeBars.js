import dbTable from "@/components/dbTable/dbTable.vue";
import simpleTable from "@/components/simpleTable/simpleTable.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';
import enumData from "@/page/pt/enum";

export default {
    name: 'viewQrcodeBars',
    data() {
        return {
            head: [
                {"name": "序号", "code": "idx", "width": "100", "type": "text"},
                {"name": "条码编号", "code": "codeNum", "width": "120", "type": "diy"},
                {"name": "条码", "code": "qrcodeUrl", "width": "180", "type": "diy"},
                {"name": "条码数量", "code": "nums", "width": "120", "type": "text"},
                {"name": "是否尾数", "code": "isRemainderName", "width": "120", "type": "text"},
                {"name": "操作", "code": "modify", "width": "180", "type": "diy"},
            ],
            newHead:[
                {"name": "序号", "code": "idx", "width": "100", "type": "text"},
                {"name": "条码编号", "code": "codeNum", "width": "120", "type": "diy"},
                {"name": "入库单号", "code": "orderNum", "width": "120", "type": "diy"},
                {"name": "条码数量", "code": "nums", "width": "120", "type": "text"},
                {"name": "是否尾数", "code": "isRemainderName", "width": "120", "type": "text"},
                {"name": "箱数", "code": "boxNums", "width": "120", "type": "text"},
                {"name": "客户码类型", "code": "relCustQrcodeTypeName", "width": "120", "type": "text"},
                {"name": "已扫客户码数量", "code": "custQrcodeNums", "width": "120", "type": "diy"},
            ],
            batchList:[],
            id:this.$route.query.id,
            nums:'',
            sheets:'',
            codeList:[],
            srcList: [],
            qrcodeModifyShow:false,
            showQrcode:this.$route.query.isNew != 1,
            info:{},
            newScanQrcode:1,
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
        fileViewer
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            let that = this;
            this.common.postUrl("wmsStockMaterialTF", 'getStockMaterialQrcodeInfo', {id:this.id}, function (data) {
                that.batchList = [data.baseInfo];
                that.newScanQrcode = data.baseInfo.newScanQrcode;
                that.codeList=data.qrcodeList;
                that.nums=data.qrcodeList[0].nums;
                that.sheets=data.qrcodeList.length;
                let nums = 0;
                for (let i = 0; i < that.codeList.length; i++) {
                    that.codeList[i].idx=i+1;
                    nums = that.common.accAdd(nums,that.codeList[i].nums);
                }
                that.codeList.push({idx:'合计：'+that.codeList.length,nums:nums,isTotal:true});
            });
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },

        showQrcodeUrl(data){
            if(!data.qrcodeUrl){
                this.$message.error("没有图片~");
                return;
            }
            this.srcList=[];
            this.srcList.push(data.qrcodeUrl);
            this.$refs.viewer.show();

        },
        showQrcodeModify(flag){
            this.qrcodeModifyShow = flag;
        },
        qrcodeModify(item){
            this.info = this.common.copyObj(item);
            this.showQrcodeModify(true);
        },
        async sureQrcodeModify() {
            await this.common.postUrl('wmsStockMaterialTF', 'qrcodeModify', this.info, null, null, null, true);
            this.$message.success("修改成功")
            this.showQrcodeModify(false);
            this.initInfo();
        },
        // 查看标签
        toTagPrint(item){
            this.$emit("openTab",{
                urlId: "printTagCode_"+item.id,
                query: {ids: item.id,type:1},
                urlName: '标签预览',
                urlPathName: "/printTagCode",
                urlPath: '/pt/wms/ord/printTagCode.vue'});
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
        toCustCodeDetail(id){
            this.$emit("openTab",{
                urlId: "viewCustQrcodeBars"+id,
                query: {id:id},
                urlName: '客户码详情',
                urlPathName: "/viewCustQrcodeBars",
                urlPath: '/pt/wms/allocat/qrcode/viewCustQrcodeBars.vue'});
        }
    },
}
