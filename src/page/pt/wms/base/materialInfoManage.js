import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import selectWork from "@/page/pt/wms/selectWork.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'materialInfoManage',
    data() {
        return {
            head: [
                {"name": "所属货主", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
                {"name": "物料描述", "code": "materialDesc", "width": "200", "type": "text"},
                {"name": "管理单位", "code": "unitName", "width": "110", "type": "text"},
                {"name": "最低库存", "code": "minStock", "width": "110", "type": "text"},
                {"name": "最高库存", "code": "maxStock", "width": "110", "type": "text"},
                {"name": "是否开启预警", "code": "isWarningName", "width": "110", "type": "text"},
                {"name": "是否整进整出", "code": "isAllInAllOutName", "width": "110", "type": "text"},
                // {"name": "是否需要扫码", "code": "scanQrcodeName", "width": "110", "type": "text"},
                {"name": "是否需要扫码", "code": "newScanQrcodeName", "width": "110", "type": "text"},
                {"name": "拆单是否使用旧标签", "code": "isUseOldQrcodeName", "width": "110", "type": "text"},
                {"name": "关联客户码", "code": "relCustQrcodeTypeName", "width": "110", "type": "text"},
                {"name": "存储条件", "code": "storageConditionName", "width": "110", "type": "text"},
                {"name": "客户物料编码", "code": "custMaterialNum", "width": "150", "type": "text"},
                {"name": "关联物料代码", "code": "relMaterialNum", "width": "150", "type": "text"},
                {"name": "计费规格类型", "code": "specsTypeName", "width": "110", "type": "text"},
                {"name": "立库库位类型", "code": "timesStorageCode", "width": "110", "type": "text"},
                {"name": "货物有效期", "code": "validityPeriod", "width": "110", "type": "text"},
                {"name": "库龄警报", "code": "warningDay", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "180", "type": "text"}
            ],
            loadParam: {srcTenantName: this.$route.query.srcTenantName,storageCondition:''},
            material: this.initMaterial(),//物料信息
            materialSpecsData: [{isDefault: 0}],//物料规格列表
            srcTenantData: [],//所属货主
            fromTenantData: [],//到货厂商
            storageConditionData:[],//存放条件
            unitData: [],//管理单位
            specsTypeData:[],
            showMaterial: false,//新增物料
            isLock: false,//查看
            disabled: false,//查看
            uploadOpen : false,//导入
            title: '新增物料',
            showSelWork:false,
            scanQrcode:'',
            isUpdate: false,
            relCustQrcodeTypeDisable:true,
            relCustQrcodeTypeData:[],
            whetherData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.loadSrcTenantData();
        this.loadFromTenantData();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        searchList,
        tableCommon,
        myImport,
        selectWork
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
        doQuery(loadParam = this.loadParam) {
            this.loadParam = loadParam;
            this.$refs.table.load("wmsMaterialPickTF", "queryMaterialPage", this.loadParam);
        },
        async init() {
            let that = this;
            //管理单位
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_UNIT"}, function (data) {
                that.unitData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STORAGE_CONDITION"}, function (data) {
                that.storageConditionData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REL_CUST_QRCODE_TYPE"}, function (data) {
                that.relCustQrcodeTypeData = data;
            });
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
        },
        initMaterial(){
          return {isWarning: 1,scanQrcode:0,newScanQrcode:0,timesStorageCode:'',storageCondition:'1',isAllInAllOut:0,isUseOldQrcode:0,relCustQrcodeType:'0'};
        },
        initSpecsTypeData(){
            let that = this;
            if(this.material.srcTenantId){
                this.common.postUrl("wmsMaterialPickTF", "querySpecsTypeDataList", {srcTenantId: this.material.srcTenantId}, function (data) {
                    that.specsTypeData = data;
                    if(that.specsTypeData.length==0){
                        that.specsTypeData=[{codeValue:'1',codeName:'标准规格'}];
                    }
                    if(that.specsTypeData.length==1){
                        that.material.specsType=that.specsTypeData[0].codeValue;
                    }
                });
            }else{
                this.specsTypeData=[];
            }
            this.$forceUpdate();
        },
        /**
         * 加载货主
         * @param id
         * @returns {Promise<void>}
         */
        async loadSrcTenantData(id)
        {
            this.srcTenantData = await this.common.postUrl("wmsTenantTF", "queryConsignorTenantList", {id: id});
        },
        /**
         * 加载到货厂商
         * @param parentId
         * @returns {Promise<void>}
         */
        async loadFromTenantData(parentId)
        {
            this.fromTenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {parentId: parentId});
        },
        /**
         * 改变货主或者是到货厂商
         * @param type 1 货主 2 到货厂商
         */
        async chnageSrcTenantOrFromTenant(type)
        {
            if (type === 1)
            {
                //选择了货主加载归属货主的到货厂商
                await this.loadFromTenantData(this.material.srcTenantId);
                if (this.fromTenantData.length === 1)
                {
                    this.material.fromTenantId = this.fromTenantData[0].wId;
                }
                else
                {
                    this.material.fromTenantId = null;
                }
                this.initSpecsTypeData();
                this.$forceUpdate();
            }
            if (type === 2)
            {
                //选择了到货厂商
                if (this.common.isNotBlank(this.material.fromTenantId))
                {
                    this.fromTenantData.forEach(item => {
                        if (item.wId === this.material.fromTenantId)
                        {
                            this.srcTenantData.forEach(item2 => {
                                if (item2.wId === item.parentId)
                                {
                                    this.material.srcTenantId = item2.wId;
                                    this.initSpecsTypeData();
                                    this.$forceUpdate();
                                }
                            });
                        }
                    });
                }
            }
        },
        clear() {
            this.loadParam = {};
        },
        /** 打开关闭 新增物料弹窗 */
        toAddMaterial(flag) {
            this.loadSrcTenantData().then(() => {});
            this.loadFromTenantData().then(() => {});
            this.relCustQrcodeTypeDisable = true;
            if(flag){
                this.material = this.initMaterial();
                this.disabled = false;
                this.title = "新增物料";
                this.showMaterial = true;
                this.isUpdate = false;
                this.init();
            }else{
                this.material = this.initMaterial();
                this.materialSpecsData = [{isDefault: 0}];
                this.showMaterial = false;
                this.isLock = false;
                this.isUpdate = false;
            }
        },
        /** 双击查看详情 */
        dblclickItem(data){
            this.toUpMaterial(data);
        },
        /** 打开关闭 修改物料弹窗 */
        async toUpMaterial(data) {
            await this.loadSrcTenantData();
            if(this.common.isBlank(data)){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条物料信息！");
                    return;
                }
                data = selectData[0];
                this.title = "修改物料";

            }else{//查看详情
                this.isLock = true;
                this.title = "查看物料";
                await this.loadFromTenantData();
            }
            this.material = await this.common.postUrl("wmsMaterialPickTF", "queryMaterialInfoById", {id:data.id});
            this.scanQrcode = this.material.scanQrcode;
            //选择了货主加载归属货主的到货厂商
            await this.loadFromTenantData(this.material.srcTenantId);

            this.material.unit = this.material.unit.toString();
            this.material.storageCondition = this.material.storageCondition.toString();
            this.material.relCustQrcodeType = this.material.relCustQrcodeType.toString();
            this.material.isUseOldQrcode = this.material.isUseOldQrcode.toString();
            this.relCustQrcodeTypeDisable = this.material.newScanQrcode == 0;
            this.material.specsType = this.material.specsType.toString();
            this.materialSpecsData = this.material.specsList;
            this.disabled = this.material.newScanQrcode == 1;
            this.showMaterial = true;
            this.isUpdate = true;
            this.initSpecsTypeData();
        },
        /** 切换是否开启预警 */
        changeMaterialSwitch() {
            this.material.isWarning = this.material.isWarning == 1 ? 0 : 1;
            this.$forceUpdate();
        },
        /** 切换radio */
        changeSwitch(key) {
            this.material[key] = this.material[key] == 1 ? 0 : 1;
            this.$forceUpdate();
        },
        /** 切换是否需要扫码 */
        changeScanQrcodeSwitch() {
            this.material.scanQrcode = this.material.scanQrcode == 1 ? 0 : 1;
            this.$forceUpdate();
        },
        /** 切换是否需要扫码 */
        changeNewScanQrcodeSwitch() {
            let that = this;
            if (this.isUpdate && this.material.newScanQrcode == 1)
            {
                that.$confirm("设置成不扫码，原有关联的条码将被清空，确定修改吗？", "提示").then(() =>{
                    that.material.newScanQrcode = that.material.newScanQrcode == 1 ? 0 : 1;
                    that.disabled = that.material.newScanQrcode == 1;
                    if (that.material.newScanQrcode == 1)
                    {
                        that.material.scanQrcode = 0;
                        that.relCustQrcodeTypeDisable = false;
                    }else{
                        that.relCustQrcodeTypeDisable = true;
                        that.material.relCustQrcodeType = '0';
                    }
                    that.$forceUpdate();
                }).catch(() =>{
                    //取消
                });
            }
            else
            {
                that.material.newScanQrcode = that.material.newScanQrcode == 1 ? 0 : 1;
                that.disabled = that.material.newScanQrcode == 1;
                if (that.material.newScanQrcode == 1)
                {
                    that.material.scanQrcode = 0;
                    that.relCustQrcodeTypeDisable = false;
                }else{
                    that.relCustQrcodeTypeDisable = true;
                    that.material.relCustQrcodeType = '0';
                }
                that.$forceUpdate();
            }
        },
        /** 切换是否需要扫码 */
        changeIsAllInAllOutSwitch() {
            this.material.isAllInAllOut = this.material.isAllInAllOut == 1 ? 0 : 1;
            this.$forceUpdate();
        },
        /** 切换是否默认 */
        changeSpecsSwitch(index) {
            this.materialSpecsData[index].isDefault = this.materialSpecsData[index].isDefault == 1 ? 0 : 1;
            if(this.materialSpecsData[index].isDefault == 1){
                for (let i = 0; i < this.materialSpecsData.length; i++) {
                    if(index!=i){
                        this.materialSpecsData[i].isDefault = 0;
                    }
                }
            }
            this.$forceUpdate();
        },
        /** 添加规格 */
        addMaterialSpecs() {
            this.materialSpecsData.push({isDefault: 0});
        },
        /** 删除规格 */
        removeMaterialSpecs(index) {
            if(this.materialSpecsData.length>1){
                this.materialSpecsData.splice(index, 1);
            }
        },
        /** 保存物料信息 */
        saveMaterial() {
            if(this.common.isBlank(this.material.materialNum)){
                this.$message.error("请输入物料编码！");
                return;
            }
            if(this.common.isBlank(this.material.materialDesc)){
                this.$message.error("请输入物料描述！");
                return;
            }
            if(this.common.isBlank(this.material.srcTenantId)){
                this.$message.error("请选择所属货主！");
                return;
            }
            if(this.common.isBlank(this.material.fromTenantId)){
                this.$message.error("请选择到货厂商！");
                return;
            }
            if(this.common.isBlank(this.material.unit)){
                this.$message.error("请选择管理单位！");
                return;
            }
            if(this.common.isBlank(this.material.validityPeriod)){
                this.$message.error("请输入货物有效期！");
                return;
            }
            if(this.common.isBlank(this.material.isWarning)){
                this.$message.error("请选择是否开启预警！");
                return;
            }
            // if(this.common.isBlank(this.material.scanQrcode)){
            //     this.$message.error("请选择是否需要扫码！");
            //     return;
            // }
            //物料规格信息
            if(this.materialSpecsData.length==0){
                this.$message.error("请输入物料规格信息！");
                return;
            }
            for (let i = 0; i < this.materialSpecsData.length; i++) {
                if(this.common.isBlank(this.materialSpecsData[i].name)){
                    this.$message.error("请输入第"+(i+1)+"行规格名称！");
                    return;
                }
                if(this.common.isBlank(this.materialSpecsData[i].lengthStr)){
                    this.$message.error("请输入第"+(i+1)+"行最大装载长！");
                    return;
                }
                if(this.common.isBlank(this.materialSpecsData[i].widthStr)){
                    this.$message.error("请输入第"+(i+1)+"行最大装载宽！");
                    return;
                }
                if(this.common.isBlank(this.materialSpecsData[i].heightStr)){
                    this.$message.error("请输入第"+(i+1)+"行最大装载高！");
                    return;
                }
                if(this.common.isBlank(this.materialSpecsData[i].perPalletNums)){
                    this.$message.error("请输入第"+(i+1)+"行托装容数！");
                    return;
                }
                if(this.materialSpecsData[i].perPalletNums<0){
                    this.$message.error("第"+(i+1)+"行的托装容数小于0！");
                    return;
                }
                if(this.common.isBlank(this.materialSpecsData[i].isDefault)){
                    this.$message.error("请选择第"+(i+1)+"行是否默认！");
                    return;
                }
            }
            this.material.materialSpecsData = this.materialSpecsData;
            let mes = this.common.isBlank(this.material.id) ? "新增成功！" : "修改成功！";
            let that = this;
            if(this.material.id&&!this.material.scanQrcode&&this.scanQrcode!=this.material.scanQrcode){
                that.$confirm("设置成不扫码，原有关联的条码将被清空，确定修改吗？", "提示").then(() =>{
                    that.common.postUrl("wmsMaterialPickTF", "saveMaterial", that.material, function (data_) {
                        if (that.common.isNotBlank(data_)) {
                            that.doQuery();
                            that.toAddMaterial(false);
                            that.$message.success(mes);
                        }
                    },null,'',true);
                }).catch(() =>{
                    //取消
                });
            }else{
                that.common.postUrl("wmsMaterialPickTF", "saveMaterial", that.material, function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.doQuery();
                        that.toAddMaterial(false);
                        that.$message.success(mes);
                    }
                },null,'',true);
            }
        },
        /** 删除物料信息 */
        delMaterialInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条物料信息！");
                return;
            }
            this.$confirm("是否确认删除？", "提示").then(async () =>{
                await this.common.postUrl("wmsMaterialPickTF", "delMaterialInfo", selectData[0],
                null, null, '', true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        /**
         * 展示上传
         */
        showUpload(flag)
        {
            if (!flag)
                this.$refs.myImport.$refs.upload.clearFiles();
            this.uploadOpen = flag;
        },
        /**
         * 确认收货
         */
        sure()
        {
            this.$refs.myImport.submitFileForm();
        },
        /**
         * 导入成功回调
         * @returns {Promise<void>}
         */
        async sureSuccess()
        {
            await this.doQuery();
            this.showUpload(false);
            this.$message.success("导入成功！");
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
                urlId: 'material' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.MATERIAL,
                },
                urlName: "物料" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"所属货主","model":"srcTenantName","type":"input","placeholder":"所属货主","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"到货厂商","isshow":true},
                {"name":"存放条件","model":"storageCondition","type":"select","options":this.storageConditionData,"label":"codeName","value":"codeValue","placeholder":"存放条件","method":"doQuery","isshow":true},
                {"name":"是否需要扫码","model":"newScanQrcode","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否需要扫码","method":"doQuery","isshow":true},
                {"name":"关联客户码","model":"relCustQrcodeType","type":"select","options":this.relCustQrcodeTypeData,"label":"codeName","value":"codeValue","placeholder":"关联客户码","method":"doQuery","isshow":true},
                {"name":"拆单使用旧标签","model":"isUseOldQrcode","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"拆单是否使用旧标签","method":"doQuery","isshow":true},
            ]
        }
    },
}
