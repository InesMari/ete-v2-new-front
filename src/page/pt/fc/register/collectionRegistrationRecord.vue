<template>
    <div id="collectionRegistrationRecord" class="orderManagePage ">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="collectionRegistrationRecordSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>已收登记列表</span>
                    <el-tooltip effect="light" content="已收登记列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1006204" @click="download">导出</el-button>
                    <el-button type="primary" plain @click="cancleReceiveFee" size="mini" v-entity="1006083">撤销收款</el-button>
                </div>
            </div>
            <tableCommon tableName="collectionRegistrationRecordManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head">
            </tableCommon>
        </div>

    </div>
</template>

<script>
	import collectionRegistrationRecord from './collectionRegistrationRecord.js'
	export default collectionRegistrationRecord
</script>
<style lang="scss">
  @import '@/page/pt/fc/fc_common.scss';

  #collectionRegistrationRecord {
  }
</style>





