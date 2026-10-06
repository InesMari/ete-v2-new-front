<template>
    <div id="transitDetailMain" class="orderDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import transitManage from './transitManage.vue'
	import transitTrackRecord from './transitTrackRecord.vue'
	import modifyRecord from '../order/orderDetail/modifyRecord.vue'

	export default {
		name: 'transitDetailMain',
		props: [],
		data()
		{
			return {
        tabs: [
          {
            name: "中转详情",
            active: true,
            router: 'transitManage',
          },
          {
            name: "跟踪记录",
            router: 'transitTrackRecord'
          },
          {
            name: "修改记录",
            router: 'modifyRecord'
          },
        ],
				componentName: transitManage
			}
		},
		mounted()
		{

		},
		methods: {
			selectCallback(data)
			{
				this.tab = data;
				this.componentName = data.router;
			},
			openTab(item)
			{
				this.$emit('openTab', item);
			},
		},
		components: {
      transitManage,
			modifyRecord,
      transitTrackRecord,
			innerTab
		}
	}
</script>

<style lang="scss">
    .batchTarckDemo {
        .addremark {
            width: 18px;
            height: 18px;
            border-radius: 3px;
            border: 1px solid $main-color;
            position: absolute;
            top: 10px;
            right: -30px;
            font-size: 14px;
            color: $main-color;
            text-align: center;
            cursor: pointer;
            font-weight: bold;
        }

        .selectAlertBox {
            left: 431px;
            top: 10px;
        }

        .delorder {
            text-align: right;
            padding: 20px 0 12px;
        }

        .tableCommon {
            border-left: $border;
            border-right: $border;
        }

        .table_height {
            overflow-x: auto;
        }
    }
</style>
