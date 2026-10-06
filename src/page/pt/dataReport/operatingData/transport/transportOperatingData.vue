<template>
    <div id="transportOperatingData">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="transportOperatingDataSearch">
        </searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>ETE运输中心营收预实数据(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="ETE运输中心营收预实数据" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="exportBudget"
                        v-entity="1007152">导入预算</el-button>
                    <el-button type="primary" plain size="mini" @click="exportActual"
                        v-entity="1007153">导入实际</el-button>
                    <el-button type="danger" plain size="mini" @click="del" v-entity="1007154">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="transportOperatingDataTable" ref="table" :head="head" :showNum="true"
                :showSetTable="true" @dblclickItem="dblclickItem" :singleSelect="true"></tableCommon>
        </div>

        <!-- 导入预算营收 -->
        <el-dialog title="导入预算营收" :visible.sync="impBudget" :close-on-click-modal="false" :close-on-press-escape="false" width="520px" @close="hideBudgetImp">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix" style="margin-top:10px;">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>预算年度</label>
                        <div class="input-text">
                            <el-date-picker @input="$forceUpdate()" v-model="budgetInfo.year" type="year"
                                placeholder="选择年度" align="right"
                                format="yyyy" value-format="yyyy" >
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="item item100" style="margin-top:10px;">
                        <label class="label-term"></label>
                        <my-import ref="myBudgetImport" :handle-success="myImportBudgetCallback" :noneDialog="true" template="/download/transportOperatingDataBudget.xlsx" title="上传excel"
                            bean="fcAnalysisTF" method="impSaveFcAnalysisBudgetInfo" :param="budgetInfo"></my-import>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="hideBudgetImp">取消</el-button>
                    <el-button type="primary" size="mini" @click="addBudget()">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 导入实际营收 -->
        <el-dialog title="导入实际营收" :visible.sync="impActual" :close-on-click-modal="false" :close-on-press-escape="false" width="520px" @close="hideActualImp">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix" style="margin-top:10px;">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>实际月份</label>
                        <div class="input-text">
                            <el-date-picker @input="$forceUpdate()" v-model="actualInfo.month" type="month"
                                placeholder="请选择导入月份" align="right"
                                format="yyyy-MM" value-format="yyyy-MM" >
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="item item100" style="margin-top:10px;">
                        <label class="label-term"></label>
                        <my-import ref="myActualImport" :handle-success="myImportActualCallback" :noneDialog="true" template="/download/transportOperatingDataActual.xlsx" title="上传excel"
                            bean="fcAnalysisTF" method="impSaveFcAnalysisActualInfo" :param="actualInfo"></my-import>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="hideActualImp">取消</el-button>
                    <el-button type="primary" size="mini" @click="addActual()">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import transportOperatingData from './transportOperatingData.js'
export default transportOperatingData
</script>
<style lang="scss" scoped>
</style>
