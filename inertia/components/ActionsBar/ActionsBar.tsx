import { Flex } from "@radix-ui/themes";
import AddAccount from "~/components/AddAccount/addAccount";
import {createAccount} from "~/services/account_service";
import {BankAccountDTO} from "#models/bank_account";
import FormModal, {FormModalProps} from "~/components/CommonComponents/FormModal/formModal";
import {BucketDTO, CreateBucketDTO} from "#models/bucket";
import {createBucket} from "~/services/bucket_service";

type ActionBarProps = {
  updateAccounts: (account: BankAccountDTO[]) => void;
  updateBuckets: (buckets: BucketDTO[]) => void;
}

export default function ActionsBar({updateAccounts}: ActionBarProps) {
 return (
   <Flex gap='2'>
     <AddAccount onSubmit={addAccount} />
     <FormModal<CreateBucketDTO> {...getCreateBucketConfig()} />
   </Flex>
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

  async function addBucket(payload: CreateBucketDTO) {
    const response: BucketDTO = await createBucket(payload)
    console.log(response)
  }

  function getCreateBucketConfig(): FormModalProps<CreateBucketDTO> {
    return {
      actionLabel: 'Add Bucket',
      title: 'Create New Bucket',
      description: 'Create a new bucket or savings goal to allocate your funds',
      submitButtonLabel: 'Create',
      onSubmit: addBucket,
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
          type: 'number'
        }
      ]
    }
  }
}
