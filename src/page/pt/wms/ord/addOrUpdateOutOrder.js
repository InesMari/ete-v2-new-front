import enumData from "@/page/pt/enum";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import dbTable from "@/components/dbTable/dbTable.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import XLSX from "xlsx"

export default {
    name: 'addOrUpdateOutOrder',
    data()
    {
        return {
            info: {
                rejectedState: 0,//是否退货
                selfPickup:0,//是否自提
                isEmergency:0,//是否紧急
                fromWorkId: null,//送货地址 其实就是货主关联客户的作业点
                orderType:'1',
                scanCustQrcode:0,
            },
            srcTenantData: [],//所属货主
            fromTenantData: [],//到货厂商
            materialData: [],//物料数据

            packMaterialData: [],//器具数据
            deviceData: [],//器具下拉数据
            fromTenantData2: [],//器具的到货厂商

            orderTypeData:[],//出库类型
            showTenant:true,

            pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,//日期快捷方式
            workData: [],//送货地址
            workDetailData: [],//送货卸货点地址
            head:[
                {name:"批次号",code:'batchNum',width:"100", "type": "text"},
                {name:"供应商批次号",code:'supplierBatchNum',width:"100", "type": "text"},
                {name:"到货厂商",code:'fromTenantName',width:"100", "type": "text"},
                {name:"ASN",code:'asn',width:"100", "type": "text"},
                {name:"物料编码",code:'materialNum',width:"100", "type": "text"},
                {name:"物料描述",code:'materialDesc',width:"120", "type": "text"},
                {name:"规格",code:'specsName',width:"100", "type": "text"},
                {name:"生产日期",code:'produceDate',width:"100", "type": "text"},
                {name:"库位",code:'storageCode',width:"100", "type": "text"},
                {name:"在库数量",code:'stockNums',width:"100", "type": "text",isSum:true},
                {name:"管理单位",code:'unitName',width:"100", "type": "text"},
                {name:"客户码",code:'custQrcodeNum',width:"150", "type": "diy"},
                {name:"计划出库数量",code:'planNums',type:(this.$route.query.modifyRemark==1?'text':'diy'),width:"120",isSum:true,inputFn:"calNums"},
                {name:"计划出库箱数",code:'planBoxNums',type:(this.$route.query.modifyRemark==1?'text':'input'),width:"100",isSum:true,inputFn:"calcNums"},
                {name:"计划出库托数",code:'planPalletNums',type:(this.$route.query.modifyRemark==1?'text':'input'),width:"100",isSum:true,inputFn:"calcNums"},
                {name:"时代条码",code:'codeNum',type:(this.$route.query.modifyRemark==1?'text':'input'),width:"150"},
                {name:"卸货地",code:'workDetailId',type:'diy',width:"150"},
            ],
            stockHead:[
                {name:"库位",code:'storageCode',width:"120", "type": "text"},
                {name:"生产日期",code:'produceDate',width:"100", "type": "text"},
                {name:"批次号",code:'batchNum',width:"100", "type": "text"},
                {name:"客户码",code:'custQrcodeNum',width:"150", "type": "diy"},
                {name:"供应商批次号",code:'supplierBatchNum',width:"100", "type": "text"},
                {name:"到货厂商",code:'fromTenantName',width:"100", "type": "text"},
                {name:"ASN",code:'asn',width:"100", "type": "text"},
                {name:"物料编码",code:'materialNum',width:"200", "type": "text"},
                {name:"物料描述",code:'materialDesc',width:"200", "type": "text"},
                {name:"规格",code:'specsName',width:"100", "type": "text"},
                {name:"在库数量",code:'stockNums',width:"100", "type": "text",isSum:true},
                {name:"管理单位",code:'unitName',width:"100", "type": "text"},
            ],
            srcTenantMateriaHead:[
                {name:"物料编码",code:'materialNum',width:"200", "type": "text"},
                {name:"在库数量",code:'stockNums',width:"100", "type": "text",isSum:true},
                {name:"计划出库数量",code:'planNums',width:"100", "type": "planNums"},
                {name:"库位",code:'storageCode',width:"120", "type": "text"},
                {name:"生产日期",code:'produceDate',width:"100", "type": "text"},
                {name:"批次号",code:'batchNum',width:"100", "type": "text"},
                {name:"供应商批次号",code:'supplierBatchNum',width:"100", "type": "text"},
                {name:"到货厂商",code:'fromTenantName',width:"100", "type": "text"},
                {name:"ASN",code:'asn',width:"100", "type": "text"},
                {name:"物料描述",code:'materialDesc',width:"200", "type": "text"},
                {name:"规格",code:'specsName',width:"100", "type": "text"},
                {name:"管理单位",code:'unitName',width:"100", "type": "text"},
            ],
            custParam:{},
            custCodeHead:[
                {name:"父标签ID",code:'parentCodeNum',width:"120", "type": "text"},
                {name:"码类型",code:'relCustQrcodeTypeName',width:"80", "type": "text"},
                {name:"客户码",code:'codeNum',width:"120", "type": "text"},
            ],
            custQrcodeDialog:false,
            currentItem:{},
            currentIndex:0,

            loadParam:{
                srcTenantId:'',
                fromTenantName:'',
                materialNum:'',
                materialDesc:'',
                custQrcodeNum:'',
                srcTenantName:'',
                batchNum:'',
                supplierBatchNum:'',
                asn:'',
                storageCode:'',
                outOrderId:this.$route.query.outOrderId,
            },
            textareaFocus:false,
            isShowDialog:false,
            workDetailId:'',
            showImportMaterial:false,
            disabledSelCustQrcode:false,
            modifyRemark:this.$route.query.modifyRemark==1,

            currentSelItem:{},
            splitItem:{},
            splitDialog:false,
            qrcodeList:[],

            noOnly:false,

            srcTenantMaterials:[],  //货主关联物料数据
            srcTenantMaterial:{
                materialList:[]
            },
            srcTenantMaterialDialog:false,

            limitInfo:{},
            timeLimitFlag:false,
            showTimeoutReason:false,
            timeoutReasonData:[],

            custOrderNumPrefix:[
                {tip:'B0T',value:'2370-B0T'},
                {tip:'D0T',value:'2370-D0T'},
                {tip:'D0W',value:'2370-D0W'},
            ],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initLoad();
    },
    /**
     * 组件
     */
    components: {
        scrollTable,
        dbTable,
        myElDatePicker
    },
    /**
     * 绑定函数
     */
    methods: {
        async initLoad()
        {
            this.limitInfo = await this.common.postUrl("wmsTimeLimitTF", "getWmsTimeLimitInfo", {});
            if(this.limitInfo&&this.limitInfo.limit99){
                this.timeLimitFlag = true;
            }

            this.orderTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_OUT_ORDER_TYPE"});
            //加载超时原因下拉数据
            this.timeoutReasonData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TIMEOUT_REASON1"});
            await this.initWork();
            //加载货主到货厂商下拉数据
            await this.loadSrcTenantData(null);
            await this.loadFromTenantData(null);
            await this.loadFromTenantData2(null);
            //新增
            if (this.common.isNotBlank(this.$route.query.outOrderId))
            {
                //查询更新数据回显
                let data = await this.common.postUrl("wmsOutOrderTF", "queryWmsOutOrderInfoForUpdate", {outOrderId: this.$route.query.outOrderId});
                this.info = data.info;
                this.info.outOrderId = this.$route.query.outOrderId;
                this.info.fromWorkId = data.info.fromWorkId + '';
                this.info.orderType = data.info.orderType + '';
                data.materialList.forEach(item => {
                    item.custQrcodeNum = 0;
                    if(item.custQrcodeList){
                        item.custQrcodeList.forEach(el => {
                            if(el.selState == 1) item.custQrcodeNum++;
                        })
                    }
                });
                this.$refs.table.initData(data.materialList)
                this.packMaterialData = data.packMaterialList;
                await this.initFromWork();
                if (this.packMaterialData.length > 0)
                    await this.initPackSelectData();
                this.calShowTimeoutReason();
                this.$forceUpdate();
            }
            this.materialData = await this.common.postUrl("wmsMaterialPickTF", "queryStockStorageList", this.loadParam);

            let userInfo = this.common.userInfo();
            if(userInfo.useSapStockNums==1){
                for (let i = 0; i < this.head.length; i++) {
                    if(this.head[i].code=='stockNums'){
                        this.head.splice(i+2, 0, {"name": "sap登记库存数量", "code": "sapStockNums", "width": "110", "type": "text"});
                        break;
                    }
                }
                for (let i = 0; i < this.stockHead.length; i++) {
                    if(this.stockHead[i].code=='stockNums'){
                        this.stockHead.splice(i+2, 0, {"name": "sap登记库存数量", "code": "sapStockNums", "width": "110", "type": "text"});
                        break;
                    }
                }
            }else{
                this.head = this.head.filter(item => item.code !=='sapStockNums');
                this.stockHead = this.stockHead.filter(item => item.code !=='sapStockNums');
            }
            this.changeOrderType();
            let that = this;
            this.$nextTick(() => {
                that.$refs.table.initHead();
                // that.$refs.selStockTable.initHead();
            });
        },
        initLoadParam(){
            this.loadParam={
                srcTenantId:'',
                fromTenantName:'',
                materialNum:'',
                materialDesc:'',
                batchNum:'',
                supplierBatchNum:'',
                asn:'',
            };
            return {

            };
        },
        changeOrderType(){
            if(this.info.orderType=='1'){
                this.showTenant=true;

                this.head = this.head.filter(item => item.code !=='srcTenantName');
                this.stockHead = this.stockHead.filter(item => item.code !=='srcTenantName');
            }else{
                this.info.srcTenantId='';
                this.showTenant=false;

                for (let i = 0; i < this.head.length; i++) {
                    if(this.head[i].code=='supplierBatchNum'){
                        this.head.splice(i+1, 0, {"name": "货主", "code": "srcTenantName", "width": "110", "type": "text"});
                        break;
                    }
                }
                for (let i = 0; i < this.stockHead.length; i++) {
                    if(this.stockHead[i].code=='supplierBatchNum'){
                        this.stockHead.splice(i+1, 0, {"name": "货主", "code": "srcTenantName", "width": "110", "type": "text"});
                        break;
                    }
                }
            }
            this.$forceUpdate();
        },
        // 货主对应的物料选择
        async toChooseMaterials(){
            this.srcTenantMaterial = {materialList:[]}
            let srcTenantName = this.srcTenantData.filter(item => item.wId == this.info.srcTenantId)[0].name;
            let params = {srcTenantName,rows:999,page:1}
            let result = await this.common.postUrl("wmsMaterialPickTF", "queryMaterialPage", params,null,null,null, true);
            this.srcTenantMaterials = result.items;
            this.srcTenantMaterialDialog = true;
            this.srcTenantMaterial.materialList = await this.common.postUrl("wmsMaterialPickTF", "queryStockStorageList", {srcTenantId: this.info.srcTenantId,materialNum: this.srcTenantMaterial.materialNum},null,null,null, true);
        },
        // 选择物料
        async filterMaterial(){
            this.srcTenantMaterial.materialList = await this.common.postUrl("wmsMaterialPickTF", "queryStockStorageList", {srcTenantId: this.info.srcTenantId,materialNum: this.srcTenantMaterial.materialNum},null,null,null, true);
            this.srcTenantMaterial.nums = "";
        },
        // 自动拆分
        autoSplit(){
            let nums = this.srcTenantMaterial.nums; //拆分数量
            for (let i = 0; i < this.srcTenantMaterial.materialList.length; i++) { 
                let item = this.srcTenantMaterial.materialList[i];
                if(item.stockNums>=nums){
                    item.planNums = nums;
                    nums = 0;
                    item.isSelect = true;
                    break;
                }else{
                    nums = nums - item.stockNums;
                    item.planNums = item.stockNums;
                    item.isSelect = true;
                }
            }
            this.$forceUpdate();
        },
        // 全选
        selectAllSrcTenantMaterialCheck(){
            if(this.srcTenantMaterial.selectAll){
                this.srcTenantMaterial.materialList.forEach(item => item.isSelect = true);
            }else{
                this.srcTenantMaterial.materialList.forEach(item => item.isSelect = false);
            }
            this.srcTenantMaterial.nums = "";
            this.$forceUpdate();
        },
        // 单选
        changeSrcTenantMaterialCheck(){
            this.srcTenantMaterial.nums = "";
            this.$forceUpdate();
        },
        srcTenantMaterialInput(item){
            if(this.common.isNotBlank(item.planNums) && !item.isSelect) item.isSelect = true;
            this.$forceUpdate();
        },
        // 物料确认
        srcTenantMaterialConfirm(tag){
            if(tag){
                let data = [];
                this.srcTenantMaterial.materialList.forEach(item => {
                    if(item.isSelect){
                        // 客户码默认全选
                        if(item.custQrcodeList){
                            item.custQrcodeNum = item.custQrcodeList.length;
                            item.custQrcodeList.forEach(el => {
                                el.selState = 1;
                            })
                        }else{
                            item.custQrcodeNum = "";
                        }
                        // 计算箱托
                        this.calNums(item);
                        data.push(item);
                    }
                });
                if(data.length == 0){
                    this.$message.error("请选择物料！");
                    return;
                }
                this.saveChangeBase(data,'add');
            }else{
                this.srcTenantMaterialDialog = false;
            }
        },
        /**
         * 操作
         */
        async operation(){
            this.loadParam = { count:100 };
            this.loadParam.srcTenantId = this.info.srcTenantId;
            if(!this.loadParam.srcTenantId&&this.info.orderType=='1'){
                this.$message.error("请选择所属货主！");
                return;
            }
            this.isShowDialog = true;
            this.$nextTick(async ()=>{
                let rightData = this.$refs.table.getData()
                this.$refs.selStockTable.setRightData(this.common.copyObj(rightData));
                // this.$refs.selStockTable.setRightData([]);
                
                let _this = this;
                this.$refs.selStockTable.load("wmsMaterialPickTF", "queryStockStorageSelPage", _this.loadParam,function(res){
                    let data = res.items;
                    data.forEach(item => {                    
                        if(item.custQrcodeList){
                            item.custQrcodeNum = item.custQrcodeList.length;
                            item.custQrcodeList.forEach(el => {
                                el.selState = 1;    //默认选中状态
                            })
                        }else{
                            item.custQrcodeNum = "";
                        }
                    })
                    _this.stockTableDataChange(null,rightData);
                });
            })
        },

        async saveChange() {
            let rightData = this.$refs.selStockTable.getRightData();            
            let newScanQrcode = rightData[0].newScanQrcode;
            let codeDiff = false;
            rightData.forEach(item => {
                if(item.newScanQrcode != newScanQrcode) codeDiff = true
            })
            if(codeDiff){
                this.$message({
                    message: '不能同时选择旧数据和新扫码数据。',
                    type: 'warning'
                });
                return
            }
            if(rightData.custQrcodeList && rightData.custQrcodeList.length>0){

            }else{
                this.saveChangeBase(rightData);
            }
        },
        // 选择后数据过滤
        stockTableDataChange(leftData,rightData,isSelectAll,type,item){
            // if(rightData.length>0){
            //     let newScanQrcode = rightData[0].newScanQrcode;
            //     // 不能同时选择新版和旧版扫码库存
            //     let data = [];
            //     let leftData = this.$refs.selStockTable.getLeftData();
            //     leftData.forEach(item => {
            //         if(item.newScanQrcode == newScanQrcode){
            //             data.custQrcodeNum = "";
            //             data.push(item);
            //         }
            //     })
            //     this.$refs.selStockTable.setLeftData(this.common.copyObj(data));
            // }
            if(type == 2){                
                if(item.custQrcodeList){
                    item.custQrcodeNum = item.custQrcodeList.length;
                    item.custQrcodeList.forEach(el => {
                        el.selState = 1;
                    })
                }else{
                    item.custQrcodeNum = "";
                }
            }
        },

        // type=='add'时是新增
        async saveChangeBase(data,type) {
            let param = {};
            param.srcTenantId = this.info.srcTenantId;
            let leftData = await this.common.postUrl("wmsMaterialPickTF", "queryStockStorageList", param);
            let rightData = data;
            const leftMap = new Map();
            const rightMap = new Map();
            const allSelMap = new Map();
            rightData.forEach(el => {
                allSelMap.set(el.dId,1);
            })

            if (this.common.isBlank(leftData) || leftData.length == 0) {
                rightData.totalNum=rightData.length;
                this.$refs.table.initData(rightData)
                this.isShowDialog = false;
                return;
            }

            //找出来未选择的最早物料
            leftData.forEach(el => {
                if(!this.common.isBlank(el.produceDate)){
                    let date = new Date(el.produceDate).getTime();
                    if(!allSelMap.has(el.dId)){
                        if(leftMap.has(el.materialNum)){
                            let leftMinDate = leftMap.get(el.materialNum);
                            if (date < leftMinDate){
                                leftMap.set(el.materialNum,date);
                            }
                        }else{
                            leftMap.set(el.materialNum,date);
                        }
                    }
                }
            });

            let that = this;
            //找出来已选择的最晚物料
            rightData.forEach(el => {
                if(!this.common.isBlank(el.produceDate)) {
                    let date = new Date(el.produceDate).getTime();
                    if(rightMap.has(el.materialNum)){
                        let rightMaxDate = rightMap.get(el.materialNum);
                        if (date > rightMaxDate){
                            rightMap.set(el.materialNum,date);
                        }
                    }else{
                        rightMap.set(el.materialNum,date);
                    }
                }
                if(el.isAllInAllOut&&!el.planNums) {
                    el.planNums = el.stockNums;
                    that.calNums(el);
                }
            });

            let flag = false;
            let str = "";
            rightMap.forEach (function(value, key) {
                if(leftMap.has(key)){
                    if(value>leftMap.get(key)){
                        str += ","+key;
                        flag = true;
                    }
                }
            })
            let workId = this.common.userInfo().workId;
            if(flag && workId!=4045){   //青龙仓跳过判断
                //增加
                this.$prompt("物料"+str.substr(1)+"未选择最早生产日期的物料", "提示",{
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true,
                    showInput: true,
                    closeOnClickModal: false,
                    distinguishCancelAndClose: true,
                    inputPlaceholder: '原因',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '请填写原因'
                }).then(async ({value}) =>{
                    if(this.common.isNotBlank(value)){
                        this.info.remark = value;
                        rightData.forEach(el => {
                            el.workDetailId = that.workDetailId;
                        })
                        rightData.totalNum=rightData.length;
                        if(type=='add'){
                            this.toAddMaterialNum(rightData)
                        }else{
                            this.$refs.table.initData(rightData)
                            this.isShowDialog = false;
                        }
                    }
                }).catch(async action =>{

                });
            }else{
                rightData.forEach(el => {
                    el.workDetailId = that.workDetailId;
                })
                rightData.totalNum=rightData.length;
                if(type=='add'){
                    this.toAddMaterialNum(rightData)
                }else{
                    this.$refs.table.initData(rightData)
                    this.isShowDialog = false;
                }
            }
        },
        // 新增物料
        toAddMaterialNum(data){
            let tableData = this.$refs.table.getData();
            let sameData = [];  //同批次物料数据
            let addData = [];   //新增数据
            let sameTip = '';
            const aKeySet = new Set(tableData.map(item => `${item.materialNum}-${item.batchNum}`));
            
            data.forEach(item => {
                const currentKey = `${item.materialNum}-${item.batchNum}`;
                if (aKeySet.has(currentKey)) {
                    sameData.push(item);
                    sameTip += `${item.batchNum}批次${item.materialNum}物料、`
                } else {
                    addData.push(item);
                }
            });
            sameTip = sameTip.slice(0, -1);;    //删除最后的顿号
            if(sameData.length>0){
                let _this = this;
                // this.$message.error("已有相同批次号的物料，请勿重复添加。");
                this.$confirm(sameTip+'已存在，是否进行数据覆盖？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sameData.forEach(el => {
                        tableData.forEach((item,index) => {
                            if(el.materialNum == item.materialNum && el.batchNum == item.batchNum){
                                tableData[index] = _this.common.copyObj(el);
                            }
                        })
                        tableData = [...tableData,...addData];
                        this.$refs.table.initData(tableData);
                        this.srcTenantMaterialDialog = false;
                    })
                }).catch(() => {});
            }else{
                tableData = [...tableData,...data];
                this.$refs.table.initData(tableData);
                this.srcTenantMaterialDialog = false;
            }

        },
        async doQuery() {
            let data = await this.common.postUrl("wmsMaterialPickTF", "queryStockStorageList", this.loadParam);            
            data.forEach(item => {
                if(item.custQrcodeList){
                    item.custQrcodeNum = item.custQrcodeList.length;
                    item.custQrcodeList.forEach(el => {
                        el.selState = 1;    //默认选中状态
                    })
                }else{
                    item.custQrcodeNum = "";
                }
            })
            this.$refs.selStockTable.setLeftData(data);
            let rightData = this.$refs.selStockTable.getRightData();
            this.stockTableDataChange(null,rightData);
            this.$refs.selStockTable.changeTop(0);
        },
        clear(){
            let srcTenantId = this.loadParam.srcTenantId;
            this.loadParam = {
                srcTenantId: srcTenantId,
            };
            this.noOnly=false;
        },
        /**
         * 加载包材下拉数据
         * 新增的时候添加包材才查询
         */
        async initPackSelectData()
        {
            // this.packMateriaOptions = await this.common.postUrl("wmsPackMaterialTF", "queryPackMaterialBaseList", {});
            this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {});
        },
        /**
         * 加载货主
         * @param id
         * @returns {Promise<void>}
         */
        async loadSrcTenantData(id)
        {
            this.srcTenantData = await this.common.postUrl("wmsTenantTF", "queryConsignorTenantList", {id});
        },
        /**
         * 加载到货厂商
         * @param parentId
         * @returns {Promise<void>}
         */
        async loadFromTenantData(parentId)
        {
            this.fromTenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {isLoadETE: 1,parentId: parentId});
        },
        /**
         * 加载器具的到货厂商
         * @param parentId
         * @returns {Promise<void>}
         */
        async loadFromTenantData2(parentId)
        {
            this.fromTenantData2 = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {
                isLoadETE: 1,
                parentId: parentId
            });
        },
        /**
         * 初始化送货地址
         * 加载作业点
         * @returns {Promise<void>}
         */
        async initWork()
        {
            this.workData = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {isWmsWork:1});
        },
        /**
         * 是否包含指定属性的数据
         * @param id
         * @returns {boolean}
         */
        isContainsElement(data, id)
        {
            let result = false;
            data.forEach(item =>
            {
                if (item.wId == id)
                    result = true;
            })
            return result;
        },
        /**
         * 改变货主
         */
        async chnageSrcTenant()
        {
            this.info.fromWorkId = null;
            this.workDetailData = [];
            this.materialData.forEach(item =>
            {
                item.workDetailId = null;
            })
            //选择了货主加载归属货主的到货厂商
            await this.loadFromTenantData(this.info.srcTenantId);
            await this.loadFromTenantData2(this.info.srcTenantId);
            //检查是否存在不归属这个货主的到货厂商
            this.materialData.forEach(item =>
            {
                if (!this.isContainsElement(this.fromTenantData, item.fromTenantId))
                {
                    item.fromTenantId = null;//到货厂商不是归属货主的清空
                }
            })
            //检查是否存在不归属这个货主的到货厂商(包材的)
            this.packMaterialData.forEach(item =>
            {
                if (!this.isContainsElement(this.fromTenantData2, item.srcTenantId))
                {
                    item.srcTenantId = null;//到货厂商不是归属货主的清空
                }
            })
            //只有一个到货厂商默认选择
            if (this.fromTenantData.length === 1)
            {
                this.materialData.forEach(item =>
                {
                    item.fromTenantId = this.fromTenantData[0].wId;
                })
            }
            //只有一个到货厂商默认选择(包材的)
            if (this.fromTenantData2.length === 1)
            {
                this.packMaterialData.forEach(item =>
                {
                    item.srcTenantId = this.fromTenantData2[0].wId;
                })
            }
            await this.changeFromWork();
            if (this.packMaterialData.length > 0){
                for (let i = 0; i < this.packMaterialData.length; i++) {
                    this.packMaterialData[i].srcTenantId=''
                    this.packMaterialData[i].useTenantId=''
                }
                await this.initPackSelectData();
            }
            this.$refs.table.initData([])
            if(this.common.isNotBlank(this.$refs.selStockTable)){
                this.$refs.selStockTable.setRightData([]);
            }

            let that = this;
            this.srcTenantData.forEach(item => {
                if(item.wId===that.info.srcTenantId){
                    this.info.scanCustQrcode = item.scanCustQrcode;
                }
            })

            this.$forceUpdate();
        },
        /**
         * 箱数/托数 改变
         * @param index
         */
        calcNums(item, code)
        {
            if (code === 'planBoxNums')//箱数
            {
                if (item.planBoxNums && item.perBoxNums)
                {
                    let tmp = this.common.accMul(item.planBoxNums, item.perBoxNums);
                    item.planNums = Math.round(tmp);
                    if (item.perPalletNums)
                    {
                        let tmp = this.common.accDiv(item.planNums, item.perPalletNums);
                        item.planPalletNums = Math.ceil(tmp);
                    }
                }
            } else if (code === 'planPalletNums')//托数
            {
                if (item.planPalletNums &&item.perPalletNums)
                {
                    let tmp = this.common.accMul(item.planPalletNums, item.perPalletNums);
                    item.planNums = Math.round(tmp);
                    if (item.perBoxNums)
                    {
                        let tmp = this.common.accDiv(item.planNums, item.perBoxNums);
                        item.planBoxNums = Math.ceil(tmp);
                    }
                }
            }
            this.$refs.table.calcFootSum();
            this.$forceUpdate();
        },
        calNums(item)
        {
            if (item.planNums)
            {
                if (item.perBoxNums)
                {
                    let tmp = this.common.accDiv(item.planNums, item.perBoxNums);
                    item.planBoxNums = Math.ceil(tmp);
                }
                if (item.perPalletNums)
                {
                    let tmp = this.common.accDiv(item.planNums, item.perPalletNums);
                    item.planPalletNums = Math.ceil(tmp);
                }
            }
            this.$refs.table.calcFootSum();
            this.$forceUpdate();
        },
        async splitQrcode(item) {
            if (item.planNums&&item.newScanQrcode&&!item.perPalletNums){
            // if (item.planNums && item.newScanQrcode) {
                if (item.planNums < item.stockNums) {
                    if (!item.splitQrcodeList) {
                        item.splitQrcodeList = [{}];
                    }
                    this.qrcodeList = await this.common.postUrl("wmsStockMaterialTF", "getStockMaterialNewQrcodeList", {id: item.dId,outOrderId:this.$route.query.outOrderId});
                    this.splitDialog = true;
                    this.currentSelItem = item;
                    this.splitItem = this.common.copyObj(item);
                }
            }
            this.$forceUpdate();
        },
        addItem(){
            this.splitItem.splitQrcodeList.push({});
            this.$forceUpdate();
        },
        removeItem(index){
            this.splitItem.splitQrcodeList.splice(index,1);
            this.$forceUpdate();
        },
        confirm(flag){
            if(!flag){
                this.splitItem.splitQrcodeList = [];
            }else{
                let ids = new Set();
                let mantissa = 0;
                for (let i = 0; i < this.splitItem.splitQrcodeList.length; i++) {
                    let el = this.splitItem.splitQrcodeList[i];
                    if(ids.has(el.id)){
                        this.$message.error("请勿针对"+el.codeNum+"重复拆单");
                        return false;
                    }
                    mantissa = this.common.accAdd(mantissa,el.mantissa);
                    ids.add(el.id);
                }
                if(mantissa>this.splitItem.planNums){
                    this.$message.error("拆分出库数量不能大于计划出库数量");
                    return false;
                }
                this.currentSelItem.splitQrcodeList = this.splitItem.splitQrcodeList;
            }
            this.splitDialog = false;
        },
        changeQrcode(item){
            this.qrcodeList.forEach(el=>{
                if(item.id==el.id){
                    item.nums = el.nums;
                    item.codeNum = el.codeNum;
                }
            })
            this.$forceUpdate();
        },
        check(item){
            if(item.mantissa>=item.nums){
                this.$message.error("拆分出库数量不能大于等于标签数量");
            }
            this.$forceUpdate();
        },
        /** 切换是否退货 */
        changeInfoSwitch(val)
        {
            this.info[val] = this.info[val] == 1?0:1;
            // this.info.rejectedState = this.info.rejectedState == 1 ? 0 : 1;
            if(this.info.rejectedState==1&&this.info.selfPickup==1){
                this.timeLimitFlag=false;
            }
            this.$forceUpdate();
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        async initFromWork()
        {
            let materialData = this.$refs.table.getData();
            materialData.forEach(item =>
            {
                item.workId = null;
            })
            if (this.common.isBlank(this.info.fromWorkId)){
                this.workDetailData = [];
            } else{
                this.workDetailData = await this.common.postUrl("workDetailService", "queryWorkDetailListByWorkId", {workId: this.info.fromWorkId});
            }
            if (this.workDetailData.length === 1){
                materialData.forEach(item =>{
                    item.workDetailId = this.workDetailData[0].id;
                });
                this.workDetailId = this.workDetailData[0].id;
            }
            this.$forceUpdate();
        },

        async changeFromWork()
        {
            let materialData = this.$refs.table.getData();
            materialData.forEach(item =>{
                item.workDetailId = '';
            });
            this.workDetailId = '';
            this.initFromWork();
        },
        /** 保存出库单 */
        async saveOutOrder()
        {
            let userInfo = this.common.userInfo();
            if (this.common.isBlank(this.info.srcTenantId)&&this.info.orderType=='1')
            {
                this.$message.error("请选择所属货主！");
                return;
            }
            if (this.common.isBlank(this.info.rejectedState))
            {
                this.$message.error("请选择是否退货！");
                return;
            }
            if (this.common.isBlank(this.info.selfPickup))
            {
                this.$message.error("请选择是否自提！");
                return;
            }
            if(this.timeLimitFlag){
                if(this.common.isBlank(this.info.custOrderNum)){
                    this.$message.error("请输入客户单号！");
                    return;
                }
                if(this.common.isBlank(this.info.requireDoneTime)){
                    this.$message.error("请输入要求送达时间！");
                    return;
                }
            }
            if(this.calShowTimeoutReason()){
                if(this.common.isBlank(this.info.timeoutReason)){
                    this.$message.error("请输入超时原因！");
                    return;
                }
            }
            if (this.common.isBlank(this.info.fromWorkId))
            {
                this.$message.error("请选择送货地址！");
                return;
            }
            let selectData = this.$refs.table.getData();
            if (selectData.length <=0) {
                this.$message.error("请至少选择一条库存信息！");
                return;
            }
            //判断是否有新版条码和无条码数据混搭
            let oldCode = false;
            let newCode = false;
            this.materialData=[];
            for (let i = 0; i < selectData.length; i++) {
                let item = selectData[i];
                if(item.newScanQrcode == 0)  oldCode = true;
                if(item.newScanQrcode == 1)  newCode = true;
                if(!item.planNums){
                    this.$message.error("请输入第" + (i + 1) + "行库存的计划出库数量！");
                    return;
                }
                if(item.planNums < 0){
                    this.$message.error("第" + (i + 1) + "行库存的计划出库数量必须大于0！");
                    return;
                }
                if(item.planBoxNums < 0){
                    this.$message.error("第" + (i + 1) + "行库存的计划出库箱数必须大于0！");
                    return;
                }
                if(item.planPalletNums < 0){
                    this.$message.error("第" + (i + 1) + "行库存的计划出库托数必须大于0！");
                    return;
                }
                if(!item.workDetailId && this.info.rejectedState == 0){
                    this.$message.error("请选择第" + (i + 1) + "行库存的卸货地！");
                    return;
                }
                if(userInfo.useSapStockNums==1) {
                    if(item.planNums>item.sapStockNums){
                        this.$message.error("第" + (i + 1) + "行计划出库数量大于SAP库存数量！");
                        return;
                    }
                }else{
                    if(item.planNums>item.stockNums){
                        this.$message.error("第" + (i + 1) + "行计划出库数量大于库存数量！");
                        return;
                    }
                }
                this.materialData.push(item);
            }
            if(oldCode && newCode){
                this.$message.error("新版条码与无条码的物料不可同时存在同一个出库单中！");
                return;
            }

            if (this.packMaterialData.length > 0)
            {
                for (let i = 0; i < this.packMaterialData.length; i++)
                {
                    if (this.common.isBlank(this.packMaterialData[i].devDeviceId))
                    {
                        this.$message.error("请选择第" + (i + 1) + "行可回收器具！");
                        return;
                    }
                    if (this.common.isBlank(this.packMaterialData[i].srcTenantId))
                    {
                        this.$message.error("请选择第" + (i + 1) + "行器具的所属人！");
                        return;
                    }
                    if (this.common.isBlank(this.packMaterialData[i].useTenantId))
                    {
                        this.$message.error("请选择第" + (i + 1) + "行器具的到货厂商！");
                        return;
                    }
                    if (this.common.isBlank(this.packMaterialData[i].nums))
                    {
                        this.$message.error("请输入第" + (i + 1) + "行器具的出库数量！");
                        return;
                    }
                }
            }
            this.info.materialList = this.materialData;
            this.info.packMaterialList = this.packMaterialData;

            let mes = this.common.isBlank(this.info.outOrderId) ? "新增出库单成功！" : "修改出库单成功！";
            let info = await this.common.postUrl("wmsOutOrderTF", "addOrUpdateOutOrder", this.info,null,null,'',true);
            this.$message.success(mes);
            this.closePage(false);
            this.$nextTick(() => {
                if(!this.modifyRemark){
                    //跳转打印界面
                    this.$emit("openTab",{
                        urlId: "printOutOrder"+info.id,
                        query: {outOrderId:info.id},
                        urlName: '打印出库单',
                        urlPathName: "/printOutOrder",
                        urlPath: '/pt/wms/ord/printOutOrder.vue'});
                }
            })
        },
        /** 添加包材 */
        async addPackMaterial()
        {
            if (this.packMaterialData.length === 0)
                await this.initPackSelectData();

            let data = {};//只有一个到货厂商自动选择
            if (this.fromTenantData.length === 1)
                data.srcTenantId = this.fromTenantData2[0].wId;
            this.packMaterialData.push(data);
        },
        /** 删除包材 */
        removePackMaterial(index)
        {
            if (this.packMaterialData.length >= 1)
            {
                this.packMaterialData.splice(index, 1);
            }
        },
        // 未定义转空字符串
        changeEmpty(data){
            if(this.common.isBlank(data)){
                return '';
            }else{
                return data;
            }
        },
        // 导入物料
        handleChange(file){
            if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
                // 文件格式的判断
                this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
                return false;
            }
            const fileReader = new FileReader();
            let _this = this;
            fileReader.onload = (ev) => {
                // try {
                    const data = ev.target.result;
                    const workbook = XLSX.read(data, {
                        type: "binary",
                    });
                    // 取第一张表
                    const wsname = workbook.SheetNames[0];
                    // 生成json表格内容
                    const tableData = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
                    let excelData = [];     //保存符合条件的数据
                    let tipText = "";
                    let isHaveSome = false;
                    tableData.forEach((item,index) => {
                        let materialData = {};
                        materialData.batchNum = _this.changeEmpty(item["批次号"]);
                        materialData.supplierBatchNum = _this.changeEmpty(item["供应商批次号"]);
                        materialData.fromTenantName = _this.changeEmpty(item["到货厂商"]);
                        materialData.asn = _this.changeEmpty(item["ASN"]);
                        materialData.materialNum = _this.changeEmpty(item["物料编码"]);
                        materialData.storageCode = _this.changeEmpty(item["库位"]);
                        let produceDate = item["生产日期"];
                        if(_this.common.isNotBlank(produceDate)){
                            if(isNaN(Number(produceDate))){
                                materialData.produceDate = _this.common.formatDate.getDate(new Date(produceDate));
                            }else{
                                let date = this.common.getFormatDate_XLSX(produceDate);
                                materialData.produceDate = _this.common.formatDate.getDate(date);
                            }
                        }
                        if(this.common.isBlank(materialData.batchNum)){
                            tipText = tipText + "第" + (index + 1) + "条数据的批次号不能为空！\n";
                            return;
                        }
                        if(this.common.isBlank(materialData.fromTenantName)){
                            tipText = tipText + "第" + (index + 1) + "条数据的到货厂商不能为空！\n";
                            return;
                        }
                        if(this.common.isBlank(materialData.materialNum)){
                            tipText = tipText + "第" + (index + 1) + "条数据的物料编码不能为空！\n";
                            return;
                        }
                        if(this.common.isBlank(produceDate)){
                            tipText = tipText + "第" + (index + 1) + "条数据的生产日期不能为空！\n";
                            return;
                        }
                        if(this.common.isBlank(materialData.storageCode)){
                            tipText = tipText + "第" + (index + 1) + "条数据的库位不能为空！\n";
                            return;
                        }
                        let isHave = false; //标记，这条数据在数据库中是否存在

                        this.materialData.forEach(el => {
                            if(
                                el.batchNum == materialData.batchNum &&
                                el.supplierBatchNum == materialData.supplierBatchNum &&
                                el.fromTenantName == materialData.fromTenantName &&
                                el.asn == materialData.asn &&
                                el.materialNum == materialData.materialNum &&
                                el.produceDate == materialData.produceDate &&
                                el.storageCode == materialData.storageCode
                            ){
                                let obj = this.common.copyObj(el);
                                isHave = true;
                                obj.planNums = item["计划出库数量"];
                                obj.planBoxNums = item["计划出库箱数"];
                                obj.planPalletNums = item["计划出库托数"];
                                if(this.common.isBlank(obj.planNums)){
                                    tipText = tipText + "第" + (index + 1) + "条数据计划出库数量不能为空。\n";
                                }
                                // 查询是否有相同物料，青龙仓可以重复
                                if(excelData.some(item => item.dId === obj.dId) && this.common.userInfo().workId != 4045){
                                    isHaveSome = true;
                                    this.$message.error("第" + (index + 1) + "条数据物料重复，清合并。\n");
                                    return
                                }
                                if(this.common.isNotBlank(obj.planNums) && this.common.isBlank(obj.planPalletNums) && this.common.isBlank(obj.planBoxNums)){
                                    _this.calNums(obj);
                                }
                                // if(el.planNums){
                                //     _this.calNums(el);
                                // } else if(el.planBoxNums && el.planPalletNums && this.common.isBlank(el.planNums)){
                                //     tipText = tipText + "第" + (index + 1) + "条数据出库数量为空时，箱数和托数只能选填其中一个。\n";
                                // }else if(el.planBoxNums){
                                //     _this.calcNums(el,'planBoxNums');                                    
                                // }else if(el.planPalletNums){
                                //     _this.calcNums(el,'planPalletNums');
                                // }
                                obj.codeNum = item["时代条码"];
                                excelData.push(obj);
                            }
                        })

                        if(!isHave){
                            tipText = tipText + "第" + (index + 1) + "条数据不存在！\n";
                        }
                    })
                    // _this.$refs.table.initData(excelData)
                    this.saveChangeBase(excelData);
                    if(tipText) this.$message.error(tipText);
                    _this.$forceUpdate();
                // } catch (e) {
                //     return false;
                // }
            };
            fileReader.readAsBinaryString(file.raw);
            this.showImportMaterial = false;
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        // textarea焦点处理
        setTextareaFocus(){
            this.textareaFocus = this.textareaFocus?false:true;
        },
        textareaKeyup(event){
            event.stopPropagation();
            if(!event.shiftKey && event.keyCode==13){
                this.doQuery();
            }
        },
        changeWorkDetail(){
            let obj = this.common.copyObj(this.$refs.table.getData());
            for (let i = 0; i < obj.length; i++) {
                obj[i].workDetailId = this.workDetailId;
            }
            this.$refs.table.setData(obj);
        },
        /**
         * 选择客户码
         * @param {Object} item - 客户信息对象
         * @param {number} type - 打开方式，1表示通过弹窗打开，2表示外部打开
         * @param {number} index - 客户信息对象在列表中的索引
         * @param {string} table - left:左表格，right:右表格
         */
        selCustQrcode(item,type,index,table){
            if(table=="left"){
                this.disabledSelCustQrcode = true;
            }else {
                this.disabledSelCustQrcode = false;
            }
            // 清除之前的客户二维码选择对话框状态
            this.custQrcodeDialogClear();
            // 设置当前的打开方式
            this.custQrcodeDialogType = type;
            // 打开客户码选择对话框
            this.custQrcodeDialog = true;
            // 保存当前操作的客户信息
            this.currentItem = item;
            this.currentIndex = index;
            // 初始化左侧(未选中)数据
            let leftData = [];
            // 初始化右侧(已选中)数据
            let rightData = [];

            // 遍历客户码列表，根据选中状态分别放入leftData和rightData
            item.custQrcodeList.forEach(el => {
                if(el.selState == 1){
                    rightData.push(this.common.copyObj(el));
                }else{
                    leftData.push(this.common.copyObj(el));
                }
            });

            // 在下次DOM更新循环之后执行，确保组件渲染后设置数据
            this.$nextTick(()=>{
                // 设置左侧表格数据
                this.$refs.custCodeTable.setLeftData(leftData);
                // 设置右侧表格数据
                this.$refs.custCodeTable.setRightData(rightData);
            })
        },
        /**
         * 客户码数据左右切换时的处理函数
         *
         * @param {Array} leftData - 左侧数据集合
         * @param {Array} rightData - 右侧数据集合
         *
         * 遍历左右数据集合并更新每个数据项的选中状态，然后将更新后的数据设置给组件，同时更新搜索数据
         */
        custCodeTableDataChange(leftData, rightData) {
            // 遍历左侧数据，设置每个数据项的选中状态为0（未选中）
            leftData.forEach(el => {
                el.selState = 0;
            })
            // 遍历右侧数据，设置每个数据项的选中状态为1（已选中）
            rightData.forEach(el => {
                el.selState = 1;
            })
            // 更新组件的左侧数据
            this.$refs.custCodeTable.setLeftData(leftData);
            // 更新组件的右侧数据
            this.$refs.custCodeTable.setRightData(rightData);
        },
        // 执行查询操作
        custQrcodeDialogDoQuery(){
            // 初始化一个空数组，用于存储查询结果
            let leftData = [];
            let rightIds = this.$refs.custCodeTable.getRightData().map(item  => item.id);
            let leftDataSearch = this.currentItem.custQrcodeList.filter(item => !rightIds.includes(item.id));
            // 遍历需要查询的数据集合
            leftDataSearch.forEach(item => {
                // 默认当前项匹配查询条件
                let match = true;
                // 遍历用户输入的查询参数
                Object.keys(this.custParam).forEach(key => {
                    // 如果查询参数不为空且数据项中不包含该参数值，则认为不匹配
                    if(this.common.isNotBlank(this.custParam[key]) && !item[key].includes(this.custParam[key])){
                        match = false;
                    }
                })
                // 如果数据项匹配查询条件，则将其添加到结果数组中
                if(match) leftData.push(item);
            });
            this.$refs.custCodeTable.setLeftData(leftData);
        },
        /**
         * 清空客户码对话框中的过滤条件
         */
        custQrcodeDialogClear(){
            this.custParam = {};
        },
        // 客户码保存更改
        saveCustCodeChange(){
            this.custQrcodeDialog = false;
            let rightData = this.$refs.custCodeTable.getRightData();
            if(this.custQrcodeDialogType == 1) var dataList = this.$refs.selStockTable.getRightData();
            if(this.custQrcodeDialogType == 2) var dataList = this.$refs.table.getData();
            let data = dataList[this.currentIndex];
            data.custQrcodeNum = 0;
            data.custQrcodeList.forEach(item => {
                item.selState = 0;
                rightData.forEach(el => {
                    if(item.id == el.id){
                        item.selState = 1;
                    }
                })
                if(item.selState == 1) data.custQrcodeNum++
            })

            if(this.custQrcodeDialogType == 1) this.$refs.selStockTable.setRightData(dataList);
            if(this.custQrcodeDialogType == 2) this.$refs.table.setData(dataList);
            this.$forceUpdate();
        },
        resetLeftTable(){
            this.$refs.selStockTable.resetLeftTable();
        },
        changeRequireDoneDate(){
            if(this.timeLimitFlag&&this.common.isNotBlank(this.info.requireDoneTime)){
                // 将requireDoneTime转换为Date对象
                let originalDate = new Date(this.info.requireDoneTime);
                // 添加指定的分钟数
                let minutes1 =  Number(this.limitInfo.limit1);
                let minutes99 =  Number(this.limitInfo.limit99);
                let newDate = new Date(originalDate.getTime() - minutes99 * 60 * 1000);
                // 将新日期赋值给deliverOrderTime
                this.info.deliverOrderTime = newDate;
                this.calShowTimeoutReason();
            }
            this.$forceUpdate();
        },
        calShowTimeoutReason(){
            if(this.$route.query.outOrderId){
                this.showTimeoutReason = this.common.isNotBlank(this.info.timeoutReason);
            }else{
                if(this.timeLimitFlag&&this.common.isNotBlank(this.info.requireDoneTime)) {
                    let minutes1 = Number(this.limitInfo.limit1);
                    let newDate = new Date(this.info.deliverOrderTime.getTime() + minutes1 * 60 * 1000);
                    this.showTimeoutReason = newDate < (new Date());
                }
            }
            return this.showTimeoutReason;
        },
        autocomplete(){
            this.custOrderNumPrefix.forEach(item => {
                if(item.tip == this.info.custOrderNum){
                    this.info.custOrderNum = item.value;
                    return;
                }
            })
            this.$forceUpdate();
        },
        querySearch(queryString, cb) {
            var restaurants = this.custOrderNumPrefix;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
    },
}
