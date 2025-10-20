import { Box, Grid } from "@radix-ui/themes";
import { UserHomeProvider } from '../../context/UserHomeContext';

import TotalBalance from "~/components/TotalBalance/totalBalance";
import {UserHomeDTO} from "#models/user_home_dto";
import ActionsBar from "~/components/ActionsBar/ActionsBar";
import AccountsTable from "~/components/AccountsTable/accountsTable";
import BucketsList from "~/components/BucketsList/BucketsList";

export default function UserHome ({userBuckets, userAccounts}: UserHomeDTO) {
  return (
    <UserHomeProvider userBuckets={userBuckets} userAccounts={userAccounts}>
      <UserHomePage />
    </UserHomeProvider>
  )
}

function UserHomePage() {

  return (
    <Box
      style={{
        width: '100%',
        maxWidth: 1120,
        marginInline: "auto",
        padding: "2rem 1rem",
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, marginTop: '1rem', gap: '1rem' }}>
        <Grid columns={{ sm: "1", lg: "2" }}>
          <TotalBalance />
        </Grid>

        <Box style={{ flex: '0 0 auto', minHeight: '0' }}>
          <ActionsBar />
        </Box>

        <AccountsTable />

        <Box style={{ flex: 1, minHeight: 0 }}>
          <BucketsList />
        </Box>
      </Box>
    </Box>
  )
}
