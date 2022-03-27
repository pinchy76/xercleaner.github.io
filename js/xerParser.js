//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// XER text parsing functions
// Created by Stephen Pincher
// Do not edit this segment
// This code is free to use as long as this section is not edited
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*jshint esversion: 6 */

function xerParser() {

    if (document.getElementById("inputTextToSave").value.length == 0){
        return {
            error: true,
            message: 'No XER loaded'
            };
    }
        

  // create dictionary from XER with key values of table names and table contents
  const xerHeader = document
    .getElementById("inputTextToSave")
    .value.substring(
      1,
      document.getElementById("inputTextToSave").value.search(`%T`)
    );

  const xerDictionary = arrayTablesFromXER(
    document.getElementById("inputTextToSave").value
  );

  //const optChkClearJunk = document.getElementById("junk_Option3").value;
  const optChkClearJunk = document.querySelector('input[name="junkOption"]:checked').value;

  //if clear junk is checked, wipe the tables in the array
  if (optChkClearJunk == "Remove") {
      const JUNKTABLES = [`POBS`, `RISKTYPE`];
    const arrJunkTablesToClear = JUNKTABLES;

    for (let i = 0; i < arrJunkTablesToClear.length; i++) {
      clearTable(xerDictionary, arrJunkTablesToClear[i]);
    }
  }

  //if clear UDF is checked, wipe the tables in the array
  //const optChkClearUDF = document.getElementById("udf_Option3").value;
  const optChkClearUDF = document.querySelector('input[name="udfOption"]:checked').value;

  if (optChkClearUDF == "Remove") {
    const arrUDFTablesToClear = [`UDFVALUE`, `UDFTYPE`];

    for (let i = 0; i < arrUDFTablesToClear.length; i++) {
      clearTable(xerDictionary, arrUDFTablesToClear[i]);
    }
  }

  //if clear other tables is checked, wipe the tables in the array
  //These tables are non-essential for successfully importing an XER
  const optChkClearNon = document.querySelector('input[name="nonCodeOption"]:checked').value;

  if (optChkClearNon == "Remove") {
    const arrOtherTablesToClear = [
      `APPLYACTOPTIONS`,
      `DOCCATG`,
      `DOCUMENT`,
      `LOCATION`,
      `MEMOTYPE`,
      `NONWORK`,
      `PCATTYPE`,
      `PCATVAL`,
      `PHASE`,
      `PROJTHRS`,
      `PROJPCAT`,
      `PROJISSU`,
      `ROLERATE`,
      `ROLELIMIT`,
      `TASKDOC`,
      `TASKMEMO`,
      `TASKNOTE`,
      `WBSBUDG`,
      `WBSMEMO`,
      `WBSSTEP`
    ];

    for (let i = 0; i < arrOtherTablesToClear.length; i++) {
      clearTable(xerDictionary, arrOtherTablesToClear[i]);
    }
  }

  //if Tag Tables is checked, add the tag
  const optChkClearTag = document.querySelector('input[name="taggingOption"]:checked').value;

  if (optChkClearTag == "Tag") {
    const strTagValue = String(document.getElementById("inputTagValue").value);
    const arrTagTables = [
      [`CALENDAR`, `clndr_name`],
      [`ROLES`, `role_short_name`],
      [`RSRC`, `rsrc_short_name`],
      [`RSRCCURVDATA`, `curv_name`],
      [`RSRCROLE`, `rsrc_short_name`],
      [`PROJECT`, `proj_short_name`],
      [`RCATVAL`, `rsrc_catg_short_name`],
      [`ACTVTYPE`, `actv_code_type`],
      [`UDFTYPE`, `udf_type_name`]
      //[`PCATTYPE`, ]
    ];

    for (let i = 0; i < arrTagTables.length; i++) {
      let tbl0 = arrTagTables[i][0];
      let tbl1 = arrTagTables[i][1];

      try {
        xerDictionary.set(tbl0, tagXERTable(xerDictionary.get(tbl0), tbl1, strTagValue));

        // eslint-disable-next-line no-empty
      } catch (err) { }
    }
  }


  var strNewXER = xerHeader;

  for (const v of xerDictionary.values()) {
    //console.log(v);
    strNewXER += v;
  }

  if (strNewXER.substring(strNewXER.length - 2, strNewXER.length) != '%E') {
    strNewXER += '%E';
  }
  
  document.getElementById("inputTextToSave").value = strNewXER;
}

//Sets string passed in from dictionary to empty
function clearTable(dictionary, tableName) {
  //clear table
  try {
    dictionary.set(tableName, "");
    // eslint-disable-next-line no-empty
  } catch (err) { }
}


function arrayTablesFromXER(xerText) {
  //passes XER in and creates a key/value Map with key as table name and value as the SQL of the table element from %T to last %R
  const loadedText = document.getElementById("inputTextToSave").value;
  const strTableDelimiter = `%T`;
  const arrXERTables = loadedText.split(strTableDelimiter);
  const dict = new Map(); //new Object();  //create `dictionary` object

  for (let i = 1; i < arrXERTables.length; i++) {
    let strTableName = arrXERTables[i]
      .substring(1, arrXERTables[i].search("%F"))
      .trim();

    let strTableData = strTableDelimiter + arrXERTables[i];
    dict.set(strTableName, strTableData);
  }

  return dict;
}
function tagXERTable(strTableData, strFieldToTag, strTagText) {
  //function which tags a field in a table (passed in as a string) with a string provided then returns the changed table string
  //vars for delimeter characters
  const newLine = "\n";
  const strTab = "\t";

  //create arrRows array by splitting table data by newline character
  const arrTableSplitIntoRows = strTableData.split(newLine);

  //create output string and populate it with top row of table (arrRows[0])
  let strOutput = arrTableSplitIntoRows[0];

  //create array for
  let arrTableRowsSplitIntoColumns = [];

  //loop through arrTableRows array and push each row onto array
  //arrTableColumns split by tab character
  //start at 1 as top row not required
  for (let l = 1; l < arrTableSplitIntoRows.length; l++) {
    arrTableRowsSplitIntoColumns.push(
      l,
      arrTableSplitIntoRows[l].split(strTab)
    );
  }

  //Start of return string - top two rows of table
  strOutput =
    strOutput +
    newLine +
    arrTableRowsSplitIntoColumns[1].join(strTab) +
    newLine;

  //Find Column to Tag in top row of arrTableColumns array
  const iColumnToTag = arrTableRowsSplitIntoColumns[1].indexOf(strFieldToTag);

  //loop through each of the split row arrays
  for (let l = 2; l < arrTableRowsSplitIntoColumns.length - 1; l++) {
    //assign current row to array
    let arrCurrentRowCellsArray = arrTableRowsSplitIntoColumns[l];

    //change the value in the column to tag

    if ((`${arrCurrentRowCellsArray[iColumnToTag]}`).localeCompare(strTagText) != 1){
      arrCurrentRowCellsArray[iColumnToTag] = `${strTagText}_${arrCurrentRowCellsArray[iColumnToTag]}`;
    }
    //loop through row cells and add them to string separated by tabs
    //(can`t get array join to work)
    for (let x = 0; x < arrCurrentRowCellsArray.length; x++) {
      if (x + 1 == arrCurrentRowCellsArray.length) {
        strOutput = strOutput + arrCurrentRowCellsArray[x] + newLine;
      } else {
        strOutput = strOutput + arrCurrentRowCellsArray[x] + strTab;
      }
    }

    //strOutput = strOutput + strTab;
    //strOutput = strOutput  +  (arrCurrentRowCellsArray.join(strTab));
  }

  return strOutput;
}
