import {Button, Heading} from "@radix-ui/themes";
import {InferPageProps} from "@adonisjs/inertia/types";
import ViewsController from "#controllers/views_controller";

import { Logout } from "~/services/auth_service"

export default function UserHome({ user }: InferPageProps<ViewsController, 'userHome'>) {
  return (
    <>
      <Button onClick={Logout}>Logout</Button>
      <Heading as='h1'>Welcome, {user.firstName} {user.lastName}!</Heading>
    </>
  )
}
