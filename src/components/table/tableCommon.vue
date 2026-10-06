<template>
    <div id="tableCommon" class="tableCommonComponents">
        <div class="noData" v-if="tableData.length==0">表格暂无数据</div>
        <!-- 表格设置 -->
        <div class="setTableRow" v-show="isShowSetTable" >
            <el-button type="primary" @click.stop="showSetting()" size="mini">表格设置</el-button>
            <div class="package" v-show="setTabelShow" @click.stop="()=>{}">
                <div class="listShow">
                  <vuedraggable
                      v-model="headList">
                    <transition-group name="flip-list" type="transition" tag="div">
                      <div class="item clearfix" v-for="(hd,index) in headList" :key="hd.code">
                        <el-checkbox class="fl" v-model="hd.isShow" @change="hideRow(hd)">{{hd.name}}</el-checkbox>
                        <el-switch class="fr" v-model="hd.isFix" @change="fixRow(hd,index)" :disabled="hd.children && hd.children.length>0" active-text="固定"></el-switch>
                      </div>
                    </transition-group>
                  </vuedraggable>
                </div>
              <div class="bot_btn">
                <div class="selectBtn">
                  <el-checkbox v-model="selectAllModel" @change="selectAllSet">全选</el-checkbox>
                  <el-checkbox v-model="selectBackModel" @change="selectBack">反选</el-checkbox>
                </div>
                <div class="button-group">
                  <el-button type="primary" size="mini" @click="saveTableRow">确定</el-button>
                  <el-button type="danger" size="mini" @click="cancelSet">取消</el-button>
                </div>
              </div>
            </div>
        </div>
        <!-- 表格 -->
        <div class="table_height" ref="tableHeight" v-myscrolled="{changeTop,that}">
            <!--
                hd.width    页面配置的列宽
                hd.isShow   页面配置的是否展示列
                hd.isFix    页面配置的是否固定列
                hd.type     页面配置的单元格类型，type：input时为输入框
                hd.isSum    页面配置该列是否统计
                data.class  后台配置的样式类名，前端提供样式（bg_yellow,bg_orange）
            -->
            <!-- 固定 -->
            <table class="tableCommon tableCommonFix" id="js_my_fixtable" ref="js_my_fixtable" width="10" border="0" cellspacing="0" cellpadding="0">
                <thead class="fixed-thead" :style="{'margin-top':headTop+'px','height':headH+'px'}">
                    <tr>
                        <th :width="multi_w" v-if="isShowSelect" :rowspan="headMutilLine?2:1">
                            <el-checkbox v-model="selectAll" @change="selectAllCheck()"></el-checkbox>
                        </th>
                        <th :width="num_w" v-if="isShowNum" :rowspan="headMutilLine?2:1">序号</th>
                        <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headListFix" :key="index" :rowspan="headMutilLine?2:1">{{hd.name}}
                            <el-tooltip class="item" effect="light" placement="top-start" v-if="hd.tip">
                                <div slot="content">{{hd.tip}}</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                    </tr>
                </thead>
                <tbody class="fixed-tbody" :style="'margin-top:'+headH+'px'">
                    <tr v-for="(data,index) in tableData" :class="[data.class,{'hover':data.isSelect}]" :key="index" @click="selectRow(data,index)">
                        <td :width="multi_w" v-if="isShowSelect" >
                            <el-checkbox class="checkbox_row" v-model="data.isSelect" v-if="!data.isDiyTr"></el-checkbox>
                        </td>
                        <td :width="num_w" v-if="isShowNum" @dblclick="dblclickItem(data)">{{index+1}}</td>
                        <td :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headListFix" :key="index" :title="data[hd.code]">
                            <div v-if="hd.type=='input'"><el-input v-model="data[hd.code]" :placeholder="hd.placeholder" @blur="tdBlur(data,hd.code,index,hd.blurFn)" @input="tdInput(data,hd.code,index,hd.inputFn)"></el-input></div>
                            <div v-else-if="hd.type=='diy'">
                                <slot :item="data" :index="index" :code="hd.code"></slot>
                            </div>
                            <div v-else-if="hd.type=='diyColorTd'">
                                <slot name="diyColorTd" :item="data"></slot>
                            </div>
                            <span v-else-if="hd.isPermill">{{data[hd.code] | permill }}</span>
                            <span v-else>{{data[hd.code] | numberToCurrencyNoByFlag(hd.currencyFlag)}}</span>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="fixed-tfoot tfoot" :style="{'top':fixBottomRight+'px'}" v-if="doSum||doQrySum||doSelectSum">
                    <tr>
                        <td :width="multi_w" v-if="isShowSelect" ><em class="fw">统计</em></td>
                        <td :width="num_w" v-if="isShowNum">{{totalNum}}</td>
                        <td :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headListFix" :key="index" :title="hd.sum"><em class="fw">{{hd.sum | numberToCurrencyNoByFlag(hd.currencyFlag)}}</em></td>
                    </tr>
                </tfoot>
            </table>
            <!-- 非固定 -->
            <table class="tableCommon" ref="js_my_table" width="100%" border="0" cellspacing="0" cellpadding="0" :style="{'margin-left':leftTableW+'px','width':'calc(100% - '+leftTableW+'px + 1px)'}">
                <thead class="fixed-thead" :style="{'margin-top':headTop+'px'}">
                    <tr v-if="!headMutilLine">
                        <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headListShow" :key="index" @click="doSort(hd.code)">{{hd.name}}
                            <el-tooltip class="item" effect="light" placement="top-start" v-if="hd.tip">
                                <div slot="content">{{hd.tip}}</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                    </tr>
                    <tr v-if="headMutilLine" >
                        <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headTr1Show" :key="index"
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
                    <tr v-for="(data,index) in tableData" :class="[data.class,{'hover':data.isSelect},{'disabled':data.disabled}]" :key="index" @click="selectRow(data,index)">
                        <td v-if="data.isDiyTr" :colspan="headListShow.length">
                            <slot name="diytr" :item="data"></slot>
                        </td>
                        <td v-else :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,$index) in headListShow" :key="$index" :title="data[hd.code]" :class="[data[hd.code+'tdClass']?data.tdClass:'',{'showInfo':data[hd.code+'showInfo']}]" @dblclick="showInfo(data,hd.code)" @mouseleave="hideInfo(data,hd.code)">
                            <div v-if="hd.type=='input'"><el-input v-model="data[hd.code]" :placeholder="hd.placeholder" @blur="tdBlur(data,hd.code,index,hd.blurFn)" @input="tdInput(data,hd.code,index,hd.inputFn)"></el-input></div>
                            <div v-else-if="hd.type=='diy'">
                                <slot :item="data" :index="index" :code="hd.code"></slot>
                            </div>
                            <div v-else-if="hd.type=='diyColorTd'">
                                <slot name="diyColorTd" :item="data"></slot>
                            </div>
                            <span v-else-if="hd.isPermill">{{data[hd.code] | permill }}</span>
                            <span v-else>{{data[hd.code] | numberToCurrencyNoByFlag(hd.currencyFlag)}}</span>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="fixed-tfoot tfoot" :style="{'top':fixBottomRight+'px'}" v-if="doSum||doQrySum||doSelectSum">
                    <tr>
                        <td :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in headListShow" :key="index" :title="hd.sum"><em class="fw">{{hd.sum | numberToCurrencyNoByFlag(hd.currencyFlag)}}</em></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="table_page clearfix" v-if="showPage">
            <div class="fl">
                共<span class="total">{{totalNum}}</span>条数据，显示
                <span class="num" :class="{'active':rows==10}" @click="changeRows(10)">10</span>
                <span class="num" :class="{'active':rows==20}" @click="changeRows(20)">20</span>
                <span class="num" :class="{'active':rows==50}" @click="changeRows(50)">50</span>
                <span class="num" :class="{'active':rows==100}" @click="changeRows(100)">100</span>
                <span class="num" :class="{'active':rows==200}" @click="changeRows(200)">200</span>
                <span class="num" :class="{'active':rows==500}" @click="changeRows(500)">500</span>
            </div>
            <div class="fr">
                <span class="num" @click="prePage" v-show="page>1"> < </span>
                <span class="num" :class="{'active':page==num}" @click="changePage(num)" v-for="num in pageList" :key="num" v-show="num<5 || page+1>=num">{{num}}</span>
                <span class="num" v-show="pageList.length>4&&page!=pageList.length">...</span>
                <span class="num" @click="nextPage" v-show="page!=pageList.length"> > </span>
            </div>
        </div>
    </div>
</template>

<script>
import tableCommon from './tableCommon.js'
export default tableCommon
</script>
<style lang="scss" src="./tableCommon.scss"></style>
