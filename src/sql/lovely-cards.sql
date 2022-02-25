SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `cards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `music` text NOT NULL,
  `card_name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `card_content` (
  `id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `heading` varchar(200) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `card_images` (
  `id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `image` text NOT NULL,
  `image_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user`(
  `id` int(11) NOT NULL,
  `username` varchar(230) NOT NULL,
  `gmail` varchar(230) NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `card_content`
--
ALTER TABLE `card_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `card_content_ibfk_1` (`card_id`);

ALTER TABLE `card_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `card_images_ibfk_1` (`card_id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

ALTER TABLE `card_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `card_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `card_content`
  ADD CONSTRAINT `card_content_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `card_images`
  ADD CONSTRAINT `card_images_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
