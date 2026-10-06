// import BMap from 'BMap'

export default {
    name: 'vehicleMonitor',
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
            
            textareaFocus: false,
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
            this.doQuery();
            this.tenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        /**
         * 查询车辆
         */
        doQuery()
        {
            let that = this;
            this.common.postUrl("monitorTF", "vehicleMonitor", this.query, function (data)
            {
                if (that.common.isNotBlank(data))
                {
                    //清除地图原有覆盖物
                    that.map.clearOverlays();
                    that.vehicleData = data.vehicleData;
                    for (let i = 0; i < that.vehicleData.length; i++)
                    {
                        let vehicle = that.vehicleData[i];
                        if (that.common.isNotBlank(vehicle.longitude) && that.common.isNotBlank(vehicle.longitude))
                        {
                            //添加车辆
                            let point = new BMap.Point(vehicle.longitude, vehicle.latitude);
                            that.setMark(point, vehicle, "#1990ff");
                        }
                        else if (that.vehicleData.length < 5)
                        {     //查询超过5辆车不再提示，避免提示过多导致的页面卡顿
                            that.$message({
                                message: `${vehicle.plateNumber}无经纬度数据，无法定位。`,
                                type: 'warning'
                            });
                        }
                    }
                    // 只有一辆车的时候定位到车辆坐标
                    if(that.vehicleData.length == 1){
                        let vehicle = that.vehicleData[0];
                        let point = new BMap.Point(vehicle.longitude, vehicle.latitude);
                        that.map.centerAndZoom(point, 15);
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
            let poi = new BMap.Point(116.404, 39.915);
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
            let innerHtml = `
                <p style="font-size:14px;">车牌号码：${obj.plateNumber}</p>
                <p style="font-size:14px;">车辆状态：${obj.vehicleState}</p>
                <p style="font-size:14px;">车型车长：${obj.vehicleTypeName + '' + obj.vehicleLengthName}</p>
                <p style="font-size:14px;">定位时间：${obj.locationDate}</p>
                <p style="font-size:14px;">最新位置：${obj.location}</p>
            `
            let infoWindow = new BMap.InfoWindow(innerHtml, opts);
            let _this = this;
            // 点标记添加点击事件
            marker.addEventListener('click', function ()
            {
                _this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
            });
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
        }
    },
    
}
