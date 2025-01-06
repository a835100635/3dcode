
const fs = require('fs');
const history = JSON.parse(fs.readFileSync('./history.json', 'utf8') || '{}');

const defaultNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function generateGroupSix(preNumber) {
    preNumber = preNumber.split(',');
    // 三位数中随机取一个
    const randomNumber = +preNumber[Math.floor(Math.random() * preNumber.length)];
    return defaultNumber.filter(item => item !== randomNumber).join(',');
}
// 生成 0 - 9 三位数组组合
function generateThreeDigits({
    hundred,
    ten,
    one
} = {
    hundred: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ten: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    one: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
}) {
    let result = [];
    for (let i = 0; i < hundred.length; i++) {
        for (let j = 0; j < ten.length; j++) {
            for (let k = 0; k < one.length; k++) {
                result.push(`${hundred[i]}${ten[j]}${one[k]}`);
            }
        }
    }
    return result;
};

// 随机指定长度的数组
function generateCombination(count, codes) {
    const arr = [];
    let allCombination = [...codes];
    const func = () => {
        if (arr.length < count) {
            let randomIndex = Math.floor(Math.random() * allCombination.length);
            arr.push(allCombination.splice(randomIndex, 1)[0]);
            func();
        }
    }
    func();
    return arr;
};
const keys = Object.keys(history).map(i => ({
    key: i,
    timestamp: new Date(i).getTime()
})).sort((a, b) => a.timestamp - b.timestamp);
// console.log(keys);

const allCombinations = generateCombination(1000, generateThreeDigits());

keys.forEach(({
    key
}, index) => {
    delete history[key].prize;
    const {
        number
    } = history[key];
    const code = number.split(' ').join(',');
    // if (index < 2) {
        if (keys[index + 1] && history[keys[index + 1].key] && !history[keys[index + 1].key].prediction.groupSix) {
            history[keys[index + 1].key].prediction.groupSix = generateGroupSix(code);
        }
        if (keys[index + 1] && history[keys[index + 1].key]) {
          let a = 0;
          // 计算和值
          const sum = number.split(' ').reduce((prev, cur) => prev + +cur, 0);
          // 小取大 大取小
          if (sum < 14) {
            a = [5,6,7,8,9][Math.floor(Math.random() * 5)]
          } else {
            a = [0,1,2,3,4][Math.floor(Math.random() * 5)]
          }
            const includes = generateGroupSix(defaultNumber.filter(item => item !== +a).join(','));
            const includesArr = generateThreeDigits({
                hundred: includes.split(','),
                ten: includes.split(','),
                one: includes.split(',')
            });
            const result = generateCombination(700, includesArr);
            history[keys[index + 1].key].prediction.sixCode = result.join(',');
        }
    // }
});
fs.writeFileSync('./history.json', JSON.stringify(history, null, 2), 'utf8');