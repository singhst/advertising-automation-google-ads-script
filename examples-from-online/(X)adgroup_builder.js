/*
tutorial,
https://www.damiengonot.com/blog/adwords-scripts-create-ads
*/



var adGroupBuilder = campaign.newAdGroupBuilder();

// adGroupOperation = adGroupBuilder
//   .withName('auto ad group')
//   .withStatus('PAUSED')
//   .build();

function createAdGroup() {

}

function addKeywordsToAdGroup() {

}

function addExpandedTextAdToAdGroup() {

}

function main() {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();  
  Logger.log(date);

  var campaign = AdsApp.campaigns()
  // .withIds([12491352437])
  .withCondition("Name = 'Esport tournament'")
  .withLimit(1) //only selecting one campaign
  .get()
  .next();
  
}