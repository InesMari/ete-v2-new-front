import tableCommon from "@/components/table/tableCommon.vue";
import mapDialog from "@/components/mapDialog/mapDialog.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'addStorehouse',
    data() {
        return {
            workInfo: {
                workinfoType: '2',
                storageCondition:[],
            },
            provinceData: [],//所有省份
            cityData: [],//所有城市
            districtData: [],//所有区县
            storehouseTypeData: [],//仓库类型
            firecontrolTypeData: [],//消防等级
            isShowMap: false,//显示地图
            isShowMapDraw: false,//显示电子围栏
            disabled: false,//禁用弹窗内容
            isOverlays: false,//禁用电子围栏输入框
            isNotDistrict: true,//地图区域没有返回提供选择
            showMapBotton: false,//地图按钮显示
            isDraw: true,//围栏绘制按钮显示
            electricPlace:"不填默认300米",
            mapPoint:null,
            drawPoints:null,
            mapPointDraw:null,
            centerPoint:null,
            pickerOptions: {//禁用小于当前时间日期
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                },
            },
            allStoreHouseData: [],
            supportFiles:'img',
            regionData:[],
            orgData:[],
            regionOrgData:[],//选择区域对应的部门数据
            staffData2:[],
            orgStaffData:[],
            srcList: [],
            allSupplierData: [],
            storageConditionData:[],//存放条件
            type:this.$route.query.type,// 1 新增 2 修改  3 查看

            settleBodyData: [],//结算主体
        }
    },
    computed:{
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        mapDialog,
        myFileModel,
        searchList,
        fileViewer
    },
    /**
     * 绑定函数
     */
    methods: {
        async init() {
            let that = this;
            //加载静态枚举
            this.common.postUrl("selectStaticDataTF", "selectProvince", {}, function (data) {
                that.provinceData = data;
            });
            //仓库类型
            that.storehouseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STOREHOUSE_TYPE"});
            //消防等级
            that.firecontrolTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FIRECONTROL_TYPE"});
            that.storageConditionData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STORAGE_CONDITION"});
            this.allSupplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            //结算主体
            that.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            let data = await this.common.postUrl("regionOrgTF", "getRegionInfoList", {}, null, null, '', true);
            // for (let i = 0; i < data.length; i++) {
            //     let item = data[i];
            //     if (item.id == 1)//总部的处理掉
            //     {
            //         data.splice(i, 1);
            //         i--;
            //     }
            // }
            this.regionData = data;
            //加载区域数据
            that.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});

            //加载所有的人员
            that.staffData2 = await this.common.postUrl("regionOrgTF", "getStaffInfoList", {});
            this.loadStoreHouseList();
            if(this.type==1){
                // that.workInfo.supplierId = that.allSupplierData[0].supplierId;
                that.workInfo.storehouseType = that.storehouseTypeData[0].codeValue;
                that.workInfo.firecontrolType = that.firecontrolTypeData[0].codeValue;
                that.workInfo.storehouseArea = 0;
                that.showMapBotton = false;
                that.isDraw = true;
                that.electricPlace = "不填默认300米";
                this.disabled = false;
            }else if(this.type==2){
                this.disabled = false;
                this.getWorkInfo();
            }else{
                this.showMapBotton = true;
                this.isDraw = false;
                this.disabled = true;
                this.getWorkInfo();
            }
        },
        regionChange(val){
            this.regionOrgData=[];
            if(!val){
                this.workInfo.orgId = '';
                this.workInfo.customerService = '';
                this.workInfo.billId = '';
            }
            for (let i = 0; i < this.orgData.length; i++) {
                if(this.orgData[i].regionId == val){
                    this.regionOrgData.push(this.orgData[i]);
                }
            }
        },
        orgChange(val){
            this.orgStaffData=[];
            if(!val){
                this.workInfo.customerService = '';
                this.workInfo.billId = '';
            }
            for (let i = 0; i < this.staffData2.length; i++) {
                if(this.staffData2[i].orgId == val){
                    this.orgStaffData.push(this.staffData2[i]);
                }
            }
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        /** 选中省份 */
        changeProvinceSelect() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectCity", {provinceId: this.workInfo.provinceId}, function (data) {
                that.cityData = data;
            });
        },
        /** 选中城市 */
        changeCitySelect() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectDistrict", {cityId: this.workInfo.cityId}, function (data) {
                that.districtData = data;
            });
        },
        async loadStoreHouseList(param){
            let that = this;
            //所有仓库
            await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", param, function (data) {
                that.allStoreHouseData = data;
                that.$forceUpdate();
            });
        },
        /** 地图选择省市区 */
        showMap(){
            this.isShowMap = true;
        },
        /** 地图选择省市区回调 */
        async sureWorkAddress(data){
            let addressComponents = data.addressComponents;
            let point = data.point;
            if(this.common.isNotBlank(point)){
                this.workInfo.latitude = point.lat;
                this.workInfo.longitude = point.lng;
            }
            if(this.common.isNotBlank(addressComponents)){
                this.workInfo.address = addressComponents.street;
                if(this.common.isNotBlank(addressComponents.province)){
                    let provinceId = await this.common.postUrl("selectStaticDataTF","getProvinceId",{"codeValueName" : addressComponents.province});
                    if(provinceId>0){
                        this.workInfo.provinceId = Number(provinceId);
                        await this.changeProvinceSelect();
                        if(this.common.isNotBlank(addressComponents.city)){
                            let cityId = await this.common.postUrl("selectStaticDataTF","getCityId",{"codeValueName":addressComponents.city});
                            if(cityId>0){
                                this.workInfo.cityId = Number(cityId);
                                await this.changeCitySelect();
                            }
                            //有区县数据的后台获取对应的ID再回调
                            if(this.common.isNotBlank(addressComponents.district)){
                                let districtId = await this.common.postUrl("selectStaticDataTF","getDistrictId",{"codeValueName":addressComponents.district,"cityId":cityId});
                                if(districtId<0){
                                    this.$message.error("很抱歉，系统地址库没有区县:"+addressComponents.district+"，请联系管理人员。");
                                }
                                if(this.common.isNotBlank(districtId)){
                                    this.workInfo.districtId = Number(districtId);
                                    let address = '';
                                    address += addressComponents.city + addressComponents.district + addressComponents.street + addressComponents.streetNumber;
                                    this.mapPoint = {addressName:address, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
                                    this.workInfo.workAddressStr = address;
                                }
                                this.isNotDistrict = true;
                            }else{
                                this.isNotDistrict = false;
                            }
                        }else {
                            this.$message.error("没有匹配到当前位置信息，请手动选择！");
                            this.isNotDistrict = false;
                            // if(this.common.isNotBlank(addressComponents.district)){
                            //     let districtId = await this.common.postUrl("selectStaticDataTF","getDistrictIdByNameAndProvinIdStr",{"codeValueName":addressComponents.district,"provinceId":provinceId});
                            //     if(this.common.isNotBlank(districtId)){
                            //         this.workInfo.districtId = Number(districtId);
                            //     }
                            // }
                            // else
                            // {
                            //     this.$message.error("请选择点击地图选择有省市区地点再确认！");
                            // }
                        }
                    }
                }
            }
            this.$forceUpdate();
            this.hideMapBack();
        },
        hideMapBack(){
            this.isShowMap = false;
        },
        showMapDraw(){
            if(this.common.isNotBlank(this.workInfo.longitude) && this.common.isNotBlank(this.workInfo.latitude)){
                this.mapPointDraw = {addressName:this.workInfo.workAddressStr, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
            }
            this.isShowMapDraw = true;
        },
        modifyMapDraw(){
            //查看电子围栏
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            this.drawPoints = [];
            if(this.common.isNotBlank(selectData[0].overlays)){
                let overlayData = selectData[0].overlays.split("|");
                for (let i = 0; i < overlayData.length; i++) {
                    let pointStr = overlayData[i].split(",");
                    let point = {
                        "lng":pointStr[1],
                        "lat":pointStr[0],
                    }
                    this.drawPoints.push(point);
                }
            }
            //没有绘制范围显示默认
            if (this.drawPoints.length == 0)
            {
                this.drawPoints = selectData[0].electricFence;
            }
            this.mapPointDraw = {addressName:selectData[0].workAddressStr, point:{"lng":selectData[0].longitude,"lat":selectData[0].latitude}};
            this.isShowMapDraw = true;
            this.showMapBotton = true;
            this.isDraw = false;
        },
        hideMapBackDraw(){
            this.isShowMapDraw = false;
        },
        /** 电子围栏回调 */
        sureWorkAddressDraw(data){
            if(this.common.isNotBlank(data.overlays)){
                let overlays = "";
                this.drawPoints = [];
                for (let i = 0; i < data.overlays.length; i++) {
                    overlays += data.overlays[i].lat + "," + data.overlays[i].lng + "|";
                    //绘制围栏需要回显
                    let point = {
                        "lng":data.overlays[i].lng,
                        "lat":data.overlays[i].lat,
                    }
                    this.drawPoints.push(point);
                }
                overlays = overlays.substring(0,overlays.length-1);
                this.workInfo.overlays = overlays;
                this.workInfo.electricFence = "";//清空电子围栏范围
                this.electricPlace = "已绘制";
                this.isOverlays = true;
            }else{
                this.drawPoints = [];
                this.workInfo.overlays = '';
                this.electricPlace = "不填默认300米";
                this.isOverlays = false;
            }
        },
        /** 保存仓库 */
        saveWorkInfo() {
            this.workInfo.tenantId = this.common.userInfo().tenantId;
            if(this.common.isBlank(this.workInfo.workName)){
                this.$message.error("请输入仓库名称！");
                return;
            }
            if(this.common.isBlank(this.workInfo.provinceId) || this.workInfo.provinceId<0
                || this.common.isBlank(this.workInfo.cityId) || this.workInfo.cityId<0
                || this.common.isBlank(this.workInfo.districtId) || this.workInfo.districtId<0){
                this.$message.error("请选择仓库省市区！");
                return;
            }
            if(this.common.isBlank(this.workInfo.address)){
                this.$message.error("请输入仓库街道地址！");
                return;
            }
            if(this.common.isBlank(this.workInfo.latitude) || this.common.isBlank(this.workInfo.longitude)){
                this.$message.error("没有获取到仓库经纬度！");
                return;
            }
            if(this.common.isBlank(this.workInfo.workinfoType) || this.workInfo.workinfoType<0){
                this.$message.error("请选择仓库类型！");
                return;
            }
            if(this.common.isNotBlank(this.workInfo.linkmanName)){
                if(this.workInfo.linkmanName.length<2){
                    this.$message.error("请输入正确的联系人名称！");
                    return;
                }
                if(this.common.checkNum(this.workInfo.linkmanName)){
                    this.$message.error("联系人名称不能全部为数字");
                    return;
                }
            }
            if(this.common.isNotBlank(this.workInfo.bill)){
                if(this.workInfo.bill.length!=11){
                    this.$message.error("请输入正确的手机号码！");
                    return;
                }
            }
            if(this.common.isBlank(this.workInfo.storehouseType)){
                this.$message.error("请选择仓库类型！");
                return;
            }
            if(this.common.isBlank(this.workInfo.firecontrolType)){
                this.$message.error("请选择消防等级！");
                return;
            }
            // if(this.common.isBlank(this.workInfo.functionalAreaPalletNums)){
            //     this.$message.error("请输入功能区板数！");
            //     return;
            // }
            // if(this.common.isBlank(this.workInfo.functionalAreaArea)){
            //     this.$message.error("请输入功能区面积！");
            //     return;
            // }
            // if(this.common.isBlank(this.workInfo.storageAreaArea)){
            //     this.$message.error("请输入存储区板数！");
            //     return;
            // }
            // if(this.common.isBlank(this.workInfo.storageAreaArea)){
            //     this.$message.error("请输入存储区面积！");
            //     return;
            // }
            if(this.workInfo.leaseStartDate>this.workInfo.leaseEndDate){
                this.$message.error("租赁开始日期不能大于租赁结束日期！");
                return false;
            }

            let data = this.$refs.attach.getImageData();
            if(JSON.stringify(data) != "{}"){
                this.workInfo.attachId = data.flowId;
                this.workInfo.attachPath = data.storePath;
            }

            let businessLicense = this.$refs.businessLicense.getImageData();
            if(JSON.stringify(businessLicense) != "{}"){
                this.workInfo.businessLicenseFileId = businessLicense.flowId;
                this.workInfo.businessLicenseFilePath = businessLicense.storePath;
            }

            let propertyRightCertificate = this.$refs.propertyRightCertificate.getImageData();
            if(JSON.stringify(propertyRightCertificate) != "{}"){
                this.workInfo.propertyRightCertificateFileId = propertyRightCertificate.flowId;
                this.workInfo.propertyRightCertificateFilePath = propertyRightCertificate.storePath;
            }

            let fireSafetyCertificate = this.$refs.fireSafetyCertificate.getImageData();
            if(JSON.stringify(fireSafetyCertificate) != "{}"){
                this.workInfo.fireSafetyCertificateFileId = fireSafetyCertificate.flowId;
                this.workInfo.fireSafetyCertificateFilePath = fireSafetyCertificate.storePath;
            }

            let insurancePolicy = this.$refs.insurancePolicy.getImageData();
            if(JSON.stringify(insurancePolicy) != "{}"){
                this.workInfo.insurancePolicyFileId = insurancePolicy.flowId;
                this.workInfo.insurancePolicyFilePath = insurancePolicy.storePath;
            }

            let workInfo = this.common.copyObj(this.workInfo);
            if(workInfo.storageCondition&&workInfo.storageCondition.length>0){
                workInfo.storageCondition = workInfo.storageCondition.join(',');
            }else{
                workInfo.storageCondition = '';
            }

            let that = this;
            this.common.postUrl("workGoodsTF", "checkWorkDistance", workInfo, function (data) {
                if (data.result == 'Y') {
                    const h = that.$createElement;
                    that.$msgbox({
                        title: "提示",
                        message: h('p', null, [
                            h('span', null, "该仓库"),
                            h('i', { style: 'color: red' }, data.workDistanceStr),
                            h('span', null, "米范围内存在仓库："),
                            h('i', { style: 'color: red' }, data.workNameStr),
                            h('span', null, "请确认是否继续操作？"),
                        ]),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: "warning",
                    }).then(() => {
                        that.common.postUrl("workGoodsTF", "addStorehouse", workInfo, function (data_) {
                            if (that.common.isNotBlank(data_)) {
                                that.close();
                                that.$message.success("保存成功！");
                            }
                        },null,'',true);
                    }).catch(() => {
                        that.$message.info("已取消新增");
                    });
                }else{
                    that.common.postUrl("workGoodsTF", "addStorehouse", workInfo, function (data_) {
                        if (that.common.isNotBlank(data_)) {
                            that.close();
                            that.$message.success("保存成功！");
                        }
                    },null,'',true);
                }
            },null,'',true);
        },
        /** 1查看 2修改 3双击查看详情*/
        async getWorkInfo() {
            let param = {
                workId:this.$route.query.id,
                workType:2
            };
            let that = this;
            that.workInfo = await this.common.postUrl("workGoodsTF", "queryWorkInfoById", param);
            if(this.common.isNotBlank(that.workInfo.storageCondition)){
                that.workInfo.storageCondition = that.workInfo.storageCondition.split(',');
            }
            this.regionChange(that.workInfo.regionId);
            this.orgChange(that.workInfo.orgId);
            this.selStaff(that.workInfo.customerService);
            await this.loadStoreHouseList({parentWorkId:  param.workId});
            this.workInfo.storehouseType = this.workInfo.storehouseType+"";
            this.workInfo.firecontrolType = this.workInfo.firecontrolType+"";
            if(this.common.isNotBlank(that.workInfo.settleBody)){
                that.workInfo.settleBody = that.workInfo.settleBody+"";
            }
            await this.changeProvinceSelect();
            await this.changeCitySelect();
            if(this.common.isNotBlank(this.workInfo.overlays)){
                this.electricPlace = "已绘制";
                this.isOverlays = true;
            }
            //地图坐标
            this.mapPoint = {
                addressName:that.workInfo.workAddressStr,
                point:{
                    "lng":that.workInfo.longitude,
                    "lat":that.workInfo.latitude,
                }
            };
            //电子围栏
            this.drawPoints = [];
            if(this.common.isNotBlank(that.workInfo.overlays)){
                let overlayData = that.workInfo.overlays.split("|");
                for (let i = 0; i < overlayData.length; i++) {
                    let pointStr = overlayData[i].split(",");
                    let point = {
                        "lng":pointStr[1],
                        "lat":pointStr[0],
                    }
                    this.drawPoints.push(point);
                }
            }
            //没有绘制范围显示默认
            if (this.drawPoints.length == 0)
            {
                this.drawPoints = this.workInfo.electricFence;
                this.mapPointDraw = {addressName:this.workInfo.workAddressStr, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
            }
            if(that.workInfo.attachId){
                this.$nextTick(() => {
                    that.$refs.attach.initDate(that.workInfo.attachId);
                })
            }
            if(that.workInfo.businessLicenseFileId){
                this.$nextTick(() => {
                    that.$refs.businessLicense.initDate(that.workInfo.businessLicenseFileId);
                })
            }
            if(that.workInfo.propertyRightCertificateFileId){
                this.$nextTick(() => {
                    that.$refs.propertyRightCertificate.initDate(that.workInfo.propertyRightCertificateFileId);
                })
            }
            if(that.workInfo.fireSafetyCertificateFileId){
                this.$nextTick(() => {
                    that.$refs.fireSafetyCertificate.initDate(that.workInfo.fireSafetyCertificateFileId);
                })
            }
            if(that.workInfo.insurancePolicyFileId){
                this.$nextTick(() => {
                    that.$refs.insurancePolicy.initDate(that.workInfo.insurancePolicyFileId);
                })
            }
        },
        /**
         * 选择用户
         * @param val
         */
        selStaff(val) {
            if(!val){
                this.workInfo.billId = '';
            }
            for (let i = 0; i < this.orgStaffData.length; i++) {
                if (this.orgStaffData[i].userId == val) {
                    this.workInfo.billId = this.orgStaffData[i].billId;
                    break;
                }
            }
            this.$forceUpdate();
        },
        /** 自动计算租金 */
        changeTaxAmount(){
            if(this.workInfo.taxRate>100){
                this.workInfo.taxRate = 100;
            }
            if(this.common.isNotBlank(this.workInfo.storehouseArea)){
                let shareFee = 0;
                if(this.common.isNotBlank(this.workInfo.leaseFee)){
                    shareFee = this.common.accAdd(shareFee,this.common.accDiv(this.workInfo.leaseFee,this.workInfo.storehouseArea));
                }
                if(this.common.isNotBlank(this.workInfo.hardwareFee)){
                    shareFee = this.common.accAdd(shareFee,this.common.accDiv(this.workInfo.hardwareFee,this.workInfo.storehouseArea));
                }
                let str = String(shareFee);//toFixed是有问题的不使用
                if (str.indexOf(".") > 0)
                    shareFee = str.substring(0, str.indexOf(".") + 3);
                this.workInfo.shareFee = shareFee;
            }
            this.calUseRate();
            this.calCostPerPallet();
            this.forceUpdate();
        },
        calAmount(){
            if(this.common.isNotBlank(this.workInfo.storehouseArea)){
                let leaseFee = 0;
                if(this.common.isNotBlank(this.workInfo.shareFee)){
                    leaseFee = this.common.accAdd(leaseFee,this.common.accMul(this.workInfo.shareFee,this.workInfo.storehouseArea));
                }
                if(this.common.isNotBlank(this.workInfo.hardwareFee)){
                    leaseFee = this.common.accSub(leaseFee,this.workInfo.hardwareFee);
                }
                let str = String(leaseFee);//toFixed是有问题的不使用
                if (str.indexOf(".") > 0)
                    leaseFee = str.substring(0, str.indexOf(".") + 3);
                this.workInfo.leaseFee = leaseFee;
            }
            this.calUseRate();
            this.calCostPerPallet();
            this.forceUpdate();
        },
        calUseRate(){
            this.workInfo.useRate = '';
            if(this.common.isNotBlank(this.workInfo.storehouseArea)&&this.common.isNotBlank(this.workInfo.storageAreaArea)){
                let tmpStorageAreaArea = this.common.accMul(this.workInfo.storageAreaArea,100);
                this.workInfo.useRate=this.common.accDiv(tmpStorageAreaArea,this.workInfo.storehouseArea);
            }
            this.forceUpdate();
        },
        calCostPerPallet(){
            this.workInfo.costPerPallet = '';
            if(this.common.isNotBlank(this.workInfo.leaseFee)&&this.common.isNotBlank(this.workInfo.storageAreaPalletNums)){
                this.workInfo.costPerPallet=this.common.accDiv(this.workInfo.storageAreaPalletNums,this.workInfo.leaseFee);
            }
            this.forceUpdate();
        },
        beforeUpload(file){
            let suffix = file.name.substring(file.name.lastIndexOf('.'),file.name.length);
            if(".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO".indexOf(suffix)>-1){
                this.supportFiles = 'img';
            }else{
                this.supportFiles = 'file';
            }
            this.$forceUpdate();

        },
        /**
         * 显示照片
         * @param data
         */
        showImg(url){
            if(!url){
                return;
            }
            this.srcList=[];
            this.srcList.push(url);
            this.$refs.viewer.show();
        },
        /**
         * 关闭新增客户
         */
        close(){
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        async changeContract() {
            if(this.common.isBlank(this.workInfo.contractId)){
                this.workInfo.supplierId = null;
            }else {
                this.contractData.forEach(item => {
                    if (this.workInfo.contractId == item.id) {
                        this.workInfo.supplierId = item.supplierId;
                    }
                });
            }
        },
    },
}
