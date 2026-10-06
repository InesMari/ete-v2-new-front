import tableCommon from "@/components/table/tableCommon.vue";
import mapDialog from "@/components/mapDialog/mapDialog.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';
import enumData from "@/page/pt/enum";

export default {
    name: 'storehouseManage',
    data() {
        return {
            head: [
                {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
                {"name": "仓库地址", "code": "workAddressStr", "width": "500", "type": "diy"},
                {"name": "是否主仓", "code": "isMain", "width": "100", "type": "text"},
                {"name": "启用禁用", "code": "stsName", "width": "100", "type": "diyColorTd"},
                {"name": "结算主体", "code": "settlybodyName", "width": "500", "type": "text"},
                {"name": "租赁面积/㎡", "code": "storehouseArea", "width": "80", "type": "text"},
                // {"name": "最大板数", "code": "maxPalletNums", "width": "100", "type": "text"},
                {"name": "已使用板数", "code": "usedPalletNums", "width": "100", "type": "text"},
                {"name": "滴水高度/m", "code": "storehouseHeight", "width": "80", "type": "text"},
                {"name": "联系人", "code": "linkmanName", "width": "110", "type": "text"},
                {"name": "手机号", "code": "bill", "width": "110", "type": "text"},
                {"name": "联系电话", "code": "phone", "width": "110", "type": "text"},
                {"name": "电子围栏", "code": "electricFenceName", "width": "110", "type": "text"},
                {"name": "存放方式", "code": "storageConditionName", "width": "150", "type": "text"},
                {"name": "仓库类型", "code": "storehouseTypeName", "width": "100", "type": "text"},
                {"name": "消防等级", "code": "firecontrolTypeName", "width": "80", "type": "text"},
                {"name": "租赁开始日期", "code": "leaseStartDate", "width": "110", "type": "text"},
                {"name": "租赁结束日期", "code": "leaseEndDate", "width": "110", "type": "text"},
                // {"name": "公摊比例", "code": "shareRate", "width": "120", "type": "text"},
                // {"name": "功能区板数", "code": "functionalAreaPalletNums", "width": "100", "type": "text"},
                // {"name": "功能区面积", "code": "functionalAreaArea", "width": "100", "type": "text"},
                // {"name": "存储区板数", "code": "storageAreaPalletNums", "width": "100", "type": "text"},
                // {"name": "存储区面积", "code": "storageAreaArea", "width": "100", "type": "text"},
                // {"name": "仓库利用率", "code": "useRate", "width": "100", "type": "text"},
                // {"name": "单板费用", "code": "costPerPallet", "width": "100", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "仓库联系人", "code": "customerServiceName", "width": "120", "type": "text"},
                {"name": "仓库联系电话", "code": "customerServiceBillId", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createName", "width": "80", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
                {"name": "查看图片", "code": "viewPic", "width": "300", "type": "diy"},
            ],
            loadParam: {supplierName: this.$route.query.supplierName},
            workInfo: {
                workinfoType: '2'
            },
            provinceData: [],//所有省份
            cityData: [],//所有城市
            districtData: [],//所有区县
            storehouseTypeData: [],//仓库类型
            storehouseTypeData_: [],//
            firecontrolTypeData: [],//消防等级
            firecontrolTypeData_: [],//
            storeHouseUserList: [],//仓库用户数据
            staffData: [],//用户数据
            supplierData: [],//可开票供应商
            calculateTypeData: [
                {"codeValue":1,"codeName":">"},
                {"codeValue":2,"codeName":"<"},
                {"codeValue":3,"codeName":"="},
            ],//计算方式
            showModify: false,//显示弹窗
            isShowStoreHouseUserDialog: false,//显示仓库人员弹窗
            isShowMap: false,//显示地图
            isShowMapDraw: false,//显示电子围栏
            disabled: false,//禁用弹窗内容
            isOverlays: false,//禁用电子围栏输入框
            isNotDistrict: true,//地图区域没有返回提供选择
            showMapBotton: false,//地图按钮显示
            isDraw: true,//围栏绘制按钮显示
            title:"新增仓库",
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
        }
    },
    computed:{
        formData(){
            return [
                {"name":"仓库名称","model":"storehouseName","type":"input","isshow":true},
                {"name":"仓库地址","model":"storehouseAddress","type":"input","isshow":true},
                {
                    "name": "仓库面积",
                    "model": "storehouseAreaArrayItem",
                    "isshow": true,
                    "children": [
                        {"model":"areaCalculateType","options":this.calculateTypeData,"label":"codeName","value":"codeValue","method":"doQuery"},
                        {"model":"storehouseArea"},
                    ],
                },
                {
                    "name": "仓库高度",
                    "model": "storehouseHeightArrayItem",
                    "isshow": true,
                    "children": [
                        {"model":"heightCalculateType","options":this.calculateTypeData,"label":"codeName","value":"codeValue","method":"doQuery"},
                        {"model":"storehouseHeight"},
                    ],
                },
                {"name":"仓库类型","model":"storehouseType","type":"select","options":this.storehouseTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"消防等级","model":"firecontrolType","type":"select","options":this.firecontrolTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                // {"name":"专线商名称","model":"supplierName","type":"input","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
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
        async doQuery(query = this.loadParam) {
            query.stsFlag = 1;//后台只查询启用的 禁用的
            let {items} = await this.$refs.table.load("workGoodsTF", "queryStorehouseData", query);
            items.forEach((el) =>
            {
                if (el.sts == 9)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        async init() {
            let that = this;
            this.loadParam.areaCalculateType = this.calculateTypeData[0].codeValue;
            this.loadParam.heightCalculateType = this.calculateTypeData[0].codeValue;
            //加载静态枚举
            this.common.postUrl("selectStaticDataTF", "selectProvince", {}, function (data) {
                that.provinceData = data;
            });
            //所有可开票供应商
            this.common.postUrl("supplierTF", "queryInvoiceFlgSupplier", {}, function (data) {
                that.supplierData = data;
                that.workInfo.supplierId = that.supplierData[0].supplierId;
            });
            //仓库类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STOREHOUSE_TYPE"}, function (data) {
                that.storehouseTypeData = data;
                that.storehouseTypeData_ = that.common.copyObj(that.storehouseTypeData);
                that.workInfo.storehouseType = that.storehouseTypeData_[0].codeValue;
            });
            //消防等级
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FIRECONTROL_TYPE"}, function (data) {
                that.firecontrolTypeData = data;
                that.firecontrolTypeData_ = that.common.copyObj(that.firecontrolTypeData);
                that.workInfo.firecontrolType = that.firecontrolTypeData_[0].codeValue;
            });
            this.allSupplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});

            let data = await this.common.postUrl("regionOrgTF", "getRegionInfoList", {}, null, null, '', true);
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (item.id == 1)//总部的处理掉
                {
                    data.splice(i, 1);
                    i--;
                }
            }
            this.regionData = data;
            //加载区域数据
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data) {
                that.orgData = data;
            });

            //加载所有的人员
            this.common.postUrl("regionOrgTF", "getStaffInfoList", {}, function (data) {
                that.staffData2 = data;
            });
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
        clear() {
            this.loadParam = {};
            this.loadParam.areaCalculateType = this.calculateTypeData[0].codeValue;
            this.loadParam.heightCalculateType = this.calculateTypeData[0].codeValue;
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
        /** 删除仓库 */
        del() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要删除的仓库！");
                return;
            }
            if (selectData.length != 1) {
                this.$message.error("请选择一条需要删除的仓库！");
                return;
            }
            let ids = "";
            let names = "";
            let workName = "";
            for (let i = 0; i < selectData.length; i++) {
                ids += selectData[i].id + ",";
                names += "【"+selectData[i].workName + "】";
                workName += selectData[i].workName + ",";
            }
            ids = ids.substring(0, ids.length-1);
            workName = workName.substring(0, workName.length-1);
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除仓库",
                message: h('p', null, [
                    h('span', null, "此操作将仓库："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                center: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("workGoodsTF", "delWorkStorehouseInfo", {workId:ids,workName}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                });
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        disable() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要的启用禁用仓库！");
                return;
            }
            if (selectData.length != 1) {
                this.$message.error("请选择一条需要启用禁用的仓库！");
                return;
            }
            let tip = "禁用";
            if (selectData[0].sts == 9)
            {
                tip = "启用";
            }
            let ids = selectData[0].id;
            let names = "【"+selectData[0].workName + "】";

            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "启用禁用",
                message: h('p', null, [
                    h('span', null, "此操作将仓库："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " "+ tip + "，是否继续？"),
                ]),
                center: true,
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("workGoodsTF", "disableWorkStorehouseInfo", {workId:ids}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success(tip + "成功！");
                    }
                });
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        async loadStoreHouseList(param)
        {
            let that = this;
            //所有仓库
            await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", param, function (data) {
                that.allStoreHouseData = data;
                that.$forceUpdate();
            });
        },
        /** 打开关闭仓库弹窗 */
        add() {
            let item = {
                urlName: "新增仓库",
                urlId: 'addStorehouse',
                urlPathName: "/addStorehouse",
                urlPath: "/pt/cm/customer/addStorehouse.vue",
                query:{
                    type: 1,
                },
            }
            this.$emit('openTab', item);
        },
        update(type,data){
            if(data==null){
                let array = this.$refs.table.getSelectItem();
                if (array.length !== 1)
                {
                    this.$message.error("请选择一条数据");
                    return false;
                }
                data = array[0];
            }
            let title = "修改仓库";
            if(type==3){
                title = "查看仓库";
            }
            let item = {
                urlName: title,
                urlId: 'addStorehouse' + data.id+'_'+type,
                urlPathName: "/addStorehouse",
                urlPath: "/pt/cm/customer/addStorehouseMain.vue",
                query:{
                    id: data.id,
                    type: type,
                    logId: data.id,
                    logType: enumData.LOG_TYPE.WORK,
                },
            }
            this.$emit('openTab', item);
        },
        /**
         * 展示仓库人员Dialog
         * @param isShow
         */
        showStoreHouseUserDialog(isShow) {
            this.title = "仓库人员";
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条数据!");
                return false;
            }
            if (array[0].parentWorkId > 0)
            {
                this.$message.error("只有主仓才能新增人员!");
                return false;
            }
            let workId = array[0].workId;

            if (isShow) {
                this.isShowStoreHouseUserDialog = true;
                let that = this;
                this.common.postUrl("storeHouseBizTF", "queryStoreHouseUserList", {workId:workId}, function (data) {
                    if (data) {
                        that.storeHouseUserList = data;
                        if (that.storeHouseUserList.length == 0) {
                            that.addStoreHouseUserRow();
                        }
                        that.queryStaffData();
                    }
                });
            }else {
                this.isShowStoreHouseUserDialog = false;
            }
        },


        /** 新增仓库用户行 */
        addStoreHouseUserRow() {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条数据!");
                return false;
            }
            let workId = array[0].workId;

            let newRow = {
                id: '',
                userName:'',
                workId: workId,
                billId: '-',
                createUserName: '-',
                createDate: '-',
            };
            this.storeHouseUserList.push(newRow);
            this.$forceUpdate();
        },


        /** 删除仓库用户行 */
        delStoreHouseUserRow(index,userData) {
            if(userData.id > 0){
                let that = this;
                this.$confirm("确定需要删除该数据？", "提示").then(() =>{
                    this.common.postUrl("storeHouseBizTF", "delStoreHouseUser", userData, function ()
                    {
                        that.showStoreHouseUserDialog(true);
                        that.$message.success("操作成功!");
                    },null,'',true);
                }).catch(() =>{})
            }else {
                this.storeHouseUserList.splice(index,1);
                if(this.storeHouseUserList.length === 0){
                    this.addStoreHouseUserRow();
                }
            }
            this.$forceUpdate();
        },

        /** 查询人员下拉数据 */
        queryStaffData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryStaffData", {}, function (data) {
                that.staffData = data;
            });
        },

        /**
         * 选择用户
         * @param userData
         */
        selectUser(userData) {
            for (let i = 0; i < this.staffData.length; i++) {
                if (this.staffData[i].userId == userData.userId) {
                    userData.billId = this.staffData[i].billId;
                    userData.userName = this.staffData[i].staffName;
                    break;
                }
            }
        },

        /**
         * 保存仓库人员信息
         */
        saveStoreHouseUser() {
            let method = 'saveStoreHouseUser';
            let that = this;
            let param = {storeHouseUserList : that.storeHouseUserList};
            this.common.postUrl("storeHouseBizTF", method, param, function (data) {
                if (data) {
                    that.showStoreHouseUserDialog(false);
                    that.$message.success("操作成功！");
                }
            },null,'',true);
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

        dblclickItem(data){
            this.update(3,data);
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
        open(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }
            let title = "查看"+baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
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
    },
}
