const axios = require('axios');
const fs = require('fs');
const history = JSON.parse(fs.readFileSync('./history.json', 'utf8') || '{}');
const history2 = JSON.parse(fs.readFileSync('./history2.json', 'utf8') || '{}');

// 3D
const api1 = 'https://api.tanshuapi.com/api/caipiao/v1/history?key=27b41ccb9e2d03fe2aed99f53e27cfe2&caipiaoid=12&issueno=&num=20&start=';
async function func(i) {
    if (i > 0)return;
    const url = `${api1}${i*20}`;
    console.log('3D开始请求', i,'--', url);
    axios.get(url).then(response => {
        console.log('请求成功', i);
        const { list } = response.data.data;
        list.forEach(item => {
            history[item.opendate] = {
                ...history[item.opendate],
                ...item
            }
            delete history[item.opendate].prize;
        });
        fs.writeFileSync('./history.json', JSON.stringify(history, null, 2), 'utf8');
        func(i + 1);
    })
}
func(0);

// 快乐8
const api2 = 'https://api.tanshuapi.com/api/caipiao/v1/history?key=27b41ccb9e2d03fe2aed99f53e27cfe2&caipiaoid=89&issueno=&num=20&start=';
function func2(i) {
    if (i > 0)return;
    const url = `${api2}${i*20}`;
    console.log('开始请求', i,'--', url);
    axios.get(url).then(response => {
        console.log('快乐8请求成功', i);
        const { list } = response.data.data;
        list.forEach(item => {
            delete item.prize;
            if (item.opendate.includes('(')) {
                item.opendate = item.opendate.match(/(\d{4}-\d{2}-\d{2})\([^)]*\)/)[1];
            }
            history2[item.opendate] = {
                ...history2[item.opendate],
                ...item
            }
        });
        fs.writeFileSync('./history2.json', JSON.stringify(history2, null, 2), 'utf8');
        func2(i + 1);
    })
}
func2(0)

// const defaultNumber = [0,1, 2, 3, 4, 5, 6, 7, 8, 9];
// function   generateGroupSix(preNumber) {
//     preNumber = preNumber.split(',');
//     // 三位数中随机取一个
//     const randomNumber = +preNumber[Math.floor(Math.random() * preNumber.length)];
//     return defaultNumber.filter(item => item !== randomNumber).join(',');
// }
// const keys = Object.keys(history).map(i => ({ key: i, timestamp: new Date(i).getTime() })).sort((a, b) => a.timestamp - b.timestamp);
// console.log(keys);
// keys.forEach(({ key }, index) => {
//     delete history[key].prize;
//     const { number } = history[key];
//     const code = number.split(' ').join(',');
//     const prediction = {
//         groupSix: generateGroupSix(code)
//     }
//     // if (index < 2) {
//         // console.log('预测', history[keys[index+1].key]);
//         if (keys[index+1] && history[keys[index+1].key]) {

//             history[keys[index + 1].key].prediction = {
//                 ...prediction
//             }
//         }
//     // }
// });
// fs.writeFileSync('./history.json', JSON.stringify(history, null, 2), 'utf8');
// // console.log(keys);