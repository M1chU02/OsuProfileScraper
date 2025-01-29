export const getProfileStats = async (page, userIdentifier) => {
  console.log(userIdentifier);
  const profileStats = await page.evaluate(() => {
    let profileName = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-info.profile-info--cover > div.profile-info__details > div.profile-info__info > h1 > span"
    ).innerHTML;

    let profileRank = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div.profile-detail__chart-numbers.profile-detail__chart-numbers--top > div:nth-child(1) > div:nth-child(1) > div.value-display__value > div"
    ).innerHTML;
    profileRank = profileRank.replace("&nbsp;", ",");

    let profileCountryRank = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div.profile-detail__chart-numbers.profile-detail__chart-numbers--top > div:nth-child(1) > div:nth-child(2) > div.value-display__value > div"
    ).innerHTML;
    profileCountryRank = profileCountryRank.replace("&nbsp;", ",");

    let profilePlayCount = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div.profile-stats > dl.profile-stats__entry.profile-stats__entry--key-play_count > dd"
    ).innerHTML;

    let profilePP = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div.profile-detail__values.profile-detail__values--grid > div:nth-child(2) > div.value-display__value > div"
    ).innerHTML;

    let profileAccuracy = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div.profile-stats > dl.profile-stats__entry.profile-stats__entry--key-hit_accuracy > dd"
    ).textContent;

    return {
      Name: profileName,
      Rank: profileRank,
      "Country Rank": profileCountryRank,
      "Play Count": profilePlayCount,
      "Performance Points": profilePP,
      Accuracy: profileAccuracy,
    };
  });
  return profileStats;
};
