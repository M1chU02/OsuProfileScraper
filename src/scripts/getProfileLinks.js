export const getProfileLinks = async (page, urlType) => {
  if (urlType == "formattedUrlGlobal") {
    const profileLinks = await page.evaluate(async () => {
      const links = document.querySelectorAll(
        "body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--generic > div.ranking-page > table > tbody > tr > td:nth-child(4) > div > a"
      );
      return Array.from(links).map((link) => {
        const profileLink = link.href;
        return profileLink;
      });
    });
    return profileLinks;
  } else {
    const profileLinks = await page.evaluate(async () => {
      const links = document.querySelectorAll(
        "body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--generic > div.ranking-page > table > tbody > tr > td:nth-child(2) > div > a"
      );
      return Array.from(links).map((link) => {
        const profileLink = link.href;
        return profileLink;
      });
    });
    return profileLinks;
  }
};
