<template>
    <div id="tree">
        <div class="tree-item" v-for="(item,index) in treedata" :key="index">
            <div class="tree-item-info" @mouseenter="hoverItem(item)" :class="{'active':item.active}">
                <div class="tree-item-zindex" @click.stop="openTab(item);selectItem(item);">
                    <i :class="{'folderState':true,'folderOpen':item.isShow,'folderClose':!item.isShow,'folderFile':(item.children==null||item.children.length==0)&&!item.notFolderFile}"></i>
                    <span v-if="!item.isEdit" @dblclick="dblclickItem(item)">{{item[label]}}<span v-if="haveTotal&&item[total]>0">({{item[total]}})</span></span>
                    <el-input placeholder="部门名称" autofocus="true" v-model="item[label]" v-if="item.isEdit"></el-input>
                    <div class="editBtn fr">
                        <span v-if="item.isEdit" @click.stop="saveItem(item)" class="btn">保存</span>
                        <span v-if="item.isEdit" @click.stop="cancelItem(item)" class="btn">取消</span>
                        <slot v-if="!item.isEdit" :item="item"></slot>
                    </div>
                </div>
            </div>
            <tree v-show="item.isShow && item.children!==null" v-slot="{item}" :treedata="item.children" class="itemChild" @dblclickItem="dblclickItem" @selectItem="selectItem" @hoverItem="hoverItem" @saveItem="saveItem" @cleanParent="cleanParent" @cleanSelectItem="cleanSelectItem" :label="label" :haveTotal="haveTotal" :total="total" :editItem="editItem">
                <slot :item="item"></slot>
            </tree>
        </div>
    </div>
</template>

<script>
    import tree from './tree.js'
    export default tree;
</script>
<style lang="scss" src="./tree.scss"></style>
