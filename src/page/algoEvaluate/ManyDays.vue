<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>多日分析</el-breadcrumb-item>
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
                    <el-select v-model="searchForm.user_id" clearable placeholder="用户ID">
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
                <el-button type="primary" @click="onSubmit">确定</el-button
                ><el-button type="plain" @click="onDownLoad"><img class="iconImg" src="../../assets/icon/xiazai.png" />下载报告</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="card" id="main1"></div>
            <div class="card" id="main2"></div>
            <div class="card" id="main3"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import fiexdDate from '../../utils/fixeddate';
import { analyseAlgoApi, optionListApi } from '@/api/index';
import dayjs from 'dayjs';
export default {
    name: 'manyDays',
    data() {
        return {
            searchForm: {
                provider: '',
                algo_type: '',
                algo_id: '',
                user_id: ''
            },
            timeRange: [new Date(), new Date()], //筛选时间范围 默认当天
            currentPage: 1,
            pageTotal: 0,
            providerList: [],
            algoTypeList: [],
            algoList: []
        };
    },
    created() {
        // 获取厂商列表
        let query = {
            choose_type: 1
        };
        this.getOptionList(query, 'providerList', 'provider');
        this.getAnalyseAlgoData();
    },
    mounted() {},
    methods: {
        onSubmit() {
            console.log('submit!', this.searchForm);
            this.getAnalyseAlgoData();
        },
        onDownLoad() {
            console.log('onDownLoad!');
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
        },
        getAnalyseAlgoData() {
            let today = dayjs(this.timeRange[0]).format('YYYY-MM-DD');
            let today2 = dayjs(this.timeRange[1]).format('YYYY-MM-DD');
            let start_time = new Date(`${today} 09:30`).getTime() / 1000;
            let end_time = new Date(`${today2} 15:30`).getTime() / 1000;
            let query = {
                start_time: start_time,
                end_time: end_time,
                user_id: 'aUser0000065',
                algo_name: this.searchForm.algo_id
                // algo_name: this.searchForm.algo_id
            };
            let list = [];
            analyseAlgoApi(query).then((res) => {
                if (res.code == 200) {
                    list = res.data;
                    list.forEach((item) => {
                        item.point = item.point ? item.point : [];
                        switch (item.profile_type) {
                            case 4: //绩效
                                this.generateChart(item.point, 'main1');
                                break;
                            case 3: //风险度
                                this.generateChart(item.point, 'main2');
                                break;
                            case 2: //完成度
                                this.generateChart(item.point, 'main3');
                                break;
                        }
                    });
                }
            });
        },
        generateChart(list, type) {
            if (list.length == 1) {
                list.push({ x: '', y: list[0].y });
            }
            let lineObj = {
                main1: { name: '算法绩效', color: '#83BDFF' },
                main2: { name: '算法风险度', color: '#59CC7F' },
                main3: { name: '算法完成度', color: '#FCE75F' }
            };
            let isNull = list.length ? false : true;
            let option = {
                title: {
                    // top: '4px',
                    // left: '32px',
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
                dataset: {
                    dimensions: ['time_point', 'score'],
                    source: list
                },
                grid: {
                    left: '15px',
                    right: '10px',
                    bottom: '0px',
                    // top: '75px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#E9E9E9',
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        // interval: 0,
                        // rotate: 30,
                    },
                    axisTick: {
                        show: true, //显示X轴刻度
                        lineStyle: {
                            color: '#E9E9E9'
                        }
                    },
                    axisLine: {
                        // 刻度线的颜色
                        show: false
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
                            color: '#666'
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
                        nameTextStyle: {
                            padding: [0, 0, 0, 25]
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
                        showSymbol: false,
                        itemStyle: {
                            color: lineObj[type].color
                            // normal: {
                            //     color: lineObj[type].color
                            // }
                        },
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
        }
    }
};
</script>

<style scoped lang="less">
.container {
    .card {
        margin-bottom: 12px;
        height: 320px;
    }
}
</style>
