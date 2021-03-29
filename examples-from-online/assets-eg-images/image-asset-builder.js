

function main() {
  var image = buildImageAsset("test-image1", "https://goo.gl/3b9Wfh");
  var image = buildImageAsset("test-image2", "https://goo.gl/mtt54n");
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