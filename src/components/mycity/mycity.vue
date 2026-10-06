<template>
    <div id="mycity" class="mycity">
        <el-autocomplete 
            class="classValue" 
            @focus="showSelectArea()" 
            autocomplete="new" 
            :disabled="disabled" 
            v-model="areaValue" 
            :placeholder="placeholder" 
            :fetch-suggestions="querySearch"
            @select="handleSelect"
            value-key="name"
            :trigger-on-focus="false"
        ></el-autocomplete>
        <div class="ma" v-show="selectArea" style="position: absolute;z-index: 999999;">
            <div class="content1">
                <div class="m JD-stock">
                    <span>
                        <div class="dx_a" style="margin-top:5px;">
                            您的筛选条件：<span>{{chooseProvinceName}}<em></em></span><span>{{chooseCityName}}<em></em></span><span>{{chooseDistrictName}}<em></em></span><span>{{chooseStreetName}}<em></em></span>
                        </div>
                    </span>
                    <div class="mt">
                        <ul class="tab">
                            <li @click="changeTab(1)" :class="{'curr':tabShowIndex==1}"><a
                                    href="javascript:void(0);" :class="{'hover':tabShowIndex==1}"><em>省份</em><i></i></a>
                            </li>
                            <li v-show="selectAreaType==2||selectAreaType==3||selectAreaType==4" @click="changeTab(2)" :class="{curr:tabShowIndex==2}"><a
                                    href="javascript:void(0);" :class="{hover:tabShowIndex==2}"><em>地市</em><i></i></a>
                            </li>
                            <li v-show="selectAreaType==3||selectAreaType==4" @click="changeTab(3)" :class="{curr:tabShowIndex==3}"><a href="javascript:void(0);"
                                    :class="{hover:tabShowIndex==3}"><em>县区</em><i></i></a></li>
                            <li v-show="selectAreaType==4" data-index="4" @click="changeTab(4)" :class="{curr:tabShowIndex==4}"><a href="javascript:void(0);"
                                    :class="{hover:tabShowIndex==4}"><em>镇/乡/街道</em><i></i></a></li>
                        </ul>
                        <div class="stock-line"></div>
                    </div>
                    <div class="mc" v-show="tabShowIndex==1">
                        <ul class="area-list">
                            <li v-for="(item,index) in province" :key="index"
                                @click="selectProvince(item.id,item.name)"><a :class="{'bh':chooseProvinceId==item.id}"
                                    href="javascript:void(0);">{{item.name}}</a></li>
                        </ul>
                    </div>
                    <div class="mc" v-show="tabShowIndex==2">
                        <ul class="area-list">
                            <li v-for="(item,index) in cityData" :key="index" @click="selectCity(item.id,item.name)"><a
                                    :class="{'bh':chooseCityId==item.id}"
                                    href="javascript:void(0);">{{item.name}}</a></li>
                        </ul>
                    </div>
                    <div class="mc" v-show="tabShowIndex==3">
                        <ul class="area-list">
                            <li @click="selectDistrict(item.id,item.name)"
                                v-for="(item,index) in districtData" :key="index"><a
                                    :class="{'bh':chooseDistrictId==item.id}"
                                    href="javascript:void(0);">{{item.name}}</a></li>
                        </ul>
                    </div>
                    <div class="mc" v-show="tabShowIndex==4">
                        <ul class="area-list">
                            <li @click="selectStreet(item.id,item.name)"
                                v-for="(item,index) in streetData" :key="index"><a
                                    :class="{'bh':chooseStreetId==item.id}"
                                    href="javascript:void(0);">{{item.name}}</a></li>
                        </ul>
                    </div>
                    <div class="titleCity">
                        <h5>选择地市信息</h5>
                    </div>
                    <div class="close_m"><a class="ui-city-close" href="javascript:void(0);" @click="close()">x</a></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mycity from './mycity.js'
    export default mycity
</script>
<style lang="scss" src="./mycity.scss"></style>
