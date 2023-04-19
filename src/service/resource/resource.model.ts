import type { Location } from '../map/map.model'

// export enum HelpResourceStatus {
//   PENDING,
//   FULFILL,
//   CANCELED,
//   ONGOING,
// }
export enum HelpResourceStatus {
  UNUSED = 0, // 0: 无人使用
  PENDING = 1, // 1: 接受、未开始
  FULFILL = 2, // 2: 接受、完成
  CANCELED = 3, // 3: 接受、取消
  ONGOING = 4, // 4: 接受、进行中
  DELETE = 5, // 5: 删除
}

// export const helpResourceStatus: HelpResourceStatus = {
//   UNUSED: 0, // 0: 无人使用
//   PENDING: 1, // 1: 接受、未开始
//   FULFILL: 2, // 2: 接受、完成
//   CANCELED: 3, // 3: 接受、取消
//   ONGOING: 4, // 4: 接受、进行中
//   DELETE: 5, // 5: 删除
// }

export type CreateHelpResourceParams = Omit<
  HelpResourceModel,
  'id' |
  'status'
>

export interface HelpResourceModel extends Location {
  id: number
  userId: number
  name: string
  describe: string
  subArea: string
  tag: string
  start_date: string
  end_date: string
  status: HelpResourceStatus
}
