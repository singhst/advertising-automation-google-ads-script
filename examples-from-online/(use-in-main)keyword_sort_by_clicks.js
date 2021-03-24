function main() {
  var keywords = AdsApp.keywords()
    .orderBy("Clicks DESC")
    .forDateRange("LAST_14_DAYS")
    .withLimit(10)
    .get();

  Logger.log("10 keywords with most Clicks last 14 days");
  while (keywords.hasNext()) {
    var keyword = keywords.next();
    Logger.log(keyword.getText() + ": " +
      keyword.getStatsFor("LAST_14_DAYS").getClicks());
  }
}