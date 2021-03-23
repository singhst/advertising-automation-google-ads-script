function main() {
    var keywords = AdsApp.keywords()
        .orderBy("Impressions DESC")
        .forDateRange("LAST_14_DAYS")
        .withLimit(10)
        .get();

    Logger.log("10 keywords with most impressions last 14 days");
    while (keywords.hasNext()) {
        var keyword = keywords.next();
        Logger.log(keyword.getText() + ": " +
            keyword.getStatsFor("LAST_14_DAYS").getImpressions());
    }
}