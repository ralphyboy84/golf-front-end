-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: database
-- Generation Time: Mar 12, 2026 at 05:31 PM
-- Server version: 12.2.2-MariaDB-ubu2404
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `golf`
--

-- --------------------------------------------------------

--
-- Table structure for table `mapping`
--

CREATE TABLE `mapping` (
  `from_lat` decimal(10,6) NOT NULL,
  `from_lon` decimal(10,6) NOT NULL,
  `to_lat` decimal(10,6) NOT NULL,
  `to_lon` decimal(10,6) NOT NULL,
  `distance` int(11) NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mapping`
--
ALTER TABLE `mapping`
  ADD PRIMARY KEY (`from_lat`,`from_lon`,`to_lat`,`to_lon`),
  ADD KEY `from_lat` (`from_lat`,`from_lon`),
  ADD KEY `from_lat_2` (`from_lat`);
COMMIT;
