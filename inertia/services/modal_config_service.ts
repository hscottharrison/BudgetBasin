import { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'
import { CreateAllocationDTO } from '#models/allocation'
import { BucketDTO } from '#models/bucket'

export function createAllocationConfig(
  cb: any,
  buckets: BucketDTO[],
  bucketId?: string
): FormModalProps<CreateAllocationDTO> {
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
