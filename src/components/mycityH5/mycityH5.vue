<template>
    <div id="mycityH5" class="mycityH5">
        <div class="" @click="initPicker">
            <span v-if="!siteInfo.districtName" style="color: #999;">请选择省市区</span>
            <span v-if="siteInfo.districtName">{{ siteInfo.provinceName }}{{ siteInfo.cityName }}{{ siteInfo.districtName }}</span>
        </div>
        <van-popup v-model="showPicker" round position="bottom" @click-overlay="cancel">
            <van-picker
                ref="picker"
                value-key="name"
                v-if="showPicker"
                show-toolbar
                :columns="columns"
                @change="change"
                @cancel="cancel"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
    import mycityH5 from './mycityH5.js'
    export default mycityH5
</script>
<style lang="scss" src="./mycityH5.scss" scoped></style>
