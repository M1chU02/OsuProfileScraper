export const getPinnedScores = async (page) => {
  // Wait for the specific selector for pinned plays
  await page.waitForSelector(
    "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div.user-profile-pages.ui-sortable > div:nth-child(2) > div.page-extra > div.lazy-load > div:nth-child(2)",
    {
      timeout: 10000,
    }
  );

  // Fetch pinned plays
  const pinnedPlays = await page.evaluate(() => {
    const pinnedPlaysElements = document.querySelectorAll(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div.user-profile-pages.ui-sortable > div:nth-child(2) > div.page-extra > div.lazy-load > div:nth-child(2) > div"
    );
    return Array.from(pinnedPlaysElements).map((pinnedPlay) => {
      const title = pinnedPlay.querySelector(
        ".play-detail__group--top > .play-detail__detail > .play-detail__title"
      ).textContent;
      const timeAgo = pinnedPlay.querySelector(
        ".play-detail__group--top > .play-detail__detail > .play-detail__beatmap-and-time > .play-detail__time > .js-timeago"
      ).innerHTML;

      const mods = Array.from(
        pinnedPlay.querySelectorAll(
          ".play-detail__group--bottom > .play-detail__score-detail--mods > .mod"
        )
      ).map((mod) => {
        const modName = mod.getAttribute("data-acronym");
        return modName;
      });
      const accuracy = pinnedPlay.querySelector(
        ".play-detail__group--bottom > .play-detail__score-detail--score > .play-detail__score-detail-top-right > .play-detail__accuracy-and-weighted-pp > .play-detail__accuracy"
      ).textContent;
      const pp = pinnedPlay.querySelector(
        ".play-detail__group--bottom > .play-detail__pp > span"
      ).textContent;
      const detailPpValue = pinnedPlay
        .querySelector(".play-detail__group--bottom > .play-detail__pp > span")
        .getAttribute("title");

      return {
        title,
        timeAgo,
        mods,
        accuracy,
        pp,
        detailPpValue,
      };
    });
  });
  return pinnedPlays;
};
