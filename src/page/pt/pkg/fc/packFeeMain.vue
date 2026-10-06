<template>
    <div id="packFeeMain" >
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <div v-show="showType==1" style="height:calc(100% - 41px)">
          <packIncomeManage ref="packIncomeManage" ></packIncomeManage>
        </div>
        <div v-show="showType==2" style="height:calc(100% - 41px)">
          <packCostManage ref="packCostManage" ></packCostManage>
        </div>
    </div>
</template>

<script>
	import packFeeMain from './packFeeMain.js'
	export default packFeeMain
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>
