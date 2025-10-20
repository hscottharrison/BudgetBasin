import {Flex, ScrollArea} from "@radix-ui/themes";

import AddAccount from "~/components/AddAccount/addAccount";
import FormModal, {FormModalProps} from "~/components/CommonComponents/FormModal/formModal";

import {createBucket} from "~/services/bucket_service";
import {createAllocation} from "~/services/allocation_service";
import {createAccount} from "~/services/account_service";

import {BankAccountDTO} from "#models/bank_account";
import {BucketDTO, CreateBucketDTO} from "#models/bucket";
import {AllocationDTO, CreateAllocationDTO} from "#models/allocation";
import {createAllocationConfig} from "~/services/modal_config_service";
import {useUserHome} from "~/context/UserHomeContext";

export default function ActionsBar() {

  const {updateAccounts, addBucket, updateAllocationsForBucket, buckets} = useUserHome();
 return (
   <ScrollArea type='auto' scrollbars='horizontal' style={{ width: '100%', paddingBottom: '1rem' }}>
     <Flex gap='2'>
       <AddAccount onSubmit={addAccount} />
       <FormModal<CreateBucketDTO> {...getCreateBucketConfig()} />
       <FormModal<CreateAllocationDTO> {...createAllocationConfig(addAllocation, buckets)} />
     </Flex>
   </ScrollArea>
 )
  async function addAccount(e: React.FormEvent) {
    e.preventDefault();

    const accountName = document.getElementById("accountName") as HTMLInputElement;
    const accountDescription = document.getElementById("accountDescription") as HTMLInputElement;
    const initialBalance = document.getElementById("initialBalance") as HTMLInputElement;

    const payload = {
      accountName: accountName.value,
      accountDescription: accountDescription.value,
      initialBalance: initialBalance.value,
    }
    const response: BankAccountDTO[] = await createAccount(payload);
    updateAccounts(response);
  }

  async function add(payload: CreateBucketDTO) {
    const response: BucketDTO = await createBucket(payload)
    addBucket(response)
  }

  async function addAllocation(payload: CreateAllocationDTO) {
    const response: AllocationDTO = await createAllocation(payload)
    updateAllocationsForBucket(response)
  }

  function getCreateBucketConfig(): FormModalProps<CreateBucketDTO> {
    return {
      actionLabel: 'Add Bucket',
      title: 'Create New Bucket',
      description: 'Create a new bucket or savings goal to allocate your funds',
      submitButtonLabel: 'Create',
      onSubmit: add,
      formElements: [
        {
          name: 'name',
          label: 'Bucket Name',
        },
        {
          name: 'description',
          label: 'Bucket Description',
        },
        {
          name: 'goalAmount',
          label: 'Goal Amount',
          type: 'number',
          step: '0.01'
        }
      ]
    }
  }
}
