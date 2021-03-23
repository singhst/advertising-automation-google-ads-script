/*
  Online tutorial,
  https://developers.google.com/google-ads/scripts/docs/solutions/adsmanagerapp-export-keyword-recommendations
*/

// Copyright 2020, Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @name Keyword Recommendation Export
 *
 * @overview The Keyword Recommendation Export script can run on all client
 *     accounts within a manager account hierarchy, splitting the work across
 *     multiple executions if necessary. Each execution of the script processes
 *     a subset of the hierarchy's client accounts that it hadn't previously
 *     processed or just a single child account, saving the results to a
 *     temporary file on Google Drive. The script helps you to get all
 *     recommended keywords from under the account where it's running. It will
 *     print all deduplicated keyword recommendations into a spreadsheet,
 *     which is editor friendly formatted.
 *
 * @author Google Ads Scripts Team [adwords-scripts@googlegroups.com]
 *
 * @version 1.0
 *
 * @changelog
 * - version 1.0
 *   - Released initial version.
 */

var config = {
  /**
   * Name of file created on Drive to store data between script executions.
   * You must use a different filename for each each script running in the
   * account to avoid data being overwriten.
   */
  filename: 'UNIQUE_FILENAME_HERE',

  // Minimum number of days between the start of each cycle.
  minFrequency: 6,

  // Spreadsheet logging campaigns not using optimized ad rotation.
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1bYlFxq7ADGMMZ7n0dtu2GT4NWZQ7aLnovANgi5zjdEw/',

  // Email addresses to be notified of results.
  emailRecipients: 'INSERT_EMAIL_ADDRESSES_HERE',

  /**
   * List of ManagedAccountSelector conditions to restrict the population
   * of child accounts that will be processed. Leave blank or comment out
   * to include all child accounts.
   * Example: "Name != 'Rainy Sky'" or "Name DOES_NOT_CONTAIN 'Rain'".
   */
  accountConditions: [],

  /**
   * List of conditions (based on Google Ads Query Language) to restrict the
   * population
   * of campaigns that will be processed. Leave blank or comment out
   * to include all campaigns. (e.g. "campaign.name = ''" or "campaign.name
   * NOT LIKE 'promotion'" or "campaign.name REGEXP_MATCH ''" or
   * "campaign.status = 'ENABLED'")
   */
  campaignConditions: ["campaign.name = 'Esport tournament'"],
};

/**
 * Possible Status for the script as a whole or for an individual account.
 * @enum {string}
 */
var Status = {
  NOT_STARTED: 'Not Started',
  STARTED: 'Started',
  FAILED: 'Failed',
  COMPLETE: 'Complete',
};

var keywordMatchtypeArray = [];

/**
 * Initializes a cycle for the script.
 *
 * @param {!Array<string>} customerIds The customerIds that this cycle
 *     will process.
 */
function initializeCycle(customerIds) {
  const spreadsheet = config.spreadsheetUrl;
  const ss = SpreadsheetApp.openByUrl(spreadsheet);
  const sheet = ss.getActiveSheet();
  sheet.clearContents();
  sheet.appendRow(
    ['Account', 'Campaign', 'Ad group', 'Keyword', 'Criterion Type']);

  Logger.log('Accounts to be processed this cycle:');
  for (var i = 0; i < customerIds.length; i++) {
    Logger.log(customerIds[i]);
  }
}

/**
 * Initializes a single execution of the script.
 *
 * @param {!Array<string>} customerIds The customerIds that this
 *     execution will process.
 */
function initializeExecution(customerIds) {
  if (IS_MANAGER) {
    const accounts = AdsManagerApp.accounts().withIds(customerIds).get();
    while (accounts.hasNext()) {
      var account = accounts.next();
      AdsManagerApp.select(account);
      var initialQuery = 'SELECT campaign_criterion.keyword.text, ' +
        'campaign_criterion.keyword.match_type ' +
        'FROM campaign_criterion ' +
        'WHERE campaign_criterion.type = \'KEYWORD\' ' +
        'AND campaign_criterion.status = \'ENABLED\'';

      var existingKeywordsResult =
        AdsApp.search(initialQuery, { apiVersion: 'v6' });
      while (existingKeywordsResult.hasNext()) {
        var row = existingKeywordsResult.next();
        keywordMatchtypeArray.push(
          row.campaignCriterion.keyword.text.toLowerCase() + '-' +
          row.campaignCriterion.keyword.matchType.toLowerCase());
      }
    }
  } else {
    var initialQuery = 'SELECT campaign_criterion.keyword.text, ' +
      'campaign_criterion.keyword.match_type ' +
      'FROM campaign_criterion ' +
      'WHERE campaign_criterion.type = \'KEYWORD\' ' +
      'AND campaign_criterion.status = \'ENABLED\'';

    var existingKeywordsResult =
      AdsApp.search(initialQuery, { apiVersion: 'v6' });
    while (existingKeywordsResult.hasNext()) {
      var row = existingKeywordsResult.next();
      keywordMatchtypeArray.push(
        row.campaignCriterion.keyword.text.toLowerCase() + '-' +
        row.campaignCriterion.keyword.matchType.toLowerCase());
    }
  }
  Logger.log('Existing keywords collected');
  Logger.log('Accounts to be processed this execution:');
  for (var i = 0; i < customerIds.length; i++) {
    Logger.log(customerIds[i]);
  }
}

/**
 * Processes a single Google Ads account. This function can perform any sort of
 * processing on the account, followed by outputting results immediately
 * (e.g., sending an email, saving to a spreadsheet, etc.) and/or returning
 * results to be output later, e.g., to be combined with the output from other
 * accounts.
 *
 * @return {{suggestedKeywords: number}}
 */
function processAccount() {
  var keywordCount = 0;
  const campaignConditions = config.campaignConditions || [];
  const spreadsheet = config.spreadsheetUrl;
  var relevantKeywords = [];

  var query = 'SELECT recommendation.keyword_recommendation, ad_group.name, ' +
    'campaign.name, customer.descriptive_name ' +
    'FROM recommendation WHERE recommendation.type = \'KEYWORD\'';

  for (var i = 0; i < campaignConditions.length; i++) {
    query = query.concat(' AND ' + campaignConditions[i]);
  }

  const recommendationResult = AdsApp.search(query, { apiVersion: 'v6' });

  const ss = SpreadsheetApp.openByUrl(spreadsheet);
  const sheet = ss.getActiveSheet();

  while (recommendationResult.hasNext()) {
    var resultRow = recommendationResult.next();
    var keyword = resultRow.recommendation.keywordRecommendation.keyword.text;
    var matchtype =
      resultRow.recommendation.keywordRecommendation.keyword.matchType;
    var tmpKey = keyword.toLowerCase() + '-' + matchtype.toLowerCase();

    if (keywordMatchtypeArray.indexOf(tmpKey) === -1) {
      relevantKeywords.push([
        resultRow.customer.descriptiveName,
        resultRow.campaign.name,
        resultRow.adGroup.name,
        keyword,
        matchtype,
      ]);

      keywordMatchtypeArray.push(tmpKey);
      keywordCount++;
    }
  }
  if (relevantKeywords.length > 0) {
    const numKeywords = relevantKeywords.length;
    const range = sheet.getRange(sheet.getLastRow() + 1, 1, numKeywords, 5);
    range.setValues(relevantKeywords);
  }

  return { suggestedKeywords: keywordCount };
}

/**
 * Main logic for consolidating or outputting results after
 * a single execution of the script. These single execution results may
 * reflect the processing on only a subset of your accounts.
 *
 * @param {!Object<string, {
 *       status: !Status,
 *       returnValue: ?Object,
 *       error: ?string
 *     }>} results The results for the accounts processed in this
 *    execution of the script, keyed by customerId. The status will be
 *    Status.COMPLETE if the account was processed successfully,
 *    Status.FAILED if there was an error, and Status.STARTED if it
 *    timed out. The returnValue field is present when the status is
 *    Status.COMPLETE and corresponds to the object you returned in
 *    processAccount(). The error field is present when the status is
 *    Status.FAILED.
 */
function processIntermediateResults(results) {
  Logger.log('Results of this execution:');
  for (var customerId in results) {
    var result = results[customerId];
    if (result.status === Status.COMPLETE) {
      Logger.log(
        customerId + ': ' + result.returnValue.suggestedKeywords +
        ' keyword recommendations.');
    } else if (result.status === Status.STARTED) {
      Logger.log(customerId + ': timed out');
    } else {
      Logger.log(customerId + ': failed due to "' + result.error + '"');
    }
  }
}

/**
 * This function will only be called once per complete cycle.
 *
 * @param {!Object<string, {
 *       status: !Status,
 *       returnValue: ?Object,
 *       error: ?string
 *     }>} results The results for the accounts processed in this
 *    execution of the script, keyed by customerId. The status will be
 *    Status.COMPLETE if the account was processed successfully,
 *    Status.FAILED if there was an error, and Status.STARTED if it
 *    timed out. The returnValue field is present when the status is
 *    Status.COMPLETE and corresponds to the object you returned in
 *    processAccount(). The error field is present when the status is
 *    Status.FAILED.
 */
function processFinalResults(results) {
  var numSuggestedKeywords = 0;

  Logger.log('Results of this cycle:');
  for (var customerId in results) {
    var result = results[customerId];
    if (result.status === Status.COMPLETE) {
      Logger.log(customerId + ': successful');
      numSuggestedKeywords += result.returnValue.suggestedKeywords;
    } else if (result.status === Status.STARTED) {
      Logger.log(customerId + ': timed out');
    } else {
      Logger.log(customerId + ': failed due to "' + result.error + '"');
    }
  }

  MailApp.sendEmail(
    config.emailRecipients,
    'Recommended Keywords',
    'Deduplicated relevant keywords in an editor friendly format: ' +
    config.spreadsheetUrl);

  Logger.log('Total number of keyword recommendations: ' +
    numSuggestedKeywords);
}

// Whether or not the script is running in a manager account.
var IS_MANAGER = typeof AdsManagerApp !== 'undefined';

/**
 * The possible modes in which the script can execute.
 * @enum {string}
 */
var Mode = { SINGLE: 'Single', MANAGER_SEQUENTIAL: 'Manager Sequential' };

/**
 * Main method, which will get executed first
 */
function main() {
  const mode = getMode();
  stateManager.loadState();

  // The last execution may have attempted the final set of accounts but
  // failed to actually complete the cycle because of a timeout in
  // processIntermediateResults(). In that case, complete the cycle now.
  if (stateManager.getAccountsWithStatus().length > 0) {
    completeCycleIfNecessary();
  }

  // If the cycle is complete and enough time has passed since the start of
  // the last cycle, reset it to begin a new cycle.
  if (stateManager.getStatus() === Status.COMPLETE) {
    if (dayDifference(stateManager.getLastStartTime(), new Date()) >
      config.minFrequency) {
      stateManager.resetState();
    } else {
      Logger.log(
        'Waiting until ' + config.minFrequency +
        ' days have elapsed since the start of the last cycle.');
      return;
    }
  }

  // Find accounts that have not yet been processed. If this is the
  // beginning of a new cycle, this will be all accounts.
  const customerIds = stateManager.getAccountsWithStatus(Status.NOT_STARTED);

  // The status will be Status.NOT_STARTED if this is the very first
  // execution or if the cycle was just reset. In either case, it is the
  // beginning of a new cycle.
  if (stateManager.getStatus() === Status.NOT_STARTED) {
    stateManager.setStatus(Status.STARTED);
    stateManager.saveState();

    initializeCycle(customerIds);
  }

  // Save state so that we can detect when an account timed out by it still
  // being in the Started state.
  stateManager.setAccountsWithStatus(customerIds, Status.STARTED);
  stateManager.saveState();

  initializeExecution(customerIds);
  executeByMode(mode, customerIds);
}

/**
 * Runs the script on a list of accounts in a given mode.
 *
 * @param {string} mode The mode the script should run in.
 * @param {!Array<string>} customerIds The customerIds that this execution
 *     should process. If mode is Mode.SINGLE, customerIds must contain
 *     a single element which is the customerId of the Google Ads account.
 */
function executeByMode(mode, customerIds) {
  switch (mode) {
    case Mode.SINGLE:
      var results = {};
      results[customerIds[0]] = tryProcessAccount();
      completeExecution(results);
      break;

    case Mode.MANAGER_SEQUENTIAL:
      var accounts = AdsManagerApp.accounts().withIds(customerIds).get();
      var results = {};

      var managerAccount = AdsApp.currentAccount();
      while (accounts.hasNext()) {
        var account = accounts.next();
        AdsManagerApp.select(account);
        results[account.getCustomerId()] = tryProcessAccount();
      }
      AdsManagerApp.select(managerAccount);

      completeExecution(results);
      break;
  }
}

/**
 *
 * @return {!Object} The result of the processing if successful, or
 *     an object with status Status.FAILED and the error message
 *     if unsuccessful.
 */
function tryProcessAccount() {
  try {
    return { status: Status.COMPLETE, returnValue: processAccount() };
  } catch (e) {
    return { status: Status.FAILED, error: e.message };
  }
}

/**
 * Completes a single execution of the script by saving the results and
 * calling the intermediate and final result handlers as necessary.
 *
 * @param {!Object<string, {
 *       status: !Status,
 *       returnValue: ?Object,
 *       error: ?string
 *     }>} results The results of the current execution of the script.
 */
function completeExecution(results) {
  for (var customerId in results) {
    var result = results[customerId];
    stateManager.setAccountWithResult(customerId, result);
  }
  stateManager.saveState();

  processIntermediateResults(results);
  completeCycleIfNecessary();
}

/**
 * Completes a full cycle of the script if all accounts have been attempted
 * but the cycle has not been marked as complete yet.
 */
function completeCycleIfNecessary() {
  if (stateManager.getAccountsWithStatus(Status.NOT_STARTED).length === 0 &&
    stateManager.getStatus() != Status.COMPLETE) {
    stateManager.setStatus(Status.COMPLETE);
    stateManager.saveState();
    processFinalResults(stateManager.getResults());
  }
}

/**
 * Determines what mode the script should run in.
 *
 * @return {string} The mode to run in.
 */
function getMode() {
  if (IS_MANAGER) {
    return Mode.MANAGER_SEQUENTIAL;
  } else {
    return Mode.SINGLE;
  }
}

/**
 * Finds all customer IDs that the script could process. For a single account,
 * this is simply the account itself.
 *
 * @return {!Array<string>} A list of customer IDs.
 */
function getCustomerIdsPopulation() {
  if (IS_MANAGER) {
    var customerIds = [];

    var selector = AdsManagerApp.accounts();
    var conditions = config.accountConditions || [];
    for (var i = 0; i < conditions.length; i++) {
      selector = selector.withCondition(conditions[i]);
    }

    var accounts =
      selector.forDateRange('LAST_30_DAYS').orderBy('Clicks DESC').get();
    while (accounts.hasNext()) {
      customerIds.push(accounts.next().getCustomerId());
    }

    return customerIds;
  } else {
    return [AdsApp.currentAccount().getCustomerId()];
  }
}

/**
 * Returns the number of days between two dates.
 *
 * @param {!Date} from The older Date object.
 * @param {!Date} to The newer (more recent) Date object.
 * @return {number} The number of days between the given dates (possibly
 *     fractional).
 */
function dayDifference(from, to) {
  return (to.getTime() - from.getTime()) / (24 * 3600 * 1000);
}

/**
 * Loads a JavaScript object previously saved as JSON to a file on Drive.
 *
 * @param {string} filename The name of the file in the account's root Drive
 *     folder where the object was previously saved.
 * @return {?Object} The JavaScript object, or null if the file was not found.
 */
function loadObject(filename) {
  var files = DriveApp.getRootFolder().getFilesByName(filename);

  if (!files.hasNext()) {
    return null;
  } else {
    var file = files.next();

    if (files.hasNext()) {
      throwDuplicateFileException(filename);
    }

    return JSON.parse(file.getBlob().getDataAsString());
  }
}

/**
 * Saves a JavaScript object as JSON to a file on Drive. An existing file with
 * the same name is overwritten.
 *
 * @param {string} filename The name of the file in the account's root Drive
 *     folder where the object should be saved.
 * @param {!Object} obj The object to save.
 */
function saveObject(filename, obj) {
  const files = DriveApp.getRootFolder().getFilesByName(filename);

  if (!files.hasNext()) {
    DriveApp.createFile(filename, JSON.stringify(obj));
  } else {
    var file = files.next();

    if (files.hasNext()) {
      throwDuplicateFileException(filename);
    }

    file.setContent(JSON.stringify(obj));
  }
}

/**
 * Throws an exception if there are multiple files with the same name.
 *
 * @param {string} filename The filename that caused the error.
 */
function throwDuplicateFileException(filename) {
  throw new Error('Multiple files named ' + filename +
    ' detected. Please ensure there is only one file named '
    + filename + ' and try again.');
}

var stateManager = (function () {
  /**
   * @type {{
   *   cycle: {
   *     status: string,
   *     lastUpdate: string,
   *     startTime: string
   *   },
   *   accounts: !Object<string, {
   *     status: string,
   *     lastUpdate: string,
   *     returnValue: !Object
   *   }>
   * }}
   */
  var state = {};

  /**
   * Loads the saved state of the script. If there is no previously
   * saved state, sets the state to an initial default.
   */
  var loadState = function () {
    state = loadObject(config.filename);
    if (!state) {
      resetState();
    }
  };

  /**
   * Saves the state of the script to Drive.
   */
  var saveState = function () {
    saveObject(config.filename, state);
  };

  /**
   * Resets the state to an initial default.
   */
  var resetState = function () {
    state = {};
    var date = Date();

    state.cycle = {
      status: Status.NOT_STARTED,
      lastUpdate: date,
      startTime: date,
    };

    state.accounts = {};
    var customerIds = getCustomerIdsPopulation();

    for (var i = 0; i < customerIds.length; i++) {
      state.accounts[customerIds[i]] = {
        status: Status.NOT_STARTED,
        lastUpdate: date,
      };
    }
  };

  /**
   * Gets the status of the current cycle.
   *
   * @return {string} The status of the current cycle.
   */
  var getStatus = function () {
    return state.cycle.status;
  };

  /**
   * Sets the status of the current cycle.
   *
   * @param {string} status The status of the current cycle.
   */
  var setStatus = function (status) {
    var date = Date();

    if (status === Status.IN_PROGRESS &&
      state.cycle.status === Status.NOT_STARTED) {
      state.cycle.startTime = date;
    }

    state.cycle.status = status;
    state.cycle.lastUpdate = date;
  };

  /**
   * Gets the start time of the current cycle.
   *
   * @return {!Object} Date object for the start of the last cycle.
   */
  var getLastStartTime = function () {
    return new Date(state.cycle.startTime);
  };

  /**
   * Gets accounts in the current cycle with a particular status.
   *
   * @param {?string} status The status of the accounts to get.
   *     If null, all accounts are retrieved.
   * @return {!Array<string>} A list of matching customerIds.
   */
  var getAccountsWithStatus = function (status) {
    const customerIds = [];

    for (var customerId in state.accounts) {
      if (!status || state.accounts[customerId].status === status) {
        customerIds.push(customerId);
      }
    }

    return customerIds;
  };

  /**
   * Sets accounts in the current cycle with a particular status.
   *
   * @param {!Array<string>} customerIds A list of customerIds.
   * @param {string} status A status to apply to those customerIds.
   */
  var setAccountsWithStatus = function (customerIds, status) {
    var date = Date();

    for (var i = 0; i < customerIds.length; i++) {
      var customerId = customerIds[i];

      if (state.accounts[customerId]) {
        state.accounts[customerId].status = status;
        state.accounts[customerId].lastUpdate = date;
      }
    }
  };

  /**
   * Registers the processing of a particular account with a result.
   *
   * @param {string} customerId The account that was processed.
   * @param {{
   *       status: string,
   *       returnValue: Object,
   *       error: string
   *     }} result The object to save for that account.
   */
  var setAccountWithResult = function (customerId, result) {
    if (state.accounts[customerId]) {
      state.accounts[customerId].status = result.status;
      state.accounts[customerId].returnValue = result.returnValue;
      state.accounts[customerId].error = result.error;
      state.accounts[customerId].lastUpdate = Date();
    }
  };

  /**
   * Gets the current results of the cycle for all accounts.
   *
   * @return {!Object<string, {
   *       status: string,
   *       lastUpdate: string,
   *       returnValue: Object,
   *       error: string
   *     }>} The results processed by the script during the cycle,
   *    keyed by account.
   */
  var getResults = function () {
    return state.accounts;
  };

  return {
    loadState: loadState,
    saveState: saveState,
    resetState: resetState,
    getStatus: getStatus,
    setStatus: setStatus,
    getLastStartTime: getLastStartTime,
    getAccountsWithStatus: getAccountsWithStatus,
    setAccountsWithStatus: setAccountsWithStatus,
    setAccountWithResult: setAccountWithResult,
    getResults: getResults,
  };
})();