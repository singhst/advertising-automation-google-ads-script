function main() {
  addResponsiveDisplayAd();
}


// You create responsive display ads in two steps:
//   1. Create or retrieve assets (marketing images, square marketing images,
//      optional logos, optional landscape logos, and optional YouTube videos)
//   2. Create the ad.
//
// The following function assumes you have not already created named assets.
function addResponsiveDisplayAd() {
  // If you have multiple adGroups with the same name, this snippet will
  // pick an arbitrary matching ad group each time. In such cases, just
  // filter on the campaign name as well:
  //
  // AdsApp.adGroups()
  //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
  //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
  var adGroupIterator = AdsApp.adGroups()
    .withCondition('Name = "best_keyword_last_14days"')
    .get();

  // If you have already created named image assets, select them like this:
  //
  // var marketingImages = [];
  // var marketingImageIterator = AdsApp.adAssets()
  //     .assets()
  //     .withCondition('Name IN ["INSERT_FIRST_ASSET_NAME_HERE", "INSERT_SECOND_ASSET_NAME_HERE"]')
  //     .get();
  // while (marketingImageIterator.hasNext()) {
  //   marketingImages.push(marketingImageIterator.next());
  // }

  if (adGroupIterator.hasNext()) {
    var adGroup = adGroupIterator.next();
    var adGroupBuilder = adGroup.newAd()
      .responsiveDisplayAdBuilder()
      .withBusinessName('Your business name')
      .withFinalUrl('http://www.example.com')
      .withHeadlines(['First headline', 'Second headline'])
      .withDescriptions(
        ['First description', 'Second description', 'Third description'])
      .withLongHeadline("longheadline");

    // If you selected assets with a snippet as shown above, then provide those
    // assets here like this:
    //
    // adGroupBuilder = adGroupBuilder.withMarketingImages(marketingImages);

    adGroupBuilder = adGroupBuilder
      .addMarketingImage(
        buildImageAsset("rectangular image asset", "https://goo.gl/3b9Wfh"))
      .addSquareMarketingImage(
        buildImageAsset("square image asset", "https://goo.gl/mtt54n"))
      .build();

    // ResponsiveDisplayAdBuilder has additional options.
    // For more details, see
    // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_responsivedisplayadbuilder
  }
}

function buildImageAsset(assetName, imageUrl) {
  var options = {
    muteHttpExceptions: true
  };
  var imageBlob = UrlFetchApp.fetch(imageUrl, options).getBlob();
  return AdsApp.adAssets().newImageAssetBuilder()
    .withData(imageBlob)
    .withName(assetName)
    .build()
    .getResult();
}