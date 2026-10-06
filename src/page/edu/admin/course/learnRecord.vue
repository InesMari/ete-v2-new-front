<template>
    <div id="learnRecord">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="learnRecordSearch"/>
            
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>学习记录</span>
                </h3>
            </div>
            <tableCommon tableName="learnRecordTable" ref="table" :showNum="true" :showSelect="false" :showSetTable="true" :head="head"></tableCommon>
        </div>

    </div>
</template>

<script>
	import learnRecord from './learnRecord.js'
	export default learnRecord
</script>
<style lang="scss" scoped>
    #learnRecord{
        /deep/ .tableCommon{
            tr.grey{
                td{
                    color: #999!important;
                }
            }
        }
    }
</style>

