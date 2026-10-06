export default {
    name: 'mapTrack',
    props:{        
        isHz: {
            type: String,
            default: "",
        },
        resetData:{
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            map:null,       //地图对象
            overlays:[],  //绘制地图信息
            mapInfo:{},     //地图信息
            distancePlan:0, //整体播放进度
            speedPlan:0,    //播放速度
            options:[],
            tmpPoints:[],   //轨迹坐标数据
            tmpPointsTwo:[],
            selectValue:"",
            isPlay:false,   //是否播放轨迹运动
            resetLuShu:true,     //是否重载路书
            currentDate:"",     //实时时间
            currentSpeed:0,     //实时速度
            speed:80,
            speedMark:null,     //超速判断标记
            speedMarks:[
                {label:"选择超速标记",value:null},
                {label:"50km/h",value:50},
                {label:"60km/h",value:60},
                {label:"80km/h",value:80},
                {label:"100km/h",value:100},
            ],
            stayMark:null,     //停留判断标记
            stayMarks:[
                {label:"选择停留标记",value:null},
                {label:"10分钟",value:10},
                {label:"15分钟",value:15},
                {label:"30分钟",value:30},
                {label:"1小时",value:60},
                {label:"2小时",value:120},
                {label:"6小时",value:360},
            ],
            overSpeedPoints:{},     //超速标记数组
            overSpeedMapMark:[],     //超速标记地图mark数组
            stayPoints:{},          //停留标记数组
            stayMapMark:[],          //停留标记地图mark数组
            waybillMap:{},//后台返回对象组
            disabledExport:true,   //数据回来再展示按钮
        }
    },
    async mounted(){
        this.map = new BMap.Map('mapTrackComponent',{ enableMapClick: false} );
        if(!this.resetData){
            this.doQuery();
        }else{            
            this.initMapBase();
        }
    },
    methods:{
        async doQuery(){
            let data = await this.common.postUrl("monitorTF", "locationHis", {waybillId:this.$route.query.waybillId});
            this.initData(data);
        },
        initData(data){
            if (this.common.isNotBlank(data)) {
                this.mapPoint = data.locationList;
                this.workList = data.workList;
                this.waybillMap = data.waybillMap;
                this.disabledExport = false;
                this.initMap();
                this.initWorkListMap();
                if(this.isHz&&this.mapPoint.length==0){
                    let tmpPointsHz = [];
                    this.workList.forEach(el=>{
                        tmpPointsHz.push(new BMap.Point(el.longitude,el.latitude));
                    })
                    // 绘制线
                    let polyline = new BMap.Polyline(tmpPointsHz, {strokeColor:"#FF192C",strokeWeight:3, strokeOpacity:0.8});  //创建多边形
                    this.map.addOverlay(polyline);   //绘制路线轨迹
                    this.map.setViewport(tmpPointsHz);
                }
                this.initMarks();
            }
        },
        /**
         * 设置数据
         * @param {Array} data 
         */
        setData(data){
            this.mapPoint = data;
            this.waybillMap = {
                locationDate:data[0].time,
                speed:data[0].speed,
                startLng_:data[0].longitude,
                startLat_:data[0].latitude,
            }
            let _this = this;
            let point = new BMap.Point(data[0].longitude, data[0].latitude);
            const gc = new BMap.Geocoder();//创建地理编码器
            gc.getLocation(point,function(res){
                if (res && res.address) {
                    _this.waybillMap.location = res.address;
                } else {
                    _this.waybillMap.location = '';
                }
                _this.initMap();
            });
        },
        /**
         * 初始化地图基本设置
         */
        initMapBase(){
            let poi = new BMap.Point(116.404, 39.915);
            this.map.centerAndZoom(poi, 15);
            this.map.enableScrollWheelZoom();    //启动鼠标滚轮操作
        },
        /**
         * 初始化地图信息
         */
        initMap(){
            this.mapPoint.forEach(el=>{
                this.tmpPoints.push(new BMap.Point(el.longitude,el.latitude));
                this.tmpPointsTwo.push(el);
            })
            // 绘制线
            let polyline = new BMap.Polyline(this.tmpPoints, {strokeColor:"#1990ff",strokeWeight:3, strokeOpacity:0.8});  //创建多边形
            this.map.addOverlay(polyline);   //绘制路线轨迹
            this.map.centerAndZoom(this.tmpPoints[0], 15);
            //设置车辆图标
            this.setCarMark();
            //启动鼠标滚轮操作
            this.map.enableScrollWheelZoom();
        },
        //设置车辆图标
        setCarMark(){
            // 先清除之前的车辆图标
            if(this.carMark) {
                this.map.removeOverlay(this.carMark);
                this.carMark = null;
            }

            if(this.common.isNotBlank(this.waybillMap.startLng_)){
                const myIcon = new BMap.Icon("/static/image/car.png", new BMap.Size(48, 24), {    //小车图片
                    imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
                });
                var carPoint =  new BMap.Point(this.waybillMap.startLng_,this.waybillMap.startLat_);
                this.carMark = new BMap.Marker(carPoint, { icon: myIcon});
                this.map.addOverlay(this.carMark);
                let {locationDate,speed,location} = this.waybillMap;
                let html= `
                    <div style="
                    border:solid 1px #999;
                    min-width:50px;
                    position:absolute;
                    background:#fff;
                    border-radius: 3px;
                    padding:5px;
                    white-space: nowrap;
                    bottom:0;
                    transform: translateX(-50%);
                    -webkit-transform: translateX(-50%);
                    ">
                    <div>
                    <div class="iw-g-font">定位时间：${locationDate}</div>
                    <div class="iw-g-font">速度：${speed?speed:0}km/h</div>
                    <div class="iw-g-font">当前位置：${location}</div>
                    </div>
                    `
                let labelgps = new BMap.Label(html,{offset:new BMap.Size(10,-20),position:carPoint});
                labelgps.setStyle({ //给label设置样式，任意的CSS都是可以的
                    backgroundColor: "rgba(0,0,0,0)",
                    color: "#FFFFFF",
                    border:"0",
                    zIndex:9999
                });
                this.carMark.setLabel(labelgps);
            }else{
                var carPoint =  new BMap.Point(113.451602,23.165501);
            }
            this.map.centerAndZoom(carPoint, 15);

        },
        // 初始化作业点标点
        initWorkListMap(){
            const myStartIcon = new BMap.Icon("/static/image/map_mark.png", new BMap.Size(25, 37), {    //小车图片
                anchor: new BMap.Size(25,37),    //图片的偏移量。为了是图片底部中心对准坐标点。
                imageOffset: new BMap.Size(-63, 0)    //相当于CSS精灵
            });
            const myEndIcon = new BMap.Icon("/static/image/map_mark.png", new BMap.Size(25, 37), {    //小车图片
                anchor: new BMap.Size(25,37),    //图片的偏移量。为了是图片底部中心对准坐标点。
                imageOffset: new BMap.Size(-33, 0)    //相当于CSS精灵
            });
            const myMidIcon = new BMap.Icon("/static/image/map_mark.png", new BMap.Size(25, 37), {    //小车图片
                anchor: new BMap.Size(25,37),    //图片的偏移量。为了是图片底部中心对准坐标点。
                imageOffset: new BMap.Size(-94, 0)    //相当于CSS精灵
            });
            this.workList.forEach((el,index)=>{
                let point = new BMap.Point(el.longitude,el.latitude);
                if(index==0){
                    var myIcon = new BMap.Marker(point, { icon: myStartIcon});
                }else if(index==this.workList.length-1){
                    var myIcon = new BMap.Marker(point, { icon: myEndIcon});
                }else{
                    var myIcon = new BMap.Marker(point, { icon: myMidIcon});
                }
        		this.map.addOverlay(myIcon);
            })
        },
        // 初始化/重载路书
        initLuShu(){
            const myIcon = new BMap.Icon("/static/image/car.png", new BMap.Size(48, 24), {    //小车图片
                //offset: new BMap.Size(0, -5),    //相当于CSS精灵
                imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
            });
            this.lushu = new BMapLib.LuShu(this.map, this.tmpPoints, {
                icon:myIcon,
                defaultContent: "1",//"这里显示固定的内容，已经改了路书原有实现，显示地址加进入时间"
                autoView: true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                speed: this.speed*10,
                enableRotation: true,//是否设置marker随着道路的走向进行旋转
                landmarkPois:[],//必须要定义,如果没有要显示的点话,就写成[],不能为空,否则会无法运行.
            },this.tmpPointsTwo,this.runBack);
        },
        runBack(current){
            this.currentSpeed = current.speed;
            this.currentDate = current.time;
            if(this.lushu.i==this.lushu._path.length) this.resetLuShu = true;
            // 更新车辆轨迹进度
            let currentPlan = this.lushu.i/this.lushu._path.length;
            this.distancePlan = Number(currentPlan*100);
        },
        // 播放/重新播放
        play(){
            if(this.common.isBlank(this.mapPoint)||this.mapPoint.length==0){
                this.$message("该派车单没有路线轨迹");
                return;
            }
            if(this.common.isBlank(this.lushu)||this.resetLuShu){
                let carPoint =  new BMap.Point(this.tmpPoints[0].lng,this.tmpPoints[0].lat);
                this.map.centerAndZoom(carPoint, 15);
                this.map.removeOverlay(this.carMark);
                this.initLuShu();
                this.resetLuShu = false;
                this.sliderInter = undefined;
                this.distancePlan = 0;
            }
            this.lushu.start();
            this.isPlay = true;
        },
        // 暂停
        pause(){
            this.lushu.pause();
            this.isPlay = false;
        },
        // 停止
        reset(){
            this.lushu.stop();
            this.isPlay = false;
            this.resetLuShu = true;
            this.speed = 80;
            // 重置进度条位置
            this.distancePlan = 0;
            this.speedPlan = 0;
            // 清除进度条定时器
            if (this.sliderInter) {
                clearInterval(this.sliderInter);
                this.sliderInter = undefined;
            }
            // 重新设置车辆图标
            this.setCarMark();
        },
        // 改变车辆轨迹进度
        distanceMove(data){
            // if(this.distanceMoveDelay){
            //     this.$message({message: '操作过于频繁。',type: 'warning'});
            //     return
            // };
            // this.distanceMoveDelay = true;
            // let timer = setTimeout(() => {
            //     this.distanceMoveDelay = false;
            //     clearTimeout(timer)
            // }, 1000);
            let time = this.lushu._path.length;
            let schedule = parseInt(time*data/100);
            console.log(this.isPlay)
            this.lushu.moveTo(schedule,this.isPlay);
        },
        // 改变轨迹播放速度
        changeSpeed(data){
            if(data==0) data =1;
            let num = Math.ceil(data*10);
            this.lushu.changeSpeed(num,this.isPlay);
        },
        initMarks(){
            let stayPoint = null;
            let haveStayPoint = false;
            console.log(this.tmpPointsTwo);
            this.tmpPointsTwo.forEach((el,index)=>{
                //超速数据生成
                this.speedMarks.forEach(speed => {
                    if(Number(el.speed)>speed.value&&speed.value!=null){
                        if(this.common.isBlank(this.overSpeedPoints['speed'+speed.value])){
                            this.overSpeedPoints['speed'+speed.value] = [];
                        }
                        this.overSpeedPoints['speed'+speed.value].push(el);
                    }
                });
                // 停留数据生成
                if(Number(el.speed)==0&&!haveStayPoint){
                    stayPoint = this.common.copyObj(el);
                    haveStayPoint = true;
                }else if(Number(el.speed)>5&&haveStayPoint){
                    let timeTamp = new Date(el.time) - new Date(stayPoint.time);
                    let minTamp = Math.floor(timeTamp/1000/60);
                    haveStayPoint = false;
                    this.stayMarks.forEach(stay => {
                        if(minTamp>stay.value&&stay.value!=null){
                            if(this.common.isBlank(this.stayPoints['stay'+stay.value])){
                                this.stayPoints['stay'+stay.value] = [];
                            }
                            stayPoint.beginTime = stayPoint.time;   //进入时间
                            stayPoint.endTime = el.time;            //离开时间
                            stayPoint.TLTime = minTamp;             //停留时间
                            this.stayPoints['stay'+stay.value].push(stayPoint);
                        }
                    });
                }
            })
        },
        changeCS(value) {//超速标记
    		for (let i = 0; i < this.overSpeedMapMark.length; i++){
    			let maker = this.overSpeedMapMark[i];
    			this.map.removeOverlay(maker);
    		}
            if(this.common.isBlank(value)){
                return
            }
            this.overSpeedMapMark = [];
            let points = this.overSpeedPoints['speed'+value]
            if(this.common.isBlank(points)){
                this.$message("没有此超速标记")
                return
            }
        	for(let i=0;i<points.length;i++){//超速标记
        		let point = new BMap.Point(points[i].longitude,points[i].latitude);
                const myIcon = new BMap.Icon("/static/image/map_mark.png", new BMap.Size(25, 37), {    //小车图片
                    anchor: new BMap.Size(25,37),    //图片的偏移量。为了是图片底部中心对准坐标点。
                    imageOffset: new BMap.Size(0, 0)    //相当于CSS精灵
                });
        		let markergps = new BMap.Marker(point, { icon: myIcon});
        		this.addMarkerLabelCS(markergps,point,points[i].time,points[i].speed,points[i].location);
        		this.overSpeedMapMark.push(markergps);
        		this.map.addOverlay(markergps);
        	}
        },
        addMarkerLabelCS:function(markergps,point,time,speed,location){
        	speed = speed+"KM/H";
            let html=
                '<div style="position: absolute;top: -94px;left: -140px;z-index:9999;">'+
                '<div class="iwContainer" style="height: 90px;padding: 10px 20px 0;width: 300px;">'+
                '<div class="iwRichContainer"><div class="iw-g-font">定位时间：'+time+'</div></div>'+
                '<div class="iwRichContainer"><div class="iw-g-font">速度：'+speed+'</div></div>'+
                '<div class="iwRichContainer"><div class="iw-g-font">当前位置：'+location+'</div></div>'+
                '<div class="iwFooterContainer">'+
                '</div>'+
                '</div>';
            let labelgps = new BMap.Label(html,{offset:new BMap.Size(10,-20),position:point});
            labelgps.setStyle({ //给label设置样式，任意的CSS都是可以的
                backgroundColor: "rgba(0,0,0,0)",
                color: "#FFFFFF",
                border:"0",
                zIndex:9999
            });
            markergps.addEventListener('mouseover', function(){
                markergps.setLabel(labelgps);
            });
            markergps.addEventListener("mouseout",function(e){
                this.map.removeOverlay(labelgps);
            });
        },
        changeTL(value) {//停留标记
    		for (let i = 0; i < this.stayMapMark.length; i++){
    			let maker = this.stayMapMark[i];
    			this.map.removeOverlay(maker);
    		}
            if(this.common.isBlank(value)){
                return
            }
            this.stayMapMark = [];
            let points = this.stayPoints['stay'+value];
            if(this.common.isBlank(points)){
                this.$message("没有此停留标记")
                return
            }
        	for(let i=0;i<points.length;i++){//超速标记
        		let point = new BMap.Point(points[i].longitude,points[i].latitude);
                const myIcon = new BMap.Icon("/static/image/map_mark.png", new BMap.Size(36, 37), {    //小车图片
                    anchor: new BMap.Size(36,37),    //图片的偏移量。为了是图片底部中心对准坐标点。
                    imageOffset: new BMap.Size(-124, 0)    //相当于CSS精灵
                });
        		let markergps = new BMap.Marker(point, { icon: myIcon});
        		this.addMarkerLabelTL(markergps,point,points[i].beginTime,points[i].endTime,points[i].TLTime,points[i].location);
        		this.stayMapMark.push(markergps);
        		this.map.addOverlay(markergps);
        	}
        },
        addMarkerLabelTL:function(markergps,point,beginTime,endTime,TLTime,location){
            var html=
                '<div style="position: absolute;top: -94px;left: -140px;z-index:9999;">'+
                '<div class="iwContainer" style="height: 110px;padding: 10px 0 0 20px;width: 300px;">'+
                '<div class="iwRichContainer"><div class="iw-g-font">进入时间：'+beginTime+'</div></div>'+
                '<div class="iwRichContainer"><div class="iw-g-font">离开时间：'+endTime+'</div></div>'+
                '<div class="iwRichContainer"><div class="iw-g-font">停留时间：'+TLTime+'分钟</div></div>'+
                '<div class="iwRichContainer"><div class="iw-g-font">地址：'+location+'</div></div>'+
                '<div class="iwFooterContainer">'+
                '</div>'+
                '</div>';
            var labelgps = new BMap.Label(html,{offset:new BMap.Size(10,-20),position:point});
            labelgps.setStyle({ //给label设置样式，任意的CSS都是可以的
                backgroundColor: "rgba(0,0,0,0)",
                color: "#FFFFFF",
                border:"0",
                zIndex:9999
            });
            markergps.addEventListener('mouseover', function(){
                markergps.setLabel(labelgps);
            });
            markergps.addEventListener("mouseout",function(e){
                this.map.removeOverlay(labelgps);
            });
        },
        // 导出车辆轨迹数据
        exportExcel(){
            if(this.common.isBlank(this.mapPoint) || this.mapPoint.length==0){
                this.$message.error("该车辆没有运行轨迹！");
                return
            }
            this.disabledExport = true;
            let headList = [
                {name:"定位时间",code:"time"},
                {name:"当前位置",code:"location"},
                {name:"当前纬度",code:"latitude"},
                {name:"当前经度",code:"longitude"},
                {name:"当前速度",code:"speed"},
            ];
            this.common.frontDownloadExcelFile('车辆轨迹',headList,this.mapPoint);
            // 防抖
            let _this = this;
            let timer = setTimeout(()=>{
                _this.disabledExport = false;
                clearTimeout(timer);
            },2000)
        },
    },
}
