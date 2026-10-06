import tableCommon from "@/components/table/tableCommon.vue";
import mapDialog from "@/components/mapDialog/mapDialog.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'transportationCostInfo',
    data()
    {
        return {
            info: this.initInfo(),
            id: this.$route.query.id,
            type: this.$route.query.type,
            provinceData: [],
            beginCityData: [],
            beginDistrictData: [],
            endCityData: [],
            endDistrictData: [],
            vehicleLengthData: [],
            energyTypeData: [],
            beginMapVisible: false,
            endMapVisible: false,
            beginDistrictDisabled: true,
            endDistrictDisabled: true,
            
            isVisible: this.$route.query.id > 0 && this.$route.query.type > 2,
            beginMapPoint:null,
            endMapPoint:null,
        }
    },
    computed: {},
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        if (this.$route.query.id)
        {
            this.loadDataById(this.$route.query.id);
        }
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        mapDialog,
        myFileModel,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo()
        {
            return this.info = {
                beginProvinceId: null,
                beginCityId: null,
                beginDistrictId: null,
                beginAddress: null,
                endProvinceId: null,
                endCityId: null,
                endDistrictId: null,
                endAddress: null,
                mileage: null,
                driverSalary: null,
                driverCount: null,
                socialSecurity: null,
                commercialInsurance: null,
                heavyTrafficInsurance: null,
                depreciation: null,
                gpsServiceCharge: null,
                ureaFee: null,
                vehicleLength: null,
                energyType: null,
                oilFee: null,
                roadBridgeFee: null,
                repairFee: null,
                maintenance: null,
                tire: null,
                vehicleCount: null,
                manageCost: null,
                monthTimes: null,
                cost: null,
                transportationCost: null,
                amount: null,
                remark: null,
            };
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'VEHICLE_LENGTH,ENERGY_TYPE'});
            this.vehicleLengthData = data.VEHICLE_LENGTH;
            this.energyTypeData = data.ENERGY_TYPE;
            this.provinceData = await this.common.postUrl("selectStaticDataTF", "selectProvince", {});
        },
        async loadDataById(id)
        {
            let data = await this.common.postUrl('standardCostTransportationService', 'loadStandardCostTransportationById', {id});
            this.info = data.info;
            this.info.vehicleLength = data.info.vehicleLength + "";
            this.info.energyType = data.info.energyType + "";
            await this.loadCity(this.info.beginProvinceId, 1);
            await this.loadDistrict(this.info.beginCityId, 1);
            await this.loadCity(this.info.endProvinceId, 2);
            await this.loadDistrict(this.info.endCityId, 2);
            
            this.beginMapPoint = {
                addressName: data.info.beginAddressStr,
                point:{
                    "lng": data.info.beginLongitude,
                    "lat": data.info.beginLatitude
                }
            };
            this.endMapPoint = {
                addressName: data.info.endAddressStr,
                point:{
                    "lng": data.info.endLongitude,
                    "lat": data.info.endLatitude
                }
            };
            
            this.$forceUpdate();
        },
        showMap(type, value)
        {
            if (type == 1)
                this.beginMapVisible = value;
            else
                this.endMapVisible = value;
            this.$forceUpdate();
        },
        hideMapBack(data,type){
            this.showMap(type, false);
        },
        sureBeginAddress(data)
        {
            this.sureAddress(data, 1);
            this.showMap(1, false);
        },
        sureEndAddress(data)
        {
            this.sureAddress(data, 2);
            this.showMap(2, false);
        },
        async sureAddress(data, type)
        {
            let addressInfo = data.addressComponents;
            let point = data.point;
            if (this.common.isNotBlank(point))
            {
                if (type == 1)
                {
                    this.info.beginLatitude = point.lat;
                    this.info.beginLongitude = point.lng;
                }
                else
                {
                    this.info.endLatitude = point.lat;
                    this.info.endLongitude = point.lng;
                }
                //计算里程
                this.calcMileage();
            }
            if (this.common.isNotBlank(addressInfo))
            {
                if (type == 1)
                {
                    this.info.beginAddress = addressInfo.street + addressInfo.streetNumber;
                    this.beginDistrictDisabled = true;
                }
                else
                {
                    this.info.endAddress = addressInfo.street + addressInfo.streetNumber;
                    this.endDistrictDisabled = true;
                }
                if (this.common.isNotBlank(addressInfo.province))
                {
                    let provinceId = await this.common.postUrl("selectStaticDataTF", "getProvinceId", {"codeValueName": addressInfo.province});
                    if (provinceId > 0)
                    {
                        if (type == 1)
                            this.info.beginProvinceId = Number(provinceId);
                        else
                            this.info.endProvinceId = Number(provinceId);
                        await this.loadCity(provinceId, type);
                        if (this.common.isNotBlank(addressInfo.city))
                        {
                            let cityId = await this.common.postUrl("selectStaticDataTF", "getCityId", {"codeValueName": addressInfo.city});
                            if (cityId > 0)
                            {
                                if (type == 1)
                                    this.info.beginCityId = Number(cityId);
                                else
                                    this.info.endCityId = Number(cityId);
                                await this.loadDistrict(cityId, type);
                                if (this.common.isNotBlank(addressInfo.district))
                                {
                                    let districtId = await this.common.postUrl("selectStaticDataTF", "getDistrictId", {
                                        "codeValueName": addressInfo.district,
                                        "cityId": cityId
                                    });
                                    if (districtId > 0)
                                    {
                                        if (type == 1)
                                        {
                                            this.info.beginDistrictId = Number(districtId);
                                            this.beginMapPoint = {
                                                addressName: data.address,
                                                point:{
                                                    "lng": point.lng,
                                                    "lat": point.lat
                                                }
                                            };
                                        }
                                        else
                                        {
                                            this.info.endDistrictId = Number(districtId);
                                            this.endMapPoint = {
                                                addressName: data.address,
                                                point:{
                                                    "lng": point.lng,
                                                    "lat": point.lat
                                                }
                                            };
                                        }
                                    }
                                    else
                                    {
                                        this.$message.error("很抱歉，系统地址库没有区县:" + addressInfo.district + "，请联系管理人员。");
                                    }
                                }
                                else
                                {
                                    if (type == 1)
                                        this.beginDistrictDisabled = false;
                                    else
                                        this.endDistrictDisabled = false;
                                }
                            }
                            else
                                this.$message.error("系统城市信息有误，请联系管理人员！");
                        }
                        else
                            this.$message.error("选择地址百度地图无法识别城市，请重新选择！");
                    }
                    else
                        this.$message.error("系统省份信息有误，请联系管理人员！");
                }
                else
                    this.$message.error("选择地址百度地图无法识别省份，请重新选择！");
            }
            this.$forceUpdate();
        },
        async calcMileage()
        {
            this.info.mileage = 0;
            if (this.common.isNotBlank(this.info.beginLatitude)
                && this.common.isNotBlank(this.info.beginLongitude)
                && this.common.isNotBlank(this.info.endLatitude)
                && this.common.isNotBlank(this.info.endLongitude))
            {
                let data = await this.common.postUrl("commonTF", "getBaiduDistance", this.info);
                let value = this.common.accDiv(data.distance, 1000);
                value = this.toFixed(value);
                this.info.mileage = value;
            }
            await this.calcOilFee();
            await this.calcRepairFee();
            await this.calcMaintenance();
        },
        clearAddress()
        {
            this.info.beginProvinceId = null;
            this.info.beginCityId = null;
            this.info.beginDistrictId = null;
            this.info.beginAddress = null;
            this.info.beginAddressStr = null;
            this.info.beginLatitude = null;
            this.info.beginLongitude = null;
            
            this.info.endProvinceId = null;
            this.info.endCityId = null;
            this.info.endDistrictId = null;
            this.info.endAddress = null;
            this.info.endAddressStr = null;
            this.info.endLatitude = null;
            this.info.endLongitude = null;
            this.calcMileage();
        },
        async loadCity(provinceId, type)
        {
            let data = await this.common.postUrl("selectStaticDataTF", "selectCity", {provinceId});
            if (type == 1)
                this.beginCityData = data;
            else
                this.endCityData = data;
        },
        async loadDistrict(cityId, type)
        {
            let data = await this.common.postUrl("selectStaticDataTF", "selectDistrict", {cityId});
            if (type == 1)
                this.beginDistrictData = data;
            else
                this.endDistrictData = data;
        },
        changeDriverSalary()
        {
            this.calcAmount();
        },
        changeDriverCount()
        {
            this.calcAmount();
        },
        changeSocialSecurity()
        {
            this.calcAmount();
        },
        changeCommercialInsurance()
        {
            this.calcAmount();
        },
        changeHeavyTrafficInsurance()
        {
            this.calcAmount();
        },
        changeDepreciation()
        {
            this.calcAmount();
        },
        changeGpsServiceCharge()
        {
            this.calcAmount();
        },
        changeUreaFee()
        {
            this.calcAmount();
        },
        changeVehicleLength()
        {
            this.calcOilFee();
        },
        changeEnergyType()
        {
            this.calcOilFee();
        },
        async calcOilFee()
        {
            let value = 0;
            if (this.common.isNotBlank(this.info.vehicleLength) && this.common.isNotBlank(this.info.energyType))
            {
                let data = await this.common.postUrl("standardCostBaseService", "loadStandardCostBaseInfoList", {
                    "vehicleLength": this.info.vehicleLength,
                    "energyType": this.info.energyType,
                    "type": 1,
                });
                if (data.length > 0 && this.common.isNotBlank(this.info.mileage))
                {
                    value = this.common.accMul(data[0].amount, this.info.mileage);
                    value = this.toFixed(value);
                }
            }
            this.info.oilFee = value;
            this.calcAmount();
        },
        changeRoadBridgeFee()
        {
            this.calcAmount();
        },
        async calcRepairFee()
        {
            let value = 0;
            let data = await this.common.postUrl("standardCostBaseService", "loadStandardCostBaseInfoList", {"type": 2});
            if (data.length > 0 && this.common.isNotBlank(this.info.mileage))
            {
                value = this.common.accMul(data[0].amount, this.info.mileage);
                value = this.toFixed(value);
            }
            this.info.repairFee = value;
            this.calcAmount();
        },
        async calcMaintenance()
        {
            let value = 0;
            let data = await this.common.postUrl("standardCostBaseService", "loadStandardCostBaseInfoList", {"type": 3});
            if (data.length > 0 && this.common.isNotBlank(this.info.mileage))
            {
                value = this.common.accMul(data[0].amount, this.info.mileage);
                value = this.toFixed(value);
            }
            this.info.maintenance = value;
            this.calcAmount();
        },
        changeTire()
        {
            this.calcAmount();
        },
        changeVehicleCount()
        {
            this.calcAmount();
        },
        /**
         * 合计
         */
        calcAmount()
        {
            let value = 0;
            let driverValue = 0;
            if (this.common.isNotBlank(this.info.driverSalary))
                driverValue = this.common.accAdd(driverValue, this.info.driverSalary);
            if (this.common.isNotBlank(this.info.socialSecurity))
                driverValue = this.common.accAdd(driverValue, this.info.socialSecurity);
            if (this.common.isNotBlank(this.info.driverCount))
                driverValue = this.common.accMul(driverValue, this.info.driverCount);
            else
                driverValue = 0;
            value = driverValue;
            
            let otherValue = 0;
            if (this.common.isNotBlank(this.info.commercialInsurance))
                otherValue = this.common.accAdd(otherValue, this.info.commercialInsurance);
            if (this.common.isNotBlank(this.info.heavyTrafficInsurance))
                otherValue = this.common.accAdd(otherValue, this.info.heavyTrafficInsurance);
            if (this.common.isNotBlank(this.info.depreciation))
                otherValue = this.common.accAdd(otherValue, this.info.depreciation);
            if (this.common.isNotBlank(this.info.gpsServiceCharge))
                otherValue = this.common.accAdd(otherValue, this.info.gpsServiceCharge);
            if (this.common.isNotBlank(this.info.ureaFee))
                otherValue = this.common.accAdd(otherValue, this.info.ureaFee);
            if (this.common.isNotBlank(this.info.oilFee))
                otherValue = this.common.accAdd(otherValue, this.info.oilFee);
            if (this.common.isNotBlank(this.info.roadBridgeFee))
                otherValue = this.common.accAdd(otherValue, this.info.roadBridgeFee);
            if (this.common.isNotBlank(this.info.repairFee))
                otherValue = this.common.accAdd(otherValue, this.info.repairFee);
            if (this.common.isNotBlank(this.info.maintenance))
                otherValue = this.common.accAdd(otherValue, this.info.maintenance);
            if (this.common.isNotBlank(this.info.tire))
                otherValue = this.common.accAdd(otherValue, this.info.tire);
            if (this.common.isNotBlank(this.info.vehicleCount))
                otherValue = this.common.accMul(otherValue, this.info.vehicleCount);
            else
                otherValue = 0;
            value = this.common.accAdd(value, otherValue);
            value = this.toFixed(value);
            this.info.amount = value;
            this.calcCost();
        },
        changeMonthTimes()
        {
            this.calcCost();
        },
        calcCost()
        {
            let value = 0;
            if (this.common.isNotBlank(this.info.amount) && this.common.isNotBlank(this.info.monthTimes))
            {
                value = this.common.accDiv(this.info.amount, this.info.monthTimes);
                value = this.toFixed(value);
            }
            this.info.cost = value;
            this.calcTransportationCost();
        },
        changeManageCost()
        {
            this.calcTransportationCost();
        },
        calcTransportationCost()
        {
            let value = 0;
            if (this.common.isNotBlank(this.info.cost) && this.common.isNotBlank(this.info.manageCost))
            {
                let value2 = this.common.accAdd(this.info.manageCost, 100);
                value = this.common.accMul(this.info.cost, value2);
                value = this.common.accDiv(value, 100);
                value = this.toFixed(value);
            }
            this.info.transportationCost = value;
            this.$forceUpdate();
        },
        toFixed(value)
        {
            if (this.common.isNotBlank(value) && !isNaN(value))
            {
                value = value.toFixed(2);
                value = parseFloat(value);
            }
            return value;
        },
        async save()
        {
            if (this.common.isBlank(this.info.beginProvinceId)) {
                this.$message.error("请选择始发地省份！");
                return false;
            }
            if (this.common.isBlank(this.info.beginCityId)) {
                this.$message.error("请选择始发地城市！");
                return false;
            }
            if (this.common.isBlank(this.info.beginDistrictId)) {
                this.$message.error("请选择始发地区县！");
                return false;
            }
            if (this.common.isBlank(this.info.beginAddress)) {
                this.$message.error("请输入始发地街道地址！");
                return false;
            }
            if (this.common.isBlank(this.info.beginLatitude) || this.common.isBlank(this.info.beginLongitude)) {
                this.$message.error("请通过地图选择始发地准确地址！");
                return false;
            }
            if (this.common.isBlank(this.info.endProvinceId)) {
                this.$message.error("请选择目的地省份！");
                return false;
            }
            if (this.common.isBlank(this.info.endCityId)) {
                this.$message.error("请选择目的地城市！");
                return false;
            }
            if (this.common.isBlank(this.info.endDistrictId)) {
                this.$message.error("请选择目的地区县！");
                return false;
            }
            if (this.common.isBlank(this.info.endAddress)) {
                this.$message.error("请输入目的地街道地址！");
                return false;
            }
            if (this.common.isBlank(this.info.endLatitude) || this.common.isBlank(this.info.endLongitude)) {
                this.$message.error("请通过地图选择目的地准确地址！");
                return false;
            }
            if (this.common.isBlank(this.info.mileage)) {
                this.$message.error("请通过地图选择始发地-目的地获取里程！");
                return false;
            }
            if (this.common.isBlank(this.info.vehicleLength)) {
                this.$message.error("请选择车长！");
                return false;
            }
            if (this.common.isBlank(this.info.energyType)) {
                this.$message.error("请选择能源类型！");
                return false;
            }
            if (this.common.isBlank(this.info.manageCost)) {
                this.$message.error("请输入管理成本！");
                return false;
            }
            let param = this.common.copyObj(this.info);
            param.type = 1;
            param.beginAddressStr = this.getAddress(this.info.beginProvinceId,
                this.info.beginCityId, this.info.beginDistrictId, this.info.beginAddress, 1);
            param.endAddressStr = this.getAddress(this.info.endProvinceId,
                this.info.endCityId, this.info.endDistrictId, this.info.endAddress, 2);
            await this.common.postUrl("standardCostTransportationService", "saveOrUpdateStandardCostTransportation", param);
            this.$message.success("保存成功！");
            this.closePage();
        },
        getAddress(provinceId, cityId, districtId, address, type)
        {
            let result = "";
            for (let i = 0; i < this.provinceData.length; i++)
            {
                if (this.provinceData[i].id === provinceId)
                {
                    result = this.provinceData[i].name;
                    break;
                }
            }
            if (type == 1)
            {
                for (let i = 0; i < this.beginCityData.length; i++)
                {
                    if (this.beginCityData[i].id === cityId)
                    {
                        result += this.beginCityData[i].name;
                        break;
                    }
                }
                for (let i = 0; i < this.beginDistrictData.length; i++)
                {
                    if (this.beginDistrictData[i].id === districtId)
                    {
                        result += this.beginDistrictData[i].name;
                        break;
                    }
                }
            }
            else
            {
                for (let i = 0; i < this.endCityData.length; i++)
                {
                    if (this.endCityData[i].id === cityId)
                    {
                        result += this.endCityData[i].name;
                        break;
                    }
                }
                for (let i = 0; i < this.endDistrictData.length; i++)
                {
                    if (this.endDistrictData[i].id === districtId)
                    {
                        result += this.endDistrictData[i].name;
                        break;
                    }
                }
            }
            result += address;
            
            return result;
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        
    },
}
