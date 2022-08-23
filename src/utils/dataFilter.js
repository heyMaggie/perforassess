// 引入模块 dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import Vue from 'vue';
const filters = {
    /**
     * 功能：将时间戳按照给定的 时间/日期 格式进行处理
     * @param {Number} date 时间戳
     * @returns {String} 规范后的 时间/日期 字符串
     */
    formatDate: function (date, formatStr = 'YYYY-MM-DD HH:mm:ss') {
        console.log(date, 'date');
        if (!date) {
            return '-';
        }
        return dayjs(date * 1000).format(formatStr); // 使用 dayjs 格式化时间
    }
};
export default Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
});
