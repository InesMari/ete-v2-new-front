import enumData from "@/page/pt/enum";
import XLSX from "xlsx"

export default {
    name: 'addOrUpdateInOrder',
    data() {
        return {
            info:{
                rejectedState:'1',//是否退货
                scanCustQrcode:0,
                srcWorkId: '',//来货地址
                rejectedType:'',
                appointId:null,
                plateNumber:'',
                linkman:null,
                linkPhone:null,
            },
            srcTenantData: [],//所属货主
            fromTenantData: [],//到货厂商
            fromTenantData2:[],
            workData:[],
            materialData:[],
            materiaOptions:[],
            packMaterialData:[],
            srcTenantOptions:[],
            rejectedStateData:[],
            rejectedTypeData:[],
            tenantData2: [],
            deviceData:[],//器具数据
            pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,
            showRed: false,

            waybillData:[],
            showImportMaterial:false,

            appointData:[],

            //新版扫码
            showInfo: true,//默认展示入库单信息
            showSave: true,//默认展示保存
            showNext: false,
            materialCodeList: [],
            showImportTag:false,
            materialCodeListFromServer: [],//后台加载的
        }
    },
    /**
     * 初始化
     */
    async mounted() {
        if (this.common.isBlank(this.$route.query.inOrderId)){
            this.initAllData();
        }
        this.initLoad();
        await this.initData();
        if(this.common.isNotBlank(this.$route.query.appointId)){
            this.info.appointId = Number.parseInt(this.$route.query.appointId);
            this.changeAppoint();
        }
    },
    /**
     * 组件
     */
    components: {},
    /**
     * 绑定函数
     */
    methods: {
        async initData(){
            //订单类型
            this.rejectedStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_IN_ORDER_TYPE"});
            this.rejectedTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REJECTED_TYPE"});
            this.appointData = await this.common.postUrl("wmsAppointTF", "queryWmsAppointInfoList", {opType:'1'});
        },
        async initLoad()
        {
            await this.initWork();
            await this.loadSrcTenantData(null);
            await this.loadFromTenantData(null);
            this.waybillData = await this.common.postUrl("wmsWaybillService", "queryWmsWaybillList", {});
            if (this.common.isBlank(this.$route.query.inOrderId))
            {
                this.materialData.push({});//新增一条数据支撑
            }
            else
            {
                //加载数据回显
                let data = await this.common.postUrl("wmsInOrderTF", "queryWmsInOrderInfoForUpdate", {inOrderId: this.$route.query.inOrderId});
                this.info = data.info;
                this.info.inOrderId = this.$route.query.inOrderId;//后台查询的是实体对象 只有id属性
                if (this.common.isNotBlank(this.info.srcWorkId))
                    this.info.srcWorkId = this.info.srcWorkId + '';
                this.info.rejectedState = this.info.rejectedState + '';
                if (this.common.isNotBlank(this.info.rejectedType))
                    this.info.rejectedType = this.info.rejectedType + '';
                await this.loadFromTenantData(this.info.srcTenantId);
                await this.initMateriaOptions();
                this.materialData = data.materialList;
                let relMap = new Map();
                let index = 0;
                for (let i = 0; i < this.materialData.length; i++) {
                    this.initItemMateriaOptionsNoClean(i);
                    this.changeMaterial(i,true);
                    relMap.set(this.materialData[i].id, i);
                    index = i;
                }
                if (data.materialCodeList)
                {
                    data.materialCodeList.forEach(item => {
                        let index2 = relMap.get(item.inOrderMaterialRelId);
                        if (index2 >= 0)
                        {
                            item.index = index2;
                        }
                        else
                        {
                            item.index = ++index;
                            relMap.set(item.inOrderMaterialRelId, index);
                        }
                    })
                }
                this.materialCodeListFromServer = this.common.copyObj(data.materialCodeList);
                this.materialCodeList = this.common.copyObj(data.materialCodeList);
                this.packMaterialData = data.packMaterialList;
                if (this.packMaterialData.length > 0)
                    await this.initPackSelectData();

                this.materialDataCache = this.common.copyObj(this.materialData);
                this.$forceUpdate();
            }
        },
        async initAllData(){
            await this.initWork();
            await this.loadSrcTenantData(null);
            await this.loadFromTenantData(this.info.srcTenantId);
            await this.initMateriaOptions();
            for (let i = 0; i < this.materialData.length; i++) {
                this.initItemMateriaOptionsNoClean(i);
            }
            if (this.packMaterialData.length > 0)
                await this.initPackSelectData();
            this.$forceUpdate();
        },
        /**
         * 加载器具下拉数据
         * 新增的时候添加器具才查询
         */
        async initPackSelectData() {
            //加载包材货主
            this.srcTenantOptions = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {isLoadETE: 1});
            //加载器具
            this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {});
        },
        /**
         * 加载货主
         * @param id 指定ID的货主
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
            this.fromTenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {parentId: parentId});
            this.fromTenantData2 = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {isLoadETE: 1,parentId: parentId});
        },
        /**
         * 初始化来货地址
         * @returns {Promise<void>}
         */
        async initWork(){
            //加载作业点  仓库的作业点和到货厂商的作业点
            this.workData = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {isWmsWork:1, isLoadSrcTenantWork: 1});
            this.$forceUpdate();
        },
        /**
         * 改变货主或者是到货厂商
         * @param type 1 货主 2 到货厂商
         */
        async changeSrcTenantOrFromTenant(type, flag)
        {
            this.materialData= [{}];
            if (type === 1 && !flag)
            {
                this.info.srcWorkId = '';
                let that = this;
                this.srcTenantData.forEach(item => {
                    if(item.wId===that.info.srcTenantId){
                        that.info.scanCustQrcode = item.scanCustQrcode;
                    }
                })
                //选择了货主加载归属货主的到货厂商
                await this.loadFromTenantData(this.info.srcTenantId);
            }
            await this.initMateriaOptions();
            for (let i = 0; i < this.materialData.length; i++) {
                if(type === 1 && !flag)
                {
                    if(this.fromTenantData.length>0){
                        this.materialData[i].fromTenantId = this.fromTenantData[0].wId;
                    }else{
                        this.materialData[i].fromTenantId = '';
                    }
                    //处理批次号
                    if(this.info.scanCustQrcode==1){
                        this.materialData[i].batchNum = this.common.formatDate.getDate2();
                    }
                }
                this.initItemMateriaOptions(i);
            }
            if (this.packMaterialData.length > 0 && type === 1 && !flag){
                for (let i = 0; i < this.packMaterialData.length; i++) {
                    this.packMaterialData[i].srcTenantId=''
                    this.packMaterialData[i].useTenantId=''

                    if(this.fromTenantData2.length>0){
                        this.packMaterialData[i].useTenantId = this.fromTenantData2[0].wId;
                    }else{
                        this.packMaterialData[i].useTenantId = '';
                    }
                }
            }
            await this.initPackSelectData();
            this.$forceUpdate();
        },
        /**
         * 初始化货主的物料下拉数据
         * @returns {Promise<void>}
         */
        async initMateriaOptions() {
            this.materiaOptions = [];
            if (this.info.srcTenantId)
                this.materiaOptions = await this.common.postUrl("wmsInOrderTF", "queryWmsMaterialInfoList");
            this.$forceUpdate();
        },
        initItemMateriaOptionsNoClean(index) {
            this.materialData[index].materiaOptions=[];
            for (let i = 0; i < this.materiaOptions.length; i++) {
                if(this.materialData[index].fromTenantId==this.materiaOptions[i].fromTenantId){
                    this.materialData[index].materiaOptions.push(this.materiaOptions[i]);
                }
            }
        },
        async changeFromTenant(index)
        {
            this.materialData[index].materialId='';
            this.materialData[index].materialDesc='';
            this.materialData[index].materialSpecsId = null;
            this.materialData[index].newScanQrcode = 0;
            this.materialData[index].unitName='';
            this.materialData[index].specsList = [];
            this.initItemMateriaOptions(index);
            //反推确认货主
            // if (this.common.isNotBlank(this.materialData[index].fromTenantId))
            // {
            //     for (let i = 0; i < this.fromTenantData.length; i++)
            //     {
            //         if (this.fromTenantData[i].wId === this.materialData[index].fromTenantId)
            //         {
            //             this.info.srcTenantId = this.fromTenantData[i].parentId;
            //             await this.changeSrcTenantOrFromTenant(1, true);
            //         }
            //     }
            // }
            this.$forceUpdate();
        },
        /**
         * 改变到货厂商或者点击物料
         * 初始化其他数据
         * @param index
         */
        initItemMateriaOptions(index) {
            this.changeMaterialSpecs(index);
            this.initItemMateriaOptionsNoClean(index);
        },
        /**
         * 改变物料
         * @param index
         * @param haveValue 修改的时候  true
         */
        changeMaterial(index,haveValue){
            for (let i = 0; i < this.materialData[index].materiaOptions.length; i++) {
                if(this.materialData[index].materialId==this.materialData[index].materiaOptions[i].id){
                    this.materialData[index].materialNum=this.materialData[index].materiaOptions[i].materialNum;
                    this.materialData[index].materialDesc=this.materialData[index].materiaOptions[i].materialDesc;
                    this.materialData[index].unitName=this.materialData[index].materiaOptions[i].unitName;
                    this.materialData[index].specsList = this.materialData[index].materiaOptions[i].specsList;
                    //新版扫码
                    this.materialData[index].newScanQrcode = this.materialData[index].materiaOptions[i].newScanQrcode;

                    if(!haveValue){
                        this.materialData[index].materialSpecsId = null;
                        if(this.materialData[index].specsList.length==1){
                            this.materialData[index].materialSpecsId=this.materialData[index].specsList[0].id;
                        }else{
                            for (let j = 0; j < this.materialData[index].specsList.length; j++) {
                                if(this.materialData[index].specsList[j].isDefault){
                                    this.materialData[index].materialSpecsId=this.materialData[index].specsList[j].id;
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
            if (this.common.isBlank(this.materialData[index].materialId))
            {
                this.materialData[index].materialDesc='';
                this.materialData[index].materialSpecsId = null;
                this.materialData[index].newScanQrcode = 0;
                this.materialData[index].unitName='';
                this.materialData[index].specsList = [];
            }
            //看看是否选择了含有新扫码的物料  控制下一步展示
            this.changeShow();
            this.$forceUpdate();
        },
        // 选择物料后判断新扫码逻辑
        changeShow()
        {
            let info = true;
            let next = false;
            this.diffCode = false;
            let codeSts = this.materialData[0].newScanQrcode;
            for (let i = 0; i < this.materialData.length; i++) {
                let item = this.materialData[i];
                //存在新版扫码的物料  不展示保存  展示下一步
                if(item.newScanQrcode == 1&&this.info.scanCustQrcode==0){
                    info = false;
                    next = true;
                }
                // 新扫码物料和旧物料不能同时存在
                if(this.common.isNotBlank(item.newScanQrcode) && item.newScanQrcode != codeSts && this.common.isNotBlank(item.materialId)){
                    this.diffCode = true;
                }
            }
            this.showNext = next;
            if(!next) this.materialCodeList = [];
            this.showSave = info;
            if(this.diffCode) this.$message.error("需要扫码与不需要扫码的物料不可同时选择！")
        },
        /**
         * 改变规格
         * @param index
         */
        changeMaterialSpecs(index){
            this.materialData[index].nums = null;
            this.materialData[index].boxNums = null;
            this.materialData[index].palletNums = null;
            this.$forceUpdate();
        },
        /**
         * 箱数/托数 改变
         * @param index
         */
        calcNums(index, type){
            if(this.materialData[index].materialSpecsId){
                for (let i = 0; i < this.materialData[index].specsList.length; i++) {
                    if(this.materialData[index].materialSpecsId == this.materialData[index].specsList[i].id){
                        let perBoxNums = this.materialData[index].specsList[i].perBoxNums;
                        let perPalletNums = this.materialData[index].specsList[i].perPalletNums;
                        let boxNums = this.materialData[index].boxNums;
                        let palletNums = this.materialData[index].palletNums;

                        if (type === 1)//箱数
                        {
                            if (boxNums && perBoxNums)
                            {
                                let tmp = this.common.accMul(boxNums, perBoxNums);
                                this.materialData[index].nums = Math.round(tmp);
                                if(perPalletNums){
                                    let tmp = this.common.accDiv(this.materialData[index].nums,perPalletNums);
                                    this.materialData[index].palletNums = Math.ceil(tmp);
                                }
                            }
                        }
                        else if (type === 2)//托数
                        {
                            if (palletNums && perPalletNums)
                            {
                                let tmp = this.common.accMul(palletNums, perPalletNums);
                                this.materialData[index].nums = Math.round(tmp);
                                if(perBoxNums){
                                    let tmp = this.common.accDiv(this.materialData[index].nums,perBoxNums);
                                    this.materialData[index].boxNums = Math.ceil(tmp);
                                }
                            }
                        }
                        break;
                    }
                }
            }
            this.$forceUpdate();
        },
        /**
         * 改变入库数量计算
         * @param index
         */
        calNums(index){
            if(this.materialData[index].nums&&this.materialData[index].materialSpecsId){
                for (let i = 0; i < this.materialData[index].specsList.length; i++) {
                    if(this.materialData[index].materialSpecsId==this.materialData[index].specsList[i].id){
                        let perBoxNums = this.materialData[index].specsList[i].perBoxNums;
                        let perPalletNums = this.materialData[index].specsList[i].perPalletNums;
                        if(perBoxNums){
                            let tmp = this.common.accDiv(this.materialData[index].nums,perBoxNums);
                            this.materialData[index].boxNums = Math.ceil(tmp);
                        }
                        if(perPalletNums){
                            let tmp = this.common.accDiv(this.materialData[index].nums,perPalletNums);
                            this.materialData[index].palletNums = Math.ceil(tmp);
                        }
                        break;
                    }
                }
            }
            this.$forceUpdate();
        },
        /** 添加物料 */
        addMaterial() {
            let data = {};
            if(this.fromTenantData.length>0){
                data.fromTenantId = this.fromTenantData[0].wId;
            }
            //处理批次号
            if(this.info.scanCustQrcode==1){
                data.batchNum = this.common.formatDate.getDate2();
            }
            this.materialData.push(data);
        },
        /** 删除物料 */
        removeMaterial(index) {
            if (this.materialData.length == 1)
            {
                this.$message.error("最后一条物料了，不可以删除！");
                return;
            }
            if(this.materialData.length>1){
                this.materialData.splice(index, 1);
            }
            this.changeShow();
        },
        /** 添加器具 */
        async addPackMaterial() {
            if (this.packMaterialData.length === 0)
                await this.initPackSelectData();
            let data = {packMaterialId: '',srcTenantId: '',nums: ''};
            if(this.fromTenantData2.length>0){
                data.useTenantId = this.fromTenantData2[0].wId;
            }
            this.packMaterialData.push(data);
            this.$forceUpdate();
        },
        /** 删除器具 */
        removePackMaterial(index) {
            if(this.packMaterialData.length>=1){
                this.packMaterialData.splice(index, 1);
            }
            if (this.info.rejectedState == 1 && this.packMaterialData.length == 0)
                this.showRed = false;
            this.$forceUpdate();
        },
        /** 切换是否退货 */
        changeInfoSwitch() {
            // this.info.rejectedState = this.info.rejectedState == 1 ? 0 : 1;
            this.showRed = this.info.rejectedState != 1;
            this.$forceUpdate();
        },
        /** 切换是否冻结 */
        changeSwitch(item) {
            item.freezeState = item.freezeState == 1 ? 0 : 1;
            this.$forceUpdate();
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
                const data = ev.target.result;
                const workbook = XLSX.read(data, {
                    type: "binary",
                });
                // 取第一张表
                const wsname = workbook.SheetNames[0];
                // 生成json表格内容
                const tableData = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
                let errorMsg = "";
                tableData.forEach((item,index) => {
                    if(_this.common.isBlank(item["入库数量"])){
                        errorMsg = errorMsg + "第" + (index + 1) + "条数据入库数量不能为空。\n";
                    }
                    if(_this.common.isBlank(_this.materialData[index])) _this.addMaterial();
                    let materialData = _this.materialData[index];
                    materialData.batchNum = item["批次号"];
                    materialData.supplierBatchNum = item["供应商批次号"];
                    materialData.asn = item["ASN"];
                    // 到货厂商
                    let isHaveTenant = false;
                    _this.fromTenantData.forEach(innerItem => {
                        if(innerItem.name==item["到货厂商"]){
                            isHaveTenant = true;
                            materialData.fromTenantId = innerItem.wId;
                            _this.initItemMateriaOptions(index);
                        }
                    })
                    if(!isHaveTenant) errorMsg += `第${index+1}条到货厂商不存在！\n`;
                    // 物料编码
                    let isHaveMateria = false;
                    if(this.common.isNotBlank(materialData.materiaOptions)){
                        materialData.materiaOptions.forEach(innerItem => {
                            if(innerItem.materialNum==item["物料编码"]){
                                isHaveMateria = true;
                                materialData.materialId = innerItem.id;
                                _this.changeMaterial(index);
                            }
                        })
                    }
                    if(!isHaveMateria) errorMsg += `第${index+1}条物料编码不存在！\n`;
                    // 规格
                    let isHaveSpecs = false;
                    if(this.common.isNotBlank(materialData.specsList)){
                        materialData.specsList.forEach(innerItem => {
                            if(innerItem.name==item["规格"]){
                                materialData.materialSpecsId = innerItem.id;
                                _this.changeMaterialSpecs(index);
                            }
                        })
                    }
                    if(materialData.materialSpecsId) isHaveSpecs = true;
                    if(!isHaveSpecs) errorMsg += `第${index+1}条规格不存在！\n`;

                    materialData.nums = item["入库数量"];
                    materialData.boxNums = item["箱数"];
                    materialData.palletNums = item["托数"];

                    if(this.common.isNotBlank(materialData.nums) && this.common.isBlank(materialData.boxNums) && this.common.isBlank(materialData.palletNums)){
                        _this.calNums(index);
                    }
                    // if(materialData.nums){
                    //     _this.calNums(index);
                    // }else if(materialData.boxNums && materialData.palletNums && this.common.isBlank(materialData.nums)){
                    //     errorMsg = errorMsg + "第" + (index + 1) + "条数据入库数量为空时，箱数和托数只能选填其中一个。\n";
                    // }else if(materialData.boxNums){
                    //     _this.calcNums(index,1);
                    // }else if(materialData.palletNums){
                    //     _this.calcNums(index,2);
                    // }
                    let produceDate = item["生产日期"];
                    if(_this.common.isNotBlank(produceDate)){
                        if(isNaN(Number(produceDate))){
                            let dateObj = new Date(produceDate);
                            if(isNaN(dateObj.getTime()) || dateObj.getFullYear() < 2000 || dateObj.getFullYear() > 2100){
                                errorMsg += `第${index+1}条数据生产日期格式出错！\n`;
                            }else{
                                materialData.produceDate = _this.common.formatDate.getDate(dateObj);
                            }
                        }else{
                            let date = this.common.getFormatDate_XLSX(produceDate);
                            if(isNaN(new Date(date).getTime()) || new Date(date).getFullYear() < 2000 || new Date(date).getFullYear() > 2100){
                                errorMsg += `第${index+1}条数据生产日期格式出错！\n`;
                            }else{
                                materialData.produceDate = _this.common.formatDate.getDate(date);
                            }
                        }
                    }
                    materialData.codeNum = item["时代条码编号"];
                    _this.$forceUpdate();
                })
                // 提示
                if(errorMsg) _this.$message.error(errorMsg);

                // 检查是否有相同批次号、ASN、生产日期
                let haveSome = false;
                for (let i = 0; i < _this.materialData.length; i++)
                {
                    let item = _this.materialData[i];
                    for(let j = 0; j < _this.materialData.length; j++){
                        let el = _this.materialData[j];
                        if(i!=j && item.batchNum == el.batchNum && item.asn == el.asn && item.produceDate == el.produceDate){
                            haveSome = true;
                            break;
                        }
                    }
                    if(haveSome) break;
                }
                if(haveSome){
                    _this.$confirm("物料信息存在批次号、ASN、生产日期相同的物料，请选择手动合并数据还是系统合并数据?", "提示",{confirmButtonText:"系统合并",cancelButtonText:"手动合并"}).then(() =>{
                        _this.mergeDuplicates(_this.materialData);
                    }).catch(() =>{})
                }

            };
            fileReader.readAsBinaryString(file.raw);
            this.showImportMaterial = false;
        },        
        // 合并数据
        mergeDuplicates(arr) {
            // 创建一个映射表用于存储合并后的对象
            const map = {};
            let isMerge = false;
            // 遍历数组中的每个对象
            arr.forEach((item) => {
                // 使用batchNum和asn的组合作为唯一键
                const key = `${item.batchNum},${item.asn},${item.produceDate}`;
                
                if (map[key]) {
                    // 如果已存在，则累加num值
                    map[key].nums = this.common.accAdd(map[key].nums,item.nums);
                    isMerge = true;
                } else {
                    // 如果不存在，则添加到映射表
                    // 使用扩展运算符创建新对象，避免引用问题
                    map[key] = { ...item };
                }
            });
            
            // 将映射表的值转换为数组并返回
            this.materialData = Object.values(map);
            // 重新计算
            this.materialData.forEach((item,index) => {
                this.calNums(index)
            });
            if(isMerge) this.$message.success("合并成功，请校验数据。");
        },
        changeAppoint()
        {
            for (let i = 0; i < this.appointData.length; i++)
            {
                if (this.appointData[i].appointId == this.info.appointId)
                {
                    this.info.plateNumber = this.appointData[i].plateNumber;
                    this.info.linkPhone = this.appointData[i].billId;
                    break;
                }
            }
        },
        checkFirstPageInfo(){
            if(this.common.isBlank(this.info.srcTenantId)){
                this.$message.error("请选择货主！");
                return;
            }
            if(this.common.isBlank(this.info.rejectedState)){
                this.$message.error("请选择请选择入库类型！");
                return;
            }
            if(this.info.rejectedState!=1&&this.common.isBlank(this.info.srcWorkId)){
                this.$message.error("请选择来货地址！");
                return;
            }
            //物料规格信息
            if(this.materialData.length==0){
                this.$message.error("请输入物料信息！");
                return;
            }
            if(this.info.rejectedState==2&&this.common.isBlank(this.info.rejectedType)){
                this.$message.error("请选择退货类型！");
                return;
            }
            for (let i = 0; i < this.materialData.length; i++) {
                let item = this.materialData[i];
                if(this.common.isBlank(item.batchNum)){
                    this.$message.error("请输入第"+(i+1)+"行物料批次号！");
                    return;
                }
                if(this.common.isBlank(item.fromTenantId)){
                    this.$message.error("请选择第"+(i+1)+"行的到货厂商！");
                    return;
                }
                if(this.common.isBlank(item.materialId)){
                    this.$message.error("请选择第"+(i+1)+"行的物料！");
                    return;
                }
                if(this.common.isBlank(item.materialSpecsId)){
                    this.$message.error("请选择第"+(i+1)+"行的物料规格！");
                    return;
                }
                if(this.common.isBlank(item.nums)){
                    this.$message.error("请输入第"+(i+1)+"行的物料入库数量！");
                    return;
                }
                if(item.nums < 0){
                    this.$message.error("第"+(i+1)+"行的物料入库数量不能小于0！");
                    return;
                }
                if(this.common.isBlank(item.produceDate)){
                    this.$message.error("请输入第"+(i+1)+"行的物料生产日期！");
                    return;
                }
            }
            for (let i = 0; i < this.packMaterialData.length; i++) {
                let item = this.packMaterialData[i];
                if(this.common.isBlank(item.devDeviceId)){
                    this.$message.error("请选择第"+(i+1)+"行器具的可回收器具！");
                    return;
                }
                if(this.common.isBlank(item.srcTenantId)){
                    this.$message.error("请选择第"+(i+1)+"行器具的所属人！");
                    return;
                }
                if(this.common.isBlank(item.useTenantId)){
                    this.$message.error("请选择第"+(i+1)+"行器具的到货厂商！");
                    return;
                }
                if(this.common.isBlank(item.nums)){
                    this.$message.error("请输入第"+(i+1)+"行器具的入库数量！");
                    return;
                }
            }
            return true;
        },
        /** 保存入库单 */
        saveInOrder() {
            if(!this.showNext){
                if(!this.checkFirstPageInfo()) return;
            }
            if(this.diffCode){
                this.$message.error("需要扫码与不需要扫码的物料不可同时选择！");
                return
            }
            if(this.materialCodeList.length > 0){
                for(let index=0;index<this.materialData.length;index++){
                    let item = this.materialData[index];
                    let codeNums = 0;
                    let boxNums = 0;
                    this.materialCodeList.forEach(codeItem => {
                        if (codeItem.index == index) {
                            codeNums = this.common.accAdd(codeNums,Number(codeItem.nums));
                            boxNums = this.common.accAdd(boxNums,Number(codeItem.boxNums));
                        }
                    });
                    if (codeNums != item.nums) {
                        this.$message.error(item.batchNum + "批次计划入库数量和数量确认总数量不相等");
                        return;
                    }
                    if (item.boxNums && boxNums != item.boxNums) {
                        this.$message.error(item.batchNum + "批次计划入库箱数和数量确认总箱数不相等");
                        return;
                    }
                }
            }
            let tipRemainder = false;
            let tipText = '';
            for(let codeIndex=0;codeIndex<this.materialCodeList.length;codeIndex++){
                let codeItem = this.materialCodeList[codeIndex];
                if(codeItem.perPalletNums < codeItem.nums && Number(codeItem.perPalletNums)){   //托装容数为0时不判断
                    this.$message.error(`第${codeIndex+1}行,数量确认不能大于托装容数（${codeItem.perPalletNums}），请重新填写！`);
                    return;
                }else if((codeItem.perPalletNums != codeItem.nums) && codeItem.isRemainder == 0){
                    tipText += '第'+(codeIndex+1)+'行,'
                    tipRemainder = true;
                }
            }
            if(this.common.isBlank(this.info.appointId)){
                this.$message.warning("预约编号为空，后续不选择预约编号不允许新建入库！");
            }
            this.info.materialList = this.materialData;
            this.info.materialCodeList = this.materialCodeList;
            this.info.packMaterialList = this.packMaterialData;
            let mes = this.common.isBlank(this.info.inOrderId) ? "新增入库单成功！" : "修改入库单成功！";
            let that = this;
            that.info.isUpdateQrcode = that.$route.query.isUpdateQrcode;
            if (that.info.isUpdateQrcode == 1)
            {
                mes = "修改入库单标签成功！";
            }            
            if(tipRemainder){
                that.$confirm(tipText+'数量确认和托装容数不相等，且尾数选择否，是否确认保存？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.common.postUrl("wmsInOrderTF", "addOrUpdateInOrder", that.info, function (data) {
                        that.$message.success(mes);
                        that.closePage();
                    })
                })
            }else{
                that.common.postUrl("wmsInOrderTF", "addOrUpdateInOrder", that.info, function (data) {
                    that.$message.success(mes);
                    that.closePage();
                },null,'',true);
            }
        },
        // 刷新视图
        forceUpdate(){
            this.$forceUpdate();
        },

        pre()
        {
            this.showInfo = true;
            this.showNext = true;
            this.showSave = false;
        },
        next()
        {
            if(this.diffCode){
                this.$message.error("需要扫码与不需要扫码的物料不可同时选择！");
                return
            }
            if(!this.checkFirstPageInfo()) return;
            
            // 对比是否有改动
            if(JSON.stringify(this.materialData) != JSON.stringify(this.materialDataCache)){
                let materialCodeList = [];//物料条码
                for (let i = 0; i < this.materialData.length; i++)
                {
                    let item = this.materialData[i];
                    if(this.materialDataCache) var itemSome = JSON.stringify(item) == JSON.stringify(this.materialDataCache[i]);
                    if(this.common.isBlank(item.batchNum)){
                        this.$message.error("请输入第"+(i+1)+"行物料批次号！");
                        return;
                    }
                    // if(this.common.isBlank(item.fromTenantId)){
                    //     this.$message.error("请选择第"+(i+1)+"行的到货厂商！");
                    //     return;
                    // }
                    if(this.common.isBlank(item.materialId)){
                        this.$message.error("请选择第"+(i+1)+"行的物料编码！");
                        return;
                    }
                    if(this.common.isBlank(item.materialSpecsId)){
                        this.$message.error("请选择第"+(i+1)+"行的物料规格！");
                        return;
                    }
                    if(this.common.isBlank(item.nums)){
                        this.$message.error("请输入第"+(i+1)+"行的物料入库数量！");
                        return;
                    }
                    if(item.nums < 0){
                        this.$message.error("第"+(i+1)+"行的物料入库数量不能小于0！");
                        return;
                    }
                    let size = 0;
                    let perPalletNums= -1;
                    let perBoxNums= -1;
                    for (let i = 0; i < item.specsList.length; i++) {
                        if(item.materialSpecsId == item.specsList[i].id){
                            perBoxNums = item.specsList[i].perBoxNums;
                            perPalletNums = item.specsList[i].perPalletNums;
                            if(perPalletNums){
                                let tmp = this.common.accDiv(item.nums,perPalletNums);
                                size = Math.ceil(tmp);
                            }
                            // 记录箱装容数和托装容数，导入时候需要获取
                            item.perBoxNums = perBoxNums;
                            item.perPalletNums = perPalletNums;
                            break;
                        }
                    }
                    let sum = Number(item.nums);
                    if (perPalletNums > 0)
                    {
                        for (let j = 0; j < size; j++)
                        {
                            let num = this.common.accSub(sum, perPalletNums);
                            let nums = Math.min(perPalletNums,sum);//一托多少数量
                            let boxNums = "";
                            if (perBoxNums > 0)
                            {
                                let tmp = this.common.accDiv(nums,perBoxNums);
                                boxNums = Math.ceil(tmp);
                            }
                            let data = {
                                batchNum:item.batchNum,
                                materialId:item.materialId,
                                materialNum:item.materialNum,//物料编码
                                materialDesc:item.materialDesc,//物料
                                materialSpecsId:item.materialSpecsId,
                                supplierBatchNum:item.supplierBatchNum,
                                asn:item.asn,
                                boxNums,//箱数
                                perPalletNums,
                                perBoxNums,
                                nums: nums,
                                index: i,//后台需要知道
                                isRemainder: j == size-1 ? (sum < perPalletNums ? 1 : 0) : 0,
                            }
                            materialCodeList.push(data);
                            sum = num;
                        }
                    }
                    else
                    {
                        let data = {
                            batchNum:item.batchNum,
                            materialId:item.materialId,
                            materialNum:item.materialNum,//物料编码
                            materialDesc:item.materialDesc,//物料
                            materialSpecsId:item.materialSpecsId,
                            supplierBatchNum:item.supplierBatchNum,
                            asn:item.asn,
                            boxNums:item.boxNums,//箱数
                            perPalletNums,
                            perBoxNums,
                            nums: sum,
                            index: i,//后台需要知道
                            isRemainder: 0,
                        }
                        if(this.$route.query.type == 2){    //修改时没有托装容数保留旧数据
                            this.materialCodeList.forEach(el => {
                                if(el.batchNum == item.batchNum && el.asn == item.asn && el.materialId == item.materialId){
                                    el.index = i;
                                    el.class = true;
                                    materialCodeList.push(el);
                                }
                            })
                            if(!itemSome) materialCodeList.push(data);
                        }else{
                            materialCodeList.push(data);
                        }
                    }
                }

                this.materialCodeList = materialCodeList;
                this.materialDataCache = this.common.copyObj(this.materialData);
            }

            //通过
            this.showInfo = false;
            this.showNext = false;
            this.showSave = true;
        },

        // 导入标签数量
        tagExcelUplaod(file){
            if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
                // 文件格式的判断
                this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
                return false;
            }
            const fileReader = new FileReader();
            let _this = this;
            fileReader.onload = (ev) => {
                const data = ev.target.result;
                const workbook = XLSX.read(data, {
                    type: "binary",
                });
                // 取第一张表
                const wsname = workbook.SheetNames[0];
                // 生成json表格内容
                const tableData = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
                let errorMsg = "";
                let materialCodeList = [];
                for(let index=0;index<tableData.length;index++){
                    let item = tableData[index];
                    if(_this.common.isBlank(item["批次号"])){
                        errorMsg = errorMsg + "第" + (index + 1) + "条批次号" + item["批次号"] + "不能为空。\n";
                        break;
                    }
                    if(_this.common.isBlank(item["数量确认"])){
                        errorMsg = errorMsg + "第" + (index + 1) + "条数据数量确认不能为空。\n";
                        break;
                    }
                    if(_this.common.isBlank(item["箱数"])){
                        errorMsg = errorMsg + "第" + (index + 1) + "条数据箱数不能为空。\n";
                        break;
                    }
                    let haveMaterial = false;

                    for(let m=0;m<_this.materialData.length;m++){
                        let el = _this.materialData[m];
                        // 判断是否符合添加到物料编码列表的条件
                        if((_this.common.isNotBlank(item["ASN"]) && el.batchNum == item["批次号"] && el.asn == item["ASN"]) || 
                        (_this.common.isBlank(item["ASN"]) && el.batchNum == item["批次号"])) {
                            // 创建一个对象来存储物料信息
                            let data = {
                                batchNum:el.batchNum, // 批次号
                                materialId:el.materialId, // 物料ID
                                materialNum:el.materialNum, // 物料编码
                                materialDesc:el.materialDesc, // 物料描述
                                materialSpecsId:el.materialSpecsId, // 物料规格ID
                                supplierBatchNum:el.supplierBatchNum, // 供应商批次号
                                perPalletNums:el.perPalletNums, // 箱装容数
                                perBoxNums:el.perBoxNums, // 箱装容数
                                asn:el.asn, // ASN号
                                boxNums:item["箱数"], // 箱数
                                nums: item["数量确认"], // 确认的数量
                                index:m, // 后台需要知道的索引
                                isRemainder: item["是否尾数"]=="是"?1:0, // 是否尾数
                            }
                            // 将创建的对象添加到物料编码列表中
                            materialCodeList.push(data);
                            haveMaterial = true;
                            break;
                        }
                    }
                    if(!haveMaterial){
                        errorMsg = errorMsg + "第" + (index + 1) + "条物料不存在。\n";
                        break;
                    }
                }
                // 提示
                if(errorMsg){
                    _this.$message.error(errorMsg);
                }else{
                    _this.materialCodeList = _this.common.copyObj(materialCodeList);

                    // _this.materialData.forEach(item => {
                    //     for (const key in codeNums) {
                    //         if (item.batchNum == key) {
                    //             if(item.nums != codeNums[key]) _this.$message.error(`批次${item.batchNum}总数量与数量确认总和不相等，请修改！`)
                    //         }
                    //     }
                    // })
                    _this.$forceUpdate();
                }
            };
            fileReader.readAsBinaryString(file.raw);
            this.showImportTag = false;
        },
        // 标签页根据数量计算箱数
        calcCodeBoxNums(item){
            if(!item.perBoxNums) return;
            let tmp = this.common.accDiv(item.nums,item.perBoxNums);
            item.boxNums = Math.ceil(tmp);
            this.$forceUpdate();
        },
        // 添加一行
        addTag(index){
            let obj = this.common.copyObj(this.materialCodeList[index]);
            obj.id = null;//置空一下
            if (index == this.materialCodeList.length - 1)
            {
                this.materialCodeList.push(obj);
            }
            else
            {
                this.materialCodeList.splice(index + 1, 0, obj);
            }
        },
        // 删除当前行
        delTag(index){
            this.$confirm("确定删除该行？", "提示").then(() =>{
                this.materialCodeList.splice(index,1);
            }).catch(() =>{})
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
