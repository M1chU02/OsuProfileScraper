export const getProfileLinks = async (page) => {
  const profileLinks = await page.evaluate(async () => {
    const links = document.querySelectorAll(
      "body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--generic > div.ranking-page > table > tbody > tr"
    );
    return Array.from(links).map((link) => {
      const profileLink = link.querySelector("td:nth-child(2) > div > a").href;
      return profileLink;
    });
  });
  return profileLinks;
};
