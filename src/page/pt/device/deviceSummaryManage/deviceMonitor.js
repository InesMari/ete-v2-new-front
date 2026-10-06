// import BMap from 'BMap'

export default {
    name: 'deviceMonitor',
    data()
    {
        return {
            map: null,
            query: {
                deviceIds: this.$route.query.deviceIds,
                workName: ''
            },
            workData: [],//作业点集合
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
        this.doQuery();
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化
         */
        init()
        {
            this.initMap();
            this.listenMapZoom();
        },
        /**
         * 查询该客户有包装作业点
         */
        doQuery()
        {
            let that = this;
            this.common.postUrl("stockDeviceService", "queryDeviceStockSummaryDetailPageForMap", this.query, function (data)
            {
                if (that.common.isNotBlank(data))
                {
                    if (data.length == 0)
                    {
                        that.$message.error("没有作业点信息!");
                    }
                    //清除地图原有覆盖物
                    that.map.clearOverlays();
                    that.workData = data;
                    let point = new BMap.Point(data[0].longitude, data[0].latitude);
                    that.map.centerAndZoom(point, 15);
                    that.eachData();
                }
            });
        },
        // 遍历处理数据
        eachData()
        {
            for (let i = 0; i < this.workData.length; i++)
            {
                let work = this.workData[i];
                if (this.common.isNotBlank(work.longitude) && this.common.isNotBlank(work.longitude))
                {
                    //添加作业点
                    let point = new BMap.Point(work.longitude, work.latitude);
                    this.setMark(point, work, "#1990ff");
                }
            }
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


            // let pt2 = new BMap.Point(116.4168, 39.900);
            // this.setMark(pt2,"#999");
            // let pt3 = new BMap.Point(116.400, 39.913);
            // this.setMark(pt3,"#00b79e");
        },
        // 监听地图缩放
        listenMapZoom()
        {
            let _this = this;
            window.onmousewheel = document.onmousewheel = function (e)
            {
                let zoom = _this.map.getZoom();
                //实际路径圆圈较小时
                if (zoom <= 14)
                {
                    _this.map.clearOverlays();
                    _this.useLabel = true;
                    _this.eachData();
                } else
                {   // 地图固定比例圆圈较小时
                    _this.map.clearOverlays();
                    _this.useLabel = false;
                    _this.eachData();
                }
            }
        },
        setMark(point, obj, color)
        {
            // 创建圆形区域
            if (!this.useLabel) this.mapOverlays(point);
            this.setLabel(point, obj);

            // 创建信息窗口
            let opts = {
                width: 200,
                title: ''
            };
            let innerHtml = `
                <p style="font-size:14px;">作业点名称：${obj.workName}</p>
                <p style="font-size:14px;">包装数量：${obj.totalNums}</p>
                <p style="font-size:14px;">联系人：${obj.linkmanName}</p>
                <p style="font-size:14px;">联系电话：${obj.bill}</p>
                <p style="font-size:14px;">当前位置：${obj.workAddressStr}</p>
            `
            let infoWindow = new BMap.InfoWindow(innerHtml, opts);
            let _this = this;
            // 点标记添加点击事件
            this.circle.addEventListener('click', function ()
            {
                _this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
            });
            this.label.addEventListener('click', function ()
            {
                _this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
            });

        },

        // 渲染地图覆盖物
        mapOverlays(point)
        {
            this.circle = new BMap.Circle(point, 300, {
                strokeColor: "rgb(187, 187, 187)",
                fillColor: "rgb(111, 125, 200)",
                strokeWeight: 1,
                strokeOpacity: 0.4
            });//创建圆形
            this.map.addOverlay(this.circle);   //增加多边形
        },
        // 数量悬浮层
        setLabel(point, obj)
        {
            let numOpts = {
                position: point, // 指定文本标注所在的地理位置
                offset: new BMap.Size(0, -30) // 设置文本偏移量
            };
            // 创建文本标注对象
            this.label = new BMap.Label(obj.totalNums, numOpts);
            // 自定义文本标注样式
            this.label.setStyle({
                color: '#000',
                fontWeight: "bold",
                fontSize: '16px',
                background: "rgba(111, 125, 200,0.4)",
                border: "none",
                height: '60px',
                width: "60px",
                borderRadius: "50%",
                lineHeight: '60px',
                fontFamily: '微软雅黑',
                textAlign: "center",
                transform: "translateX(-50%)"
            });
            if (this.useLabel)
            {
                this.label.setStyle({
                    background: "rgba(111, 125, 200,0.4)",
                });
            } else
            {
                this.label.setStyle({
                    background: "none",
                });
            }
            this.map.addOverlay(this.label);

        },
    },

}
