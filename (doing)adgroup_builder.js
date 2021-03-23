/*

Steps of this program:
1. Get top-N keywords from a campaign, which ranked by number of clicks OR impressions etc.
2. Create a new Ad Group in that campaign.
3. Add the following in the new Ad Group:
    (a) top-3 keywords
    (b) Expanded Text Ad
*/

// ////////////////////////////////////////////////////////////////////////////
// Configurations

var campaignName = "Esport tournament";
// Use this if you only want to look at some campaigns.
// For example "'Brand'" would only look at campaigns with 'Brand' in the name,

var dateRange = "LAST_14_DAYS";

var numbOfKeywords = 20;

// ////////////////////////////////////////////////////////////////////////////


function main() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  Logger.log(date);

  //Get top-N keywords ranked by clicks from the campaign 
  var keywords = getAndRankKeywords(campaignName, dateRange, numbOfKeywords);
  // var keywords = getKeywordsByReport(campaignName, dateRange);

  Logger.log(keywords);

}

function getAndRankKeywords(campaignName, dateRange, N) {
  var keywordsArray = [];

  var keywords = AdsApp.keywords()
    .withCondition("CampaignName = " + "'" + campaignName + "'")
    .orderBy("Clicks DESC")
    .forDateRange(dateRange)
    .withLimit(N)
    .get();

  // Logger.log("20 keywords with most Clicks last 14 days");

  while (keywords.hasNext()) {
    var keyword = keywords.next();
    // Logger.log(keyword.getText() + ": " +
    //   keyword.getStatsFor(dateRange).getClicks());
    // Logger.log(keyword.getCampaign().getName());
    keywordsArray.push(keyword.getText())
  }

  // Logger.log(keywordsArray);

  return keywordsArray;
}

//Report basic
//https://developers.google.com/adwords/api/docs/guides/reporting
//Best practice for reporting
//https://developers.google.com/google-ads/scripts/docs/best-practices#reporting
//not use, query doesn't support ORDER BY in API call
function getKeywordsByReport(campaignName, dateRange) {
  // if (ignorePausedAdGroups) {
  //   var whereStatement = 'AdGroupStatus = ENABLED ';
  // } else {
  //   var whereStatement = "AdGroupStatus IN ['ENABLED','PAUSED'] ";
  // }

  var keywordsArray = [];

  var query = 'SELECT Criteria, Impressions, Clicks, Cost' +
              ' FROM KEYWORDS_PERFORMANCE_REPORT' +
              ' WHERE CampaignName IN [\'' + campaignName + '\']' +
              // ' ORDER BY Clicks DESC' +
              ' DURING ' + dateRange

  Logger.log('query= ' + query)

  var report = AdsApp.report(query);

  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    keywordsArray.push(row.Criteria);
  }

  return keywordsArray;
}

function rankKeywords() {

}


// create Ads,
// https://www.damiengonot.com/blog/adwords-scripts-create-ads
function createAdGroupInCampaign(campaignName) {
  var campaign = AdsApp.campaigns()
      .withCondition("Name = \'" + campaignName +"\'")
      .withLimit(1)
      .get()
      .next();

  var adGroupBuilder = campaign.newAdGroupBuilder();


}

function addKeywordsToAdGroup() {

}

function addExpandedTextAdToAdGroup() {

}