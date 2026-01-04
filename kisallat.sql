-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 03. 17:22
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kisallat_webshop`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `alkategoriak`
--

CREATE TABLE `alkategoriak` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `kategoria_id` tinyint(3) UNSIGNED NOT NULL,
  `slug` varchar(50) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `kep` varchar(255) DEFAULT NULL,
  `sorrend` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `alkategoriak`
--

INSERT INTO `alkategoriak` (`id`, `kategoria_id`, `slug`, `nev`, `kep`, `sorrend`) VALUES
(1, 1, 'poraz', 'Pórázok', NULL, 1),
(2, 1, 'tal', 'Tálak', NULL, 2),
(3, 1, 'ham', 'Hámok', NULL, 3),
(4, 1, 'bolha', 'Bolha- és kullancsírtók', NULL, 4),
(5, 1, 'nyakorv', 'Nyakörvek', NULL, 5),
(6, 1, 'tap', 'Tápok', NULL, 6),
(7, 2, 'jatek', 'Játékok', NULL, 1),
(8, 2, 'tal', 'Tálak', NULL, 2),
(9, 2, 'ham', 'Hámok', NULL, 3),
(10, 2, 'bolha', 'Bolhaírtó szerek', NULL, 4),
(11, 2, 'nyakorv', 'Nyakörvek', NULL, 5),
(12, 2, 'tapm', 'Macska tápok', NULL, 6),
(13, 3, 'tap', 'Rágcsáló tápok', NULL, 1),
(14, 3, 'ketrec', 'Ketrec és felszerelések', NULL, 2),
(15, 3, 'alom', 'Almok', NULL, 3),
(16, 3, 'jatek', 'Játékok', NULL, 4),
(17, 4, 'tap', 'Hüllő tápok', NULL, 1),
(18, 4, 'terrarium', 'Terrárium és felszerelések', NULL, 2),
(19, 4, 'lampa', 'Melegítő lámpák', NULL, 3),
(20, 5, 'tap', 'Madár tápok', NULL, 1),
(21, 5, 'ketrec', 'Kalitkák', NULL, 2),
(22, 5, 'jatek', 'Játékok', NULL, 3),
(23, 6, 'tap', 'Hal tápok', NULL, 1),
(24, 6, 'akvariumok', 'Akvárium és felszerelések', NULL, 2),
(25, 6, 'szuro', 'Szűrők és tartozékok', NULL, 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fal_bejegyzesek`
--

CREATE TABLE `fal_bejegyzesek` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `szoveg` text NOT NULL,
  `letrehozva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fal_bejegyzesek`
--

INSERT INTO `fal_bejegyzesek` (`id`, `felhasznalo_id`, `szoveg`, `letrehozva`) VALUES
(1, 9, 'Ez egy teszt bejegyzes a falon!', '2026-01-01 19:38:44'),
(2, 9, 'Remek üzlet csak ajánlani tudom.', '2026-01-01 19:43:21'),
(4, 11, 'helloö', '2026-01-03 13:28:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `felhasznalonev` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jelszo_hash` varchar(255) NOT NULL,
  `keresztnev` varchar(100) DEFAULT NULL,
  `vezeteknev` varchar(100) DEFAULT NULL,
  `telefon` varchar(30) DEFAULT NULL,
  `iranyitoszam` varchar(20) DEFAULT NULL,
  `varos` varchar(100) DEFAULT NULL,
  `cim` text DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0,
  `email_megerositve` tinyint(1) DEFAULT 0,
  `regisztralt` timestamp NOT NULL DEFAULT current_timestamp(),
  `frissitve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`id`, `felhasznalonev`, `email`, `jelszo_hash`, `keresztnev`, `vezeteknev`, `telefon`, `iranyitoszam`, `varos`, `cim`, `admin`, `email_megerositve`, `regisztralt`, `frissitve`) VALUES
(1, 'teszt_user_999', 'teszt999@example.com', '$2y$10$UHQLL7nFi5vnKZ8WB4PrB.1esLucu0UbrWeWPiDuxjw8o/I63Uw1S', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-12-27 19:39:17', '2025-12-27 19:39:17'),
(2, 'e2e_20251228_135002', 'e2e_20251228_135002@example.com', '$2y$10$HyTqs213qwmz3hrc6rYeGOZeZOj2Yn2qJ5fQVEJdO.G7pb/tqA91m', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-12-28 12:50:02', '2025-12-28 12:50:02'),
(3, 'e2e_20251228_135031', 'e2e_20251228_135031@example.com', '$2y$10$LdDaZ874IRvPEeFqT6eexu7Vck2QnscgANtch79cYamMNK7poctjS', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-12-28 12:50:31', '2025-12-28 12:50:31'),
(4, 'Lajo', 'nubsos123@gmail.com', '$2y$10$8UiHHDavxWlYS7EcChvDCuc1loPsEUHB6UggVk0bjFcCs2UgxUIMm', 'Lajo', 'Lajo', '4448', '123', 'Miskol', 'askdffuig', 0, 0, '2025-12-28 12:51:40', '2025-12-28 12:51:40'),
(5, 'order_20251228_135749', 'order_20251228_135749@example.com', '$2y$10$jwvahCoyJZTM99pWtBDZuOmf2IYhvS/PKkYd0ex/j4o3KdwCz1Ad2', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-12-28 12:57:49', '2025-12-28 12:57:49'),
(6, 'order_20251228_135828', 'order_20251228_135828@example.com', '$2y$10$cYSohe.IOaEFKgJUQnW68.jRDE8qz5HZG4t/ric5Pv/3hSLDPlxqu', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-12-28 12:58:28', '2025-12-28 12:58:28'),
(7, 'e2e_order_20251228_140723', 'e2e_order_20251228_140723@test.local', '$2y$10$tBDCSdJrfmmX2dbuD5wtQuDwr2aJIGy3cT.tZpkmIJ2U2bf3jlnl6', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-12-28 13:07:23', '2025-12-28 13:07:23'),
(8, 'e2e_order_20251228_140838', 'e2e_order_20251228_140838@test.local', '$2y$10$mGfhNijoHqCEywGVFbl6TeVAjpZ/tJi9Qyj.0n6dgTYJml.//Do56', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-12-28 13:08:38', '2025-12-28 13:08:38'),
(9, 'akos@akos.hu', 'akos@akos.hu', '$2y$10$vq1x5moOY9p02q6z8vUGWulfvsRhRlgi2lxgPwY6oEwapTmzh9ntS', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 1, 0, '2025-12-28 15:14:51', '2026-01-02 14:18:42'),
(10, 'test_admin_20260101143216', 'test_admin_20260101143216@test.hu', '$2y$10$Pf0AnF5dWlFNE2zIPER42O2DG/uSP061pU/sJiWnDikfbCHxse8gS', 'Test', 'Admin', NULL, NULL, NULL, NULL, 0, 0, '2026-01-01 13:32:16', '2026-01-01 13:32:16'),
(11, 'nigger', 'mozikati0@gmail.com', '$2y$10$IwtSw0Ne3kJ6N.QrtktQLea3W0Iy7MPGei77na2QMpmgh4ZmSq2De', 'nigger', 'nigger', 'nigger', 'nigger', 'nigger', 'nigger', 0, 0, '2026-01-02 14:21:48', '2026-01-02 17:09:06');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jelszo_reset`
--

CREATE TABLE `jelszo_reset` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `kod` varchar(6) NOT NULL,
  `lejar` datetime NOT NULL,
  `felhasznalva` tinyint(4) DEFAULT 0,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `jelszo_reset`
--

INSERT INTO `jelszo_reset` (`id`, `felhasznalo_id`, `kod`, `lejar`, `felhasznalva`, `letrehozva`) VALUES
(6, 9, '719427', '2026-01-02 18:04:47', 0, '2026-01-02 16:49:47'),
(13, 11, '173503', '2026-01-02 18:23:14', 1, '2026-01-02 17:08:14');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `slug` varchar(30) NOT NULL,
  `nev` varchar(50) NOT NULL,
  `kep` varchar(255) DEFAULT NULL,
  `sorrend` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`id`, `slug`, `nev`, `kep`, `sorrend`) VALUES
(1, 'kutya', 'Kutya', 'img/kutya.png', 1),
(2, 'macska', 'Macska', 'img/macska.png', 2),
(3, 'ragcsalo', 'Rágcsáló', 'img/ragcsalo.png', 3),
(4, 'hullo', 'Hüllő', 'img/hullo.png', 4),
(5, 'madar', 'Madár', 'img/madar.png', 5),
(6, 'hal', 'Hal', 'img/hal.png', 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kosar`
--

CREATE TABLE `kosar` (
  `felhasznalo_id` bigint(20) UNSIGNED NOT NULL,
  `termek_id` int(10) UNSIGNED NOT NULL,
  `mennyiseg` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `hozzaadva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kuponok`
--

CREATE TABLE `kuponok` (
  `id` int(11) NOT NULL,
  `kod` varchar(50) NOT NULL,
  `tipus` enum('szazalek','fix') DEFAULT 'szazalek',
  `ertek` decimal(10,2) NOT NULL,
  `min_osszeg` decimal(10,2) DEFAULT 0.00,
  `felhasznalasi_limit` int(11) DEFAULT NULL,
  `felhasznalva` int(11) DEFAULT 0,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `ervenyes_kezdet` datetime DEFAULT current_timestamp(),
  `ervenyes_veg` datetime DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1,
  `letrehozva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kuponok`
--

INSERT INTO `kuponok` (`id`, `kod`, `tipus`, `ertek`, `min_osszeg`, `felhasznalasi_limit`, `felhasznalva`, `felhasznalo_id`, `ervenyes_kezdet`, `ervenyes_veg`, `aktiv`, `letrehozva`) VALUES
(1, 'HUSEG05', 'szazalek', 0.51, 0.00, 1, 0, NULL, '2026-01-02 13:49:03', '2026-01-04 13:16:11', 1, '2026-01-02 13:49:03');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kupon_hasznalatok`
--

CREATE TABLE `kupon_hasznalatok` (
  `id` int(11) NOT NULL,
  `kupon_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `rendeles_id` int(11) DEFAULT NULL,
  `hasznalva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetelek`
--

CREATE TABLE `rendeles_tetelek` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rendeles_id` bigint(20) UNSIGNED NOT NULL,
  `termek_id` int(10) UNSIGNED NOT NULL,
  `termek_nev` varchar(255) NOT NULL,
  `ar` int(10) UNSIGNED NOT NULL,
  `mennyiseg` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `rendeles_tetelek`
--

INSERT INTO `rendeles_tetelek` (`id`, `rendeles_id`, `termek_id`, `termek_nev`, `ar`, `mennyiseg`) VALUES
(2, 2, 4, 'Rukka Kötélpóráz', 8990, 1),
(3, 3, 11, 'we4twe', 22, 2),
(5, 5, 4, 'Rukka Kötélpóráz', 8990, 4),
(6, 6, 4, 'Rukka Kötélpóráz', 8990, 1),
(7, 7, 12, '222', 2, 3),
(8, 8, 6, 'Felix Fantastic', 3490, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelések`
--

CREATE TABLE `rendelések` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `felhasznalo_id` bigint(20) UNSIGNED NOT NULL,
  `rendelés_szam` varchar(30) NOT NULL,
  `statusz` enum('új','feldolgozás','fizetve','kész','stornó') DEFAULT 'új',
  `osszeg` int(10) UNSIGNED NOT NULL,
  `szallitasi_mod` varchar(100) DEFAULT NULL,
  `fizetesi_mod` varchar(100) DEFAULT NULL,
  `megjegyzes` text DEFAULT NULL,
  `szallitasi_nev` varchar(200) DEFAULT NULL,
  `szallitasi_cim` text DEFAULT NULL,
  `szallitasi_varos` varchar(100) DEFAULT NULL,
  `szallitasi_irsz` varchar(20) DEFAULT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp(),
  `frissitve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `rendelések`
--

INSERT INTO `rendelések` (`id`, `felhasznalo_id`, `rendelés_szam`, `statusz`, `osszeg`, `szallitasi_mod`, `fizetesi_mod`, `megjegyzes`, `szallitasi_nev`, `szallitasi_cim`, `szallitasi_varos`, `szallitasi_irsz`, `letrehozva`, `frissitve`) VALUES
(2, 4, 'ORD-20251228-FD73FE', 'új', 8990, 'Személyes átvétel', 'Bankkártya', 'das', 'Hegymegi-Kiss Ákos', 'Váncza Mihály utca 8', 'Miskolc', '3529', '2025-12-28 13:17:03', '2025-12-28 13:17:03'),
(3, 9, 'ORD-20251228-3C4784', 'új', 44, 'Házhozszállítás', 'Utánvét', '', 'Hegymegi-Kiss Ákos', 'Váncza Mihály utca 8', 'Miskolc', '3529', '2025-12-28 18:22:27', '2025-12-28 18:22:27'),
(5, 9, 'ORD-20260101-9A5EAE', 'új', 35960, 'Házhozszállítás', 'Utánvét', '', 'anya', 'anyaanya', 'anya', 'anyaanya', '2026-01-01 18:04:41', '2026-01-01 18:04:41'),
(6, 9, 'ORD-20260102-3BB8BB', 'új', 8990, 'Személyes átvétel', 'Bankkártya', 'lol', 'anya', 'anya', 'anya', 'anya', '2026-01-02 14:02:59', '2026-01-02 14:02:59'),
(7, 11, 'ORD-20260102-A07EA6', 'új', 6, 'Házhozszállítás', 'Utánvét', '', 'nigger', 'nigger', 'nigger', 'nigger', '2026-01-02 14:22:50', '2026-01-02 14:22:50'),
(8, 11, 'ORD-20260103-7BF2B8', 'új', 3490, 'Személyes átvétel', 'Utánvét', '', 'anya', 'anya', 'anya', 'anya', '2026-01-03 13:17:11', '2026-01-03 13:17:11');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` int(10) UNSIGNED NOT NULL,
  `alkategoria_id` smallint(5) UNSIGNED NOT NULL,
  `nev` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `leiras` text DEFAULT NULL,
  `rovid_leiras` varchar(500) DEFAULT NULL,
  `ar` int(10) UNSIGNED NOT NULL,
  `akcios_ar` int(10) UNSIGNED DEFAULT NULL,
  `keszlet` int(10) UNSIGNED DEFAULT 999,
  `fo_kep` varchar(255) NOT NULL,
  `tobbi_kep` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tobbi_kep`)),
  `aktiv` tinyint(1) DEFAULT 1,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp(),
  `frissitve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`id`, `alkategoria_id`, `nev`, `slug`, `leiras`, `rovid_leiras`, `ar`, `akcios_ar`, `keszlet`, `fo_kep`, `tobbi_kep`, `aktiv`, `letrehozva`, `frissitve`) VALUES
(1, 6, 'Royal Canin Mini Adult', 'royal-canin-mini-adult', 'Kiváló minőségű táplálás kistestű felnőtt kutyák számára. Tartalmazza a szükséges vitaminokat és ásványi anyagokat.', 'Prémium kutyatáp kistestű felnőtt kutyáknak', 24990, 22490, 49, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400', '[]', 1, '2025-12-27 16:22:32', '2025-12-28 13:08:38'),
(2, 6, 'Bosch Adult Menue', 'bosch-adult-menue', 'Teljes értékű táplálás felnőtt kutyáknak. Magas hústartalommal és kiegyensúlyozott tápanyag összetétellel.', 'Kiváló ár-érték arányú kutyatáp', 18990, NULL, 100, 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?w=400', '[]', 1, '2025-12-27 16:22:32', '2025-12-27 16:22:32'),
(3, 3, 'JULIUS-K9 Erőhám', 'julius-k9-eroharm', 'Strapabíró, professzionális kutyahám nagy testű kutyáknak. Állítható méret, kényelmes viselet.', 'Profi kutyahám erős kutyáknak', 15990, 13990, 30, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', '[]', 1, '2025-12-27 16:22:32', '2025-12-27 16:22:32'),
(4, 1, 'Rukka Kötélpóráz', 'rukka-kotelpraz', 'Erős, állítható hosszúságú kötélpóráz nagy kutyákhoz. Kényelmes markolat, tartós anyag.', 'Állítható kötélpóráz nagy kutyáknak', 8990, NULL, 39, 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400', '[]', 1, '2025-12-27 16:22:32', '2026-01-02 14:02:59'),
(5, 2, 'Trixie Kerámia Tál Szett', 'trixie-keramia-tal-szett', 'Prémium kerámia tálak állvánnyal. Mosogatógépben mosható, csúszásmentes talp.', 'Elegáns kerámia tálak kutyáknak', 12490, 10990, 25, 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400', '[]', 1, '2025-12-27 16:22:32', '2025-12-27 16:22:32'),
(6, 12, 'Felix Fantastic', 'felix-fantastic', 'Nedves macskatáp változatos ízekben. Macskák kedvenc eledele, teljes értékű táplálás.', 'Nedves macskatáp válogatós cicáknak', 3490, NULL, 199, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400', '[]', 1, '2025-12-27 16:22:32', '2026-01-03 13:17:11'),
(7, 7, 'KONG Kickeroo', 'kong-kickeroo', 'Interaktív macskajáték macskamentával töltve. Ellenálló anyagból, hosszú távú játékra.', 'Népszerű macskajáték', 4990, 3990, 60, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400', '[]', 1, '2025-12-27 16:22:32', '2025-12-27 16:22:32'),
(8, 4, 'Frontline Tri-Act', 'frontline-tri-act', 'Hatékony bolha és kullancs elleni védelem kutyáknak. Hosszan tartó hatás, vízálló formula.', 'Bolha és kullancsírtó kutyáknak', 8990, NULL, 80, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', '[]', 1, '2025-12-27 16:22:32', '2025-12-27 16:22:32'),
(9, 15, 'Petlife Safebed Papírpehely Alom', 'petlife-safebed-papirpehely', 'Pormentes, szagtalan papírpehely alom nyulaknak és rágcsálóknak. Kiváló nedvszívó képesség.', 'Öko papírpehely alom rágcsálóknak', 5490, 4990, 100, 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400', '[]', 1, '2025-12-27 16:22:32', '2025-12-27 16:22:32'),
(10, 1, 'Teszt Termek 5', 'teszt-termek-5', NULL, NULL, 5678, NULL, 999, '/uploads/test5.jpg', '[\"\\/uploads\\/a.jpg\",\"\\/uploads\\/b.jpg\"]', 1, '2025-12-28 17:15:33', '2025-12-28 17:15:33'),
(11, 3, 'we4twe', 'we4twe', 'gs', 'gsdsg', 22, 22, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7zEzFBaz6SzPAYOy8DRnsFzPVfHsXpLH6Ig&s', '[]', 1, '2025-12-28 18:01:11', '2025-12-28 18:22:27'),
(12, 2, '222', '222', '22', '22', 22, 2, 19, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7zEzFBaz6SzPAYOy8DRnsFzPVfHsXpLH6Ig&s', '[]', 1, '2025-12-28 18:20:39', '2026-01-02 14:22:50'),
(13, 3, '2', '2', 'hchc', 'ssss', 2222, 22, 22, 'file:///C:/Users/hegym/Pictures/Screenshots/K%C3%A9perny%C5%91k%C3%A9p%202025-05-09%20172727.png', '[\"file:\\/\\/\\/C:\\/Users\\/hegym\\/Pictures\\/Screenshots\\/K%C3%A9perny%C5%91k%C3%A9p%202025-05-09%20172727.png\"]', 1, '2025-12-28 18:21:45', '2025-12-28 18:21:45'),
(14, 3, 'UI teszt POST override', 'ui-teszt-post-override', NULL, NULL, 3333, NULL, 999, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 20:38:05', '2025-12-28 20:38:05'),
(15, 3, 'UI teszt POST override 2', 'ui-teszt-post-override-2', NULL, NULL, 3333, NULL, 999, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 20:39:44', '2025-12-28 20:39:44'),
(16, 3, 'UI teszt UPDATE siker', 'ui-teszt-update-siker', NULL, NULL, 7777, NULL, 999, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 20:49:04', '2025-12-28 20:49:04'),
(17, 3, 'UI teszt UPDATE most', 'ui-teszt-update-most', NULL, NULL, 8888, NULL, 999, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 20:50:35', '2025-12-28 20:50:35'),
(18, 3, 'UI teszt UPDATE most cigány', 'ui-teszt-update-most-cigany', NULL, NULL, 8888, NULL, 999, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 20:52:50', '2025-12-28 20:52:50'),
(19, 3, 'UI teszt UPDATE most cigány', 'ui-teszt-update-most-cigany-1766955181', NULL, NULL, 8888, NULL, 4, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 20:53:01', '2025-12-28 20:53:01'),
(20, 3, 'UI teszt UPDATE most cigány', 'ui-teszt-update-most-cigany-1766955195', NULL, NULL, 8888, NULL, 45, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 20:53:15', '2025-12-28 20:53:15'),
(21, 12, '111', '111', NULL, NULL, 11, 11, 11, 'A webhely nem érhető el A(z) localhost visszautasította a csatlakozást. Próbálja ki a következőket:  A kapcsolat ellenőrzése A proxy és a tűzfal ellenőrzése ERR_CONNECTION_REFUSED', '[]', 1, '2025-12-28 21:04:03', '2025-12-28 21:04:03'),
(22, 6, 'PS override update OK', 'ps-override-update-ok', NULL, NULL, 11111, NULL, 999, '/uploads/test.jpg', '[\"\\/uploads\\/a.jpg\"]', 1, '2025-12-28 21:45:58', '2025-12-28 21:45:58'),
(23, 4, 'szia lajos', 'qwwasddsa', NULL, NULL, 222, 222, 22, 'sdfdfd', '[]', 0, '2026-01-01 15:11:29', '2026-01-03 13:45:25');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termek_velemenyek`
--

CREATE TABLE `termek_velemenyek` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `termek_id` int(10) UNSIGNED NOT NULL,
  `felhasznalo_id` bigint(20) UNSIGNED DEFAULT NULL,
  `vendeg_nev` varchar(100) DEFAULT 'Névtelen vásárló',
  `ertekeles` tinyint(3) UNSIGNED NOT NULL CHECK (`ertekeles` in (1,2,3,4,5)),
  `cim` varchar(150) NOT NULL,
  `velemeny` text NOT NULL,
  `segitett_igen` int(10) UNSIGNED DEFAULT 0,
  `segitett_nem` int(10) UNSIGNED DEFAULT 0,
  `ellenorzott` tinyint(1) DEFAULT 0,
  `elfogadva` tinyint(1) DEFAULT 1,
  `datum` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `termek_velemenyek`
--

INSERT INTO `termek_velemenyek` (`id`, `termek_id`, `felhasznalo_id`, `vendeg_nev`, `ertekeles`, `cim`, `velemeny`, `segitett_igen`, `segitett_nem`, `ellenorzott`, `elfogadva`, `datum`) VALUES
(1, 1, NULL, 'Kovács Béla', 5, 'Szuper táp, a kutyám imádja!', 'A Royal Canin Mini Adult óta sokkal szebb a szőre a törpe uszkárnak, és végre nem válogatós többé. Nagyon ajánlom!', 0, 0, 1, 1, '2025-01-15 13:22:33'),
(2, 1, NULL, 'Szabó Anita', 4, 'Jó, de kicsit drága', 'Minősége kiváló, a kutyusom egészségesen tartja, de az árért több akció is elférne. Ettől függetlenül újra veszem.', 0, 0, 1, 1, '2025-03-22 08:11:45'),
(3, 3, NULL, 'Nagy István', 5, 'A legjobb hám, amit valaha vettem', 'A JULIUS-K9 erőhám piros XL tökéletesen illeskedik a németjuhászomra, végre nem húz annyira séta közben. Kötelező darab!', 0, 0, 1, 1, '2025-02-28 17:47:12'),
(4, 6, NULL, 'Kiss Eszter', 5, 'A macskám rajong érte', 'A Felix Fantastic duplán finom az egyetlen nedves táp, amit maradéktalanul megeszik a perzsa cicám. 10/10!', 0, 0, 1, 1, '2025-04-10 09:30:55'),
(5, 5, NULL, 'Tóth Gábor', 3, 'Elmegy, de van jobb is', 'A Trixie kerámia tálak szépek, de az állvány kicsit billeg. Közepes méretű kutyánál még oké, de nagyobbnál nem ajánlom.', 0, 0, 0, 1, '2025-05-19 18:05:21'),
(6, 8, NULL, 'Horváth Lili', 5, 'Végre nem vakarózik!', 'A Frontline Tri-Act után eltűntek a bolhák a spánielről, és még most, hónapok múlva sem jöttek vissza. Köszönöm!', 0, 0, 1, 1, '2025-06-30 14:18:44'),
(7, 2, NULL, 'Varga Tamás', 5, 'Ár-érték bajnok', 'Bosch Adult Menue 15 kg-os zsákot vettem, és a golden retrieverem szőre még sosem volt ilyen fényes. Profi választás!', 0, 0, 1, 1, '2025-07-12 11:55:19'),
(8, 7, NULL, 'Papp Réka', 2, 'Nem érte meg az árát', 'A KONG Kickeroo macskajátékot 2 nap alatt széttépte a maine coonom. Vártam tőle többet ennyi pénzért.', 0, 0, 1, 1, '2025-08-25 08:42:33'),
(9, 4, NULL, 'Molnár Péter', 5, 'Tökéletes póráz nagy kutyának', 'Rukka állítható kötélpóráz fekete – végre nem szakad el, és kényelmes a fogása is. 70 kg-os kaukázusi pásztorommal is bírja.', 0, 0, 1, 1, '2025-09-05 17:27:58'),
(10, 9, NULL, 'Fekete Zsanett', 5, 'A nyuszik imádják!', 'Petlife Safebed papírpehely alom a legjobb döntés volt a törpenyulaimnak. Pormentes, szagtalan, és nem eszik meg. Tökéletes!', 0, 0, 1, 1, '2025-11-28 07:19:07'),
(11, 1, NULL, 'Balogh Andrea', 5, 'Minden kutyának ajánlom!', 'Már a harmadik zsakot veszem ebből a tápból. A kutyám energikus és egészséges. Köszönöm!', 0, 0, 1, 1, '2025-12-10 14:30:22'),
(12, 3, NULL, 'Lakatos György', 4, 'Jó minőség, kicsit drága', 'A hám kiváló minőségű, de az ára elég magas. Viszont megéri, mert tartós.', 0, 0, 1, 1, '2025-12-15 09:45:11'),
(14, 23, 11, 'Névtelen vásárló', 5, 'nigger', 'nigger', 0, 0, 0, 1, '2026-01-02 14:23:19');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tiltott_szavak`
--

CREATE TABLE `tiltott_szavak` (
  `id` int(11) NOT NULL,
  `szo` varchar(100) NOT NULL,
  `hozzaadva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `tiltott_szavak`
--

INSERT INTO `tiltott_szavak` (`id`, `szo`, `hozzaadva`) VALUES
(1, 'spam', '2026-01-01 20:05:57'),
(2, 'szar', '2026-01-01 20:05:57'),
(3, 'reklam', '2026-01-01 20:08:40'),
(4, 'scam', '2026-01-01 20:08:40'),
(5, 'fake', '2026-01-01 20:08:40'),
(6, 'hamis', '2026-01-01 20:08:40');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `alkategoriak`
--
ALTER TABLE `alkategoriak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `egyedi_slug` (`kategoria_id`,`slug`);

--
-- A tábla indexei `fal_bejegyzesek`
--
ALTER TABLE `fal_bejegyzesek`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `felhasznalonev` (`felhasznalonev`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `jelszo_reset`
--
ALTER TABLE `jelszo_reset`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- A tábla indexei `kosar`
--
ALTER TABLE `kosar`
  ADD PRIMARY KEY (`felhasznalo_id`,`termek_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `kuponok`
--
ALTER TABLE `kuponok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kod` (`kod`);

--
-- A tábla indexei `kupon_hasznalatok`
--
ALTER TABLE `kupon_hasznalatok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendeles_id` (`rendeles_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `rendelések`
--
ALTER TABLE `rendelések`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rendelés_szam` (`rendelés_szam`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `egyedi_slug` (`slug`),
  ADD KEY `alkategoria_id` (`alkategoria_id`);

--
-- A tábla indexei `termek_velemenyek`
--
ALTER TABLE `termek_velemenyek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `idx_termek` (`termek_id`),
  ADD KEY `idx_ertekeles` (`ertekeles`);

--
-- A tábla indexei `tiltott_szavak`
--
ALTER TABLE `tiltott_szavak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `szo` (`szo`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `alkategoriak`
--
ALTER TABLE `alkategoriak`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT a táblához `fal_bejegyzesek`
--
ALTER TABLE `fal_bejegyzesek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `jelszo_reset`
--
ALTER TABLE `jelszo_reset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `kuponok`
--
ALTER TABLE `kuponok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `kupon_hasznalatok`
--
ALTER TABLE `kupon_hasznalatok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `rendelések`
--
ALTER TABLE `rendelések`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT a táblához `termek_velemenyek`
--
ALTER TABLE `termek_velemenyek`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `tiltott_szavak`
--
ALTER TABLE `tiltott_szavak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `alkategoriak`
--
ALTER TABLE `alkategoriak`
  ADD CONSTRAINT `alkategoriak_ibfk_1` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kosar`
--
ALTER TABLE `kosar`
  ADD CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kosar_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD CONSTRAINT `rendeles_tetelek_ibfk_1` FOREIGN KEY (`rendeles_id`) REFERENCES `rendelések` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendeles_tetelek_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`);

--
-- Megkötések a táblához `rendelések`
--
ALTER TABLE `rendelések`
  ADD CONSTRAINT `rendelések_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`);

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`alkategoria_id`) REFERENCES `alkategoriak` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `termek_velemenyek`
--
ALTER TABLE `termek_velemenyek`
  ADD CONSTRAINT `termek_velemenyek_ibfk_1` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `termek_velemenyek_ibfk_2` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
