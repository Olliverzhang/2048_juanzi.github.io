/*
 * @Author: your name
 * @Date: 2019-07-27 09:10:56
 * @LastEditTime: 2019-11-25 21:45:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edito
 * @FilePath: \2048\main2048.js
 */
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
  prepareForMobile();
  newgame();
});

function prepareForMobile() {
  if (documentWidth > 500) {
    gridContainerWidth = 500;
    cellSpace = 20;
    cellSideLength = 100;
  }
  $("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
  $("#grid-container").css("height", gridContainerWidth - 2 * cellSpace);
  $("#grid-container").css("padding", cellSpace);
  $("#grid-container").css("border-radius", 0.02 * gridContainerWidth);
  $(".grid-cell").css("width", cellSideLength);
  $(".grid-cell").css("height", cellSideLength);
  $(".grid-cell").css("border-radius", 0.02 * cellSideLength);
}

function newgame() {
  // 初始化棋盘格
  init();
  // 在随机两个格子生成数字
  generateOneNumber();
  generateOneNumber();
}

function init() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $("#grid-cell-" + i + "-" + j);
      gridCell.css("top", getPosTop(i, j));
      gridCell.css("left", getPosLeft(i, j));
    }
  }

  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }
  //对number cell上的元素进行显示上的限定
  updataBoardView();
  score = 0;
}

function updataBoardView() {
  $(".number-cell").remove();
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      $("#grid-container").append(
        '<div class="number-cell" id="number-cell-' + i + "-" + j + '"></div>'
      );
      var theNumberCell = $("#number-cell-" + i + "-" + j);
      if (board[i][j] == 0) {
        theNumberCell.css("width", "0px");
        theNumberCell.css("height", "0px");
        theNumberCell.css("top", getPosTop(i, j) + cellSideLength / 2);
        theNumberCell.css("left", getPosLeft(i, j) + cellSideLength / 2);
      } else {
        theNumberCell.css("width", cellSideLength);
        theNumberCell.css("height", cellSideLength);
        theNumberCell.css("top", getPosTop(i, j));
        theNumberCell.css("left", getPosLeft(i, j));
        theNumberCell.css(
          "background-color",
          getNumberBackgroundColor(board[i][j])
        );
        theNumberCell.css("color", getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
      hasConflicted[i][j] = false;
    }
  }
  $(".number-cell").css("line-height", cellSideLength + "px");
  $(".number-cell").css("font-size", 0.6 * cellSideLength + "px");
}

function generateOneNumber() {
  if (nospace(board)) {
    return false;
  }
  //随机一个位置
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));
  //判断随机生成的数字的位置是否合理
  var times = 50;
  while (times < 50) {
    if (board[randx][randy] == 0) {
      break;
    }
    //重新生成一个随机的位置
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
    times++;
  }
  if (times == 50) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] == 0) {
          randx = i;
          randy = j;
        }
      }
    }
  }
  //随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  //在随机位置显示随机数字
  board[randx][randy] = randNumber;
  //显示的过程中有一个动画效果
  showNumberWithAnimation(randx, randy, randNumber);
  return true;
}

$(document).keydown(function(e) {
  switch (e.keyCode) {
    case 37: //left
      e.preventDefault();
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 38: //up
      e.preventDefault();
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 39: //right
      e.preventDefault();
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 40: //down
      e.preventDefault();
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    default:
      //default
      break;
  }
});

document.addEventListener("touchstart", function(e) {
  startx = e.touches[0].pageX;
  starty = e.touches[0].pageY;
});
//该函数的出现是为了解决android4.0中自带的一个bug，虽然我没有遇到，但是还是写上
document.addEventListener("touchmove", function(e) {
  e.preventDefault();
});

document.addEventListener("touchend", function(e) {
  endx = e.changedTouches[0].pageX;
  endy = e.changedTouches[0].pageY;
  var deltax = endx - startx;
  var deltay = endy - starty;
  if (
    Math.abs(deltax) < 0.1 * documentWidth &&
    Math.abs(deltay) < 0.1 * documentWidth
  ) {
    return;
  }
  if (Math.abs(deltax) > Math.abs(deltay)) {
    //x方向
    if (deltax > 0) {
      //向右移动
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    } else {
      //向左移动
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  } else {
    //y方向
    if (deltay > 0) {
      //向下移动
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    } else {
      //向上移动
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }
});

function isgameover() {
  if (nospace(board) && nomove(board)) {
    gameover();
  }
}
function gameover() {
  alert("gameover");
}

function moveLeft() {
  if (!canMoveLeft(board)) {
    return false;
  }
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          //左边的数字为0且没有障碍物
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            //move
            //移动中有个动画的过程,从i,j位置移动到i,k的位置
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            //左边的数字为与右边的相等且没有障碍物
            board[i][k] == board[i][j] &&
            noBlockHorizontal(i, k, j, board) &&
            !hasConflicted[i][k]
          ) {
            //move
            showMoveAnimation(i, j, i, k);
            //add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updataBoardView()", 200);
  return true;
}
function moveUp() {
  if (!canMoveUp(board)) {
    return false;
  }
  for (var i = 1; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {
          //上边的数字为0且没有障碍物
          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
            //move
            //移动中有个动画的过程,从i,j位置移动到k,j的位置
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            //上边的数字为与下边的相等且没有障碍物
            board[k][j] == board[i][j] &&
            noBlockVertical(j, k, i, board) &&
            !hasConflicted[k][j]
          ) {
            //move
            showMoveAnimation(i, j, k, j);
            //add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updataBoardView()", 200);
  return true;
}
function moveRight() {
  if (!canMoveRight(board)) {
    return false;
  }
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          //左边的数字为0且没有障碍物
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            //move
            //移动中有个动画的过程,从i,j位置移动到i,k的位置
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            //左边的数字为与右边的相等且没有障碍物
            board[i][k] == board[i][j] &&
            noBlockHorizontal(i, k, j, board) &&
            !hasConflicted[i][k]
          ) {
            //move
            showMoveAnimation(i, j, i, k);
            //add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updataBoardView()", 200);
  return true;
}
function moveDown() {
  if (!canMoveDown(board)) {
    return false;
  }
  for (var i = 2; i >= 0; i--) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          //上边的数字为0且没有障碍物
          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            //move
            //移动中有个动画的过程,从i,j位置移动到k,j的位置
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            //上边的数字为与下边的相等且没有障碍物
            board[k][j] == board[i][j] &&
            noBlockVertical(j, i, k, board) &&
            !hasConflicted[k][j]
          ) {
            //move
            showMoveAnimation(i, j, k, j);
            //add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updataBoardView()", 200);
  return true;
}
