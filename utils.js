// 判断大小
function compareSize(a) {
  return a < 5 ? '小' : '大';
}

// 判断几大几小
function compareSizeCount(numbers) {
  const big = numbers.filter(item => item >= 5).length;
  if (big === 0) return '全小';
  if (big === numbers.length) return '全大';
  const small = numbers.length - big;
  return `${big}大${small}小`;
}

// 判断单双
function compareOddEven(a) {
  return a % 2 === 0 ? '双' : '单';
}

// 判断几单几双
function compareOddEvenCount(numbers) {
  const odd = numbers.filter(item => item % 2 !== 0).length;
  if (odd === 0) return '全双';
  if (odd === numbers.length) return '全单';
  const even = numbers.length - odd;
  return {
    odd,
    even,
    oddEven: `${odd}单${even}双`
  }
}

// 格式化code 返回形态
function formatCode(code, timestamp) {
  if (!code) return {};
  // 去掉空格
  const numbers = code.split('').filter(i => i !== '' && i.trim()).join('');
  const sum =  numbers.split('').reduce((a, b) => a + Number(b), 0);
  return {
    // 三位数
    code: numbers,
    // 形态
    types: [
      `${compareSize(numbers[0])}${compareSize(numbers[1])}${compareSize(numbers[2])}`, 
      compareSizeCount([numbers[0], numbers[1], numbers[2]]),
      `${compareOddEven(numbers[0])}${compareOddEven(numbers[1])}${compareOddEven(numbers[2])}`,
      compareOddEvenCount([numbers[0], numbers[1], numbers[2]]).oddEven,
    ],
    // 豹子
    isLeopard: new Set(numbers.split('')).size === 1,
    // 组三
    isGroupThree: new Set(numbers.split('')).size === 2,
    // 组六
    isGroupSix: new Set(numbers.split('')).size === 3,
    // 和值
    sum,
    // 和值单双
    sumOddEven: compareOddEven(sum),
    // 跨度
    span: Math.max(...numbers.split('').map(Number)) - Math.min(...numbers.split('').map(Number)),
    // 时间戳
    timestamp: timestamp ? new Date(timestamp).getTime() : new Date().getTime(),
  };
};

// 加工数据
function generateData(codes) {
  return codes.map((numbers) => {
    const code = `${numbers[0]}${numbers[1]}${numbers[2]}`;
    return formatCode(code);
  });
};

// 生成 0 - 9 三位数组组合
function generateThreeDigits({ hundred,ten, one } = { hundred: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], ten: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], one: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }) {
  let result = [];
  for (let i = 0; i < hundred.length; i++) {
    for (let j = 0; j < ten.length; j++) {
      for (let k = 0; k < one.length; k++) {
        result.push(`${hundred[i]}${ten[j]}${one[k]}`); 
      }
    }
  }
  result = generateData(result);
  return result;
};

// 随机指定长度的数组
function generateCombination(count ,codes) {
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

function isContinuous(list, index, value, key, count = 3) {
  const current = list[index];
  const next = list[index + 1] || {};
  const next2 = list[index + 2] || {};
  const pre = list[index - 1] || {};
  const pre2 = list[index - 2] || {};
  // 连续2个就算
  if (count === 2) {
    return ((current[key] === value && next[key] === value && next[key] !== pre[key]) ||
    (current[key] === value && pre[key] === value && next[key] !== pre[key]))
  }
  return (
    (current[key] === value && next[key] === value && next2[key] === value) ||
    (current[key] === value && pre[key] === value && next[key] === value) ||
    (current[key] === value && pre2[key] === value && pre[key] === value)
  );
};


// 上盘下盘
function compareUpperLower(numbers) {
  const upArr = numbers.filter(item => item <= 40);
  const downArr = numbers.filter(item => item > 40);
  const oddEven = compareOddEvenCount(numbers);
  return {
    up: upArr,
    down: downArr,
    upCount: upArr.length,
    downCount: downArr.length,
    oddCount: oddEven.odd,
    evenCount: oddEven.even,
    upOrDownText: upArr.length > downArr.length ? '上' : upArr.length === downArr.length ? '和' : '下',
    oddOrEvenText: oddEven.odd > oddEven.even ? '单' : oddEven.odd === oddEven.even ? '和' : '双',
  }
}

function isGroupSixWinningFunc(number, predictionGroupSix) {
  if (!predictionGroupSix) return -1;
  const numbers = number.split(' ');
  if (new Set(numbers).size !== 3) return false;
  const predictionNumbers = predictionGroupSix.split(',').map(Number);
  return numbers.every(item => predictionNumbers.includes(+item));
}

