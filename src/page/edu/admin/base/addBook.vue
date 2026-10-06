<template>
    <div id="addBook" class="addBookPage">
        <div class="common-info">
            <div class="innerTab clearfix">
                <div class="innerItem" :class="showType==1?'active':''" @click="changeTab(1)">
                    <p class="inline"><i class="el-icon-collection-tag"></i> 书籍推荐</p>
                </div>
                <div class="innerItem" :class="showType==2?'active':''" @click="changeTab(2)">
                    <p class="inline"><i class="el-icon-message"></i> 书籍内容</p>
                </div>
            </div>
            <div class="courseInfo" v-show="showType==1">
                <ul class="content clearfix" style="width:620px;">
                    <li class="item">
                        <label class="label-term"><em>*</em>书籍名称</label>
                        <div class="input-text">
                            <el-input v-model="info.bookName" @input="$forceUpdate();" placeholder="请填写20个字以内的书籍名称" maxlength="20" show-word-limit :disabled="disable"></el-input>
                        </div>
                    </li>
                    <li class="item">
                      <label class="label-term"><em>*</em>书籍作者</label>
                      <div class="input-text">
                        <el-input v-model="info.bookAuthor" @input="$forceUpdate();" :disabled="disable"></el-input>
                      </div>
                    </li>
                    <li class="item uploadImg">
                      <label class="label-term"><em>*</em>上传封面</label>
                      <div class="input-text">
                        <myFileModel ref="imgCover" supportFiles="img" @successCallback="imgCoverCallback" :disabledEdit="disable" :disabled-del="disable"></myFileModel>
                        <div><em>(支持jpg、jpeg、png等格式的图片，建议尺寸400*300像素，大小不超过2M。)</em></div>
                      </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>推荐指数</label>
                        <div class="input-text">
                          <el-rate v-model="info.recommendIndex" :disabled="disable"></el-rate>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>书籍借阅</label>
                        <div class="input-text">
                            <el-select v-model="info.borrowOrgId" clearable filterable placeholder="请选择" :disabled="disable">
                                <el-option v-for="item in orgData" :key="item.id"
                                            :label="item.orgName  "
                                            :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term"><em>*</em>推荐语</label>
                        <div class="input-text" :class="disable?'disable':''">
                            <WangEditor ref="recommendation" :disabled="disable"></WangEditor>
                        </div>
                    </li>
                </ul>
                <div class="bot-btn">
                    <el-button type="primary" @click="changeTab(2)">下一步</el-button>
                </div>
            </div>
            <div class="courseInfo" v-show="showType==2">
                <ul class="content clearfix" style="width:700px;">
                  <li class="item">
                    <label class="label-term">内容简介</label>
                    <div class="input-text">
                      <el-input v-model="info.contentOverview" type="textarea" maxlength="2000" :autosize="{minRows:8}" placeholder="" @input="$forceUpdate();" :disabled="disable"></el-input>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term">作者简介</label>
                    <div class="input-text">
                      <el-input v-model="info.authorOverview" type="textarea" maxlength="2000" :autosize="{minRows:8}" placeholder="" @input="$forceUpdate();" :disabled="disable"></el-input>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term">试读内容</label>
                    <div class="input-text">
                      <el-input v-model="info.trialContent" type="textarea" maxlength="2000" :autosize="{minRows:8}" placeholder="" @input="$forceUpdate();"  :disabled="disable"></el-input>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix">
                  <li class="item">
                    <label class="label-term">书籍目录</label>
                    <div class="input-text" :class="disable?'disable':''">
                      <WangEditor ref="bookContents"></WangEditor>
                    </div>
                  </li>
                </ul>

                <div class="bot-btn">
                    <el-button type="primary" @click="changeTab(1)">上一步</el-button>
                    <el-button type="primary" @click="save">保存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import addBook from './addBook.js'
export default addBook
</script>


<style lang="scss" scoped src="./addBook.scss"></style>
