/*
https://www.damiengonot.com/blog/adwords-scripts-create-ads

Re-organized the main code as functions.
*/

// ////////////////////////////////////////////////////////////////////////////
// Configurations

var campaignName = "Esport tournament";
// Use this if you only want to look at some campaigns.
// For example "'Brand'" would only look at campaigns with 'Brand' in the name,


// ////////////////////////////////////////////////////////////////////////////

function main() {
  //Select campaign by name
  var campaign = AdsApp.campaigns()
    .withCondition("Name = 'To increase website traffic'")
    .withLimit(1)
    .get()
    .next();

  var adGroupBuilder = campaign.newAdGroupBuilder();

  //Define the Ad Group name, 5 Ad Groups will be created
  var cities = [
    // 'New York City',
    // 'Los Angeles',
    // 'Chicago',
    // 'Houston',
    // 'Philadelphia'
    'script test'
  ];

  //Create Ad Group by each name in the `cities` array
  cities.forEach(function (city) {
    
    //Inside each Ad group, add keywords and expanded text ad

    //Build a new Ad Group
    var adGroupOperation = adGroupBuilder
      .withName(city.toLowerCase().replace(/ /g, '_'))
      .withStatus('PAUSED')
      .build();

    var adGroup = adGroupOperation.getResult();

    //Define keywords
    var keywords = [
      'bike repair ' + city,
      'bike repair shop ' + city,
      'bike shop ' + city
    ];

    
  });
}


function addKeywordToAdGroup(adGroup, keywords) {
  //Add keywords
  keywords.forEach(function (keyword) {
    adGroup.newKeywordBuilder()
      .withText('+' + keyword.toLowerCase().replace(/ /g, ' +'))
      .withCpc(1.5)
      .withFinalUrl('https://www.example.com')
      .build();
  });

  return adGroup;
}


function addExpandedTextAdToAdGroup(adGroup) {
  //Add expanded text ad
  adGroup.newAd().expandedTextAdBuilder()
  .withHeadlinePart1(city + ' Bike Repair Shop')
  .withHeadlinePart2('Fast & professional')
  .withDescription('Repair Your Bike Here & Buy Accessories. ' +
    'Book Your Appointment Now!')
  .withPath1('bike-repair')
  .withPath2(city.toLowerCase().replace(/ /g, '_'))
  .withFinalUrl('https://www.example.com')
  .build();

  return adGroup;
}