export const getCountries = async (page) => {
  await page.waitForSelector(
    "body > div.osu-layout__section.osu-layout__section--full",
    {
      timeout: 10000,
    }
  );

  // Fetch countries values
  const countries = await page.evaluate(() => {
    const countriesElements = document.querySelectorAll(
      "body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--ranking-info > div > div > div > div.select-options.select-options--selecting.select-options--ranking > div.select-options__selector > a"
    );
    return Array.from(countriesElements).map((country) => {
      const countryName = country.querySelector("div").innerText;
      return countryName;
    });
  });
  return countries;
};
