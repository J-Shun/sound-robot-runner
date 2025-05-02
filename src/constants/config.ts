const GAME_WIDTH = window.innerWidth; // 遊戲畫面寬度
const GAME_HEIGHT = window.innerHeight; // 遊戲畫面高度

const GROUND_Y = GAME_HEIGHT / 1.5; // 基準 Y 軸位置
const HP_BAR_Y = GAME_HEIGHT / 1.15; // 血量條 Y 軸位置
const HP_BAR_X = 20; // 血量條寬度

const GRAVITY = 0.7; // 重力加速度
const MAX_JUMP_FORCE = 20; // 最大跳躍力道

const PLAYER_WIDTH = 87; // 角色寬度
const PLAYER_HEIGHT = 90; // 角色高度
const PLAYER_ORIGINAL_X = 200; // 角色 X 軸位置，因為角色從左上角開始，所以需要加上寬度的一半
const PLAYER_ORIGINAL_Y = Math.floor(GROUND_Y - PLAYER_HEIGHT); // 角色原始 Y 軸位置（角色頭上方的水平座標）
const PLAYER_HP = 5; // 角色血量

const FLAME_GUN_ORIGINAL_X = PLAYER_ORIGINAL_X + 44; // 火焰槍 X 軸位置
const FLAME_GUN_ORIGINAL_Y = PLAYER_ORIGINAL_Y + 45; // 火焰槍 Y 軸位置
const FLAME_GUN_WIDTH = 57; // 火焰槍寬度

const FLAME_ORIGINAL_X = PLAYER_ORIGINAL_X + 80; // 火焰 X 軸位置
const FLAME_ORIGINAL_Y = PLAYER_ORIGINAL_Y + 43; // 火焰 Y 軸位置

// 火焰充能的時間閾值
const FLAME_CHARGE_TIME_S = 105; // 進化到小火焰的充能時間
const FLAME_CHARGE_TIME_M = 210; // 進化到中火焰的充能時間
const FLAME_CHARGE_TIME_L = 315; // 進化到大火焰的充能時間
const FLAME_CHARGE_TIME_L_MAX = 500; // 充能極限

const PATROL_BOT_WIDTH = 96; // 巡邏機器人寬度
const PATROL_BOT_HEIGHT = 96; // 巡邏機器人高度
const PATROL_BOT_Y = GROUND_Y - PATROL_BOT_HEIGHT; // 巡邏機器人 Y 軸位置
const PATROL_BOT_HP = 3; // 巡邏機器人血量

const PLAYER_SPEED = 4.5; // 角色移動速度
const BACKGROUND_SPEED = 3; // 建築物移動速度
const PATROL_BOT_SPEED = 4; // 巡邏機器人移動速度

export {
  GROUND_Y,
  GRAVITY,
  MAX_JUMP_FORCE,
  PATROL_BOT_SPEED,
  PLAYER_SPEED,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_ORIGINAL_X,
  PLAYER_ORIGINAL_Y,
  FLAME_ORIGINAL_X,
  FLAME_ORIGINAL_Y,
  PATROL_BOT_WIDTH,
  PATROL_BOT_HEIGHT,
  PATROL_BOT_Y,
  FLAME_GUN_ORIGINAL_X,
  FLAME_GUN_ORIGINAL_Y,
  FLAME_CHARGE_TIME_S,
  FLAME_CHARGE_TIME_M,
  FLAME_CHARGE_TIME_L,
  FLAME_CHARGE_TIME_L_MAX,
  FLAME_GUN_WIDTH,
  PLAYER_HP,
  HP_BAR_X,
  HP_BAR_Y,
  BACKGROUND_SPEED,
  PATROL_BOT_HP,
};
