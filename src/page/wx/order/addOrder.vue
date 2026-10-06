<template>
    <div id="addOrder" class="wxAddOrderPage">
        <div style="line-height:500px;text-align:center;font-size:18px;" v-if="codeValid == 0">该二维码已失效</div>
        <div v-if="codeValid == 1">
        <!-- 去下单 -->
        <div class="step1" v-show="step == 1">
            <div class="siteList">
                <div class="item" v-for="(item,index) in workListTi" @click="setSite(item,1,index)">
                    <img class="icon" src="@/static/image/ti.png" alt="">
                    <div class="normal" v-show="!item.districtId">请填写详细地址</div>
                    <div v-show="item.districtId">
                        <div class="site">{{ item.provinceName }}{{ item.cityName }}{{ item.districtName }}</div>
                        <div class="address">{{item.address}}</div>
                    </div>
                    <van-icon name="add-o" @click.stop="addSite(1)" v-show="workListTi.length==1"/>
                    <van-icon name="close" @click.stop="delSite(1,index)" v-show="workListTi.length!=1" />
                </div>
                <div class="item" v-for="(item,index) in workListXie" @click="setSite(item,2,index)">
                    <img class="icon" src="@/static/image/xie.png" alt="">
                    <div class="normal" v-show="!item.districtId">请填写详细地址</div>
                    <div v-show="item.districtId">
                        <div class="site">{{ item.provinceName }}{{ item.cityName }}{{ item.districtName }}</div>
                        <div class="address">{{item.address}}</div>
                    </div>
                    <van-icon name="add-o" @click.stop="addSite(2)" v-show="workListXie.length==1"/>
                    <van-icon name="close" @click.stop="delSite(2,index)" v-show="workListXie.length!=1" />
                </div>
                <div class="result">{{ workListTi.length>1?'多':'一' }}装{{ workListXie.length>1?'多':'一' }}卸</div>
            </div>
            <div class="info">
                <div class="infoItem">
                    <div class="label"><em>*</em>业务类型</div>
                    <div class="text">
                        <div class="btn" :class="item.active?'active':''" v-for="(item,index) in bizTypeData" @click="pickData(index,bizTypeData,'bizType')">{{item.codeName}}</div>
                    </div>
                </div>
                <div class="infoItem">
                    <div class="label"><em>*</em>装货时间</div>
                    <div class="text">
                        <div class="time" @click="showPickerTime = true">
                            <span v-show="info.loadingTime">{{ info.loadingTimeName }}</span>
                            <span style="color:#999;" v-show="!info.loadingTime">请选择时间</span>
                            <van-icon name="arrow" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="common-btn">
                <van-button type="danger" round @click="next">去下单</van-button>
            </div>
        </div>

        <!-- 地址 -->
        <div class="siteView" v-show="step == 2">
            <div class="identifyView clearfix">
                <textarea v-model="siteInfo.identifyText" cols="30" rows="10" placeholder="粘贴信息，自动拆分详细地址、联系人、电话"></textarea>
                <van-button type="primary" round size="mini" @click="identify">识别</van-button>
            </div>
            <div class="siteInfo clearfix">
                <div class="title">{{siteInfo.title}}</div>
                <div class="siteSel">
                    <mycityH5 ref="mycity" @successCallback="confirmSitePick" :value="siteInfo"></mycityH5>
                    <van-icon name="arrow" />
                </div>
                <div class="detail">
                    <input v-model="siteInfo.address" type="text" placeholder="详细地址（例如**街**号**）">
                </div>
                <div class="personal">
                    <input v-model="siteInfo.linkmanName" class="name" type="text" placeholder="联系人姓名">
                    <input v-model="siteInfo.phone" class="phone" v-mynumval type="text" placeholder="联系人电话">
                </div>
                <van-button type="warning" round size="mini" @click="cleanSiteInfo">清空</van-button>
            </div>
            <div class="common-btn btns">
                <van-button plain type="danger" round @click="backHome">返回</van-button>
                <van-button type="danger" round @click="sureSite" >确定</van-button>
            </div>
        </div>

        <!-- 完善信息 -->
        <div class="goods" v-show="step == 3">
            <div class="h5-info">
                <div class="item">
                    <div class="label"><em>*</em>货物名称</div>
                    <div class="input-text">
                        <input type="text" v-model="info.goodsName" placeholder="请输入货物名称">
                    </div>
                </div>
                <div class="item" style="display:block;">
                    <div class="label" style="width:100%;margin-bottom: 8px;"><em>*</em>总重量/体积<em>（至少填写一项）</em></div>
                    <div class="innerItem clearfix">
                        重量（吨）
                        <van-stepper class="fr" v-model="info.weight" default-value="0" min="0" step="1" button-size="20px"/>
                    </div>
                    <div class="innerItem clearfix">
                        体积（立方）
                        <van-stepper class="fr" v-model="info.volume" default-value="0" min="0" step="1" button-size="20px"/>
                    </div>
                </div>
            </div>
            <div class="h5-info">
                <div class="item">
                    <div class="label"><em>*</em>车长车型</div>
                    <div class="input-text" @click="showVehicle = true">
                        {{ info.vehicleLengthName }}，{{ info.vehicleTypeName }}
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="item">
                    <div class="label"><em>*</em>结算方式</div>
                    <div class="input-text" @click="showPickerPayMode = true">
                        {{ info.payModeName }}
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="item">
                    <div class="label">是否需要回单</div>
                    <div class="input-text">
                        <van-switch v-model="info.haveReceipt" size="16px" active-color="green" inactive-color="grey" />
                    </div>
                </div>
                <div class="item">
                    <div class="label"><em>*</em>结算价</div>
                    <div class="input-text">
                        <input type="text" v-model="info.freight" v-mydoubleval placeholder="请输入运费">元/趟
                    </div>
                </div>
                <div class="item">
                    <div class="label">是否含税</div>
                    <div class="input-text">
                        <van-switch v-model="info.isInvoice" size="16px" active-color="green" inactive-color="grey" />
                    </div>
                </div>
                <div class="item" v-show="info.isInvoice">
                    <div class="label"><em>*</em>公司名称</div>
                    <div class="input-text">
                        <input type="text" v-model="info.tenantName" placeholder="请输入">
                    </div>
                </div>
            </div>
            <div class="h5-info">
                <div class="item">
                    <van-field
                        v-model="info.remark"
                        rows="3"
                        autosize
                        label="订单备注"
                        type="textarea"
                        maxlength="80"
                        placeholder="给司机捎句话"
                        show-word-limit
                    />
                </div>
            </div>
            <div class="common-btn btns">
                <van-button plain type="danger" round @click="backHome">返回</van-button>
                <van-button type="danger" round @click="save" >确认下单</van-button>
            </div>
        </div>

        <!-- 下单完成 -->
        <div v-show="step == 4" class="finishView">
            <div class="iconView">
                <van-icon name="checked" />
                <div class="text">提交成功</div>
            </div>
        </div>
        </div>

        <!-- 选择车长车型 -->
        <van-popup class="vehiclePopup" v-model="showVehicle" round position="bottom" :close-on-click-overlay="false">
            <div class="com-title">选择车长车型<van-icon name="cross" @click="cancelVehiclePick" /></div>
            <div class="com-label"><em>*</em>车长</div>
            <div class="pickerList clearfix">
                <div class="item" :class="item.active?'active':''" v-for="(item,index) in vehicleLengthData" @click="pickData(index,vehicleLengthData,'vehicleLength')">{{ item.codeName }}</div>
            </div>
            <div class="com-label"><em>*</em>车型</div>
            <div class="pickerList clearfix">
                <div class="item" :class="item.active?'active':''" v-for="(item,index) in vehicleTypeData" @click="pickData(index,vehicleTypeData,'vehicleType')">{{ item.codeName }}</div>
            </div>
            <div class="com-button">
                <van-button type="danger" round size="small" @click="sureVehiclePick" >确定</van-button>
            </div>
        </van-popup>
        
        <!-- 选择结算方式 -->
        <van-popup v-model="showPickerPayMode" round position="bottom">
            <van-picker
                title="选择结算方式"
                show-toolbar
                :columns="payModeData"
                value-key="codeName"
                @confirm="confirmPayMode"
                @cancel="showPickerPayMode = false"
            />
        </van-popup>

        <!-- 选择装货时间 -->
        <van-popup v-model="showPickerTime" round position="bottom">
            <!-- <van-datetime-picker
                v-model="currentDate"
                type="datetime"
                title="选择时间"
                @confirm="selectTime"
                @cancel="showPickerTime = false"
            /> -->
            <van-picker
                title="选择时间"
                show-toolbar
                :columns="datetimes"
                value-key="codeName"
                @confirm="confirmDatetime"
                @cancel="showPickerTime = false"
            />
        </van-popup>

        <!-- 遮罩层 -->
        <van-overlay :show="showOverlay"><van-loading type="spinner" color="#fff" /></van-overlay>
    </div>
</template>

<script>
    import addOrder from './addOrder.js'
    export default addOrder
</script>
<style lang="scss" src="./addOrder.scss" scoped></style>
