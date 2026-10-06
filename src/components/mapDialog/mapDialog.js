// import BMap from 'BMap'
// import BMapLib from 'BMapLib'

export default {
    name: 'mapDialog',
    /**
     * isShowMap    是否展示地图
     * mapName      地图ID名称
     * modal        弹窗是否需要遮罩层
     * isDraw       是否有绘制地图功能
     * mapPoint     地图标点位置，格式{'addressName':'xxx',point:{"lng":116.384309,"lat":39.92412}}
     * drawPoints   绘图坐标数组，格式[{"lng":116.384309,"lat":39.92412}]
     * centerPoint  地图中心点，格式{"lng":116.384309,"lat":39.92412}
     * hideBtn      是否隐藏操作按钮（确定/取消按钮、地址检索输入框）
     */
    props:['isShowMap','mapPoint','modal','isDraw','mapName','drawPoints','centerPoint','hideBtn','showSure','showCancel','showClear'],
    data() {
        return {
            isShow:false,    //是否展示地图弹窗
            map:null,       //地图对象
            mapText:"",     //地图检索
            overlays:[],  //绘制地图信息
            mapInfo:{},     //地图信息
            name:'map',
        }
    },
    mounted(){
        if(this.mapName)
            this.name += this.mapName;
    },
    methods:{
        /**
         * 初始化
         */
        init(){
            if(this.map&&this.map.Ua){
                this.setMarkPoint();
                this.setDrawPoints();
            };
            this.map = new BMap.Map(this.name);
            if(this.common.isNotBlank(this.centerPoint)){
                var poi = new BMap.Point(this.centerPoint.lng,this.centerPoint.lat);
            }else{
                var poi = new BMap.Point(116.404,39.915);
            }
            this.map.centerAndZoom(poi, 15);
            this.map.enableScrollWheelZoom();    //启动鼠标滚轮操作
            this.initMap();
            if(this.isDraw)
                this.initDraw();    //默认不展示
        },
        /**
         * 初始化地图信息
         */
        initMap(){
            let _this = this;

            this.setMarkPoint();    //父组件有传递坐标时做定位
            this.setDrawPoints();   //父组件有传递绘图数组时绘图

            // 初始化地图点击标点事件
            this.clickMrkPoint();
            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }
            let iptId = "suggestId"+this.name;
            const ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : iptId
                ,"location" : this.map
            });
            ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                let str = "";
                let _value = e.fromitem.value;
                let value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            let myValue;
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                let _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                _this.mapText = myValue;
                G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                _this.setPlace(myValue);
            });
        },
        // 地图点击
        clickMrkPoint(){
            if(this.isDraw) return;
            let _this = this;
            this.map.addEventListener('click', function (e) {
                let point = new BMap.Point(e.point.lng,e.point.lat);
                _this.map.clearOverlays();    //清除地图上所有覆盖物
                _this.setLocation(point);
            });
        },
        /**
         * 坐标点回显
         */
        setMarkPoint(){
            if(this.common.isNotBlank(this.mapPoint)&&this.map&&this.map.Ua){
                this.map.clearOverlays();    //清除地图上所有覆盖物
                let poi = new BMap.Point(this.mapPoint.point.lng,this.mapPoint.point.lat);
                this.map.centerAndZoom(poi, 15);
                let marker = new BMap.Marker(this.mapPoint.point)
                marker.isNotClear = true;//绘制地图不清除标识
                this.map.addOverlay(marker);    //添加标注
                let label = new BMap.Label(this.mapPoint.addressName,{offset:new BMap.Size(20,-15)});
                label.isNotClear = true;//绘制地图不清除标识
	            marker.setLabel(label);
            }
        },
        // 选择检索结果回调
        setPlace(address){
            let _this = this;
            this.map.clearOverlays();    //清除地图上所有覆盖物
            let local = new BMap.LocalSearch(this.map, { //智能搜索
                onSearchComplete: function(){
                    let res = local.getResults().getPoi(0);
                    _this.setLocation(res.point)
                }
            });
            local.search(address);
        },
        /**
         * 地图点击地点回调或者是搜索结果点击回调
         * @param point
         */
        setLocation(point){
            let _this = this;
            const gc = new BMap.Geocoder();//创建地理编码器
            gc.getLocation(point,function(res){
                _this.mapInfo = res;
                _this.map.centerAndZoom(point, 15);
                let marker = new BMap.Marker(point)
                marker.isNotClear = true;//绘制地图不清除标识
                _this.map.addOverlay(marker);    //添加标注
                let label = new BMap.Label(res.address,{offset:new BMap.Size(20,-15)});
                label.isNotClear = true;//绘制地图不清除标识
                marker.setLabel(label);
            });
        },
        // 地图绘制逻辑
        initDraw(){
            let styleOptions = {
                strokeColor:"red",    //边线颜色。
                fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            //实例化鼠标绘制工具
            const drawingManager = new BMapLib.DrawingManager(this.map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    drawingModes:[BMAP_DRAWING_POLYGON]
                },
                circleOptions: styleOptions, //圆的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            });
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            let _this = this;
            drawingManager.addEventListener('overlaycomplete', function(e){
                e.overlay.isNotClear = true;//绘制地图不清除标识
                let allOverlays = _this.map.getOverlays();
                allOverlays.forEach(item => {
                    if (!item.isNotClear){ _this.map.removeOverlay(item); }//清空上一个绘画地图覆盖物
                })
                _this.overlays = e.overlay;
                e.overlay.isNotClear = false;//下次再绘制地图清除标识
            });
        },
        /**
         * 绘制地图回显
         * drawPoints格式[{"lng":116.384309,"lat":39.92412}]
         */
        setDrawPoints(){
            if(this.common.isNotBlank(this.drawPoints)&&this.map&&this.map.Ua){
                if (!isNaN(this.drawPoints))//数值的是绘画圆圈
                {
                    let center = new BMap.Point(this.mapPoint.point.lng,this.mapPoint.point.lat);
                    let circle = new BMap.Circle(center, this.drawPoints, {strokeColor:"red",fillColor:"red", strokeWeight:3, strokeOpacity:0.8});//创建圆形
                    this.map.addOverlay(circle);   //增加多边形
                    this.map.centerAndZoom(center, 15);
                }
                else
                {
                    let arr = [];
                    this.drawPoints.forEach(el=>{
                        arr.push(new BMap.Point(el.lng,el.lat));
                    })
                    let polygon = new BMap.Polygon(arr, {strokeColor:"red",fillColor:"red", strokeWeight:3, strokeOpacity:0.8});  //创建多边形
                    this.map.addOverlay(polygon);   //增加多边形
                    this.map.centerAndZoom(arr[0], 22);
                    this.overlays.ha = arr;
                }
            }
        },
        // 清空地图
        cleanMap(){
            this.mapText = "";
            this.mapInfo = {};
            this.map.clearOverlays();
            this.overlays = [];
        },
        // 确定
        sureMapSite(){
            this.mapInfo.mapText = this.mapText;
            if(this.isDraw)
                this.mapInfo.overlays = this.overlays.ha;
            this.$emit("sureCallback",this.mapInfo)
            this.cancelMap();
        },
        // 取消
        cancelMap(){
            this.mapText = "";
            this.isShow = false;
            this.$emit("hideMapBack",this.mapInfo)
        },
    },
    watch:{
        isShowMap:{
            handler(n,o){
                if(n){
                    this.isShow = true;
                    this.$nextTick(()=>{
                        this.init();
                    })
                }
            }
        },
    }
}
