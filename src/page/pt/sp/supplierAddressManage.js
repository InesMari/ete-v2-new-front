import tableCommon from "@/components/table/tableCommon.vue";
import mapDialog from "@/components/mapDialog/mapDialog.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'supplierAddressManage',
    data()
    {
        return {
            head: [
                {"name": "供应商名称", "code": "supplierName", "width": "200", "type": "text"},
                {"name": "作业点名称", "code": "workName", "width": "150", "type": "text"},
                {"name": "作业点地址", "code": "workAddressStr", "width": "200", "type": "text"},
                {"name": "联系人", "code": "linkmanName", "width": "80", "type": "text"},
                {"name": "手机号", "code": "bill", "width": "100", "type": "text"},
                {"name": "电话", "code": "phone", "width": "100", "type": "text"},
                {"name": "类型", "code": "workinfoTypeName", "width": "60", "type": "text"},
                {"name": "电子围栏", "code": "electricFenceName", "width": "80", "type": "text"}
            ],
            query: this.clear(this.$route.query.supplierName),
            mapPoint: null,//地图标点位置
            mapPointDraw: null,//地图标点位置
            drawPoints: null,//绘图坐标数组/ 或者是半径
            workInfo: {tenantId: '',workinfoType: '1',workName :'',provinceId :'',cityId: '',districtId :'',address: '',electricFence: '',linkmanName: '',bill: '',phone: ''},
            provinceData: [],//所有省份
            cityData: [],//所有城市
            districtData: [],//所有区县
            supplierData:[],//供应商
            showModify: false,//显示查看新增修改弹窗弹窗
            isOnlySee: false,//是否只查看内容
            isShowMap: false,//显示地图
            isShowMapDraw: false,//显示电子围栏地图
            isOverlays: false,//禁用电子围栏输入框
            title:"新增作业点",
            electricPlace:"不填默认300米",
            tip: "地图选择",
            tip2: "手工绘制",
            width1_: "73%",//电子围栏输入框默认宽度
            width2_: "25%",//电子围栏按钮默认宽度
            showElectricFenceInput: true,//展示电子围栏输入框
            isNotDistrict: true,//地图区域没有返回提供选择
            showSureDraw: false,//绘制地图却按钮
            showCancelDraw: false,//绘制地图取消
            showClearDraw: false,//绘制地图清空
            isDrawArea: true,//地图绘制功能

            showSure: false,//地图却按钮
            showCancel: false,//地图取消
            showClear: false,//地图清空
        }
    },
    computed:{
        formData(){
            return [
                {"name":"作业点名称","model":"workName","type":"input","isshow":true},
                {"name":"作业点地址","model":"workAddress","type":"input","isshow":true},
                {"name":"专线商名称","model":"supplierName","type":"input","isshow":true},
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
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 列表查询
         */
        doQuery(query = this.query) {
            query.tenantId = this.$route.query.tenantId;
            this.$refs.table.load("workGoodsTF", "queryAllSupplierWorkData", query);
        },
        /**
         * 初始化数据
         */
        init() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectProvince", {}, function (data) {
                that.provinceData = data;
            });
            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.supplierData = data;
            });
        },
        /**
         * 清空初始化参数
         * @returns {{tenantId: string | (string | null)[]}}
         */
        clear(supplierName)
        {
            this.query = {workName: '',workAddress:'',supplierName : supplierName};
            return this.query;
        },
        /**
         * 选择省份回调
         */
        changeProvince() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectCity", {provinceId: this.workInfo.provinceId}, function (data) {
                that.cityData = data;
            });
        },
        /**
         * 选择城市回调
         */
        changeCity() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectDistrict", {cityId: this.workInfo.cityId}, function (data) {
                that.districtData = data;
            });
        },
        /**
         * 刷新视图
         */
        forceUpdate() {
            this.$forceUpdate();
        },
        /**
         * 保存作业点
         */
        saveWorkInfo()
        {
            if(this.common.isBlank(this.workInfo.workName)){
                this.$message.error("请输入作业点名称！");
                return false;
            }
            if(this.common.isBlank(this.workInfo.provinceId) || this.workInfo.provinceId<0
                || this.common.isBlank(this.workInfo.cityId) || this.workInfo.cityId<0
                || this.common.isBlank(this.workInfo.districtId) || this.workInfo.districtId<0){
                this.$message.error("请使用地图选择作业点省市区信息！");
                return false;
            }
            if(this.common.isBlank(this.workInfo.address)){
                this.$message.error("请输入作业点街道地址！");
                return false;
            }
            if(this.common.isBlank(this.workInfo.latitude) || this.common.isBlank(this.workInfo.longitude)){
                this.$message.error("没有获取到作业点经纬度,请使用地址重新选择！");
                return false;
            }
            if(this.common.isBlank(this.workInfo.workinfoType) || this.workInfo.workinfoType<0){
                this.$message.error("请选择作业点类型！");
                return false;
            }
            if(this.common.isNotBlank(this.workInfo.linkmanName)){
                if(this.workInfo.linkmanName.length<2){
                    this.$message.error("请输入至少2个字联系人名称！");
                    return;
                }
            }
            if(this.common.isNotBlank(this.workInfo.bill)){
                if(this.workInfo.bill.length!=11){
                    this.$message.error("请输入11位数的手机号码！");
                    return;
                }
            }
            if (this.common.isBlank(this.workInfo.overlays))
            {
                if (this.common.isNotBlank(this.workInfo.electricFence) && this.workInfo.electricFence > 10000)
                {
                    this.$message.error("您输入的围栏范围太大，请缩小范围！");
                    return false;
                }
            }
            else if (this.common.isNotBlank(this.workInfo.overlays))
            {
                let pts = [];
                let data = this.workInfo.overlays.split("|");
                for (let i = 0; i < data.length; i++)
                {
                    let location= data[i].split(",");
                    pts[i] = {lat: location[0], lng: location[1]};
                }
                if (!this.isInPolygon({lat: this.workInfo.latitude, lng: this.workInfo.longitude}, pts))
                {
                    this.$message.error("作业点不在绘制的区域内，请重新绘制围栏区域！");
                    return false;
                }
            }
            let that = this;
            this.workInfo.isCheckExistSameAddress = 1;//保存作业点后台追加相同地址校验
            this.workInfo.isSpWork=1;
            this.common.postUrl("workGoodsTF", "addWorkInfo", this.workInfo, function (data) {
                if (data) {
                    that.doQuery();
                    that.showPage(false);
                    that.$message.success("保存成功！");
                }
            },null,'',true);
        },
        /**
         * 双击详情
         * @param data
         */
        dblclickItem(data)
        {
            this.showPage(true, 1, data);
        },
        /**
         * 打开关闭作业点弹窗
         * @param flag true 打开 false 关闭
         * @param type 0新增 1查看 2修改
         */
        async showPage(flag, type, data)
        {
            if (flag)
            {
                this.isNotDistrict = true;
                if (type === 0)
                {
                    this.title = "新增作业点";
                    this.tip = "地图选择";
                    this.tip2 = "手工绘制";
                    this.workInfo = {workinfoType: '1'};
                    this.electricPlace = "不填默认300米";
                    this.isOverlays = false;
                    this.width1_ = '73%';
                    this.width2_ = '25%';
                    this.showElectricFenceInput = true;//展示电子围栏输入框

                    this.mapPoint = null;
                    this.mapPointDraw = null;
                    this.drawPoints = null;
                    this.showSureDraw = false;//绘图地图确认按钮
                    this.showCancelDraw = false;//绘图地图取消按钮
                    this.showClearDraw = false;//绘图地图清空按钮
                    this.isDrawArea = true;//地图绘制模块
                    this.showSure = false;//地图却按钮
                    this.showCancel = false;//地图取消
                    this.showClear = false;//地图清空
                }
                else//1查看 2修改
                {
                    let selectData = this.$refs.table.getSelectItem();
                    if (this.common.isNotBlank(data))
                    {
                        selectData[0] = data;
                    }
                    if (selectData.length !== 1) {
                        this.$message.error("请选择一条作业点数据！");
                        return false;
                    }
                    this.workInfo = selectData[0];
                    await this.changeProvince();//改变省获取城市数据
                    await this.changeCity();//改变城市获取地区数据
                    //作业点地图中心点
                    this.mapPoint = {addressName:this.workInfo.workAddressStr, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
                    //围栏地图中心点
                    this.mapPointDraw = {addressName:this.workInfo.workAddressStr, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
                    if(this.common.isNotBlank(this.workInfo.overlays))
                    {
                        this.electricPlace = "已绘制";
                        this.drawPoints = this.dealPintsData(this.workInfo.overlays);
                    }
                    else //没有绘制的
                    {
                        this.drawPoints = this.workInfo.electricFence;
                    }
                    if(type === 1)
                    {
                        //看不到地图选择
                        this.title = "查看作业点";
                        this.tip = "地图查看";
                        this.tip2 = "查看电子围栏区域";
                        this.width1_ = '0%';
                        this.width2_ = '100%';
                        this.showElectricFenceInput = false;//不展示电子围栏输入框
                        this.showSureDraw = true;//地图却按钮
                        this.showCancelDraw = false;//地图取消
                        this.showClearDraw = true;//地图清空
                        this.isDrawArea = false;
                        this.showSure = true;//地图却按钮
                        this.showCancel = false;//地图取消
                        this.showClear = true;//地图清空
                    }
                    if(type === 2)
                    {
                        this.title = "修改作业点";
                        this.tip = "地图选择";
                        this.tip2 = "手工绘制";
                        this.width1_ = '73%';
                        this.width2_ = '25%';

                        this.showElectricFenceInput = true;//展示电子围栏输入框
                        if(this.common.isNotBlank(this.workInfo.overlays))
                        {
                            this.isOverlays = true;//已绘制区域，不能输入区域
                        }
                        else
                        {
                            this.isOverlays = false;
                        }
                        this.showSureDraw = false;//地图却按钮
                        this.showCancelDraw = false;//地图取消
                        this.showClearDraw = false;//地图清空
                        this.isDrawArea = true;

                        this.showSure = false;//地图却按钮
                        this.showCancel = false;//地图取消
                        this.showClear = false;//地图清空
                    }
                }
            }
            else
            {
                this.mapPoint = null;
                this.mapPointDraw = null;
                this.drawPoints = null;
                //关闭时刷新列表 修改是会把新的作业点位置变更 再次点击修改进来是修改的值
                this.doQuery();
            }
            this.isOnlySee = flag && type === 1;//只有查看的时候才禁用
            this.showModify = flag;
            this.forceUpdate();
        },
        /**
         * 删除作业点
         */
        deleteWork() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <= 0) {
                this.$message.error("请选择需要删除的作业点！");
                return false;
            }
            let workIds = "";
            let workName = '';
            let supplierName = '';
            for (let i = 0; i < selectData.length; i++) {
                workIds += selectData[i].workId + ",";
                workName += selectData[i].workName + ",";
                supplierName += selectData[i].supplierName + ",";
            }
            workIds = workIds.substring(0, workIds.length-1);
            workName = workName.substring(0, workName.length-1);
            supplierName = supplierName.substring(0, supplierName.length-1);
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("workGoodsTF", "delWorkInfo", {workIdStr:workIds,workName,supplierName,isSpWork:1,tenantId:this.$route.query.tenantId}, function (data)
                {
                    if (data)
                    {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() =>{
                this.$message.info("取消删除");
            });
        },
        /**
         * 打开地图选择省市区地址
         */
        showMap(){
            this.isShowMap = true;
        },
        /**
         * 地图选择省市区回调
         * @param data
         * @returns {Promise<void>}
         */
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
                    this.workInfo.workAddressStr = addressComponents.province;
                    let provinceId = await this.common.postUrl("selectStaticDataTF","getProvinceId",{"codeValueName" : addressComponents.province});
                    if(this.common.isNotBlank(provinceId)){
                        this.workInfo.provinceId = Number(provinceId);
                        await this.changeProvince();
                        if(this.common.isNotBlank(addressComponents.city))
                        {
                            this.workInfo.workAddressStr += addressComponents.city;
                            let cityId = await this.common.postUrl("selectStaticDataTF","getCityId",{"codeValueName":addressComponents.city});
                            if(this.common.isNotBlank(cityId)){
                                this.workInfo.cityId = Number(cityId);
                                await this.changeCity();
                            }
                            if(this.common.isNotBlank(addressComponents.district)){
                                this.workInfo.workAddressStr += addressComponents.district;
                                let districtId = await this.common.postUrl("selectStaticDataTF","getDistrictId",{"codeValueName":addressComponents.district,"cityId":cityId});
                                if(districtId<0){
                                    this.$message.error("很抱歉，系统地址库没有区县:"+addressComponents.district+"，请联系管理人员。");
                                }
                                if(this.common.isNotBlank(districtId)){
                                    this.workInfo.districtId = Number(districtId);
                                    let address = '';
                                    address += addressComponents.city + addressComponents.district + addressComponents.street + addressComponents.streetNumber;
                                    this.mapPoint = {addressName:address, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
                                }
                                if (this.common.isNotBlank(addressComponents.street))
                                {
                                    //新增作业点省市区赋值绘图地图回显
                                    this.workInfo.workAddressStr += addressComponents.street;
                                }
                                if (this.common.isNotBlank(addressComponents.streetNumber))
                                {
                                    //新增作业点省市区赋值绘图地图回显
                                    this.workInfo.workAddressStr += addressComponents.streetNumber;
                                }
                                this.isNotDistrict = true;
                            }
                            else
                            {
                                if (this.common.isNotBlank(addressComponents.street))
                                {
                                    //新增作业点省市区赋值绘图地图回显
                                    this.workInfo.workAddressStr += addressComponents.street;
                                }
                                if (this.common.isNotBlank(addressComponents.streetNumber))
                                {
                                    //新增作业点省市区赋值绘图地图回显
                                    this.workInfo.workAddressStr += addressComponents.streetNumber;
                                }
                                this.isNotDistrict = false;
                            }
                        }
                        else
                        {
                            this.$message.error("没有匹配到当前位置信息，请手动选择！");
                            this.isNotDistrict = false;
                            // if(addressComponents.district){
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
        /**
         * 地图取消回调
         */
        hideMapBack(){
            this.isShowMap = false;
        },
        /**
         * 打开地图绘画
         */
        showMapDraw(){
            if (this.common.isNotBlank(this.workInfo.latitude) && this.common.isNotBlank(this.workInfo.longitude))
            {
                //围栏地图中心点
                this.mapPointDraw = {addressName:this.workInfo.workAddressStr, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
            }
            this.isShowMapDraw = true;
        },
        /**
         * 绘画地图取消回调
         */
        hideMapBackDraw(){
            this.isShowMapDraw = false;
        },
        /**
         * 地图绘制完区域电子围栏回调
         * @param data
         */
        sureWorkAddressDraw(data){
            if(this.common.isNotBlank(data.overlays)){
                let overlays = "";
                let longitude = '';
                let latitude = '';
                for (let i = 0; i < data.overlays.length; i++) {
                    longitude = data.overlays[i].lng;
                    latitude = data.overlays[i].lat;
                    overlays += data.overlays[i].lat + "," + data.overlays[i].lng + "|";
                }
                overlays = overlays.substring(0,overlays.length-1);
                this.workInfo.overlays = overlays;
                this.workInfo.electricFence = "";//清空电子围栏范围
                this.electricPlace = "已绘制";
                this.isOverlays = true;
                if (this.common.isBlank(this.workInfo.longitude))//新增还没有选择作业点位置的
                {
                    this.mapPoint = {addressName:'', point:{"lng":longitude,"lat":latitude}};
                }
                //绘制围栏需要回显
                this.drawPoints = this.dealPintsData(this.workInfo.overlays);
            }
            else
            {
                this.drawPoints = [];
                this.workInfo.overlays = '';
                this.electricPlace = "不填默认300米";
                this.isOverlays = false;
            }
        },
        /**
         * 改变供应商
         */
        changeSupplier(data)
        {
            this.workInfo.tenantId = data;
        },
        /**
         * 在地图展示电子围栏
         */
        showArea()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            this.workInfo = selectData[0];
            let overlays = this.workInfo.overlays;
            let electricFence = this.workInfo.electricFence;
            if (this.common.isBlank(overlays) && this.common.isBlank(electricFence + ""))
            {
                this.$message.error("当前选择作业点没有电子围栏！");
                return false;
            }
            //绘图地图中展示作业点标识
            this.mapPointDraw = {addressName:this.workInfo.workAddressStr, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
            if (this.common.isNotBlank(overlays))
            {
                //电子围栏字符串数据处理成数组 查看围栏的地图视图中心以第一个起点位置
                this.drawPoints = this.dealPintsData(overlays);
            }
            else
            {
                //没有绘制的区域直接取圆形范围区域展示中心的还是作业点的位置
                this.drawPoints = electricFence;
            }
            this.showSureDraw = true;//地图却按钮
            this.showCancelDraw = false;//地图取消
            this.showClearDraw = true;//地图清空
            this.isDrawArea = false;
            this.showMapDraw();
        },
        /**
         * 处理区域数据返回
         * @param pointsStr
         * @returns {[]}
         */
        dealPintsData(pointsStr)
        {
            let array = [];
            if(this.common.isNotBlank(pointsStr)){
                let overlayData = pointsStr.split("|");
                for (let i = 0; i < overlayData.length; i++) {
                    let pointStr = overlayData[i].split(",");
                    let point = {"lng":pointStr[1], "lat":pointStr[0], };
                    array.push(point);
                }
            }
            return array;
        },
        /**
         * 判断点是否在当前区域内
         * @param point 当前点
         * @param pts 区域数据
         * @returns {boolean}
         */
        isInPolygon(point, pts)
        {
            if (this.common.isBlank(point) || this.common.isBlank(point.lat) || this.common.isBlank(point.lng))
            {
                console.log("没有传入当前位置信息！")
                return false;
            }
            if (this.common.isBlank(pts) || pts.length < 3)
            {
                console.log("没有传入区域信息！")
                return false;
            }
            let length = pts.length;
            let intersectCount = 0;//交叉点数量
            let precision = 2e-10; //浮点类型计算时候与0比较时候的容差
            let p1, p2;//临近顶点
            let p = point; //当前点
            p1 = pts[0];
            for(let i = 1; i <= length; ++i)
            {
                if(p.lat == p1.lat && p.lng == p1.lng){ return true; }//
                p2 = pts[i % length];
                if(p.lng < Math.min(p1.lng, p2.lng) || p.lng > Math.max(p1.lng, p2.lng))
                {
                    p1 = p2;
                    continue;
                }

                //射线穿过算法
                if(p.lng > Math.min(p1.lng, p2.lng) && p.lng < Math.max(p1.lng, p2.lng))
                {
                    if(p.lat <= Math.max(p1.lat, p2.lat))
                    {
                        if(p1.lng == p2.lng && p.lat >= Math.min(p1.lat, p2.lat)){ return true; }
                        if(p1.lat == p2.lat)
                        {
                            if(p1.lat == p.lat){ return true; }
                            else { ++intersectCount; }
                        }
                        else
                        {
                            let xinters = parseFloat((p.lng - p1.lng) * (p2.lat - p1.lat) / (p2.lng - p1.lng)) + parseFloat(p1.lat);
                            if(Math.abs(p.lat - xinters) < precision){ return true; }
                            if(p.lat < xinters){ ++intersectCount; }
                        }
                    }
                }
                else
                {
                    if(p.lng == p2.lng && p.lat <= p2.lat)
                    {
                        let p3 = pts[(i + 1) % length];
                        if(p.lng >= Math.min(p1.lng, p3.lng) && p.lng <= Math.max(p1.lng, p3.lng)){ ++intersectCount; }
                        else { intersectCount += 2; }
                    }
                }
                p1 = p2;
            }
            //偶数在多边形外
            if(intersectCount % 2 == 0){ return false; }

            //奇数在多边形内
            return true;
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
                urlId: 'work' + 'Detail' + data.workId,
                query: {
                    logId: data.workId,
                    logType: enumData.LOG_TYPE.WORK,
                },
                urlName: "作业点" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
