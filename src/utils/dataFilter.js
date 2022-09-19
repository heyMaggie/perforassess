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
        if (!date) {
            return '-';
        }
        return dayjs(date * 1000).format(formatStr); // 使用 dayjs 格式化时间
    },

    /**
     * 功能：字典解析
     * @param {Number} date 需要转换的值
     * @returns {String} 转换后的字典
     */
    tableDic: function (date, dictList) {
        console.log(date, dictList);
        if (!date) {
            return '-';
        }
        let dictArr = dict[dictList];
        for (let j = 0; j < dictArr.length; j++) {
            if (dictArr[j].key == date) {
                return dictArr[j].value;
            }
        }
    }
};
export default Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
});
