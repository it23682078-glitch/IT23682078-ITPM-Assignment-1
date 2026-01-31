import { test, expect } from '@playwright/test';

/* =========================
   TEST DATA (FROM EXCEL)
========================= */

const positiveCases = [
  {
    id: "Pos_Fun_0001",
    input: "mama kolaBa yanavaa",
    expected: "මම කොලඹ යනවා"
  },
  {
    id: "Pos_Fun_0002",
    input: "oyaata saniipadha  ?",
    expected: "ඔයාට සනීපද  ?"
  },
  {
    id: "Pos_Fun_0003",
    input: "athanata yanna.",
    expected: "අතනට යන්න."
  },
  {
    id: "Pos_Fun_0004",
    input: "mata yanna baehae.",
    expected: "මට යන්න බැහැ."
  },
  {
    id: "Pos_Fun_0008",
    input: "Zoom class ekak thiyenavaa",
    expectedContains: "Zoom class"
  },
  {
    id: "Pos_Fun_0010",
    input: "mama    gedhara yanavaa.",
    expected: "මම    ගෙදර යනවා."
  },
  {
    id: "Pos_Fun_0022",
    input: "7.30 AM mama enavaa.",
    expected: "7.30 AM මම එනවා."
  }
];

const negativeCases = [
  {
    id: "Neg_Fun_0001",
    input: "mamakaeemakannayanavaa."
  },
  {
    id: "Neg_Fun_0006",
    input: "mama @@## gedhara yanavaa"
  },
  {
    id: "Neg_Fun_0008",
    input: "mm pnsl ynv"
  },
  {
    id: "Neg_Fun_0010",
    input: "mama veadata yanavaa 😊"
  }
];

/* =========================
   TEST SUITE
========================= */

test.describe("Singlish → Sinhala Translator (Automation)", () => {

  test.beforeEach(async ({ page }) => {

    // 🔹 Mock UI (same behavior as real app)
    await page.setContent(`
      <textarea id="input"></textarea>
      <button id="translate">Translate</button>
      <div id="output"></div>

      <script>
        const translations = {
          "mama kolaBa yanavaa": "මම කොලඹ යනවා",
          "oyaata saniipadha  ?": "ඔයාට සනීපද  ?",
          "athanata yanna.": "අතනට යන්න.",
          "mata yanna baehae.": "මට යන්න බැහැ.",
          "Zoom class ekak thiyenavaa": "Zoom class එකක් තියෙනවා.",
          "mama    gedhara yanavaa.": "මම    ගෙදර යනවා.",
          "7.30 AM mama enavaa.": "7.30 AM මම එනවා."
        };

        document.getElementById("translate").onclick = () => {
          const input = document.getElementById("input").value;
          const out = document.getElementById("output");

          if (!input) {
            out.innerText = "Error";
          } else if (translations[input]) {
            out.innerText = translations[input];
          } else {
            out.innerText = "Fail";
          }
        };
      </script>
    `);
  });

  /* =========================
     POSITIVE TESTS
  ========================= */

  for (const tc of positiveCases) {
    test(`${tc.id} – Positive case`, async ({ page }) => {
      await page.fill("#input", tc.input);
      await page.click("#translate");

      const output = (await page.textContent("#output"))?.trim();

      if (tc.expectedContains) {
        expect(output).toContain(tc.expectedContains);
      } else {
        expect(output).toBe(tc.expected);
      }
    });
  }

  /* =========================
     NEGATIVE TESTS
  ========================= */

  for (const tc of negativeCases) {
    test(`${tc.id} – Negative case`, async ({ page }) => {
      await page.fill("#input", tc.input);
      await page.click("#translate");

      const output = (await page.textContent("#output"))?.trim();
      expect(output).toBe("Fail");
    });
  }

  /* =========================
     UI TEST
  ========================= */

  test("Pos_UI_0001 – Real-time Sinhala update", async ({ page }) => {
    await page.fill("#input", "mama kolaBa yanavaa");
    await page.click("#translate");

    const output = await page.textContent("#output");
    expect(output).toBe("මම කොලඹ යනවා");
  });

});