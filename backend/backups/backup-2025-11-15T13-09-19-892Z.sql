# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: attribute_options
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `attribute_options` (
  `option_id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_name` varchar(150) NOT NULL,
  `option_value` varchar(100) NOT NULL,
  PRIMARY KEY (`option_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 78 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backup_history
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backup_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `scope` varchar(50) DEFAULT 'All',
  `size` varchar(50) DEFAULT NULL,
  `status` enum('Success', 'Failed') DEFAULT 'Success',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: conversations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `conversations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) NOT NULL,
  `managerId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 27 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: maintenance
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `maintenance` (
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
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: messages
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversationId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `text` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `conversationId` (`conversationId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 44 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: order_item_attributes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `order_item_attributes` (
  `order_item_attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_id` int(11) NOT NULL,
  `attribute_name` varchar(255) NOT NULL,
  `attribute_value` varchar(255) NOT NULL,
  PRIMARY KEY (`order_item_attribute_id`),
  KEY `fk_order_item_attributes_orderitems` (`order_item_id`),
  CONSTRAINT `fk_order_item_attributes_orderitems` FOREIGN KEY (`order_item_id`) REFERENCES `orderitems` (`order_item_id`) ON DELETE CASCADE,
  CONSTRAINT `order_item_attributes_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `orderitems` (`order_item_id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 967 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: orderitems
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orderitems` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `urgency` varchar(50) DEFAULT 'Not Rush',
  `status` varchar(50) DEFAULT 'Pending',
  `file1` varchar(255) DEFAULT NULL,
  `file2` varchar(255) DEFAULT NULL,
  `estimated_price` decimal(10, 2) DEFAULT 0.00,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 188 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: orders
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10, 2) DEFAULT 0.00,
  `manager_added` decimal(10, 2) DEFAULT 0.00,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 174 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: product_attributes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `product_attributes` (
  `attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attribute_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 89 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: products
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(150) NOT NULL,
  `status` enum('Active', 'Inactive', 'Archived') DEFAULT 'Active',
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  PRIMARY KEY (`product_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: restore_history
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `restore_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `performed_by` varchar(100) DEFAULT NULL,
  `status` enum('Success', 'Failed') DEFAULT 'Success',
  `restored_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sales
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_id` int(11) NOT NULL,
  `item` varchar(255) DEFAULT NULL,
  `amount` decimal(10, 2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_item_id` (`order_item_id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `orderitems` (`order_item_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sessions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: supplies
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `supplies` (
  `supply_id` int(11) NOT NULL AUTO_INCREMENT,
  `supply_name` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `price` decimal(10, 2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`supply_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `business` varchar(255) DEFAULT NULL,
  `status` enum('Active', 'Suspended', 'Inactive', 'Banned') NOT NULL DEFAULT 'Active',
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin', 'user', 'manager') DEFAULT 'user',
  `is_archived` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 32 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;# ------------------------------------------------------------
# DATA DUMP FOR TABLE: attribute_options
# ------------------------------------------------------------

INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (1, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (2, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (3, 'Binding Type', 'Hardcover');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (4, 'Binding Type', 'Spiral');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (5, 'Binding Type', 'Ring Binding');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (6, 'Paper Type', 'Matte');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (7, 'Paper Type', 'Glossy');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (8, 'Paper Type', 'Bond Paper');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (9, 'Paper Type', 'Book Paper');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (10, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (11, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (12, 'Binding Type', 'Hard Cover');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (13, 'Binding Type', 'Saddle');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (14, 'Paper Type', 'Matte');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (15, 'Paper Type', 'Glossy');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (16, 'Paper Type', 'Book Paper');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (17, 'Cover Finish', 'Matte');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (18, 'Cover Finish', 'Glossy');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (19, 'Cover Finish', 'Soft Touch');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (20, 'Color Printing', 'Full Color');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (21, 'Color Printing', 'Black & White');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (22, 'Color Printing', 'Mixed');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (23, 'Calendar Type', 'Single month (12 pages)');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (24, 'Calendar Type', 'Double month (6 pages)');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (25, 'Calendar Size', '11x17');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (26, 'Calendar Size', '17x22');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (27, 'Calendar Size', '22x34');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (28, 'Calendar Size', '8.5x14');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (29, 'Size', '2” x 3.5” (Standard)');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (30, 'Size', 'Custom Size');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (31, 'Design Options', 'Customize Design');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (32, 'Design Options', 'Upload Your Design');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (33, 'Flyer Size', 'A4');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (34, 'Flyer Size', 'A5');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (35, 'Flyer Size', 'DL');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (36, 'Flyer Size', 'Custom');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (37, 'Lamination', 'UV');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (38, 'Lamination', 'Plastic');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (39, 'Lamination', 'Matte');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (40, 'Lamination', '3D');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (41, 'Size', '5x7\"');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (42, 'Size', '4x6\"');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (43, 'Size', 'Custom');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (44, 'Paper Type', 'Carbonized');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (45, 'Paper Type', 'Colored');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (46, 'Paper Type', 'Plain');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (47, 'Print Method', 'Computer Printout');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (48, 'Print Method', 'Offset Machine');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (49, 'Size', '2x2\"');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (50, 'Size', '3x3\"');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (51, 'Size', 'Custom');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (52, 'Color', 'Black and White');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (53, 'Color', 'Full Colored');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (54, 'Layout', 'Single Page');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (55, 'Layout', 'Multi-Page');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (56, 'Size', 'Letter (8.5\"x11\")');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (57, 'Size', 'Legal (8.5\"x14\")');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (58, 'Booklet Finish', 'Padded');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (59, 'Booklet Finish', 'Stapled');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (60, 'Booklet Finish', 'Loose');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (61, 'Size', 'Half Page');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (62, 'Size', 'Full Page');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (63, 'Poster Size', 'A3');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (64, 'Poster Size', 'A2');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (65, 'Poster Size', 'A1');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (66, 'Poster Size', 'Custom');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (67, 'With Stub', 'Yes');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (68, 'With Stub', 'No');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (69, 'Book Size', 'A4 (210 x 297 mm)');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (70, 'Book Size', 'Trade Paperback (13 x 20 cm)');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (
    71,
    'Book Size',
    '5.5\" x 8.5\" (13.97 x 21.59 cm)'
  );
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (72, 'Book Size', '6\" x 9\" (15.24 x 22.86 cm)');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (73, 'Book Size', '5\" x 8\" (12.7 x 20.32 cm)');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (74, 'Book Type', 'Yearbook');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (75, 'Book Type', 'Coffee Table Book');
INSERT INTO
  `attribute_options` (`option_id`, `attribute_name`, `option_value`)
VALUES
  (76, 'Book Type', 'Souvenir Program');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backup_history
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: conversations
# ------------------------------------------------------------

INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (11, 6, 10, '2025-11-03 17:56:38');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (13, 11, 10, '2025-11-03 18:08:10');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (15, 12, 10, '2025-11-03 23:36:55');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (16, 12, 10, '2025-11-03 23:36:55');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (17, 10, 10, '2025-11-03 23:37:30');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (18, 9, 10, '2025-11-03 23:54:30');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (19, 14, 10, '2025-11-04 15:21:36');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (20, 14, 10, '2025-11-04 15:21:36');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (21, 20, 10, '2025-11-07 15:54:13');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (22, 20, 10, '2025-11-07 15:54:13');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (23, 21, 10, '2025-11-07 16:13:56');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (24, 1, 10, '2025-11-12 01:13:48');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (25, 30, 10, '2025-11-15 16:18:39');
INSERT INTO
  `conversations` (`id`, `clientId`, `managerId`, `createdAt`)
VALUES
  (26, 30, 10, '2025-11-15 16:18:40');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: maintenance
# ------------------------------------------------------------

INSERT INTO
  `maintenance` (
    `maintenance_id`,
    `user_id`,
    `is_maintenance_mode`,
    `message`,
    `createdAt`,
    `end_time`,
    `show_countdown`,
    `metadata`
  )
VALUES
  (1, 9, 1, '', '2025-11-02 22:12:39', NULL, 0, NULL);
INSERT INTO
  `maintenance` (
    `maintenance_id`,
    `user_id`,
    `is_maintenance_mode`,
    `message`,
    `createdAt`,
    `end_time`,
    `show_countdown`,
    `metadata`
  )
VALUES
  (2, 9, 0, '', '2025-11-02 22:12:51', NULL, 0, NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: messages
# ------------------------------------------------------------

INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (23, 11, 6, 'dsa', '2025-11-03 18:07:13');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (26, 13, 11, 'sad', '2025-11-03 18:09:20');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (27, 13, 11, 'ad', '2025-11-03 18:09:32');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (29, 13, 10, 'da', '2025-11-03 18:09:40');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (30, 19, 14, 'hello', '2025-11-04 15:24:03');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (31, 19, 10, 'hello', '2025-11-04 15:24:18');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (32, 11, 6, 'hello', '2025-11-06 13:04:02');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (33, 11, 10, 'hello', '2025-11-06 13:04:14');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (34, 13, 11, 'dfdsa', '2025-11-11 13:22:56');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (35, 13, 10, 'sddsaf', '2025-11-11 13:23:01');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (36, 13, 10, 'fsdfs', '2025-11-11 18:52:04');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (37, 13, 11, 'hello', '2025-11-11 20:20:19');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (38, 13, 10, 'sdf', '2025-11-11 20:21:10');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (39, 13, 11, 'hello', '2025-11-11 21:36:27');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (40, 13, 11, 'sda', '2025-11-14 23:24:14');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (41, 13, 10, 'dsad', '2025-11-14 23:24:27');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (42, 13, 10, 'hello', '2025-11-15 13:22:26');
INSERT INTO
  `messages` (
    `id`,
    `conversationId`,
    `senderId`,
    `text`,
    `createdAt`
  )
VALUES
  (43, 13, 11, 'hello', '2025-11-15 13:22:38');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: order_item_attributes
# ------------------------------------------------------------

INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (1, 21, 'PageCount', '50');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (2, 21, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (3, 21, 'PaperType', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (4, 21, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (5, 22, 'PageCount', '60');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (6, 22, 'BindingType', 'Ring Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (7, 22, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (8, 22, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (9, 23, 'Number of Copies', '250');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (10, 23, 'Number of Pages', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (11, 23, 'Binding Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (12, 23, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (13, 23, 'Cover Finish', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (14, 23, 'Color Printing', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (15, 23, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (16, 24, 'PageCount', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (17, 24, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (18, 24, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (19, 24, 'Notes', 'hello');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (20, 25, 'Number of Copies', '200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (21, 25, 'Number of Pages', '300');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (22, 25, 'Binding Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (23, 25, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (24, 25, 'Cover Finish', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (25, 25, 'Color Printing', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (26, 25, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (27, 26, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (28, 26, 'Number of Pages', '300');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (29, 26, 'Binding Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (30, 26, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (31, 26, 'Cover Finish', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (32, 26, 'Color Printing', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (33, 26, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (34, 27, 'PageCount', '300');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (35, 27, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (36, 27, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (37, 27, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (38, 28, 'PageCount', '80');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (39, 28, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (40, 28, 'PaperType', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (41, 28, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (42, 29, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (43, 29, 'Number of copies', '1200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (44, 29, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (45, 29, 'Type of paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (46, 29, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (47, 29, 'Lamination', 'Single Month (12 pages)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (48, 29, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (49, 29, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (50, 30, 'Color', 'Single Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (51, 30, 'Calendar Type', 'Double Month (6 pages)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (52, 30, 'Size', '81/2”x14”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (53, 31, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (54, 31, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (55, 31, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (56, 31, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (57, 31, 'Business', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (58, 31, 'Number of Cards', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (59, 31, 'Size', '2” x 3.5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (60, 31, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (61, 31, 'Color', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (62, 31, 'Lamination', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (63, 31, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (64, 31, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (65, 32, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (66, 32, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (67, 32, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (68, 32, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (69, 32, 'Business', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (70, 32, 'Number of Cards', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (71, 32, 'Size', '2” x 3.5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (72, 32, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (73, 32, 'Color', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (74, 32, 'Lamination', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (75, 32, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (76, 32, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (77, 33, 'Color', 'Single Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (78, 33, 'Calendar Type', 'Single Month (12 pages)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (79, 33, 'Size', '11”x17”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (80, 34, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (81, 34, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (82, 34, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (83, 34, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (84, 34, 'Number of Copies', '1200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (85, 34, 'Size', 'A4');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (86, 34, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (87, 34, 'Color', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (88, 34, 'Lamination', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (89, 34, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (90, 34, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (91, 35, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (92, 35, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (93, 35, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (94, 35, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (95, 35, 'Event Name', 'Wedding ');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (96, 35, 'Size', '5x7 inches');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (97, 35, 'Paper Type', 'Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (98, 35, 'Print Method', 'Computer Printout');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (99, 35, 'Message', 'Hello');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (100, 36, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (101, 36, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (102, 36, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (103, 36, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (104, 36, 'Size', '2” x 2”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (105, 36, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (106, 36, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (107, 37, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (108, 37, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (109, 37, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (110, 37, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (111, 37, 'Size', '2” x 2”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (112, 37, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (113, 37, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (114, 38, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (115, 38, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (
    116,
    38,
    'Address',
    'Mongpong, Sta. Cruz, Marinduque'
  );
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (117, 38, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (118, 38, 'BusinessName', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (119, 38, 'Quantity', '1210');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (120, 38, 'Size', 'A5');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (121, 38, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (122, 38, 'Layout', 'Single Page');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (123, 38, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (124, 39, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (125, 39, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (
    126,
    39,
    'Address',
    'Mongpong, Sta. Cruz, Marinduque'
  );
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (127, 39, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (128, 39, 'BusinessName', 'Motox');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (129, 39, 'Quantity', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (130, 39, 'Size', 'A4');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (131, 39, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (132, 39, 'Layout', 'Multi-Page');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (133, 39, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (134, 40, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (135, 40, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (
    136,
    40,
    'Address',
    'Mongpong, Sta. Cruz, Marinduque'
  );
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (137, 40, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (138, 40, 'Business', 'motorX');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (139, 40, 'Number of copies (min)', '150');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (140, 40, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (141, 40, 'Booklet Finish', 'Stapled');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (142, 40, 'Size', 'Half Page');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (143, 40, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (144, 41, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (145, 41, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (
    146,
    41,
    'Address',
    'Mongpong, Sta. Cruz, Marinduque'
  );
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (147, 41, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (148, 41, 'Number of Posters (min)', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (149, 41, 'Size', 'A2');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (150, 41, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (151, 41, 'Lamination', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (152, 41, 'Color', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (153, 41, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (154, 42, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (155, 42, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (156, 42, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (157, 42, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (158, 42, 'Number of Posters (min)', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (159, 42, 'Size', 'A3');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (160, 42, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (161, 42, 'Lamination', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (162, 42, 'Color', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (163, 42, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (164, 43, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (165, 43, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (166, 43, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (167, 43, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (168, 43, 'Businessname', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (169, 43, 'Number of Tickets (min)', '55');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (170, 43, 'Size', '2” x 5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (171, 43, 'With Stub', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (172, 43, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (173, 44, 'Color', 'Single Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (174, 44, 'Calendar Type', 'Single Month (12 pages)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (175, 44, 'Size', '11”x17”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (176, 45, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (177, 45, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (178, 45, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (179, 45, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (180, 45, 'Number of Posters (min)', '110');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (181, 45, 'Size', 'A3');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (182, 45, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (183, 45, 'Lamination', 'Gloss');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (184, 45, 'Color', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (185, 45, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (186, 46, 'PageCount', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (187, 46, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (188, 46, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (189, 46, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (190, 47, 'Color', 'Single Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (191, 47, 'Calendar Type', 'Single Month (12 pages)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (192, 47, 'Size', '11”x17”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (193, 48, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (194, 48, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (195, 48, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (196, 48, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (197, 48, 'Number of Copies', '1500');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (198, 48, 'Size', 'A4');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (199, 48, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (200, 48, 'Color', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (201, 48, 'Lamination', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (202, 48, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (203, 48, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (204, 49, 'PageCount', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (205, 49, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (206, 49, 'PaperType', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (207, 49, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (208, 50, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (209, 50, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (210, 50, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (211, 50, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (212, 50, 'Businessname', 'GadgetY');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (213, 50, 'Number of Tickets (min)', '90');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (214, 50, 'Size', '2” x 5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (215, 50, 'With Stub', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (216, 50, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (217, 51, 'PageCount', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (218, 51, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (219, 51, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (220, 51, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (221, 52, 'PageCount', '200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (222, 52, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (223, 52, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (224, 52, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (225, 53, 'Number of Pages', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (226, 53, 'Binding Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (227, 53, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (228, 53, 'Cover Finish', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (229, 53, 'Color Printing', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (230, 53, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (231, 54, 'PageCount', '300');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (232, 54, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (233, 54, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (234, 54, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (235, 55, 'PageCount', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (236, 55, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (237, 55, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (238, 55, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (239, 56, 'PageCount', '190');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (240, 56, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (241, 56, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (242, 56, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (243, 57, 'PageCount', '90');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (244, 57, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (245, 57, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (246, 57, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (247, 58, 'PageCount', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (248, 58, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (249, 58, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (250, 58, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (251, 59, 'PageCount', '50');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (252, 59, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (253, 59, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (254, 59, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (255, 60, 'PageCount', '80');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (256, 60, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (257, 60, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (258, 60, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (259, 61, 'PageCount', '11');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (260, 61, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (261, 61, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (262, 61, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (263, 62, 'PageCount', '200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (264, 62, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (265, 62, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (266, 62, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (267, 63, 'PageCount', '50');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (268, 63, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (269, 63, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (270, 63, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (271, 64, 'PageCount', '10');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (272, 64, 'BindingType', 'Spiral');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (273, 64, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (274, 64, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (275, 65, 'PageCount', '200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (276, 65, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (277, 65, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (278, 65, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (279, 66, 'PageCount', '232');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (280, 66, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (281, 66, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (282, 66, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (283, 67, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (284, 67, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (285, 67, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (286, 67, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (287, 68, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (288, 68, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (289, 68, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (290, 68, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (291, 69, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (292, 69, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (293, 69, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (294, 69, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (295, 70, 'Number of Pages', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (296, 70, 'Binding Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (297, 70, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (298, 70, 'Cover Finish', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (299, 70, 'Color Printing', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (300, 70, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (301, 71, 'Number of Pages', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (302, 71, 'Binding Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (303, 71, 'Paper Type', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (304, 71, 'Cover Finish', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (305, 71, 'Color Printing', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (306, 71, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (307, 72, 'Number of Pages', '121');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (308, 72, 'Binding Type', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (309, 72, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (310, 72, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (311, 72, 'Color Printing', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (312, 72, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (313, 73, 'Number of Pages', '31');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (314, 73, 'Binding Type', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (315, 73, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (316, 73, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (317, 73, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (318, 73, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (319, 74, 'Number of Pages', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (320, 74, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (321, 74, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (322, 74, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (323, 74, 'Color Printing', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (324, 74, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (325, 75, 'PageCount', '12');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (326, 75, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (327, 75, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (328, 75, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (329, 76, 'Number of Pages', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (330, 76, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (331, 76, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (332, 76, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (333, 76, 'Color Printing', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (334, 76, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (335, 77, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (336, 77, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (337, 77, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (338, 77, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (339, 78, 'PageCount', '2141');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (340, 78, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (341, 78, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (342, 78, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (343, 79, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (344, 79, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (345, 79, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (346, 79, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (347, 80, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (348, 80, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (349, 80, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (350, 80, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (351, 81, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (352, 81, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (353, 81, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (354, 81, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (355, 82, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (356, 82, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (357, 82, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (358, 82, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (359, 83, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (360, 83, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (361, 83, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (362, 83, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (363, 84, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (364, 84, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (365, 84, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (366, 84, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (367, 85, 'PageCount', '123');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (368, 85, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (369, 85, 'PaperType', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (370, 85, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (371, 86, 'PageCount', '21');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (372, 86, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (373, 86, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (374, 86, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (375, 87, 'PageCount', '213');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (376, 87, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (377, 87, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (378, 87, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (379, 88, 'PageCount', '213');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (380, 88, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (381, 88, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (382, 88, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (383, 89, 'PageCount', '213');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (384, 89, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (385, 89, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (386, 89, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (387, 90, 'PageCount', '21');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (388, 90, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (389, 90, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (390, 90, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (391, 91, 'PageCount', '21');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (392, 91, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (393, 91, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (394, 91, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (395, 92, 'Number of Pages', '22');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (396, 92, 'Binding Type', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (397, 92, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (398, 92, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (399, 92, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (400, 92, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (401, 93, 'PageCount', '23');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (402, 93, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (403, 93, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (404, 93, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (405, 94, 'Number of Pages', '23');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (406, 94, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (407, 94, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (408, 94, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (409, 94, 'Color Printing', 'Mixed');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (410, 94, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (411, 95, 'Number of Pages', '23');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (412, 95, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (413, 95, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (414, 95, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (415, 95, 'Color Printing', 'Mixed');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (416, 95, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (417, 96, 'Number of Pages', '23');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (418, 96, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (419, 96, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (420, 96, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (421, 96, 'Color Printing', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (422, 96, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (423, 97, 'Number of Pages', '23');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (424, 97, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (425, 97, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (426, 97, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (427, 97, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (428, 97, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (429, 98, 'Number of Pages', '213');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (430, 98, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (431, 98, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (432, 98, 'Cover Finish', 'Soft Touch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (433, 98, 'Color Printing', 'Mixed');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (434, 98, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (435, 99, 'Number of Pages', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (436, 99, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (437, 99, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (438, 99, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (439, 99, 'Color Printing', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (440, 99, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (441, 100, 'PageCount', '333');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (442, 100, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (443, 100, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (444, 100, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (445, 101, 'Number of Pages', '44');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (446, 101, 'Binding Type', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (447, 101, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (448, 101, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (449, 101, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (450, 101, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (451, 102, 'PageCount', '44');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (452, 102, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (453, 102, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (454, 102, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (455, 103, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (456, 103, 'Number of copies', '1245');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (457, 103, 'Size', '17”x22”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (458, 103, 'Type of paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (459, 103, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (460, 103, 'Lamination', 'Single Month (12 pages)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (461, 103, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (462, 103, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (463, 104, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (464, 104, 'Color', 'More Than 1 Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (
    465,
    104,
    'Calendar Type',
    'Single Month (12 pages)'
  );
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (466, 104, 'Size', '11”x17”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (467, 105, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (468, 105, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (469, 105, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (470, 105, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (471, 105, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (472, 105, 'Business', 'GadgetY');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (473, 105, 'Number of Cards', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (474, 105, 'Size', '2” x 3.5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (475, 105, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (476, 105, 'Color', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (477, 105, 'Lamination', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (478, 105, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (479, 105, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (480, 106, 'Customization', 'NO');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (481, 106, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (482, 106, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (483, 106, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (484, 106, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (485, 106, 'Business', 'GadgetY');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (486, 106, 'Number of Cards', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (487, 106, 'Size', '2” x 3.5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (488, 106, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (489, 106, 'Color', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (490, 106, 'Lamination', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (491, 106, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (492, 106, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (493, 107, 'Customization', 'NO');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (494, 107, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (495, 107, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (496, 107, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (497, 107, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (498, 107, 'Business', 'GadgetY');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (499, 107, 'Number of Cards', '130');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (500, 107, 'Size', '2” x 3.5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (501, 107, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (502, 107, 'Color', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (503, 107, 'Lamination', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (504, 107, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (505, 107, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (506, 108, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (507, 108, 'Size', 'A5');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (508, 108, 'Color', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (509, 108, 'Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (510, 108, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (511, 109, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (512, 109, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (513, 109, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (514, 109, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (515, 109, 'Event Name', '2214qwe');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (516, 109, 'Size', '5x7 inches');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (517, 109, 'Paper Type', 'Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (518, 109, 'Print Method', 'Computer Printout');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (519, 109, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (520, 110, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (521, 110, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (522, 110, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (523, 110, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (524, 110, 'Size', '3” x 3”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (525, 110, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (526, 110, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (527, 111, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (528, 111, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (529, 111, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (530, 111, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (531, 111, 'Business', 'Business');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (532, 111, 'Quantity', '210');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (533, 111, 'Size', 'A5');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (534, 111, 'Paper Type', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (535, 111, 'Layout', 'Single Page');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (536, 111, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (537, 112, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (538, 112, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (539, 112, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (540, 112, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (541, 112, 'Business', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (542, 112, 'Number of copies (min)', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (543, 112, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (544, 112, 'Booklet Finish', 'Padded');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (545, 112, 'Size', 'A4');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (546, 112, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (547, 113, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (548, 113, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (549, 113, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (550, 113, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (551, 113, 'Business', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (552, 113, 'Number of copies (min)', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (553, 113, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (554, 113, 'Booklet Finish', 'Padded');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (555, 113, 'Size', 'A5');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (556, 113, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (557, 114, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (558, 114, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (559, 114, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (560, 114, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (561, 114, 'Business', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (562, 114, 'Number of copies (min)', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (563, 114, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (564, 114, 'Booklet Finish', 'Padded');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (565, 114, 'Size', 'A5');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (566, 114, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (567, 115, 'Name', 'Aaron Oriasel');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (568, 115, 'Email', 'aaron@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (569, 115, 'Address', 'Bantay, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (570, 115, 'Phone', '09321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (571, 115, 'Business', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (572, 115, 'Number of copies (min)', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (573, 115, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (574, 115, 'Booklet Finish', 'Stapled');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (575, 115, 'Size', 'Half Page');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (576, 115, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (577, 116, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (578, 116, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (579, 116, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (580, 116, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (581, 116, 'Business', 'MOTOS');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (582, 116, 'Number of copies (min)', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (583, 116, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (584, 116, 'Booklet Finish', 'Padded');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (585, 116, 'Size', 'A5');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (586, 116, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (587, 117, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (588, 117, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (589, 117, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (590, 117, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (591, 117, 'Number of Posters (min)', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (592, 117, 'Size', 'A3');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (593, 117, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (594, 117, 'Lamination', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (595, 117, 'Color', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (596, 117, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (597, 117, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (598, 118, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (599, 118, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (600, 118, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (601, 118, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (602, 118, 'Businessname', 'GadgetY');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (603, 118, 'Number of Tickets', '55');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (604, 118, 'Size', '2” x 5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (605, 118, 'With Stub', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (606, 118, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (607, 119, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (608, 119, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (609, 119, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (610, 119, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (611, 120, 'PageCount', '11');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (612, 120, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (613, 120, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (614, 120, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (615, 121, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (616, 121, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (617, 121, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (618, 121, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (619, 122, 'PageCount', '11');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (620, 122, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (621, 122, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (622, 122, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (623, 123, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (624, 123, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (625, 123, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (626, 123, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (627, 124, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (628, 124, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (629, 124, 'PaperType', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (630, 124, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (631, 125, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (632, 125, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (633, 125, 'PaperType', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (634, 125, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (635, 126, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (636, 126, 'BindingType', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (637, 126, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (638, 126, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (639, 127, 'Number of Pages', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (640, 127, 'Binding Type', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (641, 127, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (642, 127, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (643, 127, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (644, 127, 'Additional Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (645, 128, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (646, 128, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (647, 128, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (648, 128, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (649, 128, 'Size', '3” x 3”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (650, 128, 'Paper Type', 'Transparent');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (651, 128, 'Message', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (652, 129, 'PageCount', '111');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (653, 129, 'BindingType', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (654, 129, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (655, 129, 'Notes', 'asds');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (656, 130, 'PageCount', '212');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (657, 130, 'BindingType', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (658, 130, 'PaperType', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (659, 130, 'Notes', '');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (660, 134, 'Page Count', '44');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (661, 134, 'Binding Type', 'Spiral');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (662, 134, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (663, 136, 'Number of Pages', '300');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (664, 136, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (665, 136, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (666, 136, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (667, 136, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (668, 137, 'Number of Pages', '122');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (669, 137, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (670, 137, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (671, 137, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (672, 137, 'Color Printing', 'Mixed');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (673, 138, 'Number of Pages', '44');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (674, 138, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (675, 138, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (676, 138, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (677, 138, 'Color Printing', 'Mixed');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (678, 139, 'Page Count', '41');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (679, 139, 'Binding Type', 'Hardcover');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (680, 139, 'Paper Type', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (681, 140, 'Number of Pages', '42');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (682, 140, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (683, 140, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (684, 140, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (685, 140, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (686, 142, 'Number of Pages', '50');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (687, 142, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (688, 142, 'Paper Type', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (689, 142, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (690, 142, 'Color Printing', 'Mixed');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (691, 143, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (692, 143, 'Number of Copies', '1200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (693, 143, 'Size', '8.5”x14”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (694, 143, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (695, 143, 'Colored', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (696, 143, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (697, 143, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (698, 144, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (699, 144, 'Color', 'Single Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (
    700,
    144,
    'Calendar Type',
    'Single Month (12 pages)'
  );
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (701, 144, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (702, 145, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (703, 145, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (704, 145, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (705, 145, 'Address', 'Tabo, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (706, 145, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (707, 145, 'Business', 'motorX');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (708, 145, 'Number of Cards', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (709, 145, 'Size', '2” x 3.5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (710, 145, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (711, 145, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (712, 146, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (713, 146, 'Flyer Size', 'A4');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (714, 146, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (715, 146, 'Color', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (716, 146, 'Lamination', 'Gloss');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (717, 146, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (718, 147, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (719, 147, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (720, 147, 'Address', 'Tabo, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (721, 147, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (722, 147, 'Event Name', 'Jobert');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (723, 147, 'Size', '5x7 inches');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (724, 147, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (725, 147, 'Print Method', 'Computer Printout');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (726, 148, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (727, 148, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (728, 148, 'Address', 'Tabo, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (729, 148, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (730, 148, 'Size', '3” x 3”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (731, 148, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (732, 149, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (733, 149, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (734, 149, 'Address', 'Tabo, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (735, 149, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (736, 149, 'Business', 'Icons');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (737, 149, 'Quantity', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (738, 149, 'Size', 'A4');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (739, 149, 'Paper Type', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (740, 149, 'Layout', 'Single Page');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (741, 150, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (742, 150, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (743, 150, 'Address', 'Tabo, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (744, 150, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (745, 150, 'Business', 'Icons');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (746, 150, 'Quantity', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (747, 150, 'Paper Type', 'Carbonized');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (748, 150, 'Booklet Finish', 'Padded');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (749, 150, 'Size', 'Half Page');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (750, 151, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (751, 151, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (752, 151, 'Address', 'Tabo, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (753, 151, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (754, 151, 'Number of Posters', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (755, 151, 'Size', 'A3');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (756, 151, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (757, 151, 'Lamination', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (758, 151, 'Color', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (759, 151, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (760, 152, 'Name', 'Anthony Portento');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (761, 152, 'Email', 'anthony@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (762, 152, 'Address', 'Tabo, Boac, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (763, 152, 'Phone', '9321223551');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (764, 152, 'Business Name', 'motorX');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (765, 152, 'Number of Tickets', '55');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (766, 152, 'Size', '2” x 5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (767, 152, 'With Stub', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (768, 153, 'Page Count', '555');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (769, 153, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (770, 153, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (771, 154, 'Page Count', '55');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (772, 154, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (773, 154, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (774, 155, 'Page Count', '222');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (775, 155, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (776, 155, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (777, 156, 'Page Count', '213');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (778, 156, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (779, 156, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (780, 157, 'Page Count', '23');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (781, 157, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (782, 157, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (783, 158, 'Page Count', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (784, 158, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (785, 158, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (786, 159, 'Number of Pages', '12');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (787, 159, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (788, 159, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (789, 159, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (790, 159, 'Color Printing', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (791, 160, 'Page Count', '12');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (792, 160, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (793, 160, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (794, 161, 'Number of Pages', '90');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (795, 161, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (796, 161, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (797, 161, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (798, 161, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (803, 163, 'Page Count', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (804, 163, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (805, 163, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (806, 164, 'Name', 'Niel Osinsao');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (807, 164, 'Email', 'niel@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (808, 164, 'Address', 'agumaymayan, boac Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (809, 164, 'Phone', '09833222113');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (810, 164, 'Business', 'ICons');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (811, 164, 'Quantity', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (812, 164, 'Paper Type', 'Colored Bondpaper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (813, 164, 'Booklet Finish', 'Stapled');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (814, 164, 'Size', 'A5');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (815, 165, 'Page Count', '23');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (816, 165, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (817, 165, 'Paper Type', 'Bond Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (818, 166, 'Page Count', '12');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (819, 166, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (820, 166, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (821, 167, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (822, 167, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (823, 167, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (824, 167, 'Type of Paper', 'Book Paper');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (825, 167, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (826, 167, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (827, 167, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (828, 168, 'Page Count', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (829, 168, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (830, 168, 'Paper Type', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (831, 169, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (832, 169, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (833, 169, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (834, 169, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (835, 169, 'Colored', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (836, 169, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (837, 169, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (838, 170, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (839, 170, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (840, 170, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (841, 170, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (842, 170, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (843, 170, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (844, 170, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (845, 171, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (846, 171, 'Number of Copies', '1200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (847, 171, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (848, 171, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (849, 171, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (850, 171, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (851, 171, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (852, 172, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (853, 172, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (854, 172, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (855, 172, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (856, 172, 'Business Name', 'GadgetY');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (857, 172, 'Number of Tickets', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (858, 172, 'Size', '2” x 5” (Standard)');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (859, 172, 'With Stub', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (860, 173, 'Number of Pages', '200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (861, 173, 'Binding Type', 'Perfect Binding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (862, 173, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (863, 173, 'Cover Finish', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (864, 173, 'Color Printing', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (865, 174, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (866, 174, 'Flyer Size', 'DL');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (867, 174, 'Paper Type', 'Premium Card');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (868, 174, 'Color', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (869, 174, 'Lamination', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (870, 174, 'Print', 'Single side');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (871, 175, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (872, 175, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (873, 175, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (874, 175, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (875, 175, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (876, 175, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (877, 175, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (878, 176, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (879, 176, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (880, 176, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (881, 176, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (882, 176, 'Event Name', 'Wedding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (883, 176, 'Size', '5x7 inches');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (884, 176, 'Paper Type', 'Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (885, 176, 'Print Method', 'Computer Printout');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (886, 177, 'Name', 'manager');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (887, 177, 'Email', 'manager@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (888, 177, 'Address', 'HQ');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (889, 177, 'Phone', '0');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (890, 177, 'Event Name', 'Wedding');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (891, 177, 'Size', '5x7 inches');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (892, 177, 'Paper Type', 'Colored');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (893, 177, 'Print Method', 'Computer Printout');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (894, 178, 'Name', 'Joshua Valenzuela');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (895, 178, 'Email', 'joshua@gmail.com');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (896, 178, 'Address', 'Mahunig, Gasan, Marinduque');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (897, 178, 'Phone', '09083705595');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (898, 178, 'Number of Posters', '120');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (899, 178, 'Size', 'Custom');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (900, 178, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (901, 178, 'Lamination', 'Gloss');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (902, 178, 'Color', 'Full Color');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (903, 178, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (904, 179, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (905, 179, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (906, 179, 'Size', '17”x22”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (907, 179, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (908, 179, 'Colored', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (909, 179, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (910, 179, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (911, 180, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (912, 180, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (913, 180, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (914, 180, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (915, 180, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (916, 180, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (917, 180, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (918, 181, 'Number of Pages', '100');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (919, 181, 'Book Type', 'Souvenir Program');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (920, 181, 'Binding Type', 'Saddle Stitch');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (921, 181, 'Paper Type', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (
    922,
    181,
    'Book Size',
    '5.5\" x 8.5\" (13.97 x 21.59 cm)'
  );
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (923, 181, 'Cover Finish', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (924, 181, 'Color Printing', 'Black & White');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (925, 182, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (926, 182, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (927, 182, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (928, 182, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (929, 182, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (930, 182, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (931, 182, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (932, 183, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (933, 183, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (934, 183, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (935, 183, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (936, 183, 'Colored', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (937, 183, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (938, 183, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (939, 184, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (940, 184, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (941, 184, 'Size', '17”x22”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (942, 184, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (943, 184, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (944, 184, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (945, 184, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (946, 185, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (947, 185, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (948, 185, 'Size', '17”x22”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (949, 185, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (950, 185, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (951, 185, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (952, 185, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (953, 186, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (954, 186, 'Number of Copies', '1200');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (955, 186, 'Size', '22”x34”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (956, 186, 'Type of Paper', 'Glossy');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (957, 186, 'Colored', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (958, 186, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (959, 186, 'Print', 'Back to back');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (960, 187, 'Customization', 'No');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (961, 187, 'Number of Copies', '1000');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (962, 187, 'Size', '17”x22”');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (963, 187, 'Type of Paper', 'Matte');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (964, 187, 'Colored', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (965, 187, 'Lamination', 'Yes');
INSERT INTO
  `order_item_attributes` (
    `order_item_attribute_id`,
    `order_item_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (966, 187, 'Print', 'Back to back');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: orderitems
# ------------------------------------------------------------

INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (21, 1, 1, 200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (22, 2, 1, 250, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (23, 3, 2, 250, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (24, 4, 1, 500, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (25, 5, 2, 200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (26, 6, 2, 1000, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (27, 7, 1, 1000, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (28, 8, 1, 450, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (29, 9, 3, 1200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (30, 10, 4, 150, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (31, 11, 2, 120, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (32, 12, 4, 120, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (33, 13, 4, 150, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (34, 14, 6, 1200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (35, 15, 7, 60, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (36, 16, 8, 120, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (37, 17, 8, 300, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (38, 18, 9, 1210, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (39, 19, 9, 120, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (40, 20, 10, 150, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (41, 21, 11, 1000, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (42, 22, 11, 1000, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (43, 23, 12, 55, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (44, 24, 4, 110, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (45, 25, 11, 110, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (46, 26, 1, 600, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (47, 27, 4, 800, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (48, 28, 6, 1500, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (49, 29, 1, 500, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (50, 30, 12, 90, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (51, 31, 1, 200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (52, 32, 1, 100, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (53, 33, 2, 390, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (54, 34, 1, 120, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (55, 35, 1, 200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (56, 36, 1, 200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (57, 37, 1, 900, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (58, 38, 1, 300, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (59, 39, 1, 200, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (60, 40, 1, 900, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (61, 41, 1, 1111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (62, 42, 1, 2122, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (63, 43, 1, 111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (64, 44, 1, 2000, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    65,
    45,
    1,
    1111,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760092740285.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    66,
    46,
    1,
    1112,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760093696688.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    67,
    47,
    1,
    1111,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760094064963.pdf',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (68, 48, 1, 2222, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    69,
    49,
    1,
    1111,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760100450029.pdf',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (70, 50, 2, 566, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (71, 51, 2, 1111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (72, 52, 2, 11112, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (73, 53, 2, 1212, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (74, 54, 2, 111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (75, 55, 1, 123, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (76, 56, 2, 1111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (77, 57, 1, 1234, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (78, 58, 1, 123, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    79,
    59,
    1,
    11212,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109588560.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    80,
    60,
    1,
    11212,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109615026.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    81,
    61,
    1,
    11212,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109616191.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    82,
    62,
    1,
    11212,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109629213.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    83,
    63,
    1,
    11212,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109681260.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    84,
    64,
    1,
    11212,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109687151.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    85,
    65,
    1,
    11212,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109716625.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (86, 66, 1, 213, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    87,
    67,
    1,
    211,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760109991453.pdf',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    88,
    68,
    1,
    211,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760110005692.pdf',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (89, 69, 1, 211, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    90,
    70,
    1,
    232,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760110155885.docx',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    91,
    71,
    1,
    232,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760110327697.docx',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (92, 72, 2, 213, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    93,
    73,
    1,
    24,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760111756102.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (94, 74, 2, 342, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (95, 75, 2, 342, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (96, 76, 2, 233, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    97,
    77,
    2,
    232,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760114026321.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    98,
    78,
    2,
    124,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760115276423.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    99,
    79,
    2,
    111,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760115358473.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    100,
    80,
    1,
    233,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760180325187.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    101,
    81,
    2,
    444,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760180362086.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    102,
    82,
    1,
    444,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760180469793.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    103,
    83,
    3,
    1245,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760186463936.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    104,
    84,
    4,
    160,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760188204185.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    105,
    85,
    5,
    120,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760189524358.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    106,
    86,
    5,
    100,
    'Normal',
    'Out for delivery',
    '/uploads/orderfiles/1760189777640.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    107,
    87,
    5,
    130,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760189839338.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    108,
    88,
    6,
    1000,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760254536433.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    109,
    89,
    7,
    55,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760255125140.jpg',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    110,
    90,
    8,
    100,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760256220401.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    111,
    91,
    9,
    210,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760256991895.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    112,
    92,
    10,
    120,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760257943653.jpg',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    113,
    93,
    10,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760258532402.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    114,
    94,
    10,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760259985933.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    115,
    95,
    10,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760260379060.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    116,
    96,
    10,
    100,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760267744789.png',
    '/uploads/orderfiles/1760267744800.png',
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    117,
    97,
    11,
    100,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760269093746.jpg',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    118,
    98,
    12,
    55,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760270125658.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (119, 99, 1, 1111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (120, 100, 1, 1111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (121, 101, 1, 111, 'Normal', 'Ongoing', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (122, 102, 1, 1111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (123, 103, 1, 1111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (124, 104, 1, 1111, 'Normal', 'Ongoing', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    125,
    105,
    1,
    111,
    'Normal',
    'Completed',
    NULL,
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    126,
    106,
    1,
    1111,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760287835686.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    127,
    107,
    2,
    1111,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760287867945.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    128,
    108,
    8,
    1111,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760421683704.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (129, 109, 1, 111, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    130,
    110,
    1,
    222,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760454443929.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    131,
    117,
    1,
    111,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760501796867.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    132,
    118,
    1,
    121,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760502506026.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    133,
    119,
    1,
    321,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760503982934.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    134,
    120,
    1,
    331,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760504146403.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    135,
    121,
    2,
    500,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760504311143.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (136, 122, 2, 211, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (137, 123, 2, 312, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (138, 124, 2, 4444, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    139,
    125,
    1,
    441,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760505691201.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (140, 126, 2, 412, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (141, 127, 5, 120, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    142,
    128,
    2,
    555,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760506200503.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    143,
    129,
    3,
    1200,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760506303267.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    144,
    130,
    4,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760506445539.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    145,
    131,
    5,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760506582083.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    146,
    132,
    6,
    13000,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760506735489.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    147,
    133,
    7,
    55,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760506827326.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    148,
    134,
    8,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760507131234.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    149,
    135,
    9,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760507180539.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    150,
    136,
    10,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760507236234.png',
    '/uploads/orderfiles/1760507236237.png',
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    151,
    137,
    11,
    120,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760507383667.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    152,
    138,
    12,
    55,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760507483215.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    153,
    139,
    1,
    1000,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760507701948.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    154,
    140,
    1,
    122,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760507766804.pdf',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    155,
    141,
    1,
    121,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760508509001.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    156,
    142,
    1,
    122,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760509465298.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (157, 143, 1, 123, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    158,
    144,
    1,
    12,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760509726967.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    159,
    145,
    2,
    10,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760509763758.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    160,
    146,
    1,
    10,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1760509805716.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    161,
    147,
    2,
    10,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760509830855.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    163,
    149,
    1,
    10,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760512112422.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    164,
    150,
    10,
    100,
    'Normal',
    'Ongoing',
    '/uploads/orderfiles/1760512275432.png',
    '/uploads/orderfiles/1760512275443.png',
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    165,
    151,
    1,
    111,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760512550750.docx',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    166,
    152,
    1,
    123,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1760512575038.pdf',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (167, 153, 3, 1000, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    168,
    154,
    1,
    112,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1762838640897.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    169,
    155,
    3,
    1000,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1762866696627.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    170,
    156,
    3,
    1000,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1762951858091.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    171,
    157,
    3,
    1200,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1762952224510.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    172,
    158,
    12,
    100,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1763041554755.png',
    NULL,
    0.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    173,
    159,
    2,
    100,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1763043292180.png',
    NULL,
    220000.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    174,
    160,
    6,
    1000,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1763044225993.png',
    NULL,
    21800.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    175,
    161,
    3,
    1000,
    'Normal',
    'Pending',
    NULL,
    NULL,
    47200.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (176, 162, 7, 55, 'Normal', 'Pending', NULL, NULL, 0.00);
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    177,
    163,
    7,
    55,
    'Normal',
    'Completed',
    NULL,
    NULL,
    7320.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    178,
    164,
    11,
    120,
    'Normal',
    'Completed',
    NULL,
    NULL,
    12000.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    179,
    165,
    3,
    1000,
    'Normal',
    'Pending',
    NULL,
    NULL,
    41800.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    180,
    166,
    3,
    1000,
    'Normal',
    'Pending',
    NULL,
    NULL,
    47200.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    181,
    167,
    2,
    119,
    'Normal',
    'Pending',
    NULL,
    NULL,
    31425.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    182,
    168,
    3,
    1000,
    'Normal',
    'Completed',
    '/uploads/orderfiles/1763128381678.png',
    NULL,
    47200.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    183,
    169,
    3,
    1000,
    'Normal',
    'Pending',
    NULL,
    NULL,
    41800.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    184,
    170,
    3,
    1000,
    'Normal',
    'Pending',
    '/uploads/orderfiles/1763207183206.png',
    NULL,
    47200.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    185,
    171,
    3,
    1000,
    'Normal',
    'Pending',
    NULL,
    NULL,
    47200.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    186,
    172,
    3,
    1200,
    'Normal',
    'Pending',
    NULL,
    NULL,
    49800.00
  );
INSERT INTO
  `orderitems` (
    `order_item_id`,
    `order_id`,
    `product_id`,
    `quantity`,
    `urgency`,
    `status`,
    `file1`,
    `file2`,
    `estimated_price`
  )
VALUES
  (
    187,
    173,
    3,
    1000,
    'Normal',
    'Pending',
    NULL,
    NULL,
    47200.00
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: orders
# ------------------------------------------------------------

INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (1, 11, '2025-10-06 20:27:12', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (2, 11, '2025-10-06 20:36:35', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (3, 11, '2025-10-06 20:47:05', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (4, 6, '2025-10-06 20:51:51', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (5, 6, '2025-10-06 20:52:23', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (6, 6, '2025-10-06 22:45:22', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (7, 6, '2025-10-06 22:45:48', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (8, 6, '2025-10-07 08:28:55', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (9, 6, '2025-10-07 17:20:36', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (10, 6, '2025-10-07 20:50:35', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (11, 12, '2025-10-07 21:04:02', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (12, 12, '2025-10-07 21:05:50', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (13, 12, '2025-10-07 21:35:47', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (14, 12, '2025-10-07 21:37:21', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (15, 12, '2025-10-07 21:58:12', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (16, 11, '2025-10-07 22:14:39', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (17, 11, '2025-10-07 23:00:17', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (18, 6, '2025-10-07 23:17:29', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (19, 6, '2025-10-08 10:07:27', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (20, 6, '2025-10-08 12:55:19', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (21, 6, '2025-10-08 13:48:54', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (22, 12, '2025-10-08 14:18:40', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (23, 12, '2025-10-08 14:40:38', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (24, 12, '2025-10-08 14:41:04', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (25, 12, '2025-10-08 14:43:19', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (26, 11, '2025-10-08 18:40:53', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (27, 6, '2025-10-08 21:24:27', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (28, 11, '2025-10-08 22:10:24', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (29, 12, '2025-10-09 16:13:21', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (30, 11, '2025-10-09 17:17:24', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (31, 6, '2025-10-09 21:22:43', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (32, 12, '2025-10-10 10:42:00', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (33, 12, '2025-10-10 10:53:04', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (34, 11, '2025-10-10 11:44:15', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (35, 11, '2025-10-10 11:46:10', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (36, 11, '2025-10-10 11:55:14', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (37, 12, '2025-10-10 16:09:39', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (38, 12, '2025-10-10 16:31:07', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (39, 12, '2025-10-10 17:03:01', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (40, 6, '2025-10-10 18:20:52', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (41, 6, '2025-10-10 18:28:04', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (42, 6, '2025-10-10 18:30:45', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (43, 6, '2025-10-10 18:32:45', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (44, 6, '2025-10-10 18:33:11', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (45, 6, '2025-10-10 18:39:00', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (46, 6, '2025-10-10 18:54:56', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (47, 6, '2025-10-10 19:01:04', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (48, 6, '2025-10-10 19:46:51', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (49, 6, '2025-10-10 20:47:29', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (50, 11, '2025-10-10 21:45:51', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (51, 11, '2025-10-10 21:53:29', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (52, 11, '2025-10-10 21:58:14', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (53, 11, '2025-10-10 22:06:08', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (54, 11, '2025-10-10 22:09:51', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (55, 11, '2025-10-10 22:19:58', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (56, 6, '2025-10-10 23:10:17', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (57, 6, '2025-10-10 23:12:55', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (58, 6, '2025-10-10 23:16:23', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (59, 6, '2025-10-10 23:19:48', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (60, 6, '2025-10-10 23:20:15', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (61, 6, '2025-10-10 23:20:16', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (62, 6, '2025-10-10 23:20:29', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (63, 6, '2025-10-10 23:21:21', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (64, 6, '2025-10-10 23:21:27', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (65, 6, '2025-10-10 23:21:56', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (66, 6, '2025-10-10 23:22:46', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (67, 6, '2025-10-10 23:26:31', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (68, 6, '2025-10-10 23:26:45', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (69, 6, '2025-10-10 23:28:01', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (70, 11, '2025-10-10 23:29:15', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (71, 11, '2025-10-10 23:32:07', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (72, 11, '2025-10-10 23:33:50', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (73, 11, '2025-10-10 23:55:56', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (74, 11, '2025-10-10 23:56:36', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (75, 11, '2025-10-10 23:56:43', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (76, 11, '2025-10-11 00:27:11', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (77, 11, '2025-10-11 00:33:46', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (78, 11, '2025-10-11 00:54:36', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (79, 11, '2025-10-11 00:55:58', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (80, 11, '2025-10-11 18:58:45', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (81, 11, '2025-10-11 18:59:22', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (82, 11, '2025-10-11 19:01:09', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (83, 11, '2025-10-11 20:41:03', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (84, 11, '2025-10-11 21:10:04', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (85, 11, '2025-10-11 21:32:04', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (86, 11, '2025-10-11 21:36:17', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (87, 11, '2025-10-11 21:37:19', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (88, 12, '2025-10-12 15:35:36', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (89, 12, '2025-10-12 15:45:25', 5000.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (90, 12, '2025-10-12 16:03:40', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (91, 12, '2025-10-12 16:16:31', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (92, 12, '2025-10-12 16:32:23', 2500.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (93, 12, '2025-10-12 16:42:12', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (94, 12, '2025-10-12 17:06:25', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (95, 12, '2025-10-12 17:12:59', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (96, 11, '2025-10-12 19:15:44', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (97, 11, '2025-10-12 19:38:13', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (98, 11, '2025-10-12 19:55:25', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (99, 11, '2025-10-12 23:48:55', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (100, 11, '2025-10-13 00:10:10', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (101, 11, '2025-10-13 00:12:17', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (102, 11, '2025-10-13 00:22:48', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (103, 11, '2025-10-13 00:33:39', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (104, 11, '2025-10-13 00:38:42', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (105, 11, '2025-10-13 00:40:38', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (106, 11, '2025-10-13 00:50:35', 4000.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (107, 11, '2025-10-13 00:51:07', 10.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (108, 11, '2025-10-14 14:01:23', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (109, 11, '2025-10-14 23:01:57', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (110, 11, '2025-10-14 23:07:23', 4500.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (111, 14, '2025-10-15 11:50:01', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (112, 14, '2025-10-15 11:50:11', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (113, 14, '2025-10-15 11:50:51', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (114, 14, '2025-10-15 11:51:33', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (115, 14, '2025-10-15 11:56:56', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (116, 11, '2025-10-15 12:11:11', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (117, 11, '2025-10-15 12:16:36', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (118, 11, '2025-10-15 12:28:25', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (119, 11, '2025-10-15 12:53:02', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (120, 11, '2025-10-15 12:55:46', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (121, 11, '2025-10-15 12:58:31', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (122, 11, '2025-10-15 13:02:57', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (123, 11, '2025-10-15 13:06:26', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (124, 11, '2025-10-15 13:14:05', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (125, 11, '2025-10-15 13:21:31', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (126, 6, '2025-10-15 13:24:40', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (127, 6, '2025-10-15 13:25:31', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (128, 6, '2025-10-15 13:30:00', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (129, 6, '2025-10-15 13:31:43', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (130, 6, '2025-10-15 13:34:05', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (131, 6, '2025-10-15 13:36:22', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (132, 6, '2025-10-15 13:38:55', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (133, 6, '2025-10-15 13:40:27', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (134, 6, '2025-10-15 13:45:31', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (135, 6, '2025-10-15 13:46:20', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (136, 6, '2025-10-15 13:47:16', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (137, 6, '2025-10-15 13:49:43', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (138, 6, '2025-10-15 13:51:23', 825.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (139, 11, '2025-10-15 13:55:01', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (140, 11, '2025-10-15 13:56:06', 550.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (141, 11, '2025-10-15 14:08:28', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (142, 11, '2025-10-15 14:24:25', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (143, 11, '2025-10-15 14:26:06', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (144, 11, '2025-10-15 14:28:46', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (145, 11, '2025-10-15 14:29:23', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (146, 11, '2025-10-15 14:30:05', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (147, 11, '2025-10-15 14:30:30', 1500.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (149, 14, '2025-10-15 15:08:32', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (150, 14, '2025-10-15 15:11:15', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (151, 14, '2025-10-15 15:15:50', 5000.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (152, 14, '2025-10-15 15:16:15', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (153, 6, '2025-11-08 23:07:27', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (154, 11, '2025-11-11 13:24:00', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (155, 11, '2025-11-11 21:11:36', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (156, 11, '2025-11-12 20:50:57', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (157, 11, '2025-11-12 20:57:04', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (158, 11, '2025-11-13 21:45:54', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (159, 11, '2025-11-13 22:14:52', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (160, 11, '2025-11-13 22:30:25', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (161, 11, '2025-11-13 22:37:06', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (162, 11, '2025-11-13 22:54:49', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (163, 10, '2025-11-13 22:55:48', 10920.00, 3600.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (164, 11, '2025-11-13 23:19:31', 13000.00, 1000.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (165, 11, '2025-11-14 01:22:45', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (166, 11, '2025-11-14 07:17:34', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (167, 11, '2025-11-14 19:37:31', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (168, 11, '2025-11-14 21:53:01', 52200.00, 5000.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (169, 11, '2025-11-15 13:23:57', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (170, 30, '2025-11-15 19:46:23', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (171, 30, '2025-11-15 19:47:30', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (172, 30, '2025-11-15 19:49:01', 0.00, 0.00);
INSERT INTO
  `orders` (
    `order_id`,
    `user_id`,
    `order_date`,
    `total`,
    `manager_added`
  )
VALUES
  (173, 11, '2025-11-15 20:38:54', 0.00, 0.00);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: product_attributes
# ------------------------------------------------------------

INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (19, 1, 'Customization', 'Yes');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (20, 1, 'Name', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (21, 1, 'Email', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (22, 1, 'Location', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (23, 1, 'Contact Number', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (24, 1, 'Number of Copies', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (25, 1, 'Page Count', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (26, 1, 'Binding Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (27, 1, 'Paper Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (29, 1, 'Additional Notes', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (30, 2, 'Binding Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (31, 2, 'Paper Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (32, 2, 'Cover Finish', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (33, 2, 'Color Printing', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (34, 3, 'Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (35, 3, 'Paper Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (36, 3, 'Colored', 'Yes/No');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (37, 3, 'Lamination', 'Yes/No');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (38, 3, 'Print (Back to Back)', 'No');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (39, 4, 'Customization', 'Yes');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (40, 4, 'Color', 'Single color');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (41, 4, 'Minimum order', '100');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (42, 4, 'Calendar Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (43, 4, 'Calendar Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (44, 5, 'Customization', 'Yes');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (45, 5, 'Card Title', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (46, 5, 'Number of Cards', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (47, 5, 'Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (48, 5, 'Type of Paper', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (49, 5, 'Design Options', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (50, 5, 'Message', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (51, 6, 'Number of Copies min', '1000');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (52, 6, 'Flyer Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (53, 6, 'Paper Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (54, 6, 'Lamination', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (55, 6, 'Color', 'Yes/No');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (56, 6, 'Print (Back to Back)', 'Yes');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (57, 6, 'Notes', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (58, 7, 'Event Name', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (59, 7, 'Number of Copies Min', '50');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (60, 7, 'Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (61, 7, 'Paper Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (62, 7, 'Print Method', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (63, 7, 'Message', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (64, 8, 'Number of Copies', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (65, 8, 'Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (66, 8, 'Paper Type', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (67, 8, 'Message', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (68, 9, 'Business Name', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (69, 9, 'Number of Copies', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (70, 9, 'Color', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (71, 9, 'Layout', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (72, 9, 'Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (73, 9, 'Message', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (74, 10, 'Quantity (Min)', '100');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (75, 10, 'Paper Type', 'Colored Bondpaper');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (76, 10, 'Booklet Finish', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (77, 10, 'Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (78, 10, 'Message', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (79, 11, 'Number of Posters (Min)', '100');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (80, 11, 'Poster Size', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (81, 11, 'Paper Type', 'Premium Card');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (82, 11, 'Lamination', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (83, 11, 'Color', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (84, 11, 'Message', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (85, 12, 'Number of Tickets (Min)', '50');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (86, 12, 'Size', '2x5\"');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (87, 12, 'With Stub', '');
INSERT INTO
  `product_attributes` (
    `attribute_id`,
    `product_id`,
    `attribute_name`,
    `attribute_value`
  )
VALUES
  (88, 12, 'Message', '');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: products
# ------------------------------------------------------------

INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (1, 'Binding', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (2, 'Books', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (3, 'Brochure', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (4, 'Calendars', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (5, 'CallingCard', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (6, 'Flyers', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (7, 'Invitation', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (8, 'Label', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (9, 'NewsLetter', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (10, 'OfficialReceipt', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (11, 'Posters', 'Active', NULL);
INSERT INTO
  `products` (
    `product_id`,
    `product_name`,
    `status`,
    `attributes`
  )
VALUES
  (12, 'RaffleTicket', 'Active', NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: restore_history
# ------------------------------------------------------------

INSERT INTO
  `restore_history` (
    `id`,
    `filename`,
    `performed_by`,
    `status`,
    `restored_at`
  )
VALUES
  (
    1,
    'backup-2025-11-02T15-52-34-860Z.sql',
    'Admin',
    'Failed',
    '2025-11-02 23:53:38'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sales
# ------------------------------------------------------------

INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (7, 107, 'Books x1111', 10.00, '2025-10-13');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (8, 106, 'Binding x1111', 4000.00, '2025-10-13');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (14, 107, 'Books x1111', 10.00, '2025-10-14');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (15, 89, 'Invitation x55', 5000.00, '2025-10-14');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (
    16,
    92,
    'OfficialReceipt x120',
    2500.00,
    '2025-10-14'
  );
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (17, 107, 'Books x1111', 10.00, '2025-10-14');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (19, 110, 'Binding x222', 4500.00, '2025-10-15');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (20, 138, 'RaffleTicket x55', 825.00, '2025-10-15');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (21, 140, 'Binding x122', 550.00, '2025-10-15');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (22, 152, 'Binding x123', 0.00, '2025-10-28');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (23, 151, 'Binding x111', 5000.00, '2025-11-04');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (24, 160, 'Flyers x1000', 0.00, '2025-11-14');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (25, 163, 'Invitation x55', 2400.00, '2025-11-14');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (26, 164, 'Posters x120', 13000.00, '2025-11-14');
INSERT INTO
  `sales` (`id`, `order_item_id`, `item`, `amount`, `date`)
VALUES
  (27, 168, 'Brochure x1000', 52200.00, '2025-11-15');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sessions
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: supplies
# ------------------------------------------------------------

INSERT INTO
  `supplies` (
    `supply_id`,
    `supply_name`,
    `quantity`,
    `unit`,
    `price`,
    `created_at`
  )
VALUES
  (
    1,
    'Bond Paper',
    59,
    'Ream',
    220.00,
    '2025-10-08 17:47:47'
  );
INSERT INTO
  `supplies` (
    `supply_id`,
    `supply_name`,
    `quantity`,
    `unit`,
    `price`,
    `created_at`
  )
VALUES
  (
    3,
    'Ink Cartridge',
    10,
    'Bottle',
    180.00,
    '2025-10-08 17:47:47'
  );
INSERT INTO
  `supplies` (
    `supply_id`,
    `supply_name`,
    `quantity`,
    `unit`,
    `price`,
    `created_at`
  )
VALUES
  (
    8,
    'Paper Tape',
    40,
    'Roll',
    3.00,
    '2025-10-08 17:47:47'
  );
INSERT INTO
  `supplies` (
    `supply_id`,
    `supply_name`,
    `quantity`,
    `unit`,
    `price`,
    `created_at`
  )
VALUES
  (
    11,
    'Staple Wire',
    20,
    'Box',
    20.00,
    '2025-11-11 22:47:15'
  );
INSERT INTO
  `supplies` (
    `supply_id`,
    `supply_name`,
    `quantity`,
    `unit`,
    `price`,
    `created_at`
  )
VALUES
  (12, 'Tape', 10, 'Roll', 100.00, '2025-11-12 02:56:12');
INSERT INTO
  `supplies` (
    `supply_id`,
    `supply_name`,
    `quantity`,
    `unit`,
    `price`,
    `created_at`
  )
VALUES
  (
    13,
    'Gas (Fee)',
    1,
    '1',
    500.00,
    '2025-11-13 08:31:19'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    6,
    'Anthony Portento',
    'anthony@gmail.com',
    'Tabo, Boac, Marinduque',
    'motorX',
    'Active',
    '$2b$12$ovM26r8VrRB61CDpPTRuG.bPlQGkjO/DJVIrTpAS.sD9lVaEod15C',
    '9321223551',
    '2025-09-14 14:54:20',
    'user',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    9,
    'admin',
    'admin@gmail.com',
    'HQ',
    NULL,
    'Active',
    '$2b$12$9FBo1451FvvPILw29QDweuVf5TMmct7hzv5lHT98.gMPN9jHVjSui',
    '0',
    '2025-09-14 15:07:37',
    'admin',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    10,
    'manager',
    'manager@gmail.com',
    'HQ',
    NULL,
    'Active',
    '$2b$12$qCo6X6EWBdEe6CObjCD9g.DkQumUekpA/GM/bGxT/dniCpRfCTvNC',
    '0',
    '2025-09-14 15:08:15',
    'manager',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    11,
    'Joshua Valenzuela',
    'joshua@gmail.com',
    'Mahunig, Gasan, Marinduque',
    'GadgetY',
    'Active',
    '$2b$12$5sXqfKpjNqmju.G3Hgffi.dRSoOQ6r1uBWUx10aKcfYQ9fk26QeMe',
    '09083705595',
    '2025-10-06 17:19:47',
    'user',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    12,
    'Aaron Oriasel',
    'aaron@gmail.com',
    'Bantay, Boac, Marinduque',
    'MOTOS',
    'Active',
    '$2b$12$BTA/aXvI3fyQkj48sLmv/eB7WpMwuiRbVb5eRGrCf/Om3AvhUwNt2',
    '09321223551',
    '2025-10-07 20:52:35',
    'user',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    13,
    'carl madrigal',
    'carl@gmail.com',
    'gasan',
    NULL,
    'Active',
    '$2b$12$P11JMGJC8fish/ffiBgcjeXCiKNIxwryMYSYafzCFZDfClDjJoIKm',
    '09432237651',
    '2025-10-15 08:23:14',
    'user',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    14,
    'Niel Osinsao',
    'niel@gmail.com',
    'agumaymayan, boac Marinduque',
    NULL,
    'Active',
    '$2b$12$3.KGirsfgP6MBYCIWI/U.u.32Wdv8bL.eiFhlJN/YoQ.x2RHfzJaC',
    '09833222113',
    '2025-10-15 11:47:25',
    'user',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    22,
    'John Lloyd  Tesio',
    'jltesio23@gmail.com',
    'Gasan',
    NULL,
    'Active',
    '$2b$12$Uirg0Ez1Qv89CPwuxWERxOsdrCMA0OLwdDkPa1tfSG9d3b0UT/ef.',
    '09342332213',
    '2025-11-11 13:21:09',
    'user',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    24,
    'test name ',
    'a@H.com',
    'gasan',
    NULL,
    'Active',
    '$2b$12$mWgXg0d4cnLkdHccTundpufEsaE718434HbiPYj/gMMJSffcReyv.',
    '09083705595',
    '2025-11-12 23:11:18',
    'user',
    0
  );
INSERT INTO
  `users` (
    `user_id`,
    `name`,
    `email`,
    `address`,
    `business`,
    `status`,
    `password`,
    `phone`,
    `createdAt`,
    `role`,
    `is_archived`
  )
VALUES
  (
    30,
    'Joshua S. Valenzuela',
    'valenzuelajoshua759@gmail.com',
    'mahunig, gasan, marinduque',
    NULL,
    'Active',
    '$2b$12$bLbs6nFIVpsA6wZWo5RmI.RNN1Cmm4LFta4hlPFoXMe3B2qSgEh8e',
    '09083705595',
    '2025-11-15 16:17:18',
    'user',
    0
  );