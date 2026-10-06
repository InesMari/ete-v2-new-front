<template>
    <div id="contractManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px) !important;"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import customerContract from './customerContract.vue'
import supplierContract from './supplierContract.vue'
import storageEquipmentContract from './storageEquipmentContract.vue'
import packingContainerContract from './packingContainerContract.vue'
import insuranceContract from './insuranceContract.vue'
import otherContract from './otherContract.vue'
import innerContract from './innerContract.vue'

export default {
    name: 'contractManageMain',
    props: [],
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted() {
        this.initComponent();
        // 处理 expirationStatus 参数
        let query = this.$route.query;
        if (query && query.expirationStatus) {
            query = { ...query, expirationStatus: query.expirationStatus.split(',').map(String) };
        }
        this.$nextTick(() => {
            this.$refs.ref && this.$refs.ref.doQuery(query);
        });
    },
    methods: {
        selectCallback(data)
        {
            this.tab = data;
            this.componentName = data.router;
            this.openFlg = 0;
        },
        /**
         * 往上层调用打开页面的
         * @returns {*}
         */
        openTab(item)
        {
            this.$emit('openTab', item);
        },
        /**
         * 初始化tabs
         * @returns {*}
         */
        initTabs()
        {
            this.tabs = [];
            let entityIds = localStorage.getItem("entityIds").split(",");
            let set = new Set();
            entityIds.forEach(item => {
                if (item == 1011003 && !set.has("customerContract"))
                {
                    this.tabs.push({name: "客户合同", active: false, router: 'customerContract'});
                    set.add("customerContract");
                }
                else if (item == 1011004 && !set.has("supplierContract"))
                {
                    this.tabs.push({name: "供应商-运输合同", active: false, router: 'supplierContract'});
                    set.add("supplierContract");
                }
                else if (item == 1011015 && !set.has("storageEquipmentContract"))
                {
                  this.tabs.push({name: "供应商-仓储运作合同", active: false, router: 'storageEquipmentContract'});
                  set.add("storageEquipmentContract");
                }
                else if (item == 1011016 && !set.has("packingContainerContract"))
                {
                  this.tabs.push({name: "供应商-器具容器合同", active: false, router: 'packingContainerContract'});
                  set.add("packingContainerContract");
                }
                else if (item == 1011034 && !set.has("insuranceContract"))
                {
                    this.tabs.push({name: "供应商-保险合同", active: false, router: 'insuranceContract'});
                    set.add("insuranceContract");
                }
                else if (item == 1011057 && !set.has("otherContract"))
                {
                  this.tabs.push({name: "供应商-其他合同", active: false, router: 'otherContract'});
                  set.add("otherContract");
                }
                else if (item == 1011064 && !set.has("innerContract"))
                {
                    this.tabs.push({name: "供应商-内部结转合同", active: false, router: 'innerContract'});
                    set.add("innerContract");
                }
            })
            if (this.tabs.length === 0)
                this.componentName = 'notFindPage';
            return this.tabs;
        },
         /**
         * 初始化组件
         * @returns {*}
         */
        initComponent()
        {
            //跳转展示
            if (this.$route.query.openTab > 1)
            {
                for (let i = 0; i < this.tabs.length; i++)
                {
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'supplierContract')
                    {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    else if (this.$route.query.openTab == 3 && this.tabs[i].router == 'storageEquipmentContract')
                    {
                      this.tabs[i].active = true;
                      return this.tabs[i].router;
                    }
                    else if (this.$route.query.openTab == 4 && this.tabs[i].router == 'packingContainerContract')
                    {
                      this.tabs[i].active = true;
                      return this.tabs[i].router;
                    }
                    else if (this.$route.query.openTab == 5 && this.tabs[i].router == 'insuranceContract')
                    {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    else if (this.$route.query.openTab == 6 && this.tabs[i].router == 'otherContract')
                    {
                      this.tabs[i].active = true;
                      return this.tabs[i].router;
                    }
                    else if (this.$route.query.openTab == 7 && this.tabs[i].router == 'innerContract')
                    {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                }
            }
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
        customerContract,
        supplierContract,
        storageEquipmentContract,
        packingContainerContract,
        insuranceContract,
        otherContract,
        innerContract,
        notFindPage,
        innerTab
    }
}
</script>
