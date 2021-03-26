/*
https://optimizationup.com/adwords-script-stop-low-search-volume-keywords/
*/

/***************************************************
* Low Search Volume Keywords Script
* Version 1.0
* Created By: Ahmed Ali
*https://optimizationup.com/
****************************************************/

function main() {
  var labelName = 'NEW'; //add your label here to prevent the script from modifying these items.

  // Pause Campaigns = 0 Impressions
  
  var campaignIterator = AdWordsApp.campaigns()
    .withCondition("Impressions = 0")
    .withCondition("Status = ENABLED")
    .withCondition('LabelNames CONTAINS_NONE ["' + labelName + '"]')
    .withCondition("AdvertisingChannelType = SEARCH")
    .forDateRange("ALL_TIME")
    .get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    campaign.pause();
  } 
  

  //Pause Ad groups = 0 Impressions  
  
  var adGroupIterator = AdWordsApp.adGroups()
    .withCondition("Impressions = 0")
    .withCondition('CampaignStatus = ENABLED')
    .withCondition("Status = ENABLED")
    .withCondition('LabelNames CONTAINS_NONE ["' + labelName + '"]')
    .withCondition("AdvertisingChannelType = SEARCH")
    .forDateRange("ALL_TIME")
    .get();

  while (adGroupIterator.hasNext()) { 
    var adGroup = adGroupIterator.next(); 
    adGroup.pause(); 
  } 
  
  
  //Pause Keywords = 0 Impressions
  
  var keywordsIterator = AdWordsApp.keywords()
    .withCondition("Impressions = 0")
    .withCondition('CampaignStatus = ENABLED')
    .withCondition("AdGroupStatus = ENABLED")
    .withCondition("Status = ENABLED")
    .withCondition('LabelNames CONTAINS_NONE ["' + labelName + '"]')
    .withCondition("AdvertisingChannelType = SEARCH")
    .forDateRange("ALL_TIME")
    .get();
  
  while (keywordsIterator.hasNext()) {
    var keyword = keywordsIterator.next(); 
    keyword.pause(); // You can replace "pause" with "remove" incase you want to delete them forever. 
  }
}