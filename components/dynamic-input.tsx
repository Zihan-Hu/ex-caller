import { NDynamicInput } from 'naive-ui'

export default defineComponent({
  name: 'DynamicInput',
  inheritAttrs: false,
  setup(_, { attrs, emit, slots }) {
    const propsValue = toRef(attrs, 'value') as Ref<unknown[] | undefined>
    const displayValue: Ref<unknown[]> = ref([])
    const syncing = ref(false)
    const syncId = ref(0)

    watchImmediate(propsValue, async (v) => {
      syncing.value = true
      const id = ++syncId.value
      const origin = toRaw(v) ?? []
      const legacy = displayValue.value
      if (origin.length < legacy.length) // 选项变少
        displayValue.value.splice(origin.length)
      for (let i = 0; i < origin.length; ++i) {
        if (origin[i] !== legacy[i]) { // 简单增量更新
          displayValue.value[i] = v?.[i]
          await nextFrame()
        }
        if (id !== syncId.value) // 有新的更新
          return
      }
    })

    return () => (
      <NDynamicInput
        {...attrs}
        v-model:value={displayValue.value}
        v-slots={slots}
        onUpdateValue={
          v => emit('update:value', [...v])
          // v 引用的是 store 里的值，不能直接往上传 v 到 attrs.value
          // 因为当名单切换时，父元素会修改 attrs.value
          // 如果这里上传了 v，attrs.value 的修改就会同步到 store 里
          // 导致每次增量更新都会触发 store 的持久化，以及名单数据覆盖问题
        }
      />
    )
  },
}) as typeof NDynamicInput
