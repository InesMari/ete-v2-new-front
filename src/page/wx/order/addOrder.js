import { Icon,Button,DatetimePicker,Popup,Picker,Stepper,Switch,Field,Overlay,Loading } from 'vant';
import 'vant/lib/index.css';
import mycityH5 from '@/components/mycityH5/mycityH5.vue'

export default {
    name: 'addOrder',
    data() {
        return {
            step:1,
            bizTypeData:[], // 业务类型
            vehicleLengthData:[],   //车长
            vehicleTypeData:[], //车型
            payModeData:[], //结算方式
            identifyText:"",    //地址识别
            info:{},
            siteInfo:{},
            workListTi:[{}],    //提货地址列表
            workListXie:[{}],   //卸货地址列表
            showPickerTime:false,
            showVehicle:false,
            showPickerPayMode:false,
            showOverlay:false,  //遮罩层
            currentDate:new Date(),
            datetimes:[],//时间日期数据
            codeValid:0, //二维码是否有效
        }
    },
    components: {
        mycityH5,
        [Icon.name]:Icon,
        [Button.name]: Button,
        [DatetimePicker.name]: DatetimePicker,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Stepper.name]: Stepper,
        [Switch.name]: Switch,
        [Field.name]: Field,
        [Overlay.name]: Overlay,
        [Loading.name]: Loading,
    },
    async mounted(){
        this.setMeta();
        await this.checkQRCodeID();
        if(this.codeValid == 1){
            this.initData();
            this.initPickerDates();
        }
    },
    methods: {
        // 检查二维码是否失效
        async checkQRCodeID(){
			this.codeValid  = await this.common.postUrl("orderService", "checkQRCodeID",{QRCodeID:this.$route.query.code});
        },
        async initData(){
			//车型
			let vehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_TYPE_QUOTE"});
            vehicleTypeData.forEach(el => {
                if(el.codeValue == 2 || el.codeValue == 5 || el.codeValue == 10){
                    if(el.codeValue == 5){
                        this.info.vehicleType = el.codeValue;
                        this.info.vehicleTypeName = el.codeName;
                        el.active = true;
                    }
                    this.vehicleTypeData.push(el);
                    this.vehicleTypeDataCache = this.common.copyObj(this.vehicleTypeData);
                }
            })
			//车长
			let vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_LENGTH"});
            vehicleLengthData.forEach(el => {
                if(el.codeName == "9.6m" || el.codeName == "16.5m"){
                    if(el.codeName == "9.6m"){
                        this.info.vehicleLength = el.codeValue;
                        this.info.vehicleLengthName = el.codeName;
                        el.active = true;
                    }
                    this.vehicleLengthData.push(el);
                    this.vehicleLengthDataCache = this.common.copyObj(this.vehicleLengthData);
                }
            })
			//结算方式，默认回单付
			this.payModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_MODE"});
            this.info.payMode = 4;
            this.info.payModeName = this.payModeData[3].codeName;
            // 业务类型
            let bizTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BIZ_TYPE"});
            bizTypeData[0].active = true;
            this.info.bizType = bizTypeData[0].codeValue;
            this.bizTypeData = [bizTypeData[0],bizTypeData[1]];
        },
        setMeta(){
            let metaElement = document.createElement('meta');  
            metaElement.name = 'viewport';  
            metaElement.content = 'width=device-width,height=device-height, initial-scale=1,target-densitydpi=device-dpi,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no';  
            document.head.appendChild(metaElement); 
        },
        /**
         * 生成日期时间选择数据
         */
        initPickerDates(){
            // 生成日期
            let today = new Date(); // 获取当前日期  
            let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // 获取明天的日期  
            let dayCount = 0;
            let dates = [];//日期数组
            while (dayCount < 30) { // 30天
                const year = tomorrow.getFullYear();  
                const month = tomorrow.getMonth() + 1;  
                const day = tomorrow.getDate();
                if(dayCount == 0){
                    var codeName = '今天'
                }else if(dayCount == 1){
                    var codeName = '明天'
                }else{
                    var codeName = `${month}月${day}日`;
                }
                let codeValue = `${year}-${month}-${day}`
                dates.push({codeName,codeValue});
                tomorrow.setDate(tomorrow.getDate() + 1); // 将日期加1天  
                dayCount++;  
            } 
            // 生成小时
            let hours = [];
            let hourCount = 0;
            while(hourCount < 24){
                hours.push({codeName:hourCount,codeValue:String(hourCount).padStart(2,'0')});
                hourCount++;
            }
            // 生成分钟
            let minutes = [];
            let minuteCount = 0;
            while(minuteCount < 60){
                let min = String(minuteCount).padStart(2,'0')
                minutes.push({codeName:min,codeValue:min})
                minuteCount += 10;
            }
            
            //设置数值
            this.datetimes = [
                {
                    values:dates,
                },
                {
                    values:hours,
                },
                {
                    values:minutes,
                },
            ]
        },
        // 地址识别
        async identify(){
            this.showOverlay = true;
            let addressStr = this.siteInfo.identifyText.replace(/[\r\n ]/g, "");
            let res = await this.common.postUrl("commonTF", "getSplitAddress", {addressStr},null,null,null,true).catch(err => {
                this.$message.error("地址识别有误")
                this.showOverlay = false;
            });
            this.siteInfo.linkmanName = res.linkmanName;
            this.siteInfo.phone = res.bill;
            this.siteInfo.provinceId = res.workinfo.provinceId;
            this.siteInfo.provinceName = res.workinfo.province;
            this.siteInfo.cityId = res.workinfo.cityId;
            this.siteInfo.cityName = res.workinfo.city;
            this.siteInfo.districtId = res.workinfo.districtId;
            this.siteInfo.districtName = res.workinfo.district;
            this.siteInfo.address = res.workinfo.address;
            this.$refs.mycity.setData(this.siteInfo);
            this.$forceUpdate();
            this.showOverlay = false;
        },
        // 地址选择回调
        confirmSitePick(data){
            this.siteInfo = this.common.mergeObj(this.siteInfo,data);
        },
        // 选择业务类型、车长、车型
        pickData(index,data,code){
            data.forEach((item,i) => {
                if(index == i){
                    item.active = true;
                }else{
                    item.active = false;
                }
            })
            this.info[code] = data[index].codeValue;
        },
        /**
         * 选择时间
         * @param {Picker 实例} picker 
         * @param {所有列选中值} value 
         * @param {当前列对应的索引} index 
         */
        confirmDatetime(picker,value,index){
            let day = this.datetimes[0].values[value[0]];
            let hour = this.datetimes[1].values[value[1]];
            let min = this.datetimes[2].values[value[2]];
            this.info.loadingTimeName = `${day.codeName} ${hour.codeName}:${min.codeName}`;
            this.info.loadingTime = `${day.codeValue} ${hour.codeValue}:${min.codeValue}`;
            this.showPickerTime = false;
        },
        // 填写地址
        setSite(item,type,index){
            item.index = index;
            item.workType = type;
            this.siteInfo = this.common.copyObj(item);
            this.$refs.mycity.setData(this.siteInfo);
            if(type==1){
                this.siteInfo.title = "装货地信息"
            }
            if(type==2){
                this.siteInfo.title = "卸货地信息"
            }
            this.step = 2;
        },
        /**
         * 新增地址
         * @param {1：装货，2：卸货} type 
         */ 
        addSite(type){
            if(type == 1){  
                this.workListTi.push({});
            }
            if(type == 2){
                this.workListXie.push({});
            }
        },
        /**
         * 删除地址
         * @param {1：装货，2：卸货} type 
         */ 
        delSite(type,index){
            if(type == 1){  
                this.workListTi.splice(index,1);
            }
            if(type == 2){
                this.workListXie.splice(index,1);
            }
        },
        // 清空地址信息
        cleanSiteInfo(){
            this.$refs.mycity.clean();
            let {index,workType,title} = this.siteInfo;
            let siteInfo = {index,workType,title};
            this.siteInfo = siteInfo;
        },
        backHome(){
            this.step = 1;
        },
        // 确认地址选择
        sureSite(){
            if(this.common.isBlank(this.siteInfo.districtId)){
                this.$message.error("请选择省市区");
                return
            }
            if(this.common.isBlank(this.siteInfo.address)){
                this.$message.error("请输入详细地址")
                return
            }
            if(this.common.isBlank(this.siteInfo.linkmanName)){
                this.$message.error("请输入联系人姓名")
                return
            }
            if(this.common.isBlank(this.siteInfo.phone)){
                this.$message.error("请输入联系人电话")
                return
            }
            this.step = 1;
            this.$refs.mycity.clean();
            // 设置值
            let {index,workType} = this.siteInfo;
            if(workType == 1){
                this.workListTi[index] = this.common.copyObj(this.siteInfo);
            }
            if(workType == 2){
                this.workListXie[index] = this.common.copyObj(this.siteInfo);
            }
        },
        // 取消车型车长确认选择
        cancelVehiclePick(){
            this.showVehicle = false;
            this.vehicleTypeData = this.common.copyObj(this.vehicleTypeDataCache);
            this.vehicleLengthData = this.common.copyObj(this.vehicleLengthDataCache);   
        },
        // 车型车长确认选择
        sureVehiclePick(){
          this.showVehicle = false;
          this.vehicleTypeDataCache = this.common.copyObj(this.vehicleTypeData);
          this.vehicleLengthDataCache = this.common.copyObj(this.vehicleLengthData);
          this.vehicleTypeData.forEach(item => {
            if(item.active){
                this.info.vehicleType = item.codeValue;
                this.info.vehicleTypeName = item.codeName;
            }
          })
          this.vehicleLengthData.forEach(item => {
            if(item.active){
                this.info.vehicleLength = item.codeValue;
                this.info.vehicleLengthName = item.codeName;
            }
          })
        },
        // 确认选择结算主体
        confirmPayMode(data){
            this.showPickerPayMode = false;
            this.info.payMode = data.codeValue;
            this.info.payModeName = data.codeName;
        },
        // 填写完整信息
        next(){
            for(let item of this.workListTi){
                if(this.common.isBlank(item.cityId)){
                    this.$message.error("请填写装货地信息")
                    return
                    break;
                }
            }
            for(let item of this.workListXie){
                if(this.common.isBlank(item.cityId)){
                    this.$message.error("请填写卸货地信息")
                    return
                    break;
                }
            }
            if(this.common.isBlank(this.info.loadingTime)){
                this.$message.error("请选择装货时间")
                return
            }
            this.step = 3;
        },
        // 确认下单
        async save(){
            this.info.workList = [...this.workListTi,...this.workListXie];
            this.info.haveReceipt = this.info.haveReceipt?'1':'0';
            this.info.isInvoice = this.info.isInvoice?'1':'0';
            this.info.QRCodeID = this.$route.query.code;
            if(this.common.isBlank(this.info.goodsName)){
                this.$message.error("请输入货物名称")
                return
            }
            if(this.info.weight==0 && this.info.volume==0){
                this.$message.error("总重量/体积至少填写一项")
                return
            }
            if(this.common.isBlank(this.info.freight)){
                this.$message.error("请输入您的出价")
                return
            }
            this.showOverlay = true;
            let _this = this;
            this.common.postUrl("orderService", "saveOrder", this.info,function(){
                _this.step = 4;
                _this.showOverlay = false;
            },function(){
                _this.showOverlay = false;
            });
            
        }
    }
}