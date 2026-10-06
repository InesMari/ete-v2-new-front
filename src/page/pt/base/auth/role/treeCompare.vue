<template>
    <div id="treeCompare" class="treeCompare">
        <div class="tree-item" :class="{ 'lastDeep': item.lastDeep }"v-for="item in treedata" :key="item.id" v-show="!item.isHide">
            <div class="tree-item-info" :data-auth-status="getAuthStatus(item)">
                <div class="tree-item-zindex">
                    <i class="el-icon el-icon-arrow-right"
                        v-show="item.children && item.children.length > 0 && !item.isExpand"
                        @click="toggleExpand(item)"></i>
                    <i class="el-icon el-icon-arrow-down"
                        v-show="item.children && item.children.length > 0 && item.isExpand"
                        @click="toggleExpand(item)"></i>
                    <span class="tree-item-no-expand" v-show="!item.children || item.children.length === 0"></span>
                    <el-checkbox v-model="item.hasAuth" @change="handleCheckChange(item)">
                        <span v-html="getHighlightedText(item.entityName, searchQuery)"></span>
                    </el-checkbox>
                </div>
            </div>
            <treeCompare v-show="item.children && item.children.length > 0 && item.isExpand" :treedata="item.children"
                :tree-ref="treeRef" :search-query="searchQuery" class="itemChild" @expand-change="$emit('expand-change', $event)" @change-check="changeChecked">
                <slot :item="item"></slot>
            </treeCompare>
        </div>
    </div>
</template>

<script>
import treeCompare from './treeCompare.js'
export default treeCompare;
</script>

<style lang="scss" scoped>
.treeCompare {
    .tree-item {
        .tree-item-info {
            display: flex;
            align-items: center;
            padding: 4px 0;
            line-height: 20px;
            border-radius: 4px;
            margin: 2px 0;

            &:hover {
                background-color: #f5f7fa;
            }
        }

        .tree-item-zindex {
            display: flex;
            align-items: center;
            padding-left: 20px;
            gap: 8px;
            width: 100%;

            .el-icon {
                font-size: 12px;
                color: #c0c4cc;
                cursor: pointer;
                transition: transform 0.3s;
                width: 16px;
                display: flex;
                justify-content: center;

                &:hover {
                    color: #409eff;
                }
            }

            .tree-item-no-expand {
                width: 16px;
                height: 16px;
                display: inline-block;
            }

            .el-checkbox {
                margin-right: 0;
                flex: 1;

                ::v-deep .el-checkbox__label {
                    font-size: 14px;
                    color: #606266;
                    padding-left: 8px;
                }
            }

            // 高亮样式 - 必须放在 ::v-deep 内部以穿透到 v-html 内容
            ::v-deep .highlight {
                background-color: #f3d19e;
                padding: 0 2px;
                border-radius: 2px;
                font-weight: bold;
                color: #333;
            }
        }
    }

    // 递归子级缩进
    .itemChild {
        padding-left: 32px;
        margin-left: 8px;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            left: 19px;
            top: -4px;
            bottom: 8px;
            width: 1px;
            background-color: #e4e7ed;
        }
    }

    // 添加权限状态样式
    .tree-item-info {
        &[data-auth-status="removed"] {
            ::v-deep .el-checkbox__label {
                color: #f56c6c !important;
                font-weight: 500;
            }
        }

        &[data-auth-status="added"] {
            ::v-deep .el-checkbox__label {
                color: #67c23a !important;
                font-weight: 500;
            }
        }
    }


}
</style>
