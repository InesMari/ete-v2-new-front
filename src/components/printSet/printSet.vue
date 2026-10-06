<template>
    <div id="printSet" class="printSet">
        <el-dialog title="设置打印机" :visible.sync="isShow" center width="350px" :before-close="hidePrint">
            <div class="common-info" style="border:none;">
                <ul class="content clearfix" v-for="(item,index) in devicesList" :key="index">
                    <li class="item item100">
                        <label class="label-term"><em></em>{{item.bizName}}</label>
                        <div class="input-text">
                            <el-select v-model="item.printerName"  placeholder="请选择">
                                <el-option v-for="item in devicesListTem" :key="item.printerName" 
                                :label="item.printerName" :value="item.printerName"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hidePrint()">取 消</el-button>
                <el-button type="primary" @click="sureSet()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import printSet from './printSet.js'
    export default printSet
</script>
<style lang="scss">
    .printSet{
        .el-dialog__body{
            padding:0;
            .common-info{
                padding-bottom:15px;
            }
        }
    }
</style>