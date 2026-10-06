import { Popup,Picker } from 'vant';
export default {
    name: 'mycityH5',
    props: ["disabled", "placeholder", "value"],
    data() {
        return {
            showPicker:false,
            siteInfoCache:{},
            siteInfo:{},
            provinceIndex:0,
            cityIndex:0,
            districtIndex:0,
            columns:[
                {
                    children:[
                        {
                            children:[]
                        }
                    ]
                }
            ],
        }
    },
    mounted() {
        this.initData();
    },
    components: {
        [Popup.name]: Popup,
        [Picker.name]: Picker,
    },
    methods: {
        // 初始化数据
        async initData(){
            await this.getProvince();
            if(this.common.isNotBlank(this.value) && this.common.isNotBlank(this.siteInfo.provinceId)){     //有传默认值                
                this.setData(this.value);
            }else{
                await this.getCitys(this.province[0].id);
                await this.getDistrict(this.cityData[0].id);
                
                this.columns = this.province;
                this.columns[0].children = this.common.copyObj(this.cityData);
                this.columns[0].children[0].children = this.common.copyObj(this.districtData);
            }
        },
        // 设置地址
        async setData(value){
            let siteInfo = this.common.copyObj(value);
            let {provinceId,cityId,districtId} = siteInfo;
            if(this.common.isNotBlank(provinceId)){
                await this.getCitys(provinceId);
                // 遍历获取index回显选择
                this.province.forEach((item,index) => {
                    if(item.id == provinceId){
                        this.provinceIndex = index;
                        siteInfo.provinceName = item.name;
                    }
                })
            }else{
                this.provinceIndex = 0;
            }
            if(this.common.isNotBlank(cityId)){
                await this.getDistrict(cityId);
                this.cityData.forEach((item,index) => {
                    if(item.id == cityId){
                        this.cityIndex = index;
                        siteInfo.cityName = item.name;
                    }
                })
            }else{
                this.cityIndex = 0;
            }

            if(this.common.isNotBlank(districtId)){
                this.districtData.forEach((item,index) => {
                    if(item.id == districtId){
                        this.districtIndex = index;
                        siteInfo.districtName = item.name;
                    }
                })
            }else{
                this.districtIndex = 0;
            }

            this.siteInfo = siteInfo;
        },
        /**
         * 选择关联
         * @param {Picker 实例} picker 
         * @param {所有列选中值} value 
         * @param {当前列对应的索引} index 
         */
        async change(picker,value,index){
            if(index == 2){
                this.districtData.forEach((item,index) => {
                    if( item.name == value[2]){
                        // 记录值
                        this.siteInfoCache.districtId = item.id;
                        this.siteInfoCache.districtName = item.name;
                        this.districtIndex = index;
                    }
                })
                return; //选择区不用跑后台查询
            }

            for(let provinceIndex in this.columns){
                let item = this.columns[provinceIndex];
                if(item.name == value[0]){
                    if(index == 0){  //选择省
                        let cityData = await this.getCitys(item.id);
                        let districtData = await this.getDistrict(cityData[0].id);
                        item.children = this.common.copyObj(cityData);
                        item.children[0].children = this.common.copyObj(districtData);
                        picker.setIndexes([provinceIndex,0,0]); //刷新二级列表
                        this.provinceIndex = provinceIndex;
                        // 记录值
                        this.siteInfoCache = {
                            provinceId: item.id,
                            provinceName: item.name,
                            cityId: cityData[0].id,
                            cityName: cityData[0].name,
                            districtId: districtData[0].id,
                            districtName: districtData[0].name,
                        }                        
                        this.$forceUpdate();
                    }
                    if(index == 1){  //选择市
                        for(let cityIndex in item.children){
                            let city = item.children[cityIndex];
                            if(city.name == value[1]){
                                let districtData = await this.getDistrict(city.id);
                                city.children = this.common.copyObj(districtData);
                                picker.setIndexes([provinceIndex,cityIndex,0]); //刷新三级列表
                                this.provinceIndex = provinceIndex;
                                this.cityIndex = cityIndex;
                                // 记录值
                                this.siteInfoCache = {
                                    provinceId: item.id,
                                    provinceName: item.name,
                                    cityId: city.id,
                                    cityName: city.name,
                                    districtId: districtData[0].id,
                                    districtName: districtData[0].name,
                                }              
                                this.$forceUpdate();
                            }
                        }
                    }
                }
            }
        },
        initPicker(){
            this.showPicker = true;
            if(this.common.isBlank(this.siteInfoCache.provinceId)){
                this.siteInfoCache = {
                    provinceId: this.province[0].id,
                    provinceName: this.province[0].name,
                    cityId: this.cityData[0].id,
                    cityName: this.cityData[0].name,
                    districtId: this.districtData[0].id,
                    districtName: this.districtData[0].name,
                }
            }else{
                let {provinceIndex,cityIndex,districtIndex} = this;
                this.$nextTick(()=>{
                    this.$refs.picker.setIndexes([provinceIndex,cityIndex,districtIndex]);
                })
            }
        },
        // 取消选择
        cancel(){
            this.showPicker = false;
            this.siteInfoCache = this.common.copyObj(this.siteInfo);
            this.setData(this.siteInfo);
        },
        // 确认选择
        onConfirm(){
            this.showPicker = false;
            this.siteInfo = this.common.copyObj(this.siteInfoCache);
            this.$emit("successCallback",this.siteInfo);
            this.setData(this.siteInfo);
        },
        //获取省数据
        async getProvince() {
            let items = await this.common.postUrl("selectStaticDataTF","selectProvince",{});
            this.province = items;
            return items;
        },
        //创建地市数据
        async getCitys(provinceId) {
            let items = await this.common.postUrl("selectStaticDataTF","selectCity",{provinceId});
            this.cityData = items;
            return items;
        },
        //获取县区数据
        async getDistrict(cityId) {
            let items = await this.common.postUrl("selectStaticDataTF","selectDistrict",{cityId});
            this.districtData = items;
            return items;
        },
        // 获取街道信息
        async getStreet(districtId) {
            let items = await this.common.postUrl("selectStaticDataTF","selectStreet",{districtId});
            this.streetData = items;
            return items;
        },
        clean(){
            this.siteInfo = {};
            this.siteInfoCache = {};
        },
    },
}
