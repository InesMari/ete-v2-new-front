<template>
    <div id="addRoute" class="addRoutePage">
        <!--线路基本数据  开始-->
        <div class="common-info" style="padding-bottom:20px;margin-bottom:10px;">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>线路名称</label>
                    <div class="input-text">
                        <el-input v-model="form.routeName" @blur="checkedExistSameRoute()" maxlength="255" show-word-limit></el-input>
                    </div>
                </li>
				<li class="item" style="width: 14%;">
					<label class="label-term"><em>*</em>业务类型</label>
					<div class="input-text">
						<el-select v-model="form.bizType" placeholder="业务类型">
							<el-option v-for="item in bizTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
						</el-select>
					</div>
				</li>
                <li class="item" style="width: 14%;">
                    <label class="label-term"><em>*</em>运输时效</label>
                    <div class="input-text">
                        <el-input v-model="form.transportTimeliness" v-mydouble4val maxlength="15" placeholder="小时为单位的数值"></el-input>
                    </div>
                </li>
                <li class="item" style="width: 14%;">
                    <label class="label-term">订单类型</label>
                    <div class="input-text">
                        <el-radio-group v-model="form.orderType" @change="changeOrderType">
                            <el-radio-button label="1">整车</el-radio-button>
                            <el-radio-button label="2">零担</el-radio-button>
                        </el-radio-group>
                    </div>
                </li>
                <li class="item" style="width: 14%;" v-show="isShowReturn">
                    <label class="label-term">是否返程</label>
                    <div class="input-text">
                        <el-radio-group v-model="form.isReturn">
                            <el-radio-button label="0">否</el-radio-button>
                            <el-radio-button label="1">是</el-radio-button>
                        </el-radio-group>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item100">
                    <label class="label-term">备注信息</label>
                    <div class="input-text">
                        <el-input v-model="form.remark" maxlength="500" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
        </div>
        <!--线路基本数据  结束-->

        <div class="common-info">
            <!--线路路线导航 开始-->
            <div class="routeList clearfix">
                <div v-for="(item,index) in routeList" :key="index">
                    <div class="item" v-if="index!==routeList.length-1" :style="'width:' + routeWidth">
                        <div class="info">
                            <div class="mark get" v-if="item.workType == 1">提</div>
                            <div class="mark mini" v-else-if="item.workType == 3">提卸</div>
                            <div class="mark mini" v-else>卸</div>
                            <div class="name textOverFlow" :title="item.workName">{{ item.workName }}</div>
                            <i class="el-icon-remove-outline" @click="removeRouteWorkItem(index)"
                               v-show="index != 0"></i>
                        </div>
                        <div class="add" v-show="isShowReturn" @click="addRouteWorkItem(index)">+</div>
                    </div>
                </div>
                <div class="lastItem">
                    <div class="info">
                        <div class="mark">卸货</div>
                        <span class="name  textOverFlow">{{ routeList[routeList.length - 1].workName }}</span>
                    </div>
                </div>
            </div>
            <!--线路路线导航 结束-->

            <!--线路作业点 开始-->
            <ul class="content clearfix" v-for="(item,index) in routeList" :key="index">
                <li class="item item-tip">
                    <label class="label-term">作业点</label>
                    <div class="input-text">
                        <div :class="item.workType == 1 ? 'tip' : 'tip unload'">
                          <span @click="showWorkTypeTop(item)">
                            <span v-if="item.workType == 1">提</span>
                            <span v-if="item.workType == 3">提卸</span>
                            <span v-if="item.workType == 2">卸</span>
                          </span>
                          <div class="tip-toolsTip" v-show="index > 0 && index < routeList.length - 1 && item.shoToolsTip">
                            <span class="tip" :class="{'unload':tip.codeValue==3||tip.codeValue==2}" v-for="tip in workTypeData"
                                  :key="tip.codeValue" @click="sureWorkType(item, tip.codeValue)">
                            {{ tip.codeName }}
                            </span>
                          </div>
                        </div>
                        <el-select v-model="item.workId" @click.native="selectWorkTip" @change="changeWork(item)" filterable clearable placeholder="请选择作业点">
                            <el-option v-for="itemW in workData" :key="itemW.workId" :label="itemW.workName" :value="itemW.workId" :disabled="itemW.disabled">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">联系人</label>
                    <div class="input-text">
                        <el-input v-model="item.linkmanName" @input="forceUpdate" maxlength="50" show-word-limit></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">联系手机</label>
                    <div class="input-text">
                        <el-input v-model="item.bill" @input="forceUpdate" v-mynumval maxlength="11" show-word-limit></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">联系电话</label>
                    <div class="input-text">
                        <el-input v-model="item.phone" @input="forceUpdate" maxlength="100" show-word-limit></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">省市区</label>
                    <div class="input-text">
                        <el-input v-model="item.pcdName" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item" style="width:48%;">
                    <label class="label-term">详细地址</label>
                    <div class="input-text">
                        <el-input v-model="item.address" :disabled="true"></el-input>
                    </div>
                </li>
            </ul>
            <!--线路作业点 结束-->

            <!--线路常用货物  开始-->
            <div class="bot-table clearfix">
                <div class="fl tableName" ref="tableName">
                    常用货物
                </div>
                <div class="fr table" ref="table">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th>货物名称</th>
                            <th>货物类别</th>
                            <th>包装</th>
                            <th>规格</th>
                            <th width="80">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(data,index) in tableData" :key="index">
                            <td>
                                <el-select v-model="data.goodsId" @click.native="selectGoodsTip" @change="changeGoods(data)" filterable clearable placeholder="请选择货物">
                                    <el-option v-for="itemG in goodsData" :key="itemG.goodsId" :label="itemG.goodsName" :value="itemG.goodsId" :disabled="itemG.disabled">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="data.className" :disabled="true"></el-input>
                            </td>
                            <td>
                                <el-select v-model="data.packingType" @change="changeGoods(data)" filterable clearable disabled placeholder="请选择货物">
                                    <el-option v-for="item in packingTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="data.goodsModel" :disabled="true"></el-input>
                            </td>
                            <td>
                                <i class="el-icon-remove-outline icon" style="margin-right:5px;"
                                   @click="removeRouteGoodsItem(index,data)"></i>
                                <i class="el-icon-circle-plus-outline icon" @click="addRouteGoodsItem(index)"
                                   v-show="index === tableData.length - 1"></i>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!--线路常用货物  结束-->

            <div class="bot-btn">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="addRoute()">保存</el-button>
            </div>

        </div>
    </div>
</template>

<script>
	import addRoute from './addRoute.js'

	export default addRoute
</script>
<style lang="scss" src="./addRoute.scss">
</style>
