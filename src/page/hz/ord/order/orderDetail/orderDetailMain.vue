<template>
    <div id="orderDetailMain" class="orderDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import orderDetail from './orderDetail.vue'

	export default {
		name: 'orderDetailMain',
		props: [],
		data()
		{
			return {
				tabs: [
				  //   {
					// name: "订单详情",
					// active: true,
					// router: 'orderDetail',
				  //   },
					// {
					// 	name: "修改记录",
					// 	router: 'modifyRecord'
					// },
					// {
					// 	name: "操作日志",
					// 	router: 'operateLog'
					// },
				],
				componentName: orderDetail
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
			orderDetail,
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
