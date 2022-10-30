const splitArray = (arr, size=10000) => {
    let resArr = [];
    for (let i = 0; i < arr.length; i += size) {
      let x = arr.slice(i, i + size);
      resArr.push(x);
    }
    return resArr;
  };

  export default splitArray;