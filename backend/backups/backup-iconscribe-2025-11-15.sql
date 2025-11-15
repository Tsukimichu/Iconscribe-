-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: iconscribe
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attribute_options`
--

DROP TABLE IF EXISTS `attribute_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attribute_options` (
  `option_id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_name` varchar(150) NOT NULL,
  `option_value` varchar(100) NOT NULL,
  PRIMARY KEY (`option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_options`
--

LOCK TABLES `attribute_options` WRITE;
/*!40000 ALTER TABLE `attribute_options` DISABLE KEYS */;
INSERT INTO `attribute_options` VALUES (1,'Binding Type','Perfect Binding'),(2,'Binding Type','Saddle Stitch'),(3,'Binding Type','Hardcover'),(4,'Binding Type','Spiral'),(5,'Binding Type','Ring Binding'),(6,'Paper Type','Matte'),(7,'Paper Type','Glossy'),(8,'Paper Type','Bond Paper'),(9,'Paper Type','Book Paper'),(10,'Binding Type','Perfect Binding'),(11,'Binding Type','Saddle Stitch'),(12,'Binding Type','Hard Cover'),(13,'Binding Type','Saddle'),(14,'Paper Type','Matte'),(15,'Paper Type','Glossy'),(16,'Paper Type','Book Paper'),(17,'Cover Finish','Matte'),(18,'Cover Finish','Glossy'),(19,'Cover Finish','Soft Touch'),(20,'Color Printing','Full Color'),(21,'Color Printing','Black & White'),(22,'Color Printing','Mixed'),(23,'Calendar Type','Single month (12 pages)'),(24,'Calendar Type','Double month (6 pages)'),(25,'Calendar Size','11x17'),(26,'Calendar Size','17x22'),(27,'Calendar Size','22x34'),(28,'Calendar Size','8.5x14'),(29,'Size','2” x 3.5” (Standard)'),(30,'Size','Custom Size'),(31,'Design Options','Customize Design'),(32,'Design Options','Upload Your Design'),(33,'Flyer Size','A4'),(34,'Flyer Size','A5'),(35,'Flyer Size','DL'),(36,'Flyer Size','Custom'),(37,'Lamination','UV'),(38,'Lamination','Plastic'),(39,'Lamination','Matte'),(40,'Lamination','3D'),(41,'Size','5x7\"'),(42,'Size','4x6\"'),(43,'Size','Custom'),(44,'Paper Type','Carbonized'),(45,'Paper Type','Colored'),(46,'Paper Type','Plain'),(47,'Print Method','Computer Printout'),(48,'Print Method','Offset Machine'),(49,'Size','2x2\"'),(50,'Size','3x3\"'),(51,'Size','Custom'),(52,'Color','Black and White'),(53,'Color','Full Colored'),(54,'Layout','Single Page'),(55,'Layout','Multi-Page'),(56,'Size','Letter (8.5\"x11\")'),(57,'Size','Legal (8.5\"x14\")'),(58,'Booklet Finish','Padded'),(59,'Booklet Finish','Stapled'),(60,'Booklet Finish','Loose'),(61,'Size','Half Page'),(62,'Size','Full Page'),(63,'Poster Size','A3'),(64,'Poster Size','A2'),(65,'Poster Size','A1'),(66,'Poster Size','Custom'),(67,'With Stub','Yes'),(68,'With Stub','No'),(69,'Book Size','A4 (210 x 297 mm)'),(70,'Book Size','Trade Paperback (13 x 20 cm)'),(71,'Book Size','5.5\" x 8.5\" (13.97 x 21.59 cm)'),(72,'Book Size','6\" x 9\" (15.24 x 22.86 cm)'),(73,'Book Size','5\" x 8\" (12.7 x 20.32 cm)'),(74,'Book Type','Yearbook'),(75,'Book Type','Coffee Table Book'),(76,'Book Type','Souvenir Program');
/*!40000 ALTER TABLE `attribute_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backup_history`
--

DROP TABLE IF EXISTS `backup_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backup_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `scope` varchar(50) DEFAULT 'All',
  `size` varchar(50) DEFAULT NULL,
  `status` enum('Success','Failed') DEFAULT 'Success',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup_history`
--

LOCK TABLES `backup_history` WRITE;
/*!40000 ALTER TABLE `backup_history` DISABLE KEYS */;
INSERT INTO `backup_history` VALUES (3,'backup-2025-11-15T13-09-19-892Z.sql','All','0.29 MB','Success','2025-11-15 21:09:20');
/*!40000 ALTER TABLE `backup_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conversations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) NOT NULL,
  `managerId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (11,6,10,'2025-11-03 09:56:38'),(13,11,10,'2025-11-03 10:08:10'),(15,12,10,'2025-11-03 15:36:55'),(16,12,10,'2025-11-03 15:36:55'),(17,10,10,'2025-11-03 15:37:30'),(18,9,10,'2025-11-03 15:54:30'),(19,14,10,'2025-11-04 07:21:36'),(20,14,10,'2025-11-04 07:21:36'),(21,20,10,'2025-11-07 07:54:13'),(22,20,10,'2025-11-07 07:54:13'),(23,21,10,'2025-11-07 08:13:56'),(24,1,10,'2025-11-11 17:13:48'),(25,30,10,'2025-11-15 08:18:39'),(26,30,10,'2025-11-15 08:18:40');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenance` (
  `maintenance_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `is_maintenance_mode` tinyint(1) NOT NULL DEFAULT 0,
  `message` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_time` datetime DEFAULT NULL,
  `show_countdown` tinyint(1) DEFAULT 0,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  PRIMARY KEY (`maintenance_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (1,9,1,'','2025-11-02 14:12:39',NULL,0,NULL),(2,9,0,'','2025-11-02 14:12:51',NULL,0,NULL);
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversationId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `text` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `conversationId` (`conversationId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (23,11,6,'dsa','2025-11-03 10:07:13'),(26,13,11,'sad','2025-11-03 10:09:20'),(27,13,11,'ad','2025-11-03 10:09:32'),(29,13,10,'da','2025-11-03 10:09:40'),(30,19,14,'hello','2025-11-04 07:24:03'),(31,19,10,'hello','2025-11-04 07:24:18'),(32,11,6,'hello','2025-11-06 05:04:02'),(33,11,10,'hello','2025-11-06 05:04:14'),(34,13,11,'dfdsa','2025-11-11 05:22:56'),(35,13,10,'sddsaf','2025-11-11 05:23:01'),(36,13,10,'fsdfs','2025-11-11 10:52:04'),(37,13,11,'hello','2025-11-11 12:20:19'),(38,13,10,'sdf','2025-11-11 12:21:10'),(39,13,11,'hello','2025-11-11 13:36:27'),(40,13,11,'sda','2025-11-14 15:24:14'),(41,13,10,'dsad','2025-11-14 15:24:27'),(42,13,10,'hello','2025-11-15 05:22:26'),(43,13,11,'hello','2025-11-15 05:22:38');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item_attributes`
--

DROP TABLE IF EXISTS `order_item_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_item_attributes` (
  `order_item_attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_id` int(11) NOT NULL,
  `attribute_name` varchar(255) NOT NULL,
  `attribute_value` varchar(255) NOT NULL,
  PRIMARY KEY (`order_item_attribute_id`),
  KEY `fk_order_item_attributes_orderitems` (`order_item_id`),
  CONSTRAINT `fk_order_item_attributes_orderitems` FOREIGN KEY (`order_item_id`) REFERENCES `orderitems` (`order_item_id`) ON DELETE CASCADE,
  CONSTRAINT `order_item_attributes_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `orderitems` (`order_item_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=967 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item_attributes`
--

LOCK TABLES `order_item_attributes` WRITE;
/*!40000 ALTER TABLE `order_item_attributes` DISABLE KEYS */;
INSERT INTO `order_item_attributes` VALUES (1,21,'PageCount','50'),(2,21,'BindingType','Perfect Binding'),(3,21,'PaperType','Matte'),(4,21,'Notes',''),(5,22,'PageCount','60'),(6,22,'BindingType','Ring Binding'),(7,22,'PaperType','Glossy'),(8,22,'Notes',''),(9,23,'Number of Copies','250'),(10,23,'Number of Pages','100'),(11,23,'Binding Type',''),(12,23,'Paper Type',''),(13,23,'Cover Finish',''),(14,23,'Color Printing',''),(15,23,'Notes',''),(16,24,'PageCount','100'),(17,24,'BindingType','Hardcover'),(18,24,'PaperType','Bond Paper'),(19,24,'Notes','hello'),(20,25,'Number of Copies','200'),(21,25,'Number of Pages','300'),(22,25,'Binding Type',''),(23,25,'Paper Type',''),(24,25,'Cover Finish',''),(25,25,'Color Printing',''),(26,25,'Notes',''),(27,26,'Number of Copies','1000'),(28,26,'Number of Pages','300'),(29,26,'Binding Type',''),(30,26,'Paper Type',''),(31,26,'Cover Finish',''),(32,26,'Color Printing',''),(33,26,'Notes',''),(34,27,'PageCount','300'),(35,27,'BindingType','Saddle Stitch'),(36,27,'PaperType','Bond Paper'),(37,27,'Notes',''),(38,28,'PageCount','80'),(39,28,'BindingType','Saddle Stitch'),(40,28,'PaperType','Matte'),(41,28,'Notes',''),(42,29,'Customization','No'),(43,29,'Number of copies','1200'),(44,29,'Size','22”x34”'),(45,29,'Type of paper','Matte'),(46,29,'Colored','Yes'),(47,29,'Lamination','Single Month (12 pages)'),(48,29,'Print','Back to back'),(49,29,'Message',''),(50,30,'Color','Single Colored'),(51,30,'Calendar Type','Double Month (6 pages)'),(52,30,'Size','81/2”x14”'),(53,31,'Name','Aaron Oriasel'),(54,31,'Email','aaron@gmail.com'),(55,31,'Address','Bantay, Boac, Marinduque'),(56,31,'Phone','09321223551'),(57,31,'Business','MOTOS'),(58,31,'Number of Cards','120'),(59,31,'Size','2” x 3.5” (Standard)'),(60,31,'Type of Paper','Glossy'),(61,31,'Color',''),(62,31,'Lamination',''),(63,31,'Print','Single side'),(64,31,'Message',''),(65,32,'Name','Aaron Oriasel'),(66,32,'Email','aaron@gmail.com'),(67,32,'Address','Bantay, Boac, Marinduque'),(68,32,'Phone','09321223551'),(69,32,'Business','MOTOS'),(70,32,'Number of Cards','120'),(71,32,'Size','2” x 3.5” (Standard)'),(72,32,'Type of Paper','Glossy'),(73,32,'Color',''),(74,32,'Lamination',''),(75,32,'Print','Single side'),(76,32,'Message',''),(77,33,'Color','Single Colored'),(78,33,'Calendar Type','Single Month (12 pages)'),(79,33,'Size','11”x17”'),(80,34,'Name','Aaron Oriasel'),(81,34,'Email','aaron@gmail.com'),(82,34,'Address','Bantay, Boac, Marinduque'),(83,34,'Phone','09321223551'),(84,34,'Number of Copies','1200'),(85,34,'Size','A4'),(86,34,'Paper Type','Glossy'),(87,34,'Color','Yes'),(88,34,'Lamination','Matte'),(89,34,'Print','Single side'),(90,34,'Message',''),(91,35,'Name','Aaron Oriasel'),(92,35,'Email','aaron@gmail.com'),(93,35,'Address','Bantay, Boac, Marinduque'),(94,35,'Phone','09321223551'),(95,35,'Event Name','Wedding '),(96,35,'Size','5x7 inches'),(97,35,'Paper Type','Colored'),(98,35,'Print Method','Computer Printout'),(99,35,'Message','Hello'),(100,36,'Name','Joshua Valenzuela'),(101,36,'Email','joshua@gmail.com'),(102,36,'Address','Mahunig, Gasan, Marinduque'),(103,36,'Phone','09083705595'),(104,36,'Size','2” x 2”'),(105,36,'Paper Type','Glossy'),(106,36,'Message',''),(107,37,'Name','Joshua Valenzuela'),(108,37,'Email','joshua@gmail.com'),(109,37,'Address','Mahunig, Gasan, Marinduque'),(110,37,'Phone','09083705595'),(111,37,'Size','2” x 2”'),(112,37,'Paper Type','Matte'),(113,37,'Message',''),(114,38,'Name','Anthony Portento'),(115,38,'Email','anthony@gmail.com'),(116,38,'Address','Mongpong, Sta. Cruz, Marinduque'),(117,38,'Phone','9321223551'),(118,38,'BusinessName',''),(119,38,'Quantity','1210'),(120,38,'Size','A5'),(121,38,'Paper Type',''),(122,38,'Layout','Single Page'),(123,38,'Message',''),(124,39,'Name','Anthony Portento'),(125,39,'Email','anthony@gmail.com'),(126,39,'Address','Mongpong, Sta. Cruz, Marinduque'),(127,39,'Phone','9321223551'),(128,39,'BusinessName','Motox'),(129,39,'Quantity','120'),(130,39,'Size','A4'),(131,39,'Paper Type',''),(132,39,'Layout','Multi-Page'),(133,39,'Message',''),(134,40,'Name','Anthony Portento'),(135,40,'Email','anthony@gmail.com'),(136,40,'Address','Mongpong, Sta. Cruz, Marinduque'),(137,40,'Phone','9321223551'),(138,40,'Business','motorX'),(139,40,'Number of copies (min)','150'),(140,40,'Paper Type','Carbonized'),(141,40,'Booklet Finish','Stapled'),(142,40,'Size','Half Page'),(143,40,'Message',''),(144,41,'Name','Anthony Portento'),(145,41,'Email','anthony@gmail.com'),(146,41,'Address','Mongpong, Sta. Cruz, Marinduque'),(147,41,'Phone','9321223551'),(148,41,'Number of Posters (min)','1000'),(149,41,'Size','A2'),(150,41,'Paper Type','Matte'),(151,41,'Lamination','Matte'),(152,41,'Color','Black & White'),(153,41,'Message',''),(154,42,'Name','Aaron Oriasel'),(155,42,'Email','aaron@gmail.com'),(156,42,'Address','Bantay, Boac, Marinduque'),(157,42,'Phone','09321223551'),(158,42,'Number of Posters (min)','1000'),(159,42,'Size','A3'),(160,42,'Paper Type','Matte'),(161,42,'Lamination','Matte'),(162,42,'Color','Full Color'),(163,42,'Message',''),(164,43,'Name','Aaron Oriasel'),(165,43,'Email','aaron@gmail.com'),(166,43,'Address','Bantay, Boac, Marinduque'),(167,43,'Phone','09321223551'),(168,43,'Businessname','MOTOS'),(169,43,'Number of Tickets (min)','55'),(170,43,'Size','2” x 5” (Standard)'),(171,43,'With Stub','Yes'),(172,43,'Message',''),(173,44,'Color','Single Colored'),(174,44,'Calendar Type','Single Month (12 pages)'),(175,44,'Size','11”x17”'),(176,45,'Name','Aaron Oriasel'),(177,45,'Email','aaron@gmail.com'),(178,45,'Address','Bantay, Boac, Marinduque'),(179,45,'Phone','09321223551'),(180,45,'Number of Posters (min)','110'),(181,45,'Size','A3'),(182,45,'Paper Type','Matte'),(183,45,'Lamination','Gloss'),(184,45,'Color','Full Color'),(185,45,'Message',''),(186,46,'PageCount','100'),(187,46,'BindingType','Saddle Stitch'),(188,46,'PaperType','Bond Paper'),(189,46,'Notes',''),(190,47,'Color','Single Colored'),(191,47,'Calendar Type','Single Month (12 pages)'),(192,47,'Size','11”x17”'),(193,48,'Name','Joshua Valenzuela'),(194,48,'Email','joshua@gmail.com'),(195,48,'Address','Mahunig, Gasan, Marinduque'),(196,48,'Phone','09083705595'),(197,48,'Number of Copies','1500'),(198,48,'Size','A4'),(199,48,'Paper Type','Glossy'),(200,48,'Color','Yes'),(201,48,'Lamination','Matte'),(202,48,'Print','Single side'),(203,48,'Message',''),(204,49,'PageCount','100'),(205,49,'BindingType','Perfect Binding'),(206,49,'PaperType','Matte'),(207,49,'Notes',''),(208,50,'Name','Joshua Valenzuela'),(209,50,'Email','joshua@gmail.com'),(210,50,'Address','Mahunig, Gasan, Marinduque'),(211,50,'Phone','09083705595'),(212,50,'Businessname','GadgetY'),(213,50,'Number of Tickets (min)','90'),(214,50,'Size','2” x 5” (Standard)'),(215,50,'With Stub','Yes'),(216,50,'Message',''),(217,51,'PageCount','100'),(218,51,'BindingType','Perfect Binding'),(219,51,'PaperType','Bond Paper'),(220,51,'Notes',''),(221,52,'PageCount','200'),(222,52,'BindingType','Perfect Binding'),(223,52,'PaperType','Bond Paper'),(224,52,'Notes',''),(225,53,'Number of Pages','100'),(226,53,'Binding Type',''),(227,53,'Paper Type',''),(228,53,'Cover Finish',''),(229,53,'Color Printing',''),(230,53,'Additional Notes',''),(231,54,'PageCount','300'),(232,54,'BindingType','Saddle Stitch'),(233,54,'PaperType','Glossy'),(234,54,'Notes',''),(235,55,'PageCount','100'),(236,55,'BindingType','Saddle Stitch'),(237,55,'PaperType','Bond Paper'),(238,55,'Notes',''),(239,56,'PageCount','190'),(240,56,'BindingType','Saddle Stitch'),(241,56,'PaperType','Glossy'),(242,56,'Notes',''),(243,57,'PageCount','90'),(244,57,'BindingType','Saddle Stitch'),(245,57,'PaperType','Glossy'),(246,57,'Notes',''),(247,58,'PageCount','100'),(248,58,'BindingType','Perfect Binding'),(249,58,'PaperType','Bond Paper'),(250,58,'Notes',''),(251,59,'PageCount','50'),(252,59,'BindingType','Perfect Binding'),(253,59,'PaperType','Glossy'),(254,59,'Notes',''),(255,60,'PageCount','80'),(256,60,'BindingType','Saddle Stitch'),(257,60,'PaperType','Bond Paper'),(258,60,'Notes',''),(259,61,'PageCount','11'),(260,61,'BindingType','Saddle Stitch'),(261,61,'PaperType','Bond Paper'),(262,61,'Notes',''),(263,62,'PageCount','200'),(264,62,'BindingType','Saddle Stitch'),(265,62,'PaperType','Bond Paper'),(266,62,'Notes',''),(267,63,'PageCount','50'),(268,63,'BindingType','Saddle Stitch'),(269,63,'PaperType','Bond Paper'),(270,63,'Notes',''),(271,64,'PageCount','10'),(272,64,'BindingType','Spiral'),(273,64,'PaperType','Bond Paper'),(274,64,'Notes',''),(275,65,'PageCount','200'),(276,65,'BindingType','Saddle Stitch'),(277,65,'PaperType','Glossy'),(278,65,'Notes',''),(279,66,'PageCount','232'),(280,66,'BindingType','Hardcover'),(281,66,'PaperType','Book Paper'),(282,66,'Notes',''),(283,67,'PageCount','123'),(284,67,'BindingType','Saddle Stitch'),(285,67,'PaperType','Book Paper'),(286,67,'Notes',''),(287,68,'PageCount','123'),(288,68,'BindingType','Hardcover'),(289,68,'PaperType','Glossy'),(290,68,'Notes',''),(291,69,'PageCount','111'),(292,69,'BindingType','Hardcover'),(293,69,'PaperType','Bond Paper'),(294,69,'Notes',''),(295,70,'Number of Pages','100'),(296,70,'Binding Type',''),(297,70,'Paper Type',''),(298,70,'Cover Finish',''),(299,70,'Color Printing',''),(300,70,'Additional Notes',''),(301,71,'Number of Pages','111'),(302,71,'Binding Type',''),(303,71,'Paper Type',''),(304,71,'Cover Finish',''),(305,71,'Color Printing',''),(306,71,'Additional Notes',''),(307,72,'Number of Pages','121'),(308,72,'Binding Type','Hardcover'),(309,72,'Paper Type','Book Paper'),(310,72,'Cover Finish','Matte'),(311,72,'Color Printing','Full Color'),(312,72,'Additional Notes',''),(313,73,'Number of Pages','31'),(314,73,'Binding Type','Hardcover'),(315,73,'Paper Type','Glossy'),(316,73,'Cover Finish','Glossy'),(317,73,'Color Printing','Black & White'),(318,73,'Additional Notes',''),(319,74,'Number of Pages','111'),(320,74,'Binding Type','Perfect Binding'),(321,74,'Paper Type','Glossy'),(322,74,'Cover Finish','Matte'),(323,74,'Color Printing','Full Color'),(324,74,'Additional Notes',''),(325,75,'PageCount','12'),(326,75,'BindingType','Perfect Binding'),(327,75,'PaperType','Glossy'),(328,75,'Notes',''),(329,76,'Number of Pages','111'),(330,76,'Binding Type','Saddle Stitch'),(331,76,'Paper Type','Glossy'),(332,76,'Cover Finish','Glossy'),(333,76,'Color Printing','Full Color'),(334,76,'Additional Notes',''),(335,77,'PageCount','123'),(336,77,'BindingType','Perfect Binding'),(337,77,'PaperType','Bond Paper'),(338,77,'Notes',''),(339,78,'PageCount','2141'),(340,78,'BindingType','Perfect Binding'),(341,78,'PaperType','Glossy'),(342,78,'Notes',''),(343,79,'PageCount','123'),(344,79,'BindingType','Hardcover'),(345,79,'PaperType','Book Paper'),(346,79,'Notes',''),(347,80,'PageCount','123'),(348,80,'BindingType','Hardcover'),(349,80,'PaperType','Book Paper'),(350,80,'Notes',''),(351,81,'PageCount','123'),(352,81,'BindingType','Hardcover'),(353,81,'PaperType','Book Paper'),(354,81,'Notes',''),(355,82,'PageCount','123'),(356,82,'BindingType','Hardcover'),(357,82,'PaperType','Book Paper'),(358,82,'Notes',''),(359,83,'PageCount','123'),(360,83,'BindingType','Hardcover'),(361,83,'PaperType','Book Paper'),(362,83,'Notes',''),(363,84,'PageCount','123'),(364,84,'BindingType','Hardcover'),(365,84,'PaperType','Book Paper'),(366,84,'Notes',''),(367,85,'PageCount','123'),(368,85,'BindingType','Hardcover'),(369,85,'PaperType','Book Paper'),(370,85,'Notes',''),(371,86,'PageCount','21'),(372,86,'BindingType','Perfect Binding'),(373,86,'PaperType','Glossy'),(374,86,'Notes',''),(375,87,'PageCount','213'),(376,87,'BindingType','Saddle Stitch'),(377,87,'PaperType','Glossy'),(378,87,'Notes',''),(379,88,'PageCount','213'),(380,88,'BindingType','Saddle Stitch'),(381,88,'PaperType','Glossy'),(382,88,'Notes',''),(383,89,'PageCount','213'),(384,89,'BindingType','Saddle Stitch'),(385,89,'PaperType','Glossy'),(386,89,'Notes',''),(387,90,'PageCount','21'),(388,90,'BindingType','Saddle Stitch'),(389,90,'PaperType','Glossy'),(390,90,'Notes',''),(391,91,'PageCount','21'),(392,91,'BindingType','Saddle Stitch'),(393,91,'PaperType','Glossy'),(394,91,'Notes',''),(395,92,'Number of Pages','22'),(396,92,'Binding Type','Hardcover'),(397,92,'Paper Type','Glossy'),(398,92,'Cover Finish','Glossy'),(399,92,'Color Printing','Black & White'),(400,92,'Additional Notes',''),(401,93,'PageCount','23'),(402,93,'BindingType','Saddle Stitch'),(403,93,'PaperType','Glossy'),(404,93,'Notes',''),(405,94,'Number of Pages','23'),(406,94,'Binding Type','Perfect Binding'),(407,94,'Paper Type','Book Paper'),(408,94,'Cover Finish','Matte'),(409,94,'Color Printing','Mixed'),(410,94,'Additional Notes',''),(411,95,'Number of Pages','23'),(412,95,'Binding Type','Perfect Binding'),(413,95,'Paper Type','Book Paper'),(414,95,'Cover Finish','Matte'),(415,95,'Color Printing','Mixed'),(416,95,'Additional Notes',''),(417,96,'Number of Pages','23'),(418,96,'Binding Type','Saddle Stitch'),(419,96,'Paper Type','Glossy'),(420,96,'Cover Finish','Matte'),(421,96,'Color Printing','Full Color'),(422,96,'Additional Notes',''),(423,97,'Number of Pages','23'),(424,97,'Binding Type','Saddle Stitch'),(425,97,'Paper Type','Glossy'),(426,97,'Cover Finish','Matte'),(427,97,'Color Printing','Black & White'),(428,97,'Additional Notes',''),(429,98,'Number of Pages','213'),(430,98,'Binding Type','Saddle Stitch'),(431,98,'Paper Type','Book Paper'),(432,98,'Cover Finish','Soft Touch'),(433,98,'Color Printing','Mixed'),(434,98,'Additional Notes',''),(435,99,'Number of Pages','111'),(436,99,'Binding Type','Perfect Binding'),(437,99,'Paper Type','Matte'),(438,99,'Cover Finish','Glossy'),(439,99,'Color Printing','Full Color'),(440,99,'Additional Notes',''),(441,100,'PageCount','333'),(442,100,'BindingType','Hardcover'),(443,100,'PaperType','Glossy'),(444,100,'Notes',''),(445,101,'Number of Pages','44'),(446,101,'Binding Type','Hardcover'),(447,101,'Paper Type','Glossy'),(448,101,'Cover Finish','Glossy'),(449,101,'Color Printing','Black & White'),(450,101,'Additional Notes',''),(451,102,'PageCount','44'),(452,102,'BindingType','Saddle Stitch'),(453,102,'PaperType','Glossy'),(454,102,'Notes',''),(455,103,'Customization','No'),(456,103,'Number of copies','1245'),(457,103,'Size','17”x22”'),(458,103,'Type of paper','Glossy'),(459,103,'Colored','Yes'),(460,103,'Lamination','Single Month (12 pages)'),(461,103,'Print','Back to back'),(462,103,'Message',''),(463,104,'Customization','No'),(464,104,'Color','More Than 1 Color'),(465,104,'Calendar Type','Single Month (12 pages)'),(466,104,'Size','11”x17”'),(467,105,'Customization','No'),(468,105,'Name','Joshua Valenzuela'),(469,105,'Email','joshua@gmail.com'),(470,105,'Address','Mahunig, Gasan, Marinduque'),(471,105,'Phone','09083705595'),(472,105,'Business','GadgetY'),(473,105,'Number of Cards','120'),(474,105,'Size','2” x 3.5” (Standard)'),(475,105,'Type of Paper','Matte'),(476,105,'Color',''),(477,105,'Lamination',''),(478,105,'Print','Single side'),(479,105,'Message',''),(480,106,'Customization','NO'),(481,106,'Name','Joshua Valenzuela'),(482,106,'Email','joshua@gmail.com'),(483,106,'Address','Mahunig, Gasan, Marinduque'),(484,106,'Phone','09083705595'),(485,106,'Business','GadgetY'),(486,106,'Number of Cards','100'),(487,106,'Size','2” x 3.5” (Standard)'),(488,106,'Type of Paper','Matte'),(489,106,'Color',''),(490,106,'Lamination',''),(491,106,'Print','Single side'),(492,106,'Message',''),(493,107,'Customization','NO'),(494,107,'Name','Joshua Valenzuela'),(495,107,'Email','joshua@gmail.com'),(496,107,'Address','Mahunig, Gasan, Marinduque'),(497,107,'Phone','09083705595'),(498,107,'Business','GadgetY'),(499,107,'Number of Cards','130'),(500,107,'Size','2” x 3.5” (Standard)'),(501,107,'Type of Paper','Matte'),(502,107,'Color',''),(503,107,'Lamination',''),(504,107,'Print','Single side'),(505,107,'Message',''),(506,108,'Customization','No'),(507,108,'Size','A5'),(508,108,'Color','Yes'),(509,108,'Paper','Matte'),(510,108,'Message',''),(511,109,'Name','Aaron Oriasel'),(512,109,'Email','aaron@gmail.com'),(513,109,'Address','Bantay, Boac, Marinduque'),(514,109,'Phone','09321223551'),(515,109,'Event Name','2214qwe'),(516,109,'Size','5x7 inches'),(517,109,'Paper Type','Colored'),(518,109,'Print Method','Computer Printout'),(519,109,'Message',''),(520,110,'Name','Aaron Oriasel'),(521,110,'Email','aaron@gmail.com'),(522,110,'Address','Bantay, Boac, Marinduque'),(523,110,'Phone','09321223551'),(524,110,'Size','3” x 3”'),(525,110,'Paper Type','Glossy'),(526,110,'Message',''),(527,111,'Name','Aaron Oriasel'),(528,111,'Email','aaron@gmail.com'),(529,111,'Address','Bantay, Boac, Marinduque'),(530,111,'Phone','09321223551'),(531,111,'Business','Business'),(532,111,'Quantity','210'),(533,111,'Size','A5'),(534,111,'Paper Type','Black & White'),(535,111,'Layout','Single Page'),(536,111,'Message',''),(537,112,'Name','Aaron Oriasel'),(538,112,'Email','aaron@gmail.com'),(539,112,'Address','Bantay, Boac, Marinduque'),(540,112,'Phone','09321223551'),(541,112,'Business','MOTOS'),(542,112,'Number of copies (min)','120'),(543,112,'Paper Type','Carbonized'),(544,112,'Booklet Finish','Padded'),(545,112,'Size','A4'),(546,112,'Message',''),(547,113,'Name','Aaron Oriasel'),(548,113,'Email','aaron@gmail.com'),(549,113,'Address','Bantay, Boac, Marinduque'),(550,113,'Phone','09321223551'),(551,113,'Business','MOTOS'),(552,113,'Number of copies (min)','120'),(553,113,'Paper Type','Carbonized'),(554,113,'Booklet Finish','Padded'),(555,113,'Size','A5'),(556,113,'Message',''),(557,114,'Name','Aaron Oriasel'),(558,114,'Email','aaron@gmail.com'),(559,114,'Address','Bantay, Boac, Marinduque'),(560,114,'Phone','09321223551'),(561,114,'Business','MOTOS'),(562,114,'Number of copies (min)','120'),(563,114,'Paper Type','Carbonized'),(564,114,'Booklet Finish','Padded'),(565,114,'Size','A5'),(566,114,'Message',''),(567,115,'Name','Aaron Oriasel'),(568,115,'Email','aaron@gmail.com'),(569,115,'Address','Bantay, Boac, Marinduque'),(570,115,'Phone','09321223551'),(571,115,'Business','MOTOS'),(572,115,'Number of copies (min)','120'),(573,115,'Paper Type','Carbonized'),(574,115,'Booklet Finish','Stapled'),(575,115,'Size','Half Page'),(576,115,'Message',''),(577,116,'Name','Joshua Valenzuela'),(578,116,'Email','joshua@gmail.com'),(579,116,'Address','Mahunig, Gasan, Marinduque'),(580,116,'Phone','09083705595'),(581,116,'Business','MOTOS'),(582,116,'Number of copies (min)','100'),(583,116,'Paper Type','Carbonized'),(584,116,'Booklet Finish','Padded'),(585,116,'Size','A5'),(586,116,'Message',''),(587,117,'Name','Joshua Valenzuela'),(588,117,'Email','joshua@gmail.com'),(589,117,'Address','Mahunig, Gasan, Marinduque'),(590,117,'Phone','09083705595'),(591,117,'Number of Posters (min)','100'),(592,117,'Size','A3'),(593,117,'Paper Type','Matte'),(594,117,'Lamination','Matte'),(595,117,'Color','Full Color'),(596,117,'Customization','No'),(597,117,'Message',''),(598,118,'Name','Joshua Valenzuela'),(599,118,'Email','joshua@gmail.com'),(600,118,'Address','Mahunig, Gasan, Marinduque'),(601,118,'Phone','09083705595'),(602,118,'Businessname','GadgetY'),(603,118,'Number of Tickets','55'),(604,118,'Size','2” x 5” (Standard)'),(605,118,'With Stub','Yes'),(606,118,'Message',''),(607,119,'PageCount','111'),(608,119,'BindingType','Saddle Stitch'),(609,119,'PaperType','Glossy'),(610,119,'Notes',''),(611,120,'PageCount','11'),(612,120,'BindingType','Perfect Binding'),(613,120,'PaperType','Bond Paper'),(614,120,'Notes',''),(615,121,'PageCount','111'),(616,121,'BindingType','Saddle Stitch'),(617,121,'PaperType','Glossy'),(618,121,'Notes',''),(619,122,'PageCount','11'),(620,122,'BindingType','Saddle Stitch'),(621,122,'PaperType','Glossy'),(622,122,'Notes',''),(623,123,'PageCount','111'),(624,123,'BindingType','Hardcover'),(625,123,'PaperType','Bond Paper'),(626,123,'Notes',''),(627,124,'PageCount','111'),(628,124,'BindingType','Saddle Stitch'),(629,124,'PaperType','Matte'),(630,124,'Notes',''),(631,125,'PageCount','111'),(632,125,'BindingType','Saddle Stitch'),(633,125,'PaperType','Glossy'),(634,125,'Notes',''),(635,126,'PageCount','111'),(636,126,'BindingType','Hardcover'),(637,126,'PaperType','Bond Paper'),(638,126,'Notes',''),(639,127,'Number of Pages','111'),(640,127,'Binding Type','Hardcover'),(641,127,'Paper Type','Glossy'),(642,127,'Cover Finish','Glossy'),(643,127,'Color Printing','Black & White'),(644,127,'Additional Notes',''),(645,128,'Name','Joshua Valenzuela'),(646,128,'Email','joshua@gmail.com'),(647,128,'Address','Mahunig, Gasan, Marinduque'),(648,128,'Phone','09083705595'),(649,128,'Size','3” x 3”'),(650,128,'Paper Type','Transparent'),(651,128,'Message',''),(652,129,'PageCount','111'),(653,129,'BindingType','Saddle Stitch'),(654,129,'PaperType','Bond Paper'),(655,129,'Notes','asds'),(656,130,'PageCount','212'),(657,130,'BindingType','Perfect Binding'),(658,130,'PaperType','Bond Paper'),(659,130,'Notes',''),(660,134,'Page Count','44'),(661,134,'Binding Type','Spiral'),(662,134,'Paper Type','Book Paper'),(663,136,'Number of Pages','300'),(664,136,'Binding Type','Saddle Stitch'),(665,136,'Paper Type','Glossy'),(666,136,'Cover Finish','Glossy'),(667,136,'Color Printing','Black & White'),(668,137,'Number of Pages','122'),(669,137,'Binding Type','Saddle Stitch'),(670,137,'Paper Type','Glossy'),(671,137,'Cover Finish','Glossy'),(672,137,'Color Printing','Mixed'),(673,138,'Number of Pages','44'),(674,138,'Binding Type','Saddle Stitch'),(675,138,'Paper Type','Book Paper'),(676,138,'Cover Finish','Glossy'),(677,138,'Color Printing','Mixed'),(678,139,'Page Count','41'),(679,139,'Binding Type','Hardcover'),(680,139,'Paper Type','Bond Paper'),(681,140,'Number of Pages','42'),(682,140,'Binding Type','Perfect Binding'),(683,140,'Paper Type','Book Paper'),(684,140,'Cover Finish','Glossy'),(685,140,'Color Printing','Black & White'),(686,142,'Number of Pages','50'),(687,142,'Binding Type','Perfect Binding'),(688,142,'Paper Type','Book Paper'),(689,142,'Cover Finish','Matte'),(690,142,'Color Printing','Mixed'),(691,143,'Customization','No'),(692,143,'Number of Copies','1200'),(693,143,'Size','8.5”x14”'),(694,143,'Type of Paper','Glossy'),(695,143,'Colored','No'),(696,143,'Lamination','Yes'),(697,143,'Print','Back to back'),(698,144,'Customization','No'),(699,144,'Color','Single Colored'),(700,144,'Calendar Type','Single Month (12 pages)'),(701,144,'Size','22”x34”'),(702,145,'Customization','No'),(703,145,'Name','Anthony Portento'),(704,145,'Email','anthony@gmail.com'),(705,145,'Address','Tabo, Boac, Marinduque'),(706,145,'Phone','9321223551'),(707,145,'Business','motorX'),(708,145,'Number of Cards','120'),(709,145,'Size','2” x 3.5” (Standard)'),(710,145,'Type of Paper','Matte'),(711,145,'Print','Single side'),(712,146,'Customization','No'),(713,146,'Flyer Size','A4'),(714,146,'Paper Type','Matte'),(715,146,'Color','Yes'),(716,146,'Lamination','Gloss'),(717,146,'Print','Single side'),(718,147,'Name','Anthony Portento'),(719,147,'Email','anthony@gmail.com'),(720,147,'Address','Tabo, Boac, Marinduque'),(721,147,'Phone','9321223551'),(722,147,'Event Name','Jobert'),(723,147,'Size','5x7 inches'),(724,147,'Paper Type','Carbonized'),(725,147,'Print Method','Computer Printout'),(726,148,'Name','Anthony Portento'),(727,148,'Email','anthony@gmail.com'),(728,148,'Address','Tabo, Boac, Marinduque'),(729,148,'Phone','9321223551'),(730,148,'Size','3” x 3”'),(731,148,'Paper Type','Glossy'),(732,149,'Name','Anthony Portento'),(733,149,'Email','anthony@gmail.com'),(734,149,'Address','Tabo, Boac, Marinduque'),(735,149,'Phone','9321223551'),(736,149,'Business','Icons'),(737,149,'Quantity','120'),(738,149,'Size','A4'),(739,149,'Paper Type','Black & White'),(740,149,'Layout','Single Page'),(741,150,'Name','Anthony Portento'),(742,150,'Email','anthony@gmail.com'),(743,150,'Address','Tabo, Boac, Marinduque'),(744,150,'Phone','9321223551'),(745,150,'Business','Icons'),(746,150,'Quantity','120'),(747,150,'Paper Type','Carbonized'),(748,150,'Booklet Finish','Padded'),(749,150,'Size','Half Page'),(750,151,'Name','Anthony Portento'),(751,151,'Email','anthony@gmail.com'),(752,151,'Address','Tabo, Boac, Marinduque'),(753,151,'Phone','9321223551'),(754,151,'Number of Posters','120'),(755,151,'Size','A3'),(756,151,'Paper Type','Glossy'),(757,151,'Lamination','Matte'),(758,151,'Color','Full Color'),(759,151,'Customization','No'),(760,152,'Name','Anthony Portento'),(761,152,'Email','anthony@gmail.com'),(762,152,'Address','Tabo, Boac, Marinduque'),(763,152,'Phone','9321223551'),(764,152,'Business Name','motorX'),(765,152,'Number of Tickets','55'),(766,152,'Size','2” x 5” (Standard)'),(767,152,'With Stub','Yes'),(768,153,'Page Count','555'),(769,153,'Binding Type','Perfect Binding'),(770,153,'Paper Type','Glossy'),(771,154,'Page Count','55'),(772,154,'Binding Type','Perfect Binding'),(773,154,'Paper Type','Matte'),(774,155,'Page Count','222'),(775,155,'Binding Type','Saddle Stitch'),(776,155,'Paper Type','Matte'),(777,156,'Page Count','213'),(778,156,'Binding Type','Saddle Stitch'),(779,156,'Paper Type','Glossy'),(780,157,'Page Count','23'),(781,157,'Binding Type','Perfect Binding'),(782,157,'Paper Type','Glossy'),(783,158,'Page Count','120'),(784,158,'Binding Type','Perfect Binding'),(785,158,'Paper Type','Glossy'),(786,159,'Number of Pages','12'),(787,159,'Binding Type','Perfect Binding'),(788,159,'Paper Type','Glossy'),(789,159,'Cover Finish','Matte'),(790,159,'Color Printing','Full Color'),(791,160,'Page Count','12'),(792,160,'Binding Type','Saddle Stitch'),(793,160,'Paper Type','Glossy'),(794,161,'Number of Pages','90'),(795,161,'Binding Type','Perfect Binding'),(796,161,'Paper Type','Matte'),(797,161,'Cover Finish','Glossy'),(798,161,'Color Printing','Black & White'),(803,163,'Page Count','100'),(804,163,'Binding Type','Saddle Stitch'),(805,163,'Paper Type','Glossy'),(806,164,'Name','Niel Osinsao'),(807,164,'Email','niel@gmail.com'),(808,164,'Address','agumaymayan, boac Marinduque'),(809,164,'Phone','09833222113'),(810,164,'Business','ICons'),(811,164,'Quantity','100'),(812,164,'Paper Type','Colored Bondpaper'),(813,164,'Booklet Finish','Stapled'),(814,164,'Size','A5'),(815,165,'Page Count','23'),(816,165,'Binding Type','Saddle Stitch'),(817,165,'Paper Type','Bond Paper'),(818,166,'Page Count','12'),(819,166,'Binding Type','Perfect Binding'),(820,166,'Paper Type','Glossy'),(821,167,'Customization','No'),(822,167,'Number of Copies','1000'),(823,167,'Size','22”x34”'),(824,167,'Type of Paper','Book Paper'),(825,167,'Colored','Yes'),(826,167,'Lamination','Yes'),(827,167,'Print','Back to back'),(828,168,'Page Count','100'),(829,168,'Binding Type','Saddle Stitch'),(830,168,'Paper Type','Glossy'),(831,169,'Customization','No'),(832,169,'Number of Copies','1000'),(833,169,'Size','22”x34”'),(834,169,'Type of Paper','Glossy'),(835,169,'Colored','No'),(836,169,'Lamination','Yes'),(837,169,'Print','Back to back'),(838,170,'Customization','No'),(839,170,'Number of Copies','1000'),(840,170,'Size','22”x34”'),(841,170,'Type of Paper','Matte'),(842,170,'Colored','Yes'),(843,170,'Lamination','Yes'),(844,170,'Print','Back to back'),(845,171,'Customization','No'),(846,171,'Number of Copies','1200'),(847,171,'Size','22”x34”'),(848,171,'Type of Paper','Glossy'),(849,171,'Colored','Yes'),(850,171,'Lamination','Yes'),(851,171,'Print','Back to back'),(852,172,'Name','Joshua Valenzuela'),(853,172,'Email','joshua@gmail.com'),(854,172,'Address','Mahunig, Gasan, Marinduque'),(855,172,'Phone','09083705595'),(856,172,'Business Name','GadgetY'),(857,172,'Number of Tickets','100'),(858,172,'Size','2” x 5” (Standard)'),(859,172,'With Stub','Yes'),(860,173,'Number of Pages','200'),(861,173,'Binding Type','Perfect Binding'),(862,173,'Paper Type','Matte'),(863,173,'Cover Finish','Matte'),(864,173,'Color Printing','Full Color'),(865,174,'Customization','No'),(866,174,'Flyer Size','DL'),(867,174,'Paper Type','Premium Card'),(868,174,'Color','No'),(869,174,'Lamination','Matte'),(870,174,'Print','Single side'),(871,175,'Customization','No'),(872,175,'Number of Copies','1000'),(873,175,'Size','22”x34”'),(874,175,'Type of Paper','Matte'),(875,175,'Colored','Yes'),(876,175,'Lamination','Yes'),(877,175,'Print','Back to back'),(878,176,'Name','Joshua Valenzuela'),(879,176,'Email','joshua@gmail.com'),(880,176,'Address','Mahunig, Gasan, Marinduque'),(881,176,'Phone','09083705595'),(882,176,'Event Name','Wedding'),(883,176,'Size','5x7 inches'),(884,176,'Paper Type','Colored'),(885,176,'Print Method','Computer Printout'),(886,177,'Name','manager'),(887,177,'Email','manager@gmail.com'),(888,177,'Address','HQ'),(889,177,'Phone','0'),(890,177,'Event Name','Wedding'),(891,177,'Size','5x7 inches'),(892,177,'Paper Type','Colored'),(893,177,'Print Method','Computer Printout'),(894,178,'Name','Joshua Valenzuela'),(895,178,'Email','joshua@gmail.com'),(896,178,'Address','Mahunig, Gasan, Marinduque'),(897,178,'Phone','09083705595'),(898,178,'Number of Posters','120'),(899,178,'Size','Custom'),(900,178,'Paper Type','Matte'),(901,178,'Lamination','Gloss'),(902,178,'Color','Full Color'),(903,178,'Customization','No'),(904,179,'Customization','No'),(905,179,'Number of Copies','1000'),(906,179,'Size','17”x22”'),(907,179,'Type of Paper','Glossy'),(908,179,'Colored','No'),(909,179,'Lamination','Yes'),(910,179,'Print','Back to back'),(911,180,'Customization','No'),(912,180,'Number of Copies','1000'),(913,180,'Size','22”x34”'),(914,180,'Type of Paper','Matte'),(915,180,'Colored','Yes'),(916,180,'Lamination','Yes'),(917,180,'Print','Back to back'),(918,181,'Number of Pages','100'),(919,181,'Book Type','Souvenir Program'),(920,181,'Binding Type','Saddle Stitch'),(921,181,'Paper Type','Matte'),(922,181,'Book Size','5.5\" x 8.5\" (13.97 x 21.59 cm)'),(923,181,'Cover Finish','Glossy'),(924,181,'Color Printing','Black & White'),(925,182,'Customization','No'),(926,182,'Number of Copies','1000'),(927,182,'Size','22”x34”'),(928,182,'Type of Paper','Glossy'),(929,182,'Colored','Yes'),(930,182,'Lamination','Yes'),(931,182,'Print','Back to back'),(932,183,'Customization','No'),(933,183,'Number of Copies','1000'),(934,183,'Size','22”x34”'),(935,183,'Type of Paper','Glossy'),(936,183,'Colored','No'),(937,183,'Lamination','Yes'),(938,183,'Print','Back to back'),(939,184,'Customization','No'),(940,184,'Number of Copies','1000'),(941,184,'Size','17”x22”'),(942,184,'Type of Paper','Matte'),(943,184,'Colored','Yes'),(944,184,'Lamination','Yes'),(945,184,'Print','Back to back'),(946,185,'Customization','No'),(947,185,'Number of Copies','1000'),(948,185,'Size','17”x22”'),(949,185,'Type of Paper','Matte'),(950,185,'Colored','Yes'),(951,185,'Lamination','Yes'),(952,185,'Print','Back to back'),(953,186,'Customization','No'),(954,186,'Number of Copies','1200'),(955,186,'Size','22”x34”'),(956,186,'Type of Paper','Glossy'),(957,186,'Colored','No'),(958,186,'Lamination','Yes'),(959,186,'Print','Back to back'),(960,187,'Customization','No'),(961,187,'Number of Copies','1000'),(962,187,'Size','17”x22”'),(963,187,'Type of Paper','Matte'),(964,187,'Colored','Yes'),(965,187,'Lamination','Yes'),(966,187,'Print','Back to back');
/*!40000 ALTER TABLE `order_item_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderitems` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `urgency` varchar(50) DEFAULT 'Not Rush',
  `status` varchar(50) DEFAULT 'Pending',
  `file1` varchar(255) DEFAULT NULL,
  `file2` varchar(255) DEFAULT NULL,
  `estimated_price` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
INSERT INTO `orderitems` VALUES (21,1,1,200,'Normal','Pending',NULL,NULL,0.00),(22,2,1,250,'Normal','Pending',NULL,NULL,0.00),(23,3,2,250,'Normal','Pending',NULL,NULL,0.00),(24,4,1,500,'Normal','Pending',NULL,NULL,0.00),(25,5,2,200,'Normal','Pending',NULL,NULL,0.00),(26,6,2,1000,'Normal','Pending',NULL,NULL,0.00),(27,7,1,1000,'Normal','Pending',NULL,NULL,0.00),(28,8,1,450,'Normal','Pending',NULL,NULL,0.00),(29,9,3,1200,'Normal','Pending',NULL,NULL,0.00),(30,10,4,150,'Normal','Pending',NULL,NULL,0.00),(31,11,2,120,'Normal','Pending',NULL,NULL,0.00),(32,12,4,120,'Normal','Pending',NULL,NULL,0.00),(33,13,4,150,'Normal','Pending',NULL,NULL,0.00),(34,14,6,1200,'Normal','Pending',NULL,NULL,0.00),(35,15,7,60,'Normal','Pending',NULL,NULL,0.00),(36,16,8,120,'Normal','Pending',NULL,NULL,0.00),(37,17,8,300,'Normal','Pending',NULL,NULL,0.00),(38,18,9,1210,'Normal','Pending',NULL,NULL,0.00),(39,19,9,120,'Normal','Pending',NULL,NULL,0.00),(40,20,10,150,'Normal','Pending',NULL,NULL,0.00),(41,21,11,1000,'Normal','Pending',NULL,NULL,0.00),(42,22,11,1000,'Normal','Pending',NULL,NULL,0.00),(43,23,12,55,'Normal','Pending',NULL,NULL,0.00),(44,24,4,110,'Normal','Pending',NULL,NULL,0.00),(45,25,11,110,'Normal','Pending',NULL,NULL,0.00),(46,26,1,600,'Normal','Pending',NULL,NULL,0.00),(47,27,4,800,'Normal','Pending',NULL,NULL,0.00),(48,28,6,1500,'Normal','Pending',NULL,NULL,0.00),(49,29,1,500,'Normal','Pending',NULL,NULL,0.00),(50,30,12,90,'Normal','Pending',NULL,NULL,0.00),(51,31,1,200,'Normal','Pending',NULL,NULL,0.00),(52,32,1,100,'Normal','Pending',NULL,NULL,0.00),(53,33,2,390,'Normal','Pending',NULL,NULL,0.00),(54,34,1,120,'Normal','Pending',NULL,NULL,0.00),(55,35,1,200,'Normal','Pending',NULL,NULL,0.00),(56,36,1,200,'Normal','Pending',NULL,NULL,0.00),(57,37,1,900,'Normal','Pending',NULL,NULL,0.00),(58,38,1,300,'Normal','Pending',NULL,NULL,0.00),(59,39,1,200,'Normal','Pending',NULL,NULL,0.00),(60,40,1,900,'Normal','Pending',NULL,NULL,0.00),(61,41,1,1111,'Normal','Pending',NULL,NULL,0.00),(62,42,1,2122,'Normal','Pending',NULL,NULL,0.00),(63,43,1,111,'Normal','Pending',NULL,NULL,0.00),(64,44,1,2000,'Normal','Pending',NULL,NULL,0.00),(65,45,1,1111,'Normal','Pending','/uploads/orderfiles/1760092740285.png',NULL,0.00),(66,46,1,1112,'Normal','Pending','/uploads/orderfiles/1760093696688.png',NULL,0.00),(67,47,1,1111,'Normal','Pending','/uploads/orderfiles/1760094064963.pdf',NULL,0.00),(68,48,1,2222,'Normal','Pending',NULL,NULL,0.00),(69,49,1,1111,'Normal','Pending','/uploads/orderfiles/1760100450029.pdf',NULL,0.00),(70,50,2,566,'Normal','Pending',NULL,NULL,0.00),(71,51,2,1111,'Normal','Pending',NULL,NULL,0.00),(72,52,2,11112,'Normal','Pending',NULL,NULL,0.00),(73,53,2,1212,'Normal','Pending',NULL,NULL,0.00),(74,54,2,111,'Normal','Pending',NULL,NULL,0.00),(75,55,1,123,'Normal','Pending',NULL,NULL,0.00),(76,56,2,1111,'Normal','Pending',NULL,NULL,0.00),(77,57,1,1234,'Normal','Pending',NULL,NULL,0.00),(78,58,1,123,'Normal','Pending',NULL,NULL,0.00),(79,59,1,11212,'Normal','Pending','/uploads/orderfiles/1760109588560.png',NULL,0.00),(80,60,1,11212,'Normal','Pending','/uploads/orderfiles/1760109615026.png',NULL,0.00),(81,61,1,11212,'Normal','Pending','/uploads/orderfiles/1760109616191.png',NULL,0.00),(82,62,1,11212,'Normal','Pending','/uploads/orderfiles/1760109629213.png',NULL,0.00),(83,63,1,11212,'Normal','Pending','/uploads/orderfiles/1760109681260.png',NULL,0.00),(84,64,1,11212,'Normal','Pending','/uploads/orderfiles/1760109687151.png',NULL,0.00),(85,65,1,11212,'Normal','Pending','/uploads/orderfiles/1760109716625.png',NULL,0.00),(86,66,1,213,'Normal','Pending',NULL,NULL,0.00),(87,67,1,211,'Normal','Pending','/uploads/orderfiles/1760109991453.pdf',NULL,0.00),(88,68,1,211,'Normal','Pending','/uploads/orderfiles/1760110005692.pdf',NULL,0.00),(89,69,1,211,'Normal','Pending',NULL,NULL,0.00),(90,70,1,232,'Normal','Pending','/uploads/orderfiles/1760110155885.docx',NULL,0.00),(91,71,1,232,'Normal','Pending','/uploads/orderfiles/1760110327697.docx',NULL,0.00),(92,72,2,213,'Normal','Pending',NULL,NULL,0.00),(93,73,1,24,'Normal','Pending','/uploads/orderfiles/1760111756102.png',NULL,0.00),(94,74,2,342,'Normal','Pending',NULL,NULL,0.00),(95,75,2,342,'Normal','Pending',NULL,NULL,0.00),(96,76,2,233,'Normal','Pending',NULL,NULL,0.00),(97,77,2,232,'Normal','Pending','/uploads/orderfiles/1760114026321.png',NULL,0.00),(98,78,2,124,'Normal','Pending','/uploads/orderfiles/1760115276423.png',NULL,0.00),(99,79,2,111,'Normal','Pending','/uploads/orderfiles/1760115358473.png',NULL,0.00),(100,80,1,233,'Normal','Pending','/uploads/orderfiles/1760180325187.png',NULL,0.00),(101,81,2,444,'Normal','Pending','/uploads/orderfiles/1760180362086.png',NULL,0.00),(102,82,1,444,'Normal','Pending','/uploads/orderfiles/1760180469793.png',NULL,0.00),(103,83,3,1245,'Normal','Pending','/uploads/orderfiles/1760186463936.png',NULL,0.00),(104,84,4,160,'Normal','Pending','/uploads/orderfiles/1760188204185.png',NULL,0.00),(105,85,5,120,'Normal','Ongoing','/uploads/orderfiles/1760189524358.png',NULL,0.00),(106,86,5,100,'Normal','Out for delivery','/uploads/orderfiles/1760189777640.png',NULL,0.00),(107,87,5,130,'Normal','Ongoing','/uploads/orderfiles/1760189839338.png',NULL,0.00),(108,88,6,1000,'Normal','Pending','/uploads/orderfiles/1760254536433.png',NULL,0.00),(109,89,7,55,'Normal','Completed','/uploads/orderfiles/1760255125140.jpg',NULL,0.00),(110,90,8,100,'Normal','Pending','/uploads/orderfiles/1760256220401.png',NULL,0.00),(111,91,9,210,'Normal','Pending','/uploads/orderfiles/1760256991895.png',NULL,0.00),(112,92,10,120,'Normal','Completed','/uploads/orderfiles/1760257943653.jpg',NULL,0.00),(113,93,10,120,'Normal','Pending','/uploads/orderfiles/1760258532402.png',NULL,0.00),(114,94,10,120,'Normal','Pending','/uploads/orderfiles/1760259985933.png',NULL,0.00),(115,95,10,120,'Normal','Pending','/uploads/orderfiles/1760260379060.png',NULL,0.00),(116,96,10,100,'Normal','Pending','/uploads/orderfiles/1760267744789.png','/uploads/orderfiles/1760267744800.png',0.00),(117,97,11,100,'Normal','Ongoing','/uploads/orderfiles/1760269093746.jpg',NULL,0.00),(118,98,12,55,'Normal','Ongoing','/uploads/orderfiles/1760270125658.png',NULL,0.00),(119,99,1,1111,'Normal','Pending',NULL,NULL,0.00),(120,100,1,1111,'Normal','Pending',NULL,NULL,0.00),(121,101,1,111,'Normal','Ongoing',NULL,NULL,0.00),(122,102,1,1111,'Normal','Pending',NULL,NULL,0.00),(123,103,1,1111,'Normal','Pending',NULL,NULL,0.00),(124,104,1,1111,'Normal','Ongoing',NULL,NULL,0.00),(125,105,1,111,'Normal','Completed',NULL,NULL,0.00),(126,106,1,1111,'Normal','Completed','/uploads/orderfiles/1760287835686.png',NULL,0.00),(127,107,2,1111,'Normal','Completed','/uploads/orderfiles/1760287867945.png',NULL,0.00),(128,108,8,1111,'Normal','Ongoing','/uploads/orderfiles/1760421683704.png',NULL,0.00),(129,109,1,111,'Normal','Pending',NULL,NULL,0.00),(130,110,1,222,'Normal','Completed','/uploads/orderfiles/1760454443929.png',NULL,0.00),(131,117,1,111,'Normal','Pending','/uploads/orderfiles/1760501796867.png',NULL,0.00),(132,118,1,121,'Normal','Pending','/uploads/orderfiles/1760502506026.png',NULL,0.00),(133,119,1,321,'Normal','Pending','/uploads/orderfiles/1760503982934.png',NULL,0.00),(134,120,1,331,'Normal','Pending','/uploads/orderfiles/1760504146403.png',NULL,0.00),(135,121,2,500,'Normal','Pending','/uploads/orderfiles/1760504311143.png',NULL,0.00),(136,122,2,211,'Normal','Pending',NULL,NULL,0.00),(137,123,2,312,'Normal','Pending',NULL,NULL,0.00),(138,124,2,4444,'Normal','Pending',NULL,NULL,0.00),(139,125,1,441,'Normal','Pending','/uploads/orderfiles/1760505691201.png',NULL,0.00),(140,126,2,412,'Normal','Pending',NULL,NULL,0.00),(141,127,5,120,'Normal','Pending',NULL,NULL,0.00),(142,128,2,555,'Normal','Pending','/uploads/orderfiles/1760506200503.png',NULL,0.00),(143,129,3,1200,'Normal','Pending','/uploads/orderfiles/1760506303267.png',NULL,0.00),(144,130,4,120,'Normal','Pending','/uploads/orderfiles/1760506445539.png',NULL,0.00),(145,131,5,120,'Normal','Pending','/uploads/orderfiles/1760506582083.png',NULL,0.00),(146,132,6,13000,'Normal','Pending','/uploads/orderfiles/1760506735489.png',NULL,0.00),(147,133,7,55,'Normal','Pending','/uploads/orderfiles/1760506827326.png',NULL,0.00),(148,134,8,120,'Normal','Pending','/uploads/orderfiles/1760507131234.png',NULL,0.00),(149,135,9,120,'Normal','Pending','/uploads/orderfiles/1760507180539.png',NULL,0.00),(150,136,10,120,'Normal','Pending','/uploads/orderfiles/1760507236234.png','/uploads/orderfiles/1760507236237.png',0.00),(151,137,11,120,'Normal','Pending','/uploads/orderfiles/1760507383667.png',NULL,0.00),(152,138,12,55,'Normal','Completed','/uploads/orderfiles/1760507483215.png',NULL,0.00),(153,139,1,1000,'Normal','Pending','/uploads/orderfiles/1760507701948.png',NULL,0.00),(154,140,1,122,'Normal','Completed','/uploads/orderfiles/1760507766804.pdf',NULL,0.00),(155,141,1,121,'Normal','Pending','/uploads/orderfiles/1760508509001.png',NULL,0.00),(156,142,1,122,'Normal','Pending','/uploads/orderfiles/1760509465298.png',NULL,0.00),(157,143,1,123,'Normal','Pending',NULL,NULL,0.00),(158,144,1,12,'Normal','Pending','/uploads/orderfiles/1760509726967.png',NULL,0.00),(159,145,2,10,'Normal','Pending','/uploads/orderfiles/1760509763758.png',NULL,0.00),(160,146,1,10,'Normal','Pending','/uploads/orderfiles/1760509805716.png',NULL,0.00),(161,147,2,10,'Normal','Ongoing','/uploads/orderfiles/1760509830855.png',NULL,0.00),(163,149,1,10,'Normal','Ongoing','/uploads/orderfiles/1760512112422.png',NULL,0.00),(164,150,10,100,'Normal','Ongoing','/uploads/orderfiles/1760512275432.png','/uploads/orderfiles/1760512275443.png',0.00),(165,151,1,111,'Normal','Completed','/uploads/orderfiles/1760512550750.docx',NULL,0.00),(166,152,1,123,'Normal','Completed','/uploads/orderfiles/1760512575038.pdf',NULL,0.00),(167,153,3,1000,'Normal','Pending',NULL,NULL,0.00),(168,154,1,112,'Normal','Pending','/uploads/orderfiles/1762838640897.png',NULL,0.00),(169,155,3,1000,'Normal','Pending','/uploads/orderfiles/1762866696627.png',NULL,0.00),(170,156,3,1000,'Normal','Pending','/uploads/orderfiles/1762951858091.png',NULL,0.00),(171,157,3,1200,'Normal','Pending','/uploads/orderfiles/1762952224510.png',NULL,0.00),(172,158,12,100,'Normal','Pending','/uploads/orderfiles/1763041554755.png',NULL,0.00),(173,159,2,100,'Normal','Pending','/uploads/orderfiles/1763043292180.png',NULL,220000.00),(174,160,6,1000,'Normal','Completed','/uploads/orderfiles/1763044225993.png',NULL,21800.00),(175,161,3,1000,'Normal','Pending',NULL,NULL,47200.00),(176,162,7,55,'Normal','Pending',NULL,NULL,0.00),(177,163,7,55,'Normal','Completed',NULL,NULL,7320.00),(178,164,11,120,'Normal','Completed',NULL,NULL,12000.00),(179,165,3,1000,'Normal','Pending',NULL,NULL,41800.00),(180,166,3,1000,'Normal','Pending',NULL,NULL,47200.00),(181,167,2,119,'Normal','Pending',NULL,NULL,31425.00),(182,168,3,1000,'Normal','Completed','/uploads/orderfiles/1763128381678.png',NULL,47200.00),(183,169,3,1000,'Normal','Pending',NULL,NULL,41800.00),(184,170,3,1000,'Normal','Pending','/uploads/orderfiles/1763207183206.png',NULL,47200.00),(185,171,3,1000,'Normal','Pending',NULL,NULL,47200.00),(186,172,3,1200,'Normal','Pending',NULL,NULL,49800.00),(187,173,3,1000,'Normal','Pending',NULL,NULL,47200.00);
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) DEFAULT 0.00,
  `manager_added` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,11,'2025-10-06 12:27:12',0.00,0.00),(2,11,'2025-10-06 12:36:35',0.00,0.00),(3,11,'2025-10-06 12:47:05',0.00,0.00),(4,6,'2025-10-06 12:51:51',0.00,0.00),(5,6,'2025-10-06 12:52:23',0.00,0.00),(6,6,'2025-10-06 14:45:22',0.00,0.00),(7,6,'2025-10-06 14:45:48',0.00,0.00),(8,6,'2025-10-07 00:28:55',0.00,0.00),(9,6,'2025-10-07 09:20:36',0.00,0.00),(10,6,'2025-10-07 12:50:35',0.00,0.00),(11,12,'2025-10-07 13:04:02',0.00,0.00),(12,12,'2025-10-07 13:05:50',0.00,0.00),(13,12,'2025-10-07 13:35:47',0.00,0.00),(14,12,'2025-10-07 13:37:21',0.00,0.00),(15,12,'2025-10-07 13:58:12',0.00,0.00),(16,11,'2025-10-07 14:14:39',0.00,0.00),(17,11,'2025-10-07 15:00:17',0.00,0.00),(18,6,'2025-10-07 15:17:29',0.00,0.00),(19,6,'2025-10-08 02:07:27',0.00,0.00),(20,6,'2025-10-08 04:55:19',0.00,0.00),(21,6,'2025-10-08 05:48:54',0.00,0.00),(22,12,'2025-10-08 06:18:40',0.00,0.00),(23,12,'2025-10-08 06:40:38',0.00,0.00),(24,12,'2025-10-08 06:41:04',0.00,0.00),(25,12,'2025-10-08 06:43:19',0.00,0.00),(26,11,'2025-10-08 10:40:53',0.00,0.00),(27,6,'2025-10-08 13:24:27',0.00,0.00),(28,11,'2025-10-08 14:10:24',0.00,0.00),(29,12,'2025-10-09 08:13:21',0.00,0.00),(30,11,'2025-10-09 09:17:24',0.00,0.00),(31,6,'2025-10-09 13:22:43',0.00,0.00),(32,12,'2025-10-10 02:42:00',0.00,0.00),(33,12,'2025-10-10 02:53:04',0.00,0.00),(34,11,'2025-10-10 03:44:15',0.00,0.00),(35,11,'2025-10-10 03:46:10',0.00,0.00),(36,11,'2025-10-10 03:55:14',0.00,0.00),(37,12,'2025-10-10 08:09:39',0.00,0.00),(38,12,'2025-10-10 08:31:07',0.00,0.00),(39,12,'2025-10-10 09:03:01',0.00,0.00),(40,6,'2025-10-10 10:20:52',0.00,0.00),(41,6,'2025-10-10 10:28:04',0.00,0.00),(42,6,'2025-10-10 10:30:45',0.00,0.00),(43,6,'2025-10-10 10:32:45',0.00,0.00),(44,6,'2025-10-10 10:33:11',0.00,0.00),(45,6,'2025-10-10 10:39:00',0.00,0.00),(46,6,'2025-10-10 10:54:56',0.00,0.00),(47,6,'2025-10-10 11:01:04',0.00,0.00),(48,6,'2025-10-10 11:46:51',0.00,0.00),(49,6,'2025-10-10 12:47:29',0.00,0.00),(50,11,'2025-10-10 13:45:51',0.00,0.00),(51,11,'2025-10-10 13:53:29',0.00,0.00),(52,11,'2025-10-10 13:58:14',0.00,0.00),(53,11,'2025-10-10 14:06:08',0.00,0.00),(54,11,'2025-10-10 14:09:51',0.00,0.00),(55,11,'2025-10-10 14:19:58',0.00,0.00),(56,6,'2025-10-10 15:10:17',0.00,0.00),(57,6,'2025-10-10 15:12:55',0.00,0.00),(58,6,'2025-10-10 15:16:23',0.00,0.00),(59,6,'2025-10-10 15:19:48',0.00,0.00),(60,6,'2025-10-10 15:20:15',0.00,0.00),(61,6,'2025-10-10 15:20:16',0.00,0.00),(62,6,'2025-10-10 15:20:29',0.00,0.00),(63,6,'2025-10-10 15:21:21',0.00,0.00),(64,6,'2025-10-10 15:21:27',0.00,0.00),(65,6,'2025-10-10 15:21:56',0.00,0.00),(66,6,'2025-10-10 15:22:46',0.00,0.00),(67,6,'2025-10-10 15:26:31',0.00,0.00),(68,6,'2025-10-10 15:26:45',0.00,0.00),(69,6,'2025-10-10 15:28:01',0.00,0.00),(70,11,'2025-10-10 15:29:15',0.00,0.00),(71,11,'2025-10-10 15:32:07',0.00,0.00),(72,11,'2025-10-10 15:33:50',0.00,0.00),(73,11,'2025-10-10 15:55:56',0.00,0.00),(74,11,'2025-10-10 15:56:36',0.00,0.00),(75,11,'2025-10-10 15:56:43',0.00,0.00),(76,11,'2025-10-10 16:27:11',0.00,0.00),(77,11,'2025-10-10 16:33:46',0.00,0.00),(78,11,'2025-10-10 16:54:36',0.00,0.00),(79,11,'2025-10-10 16:55:58',0.00,0.00),(80,11,'2025-10-11 10:58:45',0.00,0.00),(81,11,'2025-10-11 10:59:22',0.00,0.00),(82,11,'2025-10-11 11:01:09',0.00,0.00),(83,11,'2025-10-11 12:41:03',0.00,0.00),(84,11,'2025-10-11 13:10:04',0.00,0.00),(85,11,'2025-10-11 13:32:04',0.00,0.00),(86,11,'2025-10-11 13:36:17',0.00,0.00),(87,11,'2025-10-11 13:37:19',0.00,0.00),(88,12,'2025-10-12 07:35:36',0.00,0.00),(89,12,'2025-10-12 07:45:25',5000.00,0.00),(90,12,'2025-10-12 08:03:40',0.00,0.00),(91,12,'2025-10-12 08:16:31',0.00,0.00),(92,12,'2025-10-12 08:32:23',2500.00,0.00),(93,12,'2025-10-12 08:42:12',0.00,0.00),(94,12,'2025-10-12 09:06:25',0.00,0.00),(95,12,'2025-10-12 09:12:59',0.00,0.00),(96,11,'2025-10-12 11:15:44',0.00,0.00),(97,11,'2025-10-12 11:38:13',0.00,0.00),(98,11,'2025-10-12 11:55:25',0.00,0.00),(99,11,'2025-10-12 15:48:55',0.00,0.00),(100,11,'2025-10-12 16:10:10',0.00,0.00),(101,11,'2025-10-12 16:12:17',0.00,0.00),(102,11,'2025-10-12 16:22:48',0.00,0.00),(103,11,'2025-10-12 16:33:39',0.00,0.00),(104,11,'2025-10-12 16:38:42',0.00,0.00),(105,11,'2025-10-12 16:40:38',0.00,0.00),(106,11,'2025-10-12 16:50:35',4000.00,0.00),(107,11,'2025-10-12 16:51:07',10.00,0.00),(108,11,'2025-10-14 06:01:23',0.00,0.00),(109,11,'2025-10-14 15:01:57',0.00,0.00),(110,11,'2025-10-14 15:07:23',4500.00,0.00),(111,14,'2025-10-15 03:50:01',0.00,0.00),(112,14,'2025-10-15 03:50:11',0.00,0.00),(113,14,'2025-10-15 03:50:51',0.00,0.00),(114,14,'2025-10-15 03:51:33',0.00,0.00),(115,14,'2025-10-15 03:56:56',0.00,0.00),(116,11,'2025-10-15 04:11:11',0.00,0.00),(117,11,'2025-10-15 04:16:36',0.00,0.00),(118,11,'2025-10-15 04:28:25',0.00,0.00),(119,11,'2025-10-15 04:53:02',0.00,0.00),(120,11,'2025-10-15 04:55:46',0.00,0.00),(121,11,'2025-10-15 04:58:31',0.00,0.00),(122,11,'2025-10-15 05:02:57',0.00,0.00),(123,11,'2025-10-15 05:06:26',0.00,0.00),(124,11,'2025-10-15 05:14:05',0.00,0.00),(125,11,'2025-10-15 05:21:31',0.00,0.00),(126,6,'2025-10-15 05:24:40',0.00,0.00),(127,6,'2025-10-15 05:25:31',0.00,0.00),(128,6,'2025-10-15 05:30:00',0.00,0.00),(129,6,'2025-10-15 05:31:43',0.00,0.00),(130,6,'2025-10-15 05:34:05',0.00,0.00),(131,6,'2025-10-15 05:36:22',0.00,0.00),(132,6,'2025-10-15 05:38:55',0.00,0.00),(133,6,'2025-10-15 05:40:27',0.00,0.00),(134,6,'2025-10-15 05:45:31',0.00,0.00),(135,6,'2025-10-15 05:46:20',0.00,0.00),(136,6,'2025-10-15 05:47:16',0.00,0.00),(137,6,'2025-10-15 05:49:43',0.00,0.00),(138,6,'2025-10-15 05:51:23',825.00,0.00),(139,11,'2025-10-15 05:55:01',0.00,0.00),(140,11,'2025-10-15 05:56:06',550.00,0.00),(141,11,'2025-10-15 06:08:28',0.00,0.00),(142,11,'2025-10-15 06:24:25',0.00,0.00),(143,11,'2025-10-15 06:26:06',0.00,0.00),(144,11,'2025-10-15 06:28:46',0.00,0.00),(145,11,'2025-10-15 06:29:23',0.00,0.00),(146,11,'2025-10-15 06:30:05',0.00,0.00),(147,11,'2025-10-15 06:30:30',1500.00,0.00),(149,14,'2025-10-15 07:08:32',0.00,0.00),(150,14,'2025-10-15 07:11:15',0.00,0.00),(151,14,'2025-10-15 07:15:50',5000.00,0.00),(152,14,'2025-10-15 07:16:15',0.00,0.00),(153,6,'2025-11-08 15:07:27',0.00,0.00),(154,11,'2025-11-11 05:24:00',0.00,0.00),(155,11,'2025-11-11 13:11:36',0.00,0.00),(156,11,'2025-11-12 12:50:57',0.00,0.00),(157,11,'2025-11-12 12:57:04',0.00,0.00),(158,11,'2025-11-13 13:45:54',0.00,0.00),(159,11,'2025-11-13 14:14:52',0.00,0.00),(160,11,'2025-11-13 14:30:25',0.00,0.00),(161,11,'2025-11-13 14:37:06',0.00,0.00),(162,11,'2025-11-13 14:54:49',0.00,0.00),(163,10,'2025-11-13 14:55:48',10920.00,3600.00),(164,11,'2025-11-13 15:19:31',13000.00,1000.00),(165,11,'2025-11-13 17:22:45',0.00,0.00),(166,11,'2025-11-13 23:17:34',0.00,0.00),(167,11,'2025-11-14 11:37:31',0.00,0.00),(168,11,'2025-11-14 13:53:01',52200.00,5000.00),(169,11,'2025-11-15 05:23:57',0.00,0.00),(170,30,'2025-11-15 11:46:23',0.00,0.00),(171,30,'2025-11-15 11:47:30',0.00,0.00),(172,30,'2025-11-15 11:49:01',0.00,0.00),(173,11,'2025-11-15 12:38:54',0.00,0.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attributes`
--

DROP TABLE IF EXISTS `product_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_attributes` (
  `attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attribute_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attributes`
--

LOCK TABLES `product_attributes` WRITE;
/*!40000 ALTER TABLE `product_attributes` DISABLE KEYS */;
INSERT INTO `product_attributes` VALUES (19,1,'Customization','Yes'),(20,1,'Name',''),(21,1,'Email',''),(22,1,'Location',''),(23,1,'Contact Number',''),(24,1,'Number of Copies',''),(25,1,'Page Count',''),(26,1,'Binding Type',''),(27,1,'Paper Type',''),(29,1,'Additional Notes',''),(30,2,'Binding Type',''),(31,2,'Paper Type',''),(32,2,'Cover Finish',''),(33,2,'Color Printing',''),(34,3,'Size',''),(35,3,'Paper Type',''),(36,3,'Colored','Yes/No'),(37,3,'Lamination','Yes/No'),(38,3,'Print (Back to Back)','No'),(39,4,'Customization','Yes'),(40,4,'Color','Single color'),(41,4,'Minimum order','100'),(42,4,'Calendar Type',''),(43,4,'Calendar Size',''),(44,5,'Customization','Yes'),(45,5,'Card Title',''),(46,5,'Number of Cards',''),(47,5,'Size',''),(48,5,'Type of Paper',''),(49,5,'Design Options',''),(50,5,'Message',''),(51,6,'Number of Copies min','1000'),(52,6,'Flyer Size',''),(53,6,'Paper Type',''),(54,6,'Lamination',''),(55,6,'Color','Yes/No'),(56,6,'Print (Back to Back)','Yes'),(57,6,'Notes',''),(58,7,'Event Name',''),(59,7,'Number of Copies Min','50'),(60,7,'Size',''),(61,7,'Paper Type',''),(62,7,'Print Method',''),(63,7,'Message',''),(64,8,'Number of Copies',''),(65,8,'Size',''),(66,8,'Paper Type',''),(67,8,'Message',''),(68,9,'Business Name',''),(69,9,'Number of Copies',''),(70,9,'Color',''),(71,9,'Layout',''),(72,9,'Size',''),(73,9,'Message',''),(74,10,'Quantity (Min)','100'),(75,10,'Paper Type','Colored Bondpaper'),(76,10,'Booklet Finish',''),(77,10,'Size',''),(78,10,'Message',''),(79,11,'Number of Posters (Min)','100'),(80,11,'Poster Size',''),(81,11,'Paper Type','Premium Card'),(82,11,'Lamination',''),(83,11,'Color',''),(84,11,'Message',''),(85,12,'Number of Tickets (Min)','50'),(86,12,'Size','2x5\"'),(87,12,'With Stub',''),(88,12,'Message','');
/*!40000 ALTER TABLE `product_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(150) NOT NULL,
  `status` enum('Active','Inactive','Archived') DEFAULT 'Active',
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Binding','Active',NULL),(2,'Books','Active',NULL),(3,'Brochure','Active',NULL),(4,'Calendars','Active',NULL),(5,'CallingCard','Active',NULL),(6,'Flyers','Active',NULL),(7,'Invitation','Active',NULL),(8,'Label','Active',NULL),(9,'NewsLetter','Active',NULL),(10,'OfficialReceipt','Active',NULL),(11,'Posters','Active',NULL),(12,'RaffleTicket','Active',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restore_history`
--

DROP TABLE IF EXISTS `restore_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restore_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `performed_by` varchar(100) DEFAULT NULL,
  `status` enum('Success','Failed') DEFAULT 'Success',
  `restored_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restore_history`
--

LOCK TABLES `restore_history` WRITE;
/*!40000 ALTER TABLE `restore_history` DISABLE KEYS */;
INSERT INTO `restore_history` VALUES (1,'backup-2025-11-02T15-52-34-860Z.sql','Admin','Failed','2025-11-02 23:53:38'),(2,'backup-2025-11-15T13-09-19-892Z.sql','Admin','Failed','2025-11-15 21:12:56');
/*!40000 ALTER TABLE `restore_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_id` int(11) NOT NULL,
  `item` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_item_id` (`order_item_id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `orderitems` (`order_item_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (7,107,'Books x1111',10.00,'2025-10-13'),(8,106,'Binding x1111',4000.00,'2025-10-13'),(14,107,'Books x1111',10.00,'2025-10-14'),(15,89,'Invitation x55',5000.00,'2025-10-14'),(16,92,'OfficialReceipt x120',2500.00,'2025-10-14'),(17,107,'Books x1111',10.00,'2025-10-14'),(19,110,'Binding x222',4500.00,'2025-10-15'),(20,138,'RaffleTicket x55',825.00,'2025-10-15'),(21,140,'Binding x122',550.00,'2025-10-15'),(22,152,'Binding x123',0.00,'2025-10-28'),(23,151,'Binding x111',5000.00,'2025-11-04'),(24,160,'Flyers x1000',0.00,'2025-11-14'),(25,163,'Invitation x55',2400.00,'2025-11-14'),(26,164,'Posters x120',13000.00,'2025-11-14'),(27,168,'Brochure x1000',52200.00,'2025-11-15');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplies`
--

DROP TABLE IF EXISTS `supplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplies` (
  `supply_id` int(11) NOT NULL AUTO_INCREMENT,
  `supply_name` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`supply_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplies`
--

LOCK TABLES `supplies` WRITE;
/*!40000 ALTER TABLE `supplies` DISABLE KEYS */;
INSERT INTO `supplies` VALUES (1,'Bond Paper',59,'Ream',220.00,'2025-10-08 09:47:47'),(3,'Ink Cartridge',10,'Bottle',180.00,'2025-10-08 09:47:47'),(8,'Paper Tape',40,'Roll',3.00,'2025-10-08 09:47:47'),(11,'Staple Wire',20,'Box',20.00,'2025-11-11 14:47:15'),(12,'Tape',10,'Roll',100.00,'2025-11-11 18:56:12'),(13,'Gas (Fee)',1,'1',500.00,'2025-11-13 00:31:19');
/*!40000 ALTER TABLE `supplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `business` varchar(255) DEFAULT NULL,
  `status` enum('Active','Suspended','Inactive','Banned') NOT NULL DEFAULT 'Active',
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin','user','manager') DEFAULT 'user',
  `is_archived` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Anthony Portento','anthony@gmail.com','Tabo, Boac, Marinduque','motorX','Active','$2b$12$ovM26r8VrRB61CDpPTRuG.bPlQGkjO/DJVIrTpAS.sD9lVaEod15C','9321223551','2025-09-14 06:54:20','user',0),(9,'admin','admin@gmail.com','HQ',NULL,'Active','$2b$12$9FBo1451FvvPILw29QDweuVf5TMmct7hzv5lHT98.gMPN9jHVjSui','0','2025-09-14 07:07:37','admin',0),(10,'manager','manager@gmail.com','HQ',NULL,'Active','$2b$12$qCo6X6EWBdEe6CObjCD9g.DkQumUekpA/GM/bGxT/dniCpRfCTvNC','0','2025-09-14 07:08:15','manager',0),(11,'Joshua Valenzuela','joshua@gmail.com','Mahunig, Gasan, Marinduque','GadgetY','Active','$2b$12$5sXqfKpjNqmju.G3Hgffi.dRSoOQ6r1uBWUx10aKcfYQ9fk26QeMe','09083705595','2025-10-06 09:19:47','user',0),(12,'Aaron Oriasel','aaron@gmail.com','Bantay, Boac, Marinduque','MOTOS','Active','$2b$12$BTA/aXvI3fyQkj48sLmv/eB7WpMwuiRbVb5eRGrCf/Om3AvhUwNt2','09321223551','2025-10-07 12:52:35','user',0),(13,'carl madrigal','carl@gmail.com','gasan',NULL,'Active','$2b$12$P11JMGJC8fish/ffiBgcjeXCiKNIxwryMYSYafzCFZDfClDjJoIKm','09432237651','2025-10-15 00:23:14','user',0),(14,'Niel Osinsao','niel@gmail.com','agumaymayan, boac Marinduque',NULL,'Active','$2b$12$3.KGirsfgP6MBYCIWI/U.u.32Wdv8bL.eiFhlJN/YoQ.x2RHfzJaC','09833222113','2025-10-15 03:47:25','user',0),(22,'John Lloyd  Tesio','jltesio23@gmail.com','Gasan',NULL,'Active','$2b$12$Uirg0Ez1Qv89CPwuxWERxOsdrCMA0OLwdDkPa1tfSG9d3b0UT/ef.','09342332213','2025-11-11 05:21:09','user',0),(24,'test name ','a@H.com','gasan',NULL,'Active','$2b$12$mWgXg0d4cnLkdHccTundpufEsaE718434HbiPYj/gMMJSffcReyv.','09083705595','2025-11-12 15:11:18','user',0),(30,'Joshua S. Valenzuela','valenzuelajoshua759@gmail.com','mahunig, gasan, marinduque',NULL,'Active','$2b$12$bLbs6nFIVpsA6wZWo5RmI.RNN1Cmm4LFta4hlPFoXMe3B2qSgEh8e','09083705595','2025-11-15 08:17:18','user',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-15 21:22:35
