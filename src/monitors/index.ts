const schedule = require("node-schedule");
const _score = require("./score");

function monitor() {
  seconds5();
}

const seconds5 = () => {
  var timerID = setInterval(function () {
    _score.cleanLiveScore();

    seconds5();
    clearInterval(timerID);
  }, 5000);
};

module.exports = {
  monitor,
};
