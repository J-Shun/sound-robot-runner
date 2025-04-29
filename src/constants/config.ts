const GAME_WIDTH = window.innerWidth; // 遊戲畫面寬度
const GAME_HEIGHT = window.innerHeight; // 遊戲畫面高度

const GROUND_Y = GAME_HEIGHT / 1.5; // 基準 Y 軸位置
const GRAVITY = 1.2; // 重力加速度
const JUMP_MULTIPLIER = 0.6; // 跳躍力道乘數
const MAX_JUMP_FORCE = 20; // 最大跳躍力道
const VOLUME_THRESHOLD = 5; // 音量閾值

const PLAYER_WIDTH = 87; // 角色寬度
const PLAYER_HEIGHT = 90; // 角色高度
const PLAYER_X = 200; // 角色 X 軸位置，因為角色從左上角開始，所以需要加上寬度的一半
const PLAYER_ORIGINAL_Y = GROUND_Y - PLAYER_HEIGHT; // 角色原始 Y 軸位置（角色頭的座標）

const PATROL_BOT_WIDTH = 78; // 機器人寬度
const PATROL_BOT_HEIGHT = 96; // 機器人高度
const PATROL_BOT_X = GAME_WIDTH; // 障礙物 X 軸位置，從右側進入畫面
const PATROL_BOT_Y = GROUND_Y - PATROL_BOT_HEIGHT; // 障礙物 Y 軸位置

const OBSTACLE_WIDTH = 40; // 障礙物寬度
const OBSTACLE_HEIGHT = 80; // 障礙物高度
const OBSTACLE_Y = GROUND_Y - OBSTACLE_HEIGHT; // 障礙物 Y 軸位置
const OBSTACLE_SPEED = 5; // 障礙物移動速度

export {
  GROUND_Y,
  GRAVITY,
  JUMP_MULTIPLIER,
  MAX_JUMP_FORCE,
  VOLUME_THRESHOLD,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  OBSTACLE_SPEED,
  OBSTACLE_Y,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_X,
  PLAYER_ORIGINAL_Y,
  PATROL_BOT_WIDTH,
  PATROL_BOT_HEIGHT,
  PATROL_BOT_X,
  PATROL_BOT_Y,
};
