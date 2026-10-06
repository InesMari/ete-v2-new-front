import tableCommon from "@/components/table/tableCommon.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import myImport from "@/components/myImport/myImport";
import printJS from 'print-js';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";


export default {
    name: 'storageInfoManage',
    data() {
        return {
            head: [
                {"name": "库位编码", "code": "storageCode", "width": "110", "type": "text"},
                // {"name": "库位条形码编码", "code": "qrCode", "width": "160", "type": "text"},
                {"name": "库位条码", "code": "", "width": "160", "type": "diy"},
                {"name": "所属库区", "code": "reservoirName", "width": "110", "type": "text"},
                {"name": "是否混物料", "code": "isMixGoodsName", "width": "110", "type": "text"},
                {"name": "是否混批次", "code": "isMixBatchName", "width": "110", "type": "text"},
                {"name": "重复放入", "code": "isRepeatName", "width": "110", "type": "text"},
                {"name": "库位类型", "code": "storageTypeName", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "110", "type": "text"}
            ],
            query: this.initQuery(),
            storage: {
                storageType:'1',
                isRepeat:'',
                isMixBatch:'',
                isMixGoods:'',
            },//库位信息
            reservoirData: [],//库区下拉
            whetherData: [],//是否混批次
            storageTypeData:[],//库位类型
            showStorage: false,//新增库位
            isLock: false,//查看
            title: '新增库位',
            showSelWork:false,
            uploadOpen : false,//导入
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.doQuery();
        this.initStaticData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myImport,
        selectWork,
        searchList
    },
    /**
     * 绑定函数
     */
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
        async doQuery(query = this.query) {
            this.query = query;
            await this.$refs.table.load("wmsReservoirTF", "queryStoragePage", this.query);
            let that = this.$refs.table;
            setTimeout(() => {
                that.resetTrHeight();
            }, 1000);
        },
        async initStaticData() {
            //库区下拉
            this.reservoirData = await this.common.postUrl("wmsReservoirTF", "getReservoirDataSel", {});
            //是否混批次
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            //库位类型
            this.storageTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STORAGE_TYPE"});
        },
        initQuery() {
            return this.query = {
                storageCode:null,
                reservoirName:null,
                storageType:null,
                isMixBatch:null,
                isMixGoods:null,
                isRepeat:null,
            };
        },
        /** 打开关闭 新增库位弹窗 */
        toAddStorage(flag) {
            if(flag){
                this.title = "新增库位";
                this.showStorage = true;
                this.init();
            }else{
                this.storage = {
                    storageType:'1',
                    isRepeat:'',
                };
                this.showStorage = false;
                this.isLock = false;
            }
        },
        /** 双击查看详情 */
        dblclickItem(data){
            this.toUpStorage(data);
        },
        /** 打开关闭 修改库位弹窗 */
        async toUpStorage(data) {
            if(this.common.isBlank(data)){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条库位信息！");
                    return;
                }
                data = selectData[0];
                this.title = "修改库位";
            }else{//查看详情
                this.isLock = true;
                this.title = "查看库位";
            }
            this.storage = await this.common.postUrl("wmsReservoirTF", "queryStorageInfoById", {id:data.id});
            this.storage.isMixBatch = this.storage.isMixBatch.toString();
            this.storage.isMixGoods = this.storage.isMixGoods.toString();
            this.storage.storageType = this.storage.storageType.toString();
            if(this.common.isNotBlank(this.storage.isRepeat)){
                this.storage.isRepeat = this.storage.isRepeat.toString();
            }
            this.showStorage = true;
        },
        /** 保存库位信息 */
        saveStorage() {
            if(this.common.isBlank(this.storage.storageCode)){
                this.$message.error("请输入库位编码！");
                return;
            }
            if(this.common.isBlank(this.storage.reservoirId)){
                this.$message.error("请选择所属库区！");
                return;
            }
            if(this.common.isBlank(this.storage.isMixBatch)){
                this.$message.error("请选择是否混批次！");
                return;
            }
            if(this.common.isBlank(this.storage.isMixGoods)){
                this.$message.error("请选择是否混货品！");
                return;
            }
            let mes = this.common.isBlank(this.storage.id) ? "新增成功！" : "修改成功！";
            let that = this;
            that.common.postUrl("wmsReservoirTF", "saveStorage", that.storage, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.toAddStorage(false);
                    that.$message.success(mes);
                }
            },null,'',true);
        },
        /** 删除库位信息 */
        delStorageInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条库位信息！");
                return;
            }
            this.$confirm("是否确认删除？", "提示").then(async () =>{
                await this.common.postUrl("wmsReservoirTF", "delStorageInfo", selectData[0],
                null, null, '', true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        async print()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条库位信息！");
                return;
            }
            let id = selectData[0].id;
            this.$emit('openTab', {
                urlName: '打印库位',
                urlId: 'printStorageInfo'+id,
                urlPathName: "/printStorageInfo",
                urlPath: "/pt/wms/base/printStorageInfo.vue",
                query : selectData[0]
            });
        },
        showUpload(flag)
        {
            this.uploadOpen = flag;
        },
        async uploadSuccess()
        {
            await this.doQuery();
            this.showUpload(false);
            this.$message.success("库位导入成功！");
        },
        changeMixGoods(){
            if(this.storage.isMixGoods=='1'){
                this.storage.isMixBatch='1';
            }
            this.$forceUpdate();
        },
        changeStorageType(){
            if(this.storage.storageType=='2'){
                this.storage.isRepeat = '0';
                this.storage.isMixGoods = '0';
                this.storage.isMixBatch = '0';
            }else{
                this.storage.isRepeat = '';
            }
            this.$forceUpdate();
        },
        changeRepeat(){
            if(this.storage.isRepeat=='0'){
                this.storage.isMixGoods = '0';
                this.storage.isMixBatch = '0';
            }
            this.$forceUpdate();
        },
        // 批量打印
        batchPrint(paper){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一条库位信息！");
                return
            }
            // 删除已插入的node节点
            let delNode = document.getElementById("printStorageCodeId");
            if(this.common.isNotBlank(delNode)) document.body.removeChild(delNode);
            let tag = "";
            if(paper == 'A4'){
                selectData.forEach(item => {
                    if(item){
                        var dom = `
                        <div class="printStorageCodeA4">
                        <img src="${item.qrImgPath}" alt="" width="100%" style="margin-top:150px;">
                        <div style="text-align:center;padding:0 12px;">
                            <p class="printStorageCodeTxtA4" style="width: 50%;float: left;text-align:center;font-size: 48px;line-height: 120px;"">库区：${item.reservoirName}</p>
                            <p class="printStorageCodeTxtA4" style="width: 50%;float: left;text-align:center;font-size: 48px;line-height: 120px;"">库位：${item.storageCode}</p>
                        </div>
                        </div>
                        `
                        tag += dom;
                    }
                });
                var css = './static/css/print.css';  //真实路径/public//static/css/print.css
            }else if(paper == 'label'){
                selectData.forEach(item => {
                    if(item){
                        var dom = `
                        <div class="printStorageCodeLabel">
                            <img class="img" src="${item.qrImgPath}">
                            <div class="printStorageCodeTxtLabel">
                                <span>${item.storageCode}</p>
                            </div>
                        </div>
                        `
                        tag += dom;
                    }
                });
                var css = './static/css/printStorageCode.css';  //真实路径/public//static/css/printStorageCode.css
            }
            let view = document.createElement("div");
            view.style.display = "none";
            view.innerHTML = tag;
            view.id = 'printStorageCodeId';
            document.body.appendChild(view);
            printJS({
                printable: printStorageCodeId,
                type: 'html',
                css,
                scanStyles: false
            })
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
                urlId: 'storage' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.STORAGE,
                },
                urlName: "库位" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },

    },
    computed:{
        formData(){
            return [
                {"name":"库位编码","model":"storageCode","type":"input","placeholder":"库位编码","isshow":true},
                {"name":"库区名称","model":"reservoirName","type":"input","placeholder":"库区名称","isshow":true},
                {"name":"库位类型","model":"storageType","type":"select","options":this.storageTypeData,"label":"codeName","value":"codeValue","placeholder":"库位类型","method":"doQuery","isshow":true},
                {"name":"是否混物料","model":"isMixGoods","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否混物料","method":"doQuery","isshow":true},
                {"name":"是否混批次","model":"isMixBatch","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否混批次","method":"doQuery","isshow":true},
                {"name":"重复放入","model":"isRepeat","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"重复放入","method":"doQuery","isshow":this.query.storageType==2},
            ]
        }
    },
}
