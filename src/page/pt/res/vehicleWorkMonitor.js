// import BMap from 'BMap'

export default {
    name: 'vehicleWorkMonitor',
    data() {
        return {
            map:null,       //地图对象
            mapPoint:null,       //地图对象
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
        this.init();
    },
    /**
     * 绑定函数
     */
    methods:{
        /**
         * 初始化
         */
        init(){
            this.initMap();
        },
        /**
         * 查询车辆
         */
        doQuery(){
            let that = this;
            this.common.postUrl("vehicleWorkService", "loadVehicleWorkRecordInfoById", this.$route.query, function (data) {
                if (that.common.isNotBlank(data)) {
                    //清除地图原有覆盖物
                    that.map.clearOverlays();
                    let info = data.info;
                    let point = new BMap.Point(info.longitude, info.latitude)
                    that.mapPoint = {"lng":info.longitude,"lat":info.latitude};
                    that.setMark(point, info,"#1990ff");
                    that.map.centerAndZoom(point,16);
                }
            });
        },
        /**
         * 初始化地图信息
         */
        initMap(){
            this.map = new BMap.Map('mapId');
            let poi = new BMap.Point(116.404,39.915);
            this.map.centerAndZoom(poi, 16);
            this.map.enableScrollWheelZoom();    //启动鼠标滚轮操作
            this.doQuery();
        },
        setMark(point,obj,color){
            // 创建小车图标
            let myIcon = new BMap.Icon("/static/image/car.png", new BMap.Size(48, 24));
            // 创建Marker标注，使用小车图标
            let marker = new BMap.Marker(point, {
                icon: myIcon
            });
            //let rotation = Number(obj.rotation);//车辆随机旋转
            //marker.setRotation(rotation);
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

            // let marker2 = new BMap.Marker(point)
            // let label2 = new BMap.Label("this.mapPoint.addressName",{offset:new BMap.Size(20,-15)});
            // label2.isNotClear = true;//绘制地图不清除标识
            // marker2.setLabel(label2);
            
            // 创建信息窗口
            let opts = {
                width: 300,
                title: ''
            };
            let electricFence = obj.electricFence;
            let overlays = obj.overlays;
            let drawPoints = [];
            if(this.common.isNotBlank(overlays)){
                let overlayData = overlays.split("|");
                for (let i = 0; i < overlayData.length; i++) {
                    let pointStr = overlayData[i].split(",");
                    let point = {
                        "lng":pointStr[1],
                        "lat":pointStr[0],
                    }
                    drawPoints.push(point);
                }
            }
            if (drawPoints.length == 0)
            {
                drawPoints = electricFence;
            }
            let innerHtml = `
                <p style="font-size:14px;">作业点名称：${obj.workName}</p>
                <p style="font-size:14px;">车辆信息：${obj.plateNumber + ' ' + obj.vehicleTypeName + ' ' + obj.vehicleLengthName}</p>
                <p style="font-size:14px;">进入时间：${obj.enterDate}</p>
                <p style="font-size:14px;">离开时间：${obj.leaveDate}</p>
                <p style="font-size:14px;">用时：${obj.timeConsuming}</p>
                <p style="font-size:14px;">作业点位置：${obj.workAddress}</p>
            `
            let infoWindow = new BMap.InfoWindow(innerHtml, opts);
            let _this = this;
            // 点标记添加点击事件
            marker.addEventListener('click', function () {
                _this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
            });
            _this.map.openInfoWindow(infoWindow, point);
            _this.setDrawPoints(drawPoints);
        },
        /**
         * 绘制地图回显
         * drawPoints格式[{"lng":116.384309,"lat":39.92412}]
         */
        setDrawPoints(drawPoints){
            if(this.common.isNotBlank(drawPoints) && this.map && this.map.Ua){
                if (!isNaN(drawPoints))//数值的是绘画圆圈
                {
                    let center = new BMap.Point(this.mapPoint.lng,this.mapPoint.lat);
                    let circle = new BMap.Circle(center, drawPoints, {strokeColor:"red",fillColor:"red", strokeWeight:3, strokeOpacity:0.8});//创建圆形
                    this.map.addOverlay(circle);   //增加多边形
                }
                else
                {
                    let arr = [];
                    drawPoints.forEach(el=>{
                        arr.push(new BMap.Point(el.lng,el.lat));
                    })
                    let polygon = new BMap.Polygon(arr, {strokeColor:"red",fillColor:"red", strokeWeight:3, strokeOpacity:0.8});  //创建多边形
                    this.map.addOverlay(polygon);   //增加多边形
                    this.map.centerAndZoom(arr[0], 22);
                    this.overlays.Ao = arr;
                }
            }
        },

    },

}
