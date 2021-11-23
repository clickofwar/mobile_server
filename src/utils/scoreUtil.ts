const rankUser = (array: any, user: string) => {
  let userArray = array.map(({ username }) => {
    return username;
  });

  let filterUserArray = userArray.filter(function (item: any, pos: any) {
    return userArray.indexOf(item) == pos;
  });

  let rankArray = [];
  filterUserArray.forEach((username) => {
    let sum = { score: 0 };
    sum = array.reduce((a, b) => {
      if (username === b.username) {
        return { score: a.score + b.score };
      } else {
        return { score: a.score };
      }
    });

    rankArray.push({ username, sum: sum.score });
  });

  let rankOrderArray = rankArray.sort((a, b) =>
    a.sum < b.sum ? 1 : b.sum < a.sum ? -1 : 0
  );

  let index = rankOrderArray.findIndex((x) => x.username === user);
  return index + 1;
};

module.exports = { rankUser };
