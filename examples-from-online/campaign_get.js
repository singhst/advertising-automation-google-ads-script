function getAllCampaigns() {
  // AdsApp.campaigns() will return all campaigns that are not removed by
  // default.
  var campaignIterator = AdsApp.campaigns().get();
  Logger.log('Total campaigns found : ' +
    campaignIterator.totalNumEntities());
  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    Logger.log(campaign.getName());
  }
}

function getCampaignsByName() {
  var campaignIterator = AdsApp.campaigns()
      .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
      .get();
  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    Logger.log('Campaign Name: ' + campaign.getName());
    Logger.log('Enabled: ' + campaign.isEnabled());
    Logger.log('Bidding strategy: ' + campaign.getBiddingStrategyType());
    Logger.log('Ad rotation: ' + campaign.getAdRotationType());
    Logger.log('Start date: ' + formatDate(campaign.getStartDate()));
    Logger.log('End date: ' + formatDate(campaign.getEndDate()));
  }
}
function formatDate(date) {
  function zeroPad(number) { return Utilities.formatString('%02d', number); }
  return (date == null) ? 'None' : zeroPad(date.year) + zeroPad(date.month) +
      zeroPad(date.day);
}

function main() {
  getAllCampaigns();
  getCampaignsByName();
}