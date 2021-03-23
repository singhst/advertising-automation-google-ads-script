function getadGroupstats() {
  var adGroupIterator = AdsApp.adGroups()
    .withCondition('Name = "For all people"')
    .get();
  if (adGroupIterator.hasNext()) {
    var adGroup = adGroupIterator.next();
    // You can also request reports for pre-defined date ranges. See
    // https://developers.google.com/adwords/api/docs/guides/awql,
    // DateRangeLiteral section for possible values.
    var stats = adGroup.getStatsFor('LAST_MONTH');
    Logger.log(adGroup.getName() + ', #clicks=' + stats.getClicks() + ', #impressions=' +
      stats.getImpressions());
  }
}

function main() {
  getadGroupstats();
}