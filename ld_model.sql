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

 Date: 20/08/2025 11:24:51
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
) ENGINE = MyISAM AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of indicators
-- ----------------------------
INSERT INTO `indicators` VALUES (15, '数学', '', 12, 1, 1, NULL);
INSERT INTO `indicators` VALUES (12, '学科', '', 0, 0, 0, NULL);
INSERT INTO `indicators` VALUES (26, '电脑', '一种电器', 0, 0, 0, NULL);
INSERT INTO `indicators` VALUES (24, '语文', '一门语言学科', 12, 1, 1, NULL);
INSERT INTO `indicators` VALUES (27, '主板', '板子', 26, 1, 0, NULL);
INSERT INTO `indicators` VALUES (28, '南桥', '', 27, 2, 1, NULL);
INSERT INTO `indicators` VALUES (29, '北桥', '', 27, 2, 1, NULL);
INSERT INTO `indicators` VALUES (30, '处理器', 'cpu', 26, 1, 0, NULL);
INSERT INTO `indicators` VALUES (32, '风扇', '', 26, 1, 0, NULL);
INSERT INTO `indicators` VALUES (34, '热管', '', 32, 2, 1, NULL);
INSERT INTO `indicators` VALUES (36, '螺丝', '', 30, 2, 1, NULL);
INSERT INTO `indicators` VALUES (37, '电线', '', 30, 2, 1, NULL);

-- ----------------------------
-- Table structure for schemes
-- ----------------------------
DROP TABLE IF EXISTS `schemes`;
CREATE TABLE `schemes`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schemeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '方案名称',
  `schemeDesc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '方案描述',
  `indicatorSystem` int(255) NULL DEFAULT NULL COMMENT '方案绑定的指标体系',
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '绑定的配置',
  `status` tinyint(2) NULL DEFAULT NULL COMMENT '状态（0-不可用，1-可用）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of schemes
-- ----------------------------
INSERT INTO `schemes` VALUES (1, '第一季度测试', '第一季度测试的描述', 12, NULL, 0);
INSERT INTO `schemes` VALUES (2, '第二季度测试', '第二季度测试描述', 26, '[{\"indicatorId\":27,\"indicatorDesc\":\"\",\"indicatorName\":\"主板\",\"level\":0,\"children\":[{\"level\":1,\"children\":[],\"indicatorId\":28,\"indicatorDesc\":\"13121\",\"indicatorName\":\"南桥\"}]}]', 1);
INSERT INTO `schemes` VALUES (3, '第三季度测试', '第三季度测试详情', 26, NULL, 0);
INSERT INTO `schemes` VALUES (4, '第三季度测试', '', 12, NULL, 0);
INSERT INTO `schemes` VALUES (5, '第三季度测试', '第三季度测试的方案详情', 26, NULL, 0);
INSERT INTO `schemes` VALUES (6, '第一季度测试', '描述', 26, '[{\"indicatorId\":27,\"indicatorDesc\":\"\",\"indicatorName\":\"主板\",\"level\":0,\"children\":[]}]', 1);

SET FOREIGN_KEY_CHECKS = 1;
