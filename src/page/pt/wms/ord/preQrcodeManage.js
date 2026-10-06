import tableCommon from "@/components/table/tableCommon.vue"
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'preQrcodeManage',
    data()
    {
        return {
            head: [
                {"name": "条码编号", "code": "codeNum", "width": "200", "type": "text"},
                {"name": "条码", "code": "qrcodeFileUrl", "width": "180", "type": "diy"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "入库单号", "code": "inOrderNum", "width": "180", "type": "diy"},
                {"name": "出库单号", "code": "outOrderNums", "width": "280", "type": "diy"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
            ],
            query: this.initQuery(),
            info:{
                size:null,
                remark:'',
            },
            showDialog:false,
            showSelWork:false,
        }
    },
    mounted(){
        this.initSelWork();
    },
    components: {
        tableCommon,
        selectWork
    },
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.doQuery();
        },
        async doQuery()
        {
            await this.$refs.table.load("wmsQrcodeTF", "queryQrcodePage", this.query);
            let that = this.$refs.table;
            setTimeout(() => {
                that.resetTrHeight();
            }, 100);
        },

        initQuery()
        {
            return this.query = {
                codeNum: '',
                inOrderNum:'',
                outOrderNum:'',
                remark:'',
            };
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
        /**
         * 跳转
         * @param param
         * @returns {Promise<void>}
         */
        async toDetail(item,code, index)
        {
            if(code == 'outOrderNums'){
                let id = item.outOrderIdArray[index];
                await this.$emit("openTab",{
                    urlId: "outOrderDetail"+id,
                    query: {outOrderId:id,
                        logId: id,
                        logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
                    },
                    urlName: '出库单详情',
                    urlPathName: "/outOrderDetail",
                    urlPath: '/pt/wms/ord/outOrderDetail.vue'});
            } else if (code == 'inOrderNum') {
                await this.$emit("openTab",{
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
        codePrint(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <1) {
                this.$message.error("请选择需要打印的条码！");
                return false;
            }
            let ids = [];
            for (let i = 0; i < selectData.length; i++) {
                ids.push(selectData[i].id);
            }
            this.$emit('openTab', {
                urlName: '打印条码',
                urlId: new Date().getTime(),
                urlPathName: "/preCodePrintView",
                urlPath: "/pt/wms/ord/preCodePrintView.vue",
                query:{ids}
            });
        },
        async delQrcode() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请选择需要删除的条码！");
                return false;
            }
            let ids = [];
            let codeNums = [];
            for (let i = 0; i < selectData.length; i++) {
                ids.push(selectData[i].id);
                codeNums.push(selectData[i].codeNum);
            }
            await this.common.postUrl('wmsQrcodeTF', 'delQrcode', {ids,codeNums}, null, null, null, true);
            this.$message.success("删除成功");
            await this.doQuery();
        },
        /**
         * 显示新增弹出框
         * type 1 新增  2 修改  3 查看
         */
        async addQrcode() {
            this.showDialog = true;
        },
        closeDialog(){
            this.info={
                size:null,
                remark:'',
            };
            this.showDialog = false;
        },
        async save() {
            if(this.common.isBlank(this.info.size)){
                this.$message.error("请输入数量");
                return;
            }
            await this.common.postUrl('wmsQrcodeTF', 'generateQrcode', this.info, null, null, null, true);
            this.$message.success("生成成功");
            await this.doQuery();
            this.closeDialog();
        },
        gotoLog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'Qrcode' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.WMS_QRCODE,
                },
                urlName: "条码" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
