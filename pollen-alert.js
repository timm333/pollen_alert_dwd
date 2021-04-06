// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;

/**************************************************************
Version 1.0
History:
Version 1.0 - First Version
Credits: 
Timm Haug timm333@github
https://github.com/timm333/
**************************************************************/

const todayFont = Font.boldSystemFont(12);
const normalFont = Font.mediumSystemFont(12);
const titleFont = Font.boldSystemFont(18);

const textColor = Color.white()



// Access DWD-Data for Pollen in Germany
async function getData(){
    let region_id = args.widgetParameter;
    if (!region_id) {
        region_id = 121;
    }
    const url = 'https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json'
    let request = new Request(url)
    let response = await request.loadJSON()
    let treesData = []
    for (item of response.content) {
        if (item.partregion_id == region_id || item.region_id == region_id) {
            console.log(item.Pollen)
            for (var i in item.Pollen) {
              console.log(i)
              treesData.push({tree: i,
                today: item.Pollen[i].today,
                tomorrow: item.Pollen[i].tomorrow,
                after_tomorrow: item.Pollen[i].dayafter_to})
              
          }
        }
    }
    return treesData
}

async function createWidget(treesData) {
    const backGradient = new LinearGradient();
    backGradient.colors = [new Color("#020202"), new Color("#030303")];
    backGradient.locations = [0, 1];
    let wide = config.widgetFamily !== "small";
    let widget = new ListWidget();
    widget.backgroundGradient = backGradient;
    if (! wide) {
      widget.setPadding(8, 5, 3, 3);
    }
    let stack = widget.addStack();
    stack.layoutVertically();
  
    let titleLine = stack.addStack();
    let title = titleLine.addText('Pollen');
    title.font = titleFont;
    title.textColor = textColor;
    titleLine.addSpacer();
  
    stack.addSpacer(10);
    for (const n of treesData) {
      createLine(stack, n, wide);
    }
    return widget;
  }
  function textToSignal(data) {
    if (data == '0') {
      return '🟢'
    } else if (data == '0-1') {
      return '🟡'
    } else if (data == '1') {
      return '🟡'
    } else if (data == '1-2') {
      return '🟠'
    } else if (data == '2') {
      return '🟠'
    } else if (data == '2-3') {
      return '🔴'
    } else if (data == '3') {
      return '☠️'
    } else {
      return '-'
    }
  }
  function createLine(parent, data, wide) {
    let line = parent.addStack();
    
    let treeSub = line.addStack();
    let tree = treeSub.addText(data.tree);
    tree.font = normalFont;
    tree.textColor = textColor;
    treeSub.addSpacer();
    
    let todaySub = line.addStack();
    let todayText = textToSignal(data.today);
    let today = todaySub.addText(todayText);
    today.font = todayFont;
    if (wide) {
        todaySub.addSpacer();
    } else {
        todaySub.addSpacer(2);
    }
    if (wide) {
      let tomorrowSub = line.addStack();
      let tomorrowText = textToSignal(data.tomorrow);
      let tomorrow = tomorrowSub.addText(tomorrowText);
      tomorrow.font = todayFont;
      tomorrowSub.addSpacer();

      let aftertomorrowSub = line.addStack();
      let aftertomorrowText = textToSignal(data.after_tomorrow);
      let aftertomorrow = aftertomorrowSub.addText(aftertomorrowText);
      aftertomorrow.font = todayFont;
      aftertomorrowSub.addSpacer();
    }
    return line;
  }

let treesData = await getData()
let widget = await createWidget(treesData)

Script.setWidget(widget)
Script.complete()
