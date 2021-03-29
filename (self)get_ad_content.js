/*

Extract the headline, description, url of the ad.

Steps:
1. Check the type of the Ad.
    Types: 
    (a) EXPANDED_TEXT_AD
    (b) RESPONSIVE_SEARCH_AD
    (c) RESPONSIVE_DISPLAY_AD
2. Get the content based on the type of Ad
3. 
*/

var campaignName = "Esport tournament"; //"To increase website traffic";

var dateRange = "LAST_14_DAYS";

var finalUrl = 'www.example.com/Your-Landing-Page';


function main() {

  var adSelector = AdsApp
    .ads()
    .withCondition("CampaignName = \'" + campaignName + "\'")
    // .withCondition("Type = EXPANDED_TEXT_AD")
    .withCondition("Status = ENABLED")
    .forDateRange(dateRange)
    .orderBy("Clicks DESC");

  var adIterator = adSelector.get();

  var adContents = Array(Object);

  while (adIterator.hasNext()) {
    var ad = adIterator.next();

    var adContent = adContentHandler(ad);

    Logger.log(adContent);
    // var expandedTextAd = ad.asType().expandedTextAd();
    // var description = expandedTextAd.getDescription();
    // var adId = expandedTextAd.getId();
    // var clicks = expandedTextAd.getClicks()
    // var campaign = expandedTextAd.getCampaign().getName();

    // Logger.log(description);

  }
}


//


//Can get proper contents from different types of Ad
function adContentHandler(ad) {

  var adContent = {};

  if (ad.isType().expandedTextAd()) {

    adContent = expandedTextAdHandler(ad);
    adContent.adType = "EXPANDED_TEXT_AD";

    return adContent;


  } else if (ad.isType().responsiveDisplayAd()) {
    // adContent = expandedTextAdHandler(ad);
    adContent.adType = "RESPONSIVE_DISPLAY_AD";

    return adContent;


  } else if (ad.isType().responsiveSearchAd()) {

    // adContent = expandedTextAdHandler(ad);
    adContent.adType = "RESPONSIVE_SEARCH_AD";

    return adContent;
  } 
}


function expandedTextAdHandler(ad) {
  var adContent = {
    headlinePart1: ad.getHeadlinePart1(),
    headlinePart2: ad.getHeadlinePart2(),
    headlinePart3: ad.getHeadlinePart3(),
    description:   ad.getDescription(),
    description1:  ad.getDescription1(),
    description2:  ad.getDescription2(),
    id:            ad.getId(),
    path1:         ad.getPath1(),
    path2:         ad.getPath2()
  };

  return adContent;
}

function responsiveDisplayAdHandler() {

}

function responsiveSearchAdHandler() {

}

