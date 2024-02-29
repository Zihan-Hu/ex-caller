import { z } from 'zod'

export const UserConfigSchema = z.object({
  /** 待点名单名称。 */
  group: z.string().default('名单 1'),
  /** 开始点名后，每个待点选项停留的时间。 */
  interval: z.number().default(100),
  /** 界面设置。 */
  ui: z.object({
    /** 抽取完成后是否显示彩带效果。 */
    confetti: z.boolean().default(true),
    /** 是否显示首屏动画。 */
    firstScreenAnimation: z.boolean().default(true),
    /** 设置按钮位置。 */
    settingsButton: z.enum(['top-right', 'center']).default('top-right'),
  }).default({}),
  /** 计划设置。 */
  plan: z.object({
    /** 是否启用计划队列。 */
    enabled: z.boolean().default(false),
    /** 计划队列。 */
    queue: z.array(z.string()).default([]),
  }).default({}),
})

/** 用户配置。 */
export type UserConfig = z.infer<typeof UserConfigSchema>

export const MAX_GROUP_NAME_LENGTH = 50
export const MAX_GROUP_COUNT = 100
export const MAX_GROUP_MEMBER_COUNT = 10000
export const MAX_GROUP_MEMBER_LENGTH = 100
export const MAX_INTERVAL = 1000
export const MIN_INTERVAL = 20
export const MAX_PLAN_QUEUE_SIZE = 10000

export const DEFAULT_GROUP_OPTIONS: RollCallOption[] = ['鸠', 'Gino', 'Carl', 'Dlyro', 'Fuli', '久住', '尊师古卢', 'Sultan', 'Igallta', '弭儿']
