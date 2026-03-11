-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: database
-- Generation Time: Mar 10, 2026 at 07:31 PM
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
-- Table structure for table `usercourses`
--

CREATE TABLE `usercourses` (
  `userid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `courseid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `usercourses`
--

INSERT INTO `usercourses` (`userid`, `courseid`) VALUES
('ralphy', 'arbroath'),
('ralphy', 'archerfieldfidra'),
('ralphy', 'ardfin'),
('ralphy', 'askernish'),
('ralphy', 'auchterarder'),
('ralphy', 'balbirniepark'),
('ralphy', 'ballumbie'),
('ralphy', 'banchory'),
('ralphy', 'blairgowrie'),
('ralphy', 'blairgowrielandsdown'),
('ralphy', 'blairgowriewee'),
('ralphy', 'boatofgarten'),
('ralphy', 'brechin'),
('ralphy', 'broragolfclub'),
('ralphy', 'cabotcs'),
('ralphy', 'cameronhouse'),
('ralphy', 'carnegie'),
('ralphy', 'carnoustie'),
('ralphy', 'carnoustiebuddon'),
('ralphy', 'carnoustieburnside'),
('ralphy', 'carnoustienestie'),
('ralphy', 'corrie'),
('ralphy', 'Craigielaw'),
('ralphy', 'craigmillarpark'),
('ralphy', 'crailbalcomie'),
('ralphy', 'crailcraighead'),
('ralphy', 'crieffgolf'),
('ralphy', 'crudenbay'),
('ralphy', 'crudenbayso'),
('ralphy', 'cullenlinks'),
('ralphy', 'dalmahoy'),
('ralphy', 'dalmahoywest'),
('ralphy', 'downfield'),
('ralphy', 'duffhouseroyal'),
('ralphy', 'Dumbarnie'),
('ralphy', 'dunbar'),
('ralphy', 'dunblanenew'),
('ralphy', 'dundonald'),
('ralphy', 'dunfermline'),
('ralphy', 'eastrenfrewshire'),
('ralphy', 'edzell'),
('ralphy', 'elgin'),
('ralphy', 'elie'),
('ralphy', 'elmwood'),
('ralphy', 'fairmontKittocks'),
('ralphy', 'fairmonttorrance'),
('ralphy', 'forbesofkingennie'),
('ralphy', 'forfar'),
('ralphy', 'fortrose'),
('ralphy', 'fraserburgh'),
('ralphy', 'glasgow'),
('ralphy', 'gleneagleskings'),
('ralphy', 'gleneaglespga'),
('ralphy', 'gleneaglesqueens'),
('ralphy', 'glengolfclub'),
('ralphy', 'glenisla9'),
('ralphy', 'grantownonspey'),
('ralphy', 'gullane'),
('ralphy', 'gullane2'),
('ralphy', 'gullane3'),
('ralphy', 'irvine'),
('ralphy', 'IsleofHarris'),
('ralphy', 'kilspindie'),
('ralphy', 'kilsythlennox'),
('ralphy', 'kingjamesvi'),
('ralphy', 'kingsbarns'),
('ralphy', 'kirkcaldy'),
('ralphy', 'kirriemuir'),
('ralphy', 'ladybank'),
('ralphy', 'lanark'),
('ralphy', 'linlithgow'),
('ralphy', 'LochLomond'),
('ralphy', 'lundingc'),
('ralphy', 'machrihanish'),
('ralphy', 'machrihanishdunes'),
('ralphy', 'meldrumhouse'),
('ralphy', 'monifieth'),
('ralphy', 'monifiethashludie'),
('ralphy', 'montrosegolflinks'),
('ralphy', 'montrosegolflinksbroomfield');
--
-- Indexes for dumped tables
--

--
-- Indexes for table `usercourses`
--
ALTER TABLE `usercourses`
  ADD PRIMARY KEY (`userid`,`courseid`);
COMMIT;
