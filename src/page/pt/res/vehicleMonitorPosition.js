// import BMap from 'BMap'

export default {
    name: 'vehicleMonitorPosition',
    data()
    {
        return {
            map: null,
            query: {
                isOwn: false,
                plateNumber: this.$route.query.plateNumber,
                supplierId: null,
                vehicleOwner: null,
                vehicleTypeLength: null,
                nDay: 3,
            },
            dayData: [
                {"codeValue": 1, "codeName": "1天内"},
                {"codeValue": 2, "codeName": "2天内"},
                {"codeValue": 3, "codeName": "3天内"},
                {"codeValue": 4, "codeName": "4天内"},
                {"codeValue": 5, "codeName": "5天内"},
                {"codeValue": 6, "codeName": "6天内"},
                {"codeValue": 7, "codeName": "7天内"},
            ],
            vehicleData: [],
            tenantData: [], //供应商
            customerData:[], //客户
            selectLoading:false,
            // 缓存已选中的 option 对象，解决 remote 搜索时已选项丢失显示 label 的问题
            supplierSelectedCache: [],
            customerSelectedCache: [],
            
            textareaFocus: false,
            requestId: 0, // 请求版本号，用于过滤过期请求
        }
    },
    /**
     * 组件
     */
    components: {},
    /**
     * 初始化
     */
    mounted()
    {
        this.init();
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化
         */
        async init()
        {
            this.initMap();
            // this.doQuery();
            // this.tenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            // this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {});
        },
        // 远程搜索供应商（输入 ≥1 个字符才触发）
        async remoteSearchSupplier(query) {
            if (!query || query.trim().length < 1) {
                // 清空时保留已选项，避免已选标签丢失
                this.tenantData = [...this.supplierSelectedCache];
                return;
            }
            this.selectLoading = true;
            try {
                let params = { supplierName: query.trim() };
                this.tenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", params);
                // 将已选中但不在搜索结果中的项补回来
                this.mergeSelectedIntoList('supplier');
            } finally {
                this.selectLoading = false;
            }
        },
        // 远程搜索客户（输入 ≥1 个字符才触发）
        async remoteSearchCustomer(query) {
            if (!query || query.trim().length < 1) {
                this.customerData = [...this.customerSelectedCache];
                return;
            }
            this.selectLoading = true;
            try {
                let params = { custName: query.trim() };
                this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", params);
                // 将已选中但不在搜索结果中的项补回来
                this.mergeSelectedIntoList('customer');
            } finally {
                this.selectLoading = false;
            }
        },
        /**
         * 将已选中但不在当前列表中的 option 合并回来
         * @param {string} type - 'supplier' 或 'customer'
         */
        mergeSelectedIntoList(type) {
            if (type === 'supplier') {
                const selectedIds = (this.query.supplierId || []).map(String);
                const existingIds = this.tenantData.map(item => String(item.tenantId));
                const missingItems = this.supplierSelectedCache.filter(
                    item => selectedIds.includes(String(item.tenantId)) && !existingIds.includes(String(item.tenantId))
                );
                this.tenantData = [...this.tenantData, ...missingItems];
            } else if (type === 'customer') {
                const selectedIds = (this.query.tenantIds || []).map(String);
                const existingIds = this.customerData.map(item => String(item.tenantId));
                const missingItems = this.customerSelectedCache.filter(
                    item => selectedIds.includes(String(item.tenantId)) && !existingIds.includes(String(item.tenantId))
                );
                this.customerData = [...this.customerData, ...missingItems];
            }
        },
        /**
         * 供应商选择变更时更新缓存
         */
        onSupplierChange(selectedIds) {
            // 从当前列表中找出选中的完整对象，更新缓存
            const selectedStrIds = (selectedIds || []).map(String);
            const newCache = this.tenantData.filter(item => selectedStrIds.includes(String(item.tenantId)));
            // 保留缓存中已选中但当前列表中没有的（避免切换搜索词时丢失）
            const cachedIds = new Map(newCache.map(item => [String(item.tenantId), item]));
            const remainingCache = this.supplierSelectedCache.filter(
                item => selectedStrIds.includes(String(item.tenantId)) && !cachedIds.has(String(item.tenantId))
            );
            this.supplierSelectedCache = [...newCache, ...remainingCache];
            this.doQuery();
        },
        /**
         * 客户选择变更时更新缓存
         */
        onCustomerChange(selectedIds) {
            const selectedStrIds = (selectedIds || []).map(String);
            const newCache = this.customerData.filter(item => selectedStrIds.includes(String(item.tenantId)));
            const cachedIds = new Map(newCache.map(item => [String(item.tenantId), item]));
            const remainingCache = this.customerSelectedCache.filter(
                item => selectedStrIds.includes(String(item.tenantId)) && !cachedIds.has(String(item.tenantId))
            );
            this.customerSelectedCache = [...newCache, ...remainingCache];
            this.doQuery();
        },
        /**
         * 查询车辆
         */
        doQuery()
        {
            // 递增请求版本号，确保只有最后一次请求有效
            const currentRequestId = ++this.requestId;
            let that = this;
            this.common.postUrl("monitorTF", "vehicleMonitor", this.query, function (data)
            {
                // 检查是否为最新请求，如果不是则丢弃
                if (currentRequestId !== that.requestId) {
                    return;
                }
                
                if (that.common.isNotBlank(data))
                {
                    //清除地图原有覆盖物
                    that.map.clearOverlays();
                    that.vehicleData = data.vehicleData;
                    let center = true;
                    for (let i = 0; i < that.vehicleData.length; i++)
                    {
                        let vehicle = that.vehicleData[i];
                        if (that.common.isNotBlank(vehicle.longitude) && that.common.isNotBlank(vehicle.longitude))
                        {
                            //添加车辆
                            let point = new BMap.Point(vehicle.longitude, vehicle.latitude);
                            let color = "#67C23A";
                            if(vehicle.vehicleStateId == 1){
                                color = "#1990ff";
                            }
                            that.setMark(point, vehicle, color);
                            if (center)
                            {//地图中心切换至第一台车辆位置
                                that.map.centerAndZoom(point, 15);
                                center = false;
                            }
                        }
                        else if (that.vehicleData.length < 5)
                        {     //查询超过5辆车不再提示，避免提示过多导致的页面卡顿
                            that.$message({
                                message: `${vehicle.plateNumber}无经纬度数据，无法定位。`,
                                type: 'warning'
                            });
                        }
                    }
                    if (that.vehicleData.length == 0)
                    {
                        that.$message({
                            message: '查询不到车辆信息。',
                            type: 'warning'
                        });
                    }
                }
            });
        },
        /**
         * 初始化地图信息
         */
        initMap()
        {
            this.map = new BMap.Map('mapId');
            let poi = new BMap.Point(113.64,23.15);     //默认定位总部地址
            this.map.centerAndZoom(poi, 15);
            this.map.enableScrollWheelZoom();    //启动鼠标滚轮操作
        },
        setMark(point, obj, color)
        {
            // 创建小车图标
            let myIcon = new BMap.Icon("/static/image/car.png", new BMap.Size(48, 24));
            // 创建Marker标注，使用小车图标
            let marker = new BMap.Marker(point, {
                icon: myIcon
            });
            let rotation = Number(obj.rotation);//车辆随机旋转
            marker.setRotation(rotation);
            // 将标注添加到地图
            this.map.addOverlay(marker);
            let label = new BMap.Label(obj.plateNumber, {offset: new BMap.Size(-12, -30)});
            label.setStyle({
                borderRadius: "3px",
                padding: "5px 10px",
                borderColor: color,
                color: "#fff",
                background: color
            })
            marker.setLabel(label);
            
            // 创建信息窗口
            let opts = {
                width: 200,
                title: ''
            };
            let routeName = "";
            if(obj.routeName){
                routeName = `<p style='font-size:14px;'>线路名称：${obj.routeName}</p>`;
            }
            let waybillNum = "";
            if(obj.waybillNum){
                waybillNum = `<p style="font-size:14px;">派车单号：<span class="waybill-link" style="color:#409EFF;cursor:pointer;" data-id="${obj.waybillId}">${obj.waybillNum}</span></p>`;
            }
            let innerHtml = `
                <p style="font-size:14px;">车牌号码：${obj.plateNumber}</p>
                <p style="font-size:14px;">车辆状态：${obj.vehicleState}</p>
                `
                + routeName +
                `
                <p style="font-size:14px;">车型车长：${obj.vehicleTypeName + '' + obj.vehicleLengthName}</p>
                <p style="font-size:14px;">定位时间：${obj.locationDate}</p>
                `
                + waybillNum +
                `
                <p style="font-size:14px;">最新位置：${obj.location}</p>
                `
            let infoWindow = new BMap.InfoWindow(innerHtml, opts);
            let _this = this;
            // 点标记添加点击事件
            marker.addEventListener('click', function ()
            {
                _this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
            });
            // 信息窗口添加点击事件（派车单号）
            infoWindow.addEventListener('open', function () {
                let waybillLinks = document.querySelectorAll('.waybill-link');
                waybillLinks.forEach(link => {
                    link.onclick = function () {
                        _this.onWaybillClick(this.getAttribute('data-id'), this.innerText);
                    };
                });
            });
        },
        /**
         * 点击派车单号事件
         */
        onWaybillClick(waybillId) {
            this.$emit("openTab",{
                    urlId: 'waybillDetail' + waybillId,
                    query: {waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
        },
        /**
         * textarea焦点处理
         */
        setTextareaFocus()
        {
            this.textareaFocus = !this.textareaFocus;
        },
        textareaKeyup(event)
        {
            event.stopPropagation();
            if (!event.shiftKey && event.keyCode == 13)
            {
                this.doQuery();
            }
        },
        /**
         * 清空查询条件
         */
        clearQuery()
        {
            this.query = {
                isOwn: false,
                plateNumber: null,
                supplierId: null,
                vehicleOwner: null,
                vehicleTypeLength: null,
                nDay: 3,
            };
        }
    },
    
}
