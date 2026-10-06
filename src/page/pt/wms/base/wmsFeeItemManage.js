import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'wmsFeeItemManage',
    data()
    {
        return {
            head: [
                {"name": "费用项目名称", "code": "name", "width": "250", "type": "text"},
                {"name": "类型", "code": "itemTypeName", "width": "100", "type": "text"},
                {"name": "子类型", "code": "subItemTypeName", "width": "100", "type": "text"},
                {"name": "税率(%)", "code": "tax", "width": "80", "type": "text"},
                {"name": "默认价格单位", "code": "unit", "width": "100", "type": "text"},
                {"name": "默认未税价格", "code": "price", "width": "100", "type": "text"},
                {"name": "默认含税价格", "code": "priceWithTax", "width": "100", "type": "text"},
                {"name": "是否默认项目", "code": "defaultItemName", "width": "100", "type": "text"},
                {"name": "备注", "code": "remark", "width": "160", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "120", "type": "text"},
                {"name": "审核意见", "code": "verifyRemark", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "100", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            title: '新增',
            showDialog: false,
            isLock: false,
            nameDisable:false,
            query: this.initQuery(),
            feeItem: this.initFeeItem(),
            showSubItem:false,
            itemTypeData: [],
            allSubItemTypeData:[],
            deviceTypeData:[],
            subItemTypeData:[],
            allFeeTypeData:[],
            feeTypeData:[],
            whetherData:[],
            allDeviceData:[],
            deviceData:[],
            allUnitList:[],
            unitList:[],
            restaurants: [],
            verifyStateData:[],
            specsTypeData:[],
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
        searchList,
    },
    methods: {
        loadAll() {
            let that = this;
            this.common.postUrl("wmsFeeItemService", "loadFeeItemList", {}, function (data){
                if (data && data.length > 0) {
                    let set = new Set();
                    data.forEach(item => {
                        item.value = item.unit;
                        if (!set.has(item.unit))
                            that.restaurants.push(item);
                        set.add(item.unit);
                    })

                }else {
                    that.restaurants = [
                        // {"value": "托"},
                        // {"value": "箱"},
                        // {"value": "张"},
                        // {"value": "个"},
                        // {"value": "单"},
                        // {"value": "桶"},
                        // 心情不好,不搞这些了,直接移除
                    ];
                }
                that.$forceUpdate();
            });
        },
        querySearch(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(item) {
        },

        async doQuery(query = this.query) {
            this.query = query;
            await this.$refs.table.load("wmsFeeItemService", "queryFeeItemPage", this.query);
        },
        async initData() {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_ITEM_TYPE"}, function (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].codeValue > 100)
                        that.itemTypeData.push(data[i]);
                }
                that.$forceUpdate();
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_SUB_ITEM_TYPE"}, function (data) {
                that.allSubItemTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEVICE_TYPE"}, function (data) {
                that.deviceTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_TYPE"}, function (data) {
                that.allFeeTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data) {
                that.whetherData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_ITEM_PRICE_UNIT_TYPE"}, function (data) {
                that.allUnitList = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"}, function (data) {
                that.verifyStateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SPECS_TYPE"}, function (data) {
                that.specsTypeData = data;
            });
            this.allDeviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {});
        },
        initQuery()
        {
            return this.query = {
                name: '',
                itemType: '',
                unit: '',
            };
        },
        initFeeItem()
        {
            return this.feeItem = {
                id: '',
                name: '',
                itemType: '',
                specsType:'',
                subItemType:'',
                feeType:'',
                urgent:0,
                isSelf:'',
                isOutWarehouse:'',
                deviceId:'',
                tax: '',
                unit: '',
                remark: '',
                defaultItem:0,
            };
        },
        changeItemType(){
            this.subItemTypeData = [];
            this.feeItem.subItemType='';
            this.feeTypeData = [];
            this.feeItem.feeType='';
            this.feeItem.isSelf='';
            this.feeItem.isOutWarehouse='';
            this.feeItem.deviceId='';
            this.feeItem.specsType='';
            if(this.feeItem.itemType){
                this.initSysStaticData();
                if(this.feeItem.itemType=='106'){
                    this.feeItem.isSelf='1';
                    this.feeItem.isOutWarehouse='1';
                    this.feeItem.specsType='1';
                }else if(this.feeItem.itemType=='107'){
                    this.feeItem.deviceId=this.deviceData[0].id;
                }else{
                    this.feeItem.specsType='1';
                }
            }
            this.initFeeItemName();
        },
        initSysStaticData() {
            if(this.feeItem.itemType=='106'||this.feeItem.itemType=='107'){
                this.subItemTypeData = this.deviceTypeData;
                if(this.common.isBlank(this.feeItem.subItemType)) {
                    this.feeItem.subItemType = this.subItemTypeData[0].codeValue;
                }
                this.initDeviceData();
            }else{
                for (let i = 0; i < this.allSubItemTypeData.length; i++) {
                    if(this.allSubItemTypeData[i].codeId===parseInt(this.feeItem.itemType)){
                        if(this.common.isBlank(this.feeItem.subItemType)){
                            this.feeItem.subItemType=this.allSubItemTypeData[i].codeValue;
                        }
                        this.subItemTypeData.push(this.allSubItemTypeData[i]);
                    }
                }
            }
            for (let i = 0; i < this.allFeeTypeData.length; i++) {
                if(this.allFeeTypeData[i].codeId===parseInt(this.feeItem.itemType)){
                    if(this.common.isBlank(this.feeItem.feeType)){
                        this.feeItem.feeType=this.allFeeTypeData[i].codeValue;
                    }
                    this.feeTypeData.push(this.allFeeTypeData[i]);
                }
            }
        },
        //追加个器具的限制
        initDeviceData(){
            this.deviceData = [];
            if(this.feeItem.itemType=='106'||this.feeItem.itemType=='107'){
                let flag = false;
                for (let i = 0; i < this.allDeviceData.length; i++) {
                    if(this.feeItem.subItemType==this.allDeviceData[i].deviceType){
                        this.deviceData.push(this.allDeviceData[i]);
                        if(this.feeItem.deviceId==this.allDeviceData[i].id){
                            flag = true;
                        }
                    }
                }
                if(!flag){
                    this.feeItem.deviceId = '';
                }
                if(this.common.isBlank(this.feeItem.deviceId)&&this.deviceData.length>0) {
                    this.feeItem.deviceId = this.deviceData[0].id;
                }
            }else{
                this.feeItem.deviceId = '';
            }
        },
        initUnit(flag){
            if(flag){
                this.feeItem.unit='';
            }
            this.unitList = this.allUnitList;
            if(this.feeItem.itemType) {
                if(this.feeItem.itemType=='106') {
                    this.unitList=[];
                    for (let i = 0; i < this.allUnitList.length; i++) {
                        if(this.allUnitList[i].codeValue=='1'||this.allUnitList[i].codeValue=='3'||this.allUnitList[i].codeValue=='4'||this.allUnitList[i].codeValue=='8'){
                            this.unitList.push(this.allUnitList[i]);
                        }
                    }
                }else if(this.feeItem.itemType=='107'){
                    this.unitList=[];
                    if(this.feeItem.feeType) {
                        if(this.feeItem.feeType=='4'){
                            for (let i = 0; i < this.allUnitList.length; i++) {
                                if(this.allUnitList[i].codeValue=='7'){
                                    this.unitList.push(this.allUnitList[i]);
                                }
                            }
                        }else if(this.feeItem.feeType=='5'){
                            for (let i = 0; i < this.allUnitList.length; i++) {
                                if(this.allUnitList[i].codeValue=='9'||this.allUnitList[i].codeValue=='10'){
                                    this.unitList.push(this.allUnitList[i]);
                                }
                            }
                        }else if(this.feeItem.feeType=='6'){
                            for (let i = 0; i < this.allUnitList.length; i++) {
                                if(this.allUnitList[i].codeValue=='8'||this.allUnitList[i].codeValue=='9'||this.allUnitList[i].codeValue=='10'){
                                    this.unitList.push(this.allUnitList[i]);
                                }
                            }
                        }
                    }
                }
            }
        },
        initFeeItemName(){
            this.nameDisable=false;
            this.feeItem.name='';
            if(this.feeItem.itemType=='106'){
                this.nameDisable=true;
                for (let i = 0; i < this.feeTypeData.length; i++) {
                    if(this.feeItem.feeType==this.feeTypeData[i].codeValue){
                        this.feeItem.name+=this.feeTypeData[i].codeName;
                        break;
                    }
                }
                for (let i = 0; i < this.subItemTypeData.length; i++) {
                    if(this.feeItem.subItemType==this.subItemTypeData[i].codeValue){
                        this.feeItem.name+="-"+this.subItemTypeData[i].codeName;
                        break;
                    }
                }
                this.initDeviceData();
                for (let i = 0; i < this.deviceData.length; i++) {
                    if(this.feeItem.deviceId==this.deviceData[i].id){
                        this.feeItem.name+="("+this.deviceData[i].name+")";
                        break;
                    }
                }
                // this.feeItem.name+= "("+(this.feeItem.isSelf=='1'?"自有":"客户")+"|"+(this.feeItem.isOutWarehouse=='1'?"经外仓":"不经外仓")+")";
            }else if(this.feeItem.itemType=='107'){
                this.nameDisable=true;
                for (let i = 0; i < this.feeTypeData.length; i++) {
                    if(this.feeItem.feeType==this.feeTypeData[i].codeValue){
                        this.feeItem.name+=this.feeTypeData[i].codeName;
                        break;
                    }
                }
                for (let i = 0; i < this.subItemTypeData.length; i++) {
                    if(this.feeItem.subItemType==this.subItemTypeData[i].codeValue){
                        this.feeItem.name+="-"+this.subItemTypeData[i].codeName;
                        break;
                    }
                }
                this.initDeviceData();
                for (let i = 0; i < this.deviceData.length; i++) {
                    if(this.feeItem.deviceId==this.deviceData[i].id){
                        this.feeItem.name+="("+this.deviceData[i].name+")";
                        break;
                    }
                }
            }else{
                for (let i = 0; i < this.specsTypeData.length; i++) {
                    if(this.feeItem.specsType==this.specsTypeData[i].codeValue){
                        this.feeItem.name="-"+this.specsTypeData[i].codeName;
                        break;
                    }
                }
            }

            this.initUnit(true);
        },
        async openDialog(flag)
        {
            this.showDialog = flag;
        },
        async dblclickItem(data)
        {
            this.title = '详情';
            this.isLock = true;
            this.initValue(data);
        },
        async initValue(data) {
            this.feeItem = this.common.copyObj(data);
            if (this.common.isNotBlank(this.feeItem.subItemType)) {
                this.feeItem.subItemType = this.feeItem.subItemType + "";
            }
            if (this.common.isNotBlank(this.feeItem.feeType)) {
                this.feeItem.feeType = this.feeItem.feeType + "";
            }
            if (this.common.isNotBlank(this.feeItem.specsType)) {
                this.feeItem.specsType = this.feeItem.specsType + "";
            }
            if (this.common.isNotBlank(this.feeItem.isSelf)) {
                this.feeItem.isSelf = this.feeItem.isSelf + "";
            }
            if (this.common.isNotBlank(this.feeItem.isOutWarehouse)) {
                this.feeItem.isOutWarehouse = this.feeItem.isOutWarehouse + "";
            }
            this.initSysStaticData();
            this.initUnit(false);
            await this.openDialog(true);
        },
        async addFeeItem()
        {
            this.title = '新增';
            this.isLock = false;
            this.initFeeItem();
            await this.openDialog(true);
        },
        async updateFeeItem()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            // if(selectData[0].verifyState==1){
            //     this.$message.error("已经审核通过的数据不允许修改！");
            //     return false;
            // }
            this.title = '修改';
            this.isLock = false;
            this.initValue(selectData[0]);
        },
        async saveOrUpdateFeeItem()
        {
            if (this.common.isBlank(this.feeItem.name))
            {
                this.$message.error("请选择费用项目名称！");
                return false;
            }
            if (this.common.isBlank(this.feeItem.itemType))
            {
                this.$message.error("请选择类型！");
                return false;
            }
            if(this.feeItem.itemType=='106'||this.feeItem.itemType=='107'){
                if(this.common.isBlank(this.feeItem.deviceId)){
                    this.$message.error("请选择具体器具！");
                    return false;
                }
            }

            await this.common.postUrl("wmsFeeItemService", "saveOrUpdateFeeItem", this.feeItem);

            await this.doQuery();
            await this.openDialog(false);
            this.$message.success("保存成功!");
        },
        /**
         * 计算费用
         * @param {当前行} item
         * @param {当前字段} code
         * @returns
         */
        calcFee(code){
            if(code == "price"){    //算价税合计
                this.feeItem.priceWithTax = this.common.accMul(this.feeItem.price,(1 + this.common.accDiv(this.feeItem.tax,100))).myToFixed(2);
            }else if(code == "priceWithTax"){  //算未税单价
                this.feeItem.price = this.common.accDiv(this.feeItem.priceWithTax,(1 + this.common.accDiv(this.feeItem.tax,100))).myToFixed(2);
            }else if(code == 'tax'){
                if(this.common.isNotBlank(this.feeItem.price)){
                    this.feeItem.priceWithTax = this.common.accMul(this.feeItem.price,(1 + this.common.accDiv(this.feeItem.tax,100))).myToFixed(2);
                }
            }
            this.$forceUpdate();
        },
        async deleteFeeItem()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            if(selectData[0].verifyState==1){
                this.$message.error("已经审核通过的数据不允许删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("wmsFeeItemService", "deleteFeeItem", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        /** 切换是否退货 */
        changeInfoSwitch(item) {
            this.feeItem[item] = this.feeItem[item] == 1 ? 0 : 1;
            this.$forceUpdate();
        },


        async verifyFeeItem()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的数据！");
                return false;
            }
            if(selectData[0].verifyState!=0){
                this.$message.error("选择的数据不是待审核状态！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(selectData[0]);
            this.$confirm("您正在进行审核操作，是否继续?", "提示",{
                confirmButtonText: '审核通过',
                cancelButtonText: '审核不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核意见',
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.type = 1;
                        await that.common.postUrl("wmsFeeItemService", "verifyFeeItem", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    else if (action === 'cancel')
                    {
                        param.type = 2;
                        await that.common.postUrl("wmsFeeItemService", "verifyFeeItem", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    done();
                }
            });
        },
        download(){
            this.$refs.table.downloadExcelFile('按库位在库单列表');
        },

    },
    computed:{
        formData(){
            return [
                {"name":"费用项目名称","model":"name","type":"input","placeholder":"费用项目名称","isshow":true},
                {"name":"类型","model":"itemType","type":"select","options":this.itemTypeData,"label":"codeName","value":"codeValue","placeholder":"类型","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"价格单位","model":"unit","type":"input","placeholder":"价格单位","isshow":true},
                {"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
            ]
        }
    },
}
