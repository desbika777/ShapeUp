CREATE TABLE `anexos_academia` (
  `id` VARCHAR(191) NOT NULL,
  `ownerId` VARCHAR(191) NOT NULL,
  `category` ENUM('COMPROVANTE', 'AVALIACAO', 'MANUTENCAO', 'DOCUMENTO', 'OUTRO') NOT NULL DEFAULT 'OUTRO',
  `description` VARCHAR(180) NULL,
  `originalName` VARCHAR(191) NOT NULL,
  `fileName` VARCHAR(191) NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL,
  `size` INTEGER NOT NULL,
  `extension` VARCHAR(191) NOT NULL,
  `relativePath` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `anexos_academia_fileName_key`(`fileName`),
  INDEX `anexos_academia_ownerId_idx`(`ownerId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `anexos_academia`
  ADD CONSTRAINT `anexos_academia_ownerId_fkey`
  FOREIGN KEY (`ownerId`) REFERENCES `usuarios`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
