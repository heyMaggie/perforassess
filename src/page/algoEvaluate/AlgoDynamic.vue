<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>算法动态</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline search-row">
            <div class="input-area">
                <el-form-item>
                    <el-select v-model="searchForm.provider" clearable placeholder="厂商">
                        <el-option v-for="item in providerList" :key="item" :label="item" :value="item">{{ item }}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algo_type" clearable placeholder="算法类型" @focus="selectAlgoType">
                        <el-option v-for="item in algoTypeList" :key="item" :label="item" :value="item">{{ item }}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algo_id" clearable placeholder="算法" @focus="selectAlgoList">
                        <el-option v-for="item in algoList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="button-right">
                <el-button type="primary" @click="onSubmit">确定</el-button
                ><el-button type="plain" @click="onGoHistory">查看历史</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="card radarCard" id="radar"></div>
            <div class="card" id="main1"></div>
            <div class="card grade-lump">
                <div class="score">
                    <div class="number">{{ compositeScore }}</div>
                    <div class="text">综合评分</div>
                    <el-rate class="rate" v-model="startValue" disabled> </el-rate>
                    <div class="rank-icon">{{ ranking }}</div>
                </div>
                <el-empty
                    v-if="!dimensionalityList.length"
                    description="暂无数据"
                    class="medium-empty"
                    :image="require('../../assets/img/empty.png')"
                ></el-empty>
                <div v-else class="dimensionality" v-for="item in dimensionalityList" :key="item.title">
                    <div class="title">{{ item.title }}</div>
                    <div class="explain" :title="item.desc">{{ item.desc }}</div>
                </div>
            </div>
            <div class="card" id="main2"></div>
            <div class="card">
                <div class="card-title">资金占比</div>
                <div class="blur-card" id="pie1"></div>
                <!-- <el-empty v-if="!marketRate.length" description="暂无数据" class="min-empty"></el-empty>
                <div v-show="marketRate.length" class="blur-card" id="pie1"></div> -->
            </div>
            <div class="card">
                <div class="card-title">买卖方向</div>
                <div class="blur-card" id="pie2"></div>
            </div>
            <div class="card">
                <div class="card-title">股价类型</div>
                <el-empty
                    v-show="!priceType.length"
                    description="暂无数据"
                    class="min-empty"
                    :image="require('../../assets/img/empty.png')"
                ></el-empty>
                <div class="blur-card" id="pie3"></div>
            </div>
            <div class="card">
                <div class="card-title">交易量</div>
                <div class="blur-card" id="pie4"></div>
                <!-- <el-empty v-if="!volType.length" description="暂无数据" class="min-empty"></el-empty>
                <div class="blur-card" v-show="volType.length" id="pie4"></div> -->
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { dynamicApi, optionListApi } from '@/api/index';
import fiexdDate from '../../utils/fixeddate';
const dayjs = require('dayjs');
export default {
    name: 'baseform',
    data() {
        return {
            searchForm: {
                provider: '',
                algo_type: '',
                algo_id: ''
            },
            providerList: [],
            algoTypeList: [],
            algoList: [],
            currentPage: 1,
            startValue: 0, //星星
            dimension: [], //五个维度
            compositeScore: 0, // 综合评分数
            dimensionalityList: [], // 综合评分列表
            ranking: 0, //排名
            marketRate: [], //买卖占比
            side: [], //买卖方向
            priceType: [], //股价类型
            volType: [], //交易量
            assessLine: [], //绩效
            progressLine: [], //完成度
            titleList: ['算法经济性分析', '算法完成度分析', '算法风险度分析', '算法绩效分析', '算法稳定性分析']
        };
    },
    created() {
        this.getDynamicData();
        // 获取厂商列表
        let query = {
            choose_type: 1
        };
        this.getOptionList(query, 'providerList', 'provider');
    },
    watch: {
        'searchForm.provider'(newV, oldV) {
            if (!newV) {
                this.searchForm = {
                    provider: '',
                    algo_type: '',
                    algo_id: ''
                };
                this.algoTypeList = [];
                this.algoList = [];
            }
        },
        'searchForm.algo_type'(newV, oldV) {
            if (!newV) {
                this.searchForm.algo_id = '';
                this.algoList = [];
            }
        }
    },
    mounted() {},
    methods: {
        onGoHistory() {
            this.$router.push('/algoDynamicDetail');
        },
        onSubmit() {
            console.log(this.searchForm);
            this.getDynamicData();
        },
        getRadarChart(radarList) {
            console.log(radarList, 'radarList');
            let option = {
                color: ['#3281FF', '#FACC14', '#2FC25B'],
                radar: [
                    {
                        indicator: [
                            {
                                name: '经济性',
                                max: 10
                            },
                            {
                                name: '完成度',
                                max: 10
                            },
                            {
                                name: '风险度',
                                max: 10
                            },
                            {
                                name: '算法绩效',
                                max: 10
                            },
                            {
                                name: '绩效稳定性',
                                max: 10
                            }
                        ],
                        center: ['50%', '50%'],
                        radius: 100,
                        // startAngle: 90,
                        // splitNumber: 3,
                        // orient: 'c', // 图例列表的布局朝向,默认'horizontal'为横向,'c'为纵向.
                        axisName: {
                            formatter: '{value}',
                            fontSize: 14, //外圈标签字体大小
                            color: '#333333' //外圈标签字体颜色
                        },
                        splitArea: {
                            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                            show: true,
                            areaStyle: {
                                // 分隔区域的样式设置。
                                color: ['RGBA(224, 239, 255, .6)', '#F5F9FF', '#F5F9FF', '#F5F9FF', '#F5F9FF'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                            }
                        },

                        axisLine: {
                            //指向外圈文本的分隔线样式
                            lineStyle: {
                                color: '#EAEAEB',
                                type: 'dashed'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#EAEAEB', // 分隔线颜色
                                width: 1, // 分隔线线宽
                                type: 'dashed'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '雷达图',
                        type: 'radar',
                        emphasis: {
                            lineStyle: {
                                width: 4
                            }
                        },
                        data: [
                            {
                                name: '算法',
                                value: radarList,
                                areaStyle: {
                                    // 单项区域填充样式
                                    color: {
                                        type: 'linear',
                                        x: 0, //右
                                        y: 0, //下
                                        x2: 1, //左
                                        y2: 1, //上
                                        colorStops: [
                                            {
                                                offset: 0,
                                                color: '#E4F1FF'
                                            },
                                            {
                                                offset: 0.5,
                                                color: '#E4F1FF'
                                            },
                                            {
                                                offset: 1,
                                                color: '#E4F1FF'
                                            }
                                        ],
                                        globalCoord: false
                                    },
                                    opacity: 0.4 // 区域透明度
                                },
                                symbolSize: 2.5, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
                                label: {
                                    // 单个拐点文本的样式设置
                                    show: true, // 单个拐点文本的样式设置。[ default: false ]
                                    position: 'top', // 标签的位置。[ default: top ]
                                    distance: 2, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                                    color: '#333333', // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                                    fontSize: 14, // 文字的字体大小
                                    formatter: function (params) {
                                        return params.value;
                                    }
                                },
                                itemStyle: {
                                    //图形悬浮效果
                                    borderColor: '#3281FF',
                                    borderWidth: 3.5
                                    // normal: {
                                    //     //图形悬浮效果
                                    //     borderColor: '#3281FF',
                                    //     borderWidth: 3.5
                                    // }
                                }
                            }
                        ]
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById('radar'));
            option && myChart.setOption(option);
            myChart.resize();
        },
        generateChart(list = [], type) {
            list = !list ? [] : list;
            let yDataList = [];
            let isNull;
            yDataList.length = fiexdDate.length;
            if (!list.length) {
                isNull = true;
            } else {
                isNull = false;
                list.forEach((params) => {
                    fiexdDate.forEach((item, i) => {
                        if (params.time_point == item) {
                            yDataList[i] = params.score;
                        }
                    });
                });
            }

            let lineObj = {
                main1: { name: '实时绩效', color: '#83BDFF' },
                main2: { name: '实时完成度', color: '#FCE75F' }
            };
            let option = {
                title: {
                    text: lineObj[type].name,
                    textStyle: {
                        color: '#333333',
                        fontSize: 20,
                        fontWeight: 500
                    }
                },
                textStyle: {
                    color: '#333'
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#1F2329',
                    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1F2329',
                    textStyle: {
                        color: '#fff'
                    }
                },

                grid: {
                    left: '5px',
                    right: '20px',
                    bottom: '0px',
                    top: '65px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: fiexdDate,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#E9E9E9',
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        interval: 29,
                        color: '#000'
                        // rotate: 30,
                    },
                    axisTick: {
                        show: true, //显示X轴刻度
                        lineStyle: {
                            color: '#E9E9E9'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#E8E8E8'
                        }
                    },
                    axisPointer: {
                        type: 'line',
                        lineStyle: { color: '#BDBEBF' }
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: `单位：（%）`,
                        // nameLocation: 'start',
                        axisLine: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#888',
                            padding: [0, 0, 0, 30]
                        },
                        axisTick: {
                            show: false //隐藏X轴刻度
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E9E9E9',
                                type: 'dashed'
                            }
                        },
                        min: isNull ? 0 : null,
                        max: isNull ? 100 : null
                    }
                ],
                series: [
                    {
                        name: '算法单数',
                        type: 'line',
                        smooth: true,
                        showSymbol: true,
                        showAllSymbol: true,
                        data: yDataList,
                        itemStyle: {
                            color: lineObj[type].color
                        },
                        connectNulls: true,
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: lineObj[type].color
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(255,255,255,0)'
                                    }
                                ],
                                false
                            ),
                            opacity: 0.2,
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById(type));
            myChart.clear();
            myChart.setOption(option);
            myChart.resize();
        },
        getPieChart(type, rateList) {
            var myChart;
            var chartDom = document.getElementById(type);
            myChart = echarts.init(chartDom);
            var option;
            console.log(rateList, 'rateList');
            // rateList = [
            //     { name: '超大市值', value: '0.0' },
            //     { name: '大市值', value: '0.0' },
            //     { name: '小市值', value: '100.00' }
            // ];
            let pieObj = {
                pie1: { name1: '资 金 占 比', colorList: ['#F78B7F', '#FACC14', '#7CB3FF', '#2FC25B'] },
                pie4: { name1: '交易量占比', colorList: ['#83E3FF', '#FACC14', '#32B7FF', '#7CB3FF'] }
            };
            option = {
                title: [
                    {
                        text: pieObj[type].name1,
                        x: '19%',
                        top: '38%',
                        textStyle: {
                            color: '#333333',
                            fontSize: 14,
                            fontWeight: '100',
                            fontWeight: '600',
                            fontFamily: 'Lato'
                        }
                    },
                    {
                        text: '（%）',
                        x: '24%',
                        top: '50%',
                        textStyle: {
                            fontSize: '14',
                            color: '#333333'
                        }
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#1F2329',
                    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1F2329',
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: 'vartical',
                    icon: 'circle',
                    itemWidth: 8,
                    x: 'right',
                    top: 'center',
                    left: '200px',
                    bottom: '0%',
                    textStyle: { color: ' #999' }
                },
                grid: {
                    left: '-100px'
                },
                series: [
                    {
                        name: pieObj[type].name1 + '（%）',
                        type: 'pie',
                        radius: ['60%', '80%'],
                        itemStyle: {
                            borderRadius: 0,
                            borderColor: '#fafbff',
                            borderWidth: 5,
                            color: function (colors) {
                                var colorList = pieObj[type].colorList;
                                return colorList[colors.dataIndex];
                            }
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        left: -140,
                        selectedOffset: 20,
                        labelLine: {
                            show: true
                        },
                        data: rateList
                    }
                ]
            };
            myChart.clear();
            option && myChart.setOption(option, true);
        },
        getSemicircle() {
            var myChart;
            var chartDom = document.getElementById('pie2');
            myChart = echarts.init(chartDom);
            var option;
            let sell_rate = 0;
            let buy_rate = 0;
            if (this.side) {
                sell_rate = (this.side.sell_rate / 1).toFixed(1);
                buy_rate = (this.side.buy_rate / 1).toFixed(1);
            }
            option = {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['27%', '68%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '100%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: '#4DCB73'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [[1, '#DEEFE4']]
                            }
                        },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: {
                            distance: 5,
                            color: '#666',
                            fontSize: 0,
                            formatter: function (value) {
                                if (value === 0 || value === 100) {
                                    return value + '%';
                                }
                            }
                        },
                        anchor: {
                            show: false,
                            showAbove: false,
                            size: 25,
                            itemStyle: {
                                borderWidth: 60
                            }
                        },
                        title: {
                            show: true,
                            offsetCenter: [0, '30%'],
                            fontSize: 18
                        },
                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-20%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|买} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 12,
                                    padding: [15, 0, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: buy_rate,
                                name: ''
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['73%', '68%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '100%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: '#7CB3FF'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [[1, '#E6EEF9']]
                            }
                        },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: {
                            distance: 5,
                            color: '#666',
                            fontSize: 0,
                            formatter: function (value) {
                                if (value === 0 || value === 100) {
                                    return value + '%';
                                }
                            }
                        },
                        anchor: {
                            show: false,
                            showAbove: false,
                            size: 25,
                            itemStyle: {
                                borderWidth: 60
                            }
                        },
                        title: {
                            show: true,
                            offsetCenter: [0, '30%'],
                            fontSize: 18
                        },
                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-20%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|卖} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 12,
                                    padding: [15, 0, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: sell_rate,
                                name: ''
                            }
                        ]
                    }
                ]
            };
            myChart.setOption(option, true);
        },
        getStripChart() {
            var option;
            var myChart;
            var chartDom = document.getElementById('pie3');
            myChart = echarts.init(chartDom);
            var _max = 100;
            var colorList = ['#65A6FF', '#72E05A', '#32B7FF', '#83BDFF', '#83E3FF', '#F78B7F', '#FFD747'];
            let seriesList = [];
            let borderRadius = [];
            let priceTypeList = this.priceType;
            priceTypeList.forEach((item, i) => {
                borderRadius = i == 0 ? [4, 0, 0, 4] : i == priceTypeList.length - 1 ? [0, 4, 4, 0] : '';
                seriesList.push({
                    type: 'bar',
                    name: item.type_name,
                    stack: '2',
                    label: {},
                    legendHoverLink: false,
                    barWidth: 24,
                    itemStyle: {
                        color: colorList[i],
                        borderRadius: borderRadius
                    },
                    emphasis: {
                        itemStyle: {
                            color: colorList[i]
                        }
                    },
                    data: [item.rate.toFixed(1)]
                });
            });
            console.log(this.priceType, 'this.priceType');
            console.log(seriesList, 'seriesListseriesList');
            option = {
                legend: [
                    {
                        orient: 'horizontal',
                        // type: 'scroll',
                        // data: legendData,
                        icon: 'circle',
                        itemWidth: 6,
                        itemGap: 20,
                        y: 'bottom',
                        top: '80px',
                        // x: 'center',
                        textStyle: {
                            color: '#999'
                        }
                    }
                    // {
                    //     data: ['类型6', '类型7'],
                    //     icon: 'circle',
                    //     itemWidth: 6,
                    //     itemGap: 20,
                    //     y: 'bottom',
                    //     x: 'center',
                    //     textStyle: {
                    //         color: '#999'
                    //     }
                    // }
                ],
                grid: {
                    containLabel: true,
                    left: 0,
                    right: 15,
                    bottom: 90
                },
                tooltip: {
                    show: true,
                    backgroundColor: '#1F2329',
                    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1F2329',
                    textStyle: {
                        color: '#fff'
                    }
                },
                xAxis: {
                    // splitNumber: spNum,
                    // interval: _max / spNum,
                    max: _max,
                    axisLabel: {
                        show: false,
                        formatter: function (v) {
                            var _v = ((v / _max) * 100).toFixed(0);
                            return _v == 0 ? _v : _v + '%';
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: [
                    {
                        data: ['占比'],
                        axisLabel: {
                            fontSize: 16,
                            color: '#fff'
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: seriesList
            };
            myChart.clear();
            option && myChart.setOption(option, true);
        },
        getDynamicData() {
            let today = dayjs().format('YYYY-MM-DD');
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today} 23:59`).getTime() / 1000;
            let query = { algo_name: this.searchForm.algo_id, user_id: localStorage.getItem('ms_username'), start_time, end_time };
            this.dimensionalityList = [];
            let radarList = [];
            let marketRateList = [];
            let volTypeList = [];
            dynamicApi(query)
                .then((res) => {
                    if (res.code == 200) {
                        this.startValue = res.composite_score / 20;
                        this.compositeScore = res.composite_score;
                        this.ranking = res.ranking;
                        this.side = res.side; //买卖方向
                        this.priceType = res.price_type; //股价类型
                        this.assessLine = res.assess_line;
                        this.progressLine = res.progress_line;
                        //5个维度升序
                        if (res.dimension && res.dimension.length) {
                            this.dimension = res.dimension.sort((a, b) => {
                                return a.profile_type - b.profile_type;
                            });
                            this.dimension.forEach((item, i) => {
                                this.dimensionalityList.push({
                                    title: this.titleList[i],
                                    desc: item.desc
                                });
                                radarList.push(item.score);
                            });
                        }
                        //资金占比
                        if (res.market_rate && res.market_rate.length) {
                            this.marketRate = res.market_rate;
                            res.market_rate.forEach((item, i) => {
                                marketRateList.push({ name: item.mk_name, value: item.rate.toFixed(1) });
                            });
                        }
                        //交易量
                        if (res.vol_type && res.vol_type.length) {
                            this.volType = res.vol_type;
                            res.vol_type.forEach((item, i) => {
                                volTypeList.push({ name: item.vol_name, value: item.rate.toFixed(1) });
                            });
                        }
                        this.getPieChart('pie1', marketRateList); //资金占比
                        this.getPieChart('pie4', volTypeList); //交易量
                        this.getRadarChart(radarList); //雷达图
                        this.generateChart(res.assess_line.point, 'main1');
                        this.generateChart(res.progress_line.point, 'main2');
                        this.getSemicircle(); //买卖方向
                        this.getStripChart(); //股价类型
                    } else {
                        return Promise.reject(new Error('返回错误'));
                    }
                })
                .catch((erro) => {
                    this.generateChart([], 'main1');
                    this.generateChart([], 'main2');
                    this.getPieChart('pie1', []); //资金占比
                    this.getPieChart('pie4', []); //交易量
                    this.getSemicircle();
                    this.getRadarChart([]);
                });
        },
        getOptionList(query, type, list) {
            optionListApi(query).then((res) => {
                if (res.code == 200) {
                    this[type] = res[list];
                }
            });
        },
        selectAlgoType() {
            // 获取算法类型
            let query = {
                choose_type: 2,
                provider: this.searchForm.provider
            };
            this.getOptionList(query, 'algoTypeList', 'algo_type');
        },
        selectAlgoList() {
            // 获取算法
            let query = {
                choose_type: 3,
                provider: this.searchForm.provider,
                algo_type: this.searchForm.algo_type
            };
            this.getOptionList(query, 'algoList', 'algo_name');
        }
    }
};
</script>
<style scoped lang="less">
.container {
    .card {
        margin-bottom: 12px;
        display: inline-block;
        overflow: hidden;
        &:nth-child(1) {
            height: 280px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(2) {
            height: 280px;
            width: 74.7%;
            padding-right: 0;
        }
        &:nth-child(3) {
            height: 280px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(4) {
            height: 280px;
            width: 74.7%;
            padding-right: 0;
        }
        &:nth-child(5) {
            height: 190px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(6) {
            height: 190px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(7) {
            height: 190px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(8) {
            height: 190px;
            width: 404px;
        }
    }
    .radarCard {
        padding-bottom: 0;
    }
    .grade-lump {
        .score {
            display: flex;
            align-items: center;
            margin-bottom: -2px;
            .number {
                font-size: 36px;
                color: #333333;
                font-weight: bold;
                margin-right: 8px;
            }
            .text {
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                line-height: 18px;
                margin-right: 8px;
                margin-top: 12px;
            }
            .rate {
                margin-top: 12px;
            }
            .rank-icon {
                width: 34px;
                height: 44px;
                background-image: url('../../assets/icon/rank-icon.png');
                background-repeat: no-repeat;
                background-size: 34px 44px;
                align-self: flex-end;
                margin-left: 98px;
                text-align: center;
                line-height: 48px;
                font-size: 20px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #ffffff;
                text-shadow: 0px -2px 9px #3a8159;
            }
        }
        .dimensionality {
            margin-top: 4px;
            .title {
                font-size: 14px;
                color: #333333;
                // line-height: 20px;
                margin-bottom: 2px;
            }
            .explain {
                font-size: 12px;
                color: #999999;
                line-height: 18px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .blur-card {
        margin-top: 10px;
        height: 130px;
        border-radius: 12px;
        background: #fafbff;
    }
    .min-empty {
        padding: 0;
        /deep/.el-empty__image {
            width: 84px !important;
        }
    }
    .medium-empty {
        padding: 20 0;
        /deep/.el-empty__image {
            width: 84px !important;
        }
    }
}
</style>
