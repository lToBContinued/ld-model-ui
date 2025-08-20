<template>
  <teleport to="body">
    <div v-if="open" class="cm__mask" @click.self="cancel">
      <div class="cm__dialog"
           role="dialog"
           aria-modal="true"
           :aria-label="title"
           @keydown.enter.prevent.stop
           @keydown.escape.prevent.stop="cancel"
      >
<!--        @keydown.enter.prevent.stop-->
<!--        @keydown.escape.prevent.stop="cancel"-->
<!--        这两个保证无论你在页面其他地方按回车/ESC，都不会误触发“确认”。ESC 会走 cancel-->
        <header class="cm__header">
          <strong>{{ title }}</strong>
          <button class="btn ghost" @click="cancel">✕</button>
        </header>
        <div class="cm__body">
          <slot name="message">
            <p v-html="message"></p>
          </slot>
        </div>
        <footer class="cm__footer">
          <button type="button" class="btn" @click="cancel">{{ cancelText }}</button>
          <button type="button" class="btn" :class="{ danger }" @click="confirm">{{ confirmText }}</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from "vue";

const props = withDefaults(defineProps<{
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}>(), {
  title: "删除确认",
  message: "",
  confirmText: "删除",
  cancelText: "取消",
  danger: true,
});

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function cancel() { emit("cancel"); emit("update:open", false); }
function confirm() { emit("confirm"); emit("update:open", false); }
</script>

<style scoped>
.cm__mask{ position:fixed; z-index:2000; inset:0;

 display:grid; place-items:center;

 background:rgb(0 0 0 / 35%); }

.cm__dialog{ width:min(520px, calc(100vw - 32px)); padding:12px;

 background:#fff; border-radius:12px; box-shadow:0 20px 60px rgb(0 0 0 / 20%); }
.cm__header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.cm__body{ padding:6px 2px; color:#333; }
.cm__footer{ display:flex; gap:8px; justify-content:flex-end; margin-top:8px; }

.btn{ cursor:pointer;

 padding:6px 12px;

 background:#f4f6ff; border:none; border-radius:8px; }
.btn.ghost{ background:#f7f7f7; }
.btn.danger{ color:#c0392b; background:#ffecec; }
</style>
