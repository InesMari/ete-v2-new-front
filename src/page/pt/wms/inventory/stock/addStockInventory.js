import myFileModel from '@/components/myFileModel/myFileModel.vue'

export default {
    name: 'addStockInventory',
    data() {
        return {
            info: {
                inventoryUserId: this.common.userInfo().userId,
                inventoryDate: new Date(),
                inventoryRemark: '',
            },
            orgUserData:[],
            materialList: [],//物料下拉数据
            inventoryStateData: [],
            stockList: this.initStockList(),
            stockListCache: [],
            disable:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        myFileModel
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化按物料分组数据和新库存下拉列表数据
         */
        async initData()
        {
            this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {orgFlag:1});
            this.inventoryStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVENTORY_STATE"});
            this.materialList = await this.common.postUrl("wmsAllocatTF", "queryAllocatUsableMaterialList", {freezeState: 2});
            if (this.common.isNotBlank(this.$route.query.inventoryId)){
                this.disable = true;
                await this.loadStockInventory();
            }
            this.$forceUpdate();
        },
        // 监听滚动条
        initScroll(){
            let that  = this;
            let scrollView = this.$refs.scrollView;
            let isLoad = false;
            scrollView.onscroll = function(){
                if(this.scrollTop + this.clientHeight >= scrollView.scrollHeight - 10 && !isLoad){
                    that.common.shade.show();
                    isLoad = true;
                    let datas = that.stockListCache.length > 50 ? 50 : that.stockListCache.length;
                    that.stockList.push(...that.stockListCache.splice(0,datas));
                    that.$nextTick(() => {
                        if(this.buttonConfirm){
                            that.stockList.forEach((item,index) => {
                                that.setDomValue(item,index);
                            })
                        }
                    });
                        requestAnimationFrame(() => {
                            that.common.shade.hide();
                        })
                    const timer = setTimeout(() => {
                        isLoad = false;
                        clearTimeout(timer);
                    },300);
                }
            }
        },
        /**
         * @returns {Promise<*[]>}
         */
        async loadStockInventory()
        {
            let data = await this.common.postUrl("wmsStockInventoryService", "loadWmsStockInventoryById", {inventoryId: this.$route.query.inventoryId});
            let list = data.list;
            data.list = null;
            this.stockList = [];
            this.info.inventoryId = data.inventoryId;
            for(let i in list)
            {
                let item = list[i];
                for(let i2 in this.materialList)
                {
                    let el = this.materialList[i2];
                    if (el.materialId == item.materialId)
                    {
                        let key = "";
                        key += item.materialId === null ? '' : item.materialId;
                        item.batchNumList = el["batchNum" + key];

                        key += item.batchNum === null ? '' : item.batchNum;
                        item.supplierBatchNumList = el["supplierBatchNum" + key];

                        key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                        item.asnList = el["asn" + key];

                        key += item.asn === null ? '' : item.asn;
                        item.materialSpecsList = el["materialSpecsId" + key];

                        key += item.materialSpecsId === null ? '' : item.materialSpecsId;
                        item.produceDateList = el["produceDate" + key];

                        key += item.produceDate === null ? '' : item.produceDate;
                        // item.inDateList = el["inDate" + key];
                        //
                        // key += item.inDate === null ? '' : item.inDate;
                        item.reservoirList = el["reservoirId" + key];

                        key += item.reservoirId === null ? '' : item.reservoirId;
                        item.storageList = el["storageId" + key];
                        break;
                    }
                }
                this.stockList.push(item);
            }
            this.$forceUpdate();
        },
        /**
         * 初始化调拨列表集合
         */
        initStockList()
        {
            return this.stockList = [this.initStockData()];
        },
        /**
         * 初始化数组单个调拨数据
         * @returns
         */
        initStockData()
        {
            return {
                stockMaterialDtlId: null,
                materialId: '',
                materialDesc: '',
                batchNum: '',
                batchNumList: [],
                supplierBatchNum: '',
                supplierBatchNumList: [],
                asn: '',
                asnList: [],
                materialSpecsId: '',
                materialSpecsList: [],
                produceDate: '',
                produceDateList: [],
                // inDate: '',
                // inDateList: [],
                reservoirId: '',
                reservoirList: [],
                storageId: '',
                storageList: [],
                unitName: '',
                storeNums: '',
                expectNums: '',
                boxNums: '',
                palletNums: '',
                inventoryNums: '',
                qrcodes: '',
                perNum: '',
                inventoryBoxNums: '',
                inventoryPalletNums: '',
                inventoryState: '',
                diffNums: '',
                remark: '',
            };
        },
        initStockDataProperty(item, materialId, materialDesc, batchNum, batchNumList,
                              supplierBatchNum, supplierBatchNumList, asn, asnList,
                              materialSpecsId, materialSpecsList, produceDate, produceDateList,
                              inDate, inDateList, unitName, reservoirId, reservoirList, storageId, storageList,
                              storeNums, expectNums, boxNums, palletNums, inventoryNums, inventoryBoxNums, inventoryPalletNums,
                              inventoryState, diffNums, remark)
        {
            item.materialId = materialId === undefined ? null : materialId;
            item.materialDesc = this.common.isBlank(materialDesc) ? '' : materialDesc;
            item.batchNum = batchNum === undefined ? null : batchNum;
            item.batchNumList = this.common.isBlank(batchNumList) ? [] : batchNumList;

            item.supplierBatchNum = supplierBatchNum === undefined ? null : supplierBatchNum;
            item.supplierBatchNumList = this.common.isBlank(supplierBatchNumList) ? [] : supplierBatchNumList;
            item.asn = asn === undefined ? null : asn;
            item.asnList = this.common.isBlank(asnList) ? [] : asnList;

            item.materialSpecsId = materialSpecsId === undefined ? null : materialSpecsId;
            item.materialSpecsList = this.common.isBlank(materialSpecsList) ? [] : materialSpecsList;
            item.produceDate = produceDate === undefined ? null : produceDate;
            item.produceDateList = this.common.isBlank(produceDateList) ? [] : produceDateList;

            item.inDate = inDate === undefined ? null : inDate;
            item.inDateList = this.common.isBlank(inDateList) ? [] : inDateList;
            item.reservoirId = reservoirId === undefined ? null : reservoirId;
            item.reservoirList = this.common.isBlank(reservoirList) ? [] : reservoirList;
            item.storageId = storageId === undefined ? null : storageId;
            item.storageList = this.common.isBlank(storageList) ? [] : storageList;

            item.unitName = this.common.isBlank(unitName) ? '' : unitName;
            item.storeNums = this.common.isBlank(storeNums) ? '' : storeNums;
            item.expectNums = this.common.isBlank(expectNums) ? '' : expectNums;
            item.boxNums = this.common.isBlank(boxNums) ? '' : boxNums;
            item.palletNums = this.common.isBlank(palletNums) ? '' : palletNums;
            item.inventoryNums = this.common.isBlank(inventoryNums) ? '' : inventoryNums;
            item.inventoryBoxNums = this.common.isBlank(inventoryBoxNums) ? '' : inventoryBoxNums;
            item.inventoryPalletNums = this.common.isBlank(inventoryPalletNums) ? '' : inventoryPalletNums;

            item.inventoryState = this.common.isBlank(inventoryState) ? '' : inventoryState;
            item.diffNums = this.common.isBlank(diffNums) ? '' : diffNums;
            item.remark = this.common.isBlank(remark) ? '' : remark;
            return item;
        },
        /**
         * 改变物料编码
         * @param item
         * @param index
         */
        changeMaterial(item, index, isAuto)
        {
            //初始化一下物料之外的属性
            let that = this;
            let num = 0;
            this.common.shade.show();
            if(this.common.isBlank(item.materialId)){
                that.stockList[index] = {};
                this.common.shade.hide();
                this.$forceUpdate();
                return;
            }
            this.initStockDataProperty(item, item.materialId);
            const timer = setTimeout(()=>{
                // this.materialList.forEach(el => {
                for(let el of that.materialList){
                    // let el = this.this.materialList[m];
                    if (el.materialId == item.materialId) {
                        for (let i = 0; i < el.allList.length; i++) {
                            let item2 =  this.common.copyObj(el.allList[i]);
                            item2.materialId = item2.materialId+"";
                            item2.stockMaterialDtlId = item2.dId;
                            let key = "";
                            key += item2.materialId === null ? '' : item2.materialId;
                            item2.batchNumList = el["batchNum" + key];

                            key += item2.batchNum === null ? '' : item2.batchNum;
                            item2.supplierBatchNumList = el["supplierBatchNum" + key];

                            key += item2.supplierBatchNum === null ? '' : item2.supplierBatchNum;
                            item2.asnList = el["asn" + key];

                            key += item2.asn === null ? '' : item2.asn;
                            item2.materialSpecsList = el["materialSpecsId" + key];

                            key += item2.materialSpecsId === null ? '' : item2.materialSpecsId;
                            item2.produceDateList = el["produceDate" + key];

                            key += item2.produceDate === null ? '' : item2.produceDate;
                            // item2.inDateList = el["inDate" + key];
                            //
                            // key += item2.inDate === null ? '' : item2.inDate;
                            item2.reservoirList = el["reservoirId" + key];

                            key += item2.reservoirId === null ? '' : item2.reservoirId;
                            item2.storageList = el["storageId" + key];
                            if(i==0){
                                that.stockList[index] = item2;
                            }else{
                                that.stockList.splice(index+i,0,item2);
                            }
                        }
                        // item.materialDesc = el.materialDesc;
                        // if (item.batchNumList.length === 0)
                        // {
                        //     let key = "batchNum";
                        //     key += item.materialId === null ? '' : item.materialId;
                        //     item.batchNumList = el[key];
                        // }
                        // //一条数据自动选择
                        // if (this.common.isNotBlank(item.batchNumList) && item.batchNumList.length === 1)
                        // {
                        //     item.batchNum = item.batchNumList[0].batchNum;
                        //     this.changeBatchNum(item, index, true);
                        // }
                        break;
                    }
                // });
                }
                // 数据过多时，使用滚动加载渲染
                if(that.stockList.length > 50){
                    that.stockListCache = that.common.copyObj(that.stockList);
                    that.stockList = that.stockListCache.splice(0,50);
                    this.initScroll();
                }
                this.$forceUpdate();
                this.common.shade.hide();
                clearTimeout(timer);
            },50)
        },

        oneButtonConfirm(){
            this.buttonConfirm = true;  //记录点击了一键确认
            this.buttonConfirmResetData = true;
            var index = 0;
            let that = this;
            let stockList = [...this.stockList,...this.stockListCache];
            stockList.forEach(el=>{
                el.inventoryNums = el.storeNums;
                el.inventoryBoxNums = el.boxNums;
                el.inventoryPalletNums = el.palletNums;
                that.changeInventoryNumsBase(el,index);
                index++;
            });
            this.$forceUpdate();
        },

        /**
         * 改变批次号
         * @param item
         * @param index
         * @param isAuto 是否自动调用
         */
        changeBatchNum(item, index, isAuto, e)
        {
            if(this.common.isNotBlank(e)) item.batchNum = e.currentTarget.value;
            //初始化一下批次号之外的属性属性
            this.initStockDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList);
            this.materialList.forEach(el => {
                if (el.materialId == item.materialId)
                {
                    if (item.supplierBatchNumList.length === 0)
                    {
                        let key = "supplierBatchNum";
                        key += item.materialId === null ? '' : item.materialId;
                        key += item.batchNum === null ? '' : item.batchNum;
                        item.supplierBatchNumList = el[key];
                    }
                    //一条数据自动选择
                    if (this.common.isNotBlank(item.supplierBatchNumList) && item.supplierBatchNumList.length === 1)
                    {
                        item.supplierBatchNum = item.supplierBatchNumList[0].supplierBatchNum;
                        this.changeSupplierBatchNum(item, index, true);
                    }
                }
            });
        },
        /**
         * 改变供应商批次号
         * @param item
         * @param index
         * @param isAuto 是否自动调用
         */
        changeSupplierBatchNum(item, index, isAuto, e)
        {
            if(this.common.isNotBlank(e)) item.supplierBatchNum = e.currentTarget.value;
            //初始化一下批次号之外的属性属性
            this.initStockDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList);
            this.materialList.forEach(el => {
                if (el.materialId == item.materialId)
                {
                    if (item.asnList.length === 0)
                    {
                        let key = "asn";
                        key += item.materialId === null ? '' : item.materialId;
                        key += item.batchNum === null ? '' : item.batchNum;
                        key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                        item.asnList = el[key];
                    }
                    //一条数据自动选择
                    if (this.common.isNotBlank(item.asnList) && item.asnList.length === 1)
                    {
                        item.asn = item.asnList[0].asn;
                        this.changeAsn(item, index, true);
                    }
                }
            });
        },

        /**
         * 改变ASN
         * @param item
         * @param index
         * @param isAuto 是否自动调用
         */
        changeAsn(item, index, isAuto, e)
        {
            if(this.common.isNotBlank(e)) item.asn = e.currentTarget.value;
            //初始化一下批次号之外的属性属性
            this.initStockDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
                item.asn, item.asnList);
            this.materialList.forEach(el => {
                if (el.materialId == item.materialId)
                {
                    if (item.materialSpecsList.length === 0)
                    {
                        let key = "materialSpecsId";
                        key += item.materialId === null ? '' : item.materialId;
                        key += item.batchNum === null ? '' : item.batchNum;
                        key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                        key += item.asn === null ? '' : item.asn;
                        item.materialSpecsList = el[key];
                    }
                    //一条数据自动选择
                    if (this.common.isNotBlank(item.materialSpecsList) && item.materialSpecsList.length === 1)
                    {
                        item.materialSpecsId = item.materialSpecsList[0].materialSpecsId;
                        this.changeMaterialSpecs(item, index, true);
                    }
                }
            });
        },

        /**
         * 改变规格
         * @param item
         * @param index
         */
        changeMaterialSpecs(item, index, isAuto, e)
        {
            if(this.common.isNotBlank(e)) item.specsName = e.currentTarget.value;
            this.initStockDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
                item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList);
            this.materialList.forEach(el => {
                if (el.materialId == item.materialId)
                {
                    if (item.produceDateList.length === 0)
                    {
                        let key = "produceDate";
                        key += item.materialId === null ? '' : item.materialId;
                        key += item.batchNum === null ? '' : item.batchNum;
                        key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                        key += item.asn === null ? '' : item.asn;
                        key += item.materialSpecsId === null ? '' : item.materialSpecsId;
                        item.produceDateList = el[key];
                    }
                    //一条数据自动选择
                    if (this.common.isNotBlank(item.produceDateList) && item.produceDateList.length === 1)
                    {
                        item.produceDate = item.produceDateList[0].produceDate;
                        this.changeProduceDate(item, index, true);
                    }
                }
            });
        },
        /**
         * 生产日期
         * @param item
         * @param index
         */
        changeProduceDate(item, index, isAuto, e)
        {
            if(this.common.isNotBlank(e)) item.produceDate = e.currentTarget.value;
            this.initStockDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
                item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList, item.produceDate, item.produceDateList);
            this.materialList.forEach(el => {
                if (el.materialId == item.materialId)
                {
                    if (item.reservoirList.length === 0)
                    {
                        let key = "reservoirId";
                        key += item.materialId === null ? '' : item.materialId;
                        key += item.batchNum === null ? '' : item.batchNum;
                        key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                        key += item.asn === null ? '' : item.asn;
                        key += item.materialSpecsId === null ? '' : item.materialSpecsId;
                        key += item.produceDate === null ? '' : item.produceDate;
                        item.reservoirList = el[key];
                    }
                    //一条数据自动选择
                    if (this.common.isNotBlank(item.reservoirList) && item.reservoirList.length === 1)
                    {
                        item.reservoirId = item.reservoirList[0].reservoirId;
                        this.changeReservoir(item, index, true);
                    }
                }
            });
        },
        /**
         * 入库时间
         * @param item
         * @param index
         */
        changeInDate(item, index, isAuto)
        {
            this.initStockDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
                item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList, item.produceDate, item.produceDateList, item.inDate, item.inDateList);
            this.materialList.forEach(el => {
                if (el.materialId == item.materialId)
                {
                    if (item.reservoirList.length === 0)
                    {
                        let key = "reservoirId";
                        key += item.materialId === null ? '' : item.materialId;
                        key += item.batchNum === null ? '' : item.batchNum;
                        key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                        key += item.asn === null ? '' : item.asn;
                        key += item.materialSpecsId === null ? '' : item.materialSpecsId;
                        key += item.produceDate === null ? '' : item.produceDate;
                        key += item.inDate === null ? '' : item.inDate;
                        item.reservoirList = el[key];
                    }
                    //一条数据自动选择
                    if (this.common.isNotBlank(item.reservoirList) && item.reservoirList.length === 1)
                    {
                        item.reservoirId = item.reservoirList[0].reservoirId;
                        this.changeReservoir(item, index, true);
                    }
                }
            });
        },
        /**
         * 原库区
         * @param item
         * @param index
         */
        changeReservoir(item, index, isAuto, e)
        {
            if(this.common.isNotBlank(e)) item.reservoirName = e.currentTarget.value;
            this.initStockDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
                item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList, item.produceDate, item.produceDateList, item.inDate, item.inDateList,
                item.unitName, item.reservoirId, item.reservoirList);
            this.materialList.forEach(el => {
                if (el.materialId == item.materialId)
                {
                    if (item.storageList.length === 0)
                    {
                        let key = "storageId";
                        key += item.materialId === null ? '' : item.materialId;
                        key += item.batchNum === null ? '' : item.batchNum;
                        key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                        key += item.asn === null ? '' : item.asn;
                        key += item.materialSpecsId === null ? '' : item.materialSpecsId;
                        key += item.produceDate === null ? '' : item.produceDate;
                        key += item.inDate === null ? '' : item.inDate;
                        key += item.reservoirId === null ? '' : item.reservoirId;
                        item.storageList = el[key];
                    }
                    //一条数据自动选择
                    if (this.common.isNotBlank(item.storageList) && item.storageList.length === 1)
                    {
                        item.storageId = item.storageList[0].storageId;
                        this.changeStorage(item, index, true);
                    }
                }
            });
        },
        /**
         * 原库位
         * @param item
         * @param index
         */
        changeStorage(item, index, isAuto, e)
        {
            if(this.common.isNotBlank(e)) item.storageCode = e.currentTarget.value;
            this.sureStore(item, index);
        },
        /**
         * 根据选择的数据确认唯一的库存
         * @param item
         * @param index
         */
        sureStore(item, index)
        {
            let value = null;
            this.materialList.forEach(el => {
                if (this.common.isBlank(value))
                {
                    let key = "STORE_PRE";
                    key += item.materialId === null ? '' : item.materialId;
                    key += item.batchNum === null ? '' : item.batchNum;
                    key += item.supplierBatchNum === null ? '' : item.supplierBatchNum;
                    key += item.asn === null ? '' : item.asn;
                    key += item.materialSpecsId === null ? '' : item.materialSpecsId;
                    key += item.produceDate === null ? '' : item.produceDate;
                    key += item.inDate === null ? '' : item.inDate;
                    key += item.reservoirId === null ? '' : item.reservoirId;
                    key += item.storageId === null ? '' : item.storageId;
                    value = el[key];
                }
            });
            //确定唯一的库存
            //找到赋值相关数据 没有找到就清空库存ID 保存根据dId是否确认唯一库存
            if (this.common.isNotBlank(value))
            {
                item.stockMaterialDtlId = value.dId;
                item.materialDesc = value.materialDesc;
                item.unit = value.unit;
                item.unitName = value.unitName;
                item.storeNums = value.storeNums;
                item.expectNums = value.expectNums;
                item.boxNums = value.boxNums;
                item.palletNums = value.palletNums;
                item.inventoryState = '';
                item.diffNums = '';
            }
            else
            {
                item.stockMaterialDtlId = null;
                item.materialDesc = this.common.isBlank(item.materialId) ? null : item.materialDesc;
                item.storeNums = null;
                item.expectNums = null;
                item.boxNums = null;
                item.palletNums = null;
                item.unitName = null;
                item.inventoryState = null;
                item.diffNums = null;
                item.inventoryNums = null;
                item.inventoryBoxNums = null;
                item.inventoryPalletNums = null;
            }
            this.$forceUpdate();
        },

        changeInventoryNums(e, item, index)
        {
            let target = e.currentTarget;
            item.inventoryNums = target.value;
            clearTimeout(this.inventoryTimer);
            let _this = this;
            this.inventoryTimer = setTimeout(() => {
                this.changeInventoryNumsBase(item,index);
                clearTimeout(_this.inventoryTimer);
            }, 300);

        },
        changeInventoryNumsBase(item, index)
        {
            let _this = this;
            let storeNums = _this.common.isBlank(item.storeNums) ? 0 : item.storeNums;
            let inventoryNums = _this.common.isBlank(item.inventoryNums) ? 0 : item.inventoryNums;
            if (storeNums == inventoryNums)
            {
                item.diffNums = 0;
                item.inventoryState = '0';
            }
            else if (storeNums > inventoryNums)
            {
                item.diffNums = storeNums - inventoryNums;
                item.inventoryState = '2';
            }
            else
            {
                item.diffNums = inventoryNums - storeNums;
                item.inventoryState = '1';
            }
            this.$forceUpdate();
            this.setDomValue(item, index);
        },
        setDomValue(item, index)
        {
            let diffNumsDom = document.getElementById(['diffNumsDom'+index]);
            let inventoryStateDom = document.getElementById(['inventoryState'+index]);
            if(diffNumsDom && inventoryStateDom){
                if(this.buttonConfirmResetData){
                    diffNumsDom.innerText = item.diffNums;
                    inventoryStateDom.value = item.inventoryState;
                }else{
                    diffNumsDom.innerText = diffNumsDom.innerText?item.diffNums:diffNumsDom.innerText;
                    inventoryStateDom.value = inventoryStateDom.value?item.inventoryState:inventoryStateDom.value;
                }
                this.$forceUpdate();
            }
        },

        // 输入赋值
        changeValue(e, item, code){
            item[code] = e.currentTarget.value;
        },
        /**
         * 添加
         */
        add()
        {
            this.stockList.push(this.initStockData());
        },
        /**
         * 移除
         * @param index
         */
        remove(index)
        {
            if (this.stockList.length > 1)
                this.stockList.splice(index, 1);
        },
        async inventoryWmsStock()
        {
            let stockList = [...this.stockList,...this.stockListCache]
            if (this.common.isBlank(this.info.inventoryUserId))
            {
                this.$message.error("盘点人不能为空！");
                return false;
            }
            if (this.common.isBlank(this.info.inventoryDate))
            {
                this.$message.error("盘点日期不能为空！");
                return false;
            }
            if (stockList.length === 0)
            {
                this.$message.error("盘点明细不能为空！");
                return false;
            }
            //追加重复判断处理
            const map = new Map();
            for (let i = 0; i < stockList.length; i++) {
                let item = stockList[i];
                let id = item.stockMaterialDtlId;
                if (this.common.isBlank(id) || id < 0)
                {
                    this.$message.error("第" + (i + 1) + "行库存未选择错误！");
                    return false;
                }
                if (this.common.isBlank(item.inventoryNums))
                {
                    this.$message.error("第" + (i + 1) + "行库存盘点数量未填写！");
                    return false;
                }
                if (this.common.isBlank(item.inventoryState))
                {
                    item.inventoryState = (item.inventoryState > item.storeNums) ? 1 : (item.inventoryState == item.storeNums) ? 0 : 2;
                }

                if(map.get(id)){
                    this.$message.error("第" + map.get(id) + "行数据跟第"+ (i + 1) +"数据重复!");
                    return false;
                }
                map.set(id, i + 1);
            }
            let param = this.common.copyObj(this.info);
            param.list = stockList;
            await this.common.postUrl("wmsStockInventoryService", "inventoryWmsStock", param);
            this.$message.success('操作成功!');
            this.closePage();
        },
        async saveOrUpdateWmsStockInventory()
        {
            let stockList = [...this.stockList,...this.stockListCache]
            if (this.common.isBlank(this.info.inventoryUserId))
            {
                this.$message.error("盘点人不能为空！");
                return false;
            }
            if (this.common.isBlank(this.info.inventoryDate))
            {
                this.$message.error("盘点日期不能为空！");
                return false;
            }
            if (stockList.length === 0)
            {
                this.$message.error("盘点明细不能为空！");
                return false;
            }
            //追加重复判断处理
            const map = new Map();
            for (let i = 0; i < stockList.length; i++) {
                let item = stockList[i];
                let id = item.stockMaterialDtlId;
                if (this.common.isBlank(id) || id < 0)
                {
                    this.$message.error("第" + (i + 1) + "行库存未选择错误！");
                    return false;
                }
                if (this.common.isBlank(item.inventoryNums))
                {
                    this.$message.error("第" + (i + 1) + "行库存盘点数量未填写！");
                    return false;
                }
                if (this.common.isBlank(item.inventoryState))
                {
                    item.inventoryState = (item.inventoryState > item.storeNums) ? 1 : (item.inventoryState == item.storeNums) ? 0 : 2;
                }

                if(map.get(id)){
                    this.$message.error("第" + map.get(id) + "行数据跟第"+ (i + 1) +"数据重复!");
                    return false;
                }
                map.set(id, i + 1);
            }
            let param = this.common.copyObj(this.info);
            param.list = stockList;
            await this.common.postUrl("wmsStockInventoryService", "saveOrUpdateWmsStockInventory", param);
            this.$message.success('操作成功!');
            this.closePage();
        },
        downloadExcelFile(){
            let array = [
                {name:"物料编码",code:"materialNum"},
                {name:"物料描述",code:"materialDesc"},
                {name:"批次号",code:"batchNum"},
                {name:"供应商批次号",code:"supplierBatchNum"},
                {name:"ASN",code:"asn"},
                {name:"规格",code:"specsName"},
                {name:"生产日期",code:"produceDate"},
                {name:"库区",code:"reservoirName"},
                {name:"库位",code:"storageCode"},
                {name:"管理单位",code:"unitName"},
                {name:"库存数量",code:"storeNums"},
                {name:"预占数量",code:"expectNums"},
                {name:"库存箱数",code:"boxNums"},
                {name:"库存托数",code:"palletNums"},
                {name:"库存数量差异",code:"diffNums"},
                {name:"盘点数量",code:"inventoryNums"},
                {name:"盘点箱数",code:"inventoryBoxNums"},
                {name:"盘点托数",code:"inventoryPalletNums"},
                {name:"盘盈盘亏",code:"inventoryStateName"},
                {name:"备注",code:"remark"},
            ]
            let data = this.common.copyObj(this.stockList);
            data.forEach(item => {
                array.forEach(item2 => {
                    if (item[item2.code] === 0)
                    {
                        item[item2.code] = "0";
                    }
                });
                this.inventoryStateData.forEach(item3 => {
                    if (item.inventoryState == item3.codeValue)
                        item.inventoryStateName = item3.codeName;
                    else if (item.inventoryState == item3.codeValue)
                        item.inventoryStateName = item3.codeName;
                    else if (item.inventoryState == item3.codeValue)
                        item.inventoryStateName = item3.codeName;
                });
            });
            this.common.frontDownloadExcelFile('盘点信息', array, data)
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        }
    },
}
