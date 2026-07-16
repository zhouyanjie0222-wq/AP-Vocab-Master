import fs from 'fs';
let code = fs.readFileSync('index.html', 'utf8');

const deleted = `                { term: "Collectivism", cn: "集体主义", en_def: "Priority to group goals and identity.", cn_def: "更看重群体目标和身份。", hint: "强调和谐、忠诚、集体荣誉。" },
                { term: "Multiculturalism", cn: "多元文化主义", en_def: "Presence of several distinct cultural groups within a society.", cn_def: "一个社会中存在多种不同文化群体的现象。", hint: "承认并尊重差异。" },
                { term: "Group polarization", cn: "群体极化", en_def: "Strengthening of a group's prevailing inclinations through discussion.", cn_def: "经过讨论后，群体原有的倾向变得更加极端。", hint: "一群本来就讨厌数学的人聚在一起，讨论后变得极其仇视数学。" },
                { term: "Groupthink", cn: "群体思维", en_def: "Mode of thinking that occurs when desire for harmony overrides realistic appraisal of alternatives.", cn_def: "为了维护和谐而牺牲现实评估决策的思维模式。", hint: "大家都不敢提不同意见，最后做出了极其离谱的决定（比如挑战者号事故）。" },
                { term: "Diffusion of responsibility", cn: "责任分散", en_def: "Feeling less responsible when others are present.", cn_def: "由于他人在场而感到个人责任减轻的现象。", hint: "‘这么多人在这，我不报案肯定有人报’。" },
                { term: "Social loafing", cn: "社会懈怠", en_def: "Exerting less effort when performing in a group.", cn_def: "在团队任务中比独自一人时出力更少的倾向。", hint: "‘三个和尚没水喝’。出工不出力。" },
                { term: "Deindividuation", cn: "去个性化", en_def: "Loss of self-awareness and self-restraint in group situations that foster arousal and anonymity.", cn_def: "在群体中感到由于匿名和唤醒感导致的自我约束力下降。", hint: "‘蒙面侠’效应。在暴乱中或网络喷子由于没人认得，表现出平时不敢做的残暴行为。" },
                { term: "Social facilitation", cn: "社会助长", en_def: "Improved performance on simple tasks in the presence of others.", cn_def: "由于他人在场导致简单任务表现变好。", hint: "‘人来疯’。如果是困难任务，反而可能变差（社会抑制）。" },
                { term: "False consensus effect", cn: "虚假一致性效应", en_def: "Overestimating the extent to which others share our beliefs.", cn_def: "高估别人与我们想法一致的程度。", hint: "‘我喜欢吃香菜，肯定大家都喜欢吃’。" },
                { term: "Superordinate goals", cn: "公共目标/超段目标", en_def: "Shared goals that override differences among people and require their cooperation.", cn_def: "需要合作才能完成并能化解矛盾的共同目标。", hint: "谢里夫的强盗洞穴实验：通过一起修理坏了的水车，敌对的两组男孩和好了。" },
                { term: "Social trap", cn: "社会陷阱", en_def: "Situation where conflicting parties pursue self-interest and become caught in mutually destructive behavior.", cn_def: "由于追求个人利益而导致双方共输的局面。", hint: "公地悲剧。大家都多养牛，最后草地全毁了，大家都饿死。" },
                { term: "I/O psychologist", cn: "工业/组织心理学家", en_def: "Application of psychological concepts to optimize human behavior in workplaces.", cn_def: "研究工作场所中人类行为的心理学家。", hint: "帮公司招人、提高效率、改善员工心态。" },
                { term: "Altruism", cn: "利他主义", en_def: "Unselfish regard for the welfare of others.", cn_def: "不计个人回报地关心他人福利的行为。", hint: "真正的无私奉献。" },
                { term: "Social reciprocity norm", cn: "互惠规范", en_def: "Expectation that people will help those who have helped them.", cn_def: "‘礼尚往来’。你应该帮助那个曾经帮过你的人。" },
                { term: "Social responsibility norm", cn: "社会责任规范", en_def: "Expectation that people will help those in need, even without future benefits.", cn_def: "对于弱者或需要帮助的人负有的责任感。", hint: "帮助老人过马路，并不期待回报。" },
                { term: "Bystander effect", cn: "旁观者效应", en_def: "Lower likelihood of helping when more people are present.", cn_def: "旁观者越多，个人施救可能性越低的现象。", hint: "基蒂·吉诺维斯惨案。责任分散的具体体现。" },

                // Topic 4.4 Psychodynamic and Humanistic Theories of Personality
                { term: "Psychodynamic perspective-personality", cn: "心理动力学视角", en_def: "Focuses on unconscious mind and childhood childhood experiences.", cn_def: "关注潜意识冲突和早期童年经历对人格的影响。", hint: "弗洛伊德是祖师爷。" },`;

let lines = code.split('\n');
let newLines = [];
let i = 0;
let inBadBlock = false;
while (i < lines.length) {
    if (lines[i].includes('{                                    <AnimatePresence>')) {
        inBadBlock = true;
    }
    
    if (inBadBlock) {
        if (lines[i].includes('<AnimatePresence mode="wait">dhood')) {
            inBadBlock = false;
            newLines.push(...deleted.split('\n'));
        }
    } else {
        newLines.push(lines[i]);
    }
    i++;
}

fs.writeFileSync('index.html', newLines.join('\n'));
