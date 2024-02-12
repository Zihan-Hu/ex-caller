<script lang="ts" setup>
import { checkUpdate, installUpdate, onUpdaterEvent } from '@tauri-apps/api/updater'
import type { UpdateManifest, UpdateStatus } from '@tauri-apps/api/updater'

const show = ref(false)
const updating = ref(false)
const status = ref<UpdateStatus>('UPTODATE')

const manifest = ref<UpdateManifest | undefined>()
const error = ref<string | undefined>()
const percent = ref(0)
watch(status, (v) => {
  switch (v) {
    case 'PENDING':
      percent.value = Math.floor(Math.random() * 100)
      break
    case 'DONE':
    case 'UPTODATE':
      percent.value = 100
  }
})

checkUpdate().then((result) => {
  console.log(result)
  show.value = result.shouldUpdate
  manifest.value = result.manifest
})
onUpdaterEvent((ev) => {
  console.log(ev)
  status.value = ev.status
  if (ev.error) {
    console.error(ev.error)
    error.value = ev.error
  }
})

function handleUpdate() {
  installUpdate()
  updating.value = true
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="`发现新版本 v${manifest?.version}`"
    positive-text="更新"
    negative-text="取消"
    @positive-click="handleUpdate"
  >
    <NEllipsis class="update-info" :line-clamp="5" expand-trigger="click" :tooltip="false">
      <div v-html="manifest?.body" />
    </NEllipsis>
  </NModal>

  <NModal
    v-model:show="updating"
    class="text-center"
    preset="dialog"
    title="正在下载更新包"
    :closable="!!error"
    :close-on-esc="false"
    :mask-closable="false"
  >
    <NSpace vertical>
      <NProgress
        type="circle"
        :status="status === 'ERROR' ? 'error' : status === 'PENDING' ? 'default' : 'success'"
        :percentage="percent"
        :processing="status === 'PENDING'"
      />
      <pre v-if="error" class="w-full whitespace-pre-wrap">{{ error }}</pre>
    </NSpace>
  </NModal>
</template>

<style lang="postcss">
.update-info {
  h3 {
    @apply font-bold;
    line-height: 18px;

    ~ h3 {
      @apply mt-2;
    }
  }

  ul {
    list-style: disc inside;
    padding-left: 2em;
  }

  a {
    color: var(--n-text-color);
    @apply underline;
  }
}
</style>
