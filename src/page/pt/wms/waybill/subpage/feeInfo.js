import enumData from "@/page/pt/enum";
import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: 'wmsFeeInfo',
    props: {
        type: Number,//默认是1就是新增修改，2是新版的确认送达
        isReturn: Number,
    },
    data()
    {
        return {
            feeInfo: {totalFee: 0},
            totalInfo: {
                num: 0,
                returnNums:0,
                totalNum:0,
                totalFee: 0,
                totalFeeWithTax: 0,
            },
            feeList: [],
            isShowDialog:false,
            feeHead: [
                {"name": "货主", "code": "srcTenantName", "width": "200"},
                {"name": "费用项目名称", "code": "itemName", "width": "150"},
                {"name": "单位", "code": "unit", "width": "120"},
                {"name": "不含税单价", "code": "price", "width": "120"},
                {"name": "税率", "code": "tax", "width": "100"},
                {"name": "含税价", "code": "priceWithTax", "width": "100"},
                {"name": "不含税金额", "code": "totalFee", "width": "100"},
                {"name": "含税金额", "code": "totalFeeWithTax", "width": "130"}
            ],
            feeListSrc:[],
            feeListDest:[],
            disableIds:[],
            ableIds:[],
            id: this.$route.query.id,
            show: false,
        }
    },
    mounted()
    {
    },
    components: {dbTable},
    methods: {
        async init(data)
        {
            let srcTenantIds = [];
            let materialIds = [];
            let workIds = [];
            data.forEach(item => {
                srcTenantIds.push(item.srcTenantId);
                materialIds.push(item.materialId);
                workIds.push(item.workId);
            })
            let feeList = await this.common.postUrl("wmsWaybillService", "getDeliverySaleFeeList", {srcTenantIds,materialIds,workIds});
            this.feeList = [];//next 赋值orderStock palletNums2 会出发调用
            this.feeListSrc = this.common.copyObj(feeList);
            //初始化的时候只处理默认的，且只处理车长跟车型对的上的
            for (let i = 0; i < feeList.length; i++)
            {
                let item = feeList[i];
                if(item.itemType=='104'){
                    continue;
                }
                if (item.isDefault == 1)
                {
                    this.ableIds.push(item.onlyId);
                    this.feeList.push(item);
                }
                else
                {
                    this.disableIds.push(item.onlyId);
                }
            }
            this.feeListDest = this.common.copyObj(this.feeList);

            await this.initFeeNum(data);

            this.calFeeTotal();
            this.$forceUpdate();
        },
        async changeFeeList(waybillInfoData) {
            let data = this.$parent.getAllOrderStock();
            if (this.feeListSrc.length === 0)
            {
                let srcTenantIds = [];
                let materialIds = [];
                let workIds = [];
                data.forEach(item => {
                    srcTenantIds.push(item.srcTenantId);
                    materialIds.push(item.materialId);
                    workIds.push(item.workId);
                })
                this.feeListSrc = await this.common.postUrl("wmsWaybillService", "getDeliverySaleFeeList", {srcTenantIds,materialIds,workIds});
            }
            if(this.feeListSrc.length>0){
                if(this.common.isNotBlank(waybillInfoData.quoteVehicleType)&&this.common.isNotBlank(waybillInfoData.vehicleLength)){
                    let feeListSet = new Set();
                    for (let i = 0; i < this.feeListSrc.length; i++)
                    {
                        let item = this.feeListSrc[i];
                        if(item.itemType!='104'){
                            continue;
                        }
                        if((this.common.isBlank(item.quoteVehicleType)||item.quoteVehicleType==waybillInfoData.quoteVehicleType)
                            &&(this.common.isBlank(item.vehicleLength)||item.vehicleLength==waybillInfoData.vehicleLength)
                            &&waybillInfoData.isReturn==item.subItemType-9
                            &&waybillInfoData.isUrgent == item.urgent){//往返判断
                            var flag = true;
                            for (let j = 0; j < this.feeList.length; j++) {
                                if(this.feeList[j].onlyId==item.onlyId){
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag){
                                this.feeList.push(item);
                            }
                            feeListSet.add(item.onlyId);
                        }
                    }
                    for (let i = 0; i < this.feeList.length; i++) {
                        let item = this.feeList[i];
                        if(item.itemType!='104'){
                            continue;
                        }
                        if(!feeListSet.has(item.onlyId)){
                            this.feeList.splice(i, 1);
                            i--;
                        }
                    }

                }else{
                    for (let i = 0; i < this.feeList.length; i++) {
                        let item = this.feeList[i];
                        if(item.itemType!='104'){
                            continue;
                        }
                        this.feeList.splice(i, 1);
                        i--;
                    }
                }
                this.feeListDest = this.common.copyObj(this.feeList);
            }
            await this.initFeeNum(data);
            this.calFeeTotal();
            this.$forceUpdate();
            return this.feeList;
        },
        getItemNum(specsType,unit,data){
            let realNums = 0;
            for (let i = 0; i < data.length; i++) {
                let materialSpecsType =  data[i].srcTenantId+"_"+data[i].specsType;
                if(materialSpecsType==specsType){
                    if(data[i].unit!=unit){
                        this.$message.error("物料:"+data[i].materialNum+"对应的管理单位不一致");
                        return -1;
                    }
                    if(data[i].unit==unit){
                        realNums = this.common.accAdd(realNums,data[i].nums2);
                    }
                }
            }
            return realNums;
        },
        async initData(feeList,dataList)
        {
            this.show = this.id > 0;
            let srcTenantIds = [];
            let materialIds = [];
            let workIds = [];
            dataList.forEach(item => {
                if (item.srcTenantId > 0)
                {
                    srcTenantIds.push(item.srcTenantId);
                }
                if (item.materialId > 0)
                {
                    materialIds.push(item.materialId);
                }
                workIds.push(item.workId);
            });
            let data = await this.common.postUrl("wmsWaybillService", "getDeliverySaleFeeList", {srcTenantIds,materialIds,workIds});
            let maxOnlyId = 0;
            this.feeListSrc = [];
            data.forEach(item => {
                feeList.forEach(fee => {
                    if(this.common.isNotBlank(fee.quoteDetailId)){
                        if(item.quoteDetailId == fee.quoteDetailId){
                            fee.onlyId = item.onlyId;
                        }
                    }else{
                        if (fee.custTenantId == item.custTenantId
                            && fee.itemId == item.itemId
                            && fee.itemType == item.itemType
                            && fee.quoteId == item.quoteId
                            && fee.srcTenantId == item.srcTenantId){
                            fee.onlyId = item.onlyId;
                        }
                    }
                });
                maxOnlyId = Math.max(item.onlyId, maxOnlyId);
                this.feeListSrc.push(item);
            });
            for (let i = 0; i < feeList.length; i++)
            {
                let item = feeList[i];
                if (!item.onlyId || item.onlyId <= 0)
                {
                    item.onlyId = maxOnlyId + i + 1;
                    this.feeListSrc.push(item);
                }
            }
            this.feeListDest = this.common.copyObj(feeList);
            this.feeList = feeList;
            this.calFeeTotal();
            this.$forceUpdate();
        },
        getData()
        {
            return this.feeList;
        },
        changeItemNum() {
            this.calFeeTotal();
            this.$nextTick(() => {
                this.$parent.calcProfit();
            })
        },
        changeFeeItemReturnNums() {
            this.calFeeTotal();
            this.$nextTick(() => {
                this.$parent.calcProfit();
            })
        },
        /**
         * 费用计算
         */
        calFeeTotal(){
            this.totalInfo.num = 0;
            this.totalInfo.returnNums=0;
            this.totalInfo.totalNum=0;
            this.totalInfo.totalFee = 0;
            this.totalInfo.totalFeeWithTax = 0;
            for (let i = 0; i < this.feeList.length; i++) {
                let item = this.feeList[i];
                item.totalNum = this.common.accAdd(item.num, item.returnNums);
                item.totalFeeWithTax= this.common.accMul(item.priceWithTax,item.totalNum);
                let tax = this.common.accDiv(item.tax,100);
                tax = this.common.accAdd(1,tax);
                let fee = this.common.accDiv(item.totalFeeWithTax,tax).toFixed(4);
                item.totalFee = Number(fee);
                this.totalInfo.num = this.common.accAdd(this.totalInfo.num,this.feeList[i].num);
                this.totalInfo.returnNums = this.common.accAdd(this.totalInfo.returnNums,this.feeList[i].returnNums);
                this.totalInfo.totalNum = this.common.accAdd(this.totalInfo.totalNum,this.feeList[i].totalNum);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,this.feeList[i].totalFee);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax,this.feeList[i].totalFeeWithTax);
            }
        },
        getDisableIds()
        {
            return this.disableIds;
        },
        getAbleIds()
        {
            return this.ableIds;
        },
        /**
         * 费用是否默认
         * @param item
         */
        changeDefaultSwitch(item, index) {
            let msg = `
                    <p style="text-align:center;">您即将选择：<em>否</em></p>
                    <p style="text-align:center;">选择后出库系统不会自动带出该费用</p>
                    <p style="text-align:center;">如果需要系统自动带出请在《选择收入》选择该费用参与保存即可，是否继续?</p>
                    `;
            this.$confirm( msg, "提示",{
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                dangerouslyUseHTMLString: true,
            }).then(async () =>{
                this.feeList.splice(index, 1);
                this.feeListDest = this.common.copyObj(this.feeList);
                this.disableIds.push(item.onlyId);
                for (let j = 0; j < this.ableIds.length; j++)
                {
                    let onlyId = this.ableIds[j];
                    if (onlyId == item.onlyId)
                    {
                        this.ableIds.splice(j, 1);
                        j--;
                    }
                }
                this.totalInfo.num = 0;
                this.totalInfo.totalFee = 0;
                this.totalInfo.totalFeeWithTax = 0;
                this.$forceUpdate();
            }).catch();
        },
        open(){
            this.isShowDialog = true;
            this.$nextTick(async ()=>{
                this.$refs.dbTable.setRightData(this.common.copyObj(this.feeListDest));
                this.$refs.dbTable.setLeftData(this.common.copyObj(this.feeListSrc));
            })
        },
        async saveChangeFeeItem()
        {
            let selectItem = this.$refs.dbTable.getRightData();
            this.feeList = [];
            this.ableIds = [];
            this.disableIds = [];
            let set = new Set();
            for (let i = 0; i < selectItem.length; i++)
            {
                let item = selectItem[i];
                item.isDefault = 1;
                this.feeList.push(item);
                set.add(item.onlyId);
            }
            this.feeListDest = this.common.copyObj(this.feeList);
            set.forEach(item => this.ableIds.push(item));
            for (let i = 0; i < this.feeListSrc.length; i++)
            {
                if (!set.has(this.feeListSrc[i].onlyId))
                    this.disableIds.push(this.feeListSrc[i].onlyId);
            }
            this.isShowDialog = false;
            this.totalInfo.num = 0;
            this.totalInfo.totalFee = 0;
            this.totalInfo.totalFeeWithTax = 0;

            let data = this.$parent.getAllOrderStock();
            await this.initFeeNum(data);
            this.$parent.dealCostData();
            this.calFeeTotal();
            this.$forceUpdate();
        },
        async initFeeNum(data,returnNums=0){
            let specsTypeMap=new Map();
            let noUsedSpecsTypeSet=new Set();
            for (let i = 0; i < data.length; i++) {
                let specsType = data[i].srcTenantId+"_"+data[i].specsType;
                if(noUsedSpecsTypeSet.has(specsType)){
                    let realNums = specsTypeMap.get(specsType+"nums2");
                    let realBoxNums = specsTypeMap.get(specsType+"boxNums2");
                    let realPalletNums = specsTypeMap.get(specsType+"palletNums2");
                    // specsTypeMap.set(specsType+"nums",this.common.accAdd(realNums,data[i].nums));
                    // specsTypeMap.set(specsType+"boxNums",this.common.accAdd(realBoxNums,data[i].boxNums));

                    specsTypeMap.set(specsType+"nums2",this.common.accAdd(realNums,data[i].nums2));
                    specsTypeMap.set(specsType+"boxNums2",this.common.accAdd(realBoxNums,data[i].boxNums2));
                    specsTypeMap.set(specsType+"palletNums2",this.common.accAdd(realPalletNums,data[i].palletNums2));
                }else{
                    // specsTypeMap.set(specsType+"nums",data[i].nums);
                    // specsTypeMap.set(specsType+"boxNums",data[i].boxNums);
                    specsTypeMap.set(specsType+"nums2",data[i].nums2);
                    specsTypeMap.set(specsType+"boxNums2",data[i].boxNums2);
                    specsTypeMap.set(specsType+"palletNums2",data[i].palletNums2);
                    noUsedSpecsTypeSet.add(specsType);
                }
            }

            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];
                let specsType = item.srcTenantId+"_"+item.specsType;
                noUsedSpecsTypeSet.delete(specsType);

                if (item.itemType == 104)//产品说配送的才有返程数量、最终之类的没有
                {
                    item.returnNums = returnNums;
                }
                else
                {
                    item.returnNums = 0;
                }

                if (String(item.unit).indexOf('托') >= 0)
                {
                    item.num = specsTypeMap.get(specsType+"palletNums2");
                }
                else if (String(item.unit).indexOf('箱') >= 0)
                {
                    item.num = specsTypeMap.get(specsType+"boxNums2");
                }
                else if (String(item.unit).indexOf('车') >= 0)
                {
                    item.num = 1;
                    item.disabled=true;
                }
                else
                {
                    if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('吨')>=0){
                        let realNums = 0;
                        for (let i = 0; i < data.length; i++) {
                            let materialSpecsType = data[i].srcTenantId+"_"+data[i].specsType;
                            if(materialSpecsType==specsType){
                                if(data[i].unit!=6&&data[i].unit!=3){
                                    this.$message.error("物料:"+data[i].materialNum+"对应的管理单位不一致");
                                    return;
                                }
                                if(data[i].unit==6){
                                    realNums = this.common.accAdd(realNums,data[i].nums2);
                                }else{
                                    let tRealNums =this.common.accDiv(data[i].nums2,1000);
                                    realNums = this.common.accAdd(realNums,tRealNums);
                                }
                            }
                        }
                        item.num = realNums;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('件')>=0){
                        let itemNum = this.getItemNum(specsType,5,data);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('平方')>=0){
                        let itemNum = this.getItemNum(specsType,2,data);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('个')>=0){
                        let itemNum = this.getItemNum(specsType,1,data);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else{
                        item.num = specsTypeMap.get(specsType+"nums2");
                    }
                }
            }

            if(noUsedSpecsTypeSet.size>0&&this.feeList.length>0){
                let str = ",";
                for (let i = 0; i < data.length; i++) {
                    let specsType = data[i].srcTenantId+"_"+data[i].specsType;
                    if(noUsedSpecsTypeSet.has(specsType)){
                        str += data[i].materialNum;
                    }
                }
                this.$message.error("物料:"+str.substring(1)+"对应的计费项目不存在，请手工调整费用数量");
                return;
            }
            this.$forceUpdate();
        },
        setNum(num)
        {
            if (this.common.isNotBlank(this.feeList) && this.feeList.length > 0)
            {
                this.feeList.forEach(item => {
                    item.num = num;
                });
            }
            this.calFeeTotal();
            this.$forceUpdate();
        }

    },
}
