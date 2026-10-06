<template>
    <div id="modifyRecord" style="height:100%;">
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

</style>
