import type { TemplateItem } from '../types'

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'blank',
    title: 'Pusty dokument',
    subtitle: 'Rozpocznij od pustego dokumentu',
    previewType: 'blank',
    content: '<p></p>',
  },
  {
    id: 'welcome',
    title: 'Word — Zapraszamy!',
    subtitle: 'Przewodnik po najważniejszych funkcjach',
    previewType: 'welcome',
    content: `
      <h1 style="color: #2b88d8;">Witaj w edytorze ArcWord</h1>
      <p style="font-size: 16px; color: #888;">Poznaj nowoczesny program do tworzenia i edycji dokumentów o wyglądzie Microsoft Word.</p>
      <hr />
      <h2>1. Wstążka poleceń (Ribbon)</h2>
      <p>Na górnym pasku znajdziesz wszystkie niezbędne narzędzia podzielone na logiczne grupy:</p>
      <ul>
        <li><strong>Narzędzia główne</strong> — formatowanie czcionki, akapitu, style tekstu oraz schowek.</li>
        <li><strong>Wstawianie</strong> — tabele, obrazy, kształty, łącza oraz podziały stron.</li>
        <li><strong>Układ</strong> — marginesy, orientacja strony, rozmiar papieru i kolumny.</li>
        <li><strong>Recenzja</strong> — statystyki dokumentu, sprawdzanie pisowni oraz czytanie na głos po polsku.</li>
        <li><strong>Widok</strong> — przełączanie trybu ciemnego/jasnego arkusza oraz linijka.</li>
      </ul>
      <h2>2. Skróty klawiszowe</h2>
      <p>Możesz używać standardowych skrótów biurowych:</p>
      <ul>
        <li><strong>Ctrl + B</strong> — pogrubienie tekstu</li>
        <li><strong>Ctrl + I</strong> — kursywa</li>
        <li><strong>Ctrl + U</strong> — podkreślenie</li>
        <li><strong>Ctrl + Z</strong> oraz <strong>Ctrl + Y</strong> — cofnij / ponów</li>
        <li><strong>Ctrl + S</strong> — szybki zapis</li>
        <li><strong>Ctrl + P</strong> — drukuj dokument</li>
      </ul>
      <h2>3. Autozapis i historia</h2>
      <p>W lewym górnym rogu znajduje się przełącznik <strong>Autozapis</strong>. Twoja praca jest automatycznie zachowywana w pamięci podręcznej.</p>
    `,
  },
  {
    id: 'single_space',
    title: 'Pojedyncze odstępy (pusty)',
    subtitle: 'Dokument z minimalną interlinią',
    previewType: 'single',
    content: `
      <p style="line-height: 1.0; margin-bottom: 0;">Ten dokument jest skonfigurowany z pojedynczym odstępem między wierszami (interlinia 1.0) i brakiem domyślnych marginesów akapitowych.</p>
      <p style="line-height: 1.0; margin-bottom: 0;">Idealny do zwięzłych notatek, zestawień danych i oficjalnych pism.</p>
    `,
  },
  {
    id: 'resume_blue_grey',
    title: 'Niebieskoszary życiorys',
    subtitle: 'Eleganckie CV w tonacji niebieskoszarej',
    previewType: 'resume1',
    content: `
      <table style="width: 100%; border: none;">
        <tbody>
          <tr>
            <td style="width: 65%; vertical-align: top; padding-right: 20px;">
              <h1 style="color: #2b579a; margin-bottom: 4px;">Jan Kowalski</h1>
              <p style="font-size: 16px; color: #555; margin-top: 0;">Specjalista ds. Rozwoju Oprogramowania</p>
              
              <h3 style="color: #2b579a; border-bottom: 1.5px solid #2b579a; padding-bottom: 4px;">Doświadczenie zawodowe</h3>
              <p><strong>Senior Frontend Developer</strong> — Tech Solutions Sp. z o.o.<br /><small>2022 – obecnie | Warszawa</small></p>
              <ul>
                <li>Tworzenie zaawansowanych aplikacji webowych z wykorzystaniem React i TypeScript.</li>
                <li>Optymalizacja wydajności interfejsu i integracja z API.</li>
              </ul>
              
              <p><strong>Frontend Developer</strong> — WebCraft Studio<br /><small>2019 – 2022 | Kraków</small></p>
              <ul>
                <li>Projektowanie responsywnych komponentów UI zgodnie ze standardami WCAG.</li>
              </ul>

              <h3 style="color: #2b579a; border-bottom: 1.5px solid #2b579a; padding-bottom: 4px;">Edukacja</h3>
              <p><strong>Politechnika Warszawska</strong><br />Informatyka stosowana, Magister inżynier (2014 – 2019)</p>
            </td>
            <td style="width: 35%; vertical-align: top; background: rgba(43, 87, 154, 0.08); padding: 16px; border-radius: 6px;">
              <h4 style="color: #2b579a; margin-top: 0;">Dane kontaktowe</h4>
              <p style="font-size: 13px;">📞 +48 123 456 789<br />✉️ jan.kowalski@email.pl<br />📍 Warszawa, Polska<br />🔗 linkedin.com/in/jankowalski</p>
              
              <h4 style="color: #2b579a;">Umiejętności</h4>
              <ul style="font-size: 13px; padding-left: 16px;">
                <li>React, TypeScript, Next.js</li>
                <li>HTML5, CSS3, Tailwind CSS</li>
                <li>Zarządzanie stanem (Zustand, Redux)</li>
                <li>Git, Docker, CI/CD</li>
              </ul>
              
              <h4 style="color: #2b579a;">Języki</h4>
              <p style="font-size: 13px;">Polski — ojczysty<br />Angielski — C1 (biegły)</p>
            </td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'first_toc',
    title: 'Wstawianie pierwszego spi...',
    subtitle: 'Dokument z automatycznym spisem treści',
    previewType: 'toc',
    content: `
      <h1 style="color: #0078d4;">Raport Projektu Rocznego</h1>
      <p style="color: #777;">Autor: Zespół Projektowy ArcWord | Data: Październik 2026</p>
      
      <div style="background: rgba(0, 120, 212, 0.06); padding: 18px; border-left: 4px solid #0078d4; margin: 24px 0;">
        <h3 style="margin-top: 0; color: #0078d4;">Spis treści</h3>
        <p style="margin: 6px 0;">1. Wprowadzenie i cele strategiczne .................................................... s. 1</p>
        <p style="margin: 6px 0;">2. Architektura systemu i technologie .................................................. s. 2</p>
        <p style="margin: 6px 0;">3. Harmonogram wdrożenia i kamienie milowe ..................................... s. 3</p>
        <p style="margin: 6px 0;">4. Podsumowanie i dalsze kroki ......................................................... s. 4</p>
      </div>

      <h2>1. Wprowadzenie i cele strategiczne</h2>
      <p>Niniejszy dokument przedstawia kompleksowy przegląd założeń architektonicznych oraz plan wdrożenia nowej wersji oprogramowania biurowego.</p>
      
      <h2>2. Architektura systemu i technologie</h2>
      <p>Aplikacja bazuje na modułowej strukturze komponentów interfejsu, gwarantującej wysoką responsywność oraz pełną zgodność z wzorcami Fluent Design.</p>
    `,
  },
  {
    id: 'modern_chrono_resume',
    title: 'Nowoczesny życiorys chro...',
    subtitle: 'Układ chronologiczny z wyróżnioną osią czasu',
    previewType: 'resume2',
    content: `
      <h1 style="color: #107c41; margin-bottom: 2px;">Anna Nowak</h1>
      <p style="color: #666; font-size: 15px; margin-top: 0;">Product Designer & UX Specialist</p>
      <p style="font-size: 13px; color: #888;">anna.nowak@example.com | +48 600 700 800 | Wrocław, Polska</p>
      <hr style="border-color: #107c41;" />
      
      <h3 style="color: #107c41;">Podsumowanie zawodowe</h3>
      <p>Doświadczona projektantka produktów cyfrowych z ponad 6-letnim stażem w projektowaniu systemów SaaS oraz aplikacji mobilnych.</p>

      <h3 style="color: #107c41;">Przebieg kariery</h3>
      <p><strong>Lead UX/UI Designer</strong> — Creative Agency (2021 – obecnie)</p>
      <ul>
        <li>Kierowanie 5-osobowym zespołem projektantów UI/UX.</li>
        <li>Wdrożenie spójnego Design Systemu dla kluczowych produktów.</li>
      </ul>
      <p><strong>UI Designer</strong> — Digital Crafters (2018 – 2021)</p>
      <ul>
        <li>Projektowanie makiet wysokiej wierności i interaktywnych prototypów.</li>
      </ul>
    `,
  },
  {
    id: 'modern_chrono_cover',
    title: 'Nowoczesny chronologicz...',
    subtitle: 'List motywacyjny z nagłówkiem dopasowanym do CV',
    previewType: 'cover1',
    content: `
      <div style="text-align: right; color: #777;">
        <p>Warszawa, 17 października 2026 r.</p>
      </div>
      <p><strong>Jan Kowalski</strong><br />ul. Przykładowa 12/4<br />00-001 Warszawa<br />jan.kowalski@email.pl</p>
      
      <p><strong>Szanowni Państwo,</strong><br />Dział Rekrutacji<br />Innowacje Cyfrowe S.A.<br />ul. Biznesowa 100, Warszawa</p>
      
      <h3 style="color: #107c41;">Dotyczy: Aplikacja na stanowisko Senior Product Specialist</h3>
      
      <p>Z wielkim zainteresowaniem zapoznałem się z ofertą pracy na stanowisko Senior Product Specialist w Państwa firmie. Moje dotychczasowe doświadczenie oraz pasja do tworzenia najwyższej jakości rozwiązań sprawiają, że z entuzjazmem pragnę wnieść wkład w rozwój Państwa projektów.</p>
      <p>Wierzę, że moje umiejętności oraz zaangażowanie będą cennym wzmocnieniem dla Państwa zespołu.</p>
      <p>Z poważaniem,<br /><br /><strong>Jan Kowalski</strong></p>
    `,
  },
  {
    id: 'blue_grey_cover',
    title: 'Niebieskoszary list motywa...',
    subtitle: 'List motywacyjny w stylu niebieskoszarym',
    previewType: 'cover2',
    content: `
      <div style="border-top: 4px solid #2b579a; padding-top: 16px;">
        <h2 style="color: #2b579a; margin-bottom: 2px;">Jan Kowalski</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">jan.kowalski@email.pl • +48 123 456 789 • Warszawa</p>
      </div>
      <br />
      <div style="text-align: right; color: #777; font-size: 14px;">
        Data: 17 października 2026 r.
      </div>
      <br />
      <p><strong>Do wiadomości:</strong><br />Zarząd Spółki ArcCorp<br />Al. Jerozolimskie 50, Warszawa</p>
      <br />
      <p><strong>Szanowny Panie / Szanowna Pani,</strong></p>
      <p>Zwracam się z uprzejmą prośbą o rozpatrzenie mojej kandydatury na stanowisko Głównego Architekta Aplikacji w Państwa przedsiębiorstwie.</p>
      <p>W trakcie mojej kariery zawodowej zrealizowałem dziesiątki wdrożeń systemów webowych, kładąc szczególny nacisk na estetykę, ergonomię pracy użytkownika oraz najwyższe standardy inżynierii oprogramowania.</p>
      <p>Będę zaszczycony możliwością spotkania na rozmowie rekrutacyjnej, aby szczegółowo zaprezentować moje kwalifikacje.</p>
      <br />
      <p>Z wyrazami szacunku,</p>
      <p><em>Jan Kowalski</em></p>
    `,
  },
]
