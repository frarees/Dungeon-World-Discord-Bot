const storage = require('./redis.js')
const redis = require('redis');
const jsonify = require('redis-jsonify');
const save = jsonify(redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true}));

module.exports = {removePrefix, xdyRoll, roll, newCharacter, characterSheet, setStats, shift, moveRoll, messageCounter}

//functions
function removePrefix(message){
	let prefixed = message.toLowerCase().split(" ");
	if (prefixed[0] === ('!' || '?')) {
		prefixed.shift();
	} else if (prefixed[0] !== ('!' || '?')) {
		prefixed[0] = prefixed[0].slice(1);
	}; 
	return prefixed;
};

function xdyRoll(userMessage, userId, channelId, userNickname, moves, userData){
    let die = userMessage[1];
    let showStat = ''
    let modStat = 0
    if (!die) {return moves.roll.error};
    let xdy = die.split('d');
    let num = parseInt(xdy[0]);
        if (isNaN(num)){return moves.roll.error};
        if (num>200){return "Maximum die roll = 200d2000"}
    let faces = parseInt(xdy[1]);
        if (isNaN(faces)){return moves.roll.error};
        if (faces>2000){return "Maximum die roll = 200d2000"}
    const dieRoll = roll(num, faces);
    let total = parseInt(dieRoll[0]);
    let result = dieRoll[1];
    let addOn = 0
    if(userMessage[2] || userMessage[3]){
        function hasNumber(string) {return /\d/.test(string)}
                let statOne = hasNumber(userMessage[2]);
                let statTwo = hasNumber(userMessage[3]);
        for(let [key, value] of Object.entries(moves.abilities.stats)){
            userMessage.forEach(i => {
                if(i.startsWith(value[0]) || i.startsWith(`+${value[0]}`)){
                    modStat = parseInt(userData[userId][key])
                    showStat = ` ${key}`
                }
            })    
        }
        if(statOne){
            addOn = parseInt(userMessage[2]);
            if(addOn>=0){addOnPrint = `+${addOn}`}
            else{addOnPrint = addOn}
            result.push(` (${addOnPrint})`)
        } 
        if(statTwo){
            addOn = parseInt(userMessage[3]);
            if(addOn>=0){addOnPrint = `+${addOn}`}
            else{addOnPrint = addOn}
            result.push(` (${addOnPrint})`)
        }
    }
    total = total + addOn;
    let grandTotal = total + modStat;
        if (!modStat){
            return (`You rolled [${result} ] = ${total}.`)}
        else if (modStat >= 0){
            return (`You rolled [${result} ] = ${total} + ${modStat}${showStat}. That's ${grandTotal}.`)}
        else if (modStat < 0) {
        modStat = Math.abs(modStat);
            return (`You rolled [${result} ] = ${total} - ${modStat}${showStat}. That's ${grandTotal}.`)}
}

function roll(num, faces){
    let total = 0;
    let result = [];
        for(let i = 0; i < num; i++){
    let singleRoll = Math.floor(Math.random() * faces) + 1;
    result.push(' ' + singleRoll);
    total += singleRoll;
    }
    return [total, result];
}

function moveRoll(userMessage, userId, channelId, userNickname, moves, userData, i){
    let modStat = 0
    let rollText = ''
    let moveText = ''
    let showStat = ''
    let input = userMessage[1];
    input = parseInt(input);
    if(moves[i].stat === 'num'){
        if(!input){input = 0}
        modStat = input
    } else if(moves[i].stat === 'stat'){
        if(!userMessage[1]){return 'You need to add a +STAT to your command'}
        modStat = userData[userId][userMessage[1].slice(1).toUpperCase()]
    } else {
        modStat = userData[userId][moves[i].stat.toUpperCase()];
        showStat = ` ${moves[i].stat.toUpperCase()}`
    }
    if(!modStat){modStat = 0};
    let moveRoll = roll(2, 6);
    let total = moveRoll[0];
    let result = moveRoll[1];
    let addOn = 0
    if(userMessage[1] || userMessage[2]){
        function hasNumber(string) {return /\d/.test(string)}
                let statOne = hasNumber(userMessage[1]);
                let statTwo = hasNumber(userMessage[2]);
        for(let [key, value] of Object.entries(moves.abilities.stats)){
            userMessage.forEach(i => {
                if(i.startsWith(value[0]) || i.startsWith(`+${value[0]}`)){
                    modStat = parseInt(userData[userId][key])
                    showStat = ` ${key}`
                }
            })    
        }
        if(statOne){
            addOn = parseInt(userMessage[1]);
            if(moves[i].stat === 'num'){addOn = 0;}
            else if(addOn>=0){addOnPrint = `+${addOn}`; result.push(` (${addOnPrint})`)}
            else{addOnPrint = addOn; result.push(` (${addOnPrint})`)}
            
        }   
        if(statTwo){
            addOn = parseInt(userMessage[2]);
            if(addOn>=0){addOnPrint = `+${addOn}`}
            else{addOnPrint = addOn}
            result.push(` (${addOnPrint})`)
        }
    }
    total = total + addOn;
    let grandTotal = total + modStat;
    if (grandTotal >= 10){
		moveText = moves[i].success
	} else if (9 >= grandTotal && grandTotal >= 7){
        moveText = moves[i].mixed
    } else if (6 >= grandTotal ){
        moveText =  moves[i].fail
    }
    if (modStat >= 0){
			rollText = `You rolled [${result} ] = ${total} + ${modStat}${showStat}. That’s ${grandTotal}.`}
	else if (modStat < 0) {
			modStat = Math.abs(modStat);
			rollText = `You rolled [${result} ] = ${total} - ${modStat}${showStat}. That’s ${grandTotal}.`}
    return `${rollText}\n${moveText}`
}

function newCharacter(userMessage, userId, channelId, userNickname, moves, userData){
    userData[userId] = {}
    let person = {};
    for(let [key, value] of Object.entries(moves.abilities.stats)){
        person[key] = value[1]
    }
    userData[userId] = person;
    storage.set(channelId, userData);
    return 'CREATED A BLANK CHARACTER: Type !character to view,\
 or ?set to learn how to set your character stat. You must have\
 a character set up in order to use the moves.'
}

function characterSheet(userMessage, userId, channelId, userNickname, moves, userData){
    statPrintout = ['Here are your CHARACTER STATS:'];
    for(let [key, value] of Object.entries(userData[userId])){
        statPrintout.push(`${key}: ${value}`)
    }
    return statPrintout
}

function shift(userMessage, userId, channelId, userNickname, moves, userData){
    let shiftPrintout = ['CHANGES:'];
    for(let [key, value] of Object.entries(moves.abilities.stats)){
        userMessage.forEach(i => {
            if(i.startsWith(value[0])){
                i = i.slice(value[0].length)
                function hasNumber(string) {return /\d/.test(string)}
                let stat = hasNumber(i)
                let numerical = hasNumber(value)
                if(stat && numerical){
                    i = parseInt(i)
                    userData[userId][key] = userData[userId][key] + i,
                    shiftPrintout.push(`${key}: ${userData[userId][key]}`)
                }
            }
        })
    }
    if(!shiftPrintout[1]){shiftPrintout = moves.shift.error}
    return shiftPrintout
}

function setStats(userMessage, userId, channelId, userNickname, moves, userData){
    let setErrors = []
    for(let [key, value] of Object.entries(moves.abilities.stats)){
        userMessage.forEach(i => {
            if(i.startsWith(value[0])){
                if(value[0]==="name"){
                    i = i.slice(value[0].length)
                    i = i.slice(1).toUpperCase()
                    if(i==='NICKNAME'){i = userNickname};
                    if(!i){setErrors.push(moves.set.error)}
                    else{userData[userId][key] = i}
                } else if(value[0] === "dam"){
                    i = i.slice(value[0].length)
                    i = i.slice(1).toLowerCase()
                    if(i==='d4' || i==='d6' || i==='d8' || i==='d10'){
                        userData[userId][key] = i
                    } else {setErrors.push(moves.damage.error)}
                } else {
                    i = i.slice(value[0].length)
                    function hasNumber(string) {return /\d/.test(string)}
                    let stat = hasNumber(i)
                    i = parseInt(i)
                    if(isNaN(i)){setErrors.push(moves.set.error)}
                    if(stat){
                        userData[userId][key] = i 
                    } else{setErrors.push(moves.set.error)}
                }
            }
        })
    }
    if(setErrors[0]){return setErrors[0]}
    else{return characterSheet(userMessage, userId, channelId, userNickname, moves, userData)}
}

function damage(userMessage, userId, channelId, userNickname, moves, userData){
    let damDie = userData[userId]['DAM']
    let modDieRoll = [0, 0]
    let modNum = 0
    let damDieRoll = [0, 0]
    let posNeg = ''
    switch (damDie){
        case 'd4':
            damDieRoll = roll(1, 4)
            break;
        case 'd6':
            damDieRoll = roll(1, 6)
            break;
        case 'd8':
            damDieRoll = roll(1, 8)
            break;
        case 'd10':
            damDieRoll = roll(1, 10)
            break;
        default:
            return moves.damage.error
    }
    userMessage.forEach(i => {
        const xdyregex = /[+-]\d+d\d+/
        const modregex = /[+-]\d+/
        if(xdyregex.test(i)){
        if(i==='+'){posNeg = 'pos'}
        if(i==='-'){posNeg = 'neg'}
        let xdy = i.split('d');
        let num = parseInt(xdy[0]);
        num = Math.abs(num)
        let faces = parseInt(xdy[1]);
        modDieRoll = roll(num, faces);

        } else if (modregex.test(i)){
        modNum = parseInt(i)
        }

    })
    if(posNeg === 'neg'){modDieRoll[0] = -Math.abs(modDieRoll[0])}
    if(modDieRoll[0]===0){modDieAddon = ''}
        else if(modDieRoll[0] > 0){modDieAddon = ` + ${modDieRoll[0]}`}
        else if(modDieRoll[0] < 0 ){modDieRollDisp = Math.abs(modDieRoll[0]); modDieAddon = ` - ${modDieRollDisp}`}

    if(modNum===0){modAddon = ''} 
        else if(modNum > 0){modAddon = ` + ${modNum}`}
        else if (modNum < 0){modNumDisp = Math.abs(modNum); modAddon = ` - ${modNumDisp}`}
    let damGrandTotal = damDieRoll[0] + modDieRoll[0] + modNum

    if(modDieRoll[0]!==0 || modNum!==0)
        {return `You deal [ ${damDieRoll[0]}${modDieAddon}${modAddon} ] = ${damGrandTotal} damage!`}
    else{return `You deal ${damGrandTotal} damage!`}
}

function messageCounter(){
    save.get('messageCounter', function (err, result) {
        if(!result){result=0} 
        result++
        console.log(result);
        save.set('messageCounter', result)
    });
        
}