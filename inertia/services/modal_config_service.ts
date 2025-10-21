import { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'
import { CreateTransactionDTO } from '#models/transaction'
import { BucketDTO } from '#models/bucket'

// export function createSpendConfig(
//   cb: any,
//   buckets: BucketDTO[],
//   bucketId?: string
// ): FormModalProps<CreateTransactionDTO> {
//   const b = buckets.find((bucket) => bucket.id === Number(bucketId))
//   return {
//     actionLabel: 'Spend Funds',
//     title: 'Spend',
//     description: `Enter the amount you want to spend from ${b?.name || 'your bucket'}`,
//     submitButtonLabel: 'Spend',
//     onSubmit: cb,
//     formElements: [
//       {
//         name: 'amount',
//         label: 'Amount',
//         type: 'number',
//       },
//       {
//         name: 'bucketId',
//         type: 'hidden',
//         value: bucketId,
//       },
//     ],
//   }
// }

export function createAllocationConfig(
  cb: any,
  buckets: BucketDTO[],
  bucketId?: string
): FormModalProps<CreateTransactionDTO> {
  return {
    actionLabel: 'Allocate Funds',
    title: 'Allocate Funds',
    description: 'Select a bucket and allocate some of your hard-earned cash towards your goals',
    submitButtonLabel: 'Allocate',
    onSubmit: cb,
    formElements: [
      {
        name: 'bucketId',
        label: 'Bucket',
        type: 'select',
        value: bucketId,
        disabled: !!bucketId,
        options: buckets.map((bucket) => ({ label: bucket.name, value: `${bucket.id}` })),
      },
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        step: '0.01',
      },
    ],
  }
}
