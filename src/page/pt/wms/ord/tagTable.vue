<template>
    <div id="tagTable" class="tagTablePage">

        <!-- 标签详情 -->
        <div class="formView">
            <el-button v-if="showTagBtn" class="fl" type="primary" plain size="mini"  @click="printTagCode()">标签预览</el-button>
            <el-input class="fl" type="text" v-model="tagSearch" @input="searchCode" placeholder="模糊搜索标签"></el-input>
        </div>
        <div class="tagTable">
            <scrollTable ref="tagTable" :head="head" :isShowSelect="showTagBtn" :doSum="true">
                <template v-slot:default="{item, code, head}">
                    <a href="javascript:void(0);" class="link" @click.stop="toDetail(item)">{{ item[code] }}</a>
                </template>
            </scrollTable>
        </div>
    </div>
</template>

<script>
import tagTable from './tagTable.js'

export default tagTable
</script>

<style lang="scss" scoped>

.tagTablePage{
    position: relative;
    height: calc(100% - 50px);
    background: #fff;
    /deep/ .tagTable{
        height: 100%;
        tr.disabled{
            td{
                color: #999!important;
            }
        }
        .scrollTableComponents{
            height: 100%;
            .table_height{
                height: 100%;
                max-height: none;
                border:$border;
            }
            .tableCommon{
                border:none;
            }
        }
    }
    /deep/ .formView{
        position: absolute;
        right: 20px;
        top: -34px;
        .el-input{
            float: left;
            width: 250px;
            margin-left: 10px;
            .el-input__inner{
                height: 28px;
                line-height: 28px;
                text-align: center;
            }
        }
    }
}
</style>
