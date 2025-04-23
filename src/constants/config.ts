const BASE_Y = 280; // 基準 Y 軸位置
const GROUND_Y = BASE_Y; // 地面 Y 軸位置
const GRAVITY = 1.2; // 重力加速度
const JUMP_MULTIPLIER = 0.6; // 跳躍力道乘數
const MAX_JUMP_FORCE = 20; // 最大跳躍力道
const VOLUME_THRESHOLD = 5; // 音量閾值

const PLAYER_X = 50; // 角色 X 軸位置
const PLAYER_Y = 50; // 角色 Y 軸位置

const OBSTACLE_WIDTH = 40; // 障礙物寬度
const OBSTACLE_HEIGHT = 80; // 障礙物高度
const OBSTACLE_SPEED = 5; // 障礙物移動速度

const GAME_WIDTH = window.innerWidth; // 遊戲畫面寬度

export {
  BASE_Y,
  GROUND_Y,
  GRAVITY,
  JUMP_MULTIPLIER,
  MAX_JUMP_FORCE,
  VOLUME_THRESHOLD,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  OBSTACLE_SPEED,
  GAME_WIDTH,
  PLAYER_X,
  PLAYER_Y,
};
