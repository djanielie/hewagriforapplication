-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  mar. 06 sep. 2022 à 17:57
-- Version du serveur :  10.4.6-MariaDB
-- Version de PHP :  7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `__bd_kivugreen`
--

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_admins`
--

CREATE TABLE `__tbl_admins` (
  `id` int(11) NOT NULL,
  `nom` varchar(60) NOT NULL,
  `postnom` varchar(60) NOT NULL,
  `prenom` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `__tbl_admins`
--

INSERT INTO `__tbl_admins` (`id`, `nom`, `postnom`, `prenom`, `email`, `phone`, `password`, `status`, `createdon`) VALUES
(1, 'david', 'maene', 'dar', 'developer.david.maene@gmail.com', '0970284772', '$2b$10$cDu5BgPn9JLDobb6ls.PaOFrEu3C5H2nh32qpigh0yi6fBcsuOVZa', 1, '5:48:27 PM, 09/06/2022');

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_agriculteurs`
--

CREATE TABLE `__tbl_agriculteurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(60) NOT NULL,
  `postnom` varchar(60) NOT NULL,
  `prenom` varchar(60) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `phone` varchar(60) NOT NULL,
  `genre` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `membrecooperative` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `idambassadeur` int(11) NOT NULL,
  `createdon` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_agronomes`
--

CREATE TABLE `__tbl_agronomes` (
  `id` int(11) NOT NULL,
  `nom` varchar(60) NOT NULL,
  `postnom` varchar(60) NOT NULL,
  `prenom` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `adresse` text NOT NULL,
  `genre` varchar(60) NOT NULL,
  `password` text NOT NULL,
  `status` varchar(60) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_ambassadeurs`
--

CREATE TABLE `__tbl_ambassadeurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(60) NOT NULL,
  `postnom` varchar(60) NOT NULL,
  `prenom` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `genre` varchar(60) NOT NULL,
  `adresse` text NOT NULL,
  `idvillage` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_champs`
--

CREATE TABLE `__tbl_champs` (
  `id` int(11) NOT NULL,
  `champs` varchar(60) DEFAULT NULL,
  `idagriculteurs` int(11) NOT NULL,
  `dimensions` float NOT NULL,
  `latitude` varchar(60) NOT NULL,
  `longitude` varchar(60) NOT NULL,
  `altitude` varchar(60) NOT NULL,
  `idzoneproduction` int(11) NOT NULL,
  `idculture` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_chefferies`
--

CREATE TABLE `__tbl_chefferies` (
  `id` int(11) NOT NULL,
  `chefferie` varchar(60) NOT NULL,
  `idterritoire` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_conseils`
--

CREATE TABLE `__tbl_conseils` (
  `id` int(11) NOT NULL,
  `conseil` text NOT NULL,
  `idagronome` int(11) NOT NULL,
  `idculture` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_cooperatives`
--

CREATE TABLE `__tbl_cooperatives` (
  `id` int(11) NOT NULL,
  `cooperative` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `status` int(11) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_cultures`
--

CREATE TABLE `__tbl_cultures` (
  `id` int(11) NOT NULL,
  `cultures` varchar(100) NOT NULL,
  `status` int(11) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_groupements`
--

CREATE TABLE `__tbl_groupements` (
  `id` int(11) NOT NULL,
  `groupement` varchar(60) NOT NULL,
  `idchefferie` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_langues`
--

CREATE TABLE `__tbl_langues` (
  `id` int(11) NOT NULL,
  `langue` varchar(60) NOT NULL,
  `shortname` varchar(60) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_partenaires`
--

CREATE TABLE `__tbl_partenaires` (
  `id` int(11) NOT NULL,
  `raisonsocial` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `adresse` text NOT NULL,
  `password` text NOT NULL,
  `status` int(11) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_provinces`
--

CREATE TABLE `__tbl_provinces` (
  `id` int(10) UNSIGNED NOT NULL,
  `province` varchar(100) NOT NULL,
  `createdon` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `__tbl_provinces`
--

INSERT INTO `__tbl_provinces` (`id`, `province`, `createdon`, `status`) VALUES
(1, 'Kinshasa', '2021-12-23 22:19:29', 1),
(2, 'Bas-Uele', '2021-12-23 22:19:29', 1),
(3, 'Equateur', '2021-12-23 22:19:29', 1),
(4, 'Haut-Katanga', '2021-12-23 22:19:29', 1),
(5, 'Haut-Lomami', '2021-12-23 22:19:29', 1),
(6, 'Haut-Uele', '2021-12-23 22:19:29', 1),
(7, 'Ituri', '2021-12-23 22:19:29', 1),
(8, 'Kasai', '2021-12-23 22:19:29', 1),
(9, 'Kasai-Central', '2021-12-23 22:19:29', 1),
(10, 'Kasai-Oriental', '2021-12-23 22:19:29', 1),
(11, 'Kongo-Central', '2021-12-23 22:19:29', 1),
(12, 'Kwango', '2021-12-23 22:19:29', 1),
(13, 'Kwilu', '2021-12-23 22:19:29', 1),
(14, 'Lomami', '2021-12-23 22:19:29', 1),
(15, 'Lualaba', '2021-12-23 22:19:29', 1),
(16, 'Mai-Ndombe', '2021-12-23 22:19:29', 1),
(17, 'Maniema', '2021-12-23 22:19:29', 1),
(18, 'Mongala', '2021-12-23 22:19:29', 1),
(19, 'Nord-Kivu', '2021-12-23 22:19:29', 1),
(20, 'Nord-Ubangi', '2021-12-23 22:19:29', 1),
(21, 'Sankuru', '2021-12-23 22:19:29', 1),
(22, 'Sud-Kivu', '2021-12-23 22:19:29', 1),
(23, 'Sud-Ubangi', '2021-12-23 22:19:29', 1),
(24, 'Tanganyika', '2021-12-23 22:19:29', 1),
(25, 'Tshopo', '2021-12-23 22:19:29', 1),
(26, 'Tshuapa', '2021-12-23 22:19:29', 1);

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_souscriptions`
--

CREATE TABLE `__tbl_souscriptions` (
  `id` int(11) NOT NULL,
  `idtypesouscription` int(11) NOT NULL,
  `datedebut` varchar(60) NOT NULL,
  `datefin` varchar(60) NOT NULL,
  `frequence` int(11) NOT NULL,
  `idagriculteur` int(11) NOT NULL,
  `idlangue` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_territories`
--

CREATE TABLE `__tbl_territories` (
  `id` int(3) NOT NULL,
  `idprovince` varchar(9) DEFAULT NULL,
  `territoire` varchar(15) DEFAULT NULL,
  `createdon` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `__tbl_territories`
--

INSERT INTO `__tbl_territories` (`id`, `idprovince`, `territoire`, `createdon`, `status`) VALUES
(1, '5', 'Kabongo', '2021-12-23 22:19:42', 1),
(2, '24', 'Manono', '2021-12-23 22:19:42', 1),
(3, '24', 'Kabalo', '2021-12-23 22:19:42', 1),
(4, '5', 'Bukama', '2021-12-23 22:19:42', 1),
(5, '4', 'Mitwaba', '2021-12-23 22:19:42', 1),
(6, '24', 'Nyunzu', '2021-12-23 22:19:42', 1),
(7, '24', 'Kongolo', '2021-12-23 22:19:42', 1),
(8, '4', 'Sakania', '2021-12-23 22:19:42', 1),
(9, '15', 'Sandoa', '2021-12-23 22:19:42', 1),
(10, '15', 'Lubudi', '2021-12-23 22:19:42', 1),
(11, '5', 'Kaniama', '2021-12-23 22:19:42', 1),
(12, '5', 'Kamina', '2021-12-23 22:19:42', 1),
(13, '', 'Malemba-Nkulu', '2021-12-23 22:19:42', 1),
(14, '15', 'Kapanga', '2021-12-23 22:19:42', 1),
(15, '15', 'Dilolo', '2021-12-23 22:19:42', 1),
(16, '26', 'Bokungu', '2021-12-23 22:19:42', 1),
(17, '', 'Kasongo-Lunda', '2021-12-23 22:19:42', 1),
(18, '12', 'Kahemba', '2021-12-23 22:19:42', 1),
(19, '', 'Popokabaka', '2021-12-23 22:19:42', 1),
(20, '16', 'Mushie', '2021-12-23 22:19:42', 1),
(21, '13', 'Masi-Manimba', '2021-12-23 22:19:42', 1),
(22, '12', 'Feshi', '2021-12-23 22:19:42', 1),
(23, '13', 'Gungu', '2021-12-23 22:19:42', 1),
(24, '', 'Idiofa', '2021-12-23 22:19:42', 1),
(25, '16', 'Oshwe', '2021-12-23 22:19:42', 1),
(26, '17', 'Lubutu', '2021-12-23 22:19:42', 1),
(27, '17', 'Punia', '2021-12-23 22:19:42', 1),
(28, '17', 'Kabambare', '2021-12-23 22:19:42', 1),
(29, '17', 'Kasongo', '2021-12-23 22:19:42', 1),
(30, '17', 'Kibombo', '2021-12-23 22:19:42', 1),
(31, '17', 'Pangi', '2021-12-23 22:19:42', 1),
(32, '', 'Likasi', '2021-12-23 22:19:42', 1),
(33, '4', 'Kambove', '2021-12-23 22:19:42', 1),
(34, '', 'Lubumbashi', '2021-12-23 22:19:42', 1),
(35, '11', 'Mbanza-Ngungu', '2021-12-23 22:19:42', 1),
(36, '11', 'Tshela', '2021-12-23 22:19:42', 1),
(37, '11', 'Lukula', '2021-12-23 22:19:42', 1),
(38, '21', 'Katako-Kombe', '2021-12-23 22:19:42', 1),
(39, '14', 'Lubao', '2021-12-23 22:19:42', 1),
(40, '21', 'Lodja', '2021-12-23 22:19:42', 1),
(41, '21', 'Lubefu', '2021-12-23 22:19:42', 1),
(42, '10', 'Ngandajika', '2021-12-23 22:19:42', 1),
(43, '', 'Kabeya-Kamwanga', '2021-12-23 22:19:42', 1),
(44, '', 'Kamiji', '2021-12-23 22:19:42', 1),
(45, '21', 'Lusambo', '2021-12-23 22:19:42', 1),
(46, '', 'Dimbelenge', '2021-12-23 22:19:42', 1),
(47, '10', 'Miabi', '2021-12-23 22:19:42', 1),
(48, '9', 'Luiza', '2021-12-23 22:19:42', 1),
(49, '9', 'Kazumba', '2021-12-23 22:19:42', 1),
(50, '9', 'Demba', '2021-12-23 22:19:42', 1),
(51, '8', 'Luebo', '2021-12-23 22:19:42', 1),
(52, '8', 'Dekese', '2021-12-23 22:19:42', 1),
(53, '21', 'Kole', '2021-12-23 22:19:42', 1),
(54, '8', 'Mweka', '2021-12-23 22:19:42', 1),
(55, '8', 'Ilebo', '2021-12-23 22:19:42', 1),
(56, '20', 'Bosobolo', '2021-12-23 22:19:42', 1),
(57, '20', 'Yakoma', '2021-12-23 22:19:42', 1),
(58, '23', 'Gemena', '2021-12-23 22:19:42', 1),
(59, '23', 'Kungu', '2021-12-23 22:19:42', 1),
(60, '26', 'Befale', '2021-12-23 22:19:42', 1),
(61, '16', 'Kiri', '2021-12-23 22:19:42', 1),
(62, '23', 'Budjala', '2021-12-23 22:19:42', 1),
(63, '20', 'Businga', '2021-12-23 22:19:42', 1),
(64, '3', 'Basankusu', '2021-12-23 22:19:42', 1),
(65, '3', 'Bomongo', '2021-12-23 22:19:42', 1),
(66, '', 'Makanza', '2021-12-23 22:19:42', 1),
(67, '18', 'Bumba', '2021-12-23 22:19:42', 1),
(68, '26', 'Monkoto', '2021-12-23 22:19:42', 1),
(69, '26', 'Boende', '2021-12-23 22:19:42', 1),
(70, '26', 'Ikela', '2021-12-23 22:19:42', 1),
(71, '', 'Bolobo', '2021-12-23 22:19:42', 1),
(72, '', 'Mbuji-Mayi', '2021-12-23 22:19:42', 1),
(73, '', 'Lupatapata', '2021-12-23 22:19:42', 1),
(74, '', 'Kananga', '2021-12-23 22:19:42', 1),
(75, '9', 'Dibaya', '2021-12-23 22:19:42', 1),
(76, '18', 'Bongandanga', '2021-12-23 22:19:42', 1),
(77, '26', 'Djolu', '2021-12-23 22:19:42', 1),
(78, '16', 'Inongo', '2021-12-23 22:19:42', 1),
(79, '3', 'Lukolela', '2021-12-23 22:19:42', 1),
(80, '', 'Yumbi', '2021-12-23 22:19:42', 1),
(81, '18', 'Lisala', '2021-12-23 22:19:42', 1),
(82, '21', 'Lomela', '2021-12-23 22:19:42', 1),
(83, '17', 'Kindu', '2021-12-23 22:19:42', 1),
(84, '17', 'Kailo', '2021-12-23 22:19:42', 1),
(85, '', 'Mbandaka', '2021-12-23 22:19:42', 1),
(86, '3', 'Bolomba', '2021-12-23 22:19:42', 1),
(87, '', 'Bandundu', '2021-12-23 22:19:42', 1),
(88, '', 'Seke-Banza', '2021-12-23 22:19:42', 1),
(89, '', 'Matadi', '2021-12-23 22:19:42', 1),
(90, '11', 'Songololo', '2021-12-23 22:19:42', 1),
(91, '4', 'Kipushi', '2021-12-23 22:19:42', 1),
(92, '', 'Kisangani', '2021-12-23 22:19:42', 1),
(93, '25', 'Banalia', '2021-12-23 22:19:42', 1),
(94, '25', 'Ubundu', '2021-12-23 22:19:42', 1),
(95, '25', 'Opala', '2021-12-23 22:19:42', 1),
(96, '25', 'Yahuma', '2021-12-23 22:19:42', 1),
(97, '2', 'Buta', '2021-12-23 22:19:42', 1),
(98, '2', 'Aketi.', '2021-12-23 22:19:42', 1),
(99, '2', 'Bondo', '2021-12-23 22:19:42', 1),
(100, '2', 'Ango', '2021-12-23 22:19:42', 1),
(101, '2', 'Bambesa', '2021-12-23 22:19:42', 1),
(102, '2', 'Poko', '2021-12-23 22:19:42', 1),
(103, '6', 'Rungu', '2021-12-23 22:19:42', 1),
(104, '6', 'Niangara', '2021-12-23 22:19:42', 1),
(105, '6', 'Dungu', '2021-12-23 22:19:42', 1),
(106, '6', 'Watsa', '2021-12-23 22:19:42', 1),
(107, '6', 'Wamba', '2021-12-23 22:19:42', 1),
(108, '7', 'Mambasa', '2021-12-23 22:19:42', 1),
(109, '7', 'Aru', '2021-12-23 22:19:42', 1),
(110, '6', 'Faradje', '2021-12-23 22:19:42', 1),
(111, '11', 'Luozi', '2021-12-23 22:19:42', 1),
(112, '16', 'Kutu', '2021-12-23 22:19:42', 1),
(113, '', 'Boma', '2021-12-23 22:19:42', 1),
(114, '11', 'Moanda', '2021-12-23 22:19:42', 1),
(115, '', 'Zongo', '2021-12-23 22:19:42', 1),
(116, '23', 'Libenge', '2021-12-23 22:19:42', 1),
(117, '25', 'Bafwasende', '2021-12-23 22:19:42', 1),
(118, '19', 'Goma', '2021-12-23 22:19:42', 1),
(119, '19', 'Walikale', '2021-12-23 22:19:42', 1),
(120, '19', 'Rutshuru', '2021-12-23 22:19:42', 1),
(121, '19', 'Nyiragongo', '2021-12-23 22:19:42', 1),
(122, '19', 'Butembo', '2021-12-23 22:19:42', 1),
(123, '22', 'Walungu', '2021-12-23 22:19:42', 1),
(124, '22', 'Mwenga', '2021-12-23 22:19:42', 1),
(125, '22', 'Shabunda', '2021-12-23 22:19:42', 1),
(126, '19', 'Beni town', '2021-12-23 22:19:42', 1),
(127, '8', 'Kamonia', '2021-12-23 22:19:42', 1),
(128, '', 'Mwene Ditu', '2021-12-23 22:19:42', 1),
(129, '14', 'Luilu', '2021-12-23 22:19:42', 1),
(130, '', 'Katanda', '2021-12-23 22:19:42', 1),
(131, '10', 'Kabinda', '2021-12-23 22:19:42', 1),
(132, '10', 'Tshilenge', '2021-12-23 22:19:42', 1),
(133, '', 'Kikwit', '2021-12-23 22:19:42', 1),
(134, '13', 'Bulungu', '2021-12-23 22:19:42', 1),
(135, '19', 'Beni', '2021-12-23 22:19:42', 1),
(136, '4', 'Kasenga', '2021-12-23 22:19:42', 1),
(137, '22', 'Kabare', '2021-12-23 22:19:42', 1),
(138, '22', 'Bukavu', '2021-12-23 22:19:42', 1),
(139, '22', 'Kalehe', '2021-12-23 22:19:42', 1),
(140, '19', 'Masisi', '2021-12-23 22:19:42', 1),
(141, '19', 'Lubero', '2021-12-23 22:19:42', 1),
(142, '22', 'Idjwi', '2021-12-23 22:19:42', 1),
(143, '22', 'Uvira', '2021-12-23 22:19:42', 1),
(144, '22', 'Fizi', '2021-12-23 22:19:42', 1),
(145, '24', 'Kalemie', '2021-12-23 22:19:42', 1),
(146, '24', 'Moba', '2021-12-23 22:19:42', 1),
(147, '4', 'Pweto', '2021-12-23 22:19:42', 1),
(148, '7', 'Irumu', '2021-12-23 22:19:42', 1),
(149, '', 'Mahagi', '2021-12-23 22:19:42', 1),
(150, '7', 'Djugu', '2021-12-23 22:19:42', 1),
(151, '', 'Kolwezi', '2021-12-23 22:19:42', 1),
(152, '15', 'Mutshatsha', '2021-12-23 22:19:42', 1),
(153, '', 'Gbadolite', '2021-12-23 22:19:42', 1),
(154, '20', 'Mobayi-Mbongo', '2021-12-23 22:19:42', 1),
(155, '3', 'Bikoro', '2021-12-23 22:19:42', 1),
(156, '3', 'Ingende', '2021-12-23 22:19:42', 1),
(157, '25', 'Basoko', '2021-12-23 22:19:42', 1),
(158, '25', 'Isangi', '2021-12-23 22:19:42', 1),
(159, '', 'Kimbanseke', '2021-12-23 22:19:42', 1),
(160, '', 'Kisenso', '2021-12-23 22:19:42', 1),
(161, '', 'Ndjili', '2021-12-23 22:19:42', 1),
(162, '', 'Matete', '2021-12-23 22:19:42', 1),
(163, '', 'Lemba', '2021-12-23 22:19:42', 1),
(164, '', 'Ngaba', '2021-12-23 22:19:42', 1),
(165, '', 'Makala', '2021-12-23 22:19:42', 1),
(166, '', 'Bumbu', '2021-12-23 22:19:42', 1),
(167, '', 'Selembao', '2021-12-23 22:19:42', 1),
(168, '', 'Ngiri-Ngiri', '2021-12-23 22:19:42', 1),
(169, '', 'Mont Ngafula', '2021-12-23 22:19:42', 1),
(170, '', 'Kasa Vubu', '2021-12-23 22:19:42', 1),
(171, '', 'Kalamu', '2021-12-23 22:19:42', 1),
(172, '', 'Kintambo', '2021-12-23 22:19:42', 1),
(173, '', 'Bandalungwa', '2021-12-23 22:19:42', 1),
(174, '', 'Masina', '2021-12-23 22:19:42', 1),
(175, '', 'Limete', '2021-12-23 22:19:42', 1),
(176, '', 'Ngaliema', '2021-12-23 22:19:42', 1),
(177, '', 'Lingwala', '2021-12-23 22:19:42', 1),
(178, '', 'Kinshasa', '2021-12-23 22:19:42', 1),
(179, '', 'Barumbu', '2021-12-23 22:19:42', 1),
(180, '', 'Gombe', '2021-12-23 22:19:42', 1),
(181, '', 'Nsele', '2021-12-23 22:19:42', 1),
(182, '', 'Maluku', '2021-12-23 22:19:42', 1),
(183, '', 'Kimvula', '2021-12-23 22:19:42', 1),
(184, '11', 'Madimba', '2021-12-23 22:19:42', 1),
(185, '', 'Kasangulu', '2021-12-23 22:19:42', 1),
(186, '12', 'Kenge', '2021-12-23 22:19:42', 1),
(187, '13', 'Bagata', '2021-12-23 22:19:42', 1),
(188, '', 'Kwamouth', '2021-12-23 22:19:42', 1),
(189, '7', 'Managi', '2021-12-23 22:19:42', 1),
(190, '5', 'Malemoa Nkulu', '2021-12-23 22:19:42', 1);

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_typesouscriptions`
--

CREATE TABLE `__tbl_typesouscriptions` (
  `id` int(11) NOT NULL,
  `type` varchar(60) DEFAULT NULL,
  `prix` float NOT NULL,
  `echeanche` int(11) NOT NULL,
  `nombresms` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `createdon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_villages`
--

CREATE TABLE `__tbl_villages` (
  `id` int(11) NOT NULL,
  `village` varchar(60) NOT NULL,
  `idgroupement` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `__tbl_zoneproductions`
--

CREATE TABLE `__tbl_zoneproductions` (
  `id` int(11) NOT NULL,
  `zoneproduction` varchar(60) DEFAULT NULL,
  `idvillage` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `crearedon` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `__tbl_admins`
--
ALTER TABLE `__tbl_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `__tbl_agriculteurs`
--
ALTER TABLE `__tbl_agriculteurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `__tbl_agronomes`
--
ALTER TABLE `__tbl_agronomes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_ambassadeurs`
--
ALTER TABLE `__tbl_ambassadeurs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_champs`
--
ALTER TABLE `__tbl_champs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_chefferies`
--
ALTER TABLE `__tbl_chefferies`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_conseils`
--
ALTER TABLE `__tbl_conseils`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_cooperatives`
--
ALTER TABLE `__tbl_cooperatives`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_cultures`
--
ALTER TABLE `__tbl_cultures`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_groupements`
--
ALTER TABLE `__tbl_groupements`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_langues`
--
ALTER TABLE `__tbl_langues`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_partenaires`
--
ALTER TABLE `__tbl_partenaires`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_provinces`
--
ALTER TABLE `__tbl_provinces`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_souscriptions`
--
ALTER TABLE `__tbl_souscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_territories`
--
ALTER TABLE `__tbl_territories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_typesouscriptions`
--
ALTER TABLE `__tbl_typesouscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_villages`
--
ALTER TABLE `__tbl_villages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `__tbl_zoneproductions`
--
ALTER TABLE `__tbl_zoneproductions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `__tbl_admins`
--
ALTER TABLE `__tbl_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `__tbl_agriculteurs`
--
ALTER TABLE `__tbl_agriculteurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_agronomes`
--
ALTER TABLE `__tbl_agronomes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_ambassadeurs`
--
ALTER TABLE `__tbl_ambassadeurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_champs`
--
ALTER TABLE `__tbl_champs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_chefferies`
--
ALTER TABLE `__tbl_chefferies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_conseils`
--
ALTER TABLE `__tbl_conseils`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_cooperatives`
--
ALTER TABLE `__tbl_cooperatives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_cultures`
--
ALTER TABLE `__tbl_cultures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_groupements`
--
ALTER TABLE `__tbl_groupements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_langues`
--
ALTER TABLE `__tbl_langues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_partenaires`
--
ALTER TABLE `__tbl_partenaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_provinces`
--
ALTER TABLE `__tbl_provinces`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `__tbl_souscriptions`
--
ALTER TABLE `__tbl_souscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_territories`
--
ALTER TABLE `__tbl_territories`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT pour la table `__tbl_typesouscriptions`
--
ALTER TABLE `__tbl_typesouscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_villages`
--
ALTER TABLE `__tbl_villages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `__tbl_zoneproductions`
--
ALTER TABLE `__tbl_zoneproductions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
