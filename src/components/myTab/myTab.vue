<template>
  <div id="myTab" class="myTab" ref="myTab" @click="hideRightMenu">
    <div class="scorllBox">
      <ul ref="scrollTab">
        <vuedraggable v-model="tabs" v-bind="dragOptions" @end="onDragEnd">
          <transition-group name="flip-list" type="transition">
            <li :class="{ 'active': item.active }" v-for="(item, index) in tabs" :key="index" :ref="'tab' + index"
              @click="changeTab(index)" @contextmenu.stop.prevent="showRightMenu(index, $event)">
              <i class="refresh" @click.stop="refresh(item.urlId)"></i>
              <span>{{ item.urlAliasName ? item.urlAliasName : item.urlName }}</span>
              <i class="close" @click.stop="close(item.urlId)" v-if="item.urlId != 0">×</i>
            </li>
          </transition-group>
        </vuedraggable>
      </ul>
    </div>
    <div class="arrow-btn clearfix">
      <!-- <div class="btn collect" @click="showCollectSet=true" title="收藏菜单">
            <img src="@/static/image/star1.png" alt="">
          </div> -->
      <div class="btn closeAll" @click="moveLeft" title="关闭全部子页面">
        <i class="close" @click.stop="closeAll()">×</i>
      </div>
      <div class="btn arrow-l" @click="moveLeft" v-show="showArrow"></div>
      <div class="btn arrow-r" @click="moveRight" v-show="showArrow"></div>
    </div>
    <el-dialog class="collectSet" title="收藏菜单" :visible.sync="showCollectSet" width="400px">
      <div class="tabList clearfix">
        <div class="item" v-for="(item, index) in tabsCollect" :key="index">
          <el-checkbox v-model="item.isSelect">{{ item.urlName }}</el-checkbox>
        </div>
      </div>
      <div class="page-bot-btn ">
        <el-button size="mini" @click="showCollectSet = false">关闭</el-button>
        <el-button type="primary" size="mini" @click="saveCollect">确认</el-button>
      </div>
    </el-dialog>
    <!-- 右键菜单 -->
    <div class="rightMenu" v-if="showRightMenuflag" :style="{ left: mouseX + 'px', top: mouseY + 'px' }" ref="rightMenu">
      <ul>
        <li @click.stop="closeCurrentTab" v-if="rightMenuIndex !== 0">关闭</li>
        <li @click.stop="closeOthers">关闭其他标签页</li>
        <li @click.stop="closeAll" v-if="rightMenuIndex !== 0">关闭所有标签页</li>
        <li @click.stop="closeLeftTabs" v-if="rightMenuIndex !== 0">关闭左侧标签页</li>
        <li @click.stop="closeRightTabs" v-if="rightMenuIndex !== tabs.length - 1">关闭右侧标签页</li>
      </ul>
    </div>
  </div>
</template>

<script>
import tab from './myTab.js'
export default tab
</script>

<style lang="scss" scoped src="./myTab.scss"></style>