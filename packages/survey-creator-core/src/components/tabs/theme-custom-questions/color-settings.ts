import { ComponentCollection, Question, QuestionCompositeModel, Serializer } from "survey-core";
import { getLocString } from "../../../editorLocalization";
import { ingectAlpha, parseColor, parseRgbaFromString } from "../../../utils/utils";
function getElementsJSON() {
  return [
    {
      name: "color",
      type: "color",
      titleLocation: "hidden",
    },
    {
      name: "opacity",
      startWithNewLine: false,
      type: "spinedit",
      title: getLocString("theme.opacity"),
      min: 0,
      max: 100,
      unit: "%",
      titleLocation: "left"
    }
  ];
}

ComponentCollection.Instance.add({
  name: "colorsettings",
  showInToolbox: false,
  internal: true,
  elementsJSON: getElementsJSON(),
  onInit() {
    Serializer.addProperties("colorsettings", [{
      name: "choices:itemvalue[]",
    },
    {
      name: "colorTitleLocation:string",
      default: "hidden",
    },
    {
      name: "colorTitle:string",
    }
    ]);
  },
  onLoaded(question) {
    syncPropertiesFromCompositeToColor(question, "colorTitle", question.colorTitle);
    syncPropertiesFromCompositeToColor(question, "colorTitleLocation", question.colorTitleLocation);
    syncPropertiesFromCompositeToColor(question, "choices", question.choices);
  },
  onPropertyChanged(question, propertyName, newValue) {
    syncPropertiesFromCompositeToColor(question, propertyName, newValue);
  },
  valueToQuestion(value) {
    return !!value ? createColor(value) : "";
  },
  valueFromQuestion(value) {
    return typeof value == "string" ? parseColor(value) : value;
  },
  onCreated(question: QuestionCompositeModel) {
    question.contentPanel.questions.forEach(q => q.allowRootStyle = false);
  }
});

export function updateColorSettingsJSON() {
  const config = ComponentCollection.Instance.getCustomQuestionByName("colorsettings");
  config.json.elementsJSON = getElementsJSON();
}

function syncPropertiesFromCompositeToColor(question: Question, propertyName: string, newValue: any) {
  const colorQuestion = question.contentPanel.questions[0];
  if(propertyName == "colorTitleLocation") {
    colorQuestion.titleLocation = newValue;
  }
  if(propertyName == "colorTitle") {
    colorQuestion.title = newValue;
  }
  if(propertyName == "choices") {
    colorQuestion.choices = newValue;
  }
}

export function createColor(value: any): string {
  return ingectAlpha(value.color, value.opacity / 100);
}

