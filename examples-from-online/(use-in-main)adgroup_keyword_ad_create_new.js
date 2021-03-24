/*
https://www.damiengonot.com/blog/adwords-scripts-create-ads

Reorganized the main code as functions.
*/

// ////////////////////////////////////////////////////////////////////////////
// Configurations

var campaignName = "To increase website traffic";
// Use this if you only want to look at some campaigns.
// For example "'Brand'" would only look at campaigns with 'Brand' in the name,

var adGroupNames = [
  // 'New York City',
  // 'Los Angeles',
  // 'Chicago',
  // 'Houston',
  // 'Philadelphia'
  'script test'
];
//Define the Ad Group name.

var keywords = [
  'bike repair',
  'bike repair shop',
  'bike shop'
];
//Define keywords added to each new Ad Group.

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
      // .withText('+' + keyword.toLowerCase().replace(/ /g, ' +')) //'+' enables broad match
      .withText(keyword.toLowerCase())
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