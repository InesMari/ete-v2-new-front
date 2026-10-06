import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'wmsOrderStock',
    props: {
        type: Number,//默认是1就是新增修改，2是新版的确认送达
        modifyFlag: Boolean,
    },
    data()
    {
        return {
            stockInfo: {selectItem: []},
            totalInfo: {
                nums: 0,
                boxNums: 0,
                palletNums: 0,
                nums2: 0,
                boxNums2: 0,
                palletNums2: 0,
            },
        }
    },
    mounted() {},
    components: {
        tableCommon
    },
    methods: {
        async initData(data, initFlag)
        {
            let lastSelectItem = null;//最后一次选择的数据,下次再选择过来界面自动赋值
            if (this.stockInfo.selectItem && this.stockInfo.selectItem.length > 0)
            {
                lastSelectItem = this.common.copyObj(this.stockInfo.selectItem);
            }
            this.stockInfo = this.common.copyObj(data);
            if (initFlag)//新增的时候设置每个的配送托数 修改不处理
            {
                await this.setItemData();
            }
            if (lastSelectItem)
            {
                for (let i = 0; i < this.stockInfo.selectItem.length; i++)
                {
                    let item = this.stockInfo.selectItem[i];
                    for (let j = 0; j < lastSelectItem.length; j++)
                    {
                        let tmp = lastSelectItem[j];
                        if (tmp.outOrderMaterialDtlId == item.outOrderMaterialDtlId)
                        {
                            item.nums2 = this.common.isNotBlank(tmp.nums2) ? tmp.nums2 : item.nums;
                            item.boxNums2 = this.common.isNotBlank(tmp.boxNums2) ? tmp.boxNums2 : item.boxNums;
                            item.palletNums2 = this.common.isNotBlank(tmp.palletNums2) ? tmp.palletNums2 : item.palletNums;
                            break;
                        }
                    }
                }
            }
            //计算合计
            this.calculateTotal();
        },
        getData()
        {
            return this.stockInfo.selectItem;
        },
        back()
        {
            this.$parent.back();
        },
        async setItemData()
        {
            for (let i = 0; i < this.stockInfo.selectItem.length; i++)
            {
                let item = this.stockInfo.selectItem[i];
                item.nums2 = item.deliverableNums;
                item.boxNums2 = item.deliverableBoxNums;
                item.palletNums2 = item.deliverablePalletNums;
            }
            this.$forceUpdate();
        },
        // 数量
        async changeNums2(item)
        {
            if (item.nums2)
            {
                if (item.perBoxNums)
                {
                    let tmp = this.common.accDiv(item.nums2, item.perBoxNums);
                    item.boxNums2 = Math.ceil(tmp);
                }
                if (item.perPalletNums)
                {
                    let tmp = this.common.accDiv(item.nums2, item.perPalletNums);
                    item.palletNums2 = Math.ceil(tmp);
                }
            }
            //计算合计
            this.calculateTotal();
            //调用处理收入成本相关的费用
            this.$parent.changeNums();
        },
        // 箱数
        async changeBoxNums2(item)
        {
            if (item.boxNums2 && item.perBoxNums){
                let tmp = this.common.accMul(item.boxNums2, item.perBoxNums);
                item.nums2 = Math.round(tmp);
                if (item.perPalletNums)
                {
                    let tmp = this.common.accDiv(item.nums2, item.perPalletNums);
                    item.palletNums2 = Math.ceil(tmp);
                }
            }
            //计算合计
            this.calculateTotal();
            //调用处理收入成本相关的费用
            this.$parent.changeNums();
        },
        // 托数
        async changePalletNums2(item)
        {
            if (item.palletNums2 &&item.perPalletNums){
                let tmp = this.common.accMul(item.palletNums2, item.perPalletNums);
                item.nums2 = Math.round(tmp);
                if (item.perBoxNums)
                {
                    let tmp = this.common.accDiv(item.nums2, item.perBoxNums);
                    item.boxNums2 = Math.ceil(tmp);
                }
            }
            //计算合计
            this.calculateTotal();
            //调用处理收入成本相关的费用
            this.$parent.changeNums();
        },

        //计算托数
        async calculateTotal()
        {
            this.totalInfo.nums = 0;
            this.totalInfo.boxNums = 0;
            this.totalInfo.palletNums = 0;
            this.totalInfo.nums2 = 0;
            this.totalInfo.boxNums2 = 0;
            this.totalInfo.palletNums2 = 0;
            let nums = 0;
            for (let i = 0; i < this.stockInfo.selectItem.length; i++)
            {
                let item = this.stockInfo.selectItem[i];
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums, item.nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums, item.boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums, item.palletNums);
                this.totalInfo.nums2 = this.common.accAdd(this.totalInfo.nums2, item.nums2);
                this.totalInfo.boxNums2 = this.common.accAdd(this.totalInfo.boxNums2, item.boxNums2);
                this.totalInfo.palletNums2 = this.common.accAdd(this.totalInfo.palletNums2, item.palletNums2);

                let perPalletNums = item.perPalletNums;
                if (this.common.isBlank(perPalletNums) || perPalletNums == 0)
                {
                    perPalletNums = 1;
                }
                let pre = this.common.accMul(item.palletNums2, perPalletNums);
                nums = this.common.accAdd(nums, pre);//总吨数
            }
            this.$forceUpdate();
        },
        /**
         * 出库单详情
         */
        toOrderDetail(item)
        {
            if (item.type == 1)
            {
                this.$parent.$emit("openTab",{
                    urlId: "inOrderDetail"+item.outOrderId,
                    query: {inOrderId:item.outOrderId,
                        logId: item.outOrderId,
                        logType: enumData.LOG_TYPE.WMS_IN_ORDER,
                    },
                    urlName: '入库单详情',
                    urlPathName: "/inOrderDetail",
                    urlPath: '/pt/wms/ord/inOrderDetail.vue'});
            }
            else
            {
                this.$parent.$emit("openTab", {
                    urlId: 'outOrderDetail' + item.outOrderId,
                    query: {outOrderId: item.outOrderId,
                        logId: item.outOrderId,
                        logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
                    },
                    urlName: "出库单详情",
                    urlPathName: "/outOrderDetail",
                    urlPath: "/pt/wms/ord/outOrderDetail.vue"
                });
            }
        },

    },
}
