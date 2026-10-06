// 从完整URL中提取参数
const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};

    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
};

const routerParams = getUrlParams();

/**
 * 路由配置
 * routerParams为页面链接带参
 */
const routerConfig = {
    questionDetail: {
        query: routerParams,
        urlId: `questionDetail${routerParams.id || ''}`,
        urlName: '查看问题',
        urlPathName: '/questionDetail',
        urlPath: "/pt/base/hc/qa/questionDetail.vue",
    },
    viewRequirement: {
        query: routerParams,
        urlId: 'viewRequirement' + new Date().getTime(),
        urlName: "需求详情",
        urlPathName: "/viewRequirement",
        urlPath: "/pt/proj/requirement/requirementDetail.vue"
    }
};

export default routerConfig;