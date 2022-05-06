-- Adminer 4.8.1 MySQL 8.0.28 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `arbitrage-module/GATEIO-module/endpoint`;
CREATE TABLE `arbitrage-module/GATEIO-module/endpoint` (
  `userid` varchar(255) NOT NULL COMMENT '用户编号',
  `apikey` text NOT NULL COMMENT 'API KEY',
  `apisecret` text NOT NULL COMMENT 'API SECRET',
  `linktime` int NOT NULL COMMENT '关联时间',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `arbitrage-module/GATEIO-module/endpoint` (`userid`, `apikey`, `apisecret`, `linktime`) VALUES
('P42SbhL_pRLqXdyPC_6yGprJZmR4_Ipx',	'5d9f7cd290b4c0fc2645556acd009ef6',	'57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96',	1650423937);

DROP TABLE IF EXISTS `arbitrage-module/GATEIO-module/entrust-order`;
CREATE TABLE `arbitrage-module/GATEIO-module/entrust-order` (
  `entrustid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '委托单号',
  `userid` varchar(255) NOT NULL COMMENT '用户编号',
  `contract` varchar(255) NOT NULL COMMENT '合约标识',
  `position_size` double NOT NULL COMMENT '仓位大小',
  `status` varchar(255) NOT NULL COMMENT '委托状态',
  `modified` int NOT NULL COMMENT '委托更新时间',
  `created` int NOT NULL COMMENT '委托创建时间',
  PRIMARY KEY (`entrustid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `arbitrage-module/GATEIO-module/position`;
CREATE TABLE `arbitrage-module/GATEIO-module/position` (
  `userid` varchar(255) NOT NULL COMMENT '用户编号',
  `contract` varchar(255) NOT NULL COMMENT '合约标识',
  `size` double NOT NULL COMMENT '头寸大小',
  `leverage` int NOT NULL COMMENT '杠杆倍数',
  `modified` int NOT NULL COMMENT '仓位更新时间',
  `created` int NOT NULL COMMENT '仓位创建时间',
  PRIMARY KEY (`userid`,`contract`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `arbitrage-module/GATEIO-module/transaction`;
CREATE TABLE `arbitrage-module/GATEIO-module/transaction` (
  `tradeid` varchar(255) NOT NULL COMMENT '交易单号',
  `entrustid` varchar(255) NOT NULL COMMENT '委托单号',
  `orderid` varchar(255) NOT NULL COMMENT '交易订单编号',
  `txtype` varchar(255) NOT NULL COMMENT '交易类型',
  `price` double NOT NULL COMMENT '交易价格',
  `size` double NOT NULL COMMENT '交易大小',
  `iterate` double NOT NULL COMMENT '交易迭代次数',
  `txstatus` varchar(255) NOT NULL COMMENT '交易状态',
  `modified` int NOT NULL COMMENT '交易更新时间',
  `created` int NOT NULL COMMENT '交易创建时间',
  PRIMARY KEY (`tradeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `user-module/loginuser`;
CREATE TABLE `user-module/loginuser` (
  `userid` varchar(255) NOT NULL COMMENT '用户编号',
  `username` varchar(255) NOT NULL COMMENT '用户名称',
  `password` varchar(255) NOT NULL COMMENT '用户密码',
  `modified` int NOT NULL COMMENT '更新时间',
  `created` int NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user-module/loginuser` (`userid`, `username`, `password`, `modified`, `created`) VALUES
('P42SbhL_pRLqXdyPC_6yGprJZmR4_Ipx',	'admin',	'123qwe',	0,	0);

DROP TABLE IF EXISTS `user-module/mainuser`;
CREATE TABLE `user-module/mainuser` (
  `userid` varchar(255) NOT NULL COMMENT '用户编码',
  `avatar` text NOT NULL COMMENT '用户头像',
  `nickname` varchar(255) NOT NULL COMMENT '用户昵称',
  `binds` text NOT NULL COMMENT '绑定数据',
  `links` text NOT NULL COMMENT '链接数据',
  `created` int NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user-module/mainuser` (`userid`, `avatar`, `nickname`, `binds`, `links`, `created`) VALUES
('P42SbhL_pRLqXdyPC_6yGprJZmR4_Ipx',	'',	'admin',	'[\"loginuser\"]',	'[\"GATEIO.endpoint\"]',	1650423644);

-- 2022-05-04 04:00:31