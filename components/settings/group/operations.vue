<script lang="ts" setup>
import IconDownload from '~icons/ep/download'
import IconList from '~icons/ep/list'
import IconExcel from '~icons/vscode-icons/file-type-excel'

const currentGroup = useConfigStore().group
const names = defineModel<RollCallOption[]>('names', { required: true })

const limited = computed(() => useGroupStore().nameList.length >= MAX_GROUP_COUNT)

const showBatchInput = ref(false)

const showImportExcel = ref(false)
function handleImportDone(items: string[]) {
  names.value.push(...items)
}

const exporting = ref(false)
async function handleExport() {
  exporting.value = true
  await exportGroupToText(currentGroup).catch((e) => {
    console.error(e)
    alertError(e)
  })
  exporting.value = false
}
</script>

<template>
  <NSpace>
    <NButton :disabled="limited" @click="showBatchInput = true">
      批量输入
      <template #icon>
        <NIcon :size="20">
          <IconList />
        </NIcon>
      </template>
    </NButton>
    <NButton :disabled="limited" @click="showImportExcel = true">
      导入 Excel
      <template #icon>
        <NIcon :size="20">
          <IconExcel />
        </NIcon>
      </template>
    </NButton>
    <NButton :loading="exporting" @click="handleExport">
      导出
      <template #icon>
        <NIcon :size="20">
          <IconDownload />
        </NIcon>
      </template>
    </NButton>
  </NSpace>
  <NP v-if="limited">
    名单数量已达上限，无法导入新名单。
  </NP>

  <SettingsGroupBatchInput
    v-model:show="showBatchInput"
    @done="handleImportDone"
  />
  <SettingsGroupImportExcel
    v-model:show="showImportExcel"
    @done="handleImportDone"
  />
</template>
