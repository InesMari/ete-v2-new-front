<template>
    <div id="transitTrackRecord">
        <div class="table-content" style="margin-top:0;">
            <div class="table-title">
                <h3><span>跟踪记录</span></h3>
            </div>
            <tableCommon tableName="transitTrackRecordListTable" ref="table" :showNum="true" :head="head" :showSetTable="false" ></tableCommon>
        </div>
    </div>
</template>

<script>
	import transitTrackRecord from './transitTrackRecord.js'

	export default transitTrackRecord
</script>
<style lang="scss">

</style>
