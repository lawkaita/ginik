var diceRegex = /\b[1-9]?d([1-9]|(1[0-9])|20)\b/;

function addCreatureCommand(params) {
  ;
}

function removeCreatureCommand() {
  
}

var changeInitiativeCommand;
var dealDamageCommand;
var clearEncounterCommand;
var printHelpCommand;
var commentCreatureCommand;
var uncommentCreatureCommand;

function returnAsNumber(param) {
  return parseInt(param);
}

function sumCommand(params) {
  var summands = params.map(runParsed);
  
  return calc.sum(summands);
}

function throwDiceCommand(params) {
  var times = params[0];
  var diceSize = params[1];
  
  return calc.throwDice(times, diceSize);
}

var verbs = {
  "add": addCreatureCommand, 
  "remove": removeCreatureCommand, 
  "init":changeInitiativeCommand, 
  "dmg": dealDamageCommand,
  "clear": clearEncounterCommand, 
  "print": printHelpCommand, 
  "comment": commentCreatureCommand, 
  "uncomment": uncommentCreatureCommand,
  "sum": sumCommand,
  "dice": throwDiceCommand,
  "number": returnAsNumber
};

function parse(command) {
  var parsed;
  
  /*
  var parsed = {
    command: parts[0],
    params: parts.slice(1)
  }
  
  var parsed = {
    command: "add",
    params: ["pekka", {
      command: "sum",
      params: [{
        command: "dice",
        params: [1, 20]
      }, 4]
    }]
  }
  */
  
  if (isSentence(command)) {
    parsed = parseSentence(command);
  }
  
  if (isMath(command)) {
    parsed = parseMath(command);
  }
  
  return parsed;
}

function isMath(command) {
  return isSumAndOnlySum(command) || isDice(command) || isNumberString(command);
}

function isMathNotSum(command) {
  return isDice(command) || isNumberString(command);
}
 
function isSumAndOnlySum(command) {
  if (isMathNotSum(command)) {
    return false;
  }
  
  var summands = splitToSummands(command);
  
  return areSummamble(summands);
}

function splitToSummands(command) {
  var summands = command.split('+');
  
  for (var i = 0; i < summands.length; i++) {
    var trimmed = summands[i].trim();
    summands[i] = trimmed;
  }
  
  return summands;
}

function areSummamble(summands) {
  var isTrue = true;
  
  for(var i = 0; i < summands.length; i++) {
    var supposedMathString = summands[i];
    
    if (!isMathNotSum(supposedMathString)) {
      isTrue = false;
    }
  }
  
  return isTrue;
}

function arrayIsDice(parts) {
  if (parts.length === 1) {
    var diceString =  parts[0];
    return isDice(diceString);
  }
  
  return false;
}

function isDice(string) {
  return diceRegex.test(string) && (string.length <= 4);
}

function isNumberString(string) {
  return !isNaN(string) && (typeof(string) === "string") && !isBlank(string);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function isNumber(object) {
  return !isNaN(object) && (typeof(object) === "number");
}

function parseMath(command) {
  var parsed;
  
  if (isSumAndOnlySum(command)) {
    parsed = parseSum(command);
  }
  
  if(isDice(command)) {
    parsed = parseDice(command);
  }
  
  if(isNumberString(command)) {
    parsed = parseNumber(command);
  }
  
  return parsed;
}

function parseSum(command) {
  var summands = splitToSummands(command);
  var parsedSummands = parseSummands(summands);
  
  var parsed = {
    command: "sum",
    params: parsedSummands
  }
  
  return parsed;
}

function parseSummands(summands) {
  var parsedSummands = [];
  
  for (i = 0; i < summands.length; i++) {
    var summand = summands[i];
    
    if (isNumberString(summand)) {
      parsedSummands[i] = parseNumber(summand);
    }
    
    if(isDice(summand)) {
      parsedSummands[i] = parseDice(summand);
    }
  }
  
  return parsedSummands;
}

function parseDice(command) {
  var parts = command.split("d");
  
  if (parts[0] === "") {
    parts[0] = "1";
  }
  
  var parsed = {
    command: "dice",
    params: parts
  }
  
  return parsed;
}

function parseNumber(command) {
  var parsed = {
    command: "number",
    params: command
  }
  
  return parsed;
}

function isSentence(command) {
  var parts = command.split(" ");
  var supposedVerb = parts[0];
  
  return objectContainsKey(verbs, supposedVerb);
}

function interpretSentence(params) {
  var verb = verbs[params[0]];
  var restOfParams = params.slice(1);
  verb(restOfParams);
}

function arrayContainsObject(array, object) {
  var contains = false;
  
  for (var index = 0; index < array.length; index++) {
    if (array[index] === object) {
      contains = true;
    }
  }
  
  return contains;
}

function objectContainsKey(object, key) {
  return !(typeof(object[key]) === typeof(undefined));
}

function run(command) {
  var parsed = parse(command);
  var commandName = parsed['command'];
  var command = verbs[commandName];
  var params = parsed['params'];
  
  return command(params);
}

function runParsed(parsed) {
  var commandName = parsed['command'];
  var command = verbs[commandName];
  var params = parsed['params'];
  
  return command(params);
}






