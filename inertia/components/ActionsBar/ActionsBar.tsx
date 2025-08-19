import { Flex } from "@radix-ui/themes";
import AddAccount from "~/components/AddAccount/addAccount";
import {createAccount} from "~/services/account_service";
import {BankAccountDTO} from "#models/bank_account";

type ActionBarProps = {
  updateAccounts: (account: BankAccountDTO[]) => void;
}

export default function ActionsBar({updateAccounts}: ActionBarProps) {
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
 return (
   <Flex>
     <AddAccount onSubmit={addAccount} />
   </Flex>
 )
}
