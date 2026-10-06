// import BMap from 'BMap'
export default {
    name: 'vehicleMonitorSaaS',
    data() {
        return {
            map: null,                  //地图对象
            query: {plateNumber: ''},   //查询入参
            vehicleData: [],            //车辆下拉数据
        }
    },
    /**
     * 组件
     */
    components: {
    },
    /**
     * 初始化
     */
    mounted(){
        this.initMap();
        this.doQuery();
    },
    /**
     * 绑定函数
     */
    methods:{
        /**
         * 查询车辆数据
         */
        doQuery(){
            let that = this;
            this.common.postUrl("monitorTF", "vehicleMonitorSaaS", this.query, function (data) {
                //清除地图原有覆盖物
                that.map.clearOverlays();
                if (that.common.isNotBlank(data)) {
                    that.vehicleData = data;
                    let points = [];
                    for (let i = 0; i < that.vehicleData.length; i++) {
                        let vehicle = that.vehicleData[i];
                        if(that.common.isNotBlank(vehicle.latitude) && that.common.isNotBlank(vehicle.longitude)){
                            //添加车辆
                            let point = new BMap.Point(vehicle.longitude, vehicle.latitude);
                            that.setMark(point, vehicle,"#1990ff");
                            points.push(point);
                        }
                    }
                    that.map.setViewport(points);//根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
                }
            });
        },
        /**
         * 初始化地图信息
         */
        initMap(){
            this.map = new BMap.Map('mapId');
            let poi = new BMap.Point(116.404,39.915);
            this.map.centerAndZoom(poi, 15);
            this.map.enableScrollWheelZoom();    //启动鼠标滚轮操作
        },
        /**
         * 设置车辆标注
         * @param point
         * @param obj
         * @param color
         */
        setMark(point,obj,color){
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
            let label = new BMap.Label(obj.plateNumber,{offset:new BMap.Size(-12,-30)});
            label.setStyle({
                borderRadius:"3px",
                padding:"5px 10px",
                borderColor:color,
                color:"#fff",
                background:color
            })
            marker.setLabel(label);

            // 创建信息窗口
            let opts = {
                width: 200,
                title: ''
            };
            let innerHtml = `
                <p style="font-size:14px;">车牌号码：${obj.plateNumber}</p>
                <p style="font-size:14px;">定位时间：${obj.locationDate}</p>
                <p style="font-size:14px;">最新位置：${obj.location}</p>
            `
            let infoWindow = new BMap.InfoWindow(innerHtml, opts);
            let _this = this;
            // 点标记添加点击事件
            marker.addEventListener('click', function () {
                _this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
            });
        }
    },

}
