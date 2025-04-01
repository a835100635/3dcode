
const fs = require('fs');
const history = JSON.parse(fs.readFileSync('./history.json', 'utf8') || '{}');

const keys = Object.keys(history).map(key => {
  return {
    key,
    time: new Date(key).getTime()
  }
}).sort((a, b) => b.time - a.time).map(item => item.key);

keys.forEach((key, i) => {
  if (!keys[i+1]) return;
  // 截取300条数据
  const dataKeys = keys.slice(i+1, i + 301);
  const cData = history[key];
  const { number } = cData;
  let index = -1;
  let cIndex = 0;

  while (index === -1 && cIndex < dataKeys.length) {
    if (history[dataKeys[cIndex]].number === number) {
      // console.log('重复数据：', number, history[dataKeys[cIndex]].number);
      index = cIndex;
    }
    cIndex++;
  }
  
  history[key].lastRepeat = {
    isRepeat: index !== -1,
    preIndex: index
  }

});

// console.log(history);

fs.writeFileSync('./history.json', JSON.stringify(history, null, 2), 'utf8');