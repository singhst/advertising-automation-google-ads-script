
// ////////////////////////////////////////////////////////////////////////////
// Configurations


var campaignName = "Esport tournament";

var adGroupNames = 'best_keyword_last_14days';

// ////////////////////////////////////////////////////////////////////////////


function main() {

  //Pause Keywords = 0 Impressions

  var keywordsIterator = AdWordsApp.keywords()
    .withCondition("CampaignName = '" + campaignName + "'")
    .withCondition("AdGroupName = '" + adGroupNames + "'")
    .withCondition("Impressions = 0")
    // .withCondition('CampaignStatus = ENABLED')
    // .withCondition("AdGroupStatus = ENABLED")
    .withCondition("Status = ENABLED")
    // .withCondition("AdvertisingChannelType = SEARCH")
    .forDateRange("ALL_TIME")
    .get();

    var ary = [];

  while (keywordsIterator.hasNext()) {
    var keyword = keywordsIterator.next();
    ary.push(keyword.getText());
    keyword.pause(); // You can replace "pause" with "remove" incase you want to delete them forever. 
  }
  Logger.log(ary);
}