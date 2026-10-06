<template>
    <div id="modifyRecord">
        <div class="table-content" style="margin-top:0;">
            <div class="table-title">
                <h3><span>修改记录</span></h3>
            </div>
            <tableCommon tableName="modifyRecordListTable" ref="table" :showNum="true" :head="head" :showSetTable="false" ></tableCommon>
        </div>
    </div>
</template>

<script>
	import modifyRecord from './modifyRecord.js'
	export default modifyRecord
</script>
<style lang="scss">
    #modifyRecord{
        height: calc(100% - 41px);
    }
</style>
