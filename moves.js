const functions = require('./functions.js');

//text library object
module.exports = moves = {
    menu: {
        key: 'menu',
        text: 'TO LEARN ABOUT EACH MOVE, TYPE THE COMMAND:\n\n\
 - NEWCHARACTER: ?newcharacter\n\
 - CHECK YOUR CHARACTER STATS: ?character\n\
 - SET CHARACTER STATS: ?set\n\
 - SHIFT CHARACTER STATS: ?shift\n\
 - ROLL SOME DICE: ?roll\n\
 - DEFY DANGER: ?defy\n\
 - HACK AND SLASH: ?hack\n\
 - VOLLEY: ?volley\n\
 - DEFEND: ?defend\n\
 - SPOUT LORE: ?spout\n\
 - DISCERN REALITIES: ?discern\n\
 - PARLEY: ?parley\n\
 - AID OR INTERFERE: ?aid\n\
 - ROLL LAST BREATH: ?breath\n\
 - TAKE WATCH: ?watch\n\
 - UNDERTAKE A PERILOUS JOURNEY: ?journey\n\
 - CAROUSE: ?carouse',
        method: function(){return this.text}
    },
    abilities: {
        key: 'abilities',
        stats: {
                NAME: ['name', ''],
                STR: ['str', 0],
                DEX: ['dex', 0],
                CON: ['con', 0],
                INT: ['int', 0],
                WIS: ['wis', 0],
                CHA: ['cha', 0],
                DAM: ['dam', '!set dam+(d4, d6, d8 or d10)'],
                HP: ['hp', 0]
        }
        },
    newCharacter: {
        key: ['new', 'newcharacter'],
        text: 'NEW CHARACTER: !newcharacter\n\
Use this command to create a new blank character or to zero out your character stats.',
        method: functions.newCharacter
    },
    characterSheet: {
        key: ['character', 'charactersheet'],
        text: 'CHARACTER SHEET: !character\n\
Enter this command at any time to check on your character stats.',
        method: functions.characterSheet
    },
    set: {
        key: ['set', 'stats', 'setstats', 'statset'],
        text: 'SET STATS: !set stat+value ...\nTo set your character stats,\
 enter the command followed by all the STAT MODIFIERS you want to set. Use the \
 stat type +/- stat value. Unentered stats will default\
 to zero or their existing value.\n\
EXAMPLE: !set name+bambino str+1 cha-1 ... etc',
        error: 'Incorrect input, use the format: !set name+bambino str+1 cha-1 etc...',
        method: functions.setStats
    },
    shift: {
        key: 'shift',
        text: 'SHIFT STATS: !shift stat+/-num...\nTo shift your character stats\
 by a certain amount, enter the command followed by the stats you want to shift\
 and the amount to change them.\n\
EXAMPLE: !shift str+1 will increase your strength by 1.\
 !shift hp-5 will remove 5 from your hp.',
        error: 'Incorrect input, use the format: !shift str+1 hp-5 etc...\
 (this only works for numerical values)',
        method: functions.shift
    },
    roll: {
        key: ['roll'],
        text: 'ROLL DICE: !roll xdy +z\n\
Use the format !roll xdy +z where x = number of die, y = faces on die, and z = positive\
 or negative modifier, if any.\nEXAMPLE: !roll 2d6 +1  OR  !roll 2d6 +wis (SPACES MATTER!)',
        error: 'INCORRECT INPUT: Please use the format !roll xdy +z where x = number\
 of die, y = faces on die, and z = positive or negative modifier, if any.\n\
EXAMPLE: !roll 2d6 +1  OR  !roll 2d6 +str (SPACES MATTER!)',
        method: functions.xdyRoll
    },
    damage: {
        key: ['dam', 'damage'],
        text: 'ROLL DAMAGE: !dam +num\n\
 After setting your damage die with !set dam+(d4, d6, d8 or d10), you can easily\
 roll damage after an attack with !dam plus or minus any modifiers from weapons, etc.\
 You can also add additional rolls such as !dam +1d4 which will roll your damage die\
 and add an additional 1d4 roll.\n\
EXAMPLE: !dam  OR  !dam +1  OR  !dam +1d4  OR  !dam -1 +1d4',
        error: 'INCORRECT INPUT:\n\
Enter a damage die value in your CHARACTER SHEET.\n\
EXAMPLE: !set dam+d4',
        method: functions.damage
    },
    hackAndSlash: {
        key: ['hack', 'hackandslash', 'slash'],
        text: 'HACK AND SLASH: !hack\n\
When you attack an enemy in melee, roll +STR.',
        greatSuccess: 'On a 10+, you deal your damage to the enemy and avoid their attack.\
 At your option, you may choose to do +1d6 damage but expose yourself\
 to the enemy’s attack.',
        success: 'On a 10+, you deal your damage to the enemy and avoid their attack.\
 At your option, you may choose to do +1d6 damage but expose yourself\
 to the enemy’s attack.',
        mixed: 'On a 7–9, you deal your damage to the enemy and the enemy makes an attack against you.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'str',
        method: functions.moveRoll
    },
    volley: {
        key: 'volley',
        text: 'VOLLEY: !volley\n\
 When you take aim and shoot at an enemy at range, roll +DEX.',
        greatSuccess: 'On a 10+, you have a clear shot—deal your damage.',
        success: 'On a 10+, you have a clear shot—deal your damage.',
        mixed: 'On a 7–9, choose one (whichever you choose you deal your damage):\n\
 - You have to move to get the shot, placing you in danger as described by the GM\n\
 - You have to take what you can get: -1d6 damage\n\
 - You have to take several shots, reducing your ammo by 1',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'dex',
        method: functions.moveRoll
    },
    defyDanger: {
        key: ['defy', 'defydanger', 'danger'],
        text: 'DEFY DANGER: !defy +STAT\n\
When you act despite an imminent threat or suffer a calamity,\
 say how you deal with it and roll. If you do it:\n\
 - by powering through, +STR\n\
 - by getting out of the way or acting fast, +DEX\n\
 - by enduring, +CON \n - with quick thinking, +INT\n\
 - through mental fortitude, +WIS\n\
 - using charm or social grace, +CHA',
        greatSuccess: 'On a 10+, you do what you set out to, the threat doesn’t come to bear.',
        success: 'On a 10+, you do what you set out to, the threat doesn’t come to bear.',
        mixed: 'On a 7–9, you stumble, hesitate, or flinch: the GM will offer you\
 a worse outcome, hard bargain, or ugly choice.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'stat',
        method: functions.moveRoll
    },
    defend: {
        key: 'defend',
        text: 'DEFEND: !defend\n\
When you stand in defense of a person, item, or location under attack, roll +CON.',
        greatSuccess: 'On a 10+, hold 3. As long as you stand in defense,\
 when you or the thing you defend is attacked you may spend hold, 1 for 1, to choose an option:\n\
 - Redirect an attack from the thing you defend to yourself\n\
 - Halve the attack’s effect or damage\n\
 - Open up the attacker to an ally giving that ally +1 forward against the attacker\n\
 - Deal damage to the attacker equal to your level',
        success: 'On a 10+, hold 3. As long as you stand in defense,\
 when you or the thing you defend is attacked you may spend hold, 1 for 1, to choose an option:\n\
 - Redirect an attack from the thing you defend to yourself\n\
 - Halve the attack’s effect or damage\n\
 - Open up the attacker to an ally giving that ally +1 forward against the attacker\n\
 - Deal damage to the attacker equal to your level',
        mixed: 'On a 7-9, hold 1. As long as you stand in defense,\
 when you or the thing you defend is attacked you may spend hold, 1 for 1, to choose an option:\n\
 - Redirect an attack from the thing you defend to yourself\n\
 - Halve the attack’s effect or damage\n\
 - Open up the attacker to an ally giving that ally +1 forward against the attacker\n\
 - Deal damage to the attacker equal to your level',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'con',
        method: functions.moveRoll
    },
    spoutLore: {
        key: ['spout', 'spoutlore', 'lore'],
        text: 'SPOUT LORE: !spout\n\
When you consult your accumulated knowledge about something, roll +INT.',
        greatSuccess: 'On a 10+, the GM will tell you something interesting\
 and useful about the subject relevant to your situation.',
        success: 'On a 10+, the GM will tell you something interesting\
 and useful about the subject relevant to your situation.',
        mixed: 'On a 7–9, the GM will only tell you something interesting —\
 it’s on you to make it useful.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'int',
        method: functions.moveRoll
    },
    discernRealities: {
        key: ['discern', 'discernrealities', 'realities'],
        text: 'DISCERN REALITIES: !discern\n\
 When you closely study a situation or person, roll +WIS.',
        greatSuccess: 'On a 10+, ask the GM 3 questions from the list below.\
 Take +1 forward when acting on the answers.\n\
 - What happened here recently?\n\
 - What is about to happen?\n\
 - What should I be on the lookout for?\n\
 - What here is useful or valuable to me?\n\
 - Who’s really in control here?\n\
 - What here is not what it appears to be?',
        success: 'On a 10+, ask the GM 3 questions from the list below.\
 Take +1 forward when acting on the answers.\n\
 - What happened here recently?\n\
 - What is about to happen?\n\
 - What should I be on the lookout for?\n\
 - What here is useful or valuable to me?\n\
 - Who’s really in control here?\n\
 - What here is not what it appears to be?',
        mixed: 'On a 7-9, ask the GM 1 question from the list below.\
 Take +1 forward when acting on the answers.\n\
 - What happened here recently?\n\
 - What is about to happen?\n\
 - What should I be on the lookout for?\n\
 - What here is useful or valuable to me?\n\
 - Who’s really in control here?\n\
 - What here is not what it appears to be?',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'wis',
        method: functions.moveRoll
    },
    parley: {
        key: 'parley',
        text: 'PARLEY: !parley\n\
When you have leverage on a GM Character and manipulate them, roll +CHA.',
        greatSuccess: 'On a 10+, they do what you ask if you first promise what they ask of you.',
        success: 'On a 10+, they do what you ask if you first promise what they ask of you.',
        mixed: 'On a 7–9, they will do what you ask, but need some concrete assurance\
 of your promise, right now.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'cha',
        method: functions.moveRoll
    },
    aidOrInterfere: {
        key: ['aid', 'interfere', 'aidorinterfere'],
        text: 'AID OR INTERFERE !aid +/-BOND\n\
When you help or hinder someone you have a bond with, roll + the number of bonds\
 you have with that character',
        greatSuccess: 'On a 10+ the character you chose takes +1 or -2, your choice.',
        success: 'On a 10+ the character you chose takes +1 or -2, your choice.',
        mixed: 'On a 7–9, the character you chose takes +1 or -2, your choice.\
 You also expose yourself to danger, retribution, or cost.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'num',
        method: functions.moveRoll
    },
    lastBreath: {
        key: ['last', 'breath', 'lastbreath'],
        text: 'LAST BREATH: !breath\n\
When you’re dying you catch a glimpse of what lies beyond the Black Gates of Death’s Kingdom\
 (the GM will describe it). Then roll (just roll, + NOTHING — yeah, Death doesn’t care\
 how tough or cool you are)',
        greatSuccess: 'On a 10+, you’ve cheated Death — you’re in a bad spot but you’re still alive.',
        success: 'On a 10+, you’ve cheated Death — you’re in a bad spot but you’re still alive.',
        mixed: 'On a 7–9, Death himself will offer you a bargain. Take it and stabilize\
 or refuse and pass beyond the Black Gates into whatever fate awaits you.',
        fail: 'On a 6-, your fate is sealed...',
        stat: 'num',
        method: functions.moveRoll
    },
    takeWatch: {
        key: ['take', 'watch', 'takewatch'],
        text: 'TAKE WATCH: !watch\n\
When you’re on watch and something approaches the camp roll +WIS.',
        greatSuccess: 'On a 10+, you’re able to wake the camp and prepare a response,\
 everyone in the camp takes +1 forward.',
        success: 'On a 10+, you’re able to wake the camp and prepare a response,\
 everyone in the camp takes +1 forward.',
        mixed: 'On a 7–9, you react just a moment too late; your companions in camp\
 are awake but haven’t had time to prepare. They have weapons and armor but little else.',
        fail: 'On a 6-, whatever lurks outside the campfire’s light has the drop on you...',
        stat: 'wis',
        method: functions.moveRoll
    },
    undertakeAPerilousJourney: {
        key: ['undertake', 'journey', 'perilous', 'perilousjourney', 'undertakeaperilousjourney'],
        text: 'UNDERTAKE A PERILOUS JOURNEY: !trailblazer, !scout, !quartermaster\n\
When you travel through hostile territory, choose one member of the party to be Trailblazer,\
 one to be Scout, and one to be Quartermaster. Each character with a job to do rolls\
 their job title +WIS.',
        method: function(){return this.text}
    },
    trailblazer: {
        key: 'trailblazer',
        text: 'TRAILBLAZER: !trailblazer',
        greatSuccess: 'On a 10+, the trailblazer reduces the amount of time it takes\
 to reach your destination (the GM will say by how much).',
        success: 'On a 10+, the trailblazer reduces the amount of time it takes\
 to reach your destination (the GM will say by how much).',
        mixed: 'On a 7–9, the journey takes about as long as expected.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'wis',
        method: functions.moveRoll
    },
    scout: {
        key: 'scout',
        text: 'SCOUT: !scout',
        greatSuccess: 'On a 10+, the scout will spot any trouble quick enough to let you\
 get the drop on it.',
        success: 'On a 10+, the scout will spot any trouble quick enough to let you\
 get the drop on it.',
        mixed: 'On a 7–9, no one gets the drop on you but you don’t get the drop on them either.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'wis',
        method: functions.moveRoll
    },
    quartermaster: {
        key: 'quartermaster',
        text: 'QUARTERMASTER: !quartermaster',
        greatSuccess: 'On a 10+, the quartermaster reduces the number of rations required by one.',
        success: 'On a 10+, the quartermaster reduces the number of rations required by one.',
        mixed: 'On a 7–9, the normal number of rations are consumed.',
        fail: 'On a 6-, be prepared for the worst...',
        stat: 'wis',
        method: functions.moveRoll
    },
    carouse: {
        key: 'carouse',
        text: 'CAROUSE: !carouse +/-COIN\n\
When you return triumphant and throw a big party, spend 100 coins and roll +1 for every\
 extra 100 coins spent.',
        greatSuccess: 'On a 10+, choose 3.\n\
 - You befriend a useful NPC.\n\
 - You hear rumors of opportunity.\n\
 - You gain useful information\n\
 - You are not entangled, ensorcelled, or tricked.',
        success: 'On a 10+, choose 3.\n\
 - You befriend a useful NPC.\n\
 - You hear rumors of opportunity.\n\
 - You gain useful information\n\
 - You are not entangled, ensorcelled, or tricked.',
        mixed: 'On a 7-9, choose 1.\n\
 - You befriend a useful NPC.\n\
 - You hear rumors of opportunity.\n\
 - You gain useful information\n\
 - You are not entangled, ensorcelled, or tricked.',
        fail: 'On a 6-, you still choose one, but things get really out of hand (the GM will say how).',
        stat: 'num',
        method: functions.moveRoll
    }
}