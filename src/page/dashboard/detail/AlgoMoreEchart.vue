<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>Dashboard / 查看更多</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="card">
            <div @click="goBack" class="backRow"><span class="backIcon icon el-icon-arrow-left"></span>返回</div>
            <div class="main1" id="main1"></div>
            <div class="blue-card">
                <a
                    class="minW-card"
                    v-for="(item, j) in algoNameList"
                    :key="j"
                    :class="selectIndex == j ? 'isselect' : ''"
                    @click="selectAlgoList(item, j)"
                >
                    <div v-for="(subItem, i) in item" :key="subItem">
                        <div class="dot" :style="{ background: colorList[i] }"></div>
                        <span class="algoName">{{ subItem }}</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import { mulitAnalyseApi, optionListApi } from '@/api/index';
import fiexdDate from '../../../utils/fixeddate';
const dayjs = require('dayjs');

export default {
    data() {
        return {
            colorList: ['#65A6FF', '#34B7FE', '#59CC7F', '#FAD337'],
            algoNameList: [],
            optAlgoList: [], //选中的
            selectIndex: 0
        };
    },
    created() {},
    mounted() {
        // 获取算法列表
        this.getOptionList();
    },
    methods: {
        goBack() {
            this.$router.push('/dashboard');
        },
        getOptionList() {
            let time = Date.parse(new Date()) / 1000;
            let query = { choose_type: 8, date: time };
            optionListApi(query).then((res) => {
                if (res.code == 200 && res.algo_name && res.algo_name.length) {
                    let array = res.algo_name;
                    // array = ['智能委托(ZC)', 'V-wap plus', '9999', '8888', '7777', '6666', '5555', '4444', '3333', '2222', '1111'];
                    let len = array.length;
                    let n = 4; //假设每行显示4个
                    let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);
                    for (let i = 0; i < lineNum; i++) {
                        let temp = array.slice(i * n, i * n + n);
                        this.algoNameList.push(temp);
                    }
                    console.log(this.algoNameList);
                    this.optAlgoList = this.algoNameList[0];
                    this.getMulitAnalyseData();
                } else {
                    this.generateChart([], 'main1');
                }
            });
        },
        getMulitAnalyseData() {
            let today = dayjs().format('YYYY-MM-DD');
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today} 23:59`).getTime() / 1000;
            let query = {
                start_time: start_time,
                end_time: end_time,
                user_id: localStorage.getItem('ms_username'),
                algo_name: this.optAlgoList
            };
            let list = [];
            mulitAnalyseApi(query).then((res) => {
                if (res.code == 200) {
                    list = res.list ? res.list : [];
                    this.generateChart(list, 'main1');
                } else {
                    this.$message.error('请求错误');
                }
            });
        },
        generateChart(list, type) {
            let isNull = false;
            let seriesList = [];
            function singelLine(params) {
                let lineObj = { name: '', data: [] };
                fiexdDate.forEach((item, i) => {
                    lineObj.name = params.algo_name;
                    lineObj.data[i] = '';
                    //容错处理
                    params.data = params.data ? params.data : [];
                    params.data.forEach((subitem) => {
                        if (subitem.time_point == item) {
                            lineObj.data[i] = subitem.score;
                        }
                    });
                });
                return lineObj;
            }
            if (list.length == 0 || !list) {
                this.$message.error('该算法暂无数据');
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
                    item.showSymbol = false;
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
            let option = {
                title: {
                    text: '算法绩效',
                    textStyle: {
                        color: '#333333',
                        fontSize: 20,
                        fontWeight: 500
                    }
                },
                textStyle: {
                    color: '#333'
                },
                legend: {
                    bottom: 0,
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
                    bottom: '30px',
                    top: '68px',
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
                        interval: 29
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
                        name: `单位：（%）`,
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
                            padding: [0, 0, 0, 25]
                        },
                        min: isNull ? 0 : null,
                        max: isNull ? 100 : null
                    }
                ],
                series: seriesList
            };
            var myChart = echarts.init(document.getElementById(type));
            myChart.clear();
            myChart.setOption(option);
            myChart.resize();
        },
        selectAlgoList(algoList, index) {
            this.optAlgoList = algoList;
            this.selectIndex = index;
            this.getMulitAnalyseData();
        }
    }
};
</script>
<style lang="less" scoped>
.card {
    height: 88vh;
    .backRow {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #666666;
        cursor: pointer;
        margin: 0 -24px 0px;
        padding: 0 24px 16px;
        border-bottom: #ececec 1px solid;
        .backIcon {
            color: #91a2bd;
            margin-right: 10px;
        }
    }
    .main1 {
        height: 326px;
        width: 100%;
        margin-top: 16px;
    }
    .blue-card {
        // width: 1608px;
        height: 125px;
        background: #f2f4fb;
        padding: 16px 13px 0px;
        .minW-card {
            // width: 238px;
            height: 28px;
            background: #ffffff;
            box-shadow: 0px 6px 16px 0px rgba(198, 208, 224, 0.46);
            border-radius: 5px;
            display: inline-block;
            margin-right: 8px;
            margin-bottom: 4px;
            overflow: hidden;
            padding-left: 10px;
            padding-right: 10px;
            line-height: 28px;
            box-sizing: border-box;
            cursor: pointer;
            &:active {
                background: #e3f1ff;
            }
            div {
                display: inline-block;
                margin-right: 18px;
                &:nth-child(4) {
                    margin-right: 0px;
                }
            }
            .dot {
                width: 6px;
                height: 6px;
                background: #1890ff;
                border-radius: 50%;
                display: inline-block;
                margin-right: 3px;
                margin-bottom: 1px;
            }
            .algoName {
                font-size: 12px;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: #999999;
                line-height: 22px;
            }
        }
        .isselect {
            border-left: 2px solid #3281ff;
            box-sizing: border-box;
            box-shadow: 0px 6px 16px 0px rgba(198, 208, 224, 0.66);
        }
    }
}
</style>
