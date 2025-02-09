export const getTopScores = async (page) => {
  console.log("Fetching top scores..."); // Debugging
  // Wait for the specific selector for top plays
  await page.waitForSelector(
    "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div.user-profile-pages.ui-sortable > div[data-page-id='top_ranks'] > div > div.lazy-load > div:nth-child(4)",
    {
      timeout: 30000,
    }
  );

  // Fetch top plays
  const topPlays = await page.evaluate(async () => {
    if (
      document.querySelector(
        "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div.user-profile-pages.ui-sortable > div[data-page-id='top_ranks'] > div > div.lazy-load > div:nth-child(4) > button"
      )
    ) {
      const loadMoreButton = document.querySelector(
        "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div.user-profile-pages.ui-sortable > div[data-page-id='top_ranks'] > div > div.lazy-load > div:nth-child(4) > button"
      );
      loadMoreButton.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const topPlaysElements = document.querySelectorAll(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div.user-profile-pages.ui-sortable > div[data-page-id='top_ranks'] > div > div.lazy-load > div:nth-child(4) > div"
    );
    return Array.from(topPlaysElements)
      .slice(0, 10)
      .map((topPlay) => {
        const title = topPlay.querySelector(
          ".play-detail__group--top > .play-detail__detail > .play-detail__title"
        ).textContent;
        const songLink = topPlay.querySelector(
          ".play-detail__group--top > .play-detail__detail > a"
        ).href;
        const songId = songLink.split("/").pop();
        const directLink = `osu://b/{songId}`;
        const timeAgoElement = topPlay.querySelector(
          ".play-detail__group--top > .play-detail__detail > .play-detail__beatmap-and-time > .play-detail__time > .js-timeago"
        );
        const timeAgo = new Date(
          timeAgoElement.getAttribute("title")
        ).toLocaleString();

        const mods = Array.from(
          topPlay.querySelectorAll(
            ".play-detail__group--bottom > .play-detail__score-detail--mods > .mod"
          )
        ).map((mod) => {
          const modName = mod.getAttribute("data-acronym");
          return modName;
        });
        const accuracy = topPlay.querySelector(
          ".play-detail__group--bottom > .play-detail__score-detail--score > .play-detail__score-detail-top-right > .play-detail__accuracy-and-weighted-pp > .play-detail__accuracy"
        ).textContent;
        const pp = topPlay.querySelector(
          ".play-detail__group--bottom > .play-detail__pp > span"
        ).textContent;
        const detailPpValue = topPlay
          .querySelector(
            ".play-detail__group--bottom > .play-detail__pp > span"
          )
          .getAttribute("title");

        console.log(title, timeAgo, mods, accuracy, pp, detailPpValue); // Debugging

        return {
          title,
          songLink,
          songId,
          directLink,
          timeAgo,
          mods,
          accuracy,
          pp,
          detailPpValue,
        };
      });
  });
  return topPlays;
};
