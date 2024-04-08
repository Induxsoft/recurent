CREATE TABLE IF NOT EXISTS `globalvar` (
  `Sys_PK` int(11) NOT NULL AUTO_INCREMENT,
  `Sys_TimeStamp` datetime NOT NULL,
  `Sys_GUID` varchar(32) NOT NULL,
  `Sys_DTCreated` datetime DEFAULT NULL,
  `Sys_User` varchar(5) DEFAULT NULL,
  `Sys_LastUser` varchar(5) DEFAULT NULL,
  `Sys_Exported` tinyint(1) DEFAULT NULL,
  `Sys_DTExported` datetime DEFAULT NULL,
  `Sys_Info` varchar(32) DEFAULT NULL,
  `VarDefault` varchar(255) DEFAULT NULL,
  `VarName` varchar(32) NOT NULL,
  `VarValue` varchar(32000) DEFAULT NULL,
  `sys_recver` int(11) DEFAULT '0',
  `sys_deleted` bit(1) DEFAULT NULL,
  `sys_lock` int(11) DEFAULT NULL,
  PRIMARY KEY (`Sys_PK`),
  UNIQUE KEY `Sys_GUID` (`Sys_GUID`),
  UNIQUE KEY `VarName` (`VarName`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=latin1;

