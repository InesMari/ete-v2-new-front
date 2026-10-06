<template>
<div id="simpleTable" class="simpleTableComponents tableCommonComponents">
    <div class="noData" v-if="tableData.length==0">表格暂无数据</div>
    <div class="table_height" ref="table_height" :style="'height:'+height+'px'" v-myscrolled="{changeTop}">
        <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead class="fixed-thead" :style="{'margin-top':headTop+'px'}">
                <tr>
                    <th :width="multi_w" v-if="!noSelect">
                        <el-checkbox v-model="selectAll" @change="selectAllCheck()" v-if="!singleSelect"></el-checkbox>
                    </th>
                    <th width="60" v-if="!noIndex">序号</th>
                    <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in head" :key="index">{{hd.name}}</th>
                </tr>
            </thead>
            <tbody class="fixed-tbody">
                <tr v-for="(data,index) in tableData" :class="data.class" :key="index" @click="selectRow(data,index)"  @dblclick="dblclickItem(data)">
                    <td :width="multi_w" v-if="!noSelect">
                        <el-checkbox class="checkbox_row" v-model="data.isSelect" v-if="!data.isDiyTr"></el-checkbox>
                    </td>
                    <td width="60" v-if="!noIndex">{{index+1}}</td>
                    <td :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in head" :key="index" :title="data[hd.code]">
                        <div v-if="hd.type=='input'">
                            <el-input v-model="data[hd.code]" :placeholder="hd.placeholder" @blur="tdBlur(data,hd.code,index,hd.blurFn)" @input="tdInput(data,hd.code,index,hd.inputFn)"></el-input>
                        </div>
                        <div v-else-if="hd.type=='date'">
                            <el-date-picker v-model="data[hd.code]" type="date" :placeholder="hd.placeholder" value-format="yyyy-MM-dd" @blur="tdBlur(data,hd.code,index,hd.blurFn)" @change="tdInput(data,hd.code,index,hd.inputFn)"></el-date-picker>
                        </div>
                        <div v-else-if="hd.type=='diy'">
                          <slot :item="data" :index="index" :code="hd.code"></slot>
                        </div>
                        <span v-else>{{data[hd.code]}}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import simpleTable from './simpleTable.js'
export default simpleTable
</script>

<style lang="scss">
.simpleTableComponents{
    position: relative;
    .table_height{
        overflow: auto;
        height: 100%!important;
        width: 100%;
        .el-input__inner,.el-date-editor{
            width: 100%;
        }
    }
    //表格没有数据
    .noData{
        position: absolute;
        width: 100%;
        font-size: 16px;
        color: #999;
        top: 100px;
        text-align: center;
    }
}
</style>
