<template>
  <div class="svc-carry-forward-panel">
    <span>{{ model.text }}{{ " " }}</span>
    <span class="svc-carry-forward-panel__link">
      <svc-action-button
        :text="model.question.name"
        :click="model.onClick.bind(model)"
      >
      </svc-action-button>
    </span>
  </div>
</template>
<script lang="ts" setup>
import type { QuestionCarryForwardParams } from "survey-creator-core";
defineProps<{ model: QuestionCarryForwardParams }>();
</script>
