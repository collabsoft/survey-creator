<template>
  <div
    :class="model.getRootCss()"
    @keydown="model.tryToZoom(undefined, $event)"
    @mouseover="activateZoom()"
    @mouseout="deactivateZoom()"
  >
    <div
      v-if="model.hasFrame"
      class="svd-simulator-wrapper"
      id="svd-simulator-wrapper"
      :style="{
        width: simulatorFrame.frameWidth + 'px',
        height: simulatorFrame.frameHeight + 'px',
      }"
    >
      <div
        class="svd-simulator-frame"
        :style="{
          width: simulatorFrame.landscapedFrameWidth + 'px',
          height: simulatorFrame.landscapedFrameHeight + 'px',
        }"
        :class="simulatorFrame.cssClass"
      ></div>
      <div
        class="svd-simulator"
        :style="{
          width: simulatorFrame.deviceWidth + 'px',
          height: simulatorFrame.deviceHeight + 'px',
          transform:
            'scale(' + simulatorFrame.scale + ') translate(-50%, -50%)',
        }"
      >
        <div class="svd-simulator-content">
          <survey-widget :model="model.survey"></survey-widget>
        </div>
      </div>
    </div>
    <div v-if="!model.hasFrame" class="svd-simulator-content">
      <survey-widget :model="model.survey"></survey-widget>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { SurveySimulatorModel } from "survey-creator-core";
import { useBase } from "survey-vue3-ui";
import { computed } from "vue";
const props = defineProps<{ model: SurveySimulatorModel }>();
useBase(() => props.model);
const simulatorFrame = computed(() => props.model.simulatorFrame);
const activateZoom = () => {
  if (props.model.device !== "desktop") {
    props.model.activateZoom();
  }
};
const deactivateZoom = () => {
  if (props.model.device !== "desktop") {
    props.model.deactivateZoom();
  }
};
</script>
