/*
https://www.damiengonot.com/blog/adwords-scripts-create-ads

*/

function main() {
  //Select campaign by name
  var campaign = AdsApp.campaigns()
    .withCondition("Name = 'united_states-cities'")
    .withLimit(1)
    .get()
    .next();

  var adGroupBuilder = campaign.newAdGroupBuilder();

  //Define the Ad Group name, 5 Ad Groups will be created
  var cities = [
    'New York City',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Philadelphia'
  ];

  //Create Ad Group by each name in the `cities` array
  cities.forEach(function (city) {
    
    //Inside each Ad group, add keywords and expanded text ad

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

    //Add keywords
    keywords.forEach(function (keyword) {
      adGroup.newKeywordBuilder()
        .withText('+' + keyword.toLowerCase().replace(/ /g, ' +'))
        .withCpc(1.5)
        .withFinalUrl('https://www.example.com')
        .build();
    });

    //Add expanded text ad
    adGroup.newAd().expandedTextAdBuilder()
      .withHeadlinePart1(city + ' Bike Repair Shop')
      .withHeadlinePart2('Fast & professional')
      .withDescription('Repair Your Bike Here & Buy Accessories. ' +
        'Book Your Appointment Now!')
      .withPath1('bike-repair')
      .withPath2(city.toLowerCase().replace(/ /g, '_'))
      .withFinalUrl('https://www.example.com')
      .build()
  });
}