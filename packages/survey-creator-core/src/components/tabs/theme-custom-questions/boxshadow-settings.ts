import { getLocString } from "../../../editorLocalization";
import { ComponentCollection, QuestionCustomModel, QuestionPanelDynamicModel } from "survey-core";

function getQuestionJSON() {
  return {
    "type": "paneldynamic",
    "minPanelCount": 1,
    "panelAddText": getLocString("theme.boxShadowAddRule"),
    "templateElements": [
      {
        "type": "spinedit",
        "name": "x",
        "unit": "px",
        "title": getLocString("theme.boxShadowX"),
        "titleLocation": "left",
      },
      {
        "type": "spinedit",
        "name": "y",
        "unit": "px",
        "startWithNewLine": false,
        "title": getLocString("theme.boxShadowY"),
        "titleLocation": "left"
      },
      {
        "type": "spinedit",
        "name": "blur",
        "unit": "px",
        "title": getLocString("theme.boxShadowBlur"),
        "min": 0,
        "titleLocation": "left"
      },
      {
        "type": "spinedit",
        "name": "spread",
        "unit": "px",
        "min": 0,
        "startWithNewLine": false,
        "title": getLocString("theme.boxShadowSpread"),
        "titleLocation": "left"
      },
      {
        "type": "colorsettings",
        "name": "color",
        "titleLocation": "hidden"
      },
      {
        "type": "buttongroup",
        "name": "isInset",
        "titleLocation": "hidden",
        "choices": [{ text: getLocString("theme.boxShadowDrop"), value: false }, { text: getLocString("theme.boxShadowInner"), value: true }]
      }
    ]
  };
}

ComponentCollection.Instance.add({
  name: "boxshadowsettings",
  showInToolbox: false,
  internal: true,
  questionJSON: getQuestionJSON(),
  onCreated(question: QuestionCustomModel) {
    question.valueFromDataCallback = (value: string | Array<Object>): Array<Object> => typeof value == "string" ? parseBoxShadow(value) : value;
    question.valueToDataCallback = (value: string | Array<Object>): string => !!value ? (typeof value == "string" ? value : createBoxShadow(Array.isArray(value) ? value : [value])) : "";
    (<QuestionPanelDynamicModel>question.contentQuestion).panels.forEach(p => p.questions.forEach(q => q.allowRootStyle = false));
  },
});

export function updateBoxShadowSettingsJSON() {
  const config = ComponentCollection.Instance.getCustomQuestionByName("boxshadowsettings");
  config.json.questionJSON = getQuestionJSON();
}

export function createBoxShadow(value: Array<any>): string {
  return value.map((val => `${val.isInset == true ? "inset " : ""}${val.x ?? 0}px ${val.y ?? 0}px ${val.blur ?? 0}px ${val.spread ?? 0}px ${val.color ?? "#000000"}`
  )).join(", ");
}

export function parseBoxShadow(value: string): Array<Object> {
  return value.split(/,(?![^(]*\))/).map(value => {
    const color = value.match(/#[a-zA-Z0-9]+|rgba?\(.*?\)/);
    const isInset = value.indexOf("inset") > -1;
    const res: Object = {};
    if(isInset) {
      value = value.replace("inset", "");
    }
    if(!!color) {
      res["color"] = color[0];
    }
    const values = value.replace(/\s+/g, " ").replace(/^\s|\s$/g, "").split(" ");
    res["x"] = parseInt(values[0]) || 0;
    res["y"] = parseInt(values[1]) || 0;
    res["blur"] = parseInt(values[2]) || 0;
    res["spread"] = parseInt(values[3]) || 0;
    res["isInset"] = isInset;
    return res;
  });
}