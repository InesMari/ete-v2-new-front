<template>
<div id="scrollTable" class="scrollTableComponents">
    <div class="noData" v-if="tableData.length==0">表格暂无数据</div>
    <div class="table_height" ref="table_height" :style="'height:'+height+'px'" v-myscrolled="{changeTop}">
        <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" :style="'max-height:'+maxHeight+'px;height:'+height+'px;'">
            <thead class="fixed-thead" :style="{'margin-top':headTop+'px','height':headH+'px'}">
                <tr v-if="!headMutilLine">
                    <th width="60" v-if="isShowSelect" :rowspan="headMutilLine?2:1">
                        <el-checkbox v-model="selectAll" @change="selectAllCheck()"></el-checkbox>
                    </th>
                    <th width="60" v-if="showNum" :rowspan="headMutilLine?2:1">序号</th>
                    <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headList" :key="index" @click="doSort(hd.code)">{{hd.name}}</th>
                </tr>
                <tr v-if="headMutilLine" >
                    <th width="60" v-if="isShowSelect" :rowspan="headMutilLine?2:1">
                        <el-checkbox v-model="selectAll" @change="selectAllCheck()"></el-checkbox>
                    </th>
                    <th width="60" v-if="showNum" :rowspan="headMutilLine?2:1">序号</th>
                    <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headTr1" :key="index"
                        :rowspan="hd.children&&hd.children.length>0?1:2"
                        :colspan="hd.children&&hd.children.length?hd.children.length:1"
                    >
                        {{hd.name}}
                    </th>
                </tr>
                <tr v-if="headMutilLine" >
                    <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headTr2" :key="index">{{hd.name}}</th>
                </tr>
            </thead>
            <tbody class="fixed-tbody" :style="'margin-top:'+headH+'px'">
                <tr v-for="(data,index) in tableData" :class="data.class" :key="index" @click="selectRow(data,index)">
                    <td width="60" v-if="isShowSelect" >
                        <el-checkbox class="checkbox_row" v-model="data.isSelect"></el-checkbox>
                    </td>
                    <td width="60" v-if="showNum">{{index+1}}</td>
                    <td :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,colIndex) in headList" :key="colIndex" :title="data[hd.code]">
                        <div v-if="hd.type=='input'">
                            <el-input v-model="data[hd.code]" :placeholder="hd.placeholder" @blur="tdBlur(data,hd.code,colIndex,hd.blurFn)" @input="tdInput(data,hd.code,colIndex,hd.inputFn)"></el-input>
                        </div>
                        <div v-else-if="hd.type=='date'">
                            <el-date-picker v-model="data[hd.code]" type="date" :placeholder="hd.placeholder" value-format="yyyy-MM-dd" @blur="tdBlur(data,hd.code,colIndex,hd.blurFn)" @change="tdInput(data,hd.code,index,hd.inputFn)"></el-date-picker>
                        </div>
                        <div v-else-if="hd.type=='diy'">
                            <slot :item="data" :index="index" :code="hd.code"></slot>
                        </div>
                        <span v-else>{{data[hd.code] | numberToCurrencyNoByFlag(hd.currencyFlag)}}</span>
                    </td>
                </tr>
            </tbody>
            <tfoot class="fixed-tfoot tfoot" :style="{'top':fixBottom+'px'}" v-if="doSum||doQrySum">
                <tr>
                    <td width="60" v-if="isShowSelect" >合计</td>
                    <td width="60" v-if="showNum">{{totalNum}}</td><!-- 柱子说不要合计这两个字 -->
                    <td :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headList" :key="index"><em class="fw">{{hd.sum | numberToCurrencyNoByFlag(hd.currencyFlag)}}</em></td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
</template>

<script>
import scrollTable from './scrollTable.js'
export default scrollTable
</script>

<style lang="scss">
.scrollTableComponents{
    position: relative;
    .table_height{
        overflow-x: auto;
        min-height: 200px;
        max-height: 400px;
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
    .tableCommon .fixed-tbody{
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
         width: 100%;
        }
        margin-bottom:30px;
        .el-input__inner{
            text-align: center;
        }
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        background: rgb(255, 255, 255);
        border-radius: 8px;
    }
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgb(201, 201, 202);
        border-radius: 8px;
    }
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(162, 162, 163);
    }
}
</style>
