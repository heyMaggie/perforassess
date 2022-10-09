<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>高阶评估</el-breadcrumb-item>
                <el-breadcrumb-item>用户画像</el-breadcrumb-item>
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
                <el-form-item>
                    <el-select v-model="searchForm.user_id" clearable placeholder="用户ID" v-if="false">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="button-right">
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </div>
        </el-form>
        <div class="echart-container">
            <div class="showBorder">
                <div class="card">
                    <div class="card-title">资金</div>
                    <div class="blue-card">
                        <span class="number"
                            >{{ summaryObj.fund }}
                            <div class="unit">(元)</div></span
                        >
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">盈亏</div>
                    <div class="blue-card">
                        <span class="number"
                            >{{ summaryObj.profit }}
                            <el-badge
                                :value="summaryObj.profit > 0 ? '盈利' : '亏损'"
                                class="item"
                                :type="summaryObj.profit > 0 ? 'danger' : 'success'"
                            ></el-badge>
                            <div class="unit">(元)</div></span
                        >
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">登录次数</div>
                    <div class="circular">
                        <span class="number">{{ summaryObj.login_cnt }}<span class="unit">(次)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">交易次数</div>
                    <div class="circular">
                        <span class="number">{{ summaryObj.trade_cnt }}<span class="unit">(次)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">当天交易金额</div>
                    <div class="blue-card">
                        <span class="number"
                            >{{ summaryObj.cur_trade_vol }}
                            <div class="unit">(元)</div>
                        </span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">用户级别</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div class="circular special-pink">
                        <span class="number">{{ summaryObj.user_grade }}<span class="unit">级</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">当天滚动持仓</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div class="blue-card">
                        <span class="number">
                            {{ summaryObj.cur_roll_hold }}
                            <div class="unit">(元)</div>
                        </span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">完成度</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div id="water-polo" class="water-polo"></div>
                </div>
            </div>
            <div class="showPortrait">
                <div class="card" id="radar"></div>
                <div class="card" id="userPortraitMain1"></div>
            </div>
            <div class="showDate">
                <div class="card grade-lump">
                    <div class="score">
                        <div class="number">{{ summaryObj.total_score }}</div>
                        <div class="text">综合评分</div>
                        <el-rate class="rate" v-model="startValue" disabled> </el-rate>
                        <div class="rank-icon">{{ summaryObj.ranking }}</div>
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
                <div class="card" id="userPortraitMain2"></div>
            </div>
            <div class="showClounm card" id="histogram"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { userProfileApi, optionListApi } from '@/api/index';
import dayjs from 'dayjs';
import fiexdDate from '../../utils/fixeddate';

export default {
    name: 'baseform',
    data() {
        return {
            searchForm: {
                provider: '',
                algo_type: '',
                algo_id: '',
                user_id: localStorage.getItem('ms_username')
            },
            titleList: ['算法经济性分析', '算法完成度分析', '算法风险度分析', '算法绩效分析', '算法稳定性分析'],
            timeRange: [new Date(), new Date()], //筛选时间范围 默认当天
            providerList: [],
            algoTypeList: [],
            algoList: [],
            startValue: 0,
            summaryObj: {
                fund: 0,
                profit: 0,
                trade_cnt: 0,
                cur_trade_vol: 0,
                cur_roll_hold: 0,
                progress: 0,
                login_cnt: 0,
                user_grade: 0,
                total_score: 0,
                ranking: 0
            },
            dimensions: [], //五个维度雷达图
            dimensionalityList: [] // 综合评分列表
        };
    },
    created() {
        // 获取厂商列表
        let query = {
            choose_type: 1,
            user_id: localStorage.getItem('ms_username')
        };
        this.getOptionList(query, 'providerList', 'provider');
    },
    watch: {
        'searchForm.provider'(newV, oldV) {
            this.searchForm.algo_type = '';
            this.searchForm.algo_id = '';
            this.algoTypeList = [];
            this.algoList = [];
        },
        'searchForm.algo_type'(newV, oldV) {
            // if (!newV) {
            this.searchForm.algo_id = '';
            this.algoList = [];
            // }
        }
    },
    mounted() {
        this.getUserPortaitData();
    },
    methods: {
        onSubmit() {
            console.log('submit!', this.searchForm);
            this.getUserPortaitData();
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
                provider: this.searchForm.provider,
                user_id: localStorage.getItem('ms_username')
            };
            this.getOptionList(query, 'algoTypeList', 'algo_type');
        },
        selectAlgoList() {
            // 获取算法
            let query = {
                choose_type: 3,
                provider: this.searchForm.provider,
                algo_type: this.searchForm.algo_type,
                user_id: localStorage.getItem('ms_username')
            };
            this.getOptionList(query, 'algoList', 'algo_name');
        },
        getUserPortaitData() {
            let today = dayjs(this.timeRange[0]).format('YYYY-MM-DD');
            let today2 = dayjs(this.timeRange[1]).format('YYYY-MM-DD');
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today2} 23:59`).getTime() / 1000;
            let parmas = { end_time, start_time, user_id: localStorage.getItem('ms_username'), algo_name: this.searchForm.algo_id };
            let radarList = [];
            userProfileApi(parmas)
                .then((res) => {
                    this.summaryObj = res;
                    if (res.code == 200) {
                        //5个维度升序
                        if (res.dimensions && res.dimensions.length) {
                            this.dimensions = res.dimensions.sort((a, b) => {
                                return a.profile_type - b.profile_type;
                            });
                            this.dimensions.forEach((item, i) => {
                                this.dimensionalityList.push({
                                    title: this.titleList[i],
                                    desc: item.desc
                                });
                                radarList.push(item.score);
                            });
                        }
                        this.startValue = this.summaryObj.total_score / 20;
                        this.getWaterEchart(this.summaryObj.progress);
                        this.getRadarChart(radarList);
                        this.generateChart(res.assess_line.point, 'userPortraitMain1');
                        this.generateChart(res.progress_line.point, 'userPortraitMain2');
                        this.getHistogramChart(res.fund_list);
                    } else {
                    }
                })
                .catch(() => {
                    this.getWaterEchart(0);
                    this.getRadarChart([]);
                    this.generateChart([], 'userPortraitMain1');
                    this.generateChart([], 'userPortraitMain2');
                    this.getHistogramChart([]);
                });
        },
        getWaterEchart(data) {
            data = Number(data).toFixed(1) / 100;
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
        getRadarChart(radarList) {
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
                userPortraitMain1: { name: '绩效', color: '#83BDFF' },
                userPortraitMain2: { name: '完成度', color: '#FCE75F' }
            };
            let option = {
                title: {
                    text: lineObj[type].name,
                    textStyle: {
                        color: '#333333',
                        fontSize: 16,
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
                    top: '60px',
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
                        name: `单位：（分数）`,
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
                        // min: isNull ? 0 : null,
                        // max: isNull ? 10 : null
                        min: 0,
                        max: 10
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
        getHistogramChart(list = []) {
            var chartDom = document.getElementById('histogram');
            var myChart = echarts.init(chartDom);
            myChart.clear();
            var data3 = []; //市值
            var data4 = []; //成本
            var datacity = []; //横坐标
            list.forEach((item) => {
                data3.push(item.hold);
                data4.push(item.cost);
                datacity.push(item.sec_name);
            });
            var option;
            var option = {
                title: {
                    text: '持仓市值与成本',
                    textStyle: {
                        color: '#333333',
                        fontSize: 16,
                        fontWeight: 500
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },

                legend: {
                    data: ['市值', '成本'],
                    icon: 'circle',
                    itemWidth: 6,
                    itemGap: 24,
                    bottom: 30,
                    textStyle: {
                        color: '#999'
                    }
                },
                grid: {
                    left: '5px',
                    right: '10px',
                    bottom: '60px',
                    containLabel: true
                },
                yAxis: [
                    {
                        type: 'value',
                        type: 'value',
                        name: `单位：（元）`,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} '
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                        axisTick: {
                            show: false //隐藏X轴刻度
                        },
                        axisLine: {
                            show: false
                        },
                        nameTextStyle: {
                            padding: [0, 0, 0, 26]
                        },
                        min: !list.length ? 0 : null,
                        max: !list.length ? 10 : null
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            show: false,
                            splitNumber: 15
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#E9E9E9'
                            }
                        },
                        axisTick: {
                            show: false //隐藏X轴刻度
                        },
                        data: datacity
                    }
                ],
                series: [
                    {
                        name: '市值',
                        type: 'bar',
                        color: '#4DCB73',
                        stack: 'sum1',
                        barWidth: '20px',
                        data: data3
                    },
                    {
                        name: '成本',
                        type: 'bar',
                        color: '#F78B7F',
                        stack: 'sum1',
                        barWidth: '20px',
                        data: data4,
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0]
                            // normal: {
                            //     borderRadius: [4, 4, 0, 0]
                            // }
                        }
                    }
                ],
                dataZoom: [
                    {
                        height: '15px',
                        bottom: 10,
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                        xAxisIndex: [0, 1, 2, 3]
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100,
                        bottom: '0px',
                        xAxisIndex: [0, 1, 2, 3]
                    }
                ]
            };
            myChart.setOption(option);
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
            width: 164px;
            height: 158px;
            &:nth-child(1),
            &:nth-child(2),
            &:nth-child(5),
            &:nth-child(7) {
                width: 228px;
            }
            &:nth-child(8) {
                margin-right: 0px;
            }
            .line-img {
                display: inline-block;
            }
            .water-polo {
                margin-top: 10px;
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
                    line-height: 28px;
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
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                width: 170px;
                margin: 24px -11px 0;
                .min-blue-card {
                    width: 76px;
                    height: 64px;
                    background: #fafbff;
                    text-align: center;
                    margin-bottom: 8px;
                    .number {
                        width: 21px;
                        font-size: 28px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #333333;
                        line-height: 32px;
                    }
                    .unit {
                        font-size: 14px;
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
                width: 161px;
                height: 136px;
                background: #fafbff;
                margin-top: 10px;

                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 8px;
                    position: relative;
                    bottom: 68px;
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
            position: relative;
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
                margin-top: 16px;
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
    .showPortrait {
        height: 315px;
        margin-top: 8px;
        .card {
            height: 100%;
            &:nth-child(1) {
                margin-right: 12px;
                width: 405px;
            }
            &:nth-child(2) {
                width: calc(100% - 418px);
            }
        }
        .radarCard {
            padding-bottom: 0;
        }
    }
    .showDate {
        margin-top: 12px;
        height: 315px;
        .card {
            height: 100%;
            &:nth-child(1) {
                margin-right: 12px;
                width: 405px;
            }
            &:nth-child(2) {
                width: calc(100% - 418px);
            }
        }
        .grade-lump {
            .score {
                display: flex;
                align-items: center;
                // margin-bottom: -2px;
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
                margin-top: 8px;
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
    }
    .showClounm {
        margin-top: 12px;
        height: 385px;
        width: 100%;
    }
}
.button-right {
    // display: flex;
    // align-items: center;
    // line-height: 36px;
}
.icon {
    // float: right;
    position: absolute;
    font-size: 12px;
    font-weight: 400;
    color: #4dcb73;
    width: 32px;
    height: 18px;
    background: rgba(77, 203, 115, 0.24);
    border-radius: 4px 4px 4px 0px;
    right: 5px;
    top: 25px;
    // margin-right: -20px;
}
/deep/.el-badge__content {
    border-radius: 10px 10px 10px 0;
    position: absolute;
    top: -35px;
    right: -25px;
}
</style>
