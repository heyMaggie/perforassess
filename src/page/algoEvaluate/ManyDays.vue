<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>算法评估</el-breadcrumb-item>
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
                <el-button type="primary" @click="onSubmit">确定</el-button
                ><el-button type="plain" @click="onDownLoad"><img class="iconImg" src="../../assets/icon/xiazai.png" />下载报告</el-button>
            </div>
        </el-form>
        <div class="container" id="resultsHuiZongTableId">
            <div class="card" id="main1"></div>
            <div class="card" id="main2"></div>
            <div class="card" id="main3"></div>
        </div>
        <!-- 用于导出报告 -->
        <img src="../../assets/img/importCover.png" v-show="false" alt="" ref="coverImg" />
        <img src="../../assets/img/watermark.png" v-show="false" alt="" ref="watermarkImg" />
        <img src="../../assets/img/backGr.png" v-show="false" alt="" ref="backGr" />
    </div>
</template>

<script>
import * as echarts from 'echarts';
import fiexdDate from '../../utils/fixeddate';
import { analyseAlgoApi, optionListApi } from '@/api/index';
import dayjs from 'dayjs';
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
export default {
    name: 'manyDays',
    data() {
        return {
            searchForm: {
                provider: '',
                algo_type: '',
                algo_id: '',
                user_id: localStorage.getItem('ms_username')
            },
            timeRange: [new Date(), new Date()], //筛选时间范围 默认当天
            currentPage: 1,
            pageTotal: 0,
            providerList: [],
            algoTypeList: [],
            algoList: [],
            cross_day: false
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
    mounted() {},
    methods: {
        onSubmit() {
            console.log('submit!', this.searchForm);
            this.getAnalyseAlgoData();
        },
        onDownLoad() {
            console.log('onDownLoad!');
            this.createPDF('多日分析');
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
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today2} 23:59`).getTime() / 1000;
            let query = {
                start_time: start_time,
                end_time: end_time,
                user_id: localStorage.getItem('ms_username'),
                algo_name: this.searchForm.algo_id
                // algo_name: this.searchForm.algo_id
            };
            let list = [];
            analyseAlgoApi(query)
                .then((res) => {
                    if (res.code == 200) {
                        list = res.data;
                        this.cross_day = res.cross_day;
                        if (!list.length) {
                            this.generateChart([], 'main1');
                            this.generateChart([], 'main2');
                            this.generateChart([], 'main3');
                        } else {
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
                    } else {
                        this.generateChart([], 'main1');
                        this.generateChart([], 'main2');
                        this.generateChart([], 'main3');
                    }
                })
                .catch(() => {
                    this.generateChart([], 'main1');
                    this.generateChart([], 'main2');
                    this.generateChart([], 'main3');
                });
        },
        generateChart(list, type) {
            let isNull = list.length ? false : true;
            let yDataList = [];
            let xDataList = !this.cross_day ? fiexdDate : this.getCrossDateTime();
            if (!list.length) {
                isNull = true;
            } else {
                if (!this.cross_day) {
                    yDataList.length = fiexdDate.length;
                } else {
                    yDataList.length = xDataList.length;
                }
                isNull = false;
                list.forEach((params) => {
                    xDataList.forEach((item, i) => {
                        if (params.time_point == item) {
                            yDataList[i] = params.score;
                        }
                    });
                });
            }
            let lineObj = {
                main1: { name: '算法绩效', color: '#83BDFF' },
                main2: { name: '算法风险度', color: '#59CC7F' },
                main3: { name: '算法完成度', color: '#FCE75F' }
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
                    right: '15px',
                    bottom: '0px',
                    top: '60px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xDataList,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#E9E9E9',
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        interval: !this.cross_day ? 29 : null,
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
                        // 刻度线的颜色
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
                        nameTextStyle: { color: '#888', padding: [0, 0, 0, 25] },
                        min: isNull ? 0 : null,
                        max: isNull ? 10 : null
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
        createPDF(title) {
            let _this = this;
            let today = dayjs().format('YYYY-MM-DD');
            let { provider, algo_type, algo_id, user_id } = this.searchForm;
            let start = dayjs(this.timeRange[0]).format('YYYY-MM-DD');
            let end = dayjs(this.timeRange[1]).format('YYYY-MM-DD');
            return new Promise((resolve) => {
                html2Canvas(document.querySelector('#resultsHuiZongTableId'), {
                    allowTaint: false,
                    useCORS: true, // allowTaint、useCORS只能够出现一个
                    imageTimeout: 0,
                    dpi: 500, // 像素
                    scale: 2 // 图片大小
                }).then(function (canvas) {
                    // 用于将canvas对象转换为base64位编码
                    let pageData = canvas.toDataURL('image/jpeg', 1.0);
                    // canvasWidth = canvas.width,
                    // canvasHeight = canvas.height,
                    // concentWidth = 620,
                    // concentHeight = Math.round((concentWidth / canvasWidth) * canvasHeight);
                    // console.log(canvasWidth, canvasHeight, 'canvas');
                    // console.log(concentHeight, concentWidth, 'concent');
                    // 新建一个new JsPDF [880, 524] 一页全屏
                    let PDF = new JsPDF('l', 'px', [880, 524]);
                    PDF.setFont('simhei'); //设置黑体
                    PDF.setTextColor(255, 255, 255);
                    PDF.addImage(_this.$refs.coverImg.src, 'JPEG', 0, 0, 880, 524);
                    PDF.setFontSize(40);
                    PDF.text(73, 215, '多日分析');
                    PDF.setFontSize(20);
                    PDF.text(73, 255, `报告时间：${today}`);
                    PDF.text(73, 285, '数据来源：绩效评估后台（多日分析）');

                    PDF.addImage(_this.$refs.watermarkImg.src, 'JPEG', 0, 0, 880, 524);
                    PDF.addPage();
                    PDF.addImage(_this.$refs.backGr.src, 'JPEG', 0, 0, 880, 160);
                    PDF.setFontSize(14);
                    PDF.text(45, 80, `厂商：${provider}`);
                    PDF.text(160, 80, `算法类型：${algo_type}`);
                    PDF.text(310, 80, `算法：${algo_id}`);
                    PDF.text(435, 80, `用户ID：${user_id}`);
                    PDF.text(570, 80, `开始时间：${start}`);
                    PDF.text(720, 80, `结束时间：${end}`);
                    PDF.setFontSize(28);
                    PDF.text(40, 50, '基本信息');
                    PDF.text(40, 140, '收益概览');
                    PDF.setDrawColor(0);
                    PDF.setFillColor(40, 170, 233);
                    PDF.rect(28, 35, 4, 15, 'FD');
                    PDF.rect(28, 125, 4, 15, 'FD');
                    PDF.addImage(pageData, 'JPEG', 0, 160, 880, 360);
                    PDF.addImage(_this.$refs.watermarkImg.src, 'JPEG', 0, 0, 880, 524);
                    // 保存 pdf 文档
                    PDF.save(`${title}.pdf`);
                    resolve(true);
                });
            });
        },
        // 获取跨天数的X轴
        getCrossDateTime() {
            let xDataList = [];
            let startDate = dayjs(this.timeRange[0]).format('YYYYMMDD');
            let endDate = dayjs(this.timeRange[1]).format('YYYYMMDD');
            let diffData = dayjs(this.timeRange[1]).diff(this.timeRange[0], 'day') + 1; //两个日期之间相差的天数
            let nextDate = startDate;
            for (let i = 0; i < diffData; i++) {
                if (nextDate === startDate) {
                    xDataList.push(dayjs(nextDate).format('MM/DD'));
                }
                if (nextDate < endDate) {
                    nextDate = dayjs(nextDate).add(1, 'day').format('YYYYMMDD');
                    xDataList.push(dayjs(nextDate).format('MM/DD'));
                }
            }
            return xDataList;
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
