<template>
    <div id="studentList">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="studentListSearch"/>
            
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>学员列表</span>
                </h3>
            </div>
            <tableCommon tableName="studentListTable" ref="table" :showNum="true" :showSelect="false" :showSetTable="true" :head="head"></tableCommon>
        </div>

    </div>
</template>

<script>
	import studentList from './studentList.js'
	export default studentList
</script>
<style lang="scss" scoped>
    #studentList{

    }
</style>

