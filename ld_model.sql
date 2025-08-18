/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 80012 (8.0.12)
 Source Host           : localhost:3306
 Source Schema         : ld_model

 Target Server Type    : MySQL
 Target Server Version : 80012 (8.0.12)
 File Encoding         : 65001

 Date: 18/08/2025 18:01:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for indicators
-- ----------------------------
DROP TABLE IF EXISTS `indicators`;
CREATE TABLE `indicators`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `indicatorName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '指标名',
  `indicatorDesc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '指标描述',
  `parentId` int(11) NULL DEFAULT NULL COMMENT '父级指标id',
  `level` int(3) NULL DEFAULT NULL COMMENT '树的第几层',
  `isLeaf` int(1) NULL DEFAULT NULL COMMENT '是否为叶子结点（0-否，1-是）',
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '指标配置',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of indicators
-- ----------------------------
INSERT INTO `indicators` VALUES (15, '数学', '', 12, 1, 1, NULL);
INSERT INTO `indicators` VALUES (12, '学科', '', 0, 0, 0, NULL);
INSERT INTO `indicators` VALUES (5, '数学', '', 0, 0, 1, NULL);
INSERT INTO `indicators` VALUES (6, '物理', '', 0, 0, 1, NULL);

SET FOREIGN_KEY_CHECKS = 1;
