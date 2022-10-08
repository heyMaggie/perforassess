<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>Dashboard</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="echart-container">
            <div class="showBorder">
                <div class="card">
                    <div class="card-title line-img">用户数量</div>
                    <el-tooltip :content="`用户总数量：${summaryObj.total_user_cnt}`" placement="top">
                        <img class="query-icon" src="../../assets/icon/query.png"
                    /></el-tooltip>
                    <div class="circular">
                        <span class="number">{{ summaryObj.user_cnt }}<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">算法数量</div>
                    <el-tooltip :content="`算法总数量：${summaryObj.total_algo_cnt}`" placement="top">
                        <img class="query-icon" src="../../assets/icon/query.png"
                    /></el-tooltip>
                    <div class="circular special-green">
                        <span class="number">{{ summaryObj.algo_cnt }}<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">交易量</div>
                    <div class="blue-card">
                        <span class="number"
                            >{{ Number(summaryObj.trade_vol).toFixed(2) }}
                            <div class="unit">(元)</div>
                        </span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">订单数</div>
                    <!-- <el-tooltip content="说明：订单总数量" placement="top">
                        <img class="query-icon" src="../../assets/icon/query.png"
                    /></el-tooltip> -->
                    <div class="circular">
                        <span class="number">{{ summaryObj.order_cnt }}<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">买卖占比</div>
                    <div class="medium-blue-card" id="pie2"></div>
                </div>
                <div class="card">
                    <div class="card-title line-img">厂商总数</div>
                    <el-tooltip :content="`厂商总数量：${summaryObj.total_provider_cnt}`" placement="top">
                        <img class="query-icon" src="../../assets/icon/query.png"
                    /></el-tooltip>
                    <div class="circular special-pink">
                        <span class="number">{{ summaryObj.provider_cnt }}<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">资金占比</div>
                    <!-- <el-tooltip content="说明：XXX" placement="top">
                        <img class="query-icon" src="../../assets/icon/query.png"
                    /></el-tooltip> -->
                    <div class="gather">
                        <div class="min-blue-card">
                            <span class="number">{{ Number(market_rate.huge).toFixed(1) }}<span class="unit">%</span></span>
                            <div class="explain">超大市值</div>
                        </div>
                        <div class="min-blue-card">
                            <span class="number">{{ Number(market_rate.big).toFixed(1) }}<span class="unit">%</span></span>
                            <div class="explain">大市值</div>
                        </div>
                        <div class="min-blue-card">
                            <span class="number">{{ Number(market_rate.middle).toFixed(1) }}<span class="unit">%</span></span>
                            <div class="explain">中市值</div>
                        </div>
                        <div class="min-blue-card">
                            <span class="number">{{ Number(market_rate.small).toFixed(1) }}<span class="unit">%</span></span>
                            <div class="explain">小市值</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">完成度</div>
                    <div id="water-polo" class="water-polo"></div>
                </div>
            </div>
            <div class="showClounm">
                <el-tabs v-if="algo_nameList.length" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item, i) in algo_nameList" :key="item" :label="item" :name="i + ''">
                        <!-- 空状态 -->
                        <div v-if="!assessList.length" class="empty-card pane-card">
                            <div class="rowlist">
                                <div class="rowtitle">厂商 —</div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/1aa.png" />用户数量</div>
                                    <div class="number empty-number">—</div>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/2bb.png" />交易量</div>
                                    <div class="number empty-number">—</div>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/3cc.png" />收益率</div>
                                    <div class="number empty-number">—</div>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/4dd.png" />订单数量</div>
                                    <div class="number empty-number">—</div>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/5ee.png" />买卖占比</div>
                                    <div class="number empty-number">—</div>
                                </div>
                            </div>
                        </div>
                        <!-- <el-empty
                            v-if="!assessList.length"
                            description="暂无数据"
                            class="empty-card"
                            :image="require('../../assets/img/empty.png')"
                        ></el-empty> -->
                        <div v-else>
                            <div class="pane-card">
                                <div v-for="(sonItem, j) in assessList" :key="sonItem.provider">
                                    <div class="rowlist">
                                        <div class="rowtitle">{{ sonItem.provider }}</div>
                                        <div class="blue-mincard">
                                            <div class="tit"><img src="../../assets/icon/1aa.png" />用户数量</div>
                                            <div class="number">{{ sonItem.user_cnt }}</div>
                                        </div>
                                        <div class="blue-mincard">
                                            <div class="tit"><img src="../../assets/icon/2bb.png" />交易量</div>
                                            <div class="number">
                                                <span class="symbol">￥</span>{{ Number(sonItem.trade_vol).toFixed(2) }}
                                            </div>
                                        </div>
                                        <div class="blue-mincard">
                                            <div class="tit"><img src="../../assets/icon/3cc.png" />收益率</div>
                                            <el-badge
                                                :value="sonItem.profit_rate > 0 ? '盈利' : '亏损'"
                                                class="item"
                                                :type="sonItem.profit_rate > 0 ? 'danger' : 'success'"
                                            >
                                                <div class="number">
                                                    <span class="symbol">{{ sonItem.profit_rate > 0 ? '+' : ' ' }}</span
                                                    >{{ Number(sonItem.profit_rate).toFixed(1) }}<span class="unit">%</span>
                                                </div>
                                            </el-badge>
                                        </div>
                                        <div class="blue-mincard">
                                            <div class="tit"><img src="../../assets/icon/4dd.png" />订单数量</div>
                                            <div class="number">{{ sonItem.order_cnt }}</div>
                                        </div>
                                        <div class="blue-mincard">
                                            <div class="tit"><img src="../../assets/icon/5ee.png" />买卖占比</div>
                                            <div
                                                :style="{ height: '50px', width: '300px' }"
                                                :id="`pieList${j}${i}`"
                                                :ref="`pieList${j}${i}`"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="[10, 20, 30, 40]"
                                :current-page="pageObj.page"
                                :page-size="pageObj.pageNum"
                                layout=" ->, prev, pager, next, total, jumper"
                                :total="pageTotal"
                                style="margin-top: 20px"
                            >
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="showPortrait">
                <div class="card">
                    <div class="card-title">
                        <span>算法绩效</span>
                        <span class="more" @click="goMoreAlgo" v-if="algoContrastList.length"
                            >查看更多<span class="icon el-icon-arrow-right"></span
                        ></span>
                    </div>
                    <div class="main1" id="main1"></div>
                </div>
                <div class="card">
                    <div class="card-title">
                        <span>算法总体评分</span>
                        <span class="more" @click="goMoreGrade" v-if="algoContrastList.length"
                            >查看更多<span class="icon el-icon-arrow-right"></span
                        ></span>
                    </div>
                    <div id="radar" class="radarCard"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { dashboardSummarydApi, optionListApi, dashboardAlgolistApi } from '@/api/index';
import fiexdDate from '../../utils/fixeddate';
import dayjs from 'dayjs';
export default {
    name: 'dashBoard',
    data() {
        return {
            activeName: '0',
            summaryObj: {
                user_cnt: '0',
                algo_cnt: '0',
                trade_vol: '0',
                order_cnt: '0',
                provider_cnt: '0',
                total_user_cnt: ''
            },
            market_rate: {
                huge: '0',
                big: '0',
                middle: '0',
                small: '0'
            },
            algo_nameList: [],
            selectIndex: '0',
            assessList: [],
            pageTotal: 0,
            pageObj: { page: 1, pageNum: 4 },
            algoContrastList: []
        };
    },
    created() {
        this.getSummarydata();
        this.getOptionList();
    },
    mounted() {},
    methods: {
        getWaterEchart(data) {
            data = data.toFixed(1) / 100;
            // data = (data.toFixed(2) / 100).toFixed(1);
            // console.log((6.6564277985276).toFixed(2) / 100, 'dddddd');
            var chartDom = document.getElementById('water-polo');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                backgroundColor: '#fff',
                series: [
                    {
                        type: 'liquidFill',
                        data: [data],
                        radius: '95%',
                        // 水球颜色
                        color: [
                            {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(145, 213, 255, 0.3)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(50, 129, 255, 0.8)'
                                    }
                                ]
                            }
                        ],
                        // outline  外边
                        outline: {
                            // show: false
                            borderDistance: 3,
                            itemStyle: {
                                borderWidth: 2,
                                borderColor: '#D1E3FF'
                            }
                        },
                        label: {
                            formatter: function (param) {
                                return '{b|' + (param.value * 100).toFixed(1) + '}{c| %}';
                            },
                            textStyle: {
                                rich: {
                                    b: {
                                        fontSize: 28,
                                        fontWeight: 'bold',
                                        color: '#000'
                                    },
                                    c: {
                                        fontSize: 12,
                                        color: '#000'
                                    }
                                }
                            }
                        },
                        // 内图 背景色 边
                        backgroundStyle: {
                            color: '#fff'
                        },
                        itemStyle: {
                            opacity: 1, // 波浪的透明度
                            shadowBlur: 0 // 波浪的阴影范围
                        }
                    }
                ]
            };
            myChart.setOption(option, true);
        },
        getRadarChart(list = []) {
            let indicatorList = [];
            let totalScore = [];
            for (let i = 0; i < 4; i++) {
                if (list[i]) {
                    indicatorList.push({ name: list[i].algo_name, max: 100 });
                    totalScore.push(list[i].total_score);
                } else {
                    indicatorList.push({ name: '', max: 100 });
                    totalScore.push('');
                }
            }

            let option = {
                color: ['#3281FF', '#FACC14', '#2FC25B'],
                radar: [
                    {
                        indicator: indicatorList,
                        center: ['50%', '50%'],
                        radius: 90,
                        startAngle: 90,
                        splitNumber: 3,
                        orient: 'horizontal', // 图例列表的布局朝向,默认'horizontal'为横向,'c'为纵向.
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
                                width: 3
                            }
                        },
                        data: [
                            {
                                value: totalScore,
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
        generateChart(list, type) {
            let option;
            let isNull = false;
            let seriesList = [];
            function singelLine(params) {
                let lineObj = { name: '', data: [] };
                fiexdDate.forEach((item, i) => {
                    lineObj.name = params.algo_name;
                    lineObj.data[i] = '';
                    //容错处理
                    if (!params.time_line) {
                        params.time_line = [];
                    } else {
                        params.time_line.forEach((subitem) => {
                            // console.log(subitem.time_point, item);
                            if (subitem.time_point == item) {
                                lineObj.data[i] = subitem.score;
                            }
                        });
                    }
                });
                return lineObj;
            }
            if (!list.length) {
                // this.$message.error('该时间段暂无数据');
                isNull = true;
            } else {
                list.forEach((params) => {
                    seriesList.push(singelLine(params));
                });
                let colorList = ['#65A6FF', '#34B7FE', '#59CC7F', '#FAD337'];
                seriesList.forEach((item, i) => {
                    // 有值
                    if (item.data.some((item) => item)) {
                        isNull = false;
                    } else {
                        isNull = true;
                    }
                    item.type = 'line';
                    item.smooth = true;
                    item.showSymbol = true;
                    item.showAllSymbol = true;
                    item.itemStyle = {
                        color: colorList[i]
                    };
                    item.connectNulls = true;
                    item.areaStyle = {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: colorList[i]
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
                    };
                });
            }
            option = {
                legend: {
                    // data: ['算法1', '算法2', '算法3', '算法4'],
                    bottom: 14,
                    icon: 'circle',
                    itemWidth: 8,
                    x: 'center',
                    textStyle: { color: ' #999' }
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
                    left: '3px',
                    right: '15px',
                    bottom: '50px',
                    top: '42px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: fiexdDate,
                    axisPointer: {
                        type: 'line',
                        lineStyle: { color: '#BDBEBF' }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#E9E9E9',
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        interval: 29,
                        // rotate: 30,
                        color: '#000'
                        // x轴字体颜色
                    },
                    axisTick: {
                        show: true, //显示X轴刻度
                        lineStyle: {
                            color: '#E9E9E9'
                        }
                    },
                    axisLine: {
                        // 刻度线的颜色
                        show: true,
                        lineStyle: {
                            color: '#E8E8E8'
                        }
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: `单位：（分数）`,
                        axisLine: {
                            show: false
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
                        axisLabel: {
                            color: '#000'
                        },
                        nameTextStyle: {
                            color: '#888',
                            padding: [0, 0, 0, 35]
                        },
                        // min: isNull ? 0 : null,
                        // max: isNull ? 10 : null
                        min: 0,
                        max: 10
                    }
                ],
                series: seriesList
            };
            var myChart = echarts.init(document.getElementById(type));
            myChart.clear();
            myChart.setOption(option);
            myChart.resize();
        },
        getSemicircle(type, data) {
            console.log(type, data);
            if (!data) {
                data.buy = '0';
                data.sell = '0';
            }
            data.buy = Number(data.buy).toFixed(1) / 1;
            data.sell = Number(data.sell).toFixed(1) / 1;
            var chartDom = document.getElementById(type);
            var myChart = echarts.init(chartDom);
            var option;
            var option2;
            option = {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['30%', '37%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '50%',
                        progress: {
                            show: true,
                            width: 6,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: 'rgba(154, 223, 174, 1)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(63, 173, 96, 1)'
                                    }
                                ])
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 6,
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
                            fontSize: 22,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: ['70px', '0%'],
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
                                    fontWeight: '400',
                                    padding: [-20, 132, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: data.buy,
                                name: ''
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['30%', '88%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '50%',
                        progress: {
                            show: true,
                            width: 6,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: 'rgba(158, 199, 255, 1)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(109, 164, 239, 1)'
                                    }
                                ])
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 6,
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
                            fontSize: 22,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: ['70px', '0%'],
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
                                    fontWeight: '400',
                                    padding: [-20, 132, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: data.sell,
                                name: ''
                            }
                        ]
                    }
                ]
            };
            option2 = {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['30%', '100%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '200%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: 'rgba(154, 223, 174, 1)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(63, 173, 96, 1)'
                                    }
                                ])
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
                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-12%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|买} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 14,
                                    padding: [-8, 120, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: data.buy,
                                name: ''
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['83%', '100%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '200%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: 'rgba(158, 199, 255, 1)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(109, 164, 239, 1)'
                                    }
                                ])
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
                            show: false
                        },

                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-12%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|卖} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 14,
                                    padding: [-8, 120, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: data.sell,
                                name: ''
                            }
                        ]
                    }
                ]
            };
            if (type == 'pie2') {
                myChart.setOption(option);
            } else {
                myChart.setOption(option2);
            }
            // myChart.setOption(option);
        },
        handleClick(tab) {
            // console.log(tab.name);
            this.selectIndex = tab.name;
            this.$nextTick(() => {
                this.getFerfAlgolist();
            });

            setTimeout(() => {
                this.getFerfAlgolist();
            }, 5000);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { page: val / 1, pageNum: 4 };
            this.getFerfAlgolist(pageObj);
        },
        goMoreAlgo() {
            this.$router.push('/algoMoreEchart');
        },
        goMoreGrade() {
            this.$router.push('/algoGrade');
        },
        getSummarydata() {
            let today = dayjs().format('YYYY-MM-DD');
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today} 23:59`).getTime() / 1000;
            let query = { start_time, end_time, user_id: localStorage.getItem('ms_username') };
            dashboardSummarydApi(query)
                .then((res) => {
                    // if (res.code == 200) {
                    this.summaryObj = res;
                    this.market_rate = this.summaryObj.market_rate;
                    this.getSemicircle('pie2', this.summaryObj.side);
                    this.getWaterEchart(this.summaryObj.progress);
                    // }
                })
                .catch(() => {
                    this.getSemicircle('pie2', []);
                    this.getWaterEchart(0);
                });
        },
        getOptionList() {
            let query = {
                choose_type: 5
            };
            optionListApi(query)
                .then((res) => {
                    if (res.code == 200) {
                        this.algo_nameList = res.algo_type || [];
                        this.getFerfAlgolist();
                    } else {
                        return Promise.reject(new Error('请求异常'));
                    }
                })
                .catch(() => {
                    this.generateChart([], 'main1');
                    this.getRadarChart([]);
                });
        },
        getFerfAlgolist(pageObj = { page: 1, pageNum: 4 }) {
            this.pageObj = pageObj;
            let today = dayjs().format('YYYY-MM-DD');
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today} 23:59`).getTime() / 1000;
            let query = {
                start_time: start_time,
                end_time: end_time,
                algo_type_name: this.algo_nameList[this.activeName],
                page: pageObj.page,
                limit: pageObj.pageNum,
                user_id: localStorage.getItem('ms_username')
            };
            dashboardAlgolistApi(query)
                .then((res) => {
                    if (res.code == 200) {
                        this.assessList = res.list ? res.list : [];
                        this.algoContrastList = res.assess;
                        this.pageTotal = res.total;
                        this.generateChart(this.algoContrastList, 'main1');
                        this.getRadarChart(this.algoContrastList);
                        if (this.assessList.length) {
                            this.$nextTick(() => {
                                this.assessList.forEach((item, i) => {
                                    // this.$refs[`pieList${i}${this.activeName}`].height = '50px';
                                    // this.$refs[`pieList${i}${this.activeName}`].width = '300px';
                                    console.log(this.$refs[`pieList${i}${this.activeName}`]);
                                    this.getSemicircle(`pieList${i}${this.activeName}`, {
                                        buy: item.side.buy,
                                        sell: item.side.sell
                                    });
                                });
                            });
                        }
                    } else {
                        this.generateChart([], 'main1');
                        this.getRadarChart([]);
                    }
                })
                .catch((erro) => {
                    this.generateChart([], 'main1');
                    this.getRadarChart([]);
                });
        }
    }
};
</script>

<style lang="less" scoped>
.echart-container {
    .card {
        overflow: hidden;
        display: inline-block;
    }
    .showBorder {
        .card {
            margin-right: 12px;
            width: 163px;
            height: 158px;
            padding-top: 12px;
            padding-bottom: 12px;
            // padding: 12px 16px;
            &:nth-child(3) {
                width: 269px;
            }
            &:nth-child(5),
            &:nth-child(7) {
                width: 240px;
            }
            &:nth-child(8) {
                margin-right: 0px;
            }
            .card-title {
                font-size: 16px;
            }
            .line-img {
                display: inline-block;
            }
            .water-polo {
                margin-top: 19px;
                height: 100px;
            }
            .circular {
                margin: 10px auto;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background-color: #e8f1ff;
                padding-top: 13px;
                box-sizing: border-box;
                &::after {
                    content: '';
                    display: block;
                    width: 74px;
                    height: 75px;
                    border-radius: 50%;
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(50, 129, 255, 0.32);
                    margin: auto;
                }
                .number {
                    float: left;
                    margin: auto;
                    line-height: 30px;
                    text-align: center;
                    width: 100%;
                    font-size: 32px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                    margin-top: 12px;
                }
                .unit {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #999999;
                }
            }
            .special-green {
                background-color: #e5f8f2;
                &::after {
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(29, 195, 138, 0.32);
                }
            }
            .special-pink {
                background-color: #fef2f0;
                &::after {
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(247, 139, 127, 0.32);
                }
            }
            .gather {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                // width: 170px;
                margin-top: 10px;
                .min-blue-card {
                    width: 100px;
                    height: 48px;
                    background: #fafbff;
                    text-align: center;
                    margin-left: -5px;
                    margin-bottom: 8px;
                    .number {
                        // width: 21px;
                        font-size: 20px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #333333;
                        line-height: 22px;
                    }
                    .unit {
                        font-size: 12px;
                    }
                    .explain {
                        font-size: 14px;
                        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                        font-weight: 400;
                        color: #999999;
                        line-height: 20px;
                    }
                    // line-height: 64px;
                }
            }
            .medium-blue-card {
                width: 100%;
                height: 100px;
                background: #fafbff;
                margin-top: 8px;

                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 8px;
                    position: relative;
                    bottom: 52px;
                    background-color: #fff;
                }
            }
        }
        .query-icon {
            margin-left: 10px;
            cursor: pointer;
        }
        .blue-card {
            // width: 100%;
            height: 104px;
            background: #fafbff;
            border-radius: 8px;
            // margin-top: 24px;
            margin: 10px -12px 0;
            text-align: center;
            .number {
                font-size: 26px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.85);
                margin-top: 18px;
                display: inline-block;
            }
            .unit {
                font-size: 14px;
                color: #999999;
                font-weight: 500;
                margin-top: 6px;
            }
        }
    }
    .showClounm {
        margin-top: 8px;
        width: 100%;
        // height: 615px;
        // background-color: #fff;
        .pane-card {
            height: 367px;
        }
        .empty-card {
            height: 124px;
        }

        .rowlist {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            margin-bottom: 12px;
            .rowtitle {
                font-size: 14px;
                font-family: SourceHanSansSC-Medium, SourceHanSansSC;
                font-weight: 500;
                color: #333333;
                line-height: 80px;
                text-align: center;
                width: 80px;
                height: 80px;
                background: rgba(234, 239, 255, 0.68);
                border-radius: 80px;
            }
            .blue-mincard {
                // background: red;
                background: #fafbff;
                padding: 12px 8px 0px;
                // margin-top: 8px;
                // height: 92px;
                min-width: 156px;
                &:nth-child(3) {
                    width: 244px;
                }
                // &:nth-child(5) {
                //     width: 244px;
                // }
                &:nth-child(6) {
                    width: 316px;
                    padding: 8px 8px 0px;
                    .tit {
                        margin-bottom: 8px;
                    }
                    .pieList {
                        width: 300px;
                        height: 50px;
                    }
                }
                .tit {
                    font-size: 14px;
                    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                    font-weight: 400;
                    color: #666666;
                }
                img {
                    margin-right: 8px;
                    width: 12px;
                    height: 12px;
                }
                .number {
                    height: 26px;
                    font-size: 22px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                    line-height: 26px;
                    margin-top: 12px;
                    margin-left: 18px;

                    .symbol {
                        // line-height: 8px;
                        font-size: 16px;
                    }
                    .unit {
                        font-size: 16px;
                    }
                }
                .empty-number {
                    font-weight: 400;
                }
            }
        }

        /deep/.el-tabs__nav-wrap::after {
            background-color: unset;
        }
        /deep/.el-tabs__header {
            // padding-top: 4px;
            margin-bottom: 0px;
            border-bottom: 1px solid #efefef;
        }
        /deep/.el-tabs__item {
            font-size: 16px;
        }
        .el-tabs__active-bar {
        }
        /deep/.el-tabs__nav-wrap {
            background: #fff;
            border-radius: 12px 12px 0 0;
            padding: 2px 24px 0;
            border-bottom: 1px solid #efefef;
        }
        /deep/.el-tabs__content {
            background: #fff;
            padding: 16px 24px 12px;
            border-radius: 0 0 12px 12px;
            // min-height: 615px;
        }
        /deep/.el-badge__content {
            border-radius: 10px 10px 10px 0;
        }
        /deep/.el-badge__content.is-fixed {
            top: 10px;
            right: 10px;
        }
        /deep/.el-tabs__item {
            font-size: 16px;
            padding-right: 40px;
            // padding: 0 40px;
        }
    }
    .showPortrait {
        height: 315px;
        margin-top: 12px;
        margin-bottom: 20px;
        .card {
            height: 100%;
            &:nth-child(1) {
                margin-right: 12px;
                width: calc(100% - 505px);
            }
            &:nth-child(2) {
                width: 493px;
            }
        }
        .card-title {
            font-size: 16px;
            .more {
                float: right;
                font-size: 12px;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: #666666;
                cursor: pointer;
                height: 22px;
                line-height: 22px;
                .icon {
                    margin-left: 10px;
                }
            }
        }
        .main1 {
            height: 280px;
        }
        .radarCard {
            padding-bottom: 0;
            height: 280px;
            width: 100%;
            // padding-top: 10px;
        }
    }
}
</style>
