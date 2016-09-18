require = (function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a)
                    return a(o, !0);
                if (i)
                    return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {exports: {}};
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)
        s(r[o]);
    return s
})({1: [function (require, module, exports) {
            var stemmer = require('./stemmer')

            exports = module.exports = require('./langs/english')

            exports.among = stemmer.among
            exports.except = stemmer.except

        }, {"./langs/english": 2, "./stemmer": 3}], 2: [function (require, module, exports) {
            var stemmer = require('../stemmer')
                    , alphabet = "abcdefghijklmnopqrstuvwxyz"
                    , vowels = "aeiouy"
                    , consonants = alphabet.replace(RegExp("[" + vowels + "]", "g"), "") + "Y"
                    , v_wxy = vowels + "wxY"
                    , valid_li = "cdeghkmnrt"
                    , r1_re = RegExp("^.*?([" + vowels + "][^" + vowels + "]|$)")
                    , r1_spec = /^(gener|commun|arsen)/
                    , doubles = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/
                    , y_cons = RegExp("([" + vowels + "])y", "g")
                    , y_suff = RegExp("(.[^" + vowels + "])[yY]$")
                    , exceptions1 =
                    {skis: "ski"
                        , skies: "sky"
                        , dying: "die"
                        , lying: "lie"
                        , tying: "tie"

                        , idly: "idl"
                        , gently: "gentl"
                        , ugly: "ugli"
                        , early: "earli"
                        , only: "onli"
                        , singly: "singl"

                        , sky: "sky"
                        , news: "news"
                        , howe: "howe"

                        , atlas: "atlas"
                        , cosmos: "cosmos"
                        , bias: "bias"
                        , andes: "andes"
                    }
            , exceptions2 =
                    ["inning", "outing", "canning", "herring", "earring"
                                , "proceed", "exceed", "succeed"
                    ]


            module.exports = function (word) {
                // Exceptions 1
                var stop = stemmer.except(word, exceptions1)
                if (stop)
                    return stop

                // No stemming for short words.
                if (word.length < 3)
                    return word

                // Y = "y" as a consonant.
                if (word[0] === "y")
                    word = "Y" + word.substr(1)
                word = word.replace(y_cons, "$1Y")

                // Identify the regions of the word.
                var r1, m
                if (m = r1_spec.exec(word)) {
                    r1 = m[0].length
                } else {
                    r1 = r1_re.exec(word)[0].length
                }

                var r2 = r1 + r1_re.exec(word.substr(r1))[0].length

                // Step 0
                word = word.replace(/^'/, "")
                word = word.replace(/'(s'?)?$/, "")

                // Step 1a
                word = stemmer.among(word,
                        ["sses", "ss"
                                    , "(ied|ies)", function (match, _, offset) {
                                        return (offset > 1) ? "i" : "ie"
                                    }
                            , "([" + vowels + "].*?[^us])s", function (match, m1) {
                                return m1
                            }
                        ])

                stop = stemmer.except(word, exceptions2)
                if (stop)
                    return stop

                // Step 1b
                word = stemmer.among(word,
                        ["(eed|eedly)", function (match, _, offset) {
                                return (offset >= r1) ? "ee" : match + " "
                            }
                            , ("([" + vowels + "].*?)(ed|edly|ing|ingly)"), function (match, prefix, suffix, off) {
                                if (/(?:at|bl|iz)$/.test(prefix)) {
                                    return prefix + "e"
                                } else if (doubles.test(prefix)) {
                                    return prefix.substr(0, prefix.length - 1)
                                } else if (shortv(word.substr(0, off + prefix.length)) && off + prefix.length <= r1) {
                                    return prefix + "e"
                                } else {
                                    return prefix
                                }
                            }
                        ])

                // Step 1c
                word = word.replace(y_suff, "$1i")

                // Step 2
                word = stemmer.among(word, r1,
                        ["(izer|ization)", "ize"
                                    , "(ational|ation|ator)", "ate"
                                    , "enci", "ence"
                                    , "anci", "ance"
                                    , "abli", "able"
                                    , "entli", "ent"
                                    , "tional", "tion"
                                    , "(alism|aliti|alli)", "al"
                                    , "fulness", "ful"
                                    , "(ousli|ousness)", "ous"
                                    , "(iveness|iviti)", "ive"
                                    , "(biliti|bli)", "ble"
                                    , "ogi", function (m, off) {
                                        return (word[off - 1] === "l") ? "og" : "ogi"
                                    }
                            , "fulli", "ful"
                                    , "lessli", "less"
                                    , "li", function (m, off) {
                                        return ~valid_li.indexOf(word[off - 1]) ? "" : "li"
                                    }
                        ])

                // Step 3
                word = stemmer.among(word, r1,
                        ["ational", "ate"
                                    , "tional", "tion"
                                    , "alize", "al"
                                    , "(icate|iciti|ical)", "ic"
                                    , "(ful|ness)", ""
                                    , "ative", function (m, off) {
                                        return (off >= r2) ? "" : "ative"
                                    }
                        ])

                // Step 4
                word = stemmer.among(word, r2,
                        ["(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ism|ate|iti|ous|ive|ize)", ""
                                    , "ion", function (m, off) {
                                        return ~"st".indexOf(word[off - 1]) ? "" : m
                                    }
                        ])

                // Step 5
                word = stemmer.among(word, r1,
                        ["e", function (m, off) {
                                return (off >= r2 || !shortv(word, off - 2)) ? "" : "e"
                            }
                            , "l", function (m, off) {
                                return (word[off - 1] === "l" && off >= r2) ? "" : "l"
                            }
                        ])

                word = word.replace(/Y/g, "y")

                return word
            }


// Check for a short syllable at the given index.
// Examples:
//
//   rap
//   trap
//   entrap
//
// NOT short
//
//   uproot
//   bestow
//   disturb
//
            function shortv(word, i) {
                if (i == null)
                    i = word.length - 2
                if (word.length < 3)
                    i = 0//return true
                return !!((!~vowels.indexOf(word[i - 1]) &&
                        ~vowels.indexOf(word[i]) &&
                        !~v_wxy.indexOf(word[i + 1]))
                        || (i === 0 &&
                                ~vowels.indexOf(word[i]) &&
                                !~vowels.indexOf(word[i + 1])))
            }

// Check if the word is short.
            function short(word, r1) {
                var l = word.length
                return r1 >= l && shortv(word, l - 2)
            }

        }, {"../stemmer": 3}], 3: [function (require, module, exports) {
            var stemmer = {}
            , cache = {}

            module.exports = stemmer

            stemmer.except = function (word, exceptions) {
                if (exceptions instanceof Array) {
                    if (~exceptions.indexOf(word))
                        return word
                } else {
                    for (var k in exceptions) {
                        if (k === word)
                            return exceptions[k]
                    }
                }
                return false
            }


// word - String
// offset - Integer (optional)
// replace - Key/Value Array of pattern, string, and function.
            stemmer.among = function among(word, offset, replace) {
                if (replace == null)
                    return among(word, 0, offset)

                // Store the intial value of the word.
                var initial = word.slice()
                        , pattern, replacement

                for (var i = 0; i < replace.length; i += 2) {
                    pattern = replace[i]
                    pattern = cache[pattern] || (cache[pattern] = new RegExp(replace[i] + "$"))
                    replacement = replace[i + 1]

                    if (typeof replacement === "function") {
                        word = word.replace(pattern, function (m) {
                            var off = arguments["" + (arguments.length - 2)]
                            if (off >= offset) {
                                return replacement.apply(null, arguments)
                            } else {
                                return m + " "
                            }
                        })
                    } else {
                        word = word.replace(pattern, function (m) {
                            var off = arguments["" + (arguments.length - 2)]
                            return (off >= offset) ? replacement : m + " "
                        })
                    }

                    if (word !== initial)
                        break
                }

                return word.replace(/ /g, "")
            }

        }, {}], 4: [function (require, module, exports) {
            module.exports = require('./lib/stm');
        }, {"./lib/stm": 5}], 5: [function (require, module, exports) {
            /* dependencies */
            var stemPorter = require('stem-porter');
            var tkn = require('tkn');

            module.exports = {
                /* Simply points to tkn library */
                tokenise: tkn.tokenise,
                /**
                 * Tokenises and stems a string, returning an Array of stemmed terms.
                 * text - String. Text to be tokenised and stemmed.
                 * noStopWords - Boolean. Defines whether stop words should be removed or not.
                 */
                stem: function (text, noStopWords) {
                    noStopWords = (typeof noStopWords === 'undefined') ? true : noStopWords;  // set default to `true`
                    return tkn.tokenise(text, noStopWords).map(function (word) {
                        return stemPorter(word);
                    });
                }
            };
        }, {"stem-porter": 1, "tkn": 10}], 6: [function (require, module, exports) {
// via http://tedserbinski.com/files/stopwords.js.txt
            exports.english = [
                'a',
                'able',
                'about',
                'above',
                'abroad',
                'according',
                'accordingly',
                'across',
                'actually',
                'adj',
                'after',
                'afterwards',
                'again',
                'against',
                'ago',
                'ahead',
                'aint',
                'all',
                'allow',
                'allows',
                'almost',
                'alone',
                'along',
                'alongside',
                'already',
                'also',
                'although',
                'always',
                'am',
                'amid',
                'amidst',
                'among',
                'amongst',
                'an',
                'and',
                'another',
                'any',
                'anybody',
                'anyhow',
                'anyone',
                'anything',
                'anyway',
                'anyways',
                'anywhere',
                'apart',
                'appear',
                'appreciate',
                'appropriate',
                'are',
                'arent',
                'around',
                'as',
                'as',
                'aside',
                'ask',
                'asking',
                'associated',
                'at',
                'available',
                'away',
                'awfully',
                'b',
                'back',
                'backward',
                'backwards',
                'be',
                'became',
                'because',
                'become',
                'becomes',
                'becoming',
                'been',
                'before',
                'beforehand',
                'begin',
                'behind',
                'being',
                'believe',
                'below',
                'beside',
                'besides',
                'best',
                'better',
                'between',
                'beyond',
                'both',
                'brief',
                'but',
                'by',
                'c',
                'came',
                'can',
                'cannot',
                'cant',
                'cant',
                'caption',
                'cause',
                'causes',
                'certain',
                'certainly',
                'changes',
                'clearly',
                'cmon',
                'co',
                'co.',
                'com',
                'come',
                'comes',
                'concerning',
                'consequently',
                'consider',
                'considering',
                'contain',
                'containing',
                'contains',
                'corresponding',
                'could',
                'couldn',
                'couldnt',
                'course',
                'cs',
                'currently',
                'd',
                'dare',
                'darent',
                'definitely',
                'described',
                'despite',
                'did',
                'didn',
                'didnt',
                'different',
                'directly',
                'do',
                'does',
                'doesnt',
                'doing',
                'don',
                'done',
                'dont',
                'down',
                'downwards',
                'during',
                'e',
                'each',
                'edu',
                'eg',
                'eight',
                'eighty',
                'either',
                'else',
                'elsewhere',
                'end',
                'ending',
                'enough',
                'entirely',
                'especially',
                'et',
                'etc',
                'even',
                'ever',
                'evermore',
                'every',
                'everybody',
                'everyone',
                'everything',
                'everywhere',
                'ex',
                'exactly',
                'example',
                'except',
                'f',
                'fairly',
                'far',
                'farther',
                'feel',
                'few',
                'fewer',
                'fifth',
                'first',
                'five',
                'followed',
                'following',
                'follows',
                'for',
                'forever',
                'former',
                'formerly',
                'forth',
                'forward',
                'found',
                'four',
                'from',
                'fuck',
                'further',
                'furthermore',
                'g',
                'get',
                'gets',
                'getting',
                'given',
                'gives',
                'go',
                'goes',
                'going',
                'gone',
                'got',
                'gotten',
                'greetings',
                'h',
                'had',
                'hadnt',
                'half',
                'happens',
                'hardly',
                'has',
                'hasnt',
                'have',
                'havent',
                'having',
                'he',
                'hed',
                'hell',
                'hello',
                'help',
                'hence',
                'her',
                'here',
                'hereafter',
                'hereby',
                'herein',
                'heres',
                'hereupon',
                'hers',
                'herself',
                'hes',
                'hi',
                'him',
                'himself',
                'his',
                'hither',
                'hopefully',
                'how',
                'howbeit',
                'however',
                'http',
                'https',
                'hundred',
                'i',
                'id',
                'ie',
                'if',
                'ignored',
                'ill',
                'im',
                'immediate',
                'in',
                'inasmuch',
                'inc',
                'inc.',
                'indeed',
                'indicate',
                'indicated',
                'indicates',
                'inner',
                'inside',
                'insofar',
                'instead',
                'into',
                'inward',
                'is',
                'isnt',
                'it',
                'itd',
                'itll',
                'its',
                'its',
                'itself',
                'ive',
                'j',
                'just',
                'k',
                'keep',
                'keeps',
                'kept',
                'know',
                'known',
                'knows',
                'l',
                'last',
                'lately',
                'later',
                'latter',
                'latterly',
                'least',
                'less',
                'lest',
                'let',
                'lets',
                'like',
                'liked',
                'likely',
                'likewise',
                'little',
                'look',
                'looking',
                'looks',
                'low',
                'lower',
                'ltd',
                'm',
                'made',
                'mainly',
                'make',
                'makes',
                'many',
                'may',
                'maybe',
                'maynt',
                'me',
                'mean',
                'meantime',
                'meanwhile',
                'merely',
                'might',
                'mightnt',
                'mine',
                'minus',
                'miss',
                'more',
                'moreover',
                'most',
                'mostly',
                'mr',
                'mrs',
                'much',
                'must',
                'mustnt',
                'my',
                'myself',
                'n',
                'name',
                'namely',
                'nd',
                'near',
                'nearly',
                'necessary',
                'need',
                'neednt',
                'needs',
                'neither',
                'never',
                'neverf',
                'neverless',
                'nevertheless',
                'new',
                'next',
                'nine',
                'ninety',
                'no',
                'nobody',
                'non',
                'none',
                'nonetheless',
                'noone',
                'no-one',
                'nor',
                'normally',
                'not',
                'nothing',
                'notwithstanding',
                'novel',
                'now',
                'nowhere',
                'o',
                'obviously',
                'of',
                'off',
                'often',
                'oh',
                'ok',
                'okay',
                'old',
                'on',
                'once',
                'one',
                'ones',
                'ones',
                'only',
                'onto',
                'opposite',
                'or',
                'other',
                'others',
                'otherwise',
                'ought',
                'oughtnt',
                'our',
                'ours',
                'ourselves',
                'out',
                'outside',
                'over',
                'overall',
                'own',
                'p',
                'particular',
                'particularly',
                'past',
                'per',
                'perhaps',
                'placed',
                'please',
                'plus',
                'possible',
                'presumably',
                'probably',
                'provided',
                'provides',
                'q',
                'que',
                'quite',
                'qv',
                'r',
                'rather',
                'rd',
                're',
                'really',
                'reasonably',
                'recent',
                'recently',
                'regarding',
                'regardless',
                'regards',
                'relatively',
                'respectively',
                'right',
                'round',
                's',
                'said',
                'same',
                'saw',
                'say',
                'saying',
                'says',
                'second',
                'secondly',
                'see',
                'seeing',
                'seem',
                'seemed',
                'seeming',
                'seems',
                'seen',
                'self',
                'selves',
                'sensible',
                'sent',
                'serious',
                'seriously',
                'seven',
                'several',
                'shall',
                'shant',
                'she',
                'shed',
                'shell',
                'shes',
                'shit',
                'should',
                'shouldn',
                'shouldnt',
                'since',
                'six',
                'so',
                'some',
                'somebody',
                'someday',
                'somehow',
                'someone',
                'something',
                'sometime',
                'sometimes',
                'somewhat',
                'somewhere',
                'soon',
                'sorry',
                'specified',
                'specify',
                'specifying',
                'still',
                'sub',
                'such',
                'sup',
                'sure',
                't',
                'take',
                'taken',
                'taking',
                'tell',
                'tends',
                'th',
                'than',
                'thank',
                'thanks',
                'thanx',
                'that',
                'thatll',
                'thats',
                'thats',
                'thatve',
                'the',
                'their',
                'theirs',
                'them',
                'themselves',
                'then',
                'thence',
                'there',
                'thereafter',
                'thereby',
                'thered',
                'therefore',
                'therein',
                'therell',
                'therere',
                'theres',
                'theres',
                'thereupon',
                'thereve',
                'these',
                'they',
                'theyd',
                'theyll',
                'theyre',
                'theyve',
                'thing',
                'things',
                'think',
                'third',
                'thirty',
                'this',
                'thorough',
                'thoroughly',
                'those',
                'though',
                'three',
                'through',
                'throughout',
                'thru',
                'thus',
                'till',
                'to',
                'together',
                'too',
                'took',
                'toward',
                'towards',
                'tried',
                'tries',
                'truly',
                'try',
                'trying',
                'ts',
                'twice',
                'two',
                'u',
                'un',
                'under',
                'underneath',
                'undoing',
                'unfortunately',
                'unless',
                'unlike',
                'unlikely',
                'until',
                'unto',
                'up',
                'upon',
                'upwards',
                'us',
                'use',
                'used',
                'useful',
                'uses',
                'using',
                'usually',
                'v',
                'value',
                'various',
                'versus',
                'very',
                'via',
                'viz',
                'vs',
                'w',
                'want',
                'wants',
                'was',
                'wasnt',
                'way',
                'we',
                'wed',
                'welcome',
                'well',
                'well',
                'went',
                'were',
                'were',
                'werent',
                'weve',
                'what',
                'whatever',
                'whatll',
                'whats',
                'whatve',
                'when',
                'whence',
                'whenever',
                'where',
                'whereafter',
                'whereas',
                'whereby',
                'wherein',
                'wheres',
                'whereupon',
                'wherever',
                'whether',
                'which',
                'whichever',
                'while',
                'whilst',
                'whither',
                'who',
                'whod',
                'whoever',
                'whole',
                'wholl',
                'whom',
                'whomever',
                'whos',
                'whose',
                'why',
                'will',
                'willing',
                'wish',
                'with',
                'within',
                'without',
                'wonder',
                'wont',
                'would',
                'wouldnt',
                'x',
                'y',
                'yes',
                'yet',
                'you',
                'youd',
                'youll',
                'your',
                'youre',
                'yours',
                'yourself',
                'yourselves',
                'youve',
                'z',
                'zero',
            ]
        }, {}], 7: [function (require, module, exports) {
            exports.german = [
                'aber',
                'alle',
                'allem',
                'allen',
                'aller',
                'alles',
                'als',
                'also',
                'am',
                'an',
                'ander',
                'andere',
                'anderem',
                'anderen',
                'anderer',
                'anderes',
                'anderm',
                'andern',
                'anderr',
                'anders',
                'auch',
                'auf',
                'aus',
                'bei',
                'bin',
                'bis',
                'bist',
                'da',
                'dadurch',
                'daher',
                'damit',
                'dann',
                'darum',
                'das',
                'dass',
                'dasselbe',
                'dazu',
                'daß',
                'dein',
                'deine',
                'deinem',
                'deinen',
                'deiner',
                'deines',
                'dem',
                'demselben',
                'den',
                'denn',
                'denselben',
                'der',
                'derer',
                'derselbe',
                'derselben',
                'des',
                'deshalb',
                'desselben',
                'dessen',
                'dich',
                'die',
                'dies',
                'diese',
                'dieselbe',
                'dieselben',
                'diesem',
                'diesen',
                'dieser',
                'dieses',
                'dir',
                'doch',
                'dort',
                'du',
                'durch',
                'ein',
                'eine',
                'einem',
                'einen',
                'einer',
                'eines',
                'einig',
                'einige',
                'einigem',
                'einigen',
                'einiger',
                'einiges',
                'einmal',
                'er',
                'es',
                'etwas',
                'euch',
                'euer',
                'eure',
                'eurem',
                'euren',
                'eurer',
                'eures',
                'für',
                'gegen',
                'gewesen',
                'hab',
                'habe',
                'haben',
                'hat',
                'hatte',
                'hatten',
                'hattest',
                'hattet',
                'hier',
                'hin',
                'hinter',
                'ich',
                'ihm',
                'ihn',
                'ihnen',
                'ihr',
                'ihre',
                'ihrem',
                'ihren',
                'ihrer',
                'ihres',
                'im',
                'in',
                'indem',
                'ins',
                'ist',
                'ja',
                'jede',
                'jedem',
                'jeden',
                'jeder',
                'jedes',
                'jene',
                'jenem',
                'jenen',
                'jener',
                'jenes',
                'jetzt',
                'kann',
                'kannst',
                'kein',
                'keine',
                'keinem',
                'keinen',
                'keiner',
                'keines',
                'können',
                'könnt',
                'könnte',
                'machen',
                'man',
                'manche',
                'manchem',
                'manchen',
                'mancher',
                'manches',
                'mein',
                'meine',
                'meinem',
                'meinen',
                'meiner',
                'meines',
                'mich',
                'mir',
                'mit',
                'muss',
                'musst',
                'musste',
                'muß',
                'mußt',
                'müssen',
                'müßt',
                'nach',
                'nachdem',
                'nein',
                'nicht',
                'nichts',
                'noch',
                'nun',
                'nur',
                'ob',
                'oder',
                'ohne',
                'sehr',
                'seid',
                'sein',
                'seine',
                'seinem',
                'seinen',
                'seiner',
                'seines',
                'selbst',
                'sich',
                'sie',
                'sind',
                'so',
                'solche',
                'solchem',
                'solchen',
                'solcher',
                'solches',
                'soll',
                'sollen',
                'sollst',
                'sollt',
                'sollte',
                'sondern',
                'sonst',
                'soweit',
                'sowie',
                'um',
                'und',
                'uns',
                'unse',
                'unsem',
                'unsen',
                'unser',
                'unsere',
                'unses',
                'unter',
                'viel',
                'vom',
                'von',
                'vor',
                'wann',
                'war',
                'waren',
                'warst',
                'warum',
                'was',
                'weg',
                'weil',
                'weiter',
                'weitere',
                'welche',
                'welchem',
                'welchen',
                'welcher',
                'welches',
                'wenn',
                'wer',
                'werde',
                'werden',
                'werdet',
                'weshalb',
                'wie',
                'wieder',
                'wieso',
                'will',
                'wir',
                'wird',
                'wirst',
                'wo',
                'woher',
                'wohin',
                'wollen',
                'wollte',
                'während',
                'würde',
                'würden',
                'zu',
                'zum',
                'zur',
                'zwar',
                'zwischen',
                'über'
            ]

        }, {}], 8: [function (require, module, exports) {
// via http://www.ranks.nl/stopwords/spanish.html
            exports.spanish = [
                'a',
                'un',
                'una',
                'unas',
                'unos',
                'uno',
                'sobre',
                'de',
                'todo',
                'también',
                'tras',
                'otro',
                'algún',
                'alguno',
                'alguna',
                'algunos',
                'algunas',
                'ser',
                'es',
                'soy',
                'eres',
                'somos',
                'sois',
                'esto',
                'estoy',
                'esta',
                'estamos',
                'estais',
                'estan',
                'como',
                'en',
                'para',
                'atras',
                'porque',
                'por qué',
                'estado',
                'estaba',
                'ante',
                'antes',
                'siendo',
                'ambos',
                'pero',
                'por',
                'no',
                'poder',
                'sal',
                'al',
                'puede',
                'puedo',
                'más',
                'ya',
                'le',
                'o',
                'me',
                'hasta',
                'durante',
                'ni',
                'ese',
                'contra',
                'eso',
                'mí',
                'mi',
                'el',
                'él',
                'podemos',
                'podeis',
                'pueden',
                'fui',
                'fue',
                'fuimos',
                'fueron',
                'hacer',
                'hago',
                'hace',
                'hacemos',
                'haceis',
                'hacen',
                'cada',
                'fin',
                'incluso',
                'primero',
                'desde',
                'conseguir',
                'consigo',
                'consigue',
                'consigues',
                'conseguimos',
                'consiguen',
                'ir',
                'voy',
                'va',
                'vamos',
                'vais',
                'van',
                'vaya',
                'gueno',
                'ha',
                'tener',
                'tengo',
                'tiene',
                'tenemos',
                'teneis',
                'tienen',
                'la',
                'lo',
                'las',
                'los',
                'su',
                'aqui',
                'mio',
                'poco',
                'tu',
                'tú',
                'te',
                'si',
                'sí',
                'tuyo',
                'ellos',
                'ella',
                'y',
                'del',
                'se',
                'ellas',
                'nos',
                'nosotros',
                'vosotros',
                'vosotras',
                'si',
                'dentro',
                'solo',
                'solamente',
                'saber',
                'sabes',
                'sabe',
                'sabemos',
                'sabeis',
                'saben',
                'ultimo',
                'largo',
                'bastante',
                'haces',
                'muchos',
                'aquellos',
                'aquellas',
                'sus',
                'entonces',
                'tiempo',
                'verdad',
                'verdadero',
                'verdadera',
                'cierto',
                'ciertos',
                'cierta',
                'ciertas',
                'intentar',
                'intento',
                'intenta',
                'intentas',
                'intentamos',
                'intentais',
                'intentan',
                'dos',
                'bajo',
                'arriba',
                'encima',
                'usar',
                'uso',
                'usas',
                'usa',
                'usamos',
                'usais',
                'usan',
                'emplear',
                'empleo',
                'empleas',
                'emplean',
                'ampleamos',
                'empleais',
                'valor',
                'muy',
                'era',
                'eras',
                'eramos',
                'eran',
                'modo',
                'bien',
                'cual',
                'cuando',
                'donde',
                'mientras',
                'quien',
                'con',
                'entre',
                'sin',
                'trabajo',
                'trabajar',
                'trabajas',
                'trabaja',
                'trabajamos',
                'trabajais',
                'trabajan',
                'podria',
                'podrias',
                'podriamos',
                'podrian',
                'podriais',
                'yo',
                'aquel',
                'que',
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
            ]

        }, {}], 9: [function (require, module, exports) {
            exports.english = require('./english').english
            exports.spanish = require('./spanish').spanish
            exports.german = require('./german').german

        }, {"./english": 6, "./german": 7, "./spanish": 8}], 10: [function (require, module, exports) {
            module.exports = require('./lib/tkn');
        }, {"./lib/tkn": 11}], 11: [function (require, module, exports) {
            var stopwords = require('stopwords').english; /* Dependency. List of english stop words. */

            var regex = /\w+/g; /* regular expression to tokenise by word while ignoring punctuation. */

            /** 
             * Determines whether a word belongs to the `stopwords` list.
             * `word` - String. Word in which check is to be performed.
             *
             * returns a `Boolean`.
             */
            function isStopWord(word) {
                return stopwords.indexOf(word.toLowerCase()) === -1;
            }

            module.exports = {
                /**
                 * Tokenises a given string, returning an Array of terms.
                 * text - String. Text to be tokenised.
                 * noStopWords - Boolean. Defines whether stop words should be removed or not.
                 *
                 * returns an `Array` of words.
                 */
                tokenise: function (text, noStopWords) {
                    noStopWords = (typeof noStopWords === 'undefined') ? true : noStopWords;  // set default to `true`
                    text = text.toLowerCase().match(regex); // breaking text word-by-word
                    if (noStopWords)
                        text = text.filter(isStopWord); // removing stopwords
                    return text;
                }
            }

        }, {"stopwords": 9}], 12: [function (require, module, exports) {
            /* dependencies */
            var stm = require('stm');

            /* public */
            var wf = {
                /* Simply points to stm library */
                tokenise: stm.tokenise,
                /* Simply points to stm library */
                stem: stm.stem,
                /**
                 * Returns the term frequencies of a document as an Object–e.g. `"I like node" -> { I: 1, like: 1, node: 1}`
                 *
                 * text - String. The text in which frequency is to be calculated.
                 * shouldStem (true) - Boolean. Turns stemming on and off. http://en.wikipedia.org/wiki/Stemming
                 */
                freq: function (text, noStopWords, shouldStem) {
                    var freq = {};
                    var re = /[a-z]|[A-Z]/;
                    try {
                        noStopWords = (typeof noStopWords === 'undefined') ? true : noStopWords;  // set default to `true`
                        text = (typeof shouldStem === 'undefined' || shouldStem) ? this.stem(text, noStopWords) : this.tokenise(text, noStopWords);
                    } catch (e) {
                        return new Error('Please ensure that the text is a valid string.');
                    } finally {
                        if (re.exec(text) === null) {
                            return {};
                        }
                        text.forEach(function (word) {
                            if (freq.hasOwnProperty(word))
                                freq[word] += 1;
                            else
                                freq[word] = 1;
                        });
                        return freq;
                    }
                }
            }

            module.exports = wf;

        }, {"stm": 4}], "word-freq": [function (require, module, exports) {
            module.exports = require('./lib/word-freq');
        }, {"./lib/word-freq": 12}]}, {}, []);
