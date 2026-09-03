-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `academyId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `academyId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `academyId` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `Workout` ADD COLUMN `staffMemberId` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `Academy` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Academy_document_key`(`document`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserRole_roleId_idx`(`roleId`),
    UNIQUE INDEX `UserRole_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffMember` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StaffMember_userId_key`(`userId`),
    INDEX `StaffMember_academyId_idx`(`academyId`),
    UNIQUE INDEX `StaffMember_academyId_cpf_key`(`academyId`, `cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Membership` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'CANCELED') NOT NULL DEFAULT 'ACTIVE',
    `cancellationReason` VARCHAR(191) NULL,
    `canceledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Membership_studentId_idx`(`studentId`),
    INDEX `Membership_planId_idx`(`planId`),
    INDEX `Membership_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PaymentMethod_academyId_idx`(`academyId`),
    UNIQUE INDEX `PaymentMethod_academyId_name_key`(`academyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,
    `paymentMethodId` VARCHAR(191) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Payment_membershipId_idx`(`membershipId`),
    INDEX `Payment_paymentMethodId_idx`(`paymentMethodId`),
    INDEX `Payment_status_idx`(`status`),
    INDEX `Payment_dueDate_idx`(`dueDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `instructions` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Exercise_academyId_idx`(`academyId`),
    UNIQUE INDEX `Exercise_academyId_name_key`(`academyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MuscleGroup` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MuscleGroup_academyId_idx`(`academyId`),
    UNIQUE INDEX `MuscleGroup_academyId_name_key`(`academyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExerciseMuscleGroup` (
    `id` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NOT NULL,
    `muscleGroupId` VARCHAR(191) NOT NULL,

    INDEX `ExerciseMuscleGroup_muscleGroupId_idx`(`muscleGroupId`),
    UNIQUE INDEX `ExerciseMuscleGroup_exerciseId_muscleGroupId_key`(`exerciseId`, `muscleGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutExercise` (
    `id` VARCHAR(191) NOT NULL,
    `workoutId` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL,
    `sets` INTEGER NULL,
    `repetitions` VARCHAR(191) NULL,
    `load` DECIMAL(8, 2) NULL,
    `restSeconds` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WorkoutExercise_exerciseId_idx`(`exerciseId`),
    UNIQUE INDEX `WorkoutExercise_workoutId_exerciseId_sortOrder_key`(`workoutId`, `exerciseId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhysicalAssessment` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `staffMemberId` VARCHAR(191) NULL,
    `assessmentDate` DATETIME(3) NOT NULL,
    `weight` DECIMAL(5, 2) NULL,
    `height` DECIMAL(5, 2) NULL,
    `bodyFatPercentage` DECIMAL(5, 2) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PhysicalAssessment_studentId_idx`(`studentId`),
    INDEX `PhysicalAssessment_staffMemberId_idx`(`staffMemberId`),
    INDEX `PhysicalAssessment_assessmentDate_idx`(`assessmentDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BodyMeasurement` (
    `id` VARCHAR(191) NOT NULL,
    `assessmentId` VARCHAR(191) NOT NULL,
    `bodyPart` VARCHAR(191) NOT NULL,
    `value` DECIMAL(6, 2) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BodyMeasurement_assessmentId_idx`(`assessmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceRecord` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `classScheduleId` VARCHAR(191) NULL,
    `checkInAt` DATETIME(3) NOT NULL,
    `source` ENUM('MANUAL', 'CLASS', 'CHECK_IN') NOT NULL DEFAULT 'MANUAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AttendanceRecord_studentId_idx`(`studentId`),
    INDEX `AttendanceRecord_classScheduleId_idx`(`classScheduleId`),
    INDEX `AttendanceRecord_checkInAt_idx`(`checkInAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassType` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `defaultCapacity` INTEGER NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ClassType_academyId_idx`(`academyId`),
    UNIQUE INDEX `ClassType_academyId_name_key`(`academyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `classTypeId` VARCHAR(191) NOT NULL,
    `staffMemberId` VARCHAR(191) NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `capacity` INTEGER NULL,
    `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELED') NOT NULL DEFAULT 'SCHEDULED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ClassSchedule_classTypeId_idx`(`classTypeId`),
    INDEX `ClassSchedule_staffMemberId_idx`(`staffMemberId`),
    INDEX `ClassSchedule_startsAt_idx`(`startsAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassEnrollment` (
    `id` VARCHAR(191) NOT NULL,
    `classScheduleId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `status` ENUM('ENROLLED', 'CANCELED', 'ATTENDED', 'MISSED') NOT NULL DEFAULT 'ENROLLED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ClassEnrollment_studentId_idx`(`studentId`),
    UNIQUE INDEX `ClassEnrollment_classScheduleId_studentId_key`(`classScheduleId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipment` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `acquiredAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Equipment_academyId_idx`(`academyId`),
    INDEX `Equipment_status_idx`(`status`),
    UNIQUE INDEX `Equipment_academyId_code_key`(`academyId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EquipmentMaintenance` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `scheduledAt` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,
    `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED') NOT NULL DEFAULT 'SCHEDULED',
    `cost` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EquipmentMaintenance_equipmentId_idx`(`equipmentId`),
    INDEX `EquipmentMaintenance_status_idx`(`status`),
    INDEX `EquipmentMaintenance_scheduledAt_idx`(`scheduledAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goal` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `targetDate` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'ACHIEVED', 'CANCELED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Goal_studentId_idx`(`studentId`),
    INDEX `Goal_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_academyId_idx`(`academyId`),
    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_readAt_idx`(`readAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_academyId_idx`(`academyId`),
    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_entity_entityId_idx`(`entity`, `entityId`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `PasswordResetToken_userId_idx` ON `PasswordResetToken`(`userId`);

-- CreateIndex
CREATE INDEX `Plan_academyId_idx` ON `Plan`(`academyId`);

-- CreateIndex
CREATE INDEX `Student_academyId_idx` ON `Student`(`academyId`);

-- CreateIndex
CREATE INDEX `User_academyId_idx` ON `User`(`academyId`);

-- CreateIndex
CREATE INDEX `Workout_staffMemberId_idx` ON `Workout`(`staffMemberId`);

-- CreateIndex
CREATE INDEX `Workout_status_idx` ON `Workout`(`status`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffMember` ADD CONSTRAINT `StaffMember_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffMember` ADD CONSTRAINT `StaffMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `Membership`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `PaymentMethod`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Workout` ADD CONSTRAINT `Workout_staffMemberId_fkey` FOREIGN KEY (`staffMemberId`) REFERENCES `StaffMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MuscleGroup` ADD CONSTRAINT `MuscleGroup_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseMuscleGroup` ADD CONSTRAINT `ExerciseMuscleGroup_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseMuscleGroup` ADD CONSTRAINT `ExerciseMuscleGroup_muscleGroupId_fkey` FOREIGN KEY (`muscleGroupId`) REFERENCES `MuscleGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhysicalAssessment` ADD CONSTRAINT `PhysicalAssessment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhysicalAssessment` ADD CONSTRAINT `PhysicalAssessment_staffMemberId_fkey` FOREIGN KEY (`staffMemberId`) REFERENCES `StaffMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BodyMeasurement` ADD CONSTRAINT `BodyMeasurement_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `PhysicalAssessment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_classScheduleId_fkey` FOREIGN KEY (`classScheduleId`) REFERENCES `ClassSchedule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassType` ADD CONSTRAINT `ClassType_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_classTypeId_fkey` FOREIGN KEY (`classTypeId`) REFERENCES `ClassType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_staffMemberId_fkey` FOREIGN KEY (`staffMemberId`) REFERENCES `StaffMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassEnrollment` ADD CONSTRAINT `ClassEnrollment_classScheduleId_fkey` FOREIGN KEY (`classScheduleId`) REFERENCES `ClassSchedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassEnrollment` ADD CONSTRAINT `ClassEnrollment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquipmentMaintenance` ADD CONSTRAINT `EquipmentMaintenance_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
