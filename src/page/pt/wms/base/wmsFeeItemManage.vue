<template>
    <div id="wmsFeeItemManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsFeeItemManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用项目名称列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="费用项目名称" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1008022" @click="addFeeItem()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1008023" @click="updateFeeItem">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1008024" @click="deleteFeeItem">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1008035" @click="verifyFeeItem">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1008036" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsFeeItemManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

        <!--        新增/修改数据       -->
        <el-dialog :title="title" :visible.sync="showDialog" width="40%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>类型</label>
                        <div class="input-text">
                            <el-select v-model="feeItem.itemType" placeholder="请选择类型" filterable clearable
                                       :disabled="isLock||feeItem.id>0" @change="changeItemType">
                                <el-option v-for="item in itemTypeData" :key="item.codeValue"
                                           :label="item.codeName"
                                           :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                  <li class="item item50" v-if="subItemTypeData.length>0">
                    <label class="label-term">子类型</label>
                    <div class="input-text">
                      <el-select v-model="feeItem.subItemType" placeholder="请选择子类型" filterable
                                 :disabled="isLock||feeItem.id>0" @change="initFeeItemName">
                        <el-option v-for="item in subItemTypeData" :key="item.codeValue"
                                   :label="item.codeName"
                                   :value="item.codeValue">

                        </el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item50" v-if="feeItem.itemType!='106'&&feeItem.itemType!='107'">
                    <label class="label-term">规格类型</label>
                    <div class="input-text">
                      <el-select v-model="feeItem.specsType" placeholder="请选择规格类型" filterable
                                 :disabled="isLock||feeItem.id>0" @change="initFeeItemName">
                        <el-option v-for="item in specsTypeData" :key="item.codeValue"
                                   :label="item.codeName"
                                   :value="item.codeValue">
                        </el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item50"  v-if="feeItem.itemType=='104'">
                    <label class="label-term">是否紧急</label>
                    <div class="input-text">
                      <el-switch v-model="feeItem.urgent == 1" @change="changeInfoSwitch('urgent')" active-color="#13ce66" inactive-color="#ff4949"/>
                      <span class="name">{{ feeItem.urgent == 1 ? "是" : "否" }}</span>
                    </div>
                  </li>
                  <li class="item item50" v-if="feeItem.itemType=='106'||feeItem.itemType=='107'">
                    <label class="label-term">费用类型</label>
                    <div class="input-text">
                      <el-select v-model="feeItem.feeType" placeholder="请选择子类型" filterable
                                 :disabled="isLock||feeItem.id>0" @change="initFeeItemName">
                        <el-option v-for="item in feeTypeData" :key="item.codeValue"
                                   :label="item.codeName"
                                   :value="item.codeValue">

                        </el-option>
                      </el-select>
                    </div>
                  </li>
<!--                  <li class="item item50" v-if="feeItem.itemType=='106'">-->
<!--                    <label class="label-term">是否自有</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-select v-model="feeItem.isSelf" placeholder="请选择是否自有" filterable-->
<!--                                 :disabled="isLock||feeItem.id>0" @change="initFeeItemName">-->
<!--                        <el-option v-for="item in whetherData" :key="item.codeValue"-->
<!--                                   :label="item.codeName"-->
<!--                                   :value="item.codeValue">-->

<!--                        </el-option>-->
<!--                      </el-select>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item item50" v-if="feeItem.itemType=='106'">-->
<!--                    <label class="label-term">是否经外仓</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-select v-model="feeItem.isOutWarehouse" placeholder="请选择是否经外仓" filterable-->
<!--                                 :disabled="isLock||feeItem.id>0" @change="initFeeItemName">-->
<!--                        <el-option v-for="item in whetherData" :key="item.codeValue"-->
<!--                                   :label="item.codeName"-->
<!--                                   :value="item.codeValue">-->

<!--                        </el-option>-->
<!--                      </el-select>-->
<!--                    </div>-->
<!--                  </li>-->
                  <li class="item item50" v-if="feeItem.itemType=='106'||feeItem.itemType=='107'">
                    <label class="label-term">器具</label>
                    <div class="input-text">
                      <el-select v-model="feeItem.deviceId" placeholder="请选择器具" filterable
                                 :disabled="isLock||feeItem.id>0" @change="initFeeItemName">
                        <el-option v-for="item in deviceData" :key="item.id"
                                   :label="item.name"
                                   :value="item.id">

                        </el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term"><em>*</em>费用项目名称</label>
                    <div class="input-text">
                      <el-input v-model="feeItem.name" maxlength="50" placeholder="请输入费用项目名称"
                                :disabled="isLock||feeItem.id>0||nameDisable"></el-input>
                    </div>
                  </li>
                    <li class="item item50">
                        <label class="label-term">默认价格单位</label>
                        <div class="input-text">
                          <el-select v-model="feeItem.unit" placeholder="请选择默认价格单位" filterable clearable
                                     :disabled="isLock">
                            <el-option v-for="item in unitList" :key="item.codeName"
                                       :label="item.codeName"
                                       :value="item.codeName">

                            </el-option>
                          </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">税率(%)</label>
                        <div class="input-text">
                            <el-input v-model="feeItem.tax" maxlength="3" v-mynumval placeholder="请输入税率"
                                      :disabled="isLock" @input="calcFee('tax')"></el-input>
                        </div>
                    </li>
                  <li class="item item50">
                    <label class="label-term">默认未税价格</label>
                    <div class="input-text">
                      <el-input v-model="feeItem.price" v-mypmdouble4val placeholder="请输入默认未税价格"
                                :disabled="isLock" @input="calcFee('price')"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term">默认含税价格</label>
                    <div class="input-text">
                      <el-input v-model="feeItem.priceWithTax" v-mypmdouble4val placeholder="请输入默认含税价格"
                                :disabled="isLock" @input="calcFee('priceWithTax')"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term">是否默认项目</label>
                    <div class="input-text">
                      <el-switch v-model="feeItem.defaultItem == 1" @change="changeInfoSwitch('defaultItem')" active-color="#13ce66" inactive-color="#ff4949"/>
                      <span class="name">{{ feeItem.defaultItem == 1 ? "是" : "否" }}</span>
                    </div>
                  </li>
                    <li class="item item100" style="width:98%;">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="feeItem.remark" maxlength="50" placeholder="写点什么?"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveOrUpdateFeeItem()" v-if="!isLock">确认
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!--        新增/修改数据       -->
    </div>
</template>

<script>
import wmsFeeItemManage from './wmsFeeItemManage.js'

export default wmsFeeItemManage
</script>
<style lang="scss">

</style>




