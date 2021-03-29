/*
https://developers.google.com/google-ads/scripts/docs/examples/ads#get-responsive-display-ads-in-an-ad-group

*/

var campaignName = "Esport tournament";
var ADGROUP_NAME = 'For All';


function main() {
  a = getResponsiveDisplayAdsInAdGroup();
}


function getResponsiveDisplayAdsInAdGroup() {
  // Responsive display ads can include multiple text and multiple media assets
  // in the ad, while legacy responsive display ads cannot. Use a condition
  // 'Type = "MULTI_ASSET_RESPONSIVE_DISPLAY_AD"' to select the former and
  // condition 'Type = "LEGACY_RESPONSIVE_DISPLAY_AD"' to select the
  // latter. 'Type = "RESPONSIVE_DISPLAY_AD"' will also select legacy responsive
  // display ads, but the syntax is deprecated.
  //
  // When an ad iterator includes both responsive display ads and legacy
  // responsive display ads, use the ad.isLegacy() method to determine the style
  // of the ad.
  var adGroupIterator = AdsApp.adGroups()
    .withCondition("CampaignName = " + "'" + campaignName + "'")
    .withCondition('Name = "' + ADGROUP_NAME + '"')
    .get();
    
  if (adGroupIterator.hasNext()) {
    var adGroup = adGroupIterator.next();
    var adsIterator = adGroup.ads()
      .withCondition('Type IN ["MULTI_ASSET_RESPONSIVE_DISPLAY_AD","LEGACY_RESPONSIVE_DISPLAY_AD"]')
      .get();

    while (adsIterator.hasNext()) {
      
      var ad = adsIterator.next().asType().responsiveDisplayAd();
      
      if (ad.isLegacy()) {
        logLegacyResponsiveDisplayAd(ad);
      } else {
        logResponsiveDisplayAd(ad);
      }
    }
  }
}

function logLegacyResponsiveDisplayAd(ad) {
  Logger.log('Long headlines : ' + ad.getLongHeadline());
  Logger.log('Short headline : ' + ad.getShortHeadline());
  Logger.log('Description : ' + ad.getDescription());
  Logger.log('Business name : ' + ad.getBusinessName());
  Logger.log('Marketing image : ' + ad.getMarketingImage().getName());
  Logger.log('Logo image : ' + ad.getLogoImage().getName());
  Logger.log('Approval status : ' + ad.getApprovalStatus());
  Logger.log('Enabled : ' + ad.isEnabled());
}

function logResponsiveDisplayAd(ad) {
  Logger.log('Long headline : ' + ad.getLongHeadline());
  logTextAssets('Short headline ', ad.getHeadlines());
  logTextAssets('Description ', ad.getDescriptions());
  Logger.log('Business name : ' + ad.getBusinessName());
  logImageAssets('Marketing image ', ad.getMarketingImages());
  logImageAssets('Marketing image name ', ad.getMarketingImages().getName());
  logImageAssets('Square marketing image ', ad.getSquareMarketingImages());
  logImageAssets('Square marketing image name ', ad.getSquareMarketingImages().getName());
  logImageAssets('Logo image ', ad.getLogoImages());
  logImageAssets('Landscape logo image ', ad.getLandscapeLogoImages());
  logYouTubeAssets('YouTube video ', ad.getYouTubeVideos());
  Logger.log('Approval status : ' + ad.getApprovalStatus());
  Logger.log('Enabled : ' + ad.isEnabled());
}

function logTextAssets(prefix, assetArray) {
  for (var i = 0; i < assetArray.length; i++) {
    Logger.log(prefix + i + ' : ' + assetArray[i].text);
  }
}

function logImageAssets(prefix, assetArray) {
  for (var i = 0; i < assetArray.length; i++) {
    Logger.log(prefix + i + ' : ' + assetArray[i].getName());
  }
}

function logYouTubeAssets(prefix, assetArray) {
  for (var i = 0; i < assetArray.length; i++) {
    Logger.log(prefix + i + ' : ' + assetArray[i].getYouTubeVideoId());
  }
}