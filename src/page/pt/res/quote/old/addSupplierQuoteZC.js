import mycity from '@/components/mycity/mycity.vue'
import enumData from "@/page/pt/enum";

export default {
    name: 'addSupplierQuoteZC',
    data() {
        return {
            showBeginWorkSelect: true,//起始地默认展开作业点
            showEndWorkSelect: true,//目的地默认展开作业点
            showBeginCity: false,//起始地省市区展示
            showEndCity: false,//目的地省市区展示
            radio1:'1',//默认作业点
            radio2:'1',//默认作业点
            billingTypeData:[],//计费方式数组
            vehicleLengthData:[],//
            quoteVehicleTypeData:[],//
            supplierData:[],//
            form:{beginWorkId: '', endWorkId: ''},
            customerData: [],
            workData: [],
            array: [{vehicleLength: '1', quoteVehicleType: '1',billingType: '1',feePrice: '1',pointFee: ''}],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
    },
    /**
     * 组件
     */
    components: {
        mycity,
    },
    /**
     * 绑定函数
     */
    methods:
    {
        /**
         * 提交
         */
        init()
        {
            let that = this;
            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.supplierData = data;
            });
            this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
                that.customerData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BILLING_TYPE_ORDER"}, function (data) {
                that.billingTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_LENGTH"}, function (data) {
                that.vehicleLengthData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_TYPE_QUOTE"}, function (data) {
                that.quoteVehicleTypeData = data;
            });
            this.loadStoreHouse();
        },
        /**
         * 查询仓库
         */
        loadStoreHouse()
        {
            let that = this;
            this.common.postUrl("storeHouseBizTF","queryStoreHouseList", {}, function (data)
            {
                that.workData = data;
                that.workData.forEach(item => {
                    item.disabled = false;
                })
            })
        },
        /**
         * 改变指定客户
         */
        changeSpecifyTenant()
        {
            this.form.beginWorkId = '';
            this.form.endWorkId = '';
            this.form.beginWorkName = '';
            this.form.endWorkName = '';
            if (this.radio1 === '1')//选择了作业点的情况清空作业点省市区
            {
                this.form.beginProvinceId = '';
                this.form.beginCityId = '';
                this.form.beginDistrictId = '';
                this.form.beginAddressStr = '';
            }
            if (this.radio2 === '1')//选择了作业点的情况清空作业点省市区
            {
                this.form.endProvinceId = '';
                this.form.endCityId = '';
                this.form.endDistrictId = '';
                this.form.endAddressStr = '';
            }
            this.loadWork();
        },
        /**
         * 加载作业点
         */
        loadWork()
        {
            this.workData = [];
            if (this.common.isNotBlank(this.form.specifyTenantId))
            {
                let that = this;
                this.common.postUrl("workGoodsTF","queryWorkDataSelect", {tenantId : this.form.specifyTenantId, isLoadStoreHouse: 1}, function (data)
                {
                    that.workData = data;
                    that.workData.forEach(item => {
                        item.disabled = false;
                    })
                })
            }
            else
            {
                this.loadStoreHouse();
            }
        },
        /**
         * 改变作业点
         */
        chengeWork()
        {
            this.workData.forEach(item => {
                if (this.form.beginWorkId == item.workId || this.form.endWorkId == item.workId)
                {
                    if (this.form.beginWorkId == item.workId)
                    {
                        this.form.beginProvinceId = item.provinceId;
                        this.form.beginCityId = item.cityId;
                        this.form.beginDistrictId = item.districtId;
                        this.form.beginAddressStr = item.workAddressStr;
                    }
                    if (this.form.endWorkId == item.workId)
                    {
                        this.form.endProvinceId = item.provinceId;
                        this.form.endCityId = item.cityId;
                        this.form.endDistrictId = item.districtId;
                        this.form.endAddressStr = item.workAddressStr;
                    }
                    item.disabled = true;
                }
                else { item.disabled = false; }
            })
        },
        /**
         *
         * @param type true起始地 false目的地
         */
        selectRadio(type)
        {
            if (type)
            {
                this.showBeginWorkSelect = this.radio1 === '1';
                this.showBeginCity = !this.showBeginWorkSelect;
                if (this.showBeginWorkSelect)
                {
                    this.$refs.beginCity.cleanData();
                    this.$refs.beginCity.close();
                }
                else
                {
                    this.form.beginWorkId = '';
                    this.form.beginProvinceId = '';
                    this.form.beginCityId = '';
                    this.form.beginDistrictId = '';
                    this.form.beginAddressStr = '';
                    this.chengeWork();
                }
            }
            else
            {
                this.showEndWorkSelect = this.radio2 === '1';
                this.showEndCity = !this.showEndWorkSelect;
                if (this.showEndWorkSelect)
                {
                    this.$refs.endCity.cleanData();
                    this.$refs.endCity.close();
                }
                else
                {
                    this.form.endWorkId = '';
                    this.form.endProvinceId = '';
                    this.form.endCityId = '';
                    this.form.endDistrictId = '';
                    this.form.endAddressStr = '';
                    this.chengeWork();
                }
            }
        },
        /**
         * 起始地省市区选择回调
         * @param data
         */
        selectBeginCallback(data)
        {
            this.form.beginProvinceId = data.ProvinceId;
            this.form.beginCityId = data.CityId;
            this.form.beginDistrictId = data.DistrictId;
            this.form.beginAddressStr = data.ProvinceName + data.CityName + data.DistrictName;
        },
        /**
         * 目的地省市区选择回调
         * @param data
         */
        selectEndCallback(data)
        {
            this.form.endProvinceId = data.ProvinceId;
            this.form.endCityId = data.CityId;
            this.form.endDistrictId = data.DistrictId;
            this.form.endAddressStr = data.ProvinceName + data.CityName + data.DistrictName;
        },
        /**
         * 添加报价
         * @returns {boolean}
         */
        addItem()
        {
            if (this.array.length >= 20)
            {
                this.$message.error("不允许超过20条报价信息！");
                return false;
            }
            this.array.push({vehicleLength: '1',quoteVehicleType: '1', billingType: '1',feePrice: '1',returnPrice: '',pointFee: ''});
        },
        /**
         * 移除
         * @param index
         */
        removeItem(index)
        {
            if (this.array.length > 1){ this.array.splice(index, 1); }
        },
        /**
         * 关闭界面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        /**
         * 保存提交
         * @returns {boolean}
         */
        submit()
        {
            if (this.common.isBlank(this.form.tenantId))
            {
                this.$message.error("请选择供应商再保存！");
                return false;
            }
            if (this.showBeginWorkSelect)
            {
                if (this.common.isBlank(this.form.beginWorkId))
                {
                    this.$message.error("请选择一个始发地的作业点信息！");
                    return false;
                }
                this.workData.forEach(item => {
                    if (this.form.beginWorkId == item.workId) this.form.beginWorkName = item.workName;
                });
            }
            if (this.showBeginCity && (this.common.isBlank(this.form.beginCityId) || this.form.beginCityId < 0))
            {
                this.$message.error("请选择始发地的省市信息！");
                return false;
            }
            if (this.showEndWorkSelect)
            {
                if (this.common.isBlank(this.form.endWorkId))
                {
                    this.$message.error("请选择一个目的地的作业点信息！");
                    return false;
                }
                this.workData.forEach(item => {
                    if (this.form.endWorkId == item.workId) this.form.endWorkName = item.workName;
                });
            }
            if (this.showEndCity && (this.common.isBlank(this.form.endCityId) || this.form.endCityId < 0))
            {
                this.$message.error("请选择目的地的省市信息！");
                return false;
            }
            if (this.common.isNotBlank(this.form.beginWorkId) && this.form.beginWorkId === this.form.endWorkId)
            {
                this.$message.error("报价的始发地作业点和目的地作业点不能相同！");
                return false;
            }
            if (this.form.beginDistrictId === this.form.endDistrictId)
            {
                if (this.common.isNotBlank(this.form.beginDistrictId))
                {
                    if (this.common.isBlank(this.form.beginWorkId) && this.common.isBlank(this.form.endWorkId))//只选省市区的才报错   选择作业点的也会把省市区保存
                    {
                        this.$message.error("相同的始发地/目的地地区无法保存报价！");
                        return false;
                    }
                }
                else
                {
                    if (this.common.isNotBlank(this.form.beginCityId) && this.form.beginCityId === this.form.endCityId)
                    {
                        this.$message.error("相同的始发地/目的地市无法保存报价！");
                        return false;
                    }
                }
            }
            if (this.array.length === 0)
            {
                this.$message.error("至少需要一条费用才能保存！");
                return false;
            }
            let set = new Set();
            for(let i in this.array)
            {
                if (this.common.isBlank(this.array[i].feePrice) || this.array[i].feePrice <= 0)
                {
                    this.$message.error("请输入有效的价格！");
                    return false;
                }
                let str = this.array[i].vehicleLength + "-" + this.array[i].billingType + "-" + this.array[i].quoteVehicleType;
                if (set.has(str))
                {
                    let tip = "";
                    this.quoteVehicleTypeData.forEach(item => {
                        if (item.codeValue == this.array[i].quoteVehicleType){ tip += item.codeName + "-"; }
                    });
                    this.vehicleLengthData.forEach(item => {
                        if (item.codeValue == this.array[i].vehicleLength){ tip += item.codeName + "-"; }
                    });
                    this.billingTypeData.forEach(item => {
                        if (item.codeValue == this.array[i].billingType){ tip += item.codeName; }
                    });
                    this.$message.error("存在多条相同的 " + tip + " 报价！");
                    return false;
                }
                else { set.add(str); }
            }
            this.form.array = this.array;
            this.form.radio1 = this.radio1;
            this.form.radio2 = this.radio2;
            this.form.quoteType = 2;//供应商报价
            let that = this;
            this.common.postUrl("quoteTF","saveZCQuote", this.form, function (data)
            {
                that.$msgbox("保存成功！", function (data)
                {
                    that.close();
                });
            },null,'',true);
        },
    },
}
