CREATE DATABASE IF NOT EXISTS `dinosaurios_db`;
USE `dinosaurios_db`;

CREATE TABLE IF NOT EXISTS `dinosaurios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `peso_toneladas` FLOAT NOT NULL,
  `carnivoro` BOOLEAN NOT NULL
);

TRUNCATE TABLE `dinosaurios`;

INSERT INTO `dinosaurios` (`nombre`, `peso_toneladas`, `carnivoro`) VALUES 
('Tiranosaurio Rex', 8.4, 1),
('Triceratops', 6.1, 0),
('Velociraptor', 0.015, 1),
('Braquiosaurio', 58.0, 0),
('Espinosaurio', 7.4, 1);
