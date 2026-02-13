-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: database
-- Generation Time: Feb 13, 2026 at 09:26 PM
-- Server version: 8.2.0
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `golf`
--

-- --------------------------------------------------------

--
-- Table structure for table `mock`
--

CREATE TABLE `mock` (
  `id` int NOT NULL,
  `mockon` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mock`
--
ALTER TABLE `mock`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mock`
--
ALTER TABLE `mock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;
