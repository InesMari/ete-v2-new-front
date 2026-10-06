import tableCommon from "@/components/table/tableCommon.vue";
import mapDialog from "@/components/mapDialog/mapDialog.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'workInfoManage',
    data() {
        return {
            head: [
                {"name": "作业点名称", "code": "workName", "width": "110", "type": "text"},
                {"name": "联系人", "code": "linkmanName", "width": "110", "type": "text"},
                {"name": "手机号", "code": "bill", "width": "110", "type": "text"},
                {"name": "联系电话", "code": "phone", "width": "110", "type": "text"},
                {"name": "地址", "code": "workAddressStr", "width": "300", "type": "text"},
                {"name": "类型", "code": "workinfoTypeName", "width": "110", "type": "text"},
                {"name": "电子围栏", "code": "electricFenceName", "width": "110", "type": "text"}
            ],
            loadParam: {},
            workInfo: {
                workinfoType: '1'
            },
            provinceData: [],//所有省份
            cityData: [],//所有城市
            districtData: [],//所有区县
            mapPointDraw: null,//地图标点位置
            showModify: false,//显示弹窗
            isShowMap: false,//显示地图
            isShowMapDraw: false,//显示电子围栏
            disabled: false,//禁用弹窗内容
            isOverlays: false,//禁用电子围栏输入框
            isNotDistrict: true,//地图区域没有返回提供选择
            showMapBotton: false,//地图按钮显示
            isDraw: true,//围栏绘制按钮显示
            title:"新增作业点",
            electricPlace:"不填默认300米",
            mapPoint:null,
            drawPoints:null,
            isWmsWork:this.$route.query.isWmsWork,
            showSelWork: false,
            identifyText:'',
            showIdentify:false,

            libraryType:this.$route.query.libraryType,
            workList:[],
            custWorkTypeData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        mapDialog,
        selectWork,
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId&&this.isWmsWork==1){
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
        doQuery() {
            this.loadParam.tenantId = this.$route.query.tenantId;
            this.loadParam.isWmsWork = this.$route.query.isWmsWork;
            this.loadParam.libraryType = this.$route.query.libraryType;
            this.$refs.table.load("workGoodsTF", "queryWorkData", this.loadParam);
        },
        init() {
            let that = this;
            if(this.$route.query.libraryType==1){
                this.head.unshift({"name": "关联仓库", "code": "parentWorkName", "width": "110", "type": "text"});
                this.head.push({"name": "客户作业类型", "code": "workTypeName", "width": "110", "type": "text"});
            }
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "CUST_WORK_TYPE"}, function (data) {
                that.custWorkTypeData = data;
            });
            //加载静态枚举
            this.common.postUrl("selectStaticDataTF", "selectProvince", {}, function (data) {
                that.provinceData = data;
            });
            this.common.postUrl('storeHouseBizTF','queryStoreHouseList',{},function (data) {
                that.workList = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        dblclickItem(data){
            this.modify(3,data);
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
        /** 删除作业点 */
        del() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要删除的作业点！");
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
                title: "删除作业点",
                message: h('p', null, [
                    h('span', null, "此操作将作业点："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("workGoodsTF", "delWorkInfo", {workIdStr:ids,workName,tenantId:this.$route.query.tenantId}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.add(false);
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        /** 打开关闭作业点弹窗 */
        add(flag,type) {
            this.identifyText = '';
            if (flag) {
                if(this.common.isBlank(type)){
                    this.title = "新增作业点";
                }
                if(type==1 || type==3){
                    this.showIdentify = false;
                    this.showMapBotton = true;
                    this.isDraw = false;
                }else{
                    this.showIdentify = true;
                    this.showMapBotton = false;
                    this.isDraw = true;
                }
                this.showModify = true;
            } else {
                this.workInfo = {
                    workinfoType: '1'
                };
                this.mapPointDraw = null;
                this.electricPlace = "不填默认300米";
                this.isOverlays = false;
                this.showModify = false;
                this.disabled = false;
                this.mapPoint = null;
                this.drawPoints = null;
                this.isNotDistrict = true;
                this.showMapBotton = false;
            }
            this.$forceUpdate();
        },
        /** 地图选择省市区 */
        showMap(){
            this.isShowMap = true;
        },
        hideMapBack(){
            this.isShowMap = false;
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
        /** 保存作业点 */
        saveWorkInfo() {
            this.workInfo.tenantId = this.$route.query.tenantId;
            this.workInfo.isWmsWork = this.$route.query.isWmsWork;
            this.workInfo.libraryType = this.$route.query.libraryType;
            if(this.common.isBlank(this.workInfo.workName)){
                this.$message.error("请输入作业点名称！");
                return;
            }
            if(this.common.isBlank(this.workInfo.provinceId) || this.workInfo.provinceId<0
                || this.common.isBlank(this.workInfo.cityId) || this.workInfo.cityId<0
                || this.common.isBlank(this.workInfo.districtId) || this.workInfo.districtId<0){
                this.$message.error("请选择作业点省市区！");
                return;
            }
            if(this.common.isBlank(this.workInfo.address)){
                this.$message.error("请输入作业点街道地址！");
                return;
            }
            if(this.common.isBlank(this.workInfo.latitude) || this.common.isBlank(this.workInfo.longitude)){
                this.$message.error("没有获取到作业点经纬度！");
                return;
            }
            if(this.common.isBlank(this.workInfo.workinfoType) || this.workInfo.workinfoType<0){
                this.$message.error("请选择作业点类型！");
                return;
            }
            if(this.common.isNotBlank(this.workInfo.linkmanName)){
                if(this.workInfo.linkmanName.length<2){
                    this.$message.error("请输入正确的联系人名称！");
                    return;
                }
            }
            if(this.common.isNotBlank(this.workInfo.bill)){
                if(this.workInfo.bill.length!=11){
                    this.$message.error("请输入正确的手机号码！");
                    return;
                }
            }
            //如果录入，限制10位以上的数字，(固话10位，手机11位)，否则如上信息，将可能是垃圾信息！
            //2021-03-18,Jimmy
            if(this.common.isNotBlank(this.workInfo.phone)){
                if(this.workInfo.phone.length<10){
                    this.$message.error("请输入正确的联系电话！");
                    return;
                }
            }
            let that = this;
            this.common.postUrl("workGoodsTF", "checkWorkDistance", this.workInfo, function (data) {
                if (data.result == 'Y') {
                    const h = that.$createElement;
                    that.$msgbox({
                        title: "提示",
                        message: h('p', null, [
                            h('span', null, "该作业点"),
                            h('i', { style: 'color: red' }, data.workDistanceStr),
                            h('span', null, "米范围内存在作业点："),
                            h('i', { style: 'color: red' }, data.workNameStr),
                            h('span', null, "请确认是否继续操作？"),
                        ]),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: "warning",
                    }).then(() => {
                        that.common.postUrl("workGoodsTF", "addWorkInfo", that.workInfo, function (data_) {
                            if (that.common.isNotBlank(data_)) {
                                that.doQuery();
                                that.add(false);
                                that.$message.success("保存成功！");
                            }
                        });
                    }).catch(() => {
                        that.$message.info("已取消新增");
                    });
                }else{
                    that.common.postUrl("workGoodsTF", "addWorkInfo", that.workInfo, function (data_) {
                        if (that.common.isNotBlank(data_)) {
                            that.doQuery();
                            that.add(false);
                            that.$message.success("保存成功！");
                        }
                    });
                }
            },null,'',true);
        },
        /** 1查看 2修改 3双击查看详情*/
        async modify(type,obj) {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1 && type!=3) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let workinfo = selectData[0];
            if(type==3){
                workinfo = obj;
            }
            let param = {
                workId:workinfo.id,
                workType:1
            };
            let that = this;
            await this.common.postUrl("workGoodsTF", "queryWorkInfoById", param, function (data) {
                that.workInfo = data;
            });
            await this.changeProvinceSelect();
            await this.changeCitySelect();
            if(type==1 || type==3){
                this.title = "查看作业点";
                this.disabled = true;
            }else if(type==2){
                this.title = "修改作业点";
                this.disabled = false;
            }
            if(this.common.isNotBlank(this.workInfo.parentIds)){
                this.workInfo.parentIds = this.workInfo.parentIds.split(',');
                this.workInfo.parentIds = this.workInfo.parentIds.map(Number);
            }
            if(this.common.isNotBlank(this.workInfo.workType)){
                this.workInfo.workType = this.workInfo.workType+'';
            }
            if(this.common.isNotBlank(this.workInfo.overlays)){
                this.electricPlace = "已绘制";
                this.isOverlays = true;
            }
            //作业点类型
            this.workInfo.workinfoType = workinfo.workinfoType+"";
            //地图坐标
            this.mapPoint = {
                addressName:workinfo.workAddressStr,
                point:{
                    "lng":workinfo.longitude,
                    "lat":workinfo.latitude,
                }
            };
            //电子围栏
            this.drawPoints = [];
            if(this.common.isNotBlank(workinfo.overlays)){
                let overlayData = workinfo.overlays.split("|");
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
            this.add(true,type);
        },
        // 识别地址
        async identify(){
            let addressStr = this.identifyText.replace(/[\r\n]/g, "");
            let res = await this.common.postUrl("commonTF", "getSplitAddress", {addressStr},null,null,null,true);
            this.workInfo.linkmanName = res.linkmanName;
            this.workInfo.bill = res.bill;
            this.workInfo.provinceId = res.workinfo.provinceId;
            this.workInfo.cityId = res.workinfo.cityId;
            this.workInfo.districtId = res.workinfo.districtId;
            this.workInfo.address = res.workinfo.address;
            this.workInfo.latitude = res.workinfo.lat;
            this.workInfo.longitude = res.workinfo.lng;
            if(this.common.isNotBlank(res.workinfo.lng)){
                this.mapPoint = {'addressName':res.workinfo.address,point:{"lng":res.workinfo.lng,"lat":res.workinfo.lat}};
            }
            this.changeProvinceSelect();
            this.changeCitySelect();
            this.$forceUpdate();
        },
        addressLibrary(){
            this.$emit("openTab",{
                urlId: 'addressLibraryWorkInfoManage',
                query: {libraryType: 1},
                urlName: "地址库",
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/workInfoManage.vue"});
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
                urlId: 'workDetail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.WORK,
                },
                urlName: "作业点操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
