const axios = require('axios');
const fs = require('fs');
const history = JSON.parse(fs.readFileSync('./history.json', 'utf8') || '{}');

const _ = 'https://api.tanshuapi.com/api/caipiao/v1/history?key=27b41ccb9e2d03fe2aed99f53e27cfe2&caipiaoid=12&issueno=&num=20&start=';

async function func(i) {
    if (i > 0)return;
    const url = `${_}${i*20}`;
    console.log('开始请求', i,'--', url);
    axios.get(url).then(response => {
        console.log('请求成功', i);
        const { list } = response.data.data;
        list.forEach(item => {
            if (!history[item.opendate]) {
                history[item.opendate] = item;
            }
        });
        fs.writeFileSync('./history.json', JSON.stringify(history, null, 2), 'utf8');
        func(i + 1);
    })
}
func(0);
