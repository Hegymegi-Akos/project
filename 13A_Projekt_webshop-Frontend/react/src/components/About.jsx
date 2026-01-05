import React from 'react';

const About = () => {
  return (
    <main className="container page">
      <h1 className="page-title">Rólunk</h1>

      <section className="ui-card" style={{ marginBottom: 16 }}>
        <p className="kezdolapp">
          A 2024-ben alapított webshop azon elhivatottsággal jött létre, hogy állatbarátoknak és állattartóknak
          megbízható és praktikus online vásárlási lehetőséget kínáljon állateledel és állatfelszerelés
          beszerzéséhez, miközben a lehető legjobb szolgáltatást nyújtja.
        </p>
        <p className="kezdolapp">
          Célunk, hogy ügyfeleinknek a legjobb minőséget kínáljuk a legjobb áron. Válasszon több, mint 13000
          termékünkből kedvence számára!
        </p>
        <p className="kezdolapp">
          Mindegy, hogy kutya- vagy macskatulajdonos, énekes madara van, vagy a családja egy nyuszit is tart:
          nálunk kiváló minőségű eledelt és bevizsgált állatfelszerelés kínálatot talál.
        </p>
        <p className="kezdolapp">
          Minden nap azon dolgozunk, hogy javítsuk szolgáltatásunkat. Amennyiben kérdése vagy észrevétele van,
          ügyfélszolgálatunk szívesen áll a rendelkezésére.
        </p>
      </section>

      <section className="ui-card" style={{ marginBottom: 16 }}>
        <h2 className="section-title">Kapcsolat</h2>
        <p className="kezdolapp">
          Ha szeretnél többet megtudni rólunk, látogass el hozzánk személyesen, vagy írj nekünk az alábbi
          elérhetőségeken:
        </p>

        <div className="contact-grid">
          <div className="contact-item">
            <span className="contact-label">E-mail</span>
            <a href="mailto:info@kisallatwebshop.hu">info@kisallatwebshop.hu</a>
          </div>
          <div className="contact-item">
            <span className="contact-label">Telefon</span>
            <a href="tel:+36301234567">+36 30 123 4567</a>
          </div>
          <div className="contact-item">
            <span className="contact-label">Cím</span>
            <span>1234 Budapest, Kutyabarát utca 10.</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title team">Csapatunk</h2>
        <div className="team-container">
          <div className="team-card">
            <img src="/kep/Dominika.jpg" alt="Péterffy Dominika" loading="lazy" />
            <h3>Péterffy Dominika</h3>
            <p className="team-role">Alapító</p>
            <p className="team-desc">Termékkínálat, ügyfélélmény, minőség.</p>
          </div>

          <div className="team-card">
            <img src="/kep/Akos.jpg" alt="Hegymegi-Kiss Ákos" loading="lazy" />
            <h3>Hegymegi-Kiss Ákos</h3>
            <p className="team-role">Adatbázis felelős</p>
            <p className="team-desc">Készlet, rendelések, adatok kezelése.</p>
          </div>

          <div className="team-card">
            <img src="/kep/Martin.jpg" alt="Kamecz Martin" loading="lazy" style={{ objectPosition: 'center 40%' }} />
            <h3>Kamecz Martin</h3>
            <p className="team-role">Designer</p>
            <p className="team-desc">Arculat, UI, reszponzív megjelenés.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;