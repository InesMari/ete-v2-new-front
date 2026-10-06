<template>
    <div id="checkScore">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="checkScoreSearch"/>
            
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>查看成绩</span>
                </h3>
            </div>
            <tableCommon tableName="checkScoreTable" ref="table" :showNum="true" :showSelect="false" :showSetTable="true" :head="head"></tableCommon>
        </div>

    </div>
</template>

<script>
	import checkScore from './checkScore.js'
	export default checkScore
</script>
<style lang="scss" scoped>
    #checkScore{

    }
</style>

