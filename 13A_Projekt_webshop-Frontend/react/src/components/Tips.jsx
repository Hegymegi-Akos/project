import React from 'react';

const Tips = () => {
  // Állatgondozási tippek listája
  const tips = [
    {
      category: 'Kutya',
      title: 'Hogyan gondozd a kutyád szőrét?',
      content: 'Rendszeres fésülködés és fürdetés segít megelőzni a csomók kialakulását és a bőrproblémákat.'
    },
    {
      category: 'Macska',
      title: 'Macskaalom gondozása',
      content: 'Hetente cseréld az almot, hogy tiszta és higiénikus környezetet biztosíts kedvencednek.'
    },
    {
      category: 'Madár',
      title: 'Madarak etetése',
      content: 'Különböző magvak és gyümölcsök kombinációja biztosítja a kiegyensúlyozott táplálkozást.'
    },
    {
      category: 'Hal',
      title: 'Akvárium karbantartása',
      content: 'Hetente cseréld a víz egy részét és tisztítsd meg a szűrőt a tiszta vízért.'
    },
    {
      category: 'Hüllő',
      title: 'Hüllők hőmérséklete',
      content: 'Biztosíts megfelelő hőmérsékletet és UVB fényt a hüllők egészségéhez.'
    },
    {
      category: 'Rágcsáló',
      title: 'Rágcsálók fogai',
      content: 'Kemény eleség és rágcsálnivalók segítenek a fogak kopásában.'
    }
  ];

  return (
    <div className="container mt-4">
      <h1>Állatgondozási Tippek</h1>
      <p>Itt találsz hasznos tanácsokat kedvenceid gondozásához.</p>
      <div className="row">
        {/* Tippek megjelenítése kártyákban */}
        {tips.map((tip, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{tip.category}: {tip.title}</h5>
                <p className="card-text">{tip.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;