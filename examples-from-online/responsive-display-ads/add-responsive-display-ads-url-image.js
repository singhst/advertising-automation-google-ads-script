/*
Build new Ad with URL images instead of uploaded images.

https://developers.google.com/google-ads/scripts/docs/examples/ads#add-a-responsive-display-ad
*/


function main() {
  // addResponsiveDisplayAd();
  addResponsiveDisplayAd_UrlImage();
  // addResponsiveDisplayAd_alreadyUploadedImage();
}

// You create responsive display ads in two steps:
//   1. Create or retrieve assets (marketing images, square marketing images,
//      optional logos, optional landscape logos, and optional YouTube videos)
//   2. Create the ad.
//
function addResponsiveDisplayAd_UrlImage() {
  // If you have multiple adGroups with the same name, this snippet will
  // pick an arbitrary matching ad group each time. In such cases, just
  // filter on the campaign name as well:
  //
  var adGroupIterator = AdsApp.adGroups()
    // .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    .withCondition('Name = "best_keyword_cpc_last_14days"')
    .get();

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

    adGroupBuilder = adGroupBuilder
      .addMarketingImage(
        // buildImageAsset("rectangular image asset", "https://goo.gl/3b9Wfh"))
        buildImageAsset("rectangular image asset", "https://drive.google.com/file/d/1UP6MDbY6wF-gYSgbYSotfqKaPK-PhWx-/view?usp=sharing"))
      .addSquareMarketingImage(
        // buildImageAsset("square image asset", "https://goo.gl/mtt54n"))
        buildImageAsset("square image asset", "https://drive.google.com/file/d/1zX_j8D0TlNg4_lq_3zrzjkMMKLFcmNUs/view?usp=sharing"))
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

//NOT WORK
// The following function assumes you have not already created named assets.
function addResponsiveDisplayAd_alreadyUploadedImage() {
  // If you have multiple adGroups with the same name, this snippet will
  // pick an arbitrary matching ad group each time. In such cases, just
  // filter on the campaign name as well:
  var adGroupIterator = AdsApp.adGroups()
  //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    .withCondition('Name = "best_keyword_cpc_last_14days"')
    .get();

  // If you have already created named image assets, select them like this:
  //
  var marketingImages = [];
  var marketingImageIterator = AdsApp.adAssets()
      .assets()
      .withCondition('Name IN ["image asset 1", "image asset 2"]')
      .get();
  while (marketingImageIterator.hasNext()) {
    marketingImages.push(marketingImageIterator.next());
  }

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
    adGroupBuilder = adGroupBuilder.withMarketingImages(marketingImages);

    // ResponsiveDisplayAdBuilder has additional options.
    // For more details, see
    // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_responsivedisplayadbuilder
  }
}