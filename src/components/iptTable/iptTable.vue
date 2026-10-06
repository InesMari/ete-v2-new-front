<template>
    <div id="iptTable" class="iptTable">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr class="list_header">
                <td v-for="hd in head" :key="hd.code" v-show="hd.isShow"><em class="ismust" v-if="hd.requiredFiled">*</em>{{hd.name}}</td>
            </tr>
            <tr v-for="(data,index) in tableData" :key="index">
                <td v-for="hd in head" :key="hd.code" v-show="hd.isShow">
                    <!-- 货品名称 -->
                    <div v-if="hd.type=='goodsName'">
                        <el-input v-model="data[hd.code].value" @click.native="goodsNameFocus(data[hd.code])" :maxlength="hd.maxlength" :disabled="disabled"></el-input>
                        <div class="selectAlertBox" v-show="data[hd.code].goodsNameShow" @click.stop="stopBub" v-if="!disabled">
                            <div class="title"><i class="add" @click="addGoodsItem(data)"></i>请选择货品名称</div>
                            <ul class="list">
                                <li v-show="data.isAddItem">
                                    <el-input class="w_auto" v-model="data.addSelectItem"></el-input>
                                    <div class="operateIcon fr">
                                        <span @click="addGoodsName(data)"><i class="el-icon-check"></i></span>
                                        <span @click="cancelGoodsName(data)"><i class="el-icon-close"></i></span>
                                    </div>
                                </li>
                                <li v-for="(list,index) in goodsNameList" :key="index" @click="getGoodsName(data,hd.code,list.codeName)">
                                    {{list.codeName}}<i class="del" @click="delGoodsName(list)"></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 包装类型 -->
                    <div v-if="hd.type=='packTypeData'">
                        <el-input v-model="data[hd.code].value" @click.native="packTypeFocus(data[hd.code])" :maxlength="hd.maxlength" :disabled="disabled"></el-input>
                        <div class="selectAlertBox" v-show="data[hd.code].packTypeShow" @click.stop="stopBub" v-if="!disabled">
                            <div class="title"><i class="add" @click="addPackTypeItem(data)"></i>请选择包装名称</div>
                            <ul class="list">
                                <li v-show="data.isAddItem">
                                    <el-input class="w_auto" v-model="data.addSelectItem"></el-input>
                                    <div class="operateIcon fr">
                                        <span @click="addPackType(data)"><i class="el-icon-check"></i></span>
                                        <span @click="cancelPackType(data)"><i class="el-icon-close"></i></span>
                                    </div>
                                </li>
                                <li v-for="(list,index) in packTypeList" :key="index" @click="getPackType(data,hd.code,list.codeName)">
                                    {{list.codeName}}<i class="del" @click="delPackType(list)"></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-if="hd.type=='weight'" style="position:relative;">
                        <el-input v-mydoubleval v-model="data[hd.code].value" @input="totalFn(hd)" @focus="showWeightCalc(data[hd.code])" @blur="hideWeightCalc(data[hd.code]);changeValue(hd.code);" :maxlength="hd.maxlength" :disabled="disabled"></el-input>
                        <img @click="showWeightCalcBox(data[hd.code])" v-show="data[hd.code].showCalc" src="@/static/image/jsj.png" class="cal">
                    </div>
                    <div v-if="hd.type=='volume'" style="position:relative;">
                        <el-input v-mydouble4val v-model="data[hd.code].value" @input="totalFn(hd)" @focus="showVolumeCalc(data[hd.code])" @blur="hideVolumeCalc(data[hd.code]);changeValue(hd.code);" :maxlength="hd.maxlength" :disabled="disabled"></el-input>
                        <img @click="showVolumeCalcBox(data[hd.code])" v-show="data[hd.code].showCalc" src="@/static/image/jsj.png" class="cal">
                    </div>
                    <div v-if="hd.type=='input'">
                        <el-input v-model="data[hd.code].value" @input="totalFn(hd)"  @blur="changeValue(hd.code)" :maxlength="hd.maxlength" :disabled="disabled"></el-input>            
                    </div>
                    <div v-if="hd.type=='int'">
                        <el-input v-model="data[hd.code].value" v-mynumval @input="totalFn(hd)"  @blur="changeValue(hd.code)" :maxlength="hd.maxlength" :disabled="disabled"></el-input>            
                    </div>
                    <div v-if="hd.type=='number'">
                        <el-input v-model="data[hd.code].value" v-mydoubleval @input="totalFn(hd)"  @blur="changeValue(hd.code)" :maxlength="hd.maxlength" :disabled="disabled"></el-input>
                    </div>
                </td>
            </tr>
            <tr class="list_footer">
                <td v-for="(hd,index) in head" :key="index" v-show="hd.isShow">                    
                    <span v-if="hd.type!='goodsName'&&hd.type!='packTypeData'&&hd.istatol">
                        <span v-if="hd.type=='number'">{{amountData[hd.code] | double}}</span>
                        <span v-else>{{amountData[hd.code]}}</span>
                    </span>
                </td>
            </tr>
        </table>    

        <ul class="ipt_table_ico" v-if="!disabled">
            <li @click.stop="stopBub">
                <div class="ico diy" @click="showTableSetting">
                    <img src="@/static/image/diy.png" alt="" style="margin-top:6px;">
                    <p class="tip">自定义</p>
                </div>
                <div class="iptSetTableRow" v-show="isShowSetting">
                    <div class="setRowTop">
                        <h3>自定义字段</h3>
                        <em>注：可拖动字段以改变其展示的顺序！</em>
                    </div>
                    <div class="clearfix" style="position:relative;">
                        <!-- 不展示列 -->
                        <div class="fl flow_row">
                            <div class="selet_all">
                                <el-checkbox v-model="leftSelectAll" @change="selectLeftAll">未选定</el-checkbox>
                            </div>
                            <div class="select_list">
                                <!-- <div class="screen_row">
                                    <el-input></el-input>
                                    <i class="el-icon-search"></i>
                                </div> -->
                                <ul>
                                    <li v-for="(hd,index) in headSetList" :key="index">
                                        <el-checkbox v-model="hd.isChecked" v-if="!hd.isShow" @change="diyItemChange(hd,1)">{{hd.name}}</el-checkbox>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="sure_select">
                            <span class="sel_ico" @click="selToRight"><i class="el-icon-arrow-right"></i></span>
                            <span class="sel_ico" @click="selToLeft"><i class="el-icon-arrow-left"></i></span>
                        </div>
                        <!-- 展示列 -->
                        <div class="fr flow_row">
                            <div class="selet_all">
                                <el-checkbox v-model="rightSelectAll" @change="selectRightAll">已选定</el-checkbox>
                            </div>
                            <div class="select_list">
                                <!-- <div class="screen_row">
                                    <el-input></el-input>
                                </div> -->
                                <ul>                                    
                                    <vuedraggable v-model="headSetList">
                                        <transition-group :name="'flip-list'" type="transition">
                                            <li v-for="hd in headSetList" :key="hd.code">
                                                <el-checkbox v-model="hd.isChecked" v-if="hd.isShow" :disabled="hd.requiredFiled" @change="diyItemChange(hd,2)">{{hd.name}}</el-checkbox>
                                            </li>
                                        </transition-group>
                                    </vuedraggable>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="botBtn bottom_set_btn">
                        <!-- <el-button size="mini">恢复默认</el-button> -->
                        <el-button size="mini" type="primary" @click="sureSetting">确定</el-button>
                        <el-button size="mini" type="warning" @click="cancelSetting">取消</el-button>
                    </div>
                </div>
            </li>
            <li @click="addRow();;">
                <div class="ico add_btn">
                    <p class="tip">增加行数</p>
                </div>

            </li>
            <li @click="cutRow()">
                <div class="ico remove_btn">
                    <p class="tip">删除行数</p>
                </div>
            </li>
        </ul>

        <el-dialog
        title="重量计算器"
        class="ipt-dialog"
        :visible.sync="weightCalcBox"
        width="660px">
            <div class="tx_tc">
                <el-radio-group v-model="radioValue">
                    <el-radio :label="1">按单件统计</el-radio>
                    <el-radio :label="2">按总数统计</el-radio>
                </el-radio-group>
            </div>
            <el-table
                :data="weightData"
                border
                show-summary
                :summary-method="getWeightSummaries"
                @selection-change="weightSelectionChange"
                height="200"
                style="width: 100%">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="rough"
                    label="毛重(千克)">
                    </el-table-column>
                    <el-table-column
                    prop="materialt"
                    label="材重(千克)">
                    </el-table-column>
                    <el-table-column
                    prop="count"
                    label="件数">
                    </el-table-column>
                    <el-table-column
                    prop="weight"
                    label="重量(千克)">
                    </el-table-column>
            </el-table>
            <div class="dialog-calc-info">
                <span>（毛重</span>
                <el-input v-model="calcWeight.rough" v-mydouble4val @input="calcWeightFee()"></el-input>
                <span> - 材重</span>
                <el-input v-model="calcWeight.materialt" v-mydouble4val @input="calcWeightFee()"></el-input>
                <span>）*件数</span>
                <el-input v-model="calcWeight.count" v-mynumval @input="calcWeightFee()"></el-input>
                <span>= <em>{{calcWeight.weight}}</em></span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="addWeight()">加入</el-button>
                <el-button size="mini" type="danger" @click="delWeight()">删除</el-button>
                <el-button size="mini" type="primary" @click="saveWeight()">保存</el-button>
                <el-button size="mini" @click="exitWeight()">退出</el-button>
                <el-button size="mini" @click="cleanWeight()">清空</el-button>
            </span>
        </el-dialog>

        <el-dialog
        title="体积计算器"
        class="ipt-dialog"
        :visible.sync="volumeCalcBox"
        width="660px">
            <div class="tx_tc">
                <el-radio-group v-model="radioValue">
                    <el-radio :label="1">按单件统计</el-radio>
                    <el-radio :label="2">按总数统计</el-radio>
                </el-radio-group>
            </div>
            <el-table
                :data="volumeData"
                border
                show-summary
                :summary-method="getVolumeSummaries"
                @selection-change="volumeSelectionChange"
                height="200"
                style="width: 100%">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="long"
                    label="长(厘米)">
                    </el-table-column>
                    <el-table-column
                    prop="wide"
                    label="宽(厘米)">
                    </el-table-column>
                    <el-table-column
                    prop="count"
                    label="高(厘米)">
                    </el-table-column>
                    <el-table-column
                    prop="height"
                    label="件数">
                    </el-table-column>
                    <el-table-column
                    prop="volume"
                    label="体积(方)">
                    </el-table-column>
            </el-table>
            <div class="dialog-calc-info">
                <span>（长</span>
                <el-input v-model="calcVolume.long" v-mydouble4val @input="calcVolumeFee()"></el-input>
                <span> * 宽</span>
                <el-input v-model="calcVolume.wide" v-mydouble4val @input="calcVolumeFee()"></el-input>
                <span> * 高</span>
                <el-input v-model="calcVolume.height" v-mydouble4val @input="calcVolumeFee()"></el-input>
                <span>）* 件数</span>
                <el-input v-model="calcVolume.count" v-mynumval @input="calcVolumeFee()"></el-input>
                <span>= <em>{{calcVolume.volume}}</em></span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="addVolume()">加入</el-button>
                <el-button size="mini" type="danger" @click="delVolume()">删除</el-button>
                <el-button size="mini" type="primary" @click="saveVolume()">保存</el-button>
                <el-button size="mini" @click="exitVolume()">退出</el-button>
                <el-button size="mini" @click="cleanVolume()">清空</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ipttable from './iptTable.js'
    export default ipttable;
</script>
<style lang="scss" src="./iptTable.scss"></style>