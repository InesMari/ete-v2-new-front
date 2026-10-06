import dbTable from "@/components/dbTable/dbTable.vue"
import mycity from '@/components/mycity/mycity.vue'
import enumData from "@/page/pt/enum";

export default {
    name: 'addSupplierQuoteLD',
    data() {
        return {
            loadParam: {},
            quoteInfo: {},
            provinceData: [],
            cityData: [],
            districtData: [],
            checkAll: false,
            checkedCities: [],
            checkedCitieIds: [],
            isIndeterminate: true,
            showBeginWork: true,
            showEndWork: true,
            showEndDistrict: false,
            workData: [],
            quoteFeeData: [{beginPickupWeight:0,beginPickupVolume:0,beginDeliveryWeight:0,beginDeliveryVolume:0,beginFreightWeight:0,beginFreightVolume:0}],
            redio1: '作业点',
            redio2: '作业点',
            head:[
                {name:"作业点名称",code:"workName"},
                {name:"作业点地址",code:"workAddressStr"},
            ],
            supplierData:[],//供应商
            specifyTenantData:[],//指定客户
            leftDataLength:0,
            rightDataLength:0,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        mycity,
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery() {
            await this.$refs.table.load("workGoodsTF", "queryWorkStorehouseData", this.loadParam);
            this.leftDataLength = this.$refs.table.getLeftData().length;
            this.rightDataLength = this.$refs.table.getRigthData().length;
        },
        init() {
            this.loadParam.tenantId = this.$route.query.tenantId;
            //加载静态枚举
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectProvince", {}, function (data) {
                that.provinceData = data;
            });
            //起始点下拉
            this.common.postUrl("workGoodsTF", "queryWorkStorehouseDataNoPage", {}, function (data) {
                that.workData = data;
            });
            //供应商
            this.common.postUrl("supplierTF", "queryAllSupplierList", {supplierType:2}, function (data) {
                that.supplierData = data;
                that.quoteInfo.tenantId = that.supplierData[0].tenantId;
            });
            //指定客户
            this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
                that.specifyTenantData = data;
            });
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        /** 选中指定客户 */
        async changeSpecifyTenant() {
            let that = this;
            //加载作业点信息
            await this.common.postUrl("workGoodsTF", "queryWorkStorehouseDataNoPage", {tenantId:this.quoteInfo.specifyTenantId}, function (data) {
                that.workData = data;
            });
            //加载双表格作业点信息
            this.loadParam.tenantId = this.quoteInfo.specifyTenantId;
            await this.doQuery();
        },
        // 表格数据切换后的交互
        dataChange(leftData,rightData){
            this.leftDataLength = leftData.length;
            this.rightDataLength =rightData.length;
        },
        /** 选中省份 */
        changeProvinceSelect() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectCity", {provinceId: this.quoteInfo.endProvinceId}, function (data) {
                that.cityData = data;
                if(data.length==1){
                    that.quoteInfo.endCityId = data[0].id;
                    that.changeCitySelect();
                }
            });
        },
        /** 选中城市 */
        changeCitySelect() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectDistrict", {cityId: this.quoteInfo.endCityId}, function (data) {
                that.districtData = data;
                that.showEndDistrict = true;
            });
        },
        /** 全选区县 */
        handleCheckAllChange(val) {
            if(val){
                let tempData = [];
                this.checkedCitieIds = [];
                for (let i = 0; i < this.districtData.length; i++) {
                    tempData.push(this.districtData[i].name);
                    this.checkedCitieIds.push(this.districtData[i].id);
                }
                this.checkedCities = tempData;
            }else{
                this.checkedCities = [];
                this.checkedCitieIds = [];
            }
            this.isIndeterminate = false;
        },
        /** 是否全选区县 */
        handleCheckedCitiesChange(value) {
            this.checkedCitieIds = [];
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < this.districtData.length; j++) {
                    if(value[i]==this.districtData[j].name){
                        this.checkedCitieIds.push(this.districtData[j].id);
                        break;
                    }
                }
            }
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.districtData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.districtData.length;
        },
        /** 选中作业点 */
        changeWorkSelect(data) {
            for (let i = 0; i < this.workData.length; i++) {
                let work = this.workData[i];
                if(data==work.workId){
                    this.quoteInfo.beginProvinceId = work.provinceId;
                    this.quoteInfo.beginCityId = work.cityId;
                    this.quoteInfo.beginDistrictId = work.districtId;
                    break;
                }
            }
        },
        /** 保存报价信息 */
        addQuote() {
            //基本信息
            if(this.common.isBlank(this.quoteInfo.tenantId) || this.quoteInfo.tenantId<0){
                this.$message.error("请选择供应商！");
                return;
            }
            if(this.common.isBlank(this.quoteInfo.transportTimeliness)){
                this.$message.error("请输入运输时效！");
                return;
            }
            //起始地
            if(this.redio1=='作业点'){
                if(this.common.isBlank(this.quoteInfo.beginWorkId) || this.quoteInfo.beginWorkId<0){
                    this.$message.error("请选择起始地作业点！");
                    return;
                }
            }else if(this.redio1=='省市区'){
                this.quoteInfo.beginProvinceId = this.$refs.quoteCity.chooseProvinceId;
                this.quoteInfo.beginCityId = this.$refs.quoteCity.chooseCityId;
                this.quoteInfo.beginDistrictId = this.$refs.quoteCity.chooseDistrictId;
                this.quoteInfo.beginWorkId = '';
            }
            if(this.common.isBlank(this.quoteInfo.beginProvinceId) || this.quoteInfo.beginProvinceId<0
                || this.common.isBlank(this.quoteInfo.beginCityId) || this.quoteInfo.beginCityId<0){
                this.$message.error("请选择起始地"+this.redio1+"！");
                return;
            }
            //目的地
            let endSectionData = [];
            if(this.redio2=='作业点'){
                let data = this.$refs.table.getRightData();
                if(data.length==0){
                    this.$message.error("请选择目的地作业点！");
                    return;
                }
                endSectionData = data;
            }else if(this.redio2=='省市区'){
                if(this.common.isBlank(this.quoteInfo.endProvinceId) || this.quoteInfo.endProvinceId<0
                    || this.common.isBlank(this.quoteInfo.endCityId) || this.quoteInfo.endCityId<0){
                    this.$message.error("请选择目的地"+this.redio2+"！");
                    return;
                }
                for (let i = 0; i < this.checkedCitieIds.length; i++) {
                    endSectionData.push({provinceId:this.quoteInfo.endProvinceId,cityId:this.quoteInfo.endCityId,districtId:this.checkedCitieIds[i]});
                }
                //全选区县默认也是到省市
                if(this.districtData.length==this.checkedCitieIds.length){
                    endSectionData = [];
                    endSectionData.push({provinceId:this.quoteInfo.endProvinceId,cityId:this.quoteInfo.endCityId});
                }//放开起始地和目的地区域的限制，没有选择区默认到省市
                else if(this.checkedCitieIds.length==0){
                    endSectionData.push({provinceId:this.quoteInfo.endProvinceId,cityId:this.quoteInfo.endCityId});
                }
            }
            this.quoteInfo.endSectionData = JSON.stringify(endSectionData);
            //报价信息
            if(this.quoteFeeData.length==0){
                this.$message.error("请输入报价信息！");
                return;
            }
            //零担运输报价-价格都为空值时不能直接提交保存
            if(this.common.isBlank(this.quoteFeeData[0].pickupNetWeightFee) && this.common.isBlank(this.quoteFeeData[0].pickupGrossWeightFee) && this.common.isBlank(this.quoteFeeData[0].pickupVolumeFee)
                && this.common.isBlank(this.quoteFeeData[0].deliveryNetWeightFee) && this.common.isBlank(this.quoteFeeData[0].deliveryGrossWeightFee) && this.common.isBlank(this.quoteFeeData[0].deliveryVolumeFee)
                && this.common.isBlank(this.quoteFeeData[0].freightNetWeightFee) && this.common.isBlank(this.quoteFeeData[0].freightGrossWeightFee) && this.common.isBlank(this.quoteFeeData[0].freightVolumeFee)){
                this.$message.error("请输入报价信息！");
                return;
            }
            //最终价格可以不填
            for (let i = 0; i < this.quoteFeeData.length; i++) {
                if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupWeight) && this.common.isNotBlank(this.quoteFeeData[i].endPickupWeight)
                && this.common.isBlank(this.quoteFeeData[i].pickupNetWeightFee) && this.common.isBlank(this.quoteFeeData[i].pickupGrossWeightFee)){
                    this.$message.error("请输入第"+(i+1)+"行提货费/按重量 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupWeight) && this.common.isBlank(this.quoteFeeData[i].pickupNetWeightFee)){
                //     this.$message.error("请输入第"+(i+1)+"行提货费/按重量 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupVolume) && this.common.isNotBlank(this.quoteFeeData[i].endPickupVolume)
                    && this.common.isBlank(this.quoteFeeData[i].pickupVolumeFee)){
                    this.$message.error("请输入第"+(i+1)+"行提货费/按体积 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupVolume) && this.common.isBlank(this.quoteFeeData[i].pickupVolumeFee)){
                //     this.$message.error("请输入第"+(i+1)+"行提货费/按体积 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryWeight) && this.common.isNotBlank(this.quoteFeeData[i].endDeliveryWeight)
                    && this.common.isBlank(this.quoteFeeData[i].deliveryNetWeightFee) && this.common.isBlank(this.quoteFeeData[i].deliveryGrossWeightFee)){
                    this.$message.error("请输入第"+(i+1)+"行送货费/按重量 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryWeight) && this.common.isBlank(this.quoteFeeData[i].deliveryNetWeightFee)){
                //     this.$message.error("请输入第"+(i+1)+"行送货费/按重量 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryVolume) && this.common.isNotBlank(this.quoteFeeData[i].endDeliveryVolume)
                    && this.common.isBlank(this.quoteFeeData[i].deliveryVolumeFee)){
                    this.$message.error("请输入第"+(i+1)+"行送货费/按体积 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryVolume) && this.common.isBlank(this.quoteFeeData[i].deliveryVolumeFee)){
                //     this.$message.error("请输入第"+(i+1)+"行送货费/按体积 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightWeight) && this.common.isNotBlank(this.quoteFeeData[i].endFreightWeight)
                    && this.common.isBlank(this.quoteFeeData[i].freightNetWeightFee) && this.common.isBlank(this.quoteFeeData[i].freightGrossWeightFee)){
                    this.$message.error("请输入第"+(i+1)+"行运费/按重量 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightWeight) && this.common.isBlank(this.quoteFeeData[i].freightNetWeightFee)){
                //     this.$message.error("请输入第"+(i+1)+"行运费/按重量 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightVolume) && this.common.isNotBlank(this.quoteFeeData[i].endFreightVolume)
                    && this.common.isBlank(this.quoteFeeData[i].freightVolumeFee)){
                    this.$message.error("请输入第"+(i+1)+"行运费/按体积 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightVolume) && this.common.isBlank(this.quoteFeeData[i].freightVolumeFee)){
                //     this.$message.error("请输入第"+(i+1)+"行运费/按体积 最终价格！");
                //     return;
                // }
            }
            this.quoteInfo.priceData = JSON.stringify(this.quoteFeeData);
            this.quoteInfo.quoteType = 2;
            let that = this;
            this.common.postUrl("quoteTF", "addQuoteInfo", this.quoteInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.$message.success("保存成功！");
                    that.close();
                }
            },null,'',true);
        },
        /** 关闭页面 回父页面刷新 */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        /** 切换单选框 */
        changeRedio1() {
            if(this.redio1=='作业点'){
                this.redio1=='省市区';
                this.showBeginWork = true;
            }else{
                this.redio1=='作业点';
                this.showBeginWork = false;
            }
        },
        /** 切换单选框 */
        changeRedio2() {
            if(this.redio2=='作业点'){
                this.redio2=='省市区';
                this.showEndWork = true;
            }else{
                this.redio2=='作业点';
                this.showEndWork = false;
            }
        },
        /** 修改终止距离 */
        changeFeeInput(type,endPickup,index) {
            let quoteFee = this.quoteFeeData[index];
            let quoteFee_ = this.quoteFeeData[index+1];
            let mes = "beginPickupWeight";
            switch(type){
                case 2 : mes = "beginPickupVolume"
                    break;
                case 3 : mes = "beginDeliveryWeight"
                    break;
                case 4 : mes = "beginDeliveryVolume"
                    break;
                case 5 : mes = "beginFreightWeight"
                    break;
                case 6 : mes = "beginFreightVolume"
                    break;
                default : mes = "beginPickupWeight"
            }
            let beginPickup = eval("quoteFee."+mes);
            let beginPickup_;//下一行的起始范围
            let endPickup_;//下一行的终止范围
            let mes_ = mes.substring(5);
            if(this.common.isNotBlank(quoteFee_)){
                beginPickup_ = eval("quoteFee_."+mes);
                endPickup_ = eval("quoteFee_.end"+mes_);
            }
            if((this.common.isBlank(beginPickup) ||
                (this.common.isNotBlank(beginPickup) && this.common.isNotBlank(endPickup) && Number(beginPickup)>=Number(endPickup)))){
                if(this.common.isNotBlank(beginPickup_)){//如果当前行的终止范围小于下一行(下一行起始范围不为空)的起始范围，当前行的终止范围补全下一行的起始范围
                    eval("quoteFee.end"+mes_+"=beginPickup_");
                    return;
                }
                eval("quoteFee.end"+mes_+"=''");//如果当前行起始范围空，或者当前行起始范围大于终止范围，撤回操作补全空
                return;
            }
            if(this.common.isNotBlank(quoteFee_) && this.common.isNotBlank(beginPickup_)
                && this.common.isNotBlank(endPickup_) && this.common.isBlank(endPickup)){//删除报价必须从当前费用 最后一行开始删除，否则补全原来数值
                eval("quoteFee.end"+mes_+"=quoteFee_."+mes);
                return;
            }
            eval("if(this.quoteFeeData.length==index+1 && this.common.isNotBlank(quoteFee."+mes+") " +
                "&& this.common.isNotBlank(endPickup)){this.quoteFeeData.push({"+mes+":endPickup});}" +
                "else if(this.quoteFeeData.length>index+1){quoteFee_."+mes+" = endPickup;}");
            //如果下一行全部空 删除此行
            if(this.common.isNotBlank(quoteFee_) && this.common.isBlank(quoteFee_.beginPickupWeight) && this.common.isBlank(quoteFee_.endPickupWeight)
                && this.common.isBlank(quoteFee_.beginPickupVolume) && this.common.isBlank(quoteFee_.endPickupVolume)
                && this.common.isBlank(quoteFee_.beginDeliveryWeight) && this.common.isBlank(quoteFee_.endDeliveryWeight)
                && this.common.isBlank(quoteFee_.beginDeliveryVolume) && this.common.isBlank(quoteFee_.endDeliveryVolume)
                && this.common.isBlank(quoteFee_.beginFreightWeight) && this.common.isBlank(quoteFee_.endFreightWeight)
                && this.common.isBlank(quoteFee_.beginFreightVolume) && this.common.isBlank(quoteFee_.endFreightVolume)){
                this.quoteFeeData.pop();
            }
            this.$forceUpdate();
        },
    },
}
