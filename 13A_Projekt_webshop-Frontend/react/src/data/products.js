// Teljes termékadatbázis a webshophoz
export const products = {
  // Kutya termékek
  dogFood: [
    { 
      id: 'df1', 
      name: 'Royal Canin Medium Adult', 
      desc: 'Közepes testű felnőtt kutyáknak kifejlesztett táplálás', 
      qty: '15 kg', 
      price: 24990,
      img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop'
    },
    { 
      id: 'df2', 
      name: 'Brit Premium by Nature Adult Large', 
      desc: 'Nagy testű kutyák számára optimalizált tápanyag-összetétel', 
      qty: '15 kg', 
      price: 18990,
      img: 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?w=400&h=300&fit=crop'
    },
    { 
      id: 'df3', 
      name: 'Purina Pro Plan Adult Sensitive', 
      desc: 'Érzékeny emésztésű kutyáknak bárány & rizs', 
      qty: '14 kg', 
      price: 22490,
      img: 'https://images.unsplash.com/photo-1608096299210-c0e3a8323c9a?w=400&h=300&fit=crop'
    },
    { 
      id: 'df4', 
      name: 'Hill\'s Science Plan Puppy', 
      desc: 'Kölyök kutyák egészséges növekedéséhez', 
      qty: '12 kg', 
      price: 26990,
      img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop'
    },
    { 
      id: 'df5', 
      name: 'Orijen Original Grain-Free', 
      desc: 'Gabonamen tes prémium táp friss hússal', 
      qty: '11.4 kg', 
      price: 35990,
      img: 'https://images.unsplash.com/photo-1591768575867-95de8e8b51c9?w=400&h=300&fit=crop'
    },
    { 
      id: 'df6', 
      name: 'Eukanuba Adult Small Breed', 
      desc: 'Kistestű felnőtt kutyáknak speciális granulátum', 
      qty: '7.5 kg', 
      price: 16490,
      img: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=400&h=300&fit=crop'
    }
  ],

  leashes: [
    { 
      id: 'l1', 
      name: 'Flexi New Classic S', 
      desc: 'Automata póráz 8m zsinórral, kis testű kutyáknak', 
      price: 8990,
      img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop'
    },
    { 
      id: 'l2', 
      name: 'Trixie Premium Bőrpóráz', 
      desc: 'Valódi bőr póráz 2m hosszal, elegáns kivitel', 
      price: 5490,
      img: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400&h=300&fit=crop'
    },
    { 
      id: 'l3', 
      name: 'Hunter Freestyle Neon', 
      desc: 'Neon színű nylon póráz, éjszakai sétákhoz', 
      price: 3990,
      img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop'
    },
    { 
      id: 'l4', 
      name: 'Ferplast Jogging Póráz', 
      desc: 'Kétszemélyes futópóráz derékövvel', 
      price: 7290,
      img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'
    }
  ],

  collars: [
    { 
      id: 'c1', 
      name: 'Hunter Modern Art Nyakörv', 
      desc: 'Stílusos nyakörv mintás dizájnnal, S méret', 
      price: 2990,
      img: 'https://images.unsplash.com/photo-1612536916769-748fc7f3e92f?w=400&h=300&fit=crop'
    },
    { 
      id: 'c2', 
      name: 'Trixie Bőr Nyakörv Szegecses', 
      desc: 'Valódi bőr nyakörv fém díszítéssel, M méret', 
      price: 4490,
      img: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400&h=300&fit=crop'
    },
    { 
      id: 'c3', 
      name: 'Ferplast Ergocomfort', 
      desc: 'Ergonomikus nyakörv belső párnázással, L méret', 
      price: 3790,
      img: 'https://images.unsplash.com/photo-1623256303451-bbf8ca818ba9?w=400&h=300&fit=crop'
    },
    { 
      id: 'c4', 
      name: 'Julius-K9 IDC Power', 
      desc: 'Professzionális nyakörv neon elemekkel, XL', 
      price: 5990,
      img: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400&h=300&fit=crop'
    }
  ],

  fleaTreatments: [
    { 
      id: 'ft1', 
      name: 'Frontline Combo Spot-On', 
      desc: 'Bolha és kullancs elleni csepp, kutyáknak', 
      qty: '3 pipetta', 
      price: 7990,
      img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop'
    },
    { 
      id: 'ft2', 
      name: 'Bravecto Rágótabletta', 
      desc: '12 hetes védelem bolha és kullancs ellen', 
      qty: '1 tabletta', 
      price: 11990,
      img: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=300&fit=crop'
    },
    { 
      id: 'ft3', 
      name: 'Seresto Nyakörv', 
      desc: '8 hónapos bolha- és kullancsírtó nyakörv', 
      qty: '1 db', 
      price: 9490,
      img: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop'
    },
    { 
      id: 'ft4', 
      name: 'Advantix Spot-On', 
      desc: 'Széles spektrumú parazitaírtó oldat', 
      qty: '4 pipetta', 
      price: 8790,
      img: 'https://images.unsplash.com/photo-1576864633115-58ab1190a148?w=400&h=300&fit=crop'
    }
  ],

  // Macska termékek
  catFood: [
    { 
      id: 'cf1', 
      name: 'Royal Canin Indoor Adult', 
      desc: 'Beltéri felnőtt macskák számára optimalizált táp', 
      qty: '10 kg', 
      price: 22990,
      img: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400&h=300&fit=crop'
    },
    { 
      id: 'cf2', 
      name: 'Hill\'s Science Plan Sterilised', 
      desc: 'Ivartalanított macskák speciális tápja', 
      qty: '8 kg', 
      price: 19990,
      img: 'https://images.unsplash.com/photo-1548048026-5a1a941d93d3?w=400&h=300&fit=crop'
    },
    { 
      id: 'cf3', 
      name: 'Purina Pro Plan Delicate', 
      desc: 'Érzékeny gyomrú macskáknak pulyka', 
      qty: '7 kg', 
      price: 18490,
      img: 'https://images.unsplash.com/photo-1579185218810-c6c7f07cab7d?w=400&h=300&fit=crop'
    },
    { 
      id: 'cf4', 
      name: 'Whiskas Adult Csirke', 
      desc: 'Kiegyensúlyozott táplálás felnőtt macskáknak', 
      qty: '14 kg', 
      price: 14990,
      img: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400&h=300&fit=crop'
    }
  ],

  catToys: [
    { 
      id: 'ct1', 
      name: 'Trixie Macska Játék Szett', 
      desc: '5 darabos interaktív játék csomag', 
      price: 3490,
      img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=300&fit=crop'
    },
    { 
      id: 'ct2', 
      name: 'Catit Play Circuit', 
      desc: 'Labdás játék pályával, csörgő golyóval', 
      price: 4990,
      img: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400&h=300&fit=crop'
    },
    { 
      id: 'ct3', 
      name: 'Kong Macska Egér', 
      desc: 'Catnip-pel töltött plüss egér', 
      price: 1990,
      img: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?w=400&h=300&fit=crop'
    },
    { 
      id: 'ct4', 
      name: 'PetSafe FroliCat Bolt', 
      desc: 'Automata lézer játék macskáknak', 
      price: 12990,
      img: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400&h=300&fit=crop'
    }
  ],

  // Rágcsáló termékek
  rodentFood: [
    { 
      id: 'rf1', 
      name: 'Versele-Laga Complete Cavia', 
      desc: 'Teljes értékű tengerimalac táp', 
      qty: '1.75 kg', 
      price: 3490,
      img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=300&fit=crop'
    },
    { 
      id: 'rf2', 
      name: 'JR Farm Hörcsög Menü', 
      desc: 'Változatos hörcsög eledel', 
      qty: '1 kg', 
      price: 2790,
      img: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop'
    },
    { 
      id: 'rf3', 
      name: 'Beaphar Care+ Nyúl', 
      desc: 'Extrudált nyúl táp zöldségekkel', 
      qty: '5 kg', 
      price: 6990,
      img: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=300&fit=crop'
    },
    { 
      id: 'rf4', 
      name: 'Vitakraft Vita Verde Széna', 
      desc: 'Prémium minőségű alpesi széna', 
      qty: '1 kg', 
      price: 1990,
      img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
    }
  ],

  rodentCages: [
    { 
      id: 'rc1', 
      name: 'Ferplast Cavie 80 Ketrec', 
      desc: 'Tágas tengerimalac ketrec felszereléssel', 
      price: 24990,
      img: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=300&fit=crop'
    },
    { 
      id: 'rc2', 
      name: 'Savic Hamster Heaven', 
      desc: 'Többszintes hörcsög palota', 
      price: 32990,
      img: 'https://images.unsplash.com/photo-1589369253794-af062d4d5a1f?w=400&h=300&fit=crop'
    },
    { 
      id: 'rc3', 
      name: 'Trixie Natura Nyúl Ketrec', 
      desc: 'Fa nyúlketrec kültéri tartáshoz', 
      price: 45990,
      img: 'https://images.unsplash.com/photo-1607191130855-5b9c1bdb74c2?w=400&h=300&fit=crop'
    }
  ],

  // Hüllő termékek
  reptileFood: [
    { 
      id: 'rpf1', 
      name: 'Exo Terra Soft Pellets', 
      desc: 'Fiatal szakállas agámáknak', 
      qty: '250 g', 
      price: 4990,
      img: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=300&fit=crop'
    },
    { 
      id: 'rpf2', 
      name: 'ReptiLinks Fagyasztott Egér', 
      desc: 'Táplálék kígyóknak és gyíkoknak', 
      qty: '10 db', 
      price: 3490,
      img: 'https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=400&h=300&fit=crop'
    },
    { 
      id: 'rpf3', 
      name: 'Sera Raffy P', 
      desc: 'Víziteknős táp garnélarákkal', 
      qty: '1000 ml', 
      price: 3790,
      img: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop'
    }
  ],

  terrariums: [
    { 
      id: 'tr1', 
      name: 'Exo Terra Glass Terrarium', 
      desc: 'Üveg terrárium 60x45x45cm', 
      price: 42990,
      img: 'https://images.unsplash.com/photo-1591825737453-a6a8e34654d3?w=400&h=300&fit=crop'
    },
    { 
      id: 'tr2', 
      name: 'Repti-Zoo Fűtőlámpa Set', 
      desc: 'Komplett melegítő szett UVB lámpával', 
      price: 18990,
      img: 'https://images.unsplash.com/photo-1604361350461-8e38c5744764?w=400&h=300&fit=crop'
    },
    { 
      id: 'tr3', 
      name: 'Trixie Terrárium Háttér', 
      desc: '3D szikla háttér dekoráció', 
      price: 8990,
      img: 'https://images.unsplash.com/photo-1619020266219-4dd395870a44?w=400&h=300&fit=crop'
    }
  ],

  // Kutya tálak és hámok
  dogBowls: [
    { 
      id: 'db1', 
      name: 'Trixie Kerámia Tál', 
      desc: 'Dishwasher safe kerámia etetőtál', 
      price: 2490,
      img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop'
    },
    { 
      id: 'db2', 
      name: 'Savic Inox Tál Set', 
      desc: 'Rozsdamentes acél tálak állvánnyal', 
      price: 5990,
      img: 'https://images.unsplash.com/photo-1565375473294-c22d2c5e3e2e?w=400&h=300&fit=crop'
    },
    { 
      id: 'db3', 
      name: 'Hunter Melamin Tál', 
      desc: 'Csúszásmentes gumi aljjal', 
      price: 3490,
      img: 'https://images.unsplash.com/photo-1544568104-5b7eb8189dd4?w=400&h=300&fit=crop'
    },
    { 
      id: 'db4', 
      name: 'Ferplast Dupla Tál', 
      desc: 'Állítható magasságú dupla etetőtál', 
      price: 7990,
      img: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=300&fit=crop'
    }
  ],

  dogHarnesses: [
    { 
      id: 'dh1', 
      name: 'Julius-K9 Power Harness', 
      desc: 'Professzionális kutyahám tépőzáras felirattal', 
      price: 12990,
      img: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=300&fit=crop'
    },
    { 
      id: 'dh2', 
      name: 'Hunter Hundesport Hám', 
      desc: 'Könnyű, lélegző anyagból sportoláshoz', 
      price: 8490,
      img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'
    },
    { 
      id: 'dh3', 
      name: 'Trixie Comfort Soft Hám', 
      desc: 'Extra puha bélés, kis testű kutyáknak', 
      price: 5990,
      img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop'
    },
    { 
      id: 'dh4', 
      name: 'Ruffwear Front Range', 
      desc: 'Prémium outdoor kutyahám kalandokhoz', 
      price: 18990,
      img: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=300&fit=crop'
    }
  ],

  // Madár termékek
  birdFood: [
    { 
      id: 'bf1', 
      name: 'Versele-Laga Prestige Papagáj', 
      desc: 'Prémium papagáj keverék mogyoróval', 
      qty: '3 kg', 
      price: 8990,
      img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop'
    },
    { 
      id: 'bf2', 
      name: 'Vitakraft Kanári Menü', 
      desc: 'Teljes értékű táplálás kanáriknak', 
      qty: '1 kg', 
      price: 2490,
      img: 'https://images.unsplash.com/photo-1555169062-013468b47731?w=400&h=300&fit=crop'
    },
    { 
      id: 'bf3', 
      name: 'Tropical Finch Mix', 
      desc: 'Egzotikus madarak számára', 
      qty: '2.5 kg', 
      price: 4990,
      img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&h=300&fit=crop'
    },
    { 
      id: 'bf4', 
      name: 'JR Farm Nimfa Eleség', 
      desc: 'Változatos magkeverék nimfapapagájoknak', 
      qty: '1 kg', 
      price: 3490,
      img: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=400&h=300&fit=crop'
    }
  ],

  birdCages: [
    { 
      id: 'bc1', 
      name: 'Ferplast Piano 6 Kalitka', 
      desc: 'Elegáns kalitka kisebb madaraknak', 
      price: 18990,
      img: 'https://images.unsplash.com/photo-1609682936763-7e9992b6e6d8?w=400&h=300&fit=crop'
    },
    { 
      id: 'bc2', 
      name: 'Savic Residence 70 Papagáj', 
      desc: 'Nagy papagájok számára tágas kalitka', 
      price: 89990,
      img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&h=300&fit=crop'
    },
    { 
      id: 'bc3', 
      name: 'Trixie Natura Madárház', 
      desc: 'Fa madárház kültéri elhelyezéshez', 
      price: 24990,
      img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop'
    },
    { 
      id: 'bc4', 
      name: 'Voltrega Kanári Kalitka', 
      desc: 'Klasszikus dizájnú kalitka állvánnyal', 
      price: 32990,
      img: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=300&fit=crop'
    }
  ],

  // Hal termékek
  fishFood: [
    { 
      id: 'ff1', 
      name: 'Tetra Min Granules', 
      desc: 'Univerzális díszhaltáp granulátum', 
      qty: '250 ml', 
      price: 3490,
      img: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=300&fit=crop'
    },
    { 
      id: 'ff2', 
      name: 'Tropical Cichlid Mix', 
      desc: 'Színfokozó táp sügéreknek', 
      qty: '1000 ml', 
      price: 5990,
      img: 'https://images.unsplash.com/photo-1520990793132-0457d097d4b8?w=400&h=300&fit=crop'
    },
    { 
      id: 'ff3', 
      name: 'Sera Arany Hal Táp', 
      desc: 'Lebegő pellet aranyhalaknak', 
      qty: '500 ml', 
      price: 4490,
      img: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop'
    },
    { 
      id: 'ff4', 
      name: 'JBL NovoGranoMix', 
      desc: 'Prémium granulátum minden halnak', 
      qty: '1000 ml', 
      price: 6990,
      img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop'
    }
  ],

  aquariums: [
    { 
      id: 'aq1', 
      name: 'Juwel Rio 125 Akvárium', 
      desc: 'Komplett akvárium LED világítással', 
      price: 89990,
      img: 'https://images.unsplash.com/photo-1520990793132-0457d097d4b8?w=400&h=300&fit=crop'
    },
    { 
      id: 'aq2', 
      name: 'Eheim Aquapro 180', 
      desc: 'Professzionális akvárium szűrővel', 
      price: 124990,
      img: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop'
    },
    { 
      id: 'aq3', 
      name: 'Tetra AquaArt 60L', 
      desc: 'Kezdőknek ideális akvárium készlet', 
      price: 42990,
      img: 'https://images.unsplash.com/photo-1497671954146-59a89ff626ff?w=400&h=300&fit=crop'
    },
    { 
      id: 'aq4', 
      name: 'Fluval Flex 123L', 
      desc: 'Modern dizájnú ívelt üveg akvárium', 
      price: 98990,
      img: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=300&fit=crop'
    }
  ]
};

export default products;
