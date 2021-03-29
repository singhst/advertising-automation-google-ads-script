/*

Steps of this program:
1. Get top-N keywords from a campaign, which ranked by number of clicks OR impressions etc.
2. Get the best Ad (expanded text ad, Responsive search ad, Responsive display ad, etc.)
3. Create a new Ad Group in that campaign.
4. Add the following in the new Ad Group:
    (a) top-N keywords
    (b) the best Ad in the campaign

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
  'best_keyword_cpc_last_14days'
];
//Define the Ad Group name.

var costPerClick = 1.5
//Sets the max CPC bid of the new audience to the specified value.


// {adType=EXPANDED_TEXT_AD, headlinePart3=Free Esport, headlinePart2=Free Gaming Experience, 
// path1=null, headlinePart1=Esport Free, path2=null, 
// description=Free Esport for gamer lover. Check it out! starwingo3o.github.io/, 
// id=504260779566, description2=Free Esport for gamer lover. Check it out! starwingo3o.github.io/, 
// description1=Free Esport for gamer lover. Check it out! starwingo3o.github.io/}



var headlinePart1 = 'Esport Free'; //' Bike Repair Shop';
var headlinePart2 = 'Free Gaming Experience'; //Fast & professional';
var headlinePart3 = 'Free Esport'; //Fast & professional';
var description = 'Free Esport for gamer lover. Check it out! starwingo3o.github.io/'
var finalUrl = 'https://starwingo3o.github.io/' //'www.example.com/Your-Landing-Page';
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
  // var keywords = getAndRankKeywordsByReport(campaignName, dateRange);

  Logger.log(keywords);

  //Select campaign by name
  var campaign = AdsApp.campaigns()
    .withCondition("Name = '" + campaignName + "'")
    .withLimit(1)
    .get()
    .next();

  //Create new Ad Group by each name in the `adGroupNames` array
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
    // .orderBy("Clicks DESC")
    // .orderBy("AverageCpc DESC")
    .orderBy("MaxCpc DESC")
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
function getAndRankKeywordsByReport(campaignName, dateRange) {
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


function getAndCopyAd(campaignName, dateRange) {

}


// create Ad Group,
// https://www.damiengonot.com/blog/adwords-scripts-create-ads
function createAdGroup(campaign, adGroupName) {
  //Build a new Ad Group
  var adGroupBuilder = campaign.newAdGroupBuilder();

  var adGroupOperation = adGroupBuilder
    .withName(adGroupName.toLowerCase().replace(/ /g, '_'))
    // .withStatus('PAUSED') //If the status is not set, it will default to ENABLED.
    .build();

  var adGroup = adGroupOperation.getResult();

  return adGroup;
}


function addKeywordToAdGroup(adGroup, keywords) {
  //Add keywords
  keywords.forEach(function (keyword) {
    adGroup.newKeywordBuilder()
      // .withText('+' + keyword.toLowerCase().replace(/ /g, ' +'))
      .withText(keyword.toLowerCase())
      // .withCpc(costPerClick)
      // .withFinalUrl(finalUrl)
      .build();
  });

  return adGroup;
}


function addExpandedTextAdToAdGroup(adGroup, adGroupName) {
  //Add expanded text ad
  adGroup = adGroup.newAd().expandedTextAdBuilder()
    .withHeadlinePart1(headlinePart1)
    .withHeadlinePart2(headlinePart2)
    .withHeadlinePart3(headlinePart3)
    .withDescription(description)
    // .withPath1('bike-repair')
    // .withPath2(adGroupName.toLowerCase().replace(/ /g, '_'))
    .withFinalUrl(finalUrl)
    .build();

  return adGroup;
}


function copyExpandedTextAdToAdGroup(adGroup, adGroupName, adContent) {
  //Add expanded text ad
  adGroup = adGroup.newAd().expandedTextAdBuilder()
    .withHeadlinePart1(headlinePart1)
    .withHeadlinePart2(headlinePart2)
    .withHeadlinePart3(headlinePart3)
    .withDescription(description)
    // .withPath1('bike-repair')
    // .withPath2(adGroupName.toLowerCase().replace(/ /g, '_'))
    .withFinalUrl(finalUrl)
    .build();

  return adGroup;
}