/* ================================================================
   Markdown 增强：目录 [toc] / 标题锚点 / 脚注 / 高亮 / 上下标 / Emoji / 图片尺寸
   注入到 marked 渲染入口 mn 中（Post 页与后台编辑器预览同时生效）
   ================================================================ */
var __mdEmoji={smile:"😄",smiley:"😃",grinning:"😀",grin:"😁",laughing:"😆",satisfied:"😆",joy:"😂",rofl:"🤣",wink:"😉",blush:"😊",innocent:"😇",sweat_smile:"😅",relaxed:"☺️",heart_eyes:"😍",kissing:"😗",kissing_heart:"😘",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",yum:"😋",stuck_out_tongue:"😛",stuck_out_tongue_winking_eye:"😜",stuck_out_tongue_closed_eyes:"🤪",sweat:"😓",cold_sweat:"😰",disappointed:"😞",worried:"😟",confused:"😕",slightly_frowning_face:"🙁",frowning:"😦",persevere:"😣",tired_face:"😫",weary:"😩",triumph:"😤",angry:"😠",rage:"😡",pensive:"😔",unamused:"😒",expressionless:"😑",neutral_face:"😐",flushed:"😳",dizzy_face:"😵",astonished:"😲",scream:"😱",fearful:"😨",hushed:"😯",sleeping:"😴",zzz:"💤",sleepy:"😪",mask:"😷",face_with_thermometer:"🤒",nauseated_face:"🤢",smirk:"😏",no_mouth:"😶",thinking:"🤔",raised_eyebrow:"🤨",face_with_monocle:"🧐",sunglasses:"😎",nerd_face:"🤓",open_mouth:"😮",grimacing:"😬",alien:"👽",robot:"🤖",ghost:"👻",poop:"💩",hankey:"💩",clown_face:"🤡",cowboy_hat_face:"🤠",pleading_face:"🥺",hugging:"🤗",handshake:"🤝",thumbsup:"👍","+1":"👍",thumbsdown:"👎","-1":"👎",ok_hand:"👌",punch:"👊",fist:"✊",raised_hand:"✋",wave:"👋",hand:"✋",v:"✌️",victory:"✌️",muscle:"💪",point_up:"☝️",point_down:"👇",point_left:"👈",point_right:"👉",middle_finger:"🖕",writing_hand:"✍️",clap:"👏",open_hands:"👐",raised_hands:"🙌",pray:"🙏",folded_hands:"🙏",nail_care:"💅",ear:"👂",eyes:"👀",eye:"👁️",nose:"👃",lips:"👄",tongue:"👅",brain:"🧠",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",two_hearts:"💕",cupid:"💘",gift_heart:"💝",star:"⭐",star2:"🌟",sparkles:"✨",sparkle:"❇️",boom:"💥",collision:"💥",fire:"🔥",dash:"💨",sweat_drops:"💦",droplet:"💧",bubbles:"🫧","100":"💯",musical_note:"🎵",notes:"🎶",art:"🎨",trophy:"🏆",medal:"🏅",sports_medal:"🏅",rocket:"🚀",airplane:"✈️",helicopter:"🚁",car:"🚗",red_car:"🚗",taxi:"🚕",bus:"🚌",train:"🚆",metro:"🚇",bicycle:"🚲",motorcycle:"🏍️",ship:"🚢",anchor:"⚓",sunny:"☀️",sun_with_face:"🌞",moon:"🌙",new_moon:"🌑",full_moon:"🌕",star_struck:"🤩",cloud:"☁️",rain:"🌧️",snowflake:"❄️",snowman:"⛄",zap:"⚡",umbrella:"☔",tornado:"🌪️",ocean:"🌊",cat:"🐱",dog:"🐶",panda_face:"🐼",fox_face:"🦊",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",frog:"🐸",monkey:"🐵",monkey_face:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",eagle:"🦅",owl:"🦉",fish:"🐟",dolphin:"🐬",whale:"🐳",bee:"🐝",butterfly:"🦋",bug:"🐛",ant:"🐜",snail:"🐌",turtle:"🐢",rabbit:"🐰",mouse:"🐭",hamster:"🐹",bear:"🐻",koala:"🐨",paw_prints:"🐾",cherry_blossom:"🌸",rose:"🌹",tulip:"🌷",sunflower:"🌻",bouquet:"💐",herb:"🌿",four_leaf_clover:"🍀",mushroom:"🍄",cactus:"🌵",palm_tree:"🌴",evergreen_tree:"🌲",deciduous_tree:"🌳",earth_asia:"🌏",globe_with_meridians:"🌐",fireworks:"🎆",sparkler:"🎇",balloon:"🎈",confetti_ball:"🎊",gift:"🎁",birthday:"🎂",cake:"🍰",cookie:"🍪",chocolate_bar:"🍫",pizza:"🍕",hamburger:"🍔",fries:"🍟",hotdog:"🌭",taco:"🌮",sushi:"🍣",ramen:"🍜",coffee:"☕",tea:"🍵",beer:"🍺",beers:"🍻",wine_glass:"🍷",cocktail:"🍸",tropical_drink:"🍹",apple:"🍎",green_apple:"🍏",banana:"🍌",grape:"🍇",watermelon:"🍉",lemon:"🍋",cherries:"🍒",strawberry:"🍓",peach:"🍑",eggplant:"🍆",tomato:"🍅",corn:"🌽",bread:"🍞",cheese:"🧀",egg:"🥚",doughnut:"🍩",icecream:"🍦",shaved_ice:"🍧",memo:"📝",pencil:"📝",book:"📖",books:"📚",notebook:"📓",newspaper:"📰",computer:"💻",laptop:"💻",iphone:"📱",phone:"📞",telephone:"📞",email:"📧",envelope:"✉️",inbox_tray:"📥",outbox_tray:"📤",calendar:"📅",alarm_clock:"⏰",hourglass:"⌛",watch:"⌚",bulb:"💡",flashlight:"🔦",moneybag:"💰",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",credit_card:"💳",gem:"💎",ring:"💍",crown:"👑",tophat:"🎩",graduation_cap:"🎓",school:"🏫",hospital:"🏥",bank:"🏦",house:"🏠",office:"🏢",factory:"🏭",church:"⛪",mosque:"🕌",hotel:"🏨",shop:"🏪",key:"🔑",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",hammer:"🔨",wrench:"🔧",gear:"⚙️",scissors:"✂️",link:"🔗",paperclip:"📎",pushpin:"📌",round_pushpin:"📍",magnifying_glass_tilted_left:"🔍",mag:"🔍",telescope:"🔭",microscope:"🔬",syringe:"💉",pill:"💊",stethoscope:"🩺",cigarette:"🚬",bath:"🛁",toilet:"🚽",shower:"🚿",restroom:"🚻",mens:"🚹",womens:"🚺",warning:"⚠️",no_entry:"⛔",no_entry_sign:"🚫",stop_sign:"🛑",construction:"🚧",red_circle:"🔴",large_blue_circle:"🔵",white_circle:"⚪",black_circle:"⚫",red_square:"🟥",blue_square:"🟦",white_square:"⬜",black_square:"⬛",orange_square:"🟧",green_square:"🟩",purple_square:"🟪",yellow_square:"🟨",brown_square:"🟫",checkered_flag:"🏁",triangular_flag_on_post:"🚩",copyright:"©️",registered:"®️",tm:"™️",question:"❓",grey_question:"❔",exclamation:"❗",grey_exclamation:"❕",bangbang:"‼️",interrobang:"⁉️",heavy_check_mark:"✔️",heavy_multiplication_x:"✖️",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",arrows_clockwise:"🔃",arrows_counterclockwise:"🔄",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",hourglass_flowing_sand:"⏳",m:"Ⓜ️",o:"⭕",x:"❌",heavy_exclamation_mark:"❗"};
var __mdTocItems=[],__mdIdCounts={},__mdFootnotes={},__mdFootnoteOrder=[],__mdSkipCollect=false,__mdDepth=0;
function __mdEscHtml(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function __mdSlug(s){var t=String(s==null?"":s).replace(/<[^>]*>/g,"").trim().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\u4e00-\u9fff-]/g,"").replace(/-+/g,"-").replace(/^-+|-+$/g,"");return t.slice(0,64)||"section"}
function __mdIdFor(text){var base=__mdSlug(text),n=(__mdIdCounts[base]||0)+1;__mdIdCounts[base]=n;return n===1?base:base+"-"+n}
function __mdPlain(tokens){var out="";if(!tokens)return out;for(var i=0;i<tokens.length;i++){var tk=tokens[i];if(tk.tokens)out+=__mdPlain(tk.tokens);else if(tk.text!=null)out+=tk.text;else if(tk.raw!=null)out+=tk.raw;}return out}
function __mdFnKey(key){var k=String(key==null?"":key).replace(/[^\w\u4e00-\u9fff-]/g,"");return k||"n"}
/* 保护代码围栏与行内代码，防止变换误伤代码内容 */
function __mdProtect(src){
  var stash=[],out="",i=0,len=src.length,fenceChar="",fenceLen=0,fenceBlock="";
  while(i<len){
    var ch=src[i];
    if(fenceChar){
      var nl=src.indexOf("\n",i);
      if(nl===-1){fenceBlock+=src.slice(i);i=len;break}
      var line=src.slice(i,nl),lm=/^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line);
      if(lm&&lm[1][0]===fenceChar&&lm[1].length>=fenceLen){
        fenceBlock+=line;out+="\x00F"+(stash.push(fenceBlock)-1)+"\x00";fenceBlock="";fenceChar="";i=nl;continue;
      }
      fenceBlock+=line+"\n";i=nl+1;continue;
    }
    if(i===0||src[i-1]==="\n"){
      var nl2=src.indexOf("\n",i);if(nl2===-1)nl2=len;
      var fl=src.slice(i,nl2),lm2=/^ {0,3}(`{3,}|~{3,})([^\n]*)$/.exec(fl);
      if(lm2){fenceChar=lm2[1][0];fenceLen=lm2[1].length;fenceBlock=lm2[0];i+=lm2[0].length;continue}
    }
    if(ch==="`"){
      var run=1;while(src[i+run]==="`")run++;
      var j=i+run,closed=false;
      while(j<len){
        if(src[j]==="`"){var r2=0;while(src[j+r2]==="`")r2++;if(r2>=run){var code=src.slice(i,j+r2);out+="\x00C"+(stash.push(code)-1)+"\x00";i=j+r2;closed=true;break}j+=r2}
        else j++;
      }
      if(closed)continue;
      out+=src.slice(i);i=len;continue;
    }
    out+=ch;i++;
  }
  if(fenceBlock){out+="\x00F"+(stash.push(fenceBlock)-1)+"\x00"}
  return{text:out,stash:stash};
}
/* 还原占位符 */
function __mdUnstash(text,stash){
  if(text.indexOf("\x00")===-1)return text;
  text=text.replace(/\x00C(\d+)\x00/g,function(m,i){return stash[+i]!==undefined?stash[+i]:m});
  text=text.replace(/\x00F(\d+)\x00/g,function(m,i){return stash[+i]!==undefined?stash[+i]:m});
  return text;
}
/* 预处理：目录槽 / 脚注 / 高亮 / 上下标 / Emoji / 图片尺寸 */
function __mdPre(src){
  src=String(src).replace(/\r\n?/g,"\n");
  var res=__mdProtect(src),text=res.text,stash=res.stash;
  /* [toc] → 目录槽（注意只用 [ \t]*，不能吃掉换行） */
  text=text.replace(/^ {0,3}\[toc\][ \t]*$/gim,'<div class="md-toc-slot"></div>');
  /* 收集脚注定义并移除（先还原占位符再存；支持缩进续行） */
  text=text.replace(/^\[(\^[^\]]+)\]:\s*([\s\S]*?)(?=\n[ \t]*(?:\n(?![ \t])[^ \t\n]|$(?!\n))|^\s*\[\^[^\]]+\]:|$(?!\n))/gm,function(m,id,body){
    var key=__mdFnKey(id);
    if(__mdFootnotes[key]===undefined){__mdFootnotes[key]=__mdUnstash(body.trim(),stash);__mdFootnoteOrder.push(key)}
    return"";
  });
  /* 高亮 ==x== */
  text=text.replace(/(^|[^=])==([^=\n]+?)==(?![=\w])/g,'$1<mark>$2</mark>');
  /* 下标 ~x~（排除 ~~ 删除线） */
  text=text.replace(/(^|[^~])~([^~\s][^~\n]*?)~(?![~])/g,'$1<sub>$2</sub>');
  /* 上标 ^x^（排除 [ ] 防与脚注引用桥接，排除 ~~ 删除线冲突） */
  text=text.replace(/(^|[^\^])\^([^\[\]\^\s][^\[\]\^\n]*?)\^(?!\^)/g,'$1<sup>$2</sup>');
  /* Emoji */
  text=text.replace(/:([a-zA-Z0-9_+-]+):/g,function(m,n){return __mdEmoji[n]!==undefined?__mdEmoji[n]:m});
  /* 图片尺寸 =WxH / =Wx / =xH（要求 = 前有空白，避免误伤 URL） */
  text=text.replace(/!\[([^\]]*)\]\(([^)\s]+)\s+=(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?%?)\)/g,'![$1]($2 "__MDIMG__$3x$4__")');
  text=text.replace(/!\[([^\]]*)\]\(([^)\s]+)\s+=(\d+(?:\.\d+)?)x\)/g,'![$1]($2 "__MDIMG__$3x__")');
  text=text.replace(/!\[([^\]]*)\]\(([^)\s]+)\s+=x(\d+(?:\.\d+)?%?)\)/g,'![$1]($2 "__MDIMG__x$3__")');
  /* 脚注引用（最后替换，避免被上方变换破坏） */
  text=text.replace(/\[\^([^\]]+)\]/g,function(m,id){
    var key=__mdFnKey(id);
    if(__mdFootnotes[key]!==undefined){var n=__mdFootnoteOrder.indexOf(key)+1;return '<sup class="footnote-ref"><a href="#fn-'+key+'" id="fnref-'+key+'">['+n+']</a></sup>'}
    return m;
  });
  return __mdUnstash(text,stash);
}
/* 构建目录 HTML（树结构，保证嵌套正确） */
function __mdBuildToc(){
  var items=__mdTocItems;
  if(!items.length)return"";
  var root={children:[]},stack=[root];
  for(var i=0;i<items.length;i++){
    var it=items[i],d=Math.min(Math.max(it.depth,1),6);
    while(stack.length>1&&stack[stack.length-1].depth>=d)stack.pop();
    var node={depth:d,id:it.id,text:it.text,children:[]};
    stack[stack.length-1].children.push(node);
    stack.push(node);
  }
  function render(nodes){
    var h="<ul>";
    for(var i=0;i<nodes.length;i++){
      var n=nodes[i];
      h+='<li class="md-toc-l'+n.depth+'"><a href="#'+n.id+'">'+__mdEscHtml(n.text)+"</a>";
      if(n.children.length)h+=render(n.children);
      h+="</li>";
    }
    return h+"</ul>";
  }
  return '<nav class="md-toc" role="navigation" aria-label="文章目录">'+render(root.children)+"</nav>";
}
function __mdFillToc(t){if(t.indexOf("md-toc-slot")===-1)return t;var toc=__mdBuildToc();return t.replace(/<div class="md-toc-slot"><\/div>/g,function(){return toc})}
/* 脚注定义渲染（隔离状态，防止污染主文档收集） */
function __mdRenderFoot(text){
  if(!text)return"";
  var _fns=__mdFootnotes,_ord=__mdFootnoteOrder,_toc=__mdTocItems,_cnt=__mdIdCounts,_sc=__mdSkipCollect;
  __mdFootnotes={};__mdFootnoteOrder=[];__mdTocItems=[];__mdIdCounts={};__mdSkipCollect=true;
  var out;
  __mdDepth++;
  try{out=__mdDepth>3?'<p>'+__mdEscHtml(text)+'</p>':mn(text)}
  finally{__mdDepth--}
  __mdFootnotes=_fns;__mdFootnoteOrder=_ord;__mdTocItems=_toc;__mdIdCounts=_cnt;__mdSkipCollect=_sc;
  return out;
}
function __mdAppendFootnotes(t){
  if(!__mdFootnoteOrder.length)return t;
  var html='<section class="footnotes"><ol>';
  for(var i=0;i<__mdFootnoteOrder.length;i++){
    var id=__mdFootnoteOrder[i];
    html+='<li id="fn-'+id+'">'+__mdRenderFoot(__mdFootnotes[id])+'<a href="#fnref-'+id+'" class="footnote-backref" aria-label="返回正文">↩</a></li>';
  }
  return t+html+"</ol></section>";
}
/* 注册 marked 扩展：标题 id + 锚点、图片尺寸、标题收集 */
z.use({
  renderer:{
    heading:function(tok){
      var id=tok._mdId||__mdSlug(__mdPlain(tok.tokens)),d=Math.min(Math.max(tok.depth,1),6);
      return '<h'+d+' id="'+id+'">'+this.parser.parseInline(tok.tokens)+'<a class="md-anchor" href="#'+id+'" aria-hidden="true">¶</a></h'+d+'>';
    },
    image:function(tok){
      var n=tok.tokens?this.parser.parseInline(tok.tokens,this.parser.textRenderer):tok.text||"";
      var e=String(tok.href||"").replace(/"/g,"&quot;"),title=tok.title?String(tok.title).trim():"",attrs="",t="";
      var m=/^__MDIMG__(.*)__$/.exec(title);
      if(m){
        var d=m[1],m1=/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?%?)$/.exec(d),m2=/^(\d+(?:\.\d+)?)x$/.exec(d),m3=/^x(\d+(?:\.\d+)?%?)$/.exec(d);
        if(m1)attrs=' width="'+m1[1]+'" height="'+m1[2]+'"';
        else if(m2)attrs=' width="'+m2[1]+'"';
        else if(m3)attrs=' height="'+m3[1]+'"';
        else t=title;
      }else t=title;
      return '<img src="'+e+'" alt="'+String(n).replace(/"/g,"&quot;")+'"'+(t?' title="'+t+'"':"")+attrs+">";
    }
  },
  walkTokens:function(tok){
    if(tok.type==="heading"&&!__mdSkipCollect){
      var txt=__mdPlain(tok.tokens),id=__mdIdFor(txt);
      tok._mdId=id;
      __mdTocItems.push({depth:tok.depth,id:id,text:txt});
    }
  }
});
/* 重写渲染入口 */
function mn(e){
  if(!e||!e.trim())return"";
  if(__mdDepth===0){__mdTocItems=[];__mdIdCounts={};__mdFootnotes={};__mdFootnoteOrder=[]}
  var t=z.parse(__mdPre(e),{async:!1});
  t=__mdFillToc(t);
  t=__mdAppendFootnotes(t);
  return pn.sanitize(t);
}
