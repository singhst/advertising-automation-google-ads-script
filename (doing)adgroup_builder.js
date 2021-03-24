/*

Steps of this program:
1. Get top-N keywords from a campaign, which ranked by number of clicks OR impressions etc.
2. Create a new Ad Group in that campaign.
3. Add the following in the new Ad Group:
    (a) top-N keywords
    (b) Expanded Text Ad
*/

// ////////////////////////////////////////////////////////////////////////////
// Configurations

var campaignName = "Esport tournament"; //"To increase website traffic";
// Use this if you only want to look at some campaigns.
// For example "'Brand'" would only look at campaigns with 'Brand' in the name,

var dateRange = "LAST_14_DAYS";

var numbOfKeywords = 20;

var adGroupNames = [
  // 'New York City',
  // 'Los Angeles',
  // 'Chicago',
  // 'Houston',
  // 'Philadelphia'
  'adgroup_builder'
];
//Define the Ad Group name.

var costPerClick = 1.5
//Sets the max CPC bid of the new audience to the specified value.

var headlinePart1 = ' Bike Repair Shop';
var headlinePart2 = 'Fast & professional';
var description = 'Repair Your Bike Here & Buy Accessories. ' +
                  'Book Your Appointment Now!';
var finalUrl = 'https://www.example.com' //'www.example.com/Your-Landing-Page';
// var urlPath1 = 'Path Text 1';
// var urlPath2 = 'Path Text 2';
// The text for your template ad

// ////////////////////////////////////////////////////////////////////////////


function main() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  Logger.log(date);

  //Get top-N keywords which ranked by clicks from the campaign 
  var keywords = getAndRankKeywords(campaignName, dateRange, numbOfKeywords);
  // var keywords = getKeywordsByReport(campaignName, dateRange);

  Logger.log(keywords);

  //Select campaign by name
  var campaign = AdsApp.campaigns()
    .withCondition("Name = '" + campaignName + "'")
    .withLimit(1)
    .get()
    .next();

  //Create Ad Group by each name in the `adGroupNames` array
  adGroupNames.forEach(function (adGroupName) {
    //Build a new Ad Group
    var adGroup = createAdGroup(campaign, adGroupName);

    //Add keywords to Ad Group
    adGroup = addKeywordToAdGroup(adGroup, keywords);

    //Add expanded text ad to Ad Group
    addExpandedTextAdToAdGroup(adGroup, adGroupName);
  });

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

//not use, query doesn't support ORDER BY in API call
//Report basic
//https://developers.google.com/adwords/api/docs/guides/reporting
//Best practice for reporting
//https://developers.google.com/google-ads/scripts/docs/best-practices#reporting
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


// create Ad Group,
// https://www.damiengonot.com/blog/adwords-scripts-create-ads
function createAdGroup(campaign, adGroupName) {
  //Build a new Ad Group
  var adGroupBuilder = campaign.newAdGroupBuilder();

  var adGroupOperation = adGroupBuilder
    .withName(adGroupName.toLowerCase().replace(/ /g, '_'))
    .withStatus('PAUSED')
    .build();

  var adGroup = adGroupOperation.getResult();

  return adGroup;
}

function addKeywordToAdGroup(adGroup, keywords) {
  //Add keywords
  keywords.forEach(function (keyword) {
    adGroup.newKeywordBuilder()
      .withText('+' + keyword.toLowerCase().replace(/ /g, ' +'))
      // .withCpc(costPerClick)
      // .withFinalUrl(finalUrl)
      .build();
  });

  return adGroup;
}

function addExpandedTextAdToAdGroup(adGroup, adGroupName) {
  //Add expanded text ad
  adGroup.newAd().expandedTextAdBuilder()
    .withHeadlinePart1(adGroupName + headlinePart1)
    .withHeadlinePart2(headlinePart2)
    .withDescription(description)
    // .withPath1('bike-repair')
    // .withPath2(adGroupName.toLowerCase().replace(/ /g, '_'))
    .withFinalUrl(finalUrl)
    .build();

  return adGroup;
}